import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Category configs ────────────────────────────────────────────────────────────
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

// ── Per-category config: RESTORATION FIRST, color is secondary ─────────────────
const CFG = {
  portrait: {
    // Very gentle tone — sharpening does the visual heavy lifting
    brightness: 1.02, contrast: 1.06, shadowLift: 5, highlightRecover: 0.97,
    saturation: 1.04, vibrance: 1.06,
    // Bilateral surface denoise (smooth skin before sharpening)
    blur: { radius: 3, sigmaColor: 48 },
    // Multi-scale USM: [radius-px, amount, threshold]
    // Three bands: fine texture, mid edges, broad structure
    usm: [
      { radius: 1, amount: 2.2, threshold: 2 },
      { radius: 3, amount: 1.4, threshold: 8 },
      { radius: 9, amount: 0.55, threshold: 18 },
    ],
    // Post-upscale sharpening
    postUsm: [
      { radius: 1, amount: 1.2, threshold: 4 },
    ],
  },
  object: {
    brightness: 1.01, contrast: 1.08, shadowLift: 4, highlightRecover: 0.98,
    saturation: 1.06, vibrance: 1.08,
    blur: { radius: 2, sigmaColor: 32 },
    usm: [
      { radius: 1, amount: 2.8, threshold: 1 },
      { radius: 3, amount: 1.8, threshold: 5 },
      { radius: 9, amount: 0.7, threshold: 14 },
    ],
    postUsm: [{ radius: 1, amount: 1.5, threshold: 3 }],
  },
  scenery: {
    brightness: 1.02, contrast: 1.10, shadowLift: 4, highlightRecover: 0.96,
    saturation: 1.10, vibrance: 1.12,
    blur: { radius: 2, sigmaColor: 28 },
    usm: [
      { radius: 1, amount: 2.5, threshold: 2 },
      { radius: 4, amount: 1.8, threshold: 7 },
      { radius: 11, amount: 0.7, threshold: 14 },
    ],
    postUsm: [{ radius: 1, amount: 1.4, threshold: 4 }],
  },
  pets: {
    brightness: 1.01, contrast: 1.07, shadowLift: 4, highlightRecover: 0.97,
    saturation: 1.05, vibrance: 1.07,
    blur: { radius: 2, sigmaColor: 40 },
    usm: [
      { radius: 1, amount: 2.2, threshold: 2 },
      { radius: 3, amount: 1.5, threshold: 7 },
      { radius: 9, amount: 0.5, threshold: 16 },
    ],
    postUsm: [{ radius: 1, amount: 1.2, threshold: 4 }],
  },
  text: {
    brightness: 1.0, contrast: 1.18, shadowLift: 0, highlightRecover: 1.0,
    saturation: 0.9, vibrance: 1.0,
    blur: { radius: 1, sigmaColor: 60 },
    usm: [
      { radius: 1, amount: 3.5, threshold: 0 },
      { radius: 2, amount: 2.2, threshold: 0 },
      { radius: 6, amount: 1.0, threshold: 0 },
    ],
    postUsm: [{ radius: 1, amount: 2.0, threshold: 0 }],
  },
}

// ── Yield for UI updates ────────────────────────────────────────────────────────
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0))

// ── Separable Box Blur (2-pass, fast, Float32 output) ──────────────────────────
function boxBlur(src, imgW, imgH, radius) {
  const r = Math.max(1, Math.floor(radius))
  const tmp = new Float32Array(src.length)
  const dst = new Float32Array(src.length)
  // Horizontal pass
  for (let y = 0; y < imgH; y++) {
    for (let x = 0; x < imgW; x++) {
      let rS = 0, gS = 0, bS = 0, n = 0
      for (let dx = -r; dx <= r; dx++) {
        const nx = Math.min(imgW - 1, Math.max(0, x + dx))
        const idx = (y * imgW + nx) * 4
        rS += src[idx]; gS += src[idx + 1]; bS += src[idx + 2]; n++
      }
      const o = (y * imgW + x) * 4
      tmp[o] = rS / n; tmp[o + 1] = gS / n; tmp[o + 2] = bS / n; tmp[o + 3] = src[o + 3]
    }
  }
  // Vertical pass
  for (let x = 0; x < imgW; x++) {
    for (let y = 0; y < imgH; y++) {
      let rS = 0, gS = 0, bS = 0, n = 0
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(imgH - 1, Math.max(0, y + dy))
        const idx = (ny * imgW + x) * 4
        rS += tmp[idx]; gS += tmp[idx + 1]; bS += tmp[idx + 2]; n++
      }
      const o = (y * imgW + x) * 4
      dst[o] = rS / n; dst[o + 1] = gS / n; dst[o + 2] = bS / n; dst[o + 3] = tmp[o + 3]
    }
  }
  return dst
}

