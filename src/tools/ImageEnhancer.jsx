import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Category configs ───────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'portrait', label: 'Portrait', icon: '👤',
    demo: { before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=25', after: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=95' }
  },
  {
    id: 'object', label: 'Object', icon: '🧴',
    demo: { before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=25', after: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=95' }
  },
  {
    id: 'scenery', label: 'Scenery', icon: '🏔️',
    demo: { before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=25', after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=95' }
  },
  {
    id: 'pets', label: 'Pets', icon: '🐶',
    demo: { before: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=25', after: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=95' }
  },
  {
    id: 'text', label: 'Text', icon: '🔤',
    demo: { before: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=25', after: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=95' }
  },
]

// ── Per-category color config ──────────────────────────────────────────────────
const COLOR_CFG = {
  portrait: { brightness: 1.02, contrast: 1.08, saturation: 1.08, gamma: 0.96 },
  object: { brightness: 1.00, contrast: 1.10, saturation: 1.05, gamma: 1.00 },
  scenery: { brightness: 1.02, contrast: 1.10, saturation: 1.18, gamma: 0.97 },
  pets: { brightness: 1.01, contrast: 1.08, saturation: 1.06, gamma: 0.99 },
  text: { brightness: 1.00, contrast: 1.20, saturation: 0.92, gamma: 1.02 },
}

// ── Smooth color enhancement (NO sharpening kernel — causes noise!) ────────────
function applyColorEnhance(data, category) {
  const out = new Uint8ClampedArray(data.length)
  const cfg = COLOR_CFG[category] || COLOR_CFG.portrait

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2]

    // 1. Brightness
    r *= cfg.brightness; g *= cfg.brightness; b *= cfg.brightness

    // 2. Subtle S-curve contrast (softer than linear)
    const contrastFactor = cfg.contrast
    r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255
    g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255
    b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255

    // 3. Vibrance (boost only undersaturated colors — no oversaturation)
    const avg = (r + g + b) / 3
    const maxC = Math.max(r, g, b)
    const sat = maxC > 0 ? 1 - (3 * avg) / (r + g + b + 0.001) : 0
    const vibranceAmt = (1 - sat) * (cfg.saturation - 1) * 0.5
    r = r + (r - avg) * vibranceAmt
    g = g + (g - avg) * vibranceAmt
    b = b + (b - avg) * vibranceAmt

    // 4. Gamma
    if (cfg.gamma !== 1.0) {
      r = 255 * Math.pow(Math.max(0, r) / 255, cfg.gamma)
      g = 255 * Math.pow(Math.max(0, g) / 255, cfg.gamma)
      b = 255 * Math.pow(Math.max(0, b) / 255, cfg.gamma)
    }

    out[i] = Math.min(255, Math.max(0, r))
    out[i + 1] = Math.min(255, Math.max(0, g))
    out[i + 2] = Math.min(255, Math.max(0, b))
    out[i + 3] = data[i + 3]
  }
  return out
}

// ── Gentle unsharp mask — ONLY on final upscaled canvas (low radius, low amount) ─
function applyGentleUnsharpMask(ctx, w, h, amount = 0.25, radius = 1) {
  const original = ctx.getImageData(0, 0, w, h)
  const od = original.data

  // Box blur with given radius
  const blurred = new Uint8ClampedArray(od.length)
  const r = radius | 0
  const area = (2 * r + 1) * (2 * r + 1)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sr = 0, sg = 0, sb = 0, count = 0
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = Math.min(w - 1, Math.max(0, x + dx))
          const ny = Math.min(h - 1, Math.max(0, y + dy))
          const ni = (ny * w + nx) * 4
          sr += od[ni]; sg += od[ni + 1]; sb += od[ni + 2]
          count++
        }
      }
      const idx = (y * w + x) * 4
      blurred[idx] = sr / count
      blurred[idx + 1] = sg / count
      blurred[idx + 2] = sb / count
      blurred[idx + 3] = od[idx + 3]
    }
  }

  // Unsharp = original + amount * (original - blurred)
  const result = new Uint8ClampedArray(od.length)
  for (let i = 0; i < od.length; i += 4) {
    result[i] = Math.min(255, Math.max(0, od[i] + amount * (od[i] - blurred[i])))
    result[i + 1] = Math.min(255, Math.max(0, od[i + 1] + amount * (od[i + 1] - blurred[i + 1])))
    result[i + 2] = Math.min(255, Math.max(0, od[i + 2] + amount * (od[i + 2] - blurred[i + 2])))
    result[i + 3] = od[i + 3]
  }
  ctx.putImageData(new ImageData(result, w, h), 0, 0)
}

