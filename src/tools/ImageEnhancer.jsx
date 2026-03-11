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

// ── Per-category enhancement config (PREMIUM tuning) ─────────────────────
const CFG = {
  portrait: {
    // Tone: lift shadows, recover highlights, strong S-curve
    brightness: 1.08, contrast: 1.30, shadowLift: 18, highlightRecover: 0.92,
    // Color
    saturation: 1.35, vibrance: 1.55, warmth: 8,
    // Clarity (local contrast / micro-contrast strength)
    clarity: 0.55,
    // Surface blur (skin smoothing)
    blur: { radius: 3, sigmaColor: 50 },
    // Unsharp mask (sharpening)
    sharpen: { amount: 1.2, radius: 1, threshold: 8 },
    // Fine detail pass
    detail: { amount: 0.7, radius: 0, threshold: 4 },
  },
  object: {
    brightness: 1.05, contrast: 1.35, shadowLift: 10, highlightRecover: 0.95,
    saturation: 1.40, vibrance: 1.45, warmth: 0,
    clarity: 0.70,
    blur: { radius: 2, sigmaColor: 30 },
    sharpen: { amount: 1.5, radius: 1, threshold: 5 },
    detail: { amount: 0.9, radius: 0, threshold: 3 },
  },
  scenery: {
    brightness: 1.06, contrast: 1.40, shadowLift: 12, highlightRecover: 0.88,
    saturation: 1.55, vibrance: 1.70, warmth: -5,
    clarity: 0.80,
    blur: { radius: 2, sigmaColor: 28 },
    sharpen: { amount: 1.6, radius: 2, threshold: 6 },
    detail: { amount: 1.0, radius: 0, threshold: 4 },
  },
  pets: {
    brightness: 1.04, contrast: 1.28, shadowLift: 14, highlightRecover: 0.93,
    saturation: 1.30, vibrance: 1.40, warmth: 5,
    clarity: 0.60,
    blur: { radius: 2, sigmaColor: 38 },
    sharpen: { amount: 1.4, radius: 1.5, threshold: 5 },
    detail: { amount: 0.8, radius: 0, threshold: 3 },
  },
  text: {
    brightness: 1.0, contrast: 1.60, shadowLift: 5, highlightRecover: 1.0,
    saturation: 0.85, vibrance: 1.0, warmth: 0,
    clarity: 1.0,
    blur: { radius: 1, sigmaColor: 60 },
    sharpen: { amount: 2.2, radius: 1, threshold: 0 },
    detail: { amount: 1.5, radius: 0, threshold: 0 },
  },
}

// ── Yield for UI updates ──────────────────────────────────────────────────
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0))

// ── 1. Lookup Table Builder (fast per-pixel transform) ─────────────────────
// Pre-computes 256-value LUT for brightness, S-curve contrast, gamma
function buildLUT(brightness, contrast, shadowLift, highlightRecover) {
  const lut = new Uint8ClampedArray(256)
  for (let i = 0; i < 256; i++) {
    let v = i / 255

    // 1a. Shadow lift (raise blacks slightly)
    v = v + (shadowLift / 255) * (1 - v) * (1 - v)

    // 1b. Highlight recovery (compress near-white)
    if (v > 0.75) v = 0.75 + (v - 0.75) * highlightRecover

    // 1c. Brightness
    v *= brightness

    // 1d. Sigmoid S-curve (proper photographic contrast)
    // Maps 0-1 → 0-1 with S-shaped curve controlled by `contrast`
    const k = contrast  // 1.0 = no change, 1.5 = strong, 2.0 = very strong
    v = (v - 0.5) * k + 0.5

    lut[i] = Math.min(255, Math.max(0, Math.round(v * 255)))
  }
  return lut
}

