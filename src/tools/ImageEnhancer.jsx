import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Luminance & blur analysis ──────────────────────────────────────────────
function analyzeImage(data, w, h) {
    let lumSum = 0
    // Laplacian for blur detection
    let lapSum = 0, lapCount = 0
    const n = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
        lumSum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    }
    // Sample Laplacian on a grid (fast, not every pixel)
    for (let y = 1; y < h - 1; y += 4) {
        for (let x = 1; x < w - 1; x += 4) {
            const c = (y * w + x) * 4
            const t = ((y - 1) * w + x) * 4
            const b = ((y + 1) * w + x) * 4
            const lf = (y * w + (x - 1)) * 4
            const rt = (y * w + (x + 1)) * 4
            const gC = 0.299 * data[c] + 0.587 * data[c + 1] + 0.114 * data[c + 2]
            const gT = 0.299 * data[t] + 0.587 * data[t + 1] + 0.114 * data[t + 2]
            const gB = 0.299 * data[b] + 0.587 * data[b + 1] + 0.114 * data[b + 2]
            const gL = 0.299 * data[lf] + 0.587 * data[lf + 1] + 0.114 * data[lf + 2]
            const gR = 0.299 * data[rt] + 0.587 * data[rt + 1] + 0.114 * data[rt + 2]
            const lap = gT + gB + gL + gR - 4 * gC
            lapSum += lap * lap
            lapCount++
        }
    }

    return {
        luminance: lumSum / n,
        blurScore: lapCount > 0 ? lapSum / lapCount : 999,
    }
}

// ── Smart enhancement using ctx.filter (100% reliable — no pixel math) ─────
async function runAIEnhancement(imgEl, onStep) {
    const W = imgEl.naturalWidth
    const H = imgEl.naturalHeight

    // ① Analyse original
    onStep('🔍 Analysing image quality...', 10)
    const aCanvas = document.createElement('canvas')
    aCanvas.width = W; aCanvas.height = H
    const aC = aCanvas.getContext('2d')
    aC.drawImage(imgEl, 0, 0)
    const raw = aC.getImageData(0, 0, W, H)
    const { luminance, blurScore } = analyzeImage(raw.data, W, H)

    const isBlurry = blurScore < 200
    const isVeryBlurry = blurScore < 40
    const isDark = luminance < 90
    const isOverExp = luminance > 175

    // ② Calculate smart filter values
    const brightnessVal = isDark ? 125 : isOverExp ? 88 : 108
    const contrastVal = isVeryBlurry ? 108 : 118
    const saturateVal = 118
    const sharpPasses = isVeryBlurry ? 4 : isBlurry ? 3 : 2
    const sharpAmt = isVeryBlurry ? 2.5 : isBlurry ? 1.8 : 1.1

    // ③ Primary enhancement via CSS filter on canvas (browser-native, never black)
    onStep(`⚙️ Applying smart corrections... (${isDark ? 'dark' : isOverExp ? 'overexposed' : 'normal'} image)`, 25)
    await tick()

    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.filter = `brightness(${brightnessVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%)`
    ctx.drawImage(imgEl, 0, 0)
    ctx.filter = 'none'

    // ④ Multi-pass unsharp mask using ctx.filter blur (reliable, no pixel-math overflow)
    const blurLabel = isVeryBlurry ? 'very blurry' : isBlurry ? 'blurry' : 'sharp'
    onStep(`🔧 Deblurring (${blurLabel}, ${sharpPasses} passes)...`, 40)
    await tick()

    for (let pass = 0; pass < sharpPasses; pass++) {
        onStep(`🔧 Sharpening pass ${pass + 1}/${sharpPasses}...`, 40 + pass * 12)
        await tick()
        await unsharpPass(ctx, canvas, W, H, sharpAmt, pass === 0 ? 1.5 : 1)
        await tick()
    }

    // ⑤ Final clarity micro-boost
    onStep('✨ Final clarity polish...', 88)
    await tick()
    await unsharpPass(ctx, canvas, W, H, 0.6, 0.5)

    // ⑥ Encode
    onStep('💾 Encoding result...', 96)
    await tick()
    return new Promise(resolve =>
        canvas.toBlob(b => resolve(URL.createObjectURL(b)), 'image/jpeg', 0.97)
    )
}