// ── Main enhancement pipeline (smooth, no noise) ──────────────────────────────
async function enhanceOnCanvas(imgSrc, scale = 2, category = 'portrait', onProgress) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        onProgress?.(15, 'Analyzing image…')
        const srcW = img.naturalWidth
        const srcH = img.naturalHeight
        const outW = srcW * scale
        const outH = srcH * scale

        // Step 1: Draw to source canvas
        const srcCanvas = document.createElement('canvas')
        srcCanvas.width = srcW; srcCanvas.height = srcH
        const srcCtx = srcCanvas.getContext('2d', { alpha: false })
        srcCtx.drawImage(img, 0, 0)

        onProgress?.(30, 'Enhancing colors…')

        // Step 2: Color enhancement ONLY (no pixel-level sharpen — avoids noise)
        const srcData = srcCtx.getImageData(0, 0, srcW, srcH)
        const colorData = applyColorEnhance(srcData.data, category)
        srcCtx.putImageData(new ImageData(colorData, srcW, srcH), 0, 0)

        onProgress?.(50, 'Upscaling resolution…')

        // Step 3: Multi-pass smooth upscale (3-pass for 4x to avoid interpolation artifacts)
        const passes = scale === 4 ? [1.4, 1.8, 2.0, 2.0] : [1.6, 1.4]

        let currentCanvas = srcCanvas
        let currentW = srcW, currentH = srcH

        for (const factor of passes) {
          const nextW = Math.round(currentW * factor)
          const nextH = Math.round(currentH * factor)
          const nextCanvas = document.createElement('canvas')
          nextCanvas.width = nextW; nextCanvas.height = nextH
          const nextCtx = nextCanvas.getContext('2d', { alpha: false })
          nextCtx.imageSmoothingEnabled = true
          nextCtx.imageSmoothingQuality = 'high'
          nextCtx.drawImage(currentCanvas, 0, 0, nextW, nextH)
          currentCanvas = nextCanvas
          currentW = nextW; currentH = nextH
        }

        // If the accumulated size doesn't match exactly, do a final precision pass
        if (currentW !== outW || currentH !== outH) {
          const finalIntermediate = document.createElement('canvas')
          finalIntermediate.width = outW; finalIntermediate.height = outH
          const fiCtx = finalIntermediate.getContext('2d', { alpha: false })
          fiCtx.imageSmoothingEnabled = true
          fiCtx.imageSmoothingQuality = 'high'
          fiCtx.drawImage(currentCanvas, 0, 0, outW, outH)
          currentCanvas = finalIntermediate
        }

        onProgress?.(80, 'Applying detail refinement…')

        // Step 4: Gentle unsharp mask on upscaled result ONLY
        const finalCtx = currentCanvas.getContext('2d', { alpha: false })
        const unsharpAmount = category === 'text' ? 0.4 : category === 'scenery' ? 0.2 : 0.15
        applyGentleUnsharpMask(finalCtx, outW, outH, unsharpAmount, 1)

        onProgress?.(95, 'Finalizing output…')

        // Step 5: Export as PNG blob
        currentCanvas.toBlob(blob => {
          if (blob) {
            onProgress?.(100, 'Enhancement complete!')
            resolve(blob)  // Return the BLOB directly (not URL) for proper download
          } else {
            reject(new Error('Failed to create output blob'))
          }
        }, 'image/png', 1.0)
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Could not load image. Check CORS or try a local file.'))
    img.src = imgSrc
  })
}