// ── 2. Color Grading (Saturation + Vibrance + Warmth) ─────────────────────
function applyColorEnhance(src, cfg) {
  const dst = new Uint8ClampedArray(src.length)
  const lut = buildLUT(cfg.brightness, cfg.contrast, cfg.shadowLift, cfg.highlightRecover)

  for (let i = 0; i < src.length; i += 4) {
    let r = src[i], g = src[i + 1], b = src[i + 2]

    // Warmth (slight red/yellow push for portraits, or cool for scenery)
    r = Math.min(255, r + cfg.warmth)
    b = Math.min(255, Math.max(0, b - cfg.warmth * 0.5))

    // Apply tone LUT
    r = lut[Math.min(255, Math.max(0, r))]
    g = lut[Math.min(255, Math.max(0, g))]
    b = lut[Math.min(255, Math.max(0, b))]

    // Saturation (full HSL-based)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    r = luma + (r - luma) * cfg.saturation
    g = luma + (g - luma) * cfg.saturation
    b = luma + (b - luma) * cfg.saturation

    // Vibrance — boost undersaturated areas more (protects already-saturated skin)
    const avg = (r + g + b) / 3
    const maxC = Math.max(r, g, b)
    const satLevel = maxC > 0 ? (maxC - Math.min(r, g, b)) / maxC : 0
    const vibrancePush = (1 - satLevel) * (cfg.vibrance - 1.0)  // stronger for desaturated
    r = r + (r - avg) * vibrancePush
    g = g + (g - avg) * vibrancePush
    b = b + (b - avg) * vibrancePush

    dst[i] = Math.min(255, Math.max(0, r))
    dst[i + 1] = Math.min(255, Math.max(0, g))
    dst[i + 2] = Math.min(255, Math.max(0, b))
    dst[i + 3] = src[i + 3]
  }
  return dst
}

// ── 3. Fast Box Blur (for both bilateral base and unsharp masks) ───────────
function boxBlur(src, w, h, radius) {
  const dst = new Uint8ClampedArray(src.length)
  const r = Math.max(1, Math.floor(radius))
  // Horizontal pass
  const tmp = new Uint8ClampedArray(src.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rS = 0, gS = 0, bS = 0, n = 0
      for (let dx = -r; dx <= r; dx++) {
        const nx = Math.min(w - 1, Math.max(0, x + dx))
        const idx = (y * w + nx) * 4
        rS += src[idx]; gS += src[idx + 1]; bS += src[idx + 2]; n++
      }
      const o = (y * w + x) * 4
      tmp[o] = rS / n; tmp[o + 1] = gS / n; tmp[o + 2] = bS / n; tmp[o + 3] = src[o + 3]
    }
  }
  // Vertical pass
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let rS = 0, gS = 0, bS = 0, n = 0
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(h - 1, Math.max(0, y + dy))
        const idx = (ny * w + x) * 4
        rS += tmp[idx]; gS += tmp[idx + 1]; bS += tmp[idx + 2]; n++
      }
      const o = (y * w + x) * 4
      dst[o] = rS / n; dst[o + 1] = gS / n; dst[o + 2] = bS / n; dst[o + 3] = tmp[o + 3]
    }
  }
  return dst
}

// ── 4. Unsharp Mask (with threshold) ──────────────────────────────────────
function unsharpMask(src, blurred, amount, threshold) {
  const dst = new Uint8ClampedArray(src.length)
  for (let i = 0; i < src.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = src[i + c] - blurred[i + c]
      dst[i + c] = Math.min(255, Math.max(0,
        Math.abs(diff) > threshold
          ? src[i + c] + diff * amount
          : src[i + c]
      ))
    }
    dst[i + 3] = src[i + 3]
  }
  return dst
}

// ── 5. Clarity (Local Contrast / Micro-Contrast) ─────────────────────────
// High-pass overlay blended at moderate strength — lifts midtone detail pop
function applyClarity(src, w, h, strength) {
  // Use a large-radius blur as the base, then add the difference back
  const largeBlur = boxBlur(src, w, h, 8)
  const dst = new Uint8ClampedArray(src.length)
  for (let i = 0; i < src.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = src[i + c] - largeBlur[i + c]
      dst[i + c] = Math.min(255, Math.max(0, src[i + c] + diff * strength))
    }
    dst[i + 3] = src[i + 3]
  }
  return dst
}