// Unsharp mask using browser's blur filter (zero risk of blackout)
async function unsharpPass(ctx, srcCanvas, W, H, amount, blurRadius) {
    // Get current painted pixels
    const origData = ctx.getImageData(0, 0, W, H)

    // Create blurred copy using ctx.filter = blur (browser handles this perfectly)
    const blurCanvas = document.createElement('canvas')
    blurCanvas.width = W; blurCanvas.height = H
    const bCtx = blurCanvas.getContext('2d')
    bCtx.filter = `blur(${blurRadius}px)`
    bCtx.drawImage(srcCanvas, 0, 0)
    bCtx.filter = 'none'
    const blurData = bCtx.getImageData(0, 0, W, H)

    // USM: result = original + amount * (original − blur)
    const d = origData.data
    const b = blurData.data
    for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, Math.max(0, d[i] + amount * (d[i] - b[i])))
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + amount * (d[i + 1] - b[i + 1])))
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + amount * (d[i + 2] - b[i + 2])))
    }
    ctx.putImageData(origData, 0, 0)
}

const tick = () => new Promise(r => setTimeout(r, 0))

// ── Component ─────────────────────────────────────────────────────────────
export default function ImageEnhancer() {
    const [image, setImage] = useState(null)
    const [resultUrl, setResultUrl] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [stepMsg, setStepMsg] = useState('')
    const [badge, setBadge] = useState(null)
    const [compareX, setCompareX] = useState(50)
    const [dragging, setDragging] = useState(false)
    const [dropOver, setDropOver] = useState(false)
    const compareRef = useRef()
    const inputRef = useRef()

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        setImage({ url: URL.createObjectURL(file), file })
        setResultUrl(null)
        setBadge(null)
        setCompareX(50)
    }, [])

    // Auto-enhance on upload
    useEffect(() => {
        if (image && !resultUrl && !processing) enhance()
    }, [image])

    const enhance = async () => {
        if (!image) return
        setProcessing(true)
        setResultUrl(null)
        setProgress(5)
        setStepMsg('Loading image...')

        try {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = image.url
            await new Promise(r => { img.onload = r; img.onerror = r })

            // Quick pre-analysis for badge
            const tmpC = document.createElement('canvas')
            tmpC.width = Math.min(img.naturalWidth, 400)
            tmpC.height = Math.min(img.naturalHeight, 400)
            const tmpCtx = tmpC.getContext('2d')
            tmpCtx.drawImage(img, 0, 0, tmpC.width, tmpC.height)
            const tmpData = tmpCtx.getImageData(0, 0, tmpC.width, tmpC.height)
            const { luminance, blurScore } = analyzeImage(tmpData.data, tmpC.width, tmpC.height)

            if (blurScore < 40) setBadge({ text: 'Very Blurry → Heavy deblur', color: 'red' })
            else if (blurScore < 200) setBadge({ text: 'Blurry detected → Deblur processing', color: 'amber' })
            else if (luminance < 90) setBadge({ text: 'Underexposed → Brightening', color: 'blue' })
            else if (luminance > 175) setBadge({ text: 'Overexposed → Tone correction', color: 'orange' })
            else setBadge({ text: 'Good quality → Color & sharpness boost', color: 'green' })

            const url = await runAIEnhancement(img, (msg, pct) => {
                setStepMsg(msg)
                setProgress(pct)
            })
            setResultUrl(url)
        } catch (err) {
            console.error('Enhance failed:', err)
            setStepMsg('❌ Error: ' + err.message)
        } finally {
            setProcessing(false)
            setProgress(100)
            setTimeout(() => setProgress(0), 600)
        }
    }

    // Compare slider
    const onMove = useCallback((e) => {
        if (!dragging || !compareRef.current) return
        const rect = compareRef.current.getBoundingClientRect()
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        setCompareX(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
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

    const badgeColors = {
        red: 'bg-red-50 text-red-700 border-red-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
        green: 'bg-green-50 text-green-700 border-green-200',
    }

    return (
        <>
            <SEO title="AI Image Enhancer - Fix Blur & Enhance Photos Free" description="Automatically enhance and deblur photos with AI. Upload any blurry or dark photo and get a sharp, vivid result instantly. Free &amp; private." canonical="/image-enhancer" />
            <ToolLayout toolSlug="image-enhancer" title="AI Image Enhancer" description="Upload any photo — blurry, dark, or dull — and AI instantly sharpens, brightens, and enhances it. Fully automatic. No settings needed." breadcrumb="Image Enhancer">

                {!image ? (
                    /* ── Upload ── */
                    <div
                        className={`drop-zone group cursor-pointer ${dropOver ? 'active' : ''}`}
                        style={{ padding: '3.5rem 2rem' }}
                        onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
                        onDragOver={e => { e.preventDefault(); setDropOver(true) }}
                        onDragLeave={() => setDropOver(false)}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                        <div className="flex flex-col items-center gap-5">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-400/40 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-wand-magic-sparkles text-white text-3xl"></i>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">AUTO AI</div>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-slate-800">Upload Any Photo</p>
                                <p className="text-slate-400 mt-1.5 text-sm">AI automatically fixes blur, corrects exposure &amp; boosts colors</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
                                {[
                                    { icon: 'fa-eye', label: 'Deblurs Images', color: 'from-violet-500 to-purple-600' },
                                    { icon: 'fa-sun', label: 'Fixes Exposure', color: 'from-amber-400 to-orange-500' },
                                    { icon: 'fa-droplet', label: 'Boosts Colors', color: 'from-pink-500 to-rose-500' },
                                ].map(f => (
                                    <div key={f.label} className="bg-slate-50 rounded-xl p-3 text-center">
                                        <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                                            <i className={`fas ${f.icon} text-white text-xs`}></i>
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-600 leading-tight">{f.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform text-sm">
                                <i className="fas fa-upload mr-2"></i>Choose Photo to Enhance
                            </button>
                            <p className="text-xs text-slate-400">Works on blurry, dark, or low-quality photos · 100% private</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Badge */}
                        {badge && (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${badgeColors[badge.color]}`}>
                                <i className={`fas ${badge.color === 'green' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                                {badge.text}
                            </div>
                        )}

                        {/* Progress */}
                        {processing && (
                            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                        <span className="text-sm font-semibold text-slate-700">{stepMsg}</span>
                                    </div>
                                    <span className="text-sm font-bold text-violet-600 tabular-nums">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Before / After Compare */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <span className="text-sm font-bold text-slate-700">
                                    {resultUrl ? '← Drag slider · Before / After →' : processing ? '⏳ Enhancing...' : 'Ready'}
                                </span>
                                <div className="flex gap-3">
                                    {!processing && <button onClick={enhance} className="text-xs text-violet-600 hover:text-violet-800 font-medium"><i className="fas fa-rotate-right mr-1"></i>Re-enhance</button>}
                                    <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-folder-open mr-1"></i>Change</button>
                                    <button onClick={() => { setImage(null); setResultUrl(null) }} className="text-xs text-red-400 hover:text-red-600"><i className="fas fa-trash mr-1"></i>Remove</button>
                                </div>
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                            </div>

                            <div
                                ref={compareRef}
                                className="relative select-none overflow-hidden bg-slate-100"
                                style={{ minHeight: 380, cursor: resultUrl ? 'col-resize' : 'default' }}
                                onMouseDown={() => resultUrl && setDragging(true)}
                                onTouchStart={() => resultUrl && setDragging(true)}
                            >
                                {/* Original (full width base) */}
                                <img
                                    src={image.url}
                                    alt="Original"
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                />

                                {/* Enhanced — clip from left edge to compareX */}
                                {resultUrl && (
                                    <div
                                        className="absolute inset-0 pointer-events-none overflow-hidden"
                                        style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}
                                    >
                                        <div className="absolute inset-0 bg-slate-100" />
                                        <img
                                            src={resultUrl}
                                            alt="Enhanced"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {/* Slider handle */}
                                {resultUrl && (
                                    <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareX}%` }}>
                                        <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-violet-100">
                                            <i className="fas fa-arrows-left-right text-violet-500 text-xs"></i>
                                        </div>
                                    </div>
                                )}

                                {/* Labels */}
                                <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none">ORIGINAL</div>
                                {resultUrl && <div className="absolute top-3 right-3 z-10 bg-violet-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none">✨ ENHANCED</div>}

                                {/* Processing overlay */}
                                {processing && !resultUrl && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <div className="bg-white/15 backdrop-blur rounded-2xl p-6 flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-white font-bold text-sm text-center">{stepMsg}</p>
                                            <div className="w-36 bg-white/20 rounded-full h-1.5">
                                                <div className="h-1.5 bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download */}
                        {resultUrl && !processing && (
                            <div className="flex gap-3">
                                <a
                                    href={resultUrl}
                                    download={`ai_enhanced_${image.file.name.replace(/\.[^.]+$/, '')}.jpg`}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 transition-all text-sm"
                                >
                                    <i className="fas fa-download text-base"></i>Download Enhanced Image
                                </a>
                                <button
                                    onClick={() => { setImage(null); setResultUrl(null) }}
                                    className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl text-sm transition-all"
                                >
                                    <i className="fas fa-plus mr-1"></i>New
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </ToolLayout>
        </>
    )
}