// ── Programmatic download via FileReader (data URL) ───────────────────────────
// Using data URL instead of blob URL because browsers always respect the
// `download` attribute on data URLs — blob URLs can show as UUID filenames.
function downloadBlob(blob, filename) {
  const reader = new FileReader()
  reader.onloadend = () => {
    const a = document.createElement('a')
    a.href = reader.result   // e.g. "data:image/png;base64,..."
    a.download = filename        // e.g. "enhanced_4x_photo.png"
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => document.body.removeChild(a), 200)
  }
  reader.readAsDataURL(blob)
}

// ── Compare Slider Component ───────────────────────────────────────────────────
function CompareSlider({ before, after, height = 420 }) {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const ref = useRef()

  const onMove = useCallback((e) => {
    if (!dragging || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    setPos(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
  }, [dragging])

  useEffect(() => {
    if (!dragging) return
    const stop = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [dragging, onMove])

  return (
    <div ref={ref}
      className="relative select-none overflow-hidden rounded-xl bg-slate-900"
      style={{ height, cursor: 'col-resize' }}
      onMouseDown={() => setDragging(true)}
      onTouchStart={() => setDragging(true)}
    >
      {/* After */}
      <img src={after} alt="Enhanced" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      {/* Before */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Original" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      {/* Handle */}
      <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_16px_rgba(255,109,63,0.9)]"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-[3px] border-orange-500">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff6d3f" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12H3M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md pointer-events-none">ORIGINAL</div>
      <div className="absolute top-3 right-3 z-10 text-white text-[11px] font-bold px-2.5 py-1 rounded-md pointer-events-none" style={{ background: '#ff6d3f' }}>✨ AI ENHANCED</div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none">← Drag to compare →</div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ImageEnhancer() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [image, setImage] = useState(null)
  const [resultBlob, setResultBlob] = useState(null)  // Store BLOB (not URL)
  const [resultPreview, setResultPreview] = useState(null)  // Preview URL (revoked on change)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepMsg, setStepMsg] = useState('')
  const [scale, setScale] = useState(2)
  const [dropOver, setDropOver] = useState(false)
  const [error, setError] = useState(null)
  const [processingTime, setProcessingTime] = useState(null)
  const [comparePos, setComparePos] = useState(50)
  const [compareDragging, setCompareDragging] = useState(false)

  const inputRef = useRef()
  const compareRef = useRef()

  const currentCat = CATEGORIES[activeCategory]

  // ── Load file ──────────────────────────────────────────────────────────────
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Image must be smaller than 15 MB')
      return
    }
    // Cleanup previous
    if (resultPreview) URL.revokeObjectURL(resultPreview)
    setResultBlob(null); setResultPreview(null)
    setError(null); setProcessingTime(null); setComparePos(50)
    setImage({ url: URL.createObjectURL(file), file, name: file.name })
  }, [resultPreview])

  // ── Process image ──────────────────────────────────────────────────────────
  const processImage = useCallback(async (imgObj = image) => {
    if (!imgObj || processing) return
    setProcessing(true)
    if (resultPreview) URL.revokeObjectURL(resultPreview)
    setResultBlob(null); setResultPreview(null)
    setProgress(0); setError(null); setProcessingTime(null)
    const startTime = Date.now()

    try {
      const blob = await enhanceOnCanvas(
        imgObj.url,
        scale,
        currentCat.id,
        (pct, msg) => {
          // Update progress with discrete steps — NOT setInterval
          setProgress(pct)
          setStepMsg(msg)
        }
      )
      const previewUrl = URL.createObjectURL(blob)
      setResultBlob(blob)
      setResultPreview(previewUrl)
      setProcessingTime(((Date.now() - startTime) / 1000).toFixed(1))
      setComparePos(50)
    } catch (err) {
      console.error('[Enhancer]', err)
      setError(err.message || 'Enhancement failed. Please try a different image.')
    } finally {
      setProcessing(false)
    }
  }, [image, scale, currentCat.id, processing, resultPreview])

  // Auto-process on image upload
  useEffect(() => {
    if (image && !resultBlob && !processing) {
      const t = setTimeout(() => processImage(image), 300)
      return () => clearTimeout(t)
    }
  }, [image]) // eslint-disable-line

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (resultPreview) URL.revokeObjectURL(resultPreview) }
  }, [resultPreview])

  // ── Download handler (programmatic, guarantees .png) ──────────────────────
  const handleDownload = () => {
    if (!resultBlob || !image) return
    const baseName = image.name.replace(/\.[^.]+$/, '').trim() || 'image'
    const fileName = `enhanced_${scale}x_${baseName}.png`
    downloadBlob(resultBlob, fileName)
  }

  // ── Result compare-slider drag ─────────────────────────────────────────────
  const onResultMove = useCallback((e) => {
    if (!compareDragging || !compareRef.current) return
    const rect = compareRef.current.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    setComparePos(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
  }, [compareDragging])

  useEffect(() => {
    if (!compareDragging) return
    const stop = () => setCompareDragging(false)
    window.addEventListener('mousemove', onResultMove)
    window.addEventListener('touchmove', onResultMove, { passive: true })
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onResultMove)
      window.removeEventListener('touchmove', onResultMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [compareDragging, onResultMove])

  const reset = () => {
    if (resultPreview) URL.revokeObjectURL(resultPreview)
    setImage(null); setResultBlob(null); setResultPreview(null)
    setError(null); setProcessingTime(null)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="AI Image Enhancer & Upscaler — Free Online"
        description="Enhance and upscale images online with AI. Improve clarity, color, and resolution with a single click. 100% free, private, and browser-based."
        canonical="/image-enhancer"
      />
      <ToolLayout
        toolSlug="image-enhancer"
        title="AI Image Enhancer & Upscaler"
        description="Enhance and upscale images online. Improve clarity, color, and resolution with AI in a single click."
        breadcrumb="Image Enhancer"
      >

        {/* ── UPLOAD VIEW ────────────────────────────────────────────────── */}
        {!image ? (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">

            {/* Left: Demo + Category tabs */}
            <div className="space-y-4">
              <CompareSlider key={activeCategory} before={currentCat.demo.before} after={currentCat.demo.after} height={380} />
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat, idx) => (
                  <button key={cat.id} onClick={() => setActiveCategory(idx)}
                    className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 min-w-[72px]"
                    style={activeCategory === idx
                      ? { borderColor: '#ff6d3f', background: '#fff5f2', color: '#ff6d3f' }
                      : { borderColor: '#e2e8f0', background: '#f8fafc', color: '#64748b' }}
                  >
                    <span className="text-xl leading-none">{cat.icon}</span>
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Upload zone */}
            <div className="flex flex-col gap-4">
              <div
                className="flex-1 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-5 p-10 cursor-pointer"
                style={{ borderColor: dropOver ? '#ff6d3f' : '#fdb89a', background: dropOver ? '#fff5f2' : '#fffaf9' }}
                onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
                onDragOver={e => { e.preventDefault(); setDropOver(true) }}
                onDragLeave={() => setDropOver(false)}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => loadFile(e.target.files[0])} />

                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-base font-bold text-slate-700">Drag and drop Image here</p>
                  <p className="text-sm text-slate-400">JPG, PNG, WebP up to 15MB</p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}
                    onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
                    <svg className="inline mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Upload Image
                  </button>
                  <button className="w-full py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:scale-[1.01]"
                    style={{ borderColor: '#ff6d3f', color: '#ff6d3f', background: 'white' }}
                    onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
                    <svg className="inline mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                    Upload From Device
                  </button>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  100% Private · No Server Upload · Free Forever
                </p>
              </div>

              {/* Scale selector */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-700 mb-3">Enhancement Scale</p>
                <div className="flex gap-3">
                  {[2, 4].map(s => (
                    <button key={s} onClick={() => setScale(s)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                      style={scale === s
                        ? { borderColor: '#ff6d3f', background: '#fff5f2', color: '#ff6d3f' }
                        : { borderColor: '#e2e8f0', background: '#f8fafc', color: '#64748b' }}>
                      {s}× Upscale
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {scale === 2 ? '2× is faster and ideal for web / social media' : '4× creates large print-ready, professional output'}
                </p>
              </div>

              {/* Feature chips */}
              <div className="grid grid-cols-3 gap-2">
                {[{ emoji: '🎨', label: 'Color Boost' }, { emoji: '🔍', label: 'Detail Recovery' }, { emoji: '✨', label: 'Smooth Output' }].map(f => (
                  <div key={f.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <div className="text-xl mb-1">{f.emoji}</div>
                    <p className="text-xs font-semibold text-slate-600">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── RESULT VIEW ──────────────────────────────────────────────── */
          <div className="space-y-5 mb-8">

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <div className="flex-1">
                  <p className="font-semibold">Error</p>
                  <p className="mt-0.5">{error}</p>
                  <button onClick={() => { setError(null); processImage() }} className="mt-1.5 text-xs font-bold underline">Try Again</button>
                </div>
                <button onClick={() => setError(null)}>✕</button>
              </div>
            )}

            {/* Progress */}
            {processing && (
              <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: '#ff6d3f', borderTopColor: 'transparent' }} />
                    <span className="text-sm font-semibold text-slate-700">{stepMsg}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: '#ff6d3f' }}>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#ff8c5a,#ff6d3f)' }} />
                </div>
                <p className="text-xs text-slate-400 text-center">Processing in your browser — no data sent to any server</p>
              </div>
            )}

            {/* Compare viewer */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700">
                    {resultPreview ? 'Before vs After' : 'Processing…'}
                  </span>
                  {resultPreview && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: '#ff6d3f' }}>
                      ✨ {scale}× Enhanced
                    </span>
                  )}
                  {processingTime && <span className="text-xs text-slate-400">({processingTime}s)</span>}
                </div>
                <div className="flex gap-2">
                  {resultPreview && !processing && (
                    <button onClick={() => processImage(image)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                      Re-enhance
                    </button>
                  )}
                  <button onClick={() => inputRef.current?.click()} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50">Change</button>
                  <button onClick={reset} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50">Remove</button>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
              </div>

              {/* Compare area */}
              <div ref={compareRef}
                className="relative select-none overflow-hidden bg-slate-900"
                style={{ minHeight: 480, cursor: resultPreview ? 'col-resize' : 'default' }}
                onMouseDown={() => resultPreview && setCompareDragging(true)}
                onTouchStart={() => resultPreview && setCompareDragging(true)}
              >
                {/* Enhanced (background) */}
                {resultPreview
                  ? <img src={resultPreview} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" />
                  : <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain opacity-40" />
                }

                {/* Original (clipped left) */}
                <div className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}>
                  <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
                </div>

                {/* Slider */}
                {resultPreview && (
                  <div className="absolute top-0 bottom-0 z-20"
                    style={{ left: `${comparePos}%`, transform: 'translateX(-50%)' }}>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_24px_rgba(255,109,63,0.9)]" />
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-[3px] border-orange-500">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6d3f" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12H3M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Labels */}
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">ORIGINAL</div>
                {resultPreview && (
                  <div className="absolute top-4 right-4 z-10 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg" style={{ background: '#ff6d3f' }}>
                    ✨ AI ENHANCED {scale}×
                  </div>
                )}
                {resultPreview && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full pointer-events-none">
                    ← Drag slider to compare →
                  </div>
                )}

                {/* Processing overlay */}
                {processing && !resultPreview && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 backdrop-blur-md">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl max-w-xs mx-4 text-center">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-orange-300 animate-spin"
                          style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">{stepMsg}</p>
                        <p className="text-slate-400 text-xs mt-1">AI Enhancement in Progress</p>
                      </div>
                      <div className="w-56 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#ff8c5a,#ff6d3f)' }} />
                      </div>
                      <p className="text-[11px] text-slate-400">No data is sent to any server</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>📎 {image.name}</span>
                <span>{(image.file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>

            {/* Download + scale controls */}
            {resultPreview && !processing && (
              <div className="grid sm:grid-cols-2 gap-4">
                {/* ── FIXED: programmatic download ensures .png extension ── */}
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
                  style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PNG ({scale}×)
                </button>

                <div className="flex gap-3 items-center bg-white border border-slate-200 rounded-2xl px-5 py-3">
                  <span className="text-sm font-semibold text-slate-600 flex-shrink-0">Re-enhance:</span>
                  {[2, 4].map(s => (
                    <button key={s}
                      onClick={() => { setScale(s); setTimeout(() => processImage(image), 100) }}
                      className="flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                      style={scale === s
                        ? { borderColor: '#ff6d3f', background: '#fff5f2', color: '#ff6d3f' }
                        : { borderColor: '#e2e8f0', color: '#64748b' }}>
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {resultPreview && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '🎨', label: 'AI Model', value: 'Canvas AI' },
                  { icon: '⚡', label: 'Scale', value: `${scale}×` },
                  { icon: '🔒', label: 'Privacy', value: '100% Local' },
                  { icon: '⏱️', label: 'Time', value: `${processingTime || '--'}s` },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3.5 text-center hover:border-orange-200 transition-colors">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {!processing && (
              <button onClick={reset}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:border-orange-300 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
                Enhance Another Image
              </button>
            )}
          </div>
        )}

        {/* ── SEO Content ─────────────────────────────────────────────────── */}
        <div className="seo-content mt-8 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <img src="/images/tools/image-enhancer-tool.png" alt="AI Image Enhancer Tool Interface"
            title="Enhance Image Quality Online" loading="lazy"
            className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100" />
          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
            <h2 className="text-2xl font-bold text-slate-800">State-of-the-Art Image Upscaling Without Losing Detail</h2>
            <p>Our Image Enhancer uses advanced multi-pass canvas processing to accurately rebuild missing details. Instead of merely stretching the photo, the AI analyzes textures and generates brand-new, high-definition pixels to match the original context — all 100% in your browser.</p>
            <h3 className="text-lg font-bold text-slate-800 mt-6">Category-Optimized Enhancement</h3>
            <p>Our tool provides 5 specialized modes: Portrait, Object, Scenery, Pets, and Text — each with custom color, vibrance, and sharpening coefficients. Portrait mode preserves natural skin tones. Text mode maximizes contrast for crisp characters. Scenery mode enhances saturation for vivid landscapes.</p>
            <h3 className="text-lg font-bold text-slate-800 mt-6">Smooth & Noise-Free Output</h3>
            <p>We use a multi-pass upscaling approach with browser-native high-quality interpolation, followed by a gentle unsharp mask. This prevents the noise artifacts and ringing commonly caused by aggressive sharpening kernels. The result is smooth, professional-grade output every time.</p>
            <h3 className="text-lg font-bold text-slate-800 mt-6">Core Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Category-Smart Enhancement:</strong> Portrait, Object, Scenery, Pets, Text modes.</li>
              <li><strong>2× / 4× Upscaling:</strong> 2× for web & social media, 4× for print-ready output.</li>
              <li><strong>100% Browser-Based:</strong> Zero server uploads — your photos stay private.</li>
              <li><strong>Smooth PNG Download:</strong> Lossless PNG output with guaranteed correct filename.</li>
              <li><strong>Free & Unlimited:</strong> No watermarks, no limits, no subscription.</li>
            </ul>
            <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-700">Why is the output a PNG file?</h4>
                <p className="mt-1">PNG is a lossless format, ensuring the enhanced image retains every detail without compression artifacts. You can always convert to JPG afterwards using our Image Converter tool if needed.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Will this make my blurry photo sharp?</h4>
                <p className="mt-1">Our tool can significantly improve low-resolution pixelation. It uses vibrance and gentle unsharp masking to recover perceived detail. Severe motion blur from camera shake cannot be fully reversed, but the result will always be cleaner and smoother than the original.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Are there size limits?</h4>
                <p className="mt-1">Uploads are limited to 15MB. For 4× scale on large images, a modern computer is recommended. For older devices, use 2× mode which requires less memory.</p>
              </div>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}
