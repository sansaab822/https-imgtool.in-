import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const BG_PRESETS = [
    { id: 'transparent', label: 'Transparent' },
    { id: '#ffffff', label: 'White' },
    { id: '#000000', label: 'Black' },
    { id: '#f1f5f9', label: 'Light Grey' },
    { id: '#1e293b', label: 'Dark Navy' },
    { id: '#ef4444', label: 'Red' },
    { id: '#3b82f6', label: 'Blue' },
    { id: '#22c55e', label: 'Green' },
    { id: '#f59e0b', label: 'Yellow' },
    { id: '#8b5cf6', label: 'Purple' },
    { id: '#ec4899', label: 'Pink' },
    { id: '#0ea5e9', label: 'Sky Blue' },
]

const CHECKER = {
    backgroundImage: 'conic-gradient(#e2e8f0 25%, white 0) 0 0 / 20px 20px',
}

function getContainerStyle(bgColor) {
    return bgColor === 'transparent' ? CHECKER : { backgroundColor: bgColor }
}

export default function BgRemover() {
    const [image, setImage] = useState(null)
    const [transparentUrl, setTransparentUrl] = useState(null)
    const [transparentBlob, setTransparentBlob] = useState(null)
    const [displayUrl, setDisplayUrl] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [statusMsg, setStatusMsg] = useState('')
    const [bgColor, setBgColor] = useState('transparent')
    const [customColor, setCustomColor] = useState('#6366f1')
    const [compareX, setCompareX] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const [dropOver, setDropOver] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const progressTimer = useRef(null)
    const compareRef = useRef()
    const inputRef = useRef()

    // ── File load ──────────────────────────────────────────────────────────
    const loadFile = useCallback((file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) { setErrorMsg('Please upload a valid image (JPG, PNG, WebP).'); return }
        setImage({ url: URL.createObjectURL(file), file })
        setTransparentUrl(null)
        setTransparentBlob(null)
        setDisplayUrl(null)
        setErrorMsg(null)
        setCompareX(50)
        setBgColor('transparent')
    }, [])

    // Auto-process on upload
    useEffect(() => {
        if (image && !transparentBlob && !processing) doRemove()
    }, [image])

    // Reapply bg when color changes and we have the transparent blob
    useEffect(() => {
        if (transparentBlob && !processing) applyBg(transparentBlob, bgColor)
    }, [bgColor, transparentBlob])

    // ── Fake progress ticker ───────────────────────────────────────────────
    const startProgress = (msgs) => {
        let i = 0
        setProgress(0)
        setStatusMsg(msgs[0])
        progressTimer.current = setInterval(() => {
            i = Math.min(i + 1, msgs.length - 1)
            setStatusMsg(msgs[i])
            setProgress(p => Math.min(p + (100 / (msgs.length * 2)), 90))
        }, 2000)
    }
    const stopProgress = () => {
        clearInterval(progressTimer.current)
        setProgress(100)
        setTimeout(() => setProgress(0), 800)
    }

    // ── Apply solid/transparent background over result ─────────────────────
    const applyBg = async (blob, color) => {
        const url = URL.createObjectURL(blob)
        const cleanUrl = url
        if (color === 'transparent') {
            setDisplayUrl(cleanUrl)
            return
        }
        const img = new Image()
        img.src = url
        await new Promise(r => { img.onload = r })
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')
        ctx.fillStyle = color
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        c.toBlob(b => setDisplayUrl(URL.createObjectURL(b)), 'image/jpeg', 0.96)
    }

    // ── Main AI removal ────────────────────────────────────────────────────
    const doRemove = async () => {
        if (!image) return
        setProcessing(true)
        setErrorMsg(null)
        startProgress([
            '📦 Loading AI model...',
            '🔍 Analyzing image...',
            '🧠 Detecting subject...',
            '✂️ Segmenting edges...',
            '🎨 Removing background...',
            '✅ Finalizing result...',
        ])

        try {
            // Dynamically import — must not pass publicPath (causes CDN 404 in v1.7.0)
            const bgRemovalModule = await import('@imgly/background-removal')
            const removeBg = bgRemovalModule.removeBackground

            // Only pass output config — no publicPath, no model (let library auto-select)
            const resultBlob = await removeBg(image.file, {
                output: { format: 'image/png' },
            })

            stopProgress()
            setTransparentBlob(resultBlob)
            const tUrl = URL.createObjectURL(resultBlob)
            setTransparentUrl(tUrl)
            await applyBg(resultBlob, bgColor)

        } catch (aiErr) {
            console.error('[BgRemover] AI removal error:', aiErr)
            stopProgress()

            // Fallback: smart canvas removal
            setStatusMsg('⚠️ AI model not available — using smart canvas removal...')
            try {
                await canvasRemoval()
            } catch (canvasErr) {
                console.error('[BgRemover] Canvas fallback error:', canvasErr)
                setErrorMsg('Background removal failed. Please try a different image or browser.')
            }
        } finally {
            setProcessing(false)
        }
    }

    // ── Canvas flood-fill fallback ─────────────────────────────────────────
    const canvasRemoval = async () => {
        const img = new Image()
        img.src = image.url
        await new Promise(r => { img.onload = r })

        const W = img.naturalWidth
        const H = img.naturalHeight
        const c = document.createElement('canvas')
        c.width = W; c.height = H
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const imgD = ctx.getImageData(0, 0, W, H)
        const d = imgD.data

        // Sample four corners for BG color
        const getPixel = (x, y) => {
            const i = (y * W + x) * 4
            return [d[i], d[i + 1], d[i + 2]]
        }
        const corners = [getPixel(0, 0), getPixel(W - 1, 0), getPixel(0, H - 1), getPixel(W - 1, H - 1)]
        const bgR = corners.reduce((a, c) => a + c[0], 0) / 4
        const bgG = corners.reduce((a, c) => a + c[1], 0) / 4
        const bgB = corners.reduce((a, c) => a + c[2], 0) / 4

        for (let i = 0; i < d.length; i += 4) {
            const dist = Math.sqrt((d[i] - bgR) ** 2 + (d[i + 1] - bgG) ** 2 + (d[i + 2] - bgB) ** 2)
            const alpha = Math.min(255, Math.max(0, Math.round((dist / 70) * 255)))
            d[i + 3] = Math.min(d[i + 3], alpha)
        }

        ctx.putImageData(imgD, 0, 0)
        const blob = await new Promise(r => c.toBlob(r, 'image/png'))

        setTransparentBlob(blob)
        const tUrl = URL.createObjectURL(blob)
        setTransparentUrl(tUrl)
        await applyBg(blob, bgColor)
    }

    // ── Compare slider ─────────────────────────────────────────────────────
    const onMove = useCallback((e) => {
        if (!isDragging || !compareRef.current) return
        const rect = compareRef.current.getBoundingClientRect()
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        setCompareX(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
    }, [isDragging])

    useEffect(() => {
        if (!isDragging) return
        const stop = () => setIsDragging(false)
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
    }, [isDragging, onMove])

    return (
        <>
            <SEO title="AI Background Remover - Remove BG Free Online" description="Remove image backgrounds automatically with AI. Transparent PNG output or custom background. 100% private — runs in your browser." canonical="/bg-remover" />
            <ToolLayout toolSlug="bg-remover" title="AI Background Remover" description="Upload any photo — AI instantly removes the background. Choose custom background colors with live preview." breadcrumb="Background Remover">

                {!image ? (
                    /* ── Upload Zone ── */
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
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/40 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-scissors text-white text-4xl"></i>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-green-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse">AI</div>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-slate-800">Remove Background Instantly</p>
                                <p className="text-slate-400 text-sm mt-1.5">Drop any photo — AI removes background <span className="text-purple-600 font-semibold">automatically</span></p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['👤 Portraits', '🛍️ Products', '🐾 Animals', '🌸 Plants', '🚗 Objects'].map(t => (
                                    <span key={t} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">{t}</span>
                                ))}
                            </div>
                            <button className="px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform text-sm">
                                <i className="fas fa-upload mr-2"></i>Upload Image
                            </button>
                            <p className="text-xs text-slate-400">JPG, PNG, WebP · 100% private — no server upload</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* ── Preview Area ── */}
                        <div className="lg:col-span-2 space-y-4">

                            {/* Progress */}
                            {processing && (
                                <div className="bg-white rounded-2xl border border-purple-100 p-5 space-y-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                            <span className="text-sm font-semibold text-slate-700">{statusMsg}</span>
                                        </div>
                                        <span className="text-sm font-bold text-purple-600 tabular-nums">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-700"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 text-center">
                                        First run downloads AI model (~10-30s). After that it's instant.
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {errorMsg && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <i className="fas fa-circle-exclamation text-red-500 text-lg mt-0.5 flex-shrink-0"></i>
                                    <div>
                                        <p className="text-sm font-semibold text-red-700">{errorMsg}</p>
                                        <button onClick={doRemove} className="text-xs text-red-600 underline hover:text-red-800 mt-1">Try again</button>
                                    </div>
                                </div>
                            )}

                            {/* Before / After */}
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-slate-700">
                                        {displayUrl ? '← Original / Result → (drag slider)' : processing ? '⏳ AI Processing...' : 'Ready'}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 font-medium hover:underline">
                                            <i className="fas fa-folder-open mr-1"></i>Change
                                        </button>
                                        <button onClick={() => { setImage(null); setTransparentBlob(null); setDisplayUrl(null) }} className="text-xs text-red-400 hover:text-red-600">
                                            <i className="fas fa-trash mr-1"></i>Remove
                                        </button>
                                    </div>
                                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                                </div>

                                <div
                                    ref={compareRef}
                                    className="relative select-none overflow-hidden"
                                    style={{ minHeight: 380, cursor: displayUrl ? 'col-resize' : 'default', ...CHECKER }}
                                    onMouseDown={() => displayUrl && setIsDragging(true)}
                                    onTouchStart={() => displayUrl && setIsDragging(true)}
                                >
                                    {/* Original */}
                                    <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />

                                    {/* Result with bg applied (clip left→compareX) */}
                                    {displayUrl && (
                                        <div
                                            className="absolute inset-0 pointer-events-none overflow-hidden"
                                            style={{ clipPath: `inset(0 0 0 ${compareX}%)` }}
                                        >
                                            <div className="absolute inset-0" style={getContainerStyle(bgColor)} />
                                            <img src={displayUrl} alt="Result" className="absolute inset-0 w-full h-full object-contain" />
                                        </div>
                                    )}

                                    {/* Slider */}
                                    {displayUrl && (
                                        <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareX}%` }}>
                                            <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-purple-100">
                                                <i className="fas fa-arrows-left-right text-purple-500 text-xs"></i>
                                            </div>
                                        </div>
                                    )}

                                    {/* Labels */}
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none">ORIGINAL</div>
                                    {displayUrl && (
                                        <div className="absolute top-3 right-3 z-10 bg-purple-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none">✨ BG REMOVED</div>
                                    )}

                                    {/* AI Processing Overlay */}
                                    {processing && (
                                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-7 flex flex-col items-center gap-4">
                                                <div className="relative w-14 h-14">
                                                    <div className="absolute inset-0 rounded-full border-4 border-purple-300/30" />
                                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-400 animate-spin" />
                                                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
                                                </div>
                                                <p className="text-white font-bold text-sm text-center">{statusMsg}</p>
                                                <div className="w-40 bg-white/20 rounded-full h-1.5">
                                                    <div className="h-1.5 bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span><i className="fas fa-image mr-1"></i>{image.file.name}</span>
                                    <span>{(image.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Controls ── */}
                        <div className="space-y-4">
                            {/* Background color picker */}
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <i className="fas fa-palette text-purple-500"></i>Background Color
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {BG_PRESETS.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setBgColor(p.id)}
                                            title={p.label}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${bgColor === p.id ? 'border-purple-500 scale-105 shadow-md' : 'border-transparent hover:border-slate-300'
                                                }`}
                                            style={p.id === 'transparent' ? CHECKER : { backgroundColor: p.id }}
                                        >
                                            {bgColor === p.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <i className="fas fa-check text-white text-xs drop-shadow-lg"></i>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom color */}
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-xs text-slate-500 font-medium flex-shrink-0">Custom:</span>
                                    <label className="relative" style={{ cursor: 'pointer' }}>
                                        <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                        <div className="w-9 h-9 rounded-lg border-2 border-slate-200" style={{ backgroundColor: customColor }} />
                                    </label>
                                    <button
                                        onClick={() => setBgColor(customColor)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${bgColor === customColor ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >Apply Custom</button>
                                </div>
                            </div>

                            {/* Re-process */}
                            <button
                                onClick={() => { setTransparentBlob(null); setTransparentUrl(null); setDisplayUrl(null); doRemove() }}
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                                    : <><i className="fas fa-rotate"></i>Re-Process with AI</>
                                }
                            </button>

                            {/* Upload new */}
                            <button onClick={() => inputRef.current?.click()}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                                <i className="fas fa-plus"></i>Upload New Image
                            </button>

                            {/* Downloads */}
                            {displayUrl && !processing && (
                                <div className="space-y-2">
                                    <a
                                        href={transparentUrl}
                                        download={`removed-bg-${image.file.name.replace(/\.[^.]+$/, '')}.png`}
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/25 text-sm"
                                    >
                                        <i className="fas fa-download"></i>Download Transparent PNG
                                    </a>
                                    {bgColor !== 'transparent' && (
                                        <a
                                            href={displayUrl}
                                            download={`bg-replaced-${image.file.name.replace(/\.[^.]+$/, '')}.jpg`}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
                                        >
                                            <i className="fas fa-image"></i>Download With Background
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Info box */}
                            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-4 text-xs space-y-1.5 border border-purple-100">
                                <p className="font-bold text-slate-700 mb-2">🔒 100% Private</p>
                                <p className="text-slate-500"><i className="fas fa-microchip mr-1.5 text-purple-500"></i>AI model runs in your browser</p>
                                <p className="text-slate-500"><i className="fas fa-ban mr-1.5 text-green-500"></i>No image sent to any server</p>
                                <p className="text-slate-500"><i className="fas fa-image mr-1.5 text-blue-500"></i>Output: lossless transparent PNG</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <img
                        src="/images/tools/bg-remover-tool.png"
                        alt="AI Background Remover Tool Interface"
                        title="Remove Backgrounds Automatically"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                    />

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Flawless AI Background Removal in Seconds</h2>
                        <p>
                            Historically, cutting an object or person out of a photograph required expensive desktop software like Photoshop and hours of meticulous work using lasso or pen tools. Erasing stray hairs or complex edges was a notoriously frustrating task reserved only for professional graphic designers. Thankfully, artificial intelligence has completely revolutionized this workflow. Our advanced background remover tool uses sophisticated machine learning models to instantly identify the main subject of your photograph, perfectly tracing its edges, and erasing everything behind it in a matter of seconds. The entire process requires exactly zero technical skill.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Uncompromising Privacy and Security</h3>
                        <p>
                            Perhaps the most revolutionary feature of our background eraser is exactly *where* it operates. Most competing online AI tools force you to upload your sensitive photographs to their corporate servers, process the image in the cloud, and send the result back. We utilize cutting-edge WebAssembly (Wasm) technology to run the entire AI model directly inside your local web browser. This means that your personal photos, proprietary product shots, and confidential documents never leave your device. Your data remains 100% private, and you never have to worry about data breaches or hidden storage policies.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Essential for E-commerce and Marketing</h3>
                        <p>
                            Clean product photography is absolutely essential for driving sales online. Marketplaces like Amazon and eBay actually require all product listings to feature pure white backgrounds. Our utility allows e-commerce sellers to shoot products in their living room, drop the photo into our tool, strip away the messy background, and instantly replace it with a solid white hex code in one click. Similarly, digital marketers use this utility to cut out portraits of executives or team members for professional slide decks, YouTube thumbnails, and corporate website biographies without needing to hire a retoucher.
                        </p>
                        <p>
                            Once you have successfully isolated your subject, you might discover that the final file size is a bit too large for your website due to the uncompressed PNG format it creates. If that happens, simply drop your new transparent image into our <a href="/image-compressor" className="text-purple-600 hover:underline">Image Compressor Tool</a>. Likewise, if you need to adjust the physical dimensions of the cutout before sending it to a client, you can use our <a href="/image-resizer" className="text-purple-600 hover:underline">Image Resizer Tool</a> or convert it utilizing the <a href="/png-to-jpg" className="text-purple-600 hover:underline">PNG to JPG Converter</a> if maintaining transparency is no longer required.
                        </p>

                        <img
                            src="/images/tools/bg-remover-example.png"
                            alt="Visual Comparison of AI Background Eraser Result"
                            title="Background Eraser Example"
                            loading="lazy"
                            className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                        />

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Pro Tips for the Best Results</h3>
                        <p>
                            While the AI is incredibly smart, you can significantly improve its accuracy by feeding it ideal source material. The model performs best when there is a clear, high-contrast separation between your subject and the background. For example, a person wearing a dark shirt standing against a bright, lightly textured wall will result in a flawless, instantaneous cutout. Conversely, trying to extract a brown dog lying against brown dirt in low lighting will force the AI to guess the edges, which might result in a slightly softer or less accurate mask. Always strive for good lighting and sharp focus.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Core Features of Our Eraser</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Zero Click Operation:</strong> The moment you drop your photo onto the canvas, the AI automatically begins parsing the visual data without requiring you to click any buttons.</li>
                            <li><strong>Solid Color Replacement:</strong> Instantly swap the removed background for a transparent canvas, a harsh black or white backdrop, or any specific custom hex code color.</li>
                            <li><strong>Offline Capability:</strong> After the initial ~20MB AI model downloads to your browser cache during your very first visit, the tool can essentially function offline.</li>
                            <li><strong>Complex Edge Detection:</strong> The neural network is specifically trained to handle historically difficult boundaries like frizzy hair, animal fur, and translucent glass.</li>
                            <li><strong>Interactive Comparison:</strong> Drag the vertical slider left and right to verify the accuracy of the semantic segmentation before you finalize the download.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">What format should I download to keep the background transparent?</h4>
                                <p className="mt-1">You must download the result as a PNG file. The PNG format specifically supports an alpha channel (transparency). If you attempt to save the transparent image as a JPG, the blank space will automatically render as solid white.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why does it take a few seconds to load the first time?</h4>
                                <p className="mt-1">Because this tool prioritizes your privacy by processing everything locally on your machine, it must first download a small, highly optimized AI model (roughly 15-20MB) into your browser session. Subsequent images will process almost instantaneously.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Does the tool reduce the quality or resolution of my subject?</h4>
                                <p className="mt-1">No, the AI is designed to preserve the original resolution and fidelity of the main subject. The only pixels that are modified or removed are those that the neural network determines belong to the surrounding background area.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can it remove backgrounds from complex objects like bicycles or trees?</h4>
                                <p className="mt-1">Yes! While human portraits and solid products are the easiest subjects, the underlying model is trained on millions of diverse images and can effectively trace through the spokes of a bicycle or the spaces between tree branches.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What happens if the AI makes a mistake?</h4>
                                <p className="mt-1">No AI is perfectly infallible. If the automatic segmentation misses a piece of the background or accidentally chops off a part of the subject, it usually means the image contrast is too low. In such rare cases, we recommend attempting to slightly brighten or add contrast to the original photo before trying again.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