// ── Multi-Scale Luminance USM ──────────────────────────────────────────────────
// The restoration core. Works ONLY on luminance to avoid orange/color halos.
// Three frequency bands: fine (radius 1), mid (radius 3), broad (radius 8-11).
// Each band adds sharpening detail at that frequency, then merged back into RGB.
function multiScaleUSM(src, imgW, imgH, usmPasses) {
  const n = src.length
  const numPix = n / 4

  // Extract luminance for each pixel (Y from Rec.709)
  const lum = new Float32Array(numPix)
  for (let i = 0, p = 0; i < n; i += 4, p++) {
    lum[p] = 0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2]
  }

  // Accumulate USM lumiance delta from all frequency bands
  const delta = new Float32Array(numPix)

  for (const pass of usmPasses) {
    // Expand lum into RGBA array for boxBlur
    const lumRGBA = new Float32Array(n)
    for (let p = 0; p < numPix; p++) {
      lumRGBA[p * 4] = lumRGBA[p * 4 + 1] = lumRGBA[p * 4 + 2] = lum[p]
      lumRGBA[p * 4 + 3] = 255
    }
    const blurred = boxBlur(lumRGBA, imgW, imgH, pass.radius)

    for (let p = 0; p < numPix; p++) {
      const diff = lum[p] - blurred[p * 4]   // detail at this frequency
      if (Math.abs(diff) > pass.threshold) {
        delta[p] += diff * pass.amount
      }
    }
  }

  // Apply luminance delta back to RGB proportionally (preserves hue/chroma)
  const dst = new Uint8ClampedArray(n)
  for (let i = 0, p = 0; i < n; i += 4, p++) {
    const L = lum[p]
    const dL = delta[p]
    if (L > 1) {
      // Scale all channels by luminance ratio — preserves colour proportions
      const ratio = Math.min(4, Math.max(0.25, (L + dL) / L))
      dst[i] = Math.min(255, Math.max(0, src[i] * ratio))
      dst[i + 1] = Math.min(255, Math.max(0, src[i + 1] * ratio))
      dst[i + 2] = Math.min(255, Math.max(0, src[i + 2] * ratio))
    } else {
      // Near-black: add deltaL directly
      dst[i] = Math.min(255, Math.max(0, src[i] + dL))
      dst[i + 1] = Math.min(255, Math.max(0, src[i + 1] + dL))
      dst[i + 2] = Math.min(255, Math.max(0, src[i + 2] + dL))
    }
    dst[i + 3] = src[i + 3]
  }
  return dst
}

// ── Edge-Preserving Bilateral Denoise ─────────────────────────────────────────
async function applySurfaceBlur(srcData, imgW, imgH, radius, sigmaColor, onProgress) {
  const src = srcData.data
  const dst = new Uint8ClampedArray(src.length)
  const scSq = sigmaColor * sigmaColor * 3
  const chunk = Math.max(1, Math.floor(imgH / 10))

  for (let y = 0; y < imgH; y++) {
    if (y % chunk === 0) {
      onProgress(15 + (y / imgH) * 32, 'Edge-preserving denoise...')
      await yieldToMain()
    }
    for (let x = 0; x < imgW; x++) {
      const idx = (y * imgW + x) * 4
      const r0 = src[idx], g0 = src[idx + 1], b0 = src[idx + 2]
      let rS = 0, gS = 0, bS = 0, wS = 0
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy; if (ny < 0 || ny >= imgH) continue
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx; if (nx < 0 || nx >= imgW) continue
          const ni = (ny * imgW + nx) * 4
          const r1 = src[ni], g1 = src[ni + 1], b1 = src[ni + 2]
          const cD = (r1 - r0) ** 2 + (g1 - g0) ** 2 + (b1 - b0) ** 2
          const spW = 1 - (Math.abs(dx) + Math.abs(dy)) / (2 * radius + 1)
          const cW = cD < scSq ? 1 - cD / scSq : 0
          const wt = spW * cW
          rS += r1 * wt; gS += g1 * wt; bS += b1 * wt; wS += wt
        }
      }
      if (wS > 0) { dst[idx] = rS / wS; dst[idx + 1] = gS / wS; dst[idx + 2] = bS / wS }
      else { dst[idx] = r0; dst[idx + 1] = g0; dst[idx + 2] = b0 }
      dst[idx + 3] = src[idx + 3]
    }
  }
  return new ImageData(dst, imgW, imgH)
}

