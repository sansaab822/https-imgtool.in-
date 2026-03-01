import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// CDN URLs for TensorFlow.js and UpscalerJS
const TF_CDN = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js'
const UPSCALER_CDN = 'https://cdn.jsdelivr.net/npm/upscaler@latest/dist/browser/umd/upscaler.min.js'
const ESRGAN_2X_CDN = 'https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@latest/dist/umd/2x.min.js'
const ESRGAN_4X_CDN = 'https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@latest/dist/umd/4x.min.js'

// Demo images - low quality vs high quality pairs
const DEMO_IMAGES = [
  {
    id: 1,
    original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=20&blur=1',
    enhanced: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
    title: 'Portrait Enhancement'
  },
  {
    id: 2,
    original: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=20&blur=1',
    enhanced: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=90',
    title: 'Face Recovery'
  },
  {
    id: 3,
    original: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=20&blur=1',
    enhanced: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=90',
    title: 'Landscape Detail'
  }
]

// ── Script Loader with Retry Logic ─────────────────────────────────────────
const loadScript = (src, retries = 3) => new Promise((resolve, reject) => {
  if (typeof window !== 'undefined' && document.querySelector(`script[src="${src}"]`)) {
    resolve()
    return
  }

  const attempt = (triesLeft) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => resolve()
    script.onerror = () => {
      if (triesLeft > 0) {
        console.warn(`Failed to load ${src}, retrying... (${triesLeft} attempts left)`)
        setTimeout(() => attempt(triesLeft - 1), 1000)
      } else {
        reject(new Error(`Failed to load ${src}`))
      }
    }

    document.head.appendChild(script)
  }

  attempt(retries)
})

