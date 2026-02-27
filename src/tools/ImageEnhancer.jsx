import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'
import Upscaler from 'upscaler'
import x2 from '@upscalerjs/esrgan-slim/2x'
import x4 from '@upscalerjs/esrgan-slim/4x'

// Demo images - replace with your own low/high quality pairs
const DEMO_IMAGES = {
  original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=30&blur=2',
  enhanced: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90'
}

// ── AI Enhancement Hook ────────────────────────────────────────────────────
function useAIEnhancer() {
  const upscaler2x = useMemo(() => new Upscaler({ model: x2 }), [])
  const upscaler4x = useMemo(() => new Upscaler({ model: x4 }), [])
  
  const enhance = async (imageUrl, scale = 4, onProgress) => {
    const upscaler = scale === 2 ? upscaler2x : upscaler4x
    
    // Load image
    const img = new Image()
    img.src = imageUrl
    img.crossOrigin = 'anonymous'
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    // Upscale with AI
    const upscaledSrc = await upscaler.upscale(img, {
      output: 'src',
      progress: (percent) => onProgress?.(`AI enhancing...`, Math.round(percent * 100))
    })
    
    return upscaledSrc
  }
  
  return { enhance }
}

// ── Demo Compare Component (Side by Side) ─────────────────────────────────
function DemoCompare() {
  const [compareX, setCompareX] = useState(50)
  const [dragging, setDragging] = useState(false)
  const compareRef = useRef()

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg mb-8">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <i className="fas fa-wand-magic-sparkles text-white text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Live Demo</h3>
            <p className="text-xs text-slate-500">Try the slider to see AI enhancement</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Original</span>
          <i className="fas fa-arrows-left-right text-slate-400"></i>
          <span className="font-medium text-violet-600">AI Enhanced 4x</span>
        </div>
      </div>
      
      <div
        ref={compareRef}
        className="relative select-none overflow-hidden bg-slate-900 cursor-col-resize"
        style={{ height: 400 }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        {/* Enhanced Image (Background) */}
        <img
          src={DEMO_IMAGES.enhanced}
          alt="Enhanced"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Original Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}
        >
          <img
            src={DEMO_IMAGES.original}
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Slight blur to simulate low quality */}
          <div className="absolute inset-0 backdrop-blur-[1px]"></div>
        </div>

        {/* Slider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(139,92,246,0.8)] z-10"
          style={{ left: `${compareX}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-500">
            <i className="fas fa-arrows-left-right text-violet-600 text-lg"></i>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
          ORIGINAL
        </div>
        <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-violet-400">
          ✨ AI ENHANCED 4x
        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-600">Drag the slider to compare before and after</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200">Real-ESRGAN</span>
          <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200">Detail Recovery</span>
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
  
  const compareRef = useRef()
  const inputRef = useRef()
  const { enhance } = useAIEnhancer()

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }
    setError(null)
    setImage({ url: URL.createObjectURL(file), file })
    setResultUrl(null)
    setCompareX(50)
  }, [])

  const processImage = async () => {
    if (!image) return
    setProcessing(true)
    setResultUrl(null)
    setProgress(0)
    setStepMsg('Initializing AI model...')
    setError(null)

    try {
      // AI Enhancement using Real-ESRGAN
      const enhancedUrl = await enhance(image.url, scale, (msg, pct) => {
        setStepMsg(msg)
        setProgress(pct)
      })
      
      setResultUrl(enhancedUrl)
      setStepMsg('Enhancement complete!')
    } catch (err) {
      console.error('Enhancement failed:', err)
      setError('AI enhancement failed. Please try again with a different image.')
      setStepMsg('Error occurred')
    } finally {
      setProcessing(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  // Auto-enhance on upload
  useEffect(() => {
    if (image && !resultUrl && !processing) {
      processImage()
    }
  }, [image])

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
          {/* Live Demo Section */}
          {!image && <DemoCompare />}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <i className="fas fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          {!image ? (
            /* Upload Section */
            <div
              className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-300 ${dropOver ? 'border-violet-500 bg-violet-50' : 'border-slate-300'} p-12 text-center cursor-pointer hover:border-violet-400 hover:shadow-lg`}
              onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
              onDragOver={e => { e.preventDefault(); setDropOver(true) }}
              onDragLeave={() => setDropOver(false)}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
              
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-400/40 animate-pulse">
                    <i className="fas fa-wand-magic-sparkles text-white text-4xl"></i>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
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
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${scale === s ? 'bg-violet-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                    >
                      {s}x Upscale
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-lg w-full">
                  {[
                    { icon: 'fa-microchip', label: 'Real-ESRGAN AI', desc: 'Neural Network', color: 'from-violet-500 to-purple-600' },
                    { icon: 'fa-image', label: 'Detail Recovery', desc: 'Pixel Generation', color: 'from-blue-500 to-cyan-500' },
                    { icon: 'fa-wand-sparkles', label: 'Smooth & Natural', desc: 'Artifact Removal', color: 'from-pink-500 to-rose-500' },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 hover:border-violet-200 transition-colors">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                        <i className={`fas ${f.icon} text-white text-lg`}></i>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{f.label}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <button className="px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-full shadow-xl shadow-violet-500/30 hover:scale-105 hover:shadow-2xl transition-all duration-300 text-base flex items-center gap-2">
                  <i className="fas fa-cloud-arrow-up"></i>
                  Choose Photo to Enhance
                </button>
                
                <p className="text-xs text-slate-400 flex items-center gap-4">
                  <span><i className="fas fa-shield-halved mr-1"></i>100% Private</span>
                  <span><i className="fas fa-bolt mr-1"></i>Browser Processing</span>
                  <span><i className="fas fa-infinity mr-1"></i>Free</span>
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
                    Processing with Real-ESRGAN AI model in your browser...
                  </p>
                </div>
              )}

              {/* Comparison Viewer */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">
                      {resultUrl ? 'Compare: Original vs AI Enhanced' : 'Processing...'}
                    </span>
                    {resultUrl && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                        {scale}x Upscaled
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {!processing && resultUrl && (
                      <button 
                        onClick={processImage} 
                        className="text-sm text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
                      >
                        <i className="fas fa-rotate-right"></i>
                        Re-enhance ({scale}x)
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
                      onClick={() => { setImage(null); setResultUrl(null); setError(null) }} 
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
                      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                          <p className="text-slate-800 font-bold text-lg">{stepMsg}</p>
                          <p className="text-slate-500 text-sm mt-1">Real-ESRGAN AI Processing</p>
                        </div>
                        <div className="w-56 bg-slate-200 rounded-full h-2">
                          <div className="h-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
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
                    onClick={() => { setImage(null); setResultUrl(null) }}
                    className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all hover:scale-105"
                  >
                    <i className="fas fa-plus text-xl"></i>
                  </button>
                </div>
              )}

              {/* Info */}
              {resultUrl && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Model', value: 'Real-ESRGAN', icon: 'fa-brain' },
                    { label: 'Scale', value: `${scale}x`, icon: 'fa-expand' },
                    { label: 'Processing', value: 'Local/Browser', icon: 'fa-shield-halved' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                      <i className={`fas ${item.icon} text-violet-500 mb-2`}></i>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}