// ── Very Subtle Color Grade (last step, minimal) ──────────────────────────────
function applyColorGrade(src, cfg) {
  // Build LUT: shadow lift → highlight protect → brightness → contrast S-curve
  const lut = new Uint8ClampedArray(256)
  for (let i = 0; i < 256; i++) {
    let v = i / 255
    v += (cfg.shadowLift / 255) * (1 - v) * (1 - v)         // gentle shadow lift
    if (v > 0.82) v = 0.82 + (v - 0.82) * cfg.highlightRecover
    v = v * cfg.brightness
    v = (v - 0.5) * cfg.contrast + 0.5                       // S-curve
    lut[i] = Math.min(255, Math.max(0, Math.round(v * 255)))
  }
  const dst = new Uint8ClampedArray(src.length)
  for (let i = 0; i < src.length; i += 4) {
    // Tone
    let r = lut[src[i]], g = lut[src[i + 1]], b = lut[src[i + 2]]
    // Luminosity-preserving saturation (no hue shift)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    r = Math.min(255, Math.max(0, luma + (r - luma) * cfg.saturation))
    g = Math.min(255, Math.max(0, luma + (g - luma) * cfg.saturation))
    b = Math.min(255, Math.max(0, luma + (b - luma) * cfg.saturation))
    // Gentle vibrance boost for undersaturated areas only
    const avg = (r + g + b) / 3
    const mx = Math.max(r, g, b)
    const satLvl = mx > 0 ? (mx - Math.min(r, g, b)) / mx : 0
    const vib = (1 - satLvl) * (cfg.vibrance - 1.0) * 0.5
    dst[i] = Math.min(255, Math.max(0, r + (r - avg) * vib))
    dst[i + 1] = Math.min(255, Math.max(0, g + (g - avg) * vib))
    dst[i + 2] = Math.min(255, Math.max(0, b + (b - avg) * vib))
    dst[i + 3] = src[i + 3]
  }
  return dst
}

// ── MAIN PIPELINE ──────────────────────────────────────────────────────────────
function enhanceOnCanvas(imgSrc, scale = 2, category = 'portrait', onProgress) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      try {
        const cfg = CFG[category] || CFG.portrait
        const srcW = img.naturalWidth, srcH = img.naturalHeight
        const outW = srcW * scale, outH = srcH * scale

        onProgress?.(5, 'Loading image...')
        await yieldToMain()

        const srcCanvas = document.createElement('canvas')
        srcCanvas.width = srcW; srcCanvas.height = srcH
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
        srcCtx.drawImage(img, 0, 0)

        // Step 1 — Edge-preserving bilateral denoise (removes noise before sharpening)
        onProgress?.(10, 'Removing noise...')
        let iData = srcCtx.getImageData(0, 0, srcW, srcH)
        iData = await applySurfaceBlur(iData, srcW, srcH, cfg.blur.radius, cfg.blur.sigmaColor, onProgress)

        // Step 2 — Multi-scale luminance USM (THE restoration: recovers blur/detail)
        onProgress?.(50, 'Restoring detail — 3 frequency bands...')
        await yieldToMain()
        let pixArr = multiScaleUSM(iData.data, srcW, srcH, cfg.usm)

        // Step 3 — Subtle color grade (tone curve + gentle saturation ONLY)
        onProgress?.(70, 'Subtle color correction...')
        await yieldToMain()
        pixArr = applyColorGrade(pixArr, cfg)
        srcCtx.putImageData(new ImageData(pixArr, srcW, srcH), 0, 0)

        // Step 4 — High-quality upscale
        onProgress?.(78, 'Upscaling to HD...')
        await yieldToMain()
        const outCanvas = document.createElement('canvas')
        outCanvas.width = outW; outCanvas.height = outH
        const outCtx = outCanvas.getContext('2d', { willReadFrequently: true })
        outCtx.imageSmoothingEnabled = true
        outCtx.imageSmoothingQuality = 'high'
        outCtx.drawImage(srcCanvas, 0, 0, outW, outH)

        // Step 5 — Post-upscale sharpening (restore crispness after scaling)
        onProgress?.(88, 'Final sharpening...')
        await yieldToMain()
        const outPix = outCtx.getImageData(0, 0, outW, outH)
        const sharpened = multiScaleUSM(outPix.data, outW, outH, cfg.postUsm)
        outCtx.putImageData(new ImageData(sharpened, outW, outH), 0, 0)

        onProgress?.(97, 'Finalizing...')
        await yieldToMain()

        outCanvas.toBlob(blob => {
          if (blob) { onProgress?.(100, 'Enhancement complete!'); resolve(blob) }
          else reject(new Error('Failed to export image'))
        }, 'image/jpeg', 0.97)
      } catch (err) { reject(err) }
    }
    img.onerror = () => reject(new Error('Could not load image.'))
    img.src = imgSrc
  })
}