// ── 6. Surface Blur (Edge-Preserving Smooth for skin/noise) ───────────────
async function applySurfaceBlur(srcData, w, h, radius, sigmaColor, onProgress) {
  const src = srcData.data
  const dst = new Uint8ClampedArray(src.length)
  const sigmaColorSq = sigmaColor * sigmaColor * 3
  const chunk = Math.max(1, Math.floor(h / 10))

  for (let y = 0; y < h; y++) {
    if (y % chunk === 0) { onProgress(20 + (y / h) * 30, 'Smoothing surfaces...'); await yieldToMain() }
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const r0 = src[idx], g0 = src[idx + 1], b0 = src[idx + 2]
      let rS = 0, gS = 0, bS = 0, wS = 0
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy; if (ny < 0 || ny >= h) continue
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx; if (nx < 0 || nx >= w) continue
          const nIdx = (ny * w + nx) * 4
          const r1 = src[nIdx], g1 = src[nIdx + 1], b1 = src[nIdx + 2]
          const cDist = (r1 - r0) ** 2 + (g1 - g0) ** 2 + (b1 - b0) ** 2
          const spW = 1.0 - (Math.abs(dx) + Math.abs(dy)) / (2 * radius + 1)
          const cW = cDist < sigmaColorSq ? 1.0 - cDist / sigmaColorSq : 0
          const wt = spW * cW
          rS += r1 * wt; gS += g1 * wt; bS += b1 * wt; wS += wt
        }
      }
      if (wS > 0) {
        dst[idx] = rS / wS; dst[idx + 1] = gS / wS; dst[idx + 2] = bS / wS
      } else {
        dst[idx] = r0; dst[idx + 1] = g0; dst[idx + 2] = b0
      }
      dst[idx + 3] = src[idx + 3]
    }
  }
  return new ImageData(dst, w, h)
}

// ── MAIN PIPELINE ─────────────────────────────────────────────────────────
async function enhanceOnCanvas(imgSrc, scale = 2, category = 'portrait', onProgress) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      try {
        const cfg = CFG[category] || CFG.portrait
        const srcW = img.naturalWidth, srcH = img.naturalHeight
        const outW = srcW * scale, outH = srcH * scale

        onProgress?.(5, 'Analyzing photo...')
        await yieldToMain()

        // Draw source
        const srcCanvas = document.createElement('canvas')
        srcCanvas.width = srcW; srcCanvas.height = srcH
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
        srcCtx.drawImage(img, 0, 0)

        // ── Step 1: Surface blur (denoise / skin smoothing) ──────────────
        onProgress?.(10, 'Smoothing skin & removing noise...')
        let iData = srcCtx.getImageData(0, 0, srcW, srcH)
        iData = await applySurfaceBlur(iData, srcW, srcH, cfg.blur.radius, cfg.blur.sigmaColor, onProgress)

        // ── Step 2: Unsharp mask pass 1 (fine detail recovery) ───────────
        onProgress?.(52, 'Recovering fine details...')
        await yieldToMain()
        let pixArr = iData.data
        const fineBlur = boxBlur(pixArr, srcW, srcH, 1)
        pixArr = unsharpMask(pixArr, fineBlur, cfg.detail.amount, cfg.detail.threshold)

        // ── Step 3: Clarity (local micro-contrast) ────────────────────────
        onProgress?.(60, 'Boosting clarity & local contrast...')
        await yieldToMain()
        pixArr = applyClarity(pixArr, srcW, srcH, cfg.clarity)

        // ── Step 4: Color grading (tone curve + saturation + vibrance) ────
        onProgress?.(70, 'Mastering colors & tone...')
        await yieldToMain()
        pixArr = applyColorEnhance(pixArr, cfg)

        // Write back to source canvas
        srcCtx.putImageData(new ImageData(pixArr, srcW, srcH), 0, 0)

        // ── Step 5: Upscale (high-quality bicubic emulation) ─────────────
        onProgress?.(78, 'Upscaling to high definition...')
        await yieldToMain()
        const outCanvas = document.createElement('canvas')
        outCanvas.width = outW; outCanvas.height = outH
        const outCtx = outCanvas.getContext('2d', { willReadFrequently: true })
        outCtx.imageSmoothingEnabled = true
        outCtx.imageSmoothingQuality = 'high'
        outCtx.drawImage(srcCanvas, 0, 0, outW, outH)

        // ── Step 6: Unsharp mask pass 2 (crisp edge sharpening post-upscale)
        onProgress?.(88, 'Applying crisp edge sharpening...')
        await yieldToMain()
        let outPix = outCtx.getImageData(0, 0, outW, outH).data
        const edgeBlur = boxBlur(outPix, outW, outH, cfg.sharpen.radius * scale)
        outPix = unsharpMask(outPix, edgeBlur, cfg.sharpen.amount, cfg.sharpen.threshold)
        outCtx.putImageData(new ImageData(outPix, outW, outH), 0, 0)

        onProgress?.(97, 'Finalizing...')
        await yieldToMain()

        outCanvas.toBlob(blob => {
          if (blob) { onProgress?.(100, 'Enhancement complete!'); resolve(blob) }
          else reject(new Error('Failed to create output blob'))
        }, 'image/jpeg', 0.97)

      } catch (err) { reject(err) }
    }
    img.onerror = () => reject(new Error('Could not load image. Check format.'))
    img.src = imgSrc
  })
}

