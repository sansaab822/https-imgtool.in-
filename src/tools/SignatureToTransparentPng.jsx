import { useState, useRef, useEffect, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Quick presets for signature ink colors ────────────────────────────────────
const INK_PRESETS = [
    { id: 'original', label: 'Original Ink', icon: 'fa-wand-magic-sparkles', desc: 'Preserves natural pen color & texture' },
    { id: 'black', label: 'Pure Black', icon: 'fa-pen-nib', color: '#000000', desc: 'Official black for legal & exam portals' },
    { id: 'blue', label: 'Executive Blue', icon: 'fa-pen', color: '#104ea0', desc: 'Deep royal blue ink for bank & KYC forms' },
    { id: 'custom', label: 'Custom Color', icon: 'fa-palette', desc: 'Pick any custom ink hue' },
]

export default function SignatureToTransparentPng() {
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState('signature')
    const [threshold, setThreshold] = useState(215) // Brightness threshold for paper removal
    const [darkness, setDarkness] = useState(1.2)  // Contrast / ink darkness multiplier
    const [smoothness, setSmoothness] = useState(18) // Edge feathering range in luminance
    const [inkMode, setInkMode] = useState('original')
    const [customInkColor, setCustomInkColor] = useState('#0f4c81')
    const [bgType, setBgType] = useState('transparent') // 'transparent' | 'white'
    const [autoCrop, setAutoCrop] = useState(true)
    const [cropPadding, setCropPadding] = useState(15) // Pixels padding around ink
    const [rotation, setRotation] = useState(0) // Degrees: 0, 90, 180, 270
    const [previewBg, setPreviewBg] = useState('checkerboard') // 'checkerboard' | 'white' | 'dark' | 'document'
    const [examFormat, setExamFormat] = useState(false) // Toggle 140x60 exam standard
    const [processing, setProcessing] = useState(false)
    const [copied, setCopied] = useState(false)
    const [stats, setStats] = useState({ width: 0, height: 0, inkPixels: 0 })

    const originalCanvasRef = useRef(null)
    const outputCanvasRef = useRef(null)
    const examCanvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // ── Load User Image ───────────────────────────────────────────────────────
    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        setFileName(file.name.replace(/\.[^/.]+$/, ''))
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                setImage(img)
                setRotation(0)
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [handleFile])

    // ── Sample Signature Generators (for instant preview without files) ───────
    const loadSample = (type = 'blue') => {
        const sampleCanvas = document.createElement('canvas')
        sampleCanvas.width = 600
        sampleCanvas.height = 250
        const ctx = sampleCanvas.getContext('2d')

        // Fill with realistic paper background with slight shadow gradient
        const grad = ctx.createLinearGradient(0, 0, 600, 250)
        grad.addColorStop(0, '#f9f8f4')
        grad.addColorStop(0.5, '#f3f1e9')
        grad.addColorStop(1, '#e8e5db')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 600, 250)

        // Add subtle lined paper rules
        ctx.strokeStyle = 'rgba(180, 200, 220, 0.35)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(20, 160); ctx.lineTo(580, 160)
        ctx.stroke()

        // Draw a realistic signature curve
        ctx.strokeStyle = type === 'blue' ? '#1a4f8b' : '#222222'
        ctx.lineWidth = 3.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.beginPath()
        ctx.moveTo(80, 150)
        ctx.bezierCurveTo(110, 60, 140, 170, 170, 110)
        ctx.bezierCurveTo(190, 80, 210, 150, 240, 120)
        ctx.bezierCurveTo(270, 90, 310, 140, 360, 115)
        ctx.bezierCurveTo(390, 100, 420, 160, 460, 125)
        ctx.stroke()

        // Add flourish loop & underline
        ctx.beginPath()
        ctx.lineWidth = 2.8
        ctx.moveTo(460, 125)
        ctx.bezierCurveTo(520, 80, 480, 170, 380, 175)
        ctx.bezierCurveTo(250, 180, 120, 175, 70, 178)
        ctx.stroke()

        // Add a dot
        ctx.beginPath()
        ctx.arc(495, 145, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = ctx.strokeStyle
        ctx.fill()

        const sampleImg = new Image()
        sampleImg.onload = () => {
            setImage(sampleImg)
            setFileName(`sample-signature-${type}`)
            setRotation(0)
        }
        sampleImg.src = sampleCanvas.toDataURL('image/jpeg', 0.92)
    }

    // ── Main Processing Pipeline ──────────────────────────────────────────────
    const processSignature = useCallback(() => {
        if (!image) return
        setProcessing(true)

        // 1. Render rotated source onto working canvas
        const isRotatedSideways = rotation === 90 || rotation === 270
        const srcW = isRotatedSideways ? image.naturalHeight : image.naturalWidth
        const srcH = isRotatedSideways ? image.naturalWidth : image.naturalHeight

        const workCanvas = document.createElement('canvas')
        workCanvas.width = srcW
        workCanvas.height = srcH
        const wCtx = workCanvas.getContext('2d', { willReadFrequently: true })

        wCtx.save()
        wCtx.translate(srcW / 2, srcH / 2)
        wCtx.rotate((rotation * Math.PI) / 180)
        wCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
        wCtx.restore()

        const imgData = wCtx.getImageData(0, 0, srcW, srcH)
        const data = imgData.data

        // Target ink color parsing
        let targetR = 0, targetG = 0, targetB = 0
        if (inkMode === 'black') {
            targetR = 0; targetG = 0; targetB = 0
        } else if (inkMode === 'blue') {
            targetR = 16; targetG = 78; targetB = 160
        } else if (inkMode === 'custom') {
            const hex = customInkColor.replace('#', '')
            targetR = parseInt(hex.substring(0, 2), 16) || 0
            targetG = parseInt(hex.substring(2, 4), 16) || 0
            targetB = parseInt(hex.substring(4, 6), 16) || 0
        }

        // Bounding box calculation for auto-crop
        let minX = srcW, minY = srcH, maxX = 0, maxY = 0
        let inkCount = 0

        const feather = Math.max(2, smoothness)
        const lowerBound = threshold - feather

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            // Perceptual luminance (Rec. 601)
            const lum = 0.299 * r + 0.587 * g + 0.114 * b

            let alpha = 0

            if (lum < lowerBound) {
                // Definite ink
                alpha = 255
            } else if (lum < threshold) {
                // Feathered anti-aliased edge
                const ratio = (threshold - lum) / feather
                alpha = Math.round(ratio * 255)
            } else {
                // Pure paper background
                alpha = 0
            }

            if (alpha > 0) {
                // Enhance ink contrast & density
                if (darkness !== 1.0) {
                    alpha = Math.min(255, Math.round(alpha * darkness))
                }

                const px = (i / 4) % srcW
                const py = Math.floor((i / 4) / srcW)

                if (alpha > 30) {
                    inkCount++
                    if (px < minX) minX = px
                    if (px > maxX) maxX = px
                    if (py < minY) minY = py
                    if (py > maxY) maxY = py
                }

                if (inkMode === 'original') {
                    // Retain original ink color, but clean paper tone
                    data[i] = r
                    data[i + 1] = g
                    data[i + 2] = b
                    data[i + 3] = bgType === 'transparent' ? alpha : 255
                } else {
                    // Replace with crisp target ink color
                    data[i] = targetR
                    data[i + 1] = targetG
                    data[i + 2] = targetB
                    data[i + 3] = bgType === 'transparent' ? alpha : 255
                }

                // If user selected clean white background instead of transparent
                if (bgType === 'white') {
                    const bgRatio = (255 - alpha) / 255
                    data[i] = Math.round(data[i] * (alpha / 255) + 255 * bgRatio)
                    data[i + 1] = Math.round(data[i + 1] * (alpha / 255) + 255 * bgRatio)
                    data[i + 2] = Math.round(data[i + 2] * (alpha / 255) + 255 * bgRatio)
                    data[i + 3] = 255
                }
            } else {
                if (bgType === 'white') {
                    data[i] = 255
                    data[i + 1] = 255
                    data[i + 2] = 255
                    data[i + 3] = 255
                } else {
                    data[i + 3] = 0
                }
            }
        }

        wCtx.putImageData(imgData, 0, 0)

        // 2. Render to final output canvas (with auto-crop if active)
        const outCanvas = outputCanvasRef.current
        if (!outCanvas) { setProcessing(false); return }

        if (autoCrop && inkCount > 50 && maxX > minX && maxY > minY) {
            const pad = cropPadding
            const cropX = Math.max(0, minX - pad)
            const cropY = Math.max(0, minY - pad)
            const cropW = Math.min(srcW - cropX, (maxX - minX) + pad * 2)
            const cropH = Math.min(srcH - cropY, (maxY - minY) + pad * 2)

            outCanvas.width = cropW
            outCanvas.height = cropH
            const outCtx = outCanvas.getContext('2d')
            outCtx.clearRect(0, 0, cropW, cropH)

            if (bgType === 'white') {
                outCtx.fillStyle = '#ffffff'
                outCtx.fillRect(0, 0, cropW, cropH)
            }

            outCtx.drawImage(workCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
            setStats({ width: cropW, height: cropH, inkPixels: inkCount })
        } else {
            outCanvas.width = srcW
            outCanvas.height = srcH
            const outCtx = outCanvas.getContext('2d')
            outCtx.clearRect(0, 0, srcW, srcH)

            if (bgType === 'white') {
                outCtx.fillStyle = '#ffffff'
                outCtx.fillRect(0, 0, srcW, srcH)
            }

            outCtx.drawImage(workCanvas, 0, 0)
            setStats({ width: srcW, height: srcH, inkPixels: inkCount })
        }

        // 3. Render 140x60 Exam Standard Canvas
        const examCanvas = examCanvasRef.current
        if (examCanvas) {
            examCanvas.width = 140
            examCanvas.height = 60
            const eCtx = examCanvas.getContext('2d')
            eCtx.fillStyle = '#ffffff'
            eCtx.fillRect(0, 0, 140, 60)

            // Fit signature proportionally within 124x48 padded area
            const maxW = 124
            const maxH = 48
            const curW = outCanvas.width
            const curH = outCanvas.height
            const scale = Math.min(maxW / curW, maxH / curH)
            const destW = Math.round(curW * scale)
            const destH = Math.round(curH * scale)
            const destX = Math.round((140 - destW) / 2)
            const destY = Math.round((60 - destH) / 2)

            eCtx.drawImage(outCanvas, 0, 0, curW, curH, destX, destY, destW, destH)
        }

        setProcessing(false)
    }, [image, threshold, darkness, smoothness, inkMode, customInkColor, bgType, autoCrop, cropPadding, rotation])

    useEffect(() => {
        if (image) {
            processSignature()
        }
    }, [image, threshold, darkness, smoothness, inkMode, customInkColor, bgType, autoCrop, cropPadding, rotation, processSignature])

    // ── Export Handlers ───────────────────────────────────────────────────────
    const downloadPng = () => {
        const canvas = outputCanvasRef.current
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `${fileName}-transparent-signature.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const downloadJpgWhite = () => {
        const canvas = outputCanvasRef.current
        if (!canvas) return
        // Create canvas with guaranteed white background
        const whiteCanvas = document.createElement('canvas')
        whiteCanvas.width = canvas.width
        whiteCanvas.height = canvas.height
        const ctx = whiteCanvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(canvas, 0, 0)

        const link = document.createElement('a')
        link.download = `${fileName}-clean-signature.jpg`
        link.href = whiteCanvas.toDataURL('image/jpeg', 0.95)
        link.click()
    }

    const downloadExamSpec = () => {
        const examCanvas = examCanvasRef.current
        if (!examCanvas) return
        const link = document.createElement('a')
        link.download = `${fileName}-exam-signature-140x60.jpg`
        link.href = examCanvas.toDataURL('image/jpeg', 0.90)
        link.click()
    }

    const copyToClipboard = async () => {
        const canvas = outputCanvasRef.current
        if (!canvas || !navigator.clipboard) return
        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
            }, 'image/png')
        } catch {
            alert('Clipboard image copy not supported in this browser. Please use the Download PNG button.')
        }
    }

    // WebApplication structured data schema
    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Signature to Transparent PNG & Background Remover',
        url: 'https://imgtool.in/signature-to-transparent-png',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. HTML5 Canvas compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Extract handwritten signatures from photos and remove paper backgrounds. Export crisp transparent PNGs or 140x60 exam signatures 100% in your browser.',
    }

    return (
        <>
            <SEO
                title="Signature to Transparent PNG - Extract Signature from Photo Free"
                description="Extract your handwritten signature from paper photos and remove the background. Convert to transparent PNG, black, or blue ink. 100% private in-browser tool."
                canonical="/signature-to-transparent-png"
                keywords="signature to transparent png, extract signature from photo, remove background from signature, transparent signature maker, convert signature to png, signature background remover, online signature extractor, 140x60 signature"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="signature-to-transparent-png"
                title="Signature to Transparent PNG Maker"
                description="Easily extract your handwritten signature from any paper photo or scan. Remove shadows, eliminate grey paper grain, and download a crisp, professional transparent PNG."
                breadcrumb="Signature to Transparent PNG"
            >
                {/* ── Main Interface Card ── */}
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Step 1: Upload or Sample Selection */}
                    {!image && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50/70 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform">
                                    <i className="fas fa-file-signature"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    Drop your signature photo here or <span className="text-teal-600 underline">browse</span>
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                                    Take a quick photo of your signature written on paper with your phone. Supports JPG, PNG, WebP, and HEIC.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                                    <span><i className="fas fa-shield-alt text-teal-600 mr-1"></i> 100% Private (Runs in Browser)</span>
                                    <span>•</span>
                                    <span><i className="fas fa-bolt text-amber-500 mr-1"></i> Instant Processing</span>
                                </div>
                            </div>

                            {/* Try with sample button */}
                            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                                <span>No photo on hand? Try an instant demo signature:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => loadSample('blue')}
                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="fas fa-pen text-blue-500"></i> Blue Pen Sample
                                    </button>
                                    <button
                                        onClick={() => loadSample('black')}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="fas fa-pen-nib text-slate-700"></i> Black Ink Sample
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Interactive Editor Dashboard */}
                    {image && (
                        <div className="grid lg:grid-cols-12 gap-6">

                            {/* Left Column: Visual Canvas Preview (7 cols) */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-800">Cleaned Signature Preview</span>
                                            {stats.width > 0 && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                                                    {stats.width} × {stats.height} px
                                                </span>
                                            )}
                                        </div>

                                        {/* Preview background toggles */}
                                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                                            <button
                                                title="Checkerboard (Transparent)"
                                                onClick={() => setPreviewBg('checkerboard')}
                                                className={`px-2 py-1 rounded font-medium transition-all ${previewBg === 'checkerboard' ? 'bg-white shadow text-teal-700' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                <i className="fas fa-border-none mr-1"></i> Transparent
                                            </button>
                                            <button
                                                title="White Paper"
                                                onClick={() => setPreviewBg('white')}
                                                className={`px-2 py-1 rounded font-medium transition-all ${previewBg === 'white' ? 'bg-white shadow text-teal-700' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                <i className="fas fa-square mr-1"></i> White
                                            </button>
                                            <button
                                                title="Document Simulation"
                                                onClick={() => setPreviewBg('document')}
                                                className={`px-2 py-1 rounded font-medium transition-all ${previewBg === 'document' ? 'bg-white shadow text-teal-700' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                <i className="fas fa-file-contract mr-1"></i> Doc View
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preview Box Container */}
                                    <div
                                        className={`relative rounded-xl overflow-hidden min-h-[280px] max-h-[460px] flex items-center justify-center p-6 border border-slate-200 transition-colors ${
                                            previewBg === 'checkerboard'
                                                ? 'bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-[length:20px_20px]'
                                                : previewBg === 'white'
                                                ? 'bg-white'
                                                : previewBg === 'dark'
                                                ? 'bg-slate-900'
                                                : 'bg-amber-50/50'
                                        }`}
                                    >
                                        {previewBg === 'document' && (
                                            <div className="absolute inset-x-8 bottom-12 border-b-2 border-slate-400/60 flex justify-between text-[11px] text-slate-400 font-mono pointer-events-none">
                                                <span>Authorized Signature</span>
                                                <span>Date: {new Date().toLocaleDateString()}</span>
                                            </div>
                                        )}

                                        {/* Canvas Output Element */}
                                        <canvas
                                            ref={outputCanvasRef}
                                            className="max-w-full max-h-[380px] object-contain drop-shadow-sm transition-all"
                                        />

                                        {/* Hidden Exam Canvas for instant 140x60 calculations */}
                                        <canvas ref={examCanvasRef} className="hidden" />

                                        {processing && (
                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                                                <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold">
                                                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                                    Enhancing strokes...
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Transform Bar */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 flex-wrap gap-2 text-xs text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => setRotation((r) => (r + 90) % 360)}
                                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <i className="fas fa-rotate-right"></i> Rotate 90°
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setThreshold(215)
                                                    setDarkness(1.2)
                                                    setSmoothness(18)
                                                    setInkMode('original')
                                                    setAutoCrop(true)
                                                    setRotation(0)
                                                }}
                                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                                            >
                                                <i className="fas fa-undo"></i> Reset
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setImage(null)}
                                            className="text-red-500 hover:text-red-700 font-semibold transition-colors flex items-center gap-1"
                                        >
                                            <i className="fas fa-trash-can"></i> Upload Different Photo
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Exam Format Card */}
                                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <h4 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                                            <i className="fas fa-graduation-cap text-teal-600"></i> Need Official Indian Exam Size?
                                        </h4>
                                        <p className="text-xs text-teal-800 mt-0.5">
                                            SSC, IBPS, UPSC, SBI & State PSC require exactly <strong>140×60px</strong> between <strong>10–20KB</strong>.
                                        </p>
                                    </div>
                                    <button
                                        onClick={downloadExamSpec}
                                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                                    >
                                        <i className="fas fa-file-download"></i> Download 140×60px JPG
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Fine-Tuning Controls (5 cols) */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                        <i className="fas fa-sliders text-teal-600"></i> Adjust Signature Quality
                                    </h3>

                                    {/* Control 1: Background Clean Sensitivity (Threshold) */}
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                                            <span>Background Clean Sensitivity</span>
                                            <span className="text-teal-600 font-mono">{threshold}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="140"
                                            max="245"
                                            value={threshold}
                                            onChange={(e) => setThreshold(Number(e.target.value))}
                                            className="w-full accent-teal-600 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>Keep Faint Marks</span>
                                            <span>Erase Dark Shadows</span>
                                        </div>
                                    </div>

                                    {/* Control 2: Ink Darkness / Thickness */}
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                                            <span>Ink Darkness / Contrast</span>
                                            <span className="text-teal-600 font-mono">{darkness.toFixed(1)}×</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.6"
                                            max="2.5"
                                            step="0.1"
                                            value={darkness}
                                            onChange={(e) => setDarkness(Number(e.target.value))}
                                            className="w-full accent-teal-600 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>Natural Light</span>
                                            <span>Deep Bold Pen</span>
                                        </div>
                                    </div>

                                    {/* Control 3: Edge Smoothing / Feathering */}
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                                            <span>Stroke Smoothness</span>
                                            <span className="text-teal-600 font-mono">{smoothness}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="35"
                                            value={smoothness}
                                            onChange={(e) => setSmoothness(Number(e.target.value))}
                                            className="w-full accent-teal-600 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>Crisp Sharp</span>
                                            <span>Soft Anti-Aliased</span>
                                        </div>
                                    </div>

                                    {/* Control 4: Ink Color Selector */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                                            Ink Color Enhancement
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {INK_PRESETS.map((p) => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setInkMode(p.id)}
                                                    className={`p-2.5 rounded-xl border text-left transition-all ${
                                                        inkMode === p.id
                                                            ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-bold ring-1 ring-teal-600'
                                                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <i className={`fas ${p.icon} ${p.id === 'blue' ? 'text-blue-600' : p.id === 'black' ? 'text-slate-900' : 'text-teal-600'}`}></i>
                                                        <span>{p.label}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {inkMode === 'custom' && (
                                            <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                                <input
                                                    type="color"
                                                    value={customInkColor}
                                                    onChange={(e) => setCustomInkColor(e.target.value)}
                                                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                                                />
                                                <span className="text-xs font-mono text-slate-600">{customInkColor}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Control 5: Auto-crop Whitespace */}
                                    <div className="pt-2 border-t border-slate-100 space-y-3">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-xs font-semibold text-slate-700">Auto-Crop Empty Margins</span>
                                            <input
                                                type="checkbox"
                                                checked={autoCrop}
                                                onChange={(e) => setAutoCrop(e.target.checked)}
                                                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                                            />
                                        </label>

                                        {autoCrop && (
                                            <div className="flex items-center justify-between text-xs text-slate-600 pl-4 border-l-2 border-teal-200">
                                                <span>Crop Padding:</span>
                                                <div className="flex gap-1.5">
                                                    {[5, 15, 30].map((px) => (
                                                        <button
                                                            key={px}
                                                            onClick={() => setCropPadding(px)}
                                                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                                cropPadding === px ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {px}px
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Primary Action Buttons */}
                                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                                        <button
                                            onClick={downloadPng}
                                            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <i className="fas fa-file-arrow-down text-base"></i> Download Transparent PNG
                                        </button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={downloadJpgWhite}
                                                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <i className="fas fa-image text-slate-500"></i> White JPG
                                            </button>

                                            <button
                                                onClick={copyToClipboard}
                                                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <i className={`fas ${copied ? 'fa-check text-green-600' : 'fa-copy text-slate-500'}`}></i>
                                                {copied ? 'Copied PNG!' : 'Copy to Clipboard'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Comprehensive SEO & Practical Guide */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                How to Extract a Signature from a Photo and Remove Paper Background
                            </h2>

                            <p className="text-base leading-relaxed">
                                Uploading a handwritten signature is an unavoidable requirement when submitting government exam applications, signing PDF contracts, applying for bank loans, or completing online passport renewals. However, almost everyone encounters the same frustrating problem: when you take a photograph of your signature on paper using a smartphone, the resulting photo looks dull, with yellowish lighting, heavy shadows from your hand or phone, and a dirty grey paper background.
                            </p>

                            <p className="text-base leading-relaxed">
                                Pasting a dark rectangular photo onto an official form or digital document looks unprofessional and often causes government upload portals (like <strong>SSC, UPSC, IBPS, or NSDL</strong>) to reject the submission for non-compliance. Our free online <strong>Signature to Transparent PNG Maker</strong> uses intelligent client-side canvas image processing to detect pen ink strokes, completely isolate them, and erase the background into a clean, crystal-clear transparent PNG in milliseconds.
                            </p>

                            {/* Feature Highlights Grid */}
                            <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
                                <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">100% Private & Safe</h4>
                                    <p className="text-xs text-slate-600">Your biometric signature is never sent to a server. All image math runs locally in your web browser.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-crop-simple"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Smart Auto-Crop</h4>
                                    <p className="text-xs text-slate-600">Automatically trims wasted empty paper margins around your signature to keep file sizes under portal KB limits.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-palette"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Black & Blue Ink Modes</h4>
                                    <p className="text-xs text-slate-600">Convert faint ballpoint pens into executive dark blue or high-contrast official black ink with one click.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Step-by-Step: Best Practices for Capturing Your Signature
                            </h3>

                            <ol className="list-decimal pl-5 space-y-2.5">
                                <li>
                                    <strong>Use Plain White Paper:</strong> Sign on an unlined, plain white sheet of printer paper or sketchbook paper. Lined notebook paper has blue and red horizontal lines that take extra thresholding to eliminate.
                                </li>
                                <li>
                                    <strong>Pick a Dark Pen:</strong> Black gel pens, dark blue ballpoint pens, or fine-point markers produce the crispest edges and highest contrast.
                                </li>
                                <li>
                                    <strong>Ensure Bright, Uniform Lighting:</strong> Take the photo under natural daylight or directly beneath an overhead lamp. Hold your smartphone directly parallel to the paper, keeping your own shadow away from the signature area.
                                </li>
                                <li>
                                    <strong>Upload to IMG Tool:</strong> Drag and drop the photo above. Adjust the <em>Background Clean Sensitivity</em> slider until the paper disappears completely, leaving only clean pen strokes.
                                </li>
                                <li>
                                    <strong>Select Output Format:</strong> Choose <strong>Download Transparent PNG</strong> to paste into PDFs and Word documents, or click <strong>Download 140×60px JPG</strong> for SSC/IBPS exam portals.
                                </li>
                            </ol>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Transparent PNG vs. Pure White JPG: Which One Do You Need?
                            </h3>

                            <div className="overflow-x-auto not-prose my-4">
                                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                                    <thead className="bg-slate-100 text-slate-700 font-bold">
                                        <tr>
                                            <th className="p-3 border-b border-slate-200">Use Case / Portal</th>
                                            <th className="p-3 border-b border-slate-200">Recommended Format</th>
                                            <th className="p-3 border-b border-slate-200">Why It Works Best</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">PDF Contracts & Word Documents</td>
                                            <td className="p-3 text-teal-700 font-bold">Transparent PNG</td>
                                            <td className="p-3 text-slate-600">Has no white background box; floats seamlessly over contract lines, legal stamps, and colored headers.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">SSC, UPSC, IBPS, SBI Exam Portals</td>
                                            <td className="p-3 text-blue-700 font-bold">White Background JPG (140×60px)</td>
                                            <td className="p-3 text-slate-600">Government exam validators reject transparent alpha channels. They require strict JPG format with clean white backing.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Email Signatures & Brand Logos</td>
                                            <td className="p-3 text-teal-700 font-bold">Transparent PNG</td>
                                            <td className="p-3 text-slate-600">Adapts automatically when recipients switch between Light Mode and Dark Mode in Gmail, Outlook, or Apple Mail.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Is my signature secure? Will it be saved on a server?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. Unlike cloud-based background removers that send your files to remote servers, IMG Tool processes your signature 100% locally in your device's browser memory using HTML5 Canvas. Your signature image is never uploaded, saved, logged, or shared.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Why did my pen strokes look broken or pixelated?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        If the <em>Background Clean Sensitivity</em> is turned up too high, very light or feathery pen strokes can be removed. Simply reduce the sensitivity slider slightly and increase the <em>Stroke Smoothness</em> slider to restore solid, anti-aliased edges.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Can I resize this signature to the 140×60 pixel exam standard?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Yes! Click the <strong>Download 140×60px JPG</strong> button above. The tool automatically centers your cleaned signature on a white 140×60 canvas and optimizes the file size between 10KB and 20KB to satisfy SSC, UPSC, and banking recruitment requirements.
                                    </p>
                                </div>
                            </div>

                            {/* Related Internal Tools Navigation */}
                            <div className="mt-8 pt-6 border-t border-slate-200 not-prose">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Related Document & Photo Tools</p>
                                <div className="flex flex-wrap gap-2">
                                    <a href="/signature-resize-140x60" className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-signature mr-1 text-teal-600"></i> Signature Resize 140×60
                                    </a>
                                    <a href="/ssc-signature-resizer" className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-graduation-cap mr-1 text-blue-600"></i> SSC Signature Resizer
                                    </a>
                                    <a href="/passport-size-photo" className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-id-card mr-1 text-indigo-600"></i> Passport Size Photo Maker
                                    </a>
                                    <a href="/compress-image-to-30kb" className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-compress-arrows-alt mr-1 text-orange-600"></i> Compress Image to 30KB
                                    </a>
                                    <a href="/pdf-to-jpg" className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-file-pdf mr-1 text-red-600"></i> PDF to JPG
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </ToolLayout>
        </>
    )
}