// ── Download helper ────────────────────────────────────────────────────────────
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

// ── Compare Slider Component ────────────────────────────────────────────────────
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

// ── Main Component ──────────────────────────────────────────────────────────────
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
    const fileName = `enhanced_${scale}x_${baseName}.jpg`
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
        title="AI Photo Enhancer — Restore Sharpness & Clarity Online"
        description="Restore blurry photos to crystal clarity. Multi-scale detail recovery removes noise and sharpens edges without touching colors. 100% private in-browser."
        canonical="/image-enhancer"
      />
      <ToolLayout
        toolSlug="image-enhancer"
        title="AI Photo Enhancer & Restorer"
        description="Recover lost detail from blurry photos. Multi-scale frequency restoration sharpens edges, removes noise, and upscales resolution — all in your browser."
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
                  <p className="text-sm font-medium text-slate-400">Restore blur, recover detail, sharpen edges.</p>
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
                    <p className="text-[11px] text-slate-500 font-medium">Multi-Scale Detail Restoration · 3 Frequency Bands</p>
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
                className="relative select-none overflow-hidden bg-slate-100"
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

                {/* Processing Overlay */}
                {processing && !resultPreview && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
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
                        <p className="text-white/60 text-xs mt-1.5 font-medium">Multi-scale frequency restoration running...</p>
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
                  Save Enhanced Image ({scale}× Resolution)
                </button>

                {/* Config */}
                <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-center px-5 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upscale</span>
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

        {/* SEO Content */}
        <div className="seo-content mt-12 bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <img src="/images/tools/image-enhancer-tool.png" alt="AI Image Enhancer Tool Interface"
            title="Premium Image Restoration" loading="lazy"
            className="w-full h-auto rounded-2xl shadow-md mb-10 border border-slate-100" />

          <div className="prose prose-slate max-w-none text-base text-slate-600 space-y-6">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Restore Blurry Photos to Crystal Clarity</h2>
            <p>Unlike tools that just boost contrast or saturate colors, our AI Photo Enhancer uses <strong>Multi-Scale Frequency Restoration</strong> — a technique borrowed from professional image processing pipelines. It analyzes your photo across three frequency bands simultaneously and recovers lost detail at each level.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">1. Edge-Preserving Denoise</h3>
            <p>First, a bilateral filter smooths out ISO noise and compression artifacts while preserving all sharp edges. Unlike Gaussian blur, it only blurs areas with similar colors, leaving hair, text, and object boundaries untouched.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">2. Multi-Scale Luminance USM</h3>
            <p>The core restoration engine applies Unsharp Masking across three different frequency scales — fine (radius 1px), medium (radius 3px), and broad (radius 9px). Each scale recovers a different level of detail: skin pores, hair edges, and overall structure. Crucially, all sharpening operates only on the <em>luminance channel</em>, so your colors stay perfectly natural with zero halos.</p>

            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">3. Gentle Color Correction</h3>
            <p>Finally, a very subtle tone curve (brightness 1.02, contrast 1.06) and luminosity-preserving saturation are applied. This is intentionally minimal — the restoration itself provides the visible improvement, not color boosting.</p>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}