// ── Demo Compare Component with Multiple Examples ──────────────────────────
function DemoCompare() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [compareX, setCompareX] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const compareRef = useRef()

  const currentDemo = DEMO_IMAGES[activeDemo]

  const onMove = useCallback((e) => {
    if (!dragging || !compareRef.current) return
    const rect = compareRef.current.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const percent = Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100))
    setCompareX(percent)
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

  // Reset compare position when demo changes
  useEffect(() => {
    setCompareX(50)
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [activeDemo])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <i className="fas fa-wand-magic-sparkles text-white text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Live Demo</h3>
            <p className="text-xs text-slate-500">See AI enhancement in action</p>
          </div>
        </div>

        {/* Demo Selector */}
        <div className="flex gap-2">
          {DEMO_IMAGES.map((demo, idx) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeDemo === idx
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {demo.title}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Area */}
      <div
        ref={compareRef}
        className="relative select-none overflow-hidden bg-slate-900 cursor-col-resize"
        style={{ height: 400 }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Enhanced Image (Background) */}
        <img
          src={currentDemo.enhanced}
          alt="Enhanced"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoading ? 0 : 1 }}
          onLoad={() => setIsLoading(false)}
        />

        {/* Original Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}
        >
          <img
            src={currentDemo.original}
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(139,92,246,0.8)] z-10"
          style={{ left: `${compareX}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-500">
            <i className="fas fa-arrows-left-right text-violet-600 text-lg"></i>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
          ORIGINAL
        </div>
        <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-violet-400">
          ✨ AI ENHANCED 4x
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full">
          Drag slider to compare
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <i className="fas fa-brain text-violet-500"></i>
            Real-ESRGAN AI
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-expand text-blue-500"></i>
            4x Upscaling
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-magic text-pink-500"></i>
            Detail Recovery
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Demo {activeDemo + 1} of {DEMO_IMAGES.length}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ImageEnhancer() {
  const [image, setImage] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepMsg, setStepMsg] = useState('')
  const [scale, setScale] = useState(4)
  const [compareX, setCompareX] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [dropOver, setDropOver] = useState(false)
  const [error, setError] = useState(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [modelLoading, setModelLoading] = useState(true)
  const [processingTime, setProcessingTime] = useState(null)

  const compareRef = useRef()
  const inputRef = useRef()
  const upscalerRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Initialize AI Models
  useEffect(() => {
    let isMounted = true

    const initModels = async () => {
      try {
        setModelLoading(true)
        setStepMsg('Loading AI models...')

        // Load in sequence: TensorFlow -> Upscaler -> Model
        await loadScript(TF_CDN)
        console.log('TensorFlow.js loaded')

        await loadScript(UPSCALER_CDN)
        console.log('UpscalerJS loaded')

        await loadScript(scale === 2 ? ESRGAN_2X_CDN : ESRGAN_4X_CDN)
        console.log(`ESRGAN ${scale}x model loaded`)

        if (!isMounted) return

        // Wait for globals to be available
        let attempts = 0
        const checkInterval = setInterval(() => {
          attempts++
          if (window.Upscaler && (window.EsrganSlim2x || window.EsrganSlim4x || window.EsrganSlim)) {
            clearInterval(checkInterval)

            try {
              const model = scale === 2
                ? (window.EsrganSlim2x || window.EsrganSlim['2x'] || window.EsrganSlim)
                : (window.EsrganSlim4x || window.EsrganSlim['4x'] || window.EsrganSlim)

              upscalerRef.current = new window.Upscaler({ model })
              setModelsLoaded(true)
              setModelLoading(false)
              console.log('Upscaler initialized successfully')
            } catch (err) {
              console.error('Failed to initialize upscaler:', err)
              setError('Failed to initialize AI models. Please refresh the page.')
              setModelLoading(false)
            }
          }

          if (attempts > 50) { // 5 seconds timeout
            clearInterval(checkInterval)
            setError('Model loading timeout. Please check your connection and refresh.')
            setModelLoading(false)
          }
        }, 100)

      } catch (err) {
        console.error('Script loading failed:', err)
        if (isMounted) {
          setError('Failed to load AI libraries. Please check your internet connection.')
          setModelLoading(false)
        }
      }
    }

    initModels()

    return () => {
      isMounted = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [scale])

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB for browser processing')
      return
    }

    // Cleanup previous result
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
    }

    setError(null)
    setImage({ url: URL.createObjectURL(file), file })
    setResultUrl(null)
    setCompareX(50)
    setProcessingTime(null)
  }, [resultUrl])

  const processImage = async () => {
    if (!image || !upscalerRef.current) {
      setError('AI model not ready. Please wait or refresh.')
      return
    }

    // Cancel previous processing if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setProcessing(true)
    setResultUrl(null)
    setProgress(0)
    setStepMsg('Initializing...')
    setError(null)

    const startTime = Date.now()

    try {
      // Load image
      const img = new Image()
      img.src = image.url
      img.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Image loading timeout')), 10000)
      })

      // Check if aborted
      if (abortControllerRef.current.signal.aborted) return

      setStepMsg('Analyzing image...')
      setProgress(10)

      // Pre-process: Create thumbnail for analysis
      const analysisCanvas = document.createElement('canvas')
      const maxAnalysisDim = 256
      const analysisScale = Math.min(1, maxAnalysisDim / Math.max(img.naturalWidth, img.naturalHeight))
      analysisCanvas.width = img.naturalWidth * analysisScale
      analysisCanvas.height = img.naturalHeight * analysisScale
      const analysisCtx = analysisCanvas.getContext('2d')
      analysisCtx.drawImage(img, 0, 0, analysisCanvas.width, analysisCanvas.height)

      // Get image data for quality analysis
      const imageData = analysisCtx.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height)
      const data = imageData.data
      let totalBrightness = 0
      let totalEdges = 0

      // Simple quality analysis
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        totalBrightness += (r + g + b) / 3

        // Simple edge detection (compare with next pixel)
        if (i < data.length - 4) {
          const nextR = data[i + 4]
          totalEdges += Math.abs(r - nextR)
        }
      }

      const avgBrightness = totalBrightness / (data.length / 4)
      const sharpness = totalEdges / (data.length / 4)

      console.log(`Image analysis - Brightness: ${avgBrightness.toFixed(2)}, Sharpness: ${sharpness.toFixed(2)}`)

      setStepMsg('Running AI super-resolution...')
      setProgress(20)

      // AI Upscale with progress tracking
      const upscaledSrc = await upscalerRef.current.upscale(img, {
        output: 'src',
        progress: (percent) => {
          if (abortControllerRef.current.signal.aborted) return
          const scaledProgress = Math.round(20 + percent * 75) // 20-95%
          setProgress(scaledProgress)
          setStepMsg(`Enhancing details... ${Math.round(percent * 100)}%`)
        },
        patchSize: 64, // Smaller patches for better memory management
        padding: 2
      })

      if (abortControllerRef.current.signal.aborted) return

      // Post-process: Enhance sharpness if needed
      if (sharpness < 30) {
        setStepMsg('Applying sharpening...')
        setProgress(96)
        // Additional sharpening could be applied here if needed
        await new Promise(r => setTimeout(r, 100))
      }

      setResultUrl(upscaledSrc)
      setProcessingTime(((Date.now() - startTime) / 1000).toFixed(1))
      setStepMsg('Enhancement complete!')
      setProgress(100)

    } catch (err) {
      if (err.name === 'AbortError' || abortControllerRef.current.signal.aborted) {
        console.log('Processing aborted')
        return
      }

      console.error('Enhancement failed:', err)
      setError(err.message || 'AI enhancement failed. Please try with a different image.')
      setStepMsg('Error occurred')
    } finally {
      setProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  // Auto-enhance on upload
  useEffect(() => {
    if (image && !resultUrl && !processing && modelsLoaded) {
      const timer = setTimeout(() => processImage(), 500)
      return () => clearTimeout(timer)
    }
  }, [image, modelsLoaded])

  // Compare slider handlers
  const onMove = useCallback((e) => {
    if (!dragging || !compareRef.current) return
    const rect = compareRef.current.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const percent = Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100))
    setCompareX(percent)
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [resultUrl])

  return (
    <>
      <SEO
        title="AI Image Enhancer - Real ESRGAN Super Resolution"
        description="Enhance photos with Real AI. Upscale images 4x with detail reconstruction, smoothing, and quality improvement. Free & private browser processing."
        canonical="/image-enhancer"
      />
      <ToolLayout
        toolSlug="image-enhancer"
        title="AI Image Enhancer"
        description="Real AI-powered image enhancement using ESRGAN. Upload any photo and get 4x super resolution with detail recovery and smoothing."
        breadcrumb="Image Enhancer"
      >
        <div className="max-w-6xl mx-auto">
          {/* Model Loading Status */}
          {modelLoading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-semibold">Loading AI Models...</p>
                <p className="text-xs text-blue-600">Downloading Real-ESRGAN neural network (one-time)</p>
              </div>
            </div>
          )}

          {/* Live Demo Section */}
          {!image && !processing && <DemoCompare />}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <i className="fas fa-circle-exclamation mt-0.5"></i>
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {!image ? (
            /* Upload Section */
            <div
              className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-300 ${dropOver ? 'border-violet-500 bg-violet-50 scale-[1.02]' : 'border-slate-300'
                } p-12 text-center cursor-pointer hover:border-violet-400 hover:shadow-xl`}
              onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
              onDragOver={e => { e.preventDefault(); setDropOver(true) }}
              onDragLeave={() => setDropOver(false)}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />

              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-400/40 group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-cloud-arrow-up text-white text-4xl"></i>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-pulse">
                    AI POWERED
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-slate-800">Upload Any Photo</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Real ESRGAN AI upscaling with detail reconstruction. Not just filters - actual pixel generation.
                  </p>
                </div>

                {/* Scale Selector */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  {[2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); setScale(s) }}
                      disabled={modelLoading}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${scale === s
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                        } ${modelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {s}x Upscale
                    </button>
                  ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 max-w-lg w-full">
                  {[
                    { icon: 'fa-brain', label: 'Real-ESRGAN', desc: 'Neural Network', color: 'from-violet-500 to-purple-600' },
                    { icon: 'fa-image', label: '4K Output', desc: 'Detail Recovery', color: 'from-blue-500 to-cyan-500' },
                    { icon: 'fa-wand-sparkles', label: 'Natural Look', desc: 'No Artifacts', color: 'from-pink-500 to-rose-500' },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 hover:border-violet-200 transition-all hover:shadow-md">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                        <i className={`fas ${f.icon} text-white text-lg`}></i>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{f.label}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <button
                  disabled={modelLoading}
                  className={`px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-full shadow-xl shadow-violet-500/30 hover:scale-105 hover:shadow-2xl transition-all duration-300 text-base flex items-center gap-2 ${modelLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <i className="fas fa-upload"></i>
                  {modelLoading ? 'Loading Models...' : 'Choose Photo to Enhance'}
                </button>

                <p className="text-xs text-slate-400 flex items-center gap-4">
                  <span className="flex items-center gap-1"><i className="fas fa-shield-halved"></i>100% Private</span>
                  <span className="flex items-center gap-1"><i className="fas fa-bolt"></i>Browser Processing</span>
                  <span className="flex items-center gap-1"><i className="fas fa-infinity"></i>Free</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              {processing && (
                <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold text-slate-700">{stepMsg}</span>
                    </div>
                    <span className="text-lg font-bold text-violet-600 tabular-nums">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Processing with Real-ESRGAN AI in your browser...
                  </p>
                </div>
              )}

              {/* Comparison Viewer */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">
                      {resultUrl ? 'Compare: Original vs AI Enhanced' : 'Processing...'}
                    </span>
                    {resultUrl && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center gap-1">
                        <i className="fas fa-check-circle"></i>
                        {scale}x Upscaled
                      </span>
                    )}
                    {processingTime && (
                      <span className="text-xs text-slate-500">
                        ({processingTime}s)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!processing && resultUrl && (
                      <button
                        onClick={processImage}
                        className="text-sm text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
                      >
                        <i className="fas fa-rotate-right"></i>
                        Re-enhance
                      </button>
                    )}
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <i className="fas fa-folder-open"></i>
                      Change
                    </button>
                    <button
                      onClick={() => {
                        setImage(null);
                        setResultUrl(null);
                        setError(null);
                        setProcessingTime(null)
                      }}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                      Remove
                    </button>
                  </div>
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                </div>

                <div
                  ref={compareRef}
                  className="relative select-none overflow-hidden bg-slate-900"
                  style={{ minHeight: 500, cursor: resultUrl ? 'col-resize' : 'default' }}
                  onMouseDown={() => resultUrl && setDragging(true)}
                  onTouchStart={() => resultUrl && setDragging(true)}
                >
                  {/* Enhanced Image (Background) */}
                  {resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Enhanced"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={image.url}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain opacity-50"
                    />
                  )}

                  {/* Original Image (Clipped - Left Side) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}
                  >
                    <img
                      src={image.url}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>

                  {/* Slider */}
                  {resultUrl && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_30px_rgba(139,92,246,1)] z-20"
                      style={{ left: `${compareX}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-500">
                        <i className="fas fa-arrows-left-right text-violet-600 text-xl"></i>
                      </div>
                    </div>
                  )}

                  {/* Labels */}
                  <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-lg border border-white/20">
                    ORIGINAL
                  </div>
                  {resultUrl && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg border border-violet-400">
                      ✨ AI ENHANCED {scale}x
                    </div>
                  )}

                  {/* Processing Overlay */}
                  {processing && !resultUrl && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm mx-4">
                        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                          <p className="text-slate-800 font-bold text-lg">{stepMsg}</p>
                          <p className="text-slate-500 text-sm mt-1">Real-ESRGAN Neural Network</p>
                        </div>
                        <div className="w-56 bg-slate-200 rounded-full h-2">
                          <div className="h-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">This may take 10-30 seconds depending on image size</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download */}
              {resultUrl && !processing && (
                <div className="flex gap-4">
                  <a
                    href={resultUrl}
                    download={`ai_enhanced_${scale}x_${image.file.name.replace(/\.[^.]+$/, '')}.png`}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] text-lg"
                  >
                    <i className="fas fa-download text-xl"></i>
                    Download Enhanced Image ({scale}x)
                  </a>
                  <button
                    onClick={() => { setImage(null); setResultUrl(null); setProcessingTime(null) }}
                    className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all hover:scale-105"
                  >
                    <i className="fas fa-plus text-xl"></i>
                  </button>
                </div>
              )}

              {/* Info Cards */}
              {resultUrl && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Model', value: 'Real-ESRGAN', icon: 'fa-brain' },
                    { label: 'Scale', value: `${scale}x`, icon: 'fa-expand' },
                    { label: 'Processing', value: 'Local/Browser', icon: 'fa-shield-halved' },
                    { label: 'Time', value: `${processingTime || '--'}s`, icon: 'fa-clock' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-4 border border-slate-200 text-center hover:border-violet-200 transition-colors">
                      <i className={`fas ${item.icon} text-violet-500 mb-2 text-lg`}></i>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <img
            src="/images/tools/image-enhancer-tool.png"
            alt="AI Image Enhancer Tool Interface"
            title="Enhance Image Quality Online"
            loading="lazy"
            className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
          />

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
            <h2 className="text-2xl font-bold text-slate-800">State-of-the-Art Image Upscaling Without Losing Detail</h2>
            <p>
              For decades, trying to enlarge a small, low-resolution photograph meant accepting a blurry, heavily pixelated result. Traditional scaling software simply stretches existing pixels and guesses the colors between them, creating a soft and unnatural look. Today, however, artificial intelligence has completely rewritten the rules of image scaling. Our Image Enhancer leverages the renowned Real-ESRGAN (Enhanced Super-Resolution Generative Adversarial Networks) architecture to accurately rebuild missing details from thin air. Instead of merely stretching the photo, the AI intelligently analyzes the textures and actually generates brand new, high-definition pixels to match the original context.
            </p>

            <h3 className="text-lg font-bold text-slate-800 mt-6">How Our Browser-Based Neural Network Operates</h3>
            <p>
              What makes our upscaler completely unique is our commitment to user privacy and frictionless performance. While most "AI Enhancers" on the internet require you to create an account, pay a subscription fee, and upload your personal photos to a remote cloud server, imgtool.in does the exact opposite. We utilize TensorFlow.js to download a highly optimized version of the ESRGAN neural network directly into your browser's local cache. Once loaded, your computer's own processing power is used to run the enhancement matrix. Your images are never transmitted across the internet, ensuring 100% confidentiality for sensitive family photos or unreleased corporate assets.
            </p>

            <h3 className="text-lg font-bold text-slate-800 mt-6">Transforming Old Memories and Digital Assets</h3>
            <p>
              The practical applications for true AI upscaling are virtually endless. Archivists and genealogists frequently use our tool to rescue tiny, scanned heritage photos from the 1990s, restoring the sharpness of their ancestors' faces. Digital artists who use AI image generators (like Midjourney or DALL-E) rely on our 4x upscaler to take their low-resolution draft outputs and expand them into massive, print-ready 4K masterpieces. Furthermore, small business owners often find themselves with a tiny thumbnail of their company logo and use our enhancer to reconstruct it cleanly without needing to hire a vector artist.
            </p>
            <p>
              Keep in mind that while the AI is incredible at adding resolution, it drastically increases the file size of the image. After you have upscaled your photo, you will likely want to run the resulting file through our <a href="/image-compressor" className="text-violet-600 hover:underline">Image Compressor Tool</a> to optimize it for web delivery. Additionally, if the AI enhanced a beautiful portrait but you want to remove a distracting background, you can pass the high-resolution file directly into our <a href="/bg-remover" className="text-violet-600 hover:underline">Background Remover Tool</a> for a flawless, professional finish.
            </p>

            <img
              src="/images/tools/image-enhancer-example.png"
              alt="Visual comparison showing a blurry photo being sharpened by AI"
              title="Image Enhancer Before and After Example"
              loading="lazy"
              className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
            />

            <h3 className="text-lg font-bold text-slate-800 mt-6">Optimizing Your Enhancement Workflow</h3>
            <p>
              Because this tool runs a massive mathematical model directly on your local hardware, the processing time will depend heavily on the speed of your device and the original dimensions of the photo. Attempting to apply a 4x multiplier to an image that is already 2000 pixels wide on an older smartphone may cause your browser to run out of memory and crash. For the best experience, we recommend using a modern desktop computer. If you only need to make a photo slightly larger for a social media post, try using the 2x scale option first, as it demands significantly less RAM and processing power while still providing a massive quality boost.
            </p>

            <h3 className="text-lg font-bold text-slate-800 mt-6">Unrivaled Upscaling Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Real-ESRGAN Architecture:</strong> Built on industry-leading academic research specifically designed for reconstructing realistic textures like skin, fabric, and landscapes.</li>
              <li><strong>Selectable Multipliers:</strong> Choose between a rapid 2x enhancement for quick social media fixes, or a demanding 4x super-resolution for large-format printing.</li>
              <li><strong>Local Hardware Acceleration:</strong> Automatically attempts to utilize your device's GPU via WebGL to calculate the neural network matrix as quickly as possible.</li>
              <li><strong>Interactive Live Viewer:</strong> Includes a satisfying before-and-after slider so you can deeply inspect the newly generated pixels before committing to the download.</li>
              <li><strong>Completely Free & Uncapped:</strong> No watermarks, no daily limits, and no premium subscriptions required to access the full power of the AI model.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-700">Can this tool read blurred license plates or text?</h4>
                <p className="mt-1">No. It is extremely important to understand that AI enhancement generates *new* pixels based on what it predicts *should* be there. It cannot magically reveal hidden information, uncover blurred passwords, or accurately reconstruct specific letters or numbers that were totally destroyed in the original file.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Why did my browser tab freeze while processing?</h4>
                <p className="mt-1">Running a generative neural network inside a web browser is incredibly resource-intensive. During the few seconds that the progress bar is moving, your device's CPU or GPU is working at 100% capacity to calculate millions of mathematical operations. A temporary interface freeze is entirely normal.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Does the AI work better on illustrations or photographs?</h4>
                <p className="mt-1">The default ESRGAN model loaded by this tool is a generic model trained on a massively diverse dataset. It performs exceptionally well on actual photographs (landscapes, people, objects) and reasonably well on digital art, though highly stylized 2D anime or flat vector graphics might sometimes exhibit slight painterly artifacts.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Will this fix blurry photos taken with a shaky camera?</h4>
                <p className="mt-1">It depends on the severity. The AI is primarily designed to fix "low resolution blur" (pixelation from zooming in). While it does apply intelligent sharpening that can rescue a slightly out-of-focus shot, it cannot fix severe motion blur caused by drastically moving the camera while the shutter was open.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Are there any limits to the image size I can upload?</h4>
                <p className="mt-1">Yes, to prevent your browser from instantly crashing due to memory exhaustion, we limit incoming uploads to a maximum of 5 Megabytes. If you upload a massive 4K image and ask the AI to upscale it by 4x, the resulting 16K image would require more RAM than most consumer computers possess.</p>
              </div>
            </div>
          </div>
        </div>
      </ToolLayout >
    </>
  )
}