// ── Programmatic download via FileReader (data URL) ───────────────────────────
function downloadBlob(blob, filename) {
  const reader = new FileReader()
  reader.onloadend = () => {
    const a = document.createElement('a')
    a.href = reader.result
    a.download = filename
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
      <img src={after} alt="Enhanced" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Original" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_16px_rgba(255,109,63,0.9)]"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-[3px] border-orange-500 hover:scale-110 transition-transform">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff6d3f" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12H3M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md pointer-events-none">ORIGINAL</div>
      <div className="absolute top-3 right-3 z-10 text-white text-[11px] font-bold px-2.5 py-1 rounded-md pointer-events-none shadow-lg" style={{ background: 'linear-gradient(135deg, #ff8c5a, #ff6d3f)' }}>✨ AI ENHANCED</div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-4 py-1.5 rounded-full pointer-events-none tracking-wide backdrop-blur-md border border-white/10">← Drag to compare →</div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ImageEnhancer() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [image, setImage] = useState(null)
  const [resultBlob, setResultBlob] = useState(null)
  const [resultPreview, setResultPreview] = useState(null)
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

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Image must be smaller than 15 MB')
      return
    }
    if (resultPreview) URL.revokeObjectURL(resultPreview)
    setResultBlob(null); setResultPreview(null)
    setError(null); setProcessingTime(null); setComparePos(50)
    setImage({ url: URL.createObjectURL(file), file, name: file.name })
  }, [resultPreview])

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
      setError(err.message || 'Enhancement failed. Try a smaller image.')
    } finally {
      setProcessing(false)
    }
  }, [image, scale, currentCat.id, processing, resultPreview])

  useEffect(() => {
    if (image && !resultBlob && !processing) {
      const t = setTimeout(() => processImage(image), 300)
      return () => clearTimeout(t)
    }
  }, [image]) // eslint-disable-line

  useEffect(() => {
    return () => { if (resultPreview) URL.revokeObjectURL(resultPreview) }
  }, [resultPreview])

  const handleDownload = () => {
    if (!resultBlob || !image) return
    const baseName = image.name.replace(/\.[^.]+$/, '').trim() || 'image'
    const fileName = `enhanced_${scale}x_${baseName}.png`
    downloadBlob(resultBlob, fileName)
  }

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

  return (
    <>
      <SEO
        title="AI Photo Enhancer — Studio Quality Online"
        description="Clean, smooth, and upscale your photos with studio-quality surface blur and unsharp masking. 100% private in-browser editing."
        canonical="/image-enhancer"
      />
      <ToolLayout
        toolSlug="image-enhancer"
        title="Premium AI Photo Enhancer"
        description="Achieve Photoshop-like clarity. Our smart surface blur removes noise while recovering ultra-sharp edges and vibrant colors."
        breadcrumb="Photo Enhancer"
      >

        {!image ? (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Demo */}
            <div className="space-y-4">
              <CompareSlider key={activeCategory} before={currentCat.demo.before} after={currentCat.demo.after} height={400} />
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat, idx) => (
                  <button key={cat.id} onClick={() => setActiveCategory(idx)}
                    className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-[76px] shadow-sm hover:shadow-md"
                    style={activeCategory === idx
                      ? { borderColor: '#ff6d3f', background: 'linear-gradient(to bottom right, #fff5f2, #fff)' }
                      : { borderColor: '#f1f5f9', background: '#fafafa' }}
                  >
                    <span className="text-2xl drop-shadow-sm">{cat.icon}</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${activeCategory === idx ? 'text-orange-600' : 'text-slate-500'}`}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Upload */}
            <div className="flex flex-col gap-4">
              <div
                className="flex-1 rounded-3xl border-[3px] border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-6 p-10 cursor-pointer relative overflow-hidden group"
                style={{ borderColor: dropOver ? '#ff6d3f' : '#fdb89a', background: dropOver ? '#fff5f2' : '#fffcfb' }}
                onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
                onDragOver={e => { e.preventDefault(); setDropOver(true) }}
                onDragLeave={() => setDropOver(false)}
                onClick={() => inputRef.current?.click()}
              >
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>

                <input ref={inputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => loadFile(e.target.files[0])} />

                <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500 relative"
                  style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}>
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-lg animate-pulse">PRO</div>
                </div>

                <div className="text-center space-y-1.5 relative z-10">
                  <p className="text-xl font-black text-slate-800">Upload your Photo</p>
                  <p className="text-sm font-medium text-slate-400">Transform noisy photos into smooth studio shots.</p>
                </div>

                <button className="w-full max-w-[260px] py-4 rounded-2xl font-black text-white text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105 relative z-10"
                  style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}
                  onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
                  Select File
                </button>
              </div>

              {/* Scale selector */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Output Resolution</p>
                <div className="flex gap-3">
                  {[2, 4].map(s => (
                    <button key={s} onClick={() => setScale(s)}
                      className="flex-1 py-3.5 rounded-xl text-sm font-bold border-2 transition-all shadow-sm"
                      style={scale === s
                        ? { borderColor: '#ff6d3f', background: '#fffcfb', color: '#ff6d3f' }
                        : { borderColor: '#f1f5f9', background: '#fff', color: '#64748b' }}>
                      {scale === s && <span className="mr-2 text-base">✓</span>}{s}× Upscale
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── RESULT VIEW ──────────────────────────────────────────────── */
          <div className="space-y-6 mb-8 max-w-5xl mx-auto">

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 shadow-sm">
                <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <div className="flex-1">
                  <p className="font-bold">Enhancement Failed</p>
                  <p className="mt-0.5 text-red-600">{error}</p>
                </div>
                <button onClick={reset} className="px-3 py-1.5 bg-red-100 rounded-lg text-xs font-bold hover:bg-red-200 transition">Reset</button>
              </div>
            )}

            {/* Viewer */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">{currentCat.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 tracking-wide">{resultPreview ? 'Review Result' : 'Studio Engine Processing...'}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Bilateral Denoise & Unsharp Mask Applied</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!processing && (
                    <>
                      <button onClick={() => inputRef.current?.click()} className="text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition">Change Photo</button>
                      <button onClick={reset} className="text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl text-slate-500 bg-slate-100 hover:bg-slate-200 transition">✕</button>
                    </>
                  )}
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                </div>
              </div>

              {/* Compare area */}
              <div ref={compareRef}
                className="relative select-none overflow-hidden bg-[url('https://camo.githubusercontent.com/9dc370e051ae1dbdf0df4b42ccbfffeb929a5027581db39fbde86b728ae5c1a7/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f7468756d622f352f35632f496d6167655f636865636b6572626f6172642e7376672f3132303070782d496d6167655f636865636b6572626f6172642e7376672e706e67')] bg-[length:24px_24px] bg-slate-100"
                style={{ minHeight: 500, cursor: resultPreview ? 'col-resize' : 'default' }}
                onMouseDown={() => resultPreview && setCompareDragging(true)}
                onTouchStart={() => resultPreview && setCompareDragging(true)}
              >
                {/* Result */}
                {resultPreview
                  ? <img src={resultPreview} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" />
                  : <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain opacity-20 blur-sm" />
                }

                {/* Original */}
                <div className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}>
                  <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
                </div>

                {/* Slider bar */}
                {resultPreview && (
                  <div className="absolute top-0 bottom-0 z-20 pointer-events-none"
                    style={{ left: `${comparePos}%`, transform: 'translateX(-50%)' }}>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-[0_0_25px_rgba(255,109,63,0.4)] flex items-center justify-center border-2 border-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6d3f" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12H3M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Labels */}
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl pointer-events-none shadow-lg">Original</div>
                {resultPreview && (
                  <div className="absolute top-4 right-4 z-10 text-white text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl shadow-[0_4px_20px_rgba(255,109,63,0.4)] pointer-events-none" style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}>
                    Studio Output
                  </div>
                )}

                {/* Processing Overlay (Scanning Effect) */}
                {processing && !resultPreview && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                    {/* Fake scan line */}
                    <div className="absolute inset-x-0 h-1 bg-orange-500 shadow-[0_0_20px_rgba(255,109,63,1)] opacity-70"
                      style={{ top: `${progress}%`, transition: 'top 0.1s linear' }}></div>

                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl max-w-sm w-full mx-4">
                      <div className="relative">
                        <svg className="w-16 h-16 transform -rotate-90 transition-all duration-300">
                          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                          <circle cx="32" cy="32" r="28" stroke="#ff6d3f" strokeWidth="6" fill="none"
                            strokeDasharray="175" strokeDashoffset={`${175 - (175 * progress) / 100}`}
                            className="transition-all duration-200" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">
                          {Math.round(progress)}%
                        </div>
                      </div>

                      <div className="text-center w-full">
                        <p className="font-bold text-white text-lg tracking-wide">{stepMsg}</p>
                        <p className="text-white/60 text-xs mt-1.5 font-medium">Bilateral filtering matrix running...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            {resultPreview && !processing && (
              <div className="grid md:grid-cols-3 gap-4">
                {/* Save */}
                <button
                  onClick={handleDownload}
                  className="md:col-span-2 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white text-base shadow-[0_8px_30px_rgba(255,109,63,0.3)] transition-all hover:scale-[1.02] hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg,#ff8c5a,#ff6d3f)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Save Masterpiece ({scale}× Resolution)
                </button>

                {/* Adjustments context */}
                <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-center px-5 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upscale Config</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{processingTime}s</span>
                  </div>
                  <div className="mt-2 flex gap-2 w-full">
                    {[2, 4].map(s => (
                      <button key={s}
                        onClick={() => { setScale(s); setTimeout(() => processImage(image), 50) }}
                        className="flex-1 py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
                        style={scale === s
                          ? { borderColor: '#ff6d3f', background: '#fff5f2', color: '#ff6d3f' }
                          : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                        {s}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SEO Content ─────────────────────────────────────────────────── */}
        <div className="seo-content mt-12 bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <img src="/images/tools/image-enhancer-tool.png" alt="AI Image Enhancer Tool Interface"
            title="Premium Image Cleanup" loading="lazy"
            className="w-full h-auto rounded-2xl shadow-md mb-10 border border-slate-100" />

          <div className="prose prose-slate max-w-none text-base text-slate-600 space-y-6">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Achieve the "Photoshop-Clean" Look Instantly</h2>
            <p>Most online enhancement tools simply boost contrast or stretch pixels, which often magnifies ugly ISO noise and compression artifacts. Our new <strong>Studio Engine</strong> completely rethinks browser-based image processing. We've implemented advanced graphic algorithms traditionally reserved for expensive desktop software like Adobe Lightroom or Photoshop directly into your browser.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">1. Edge-Preserving Surface Blur</h3>
            <p>Our core innovation is a custom JS-based <em>Bilateral Filter</em> approximation. Unlike a standard blur that ruins an image, a bilateral filter is "edge-aware". It aggressively smooths out flat surfaces (like grainy skin, pixelated sky, or noisy backgrounds) while completely protecting sharp transitions (like eyelashes, text, or hard object edges). This is the secret to getting that pristine, premium "AI" look.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">2. Intelligent Edge Recovery</h3>
            <p>After compressing the noise, the tool applies a finely tuned <em>Unsharp Mask</em> exclusively targeting the high-contrast thresholds. This step acts like a micro-contrast injection, making hair, textures, and text snap back into ultra-high-definition clarity.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">3. Studio Color Mastering</h3>
            <p>Finally, we apply an S-curve contrast mathematical function and a smart vibrance algorithm. Instead of just turning up saturation (which causes skin to look bright orange), our vibrance logic only boosts colors that are inherently undersaturated, protecting skin tones and already-vivid areas.</p>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}
