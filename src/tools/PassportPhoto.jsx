import { useState, useRef, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const SIZES = [
    { name: 'Standard Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'US Passport', w: 51, h: 51, unit: 'mm', desc: '51×51mm (2×2")', cat: 'Passport' },
    { name: 'UK Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'UAE Passport', w: 40, h: 60, unit: 'mm', desc: '40×60mm', cat: 'Passport' },
    { name: 'Saudi Arabia', w: 40, h: 60, unit: 'mm', desc: '40×60mm', cat: 'Passport' },
    { name: 'Canada Passport', w: 50, h: 70, unit: 'mm', desc: '50×70mm', cat: 'Passport' },
    { name: 'Germany Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'Australia Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'China Passport', w: 33, h: 48, unit: 'mm', desc: '33×48mm', cat: 'Passport' },
    { name: 'Japan Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'France Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'Italy Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'Schengen Visa', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Visa' },
    { name: 'US Visa', w: 51, h: 51, unit: 'mm', desc: '51×51mm', cat: 'Visa' },
    { name: 'Aadhaar/PAN Card', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'ID' },
    { name: 'SSC Exam', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Exam' },
    { name: 'UPSC Exam', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Exam' },
    { name: 'Driving License', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'ID' },
    { name: 'Stamp Size', w: 25, h: 30, unit: 'mm', desc: '25×30mm', cat: 'ID' },
    { name: 'Visa Photo 35×35', w: 35, h: 35, unit: 'mm', desc: '35×35mm', cat: 'Visa' },
    { name: 'Custom', w: 35, h: 45, unit: 'mm', desc: 'Custom size', cat: 'Custom' },
]

const BACKGROUNDS = [
    { color: '#ffffff', name: 'White' },
    { color: '#f0f0f0', name: 'Light Gray' },
    { color: '#dce5f0', name: 'Light Blue' },
    { color: '#f5e6c8', name: 'Cream' },
    { color: '#ff0000', name: 'Red' },
    { color: 'none', name: 'None' },
]

const PAPER_SIZES = [
    { id: 'a4', label: 'A4', w: 210, h: 297, desc: '210×297mm' },
    { id: 'letter', label: 'Letter', w: 216, h: 279, desc: '8.5×11"' },
    { id: 'a5', label: 'A5', w: 148, h: 210, desc: '148×210mm' },
]

const DPI_OPTIONS = [
    { value: 200, label: '200 DPI', desc: 'Web/Screen' },
    { value: 300, label: '300 DPI', desc: 'Print' },
    { value: 600, label: '600 DPI', desc: 'High Print' },
]

const CATS = ['Passport', 'Visa', 'ID', 'Exam', 'Custom']

export default function PassportPhoto() {
    // Media State
    const [photo, setPhoto] = useState(null)
    const [isBgRemoved, setIsBgRemoved] = useState(false)
    const [bgProcessing, setBgProcessing] = useState(false)

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    // Adjustments
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [saturation, setSaturation] = useState(100)

    // Config State
    const [selectedSize, setSelectedSize] = useState(SIZES[0])
    const [customW, setCustomW] = useState(35)
    const [customH, setCustomH] = useState(45)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [copies, setCopies] = useState(8)
    const [quality, setQuality] = useState(95)
    const [sizeCat, setSizeCat] = useState('Passport')
    const [printDpi, setPrintDpi] = useState(300)
    const [printPaper, setPrintPaper] = useState(PAPER_SIZES[0])
    const [showGuides, setShowGuides] = useState(true)

    // Result & UI State
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef()

    const mmToPx = (mm) => Math.round(mm * printDpi / 25.4)

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        setPhoto({ url: URL.createObjectURL(file), file })
        setResult(null)
        setIsBgRemoved(false)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setBrightness(100)
        setContrast(100)
        setSaturation(100)
    }, [])

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const removeBg = async () => {
        if (!photo) return
        setBgProcessing(true)
        try {
            const bgModule = await import('@imgly/background-removal')
            const removeBackground = bgModule.removeBackground
            const blob = await removeBackground(photo.file, { output: { format: 'image/png' } })
            const url = URL.createObjectURL(blob)
            setPhoto({ url, file: blob })
            setIsBgRemoved(true)
        } catch (e) {
            console.error('BG Removal failed:', e)
            alert('Background removal failed. Please try again.')
        } finally {
            setBgProcessing(false)
        }
    }

    const generatePhoto = async () => {
        if (!photo || !croppedAreaPixels) return
        setProcessing(true)

        // Let UI update
        await new Promise(r => setTimeout(r, 50))

        try {
            const size = selectedSize.name === 'Custom' ? { w: customW, h: customH } : selectedSize
            const targetW_px = mmToPx(size.w)
            const targetH_px = mmToPx(size.h)

            // 1. Get raw cropped image
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = photo.url
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = () => {
                    resolve() // resolve anyway to avoid stuck process
                }
            })

            const singleCanvas = document.createElement('canvas')
            singleCanvas.width = targetW_px
            singleCanvas.height = targetH_px
            const sCtx = singleCanvas.getContext('2d')

            // Draw Background
            if (bgColor !== 'none') {
                sCtx.fillStyle = bgColor
                sCtx.fillRect(0, 0, targetW_px, targetH_px)
            }

            // Apply filters
            sCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

            // Draw crop
            sCtx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                targetW_px,
                targetH_px
            )

            // Reset filter for anything else
            sCtx.filter = 'none'

            // 2. Build PDF
            const { jsPDF } = await import('jspdf')
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: printPaper.id })
            const a4W = printPaper.w, a4H = printPaper.h
            const gap = 3

            // Calculate grid
            const usableW = a4W - 20 // 10mm margins on sides
            const cols = Math.floor((usableW + gap) / (size.w + gap))

            const totalLayoutW = cols * size.w + (cols - 1) * gap
            const startX = (a4W - totalLayoutW) / 2
            let startY = 35

            // Initial Header
            pdf.setFontSize(14)
            pdf.setTextColor(40)
            pdf.setFont("helvetica", "bold")
            pdf.text('Passport Photos — Print Ready', a4W / 2, 18, { align: 'center' })

            pdf.setFontSize(9)
            pdf.setTextColor(120)
            pdf.setFont("helvetica", "normal")
            pdf.text(`Size: ${size.w}×${size.h}mm • ${copies} Copies • Paper: ${printPaper.label}`, a4W / 2, 25, { align: 'center' })

            const dataUrl = singleCanvas.toDataURL('image/jpeg', quality / 100)

            // Generate multiple copies onto the grid
            let photoCount = 0
            let currentRow = 0

            while (photoCount < copies) {
                // Check if we need a new page (bottom margin ~20mm)
                if (startY + (currentRow + 1) * (size.h + gap) > a4H - 20 && currentRow > 0) {
                    pdf.addPage()
                    startY = 20
                    currentRow = 0
                }

                for (let col = 0; col < cols && photoCount < copies; col++) {
                    const x = startX + col * (size.w + gap)
                    const y = startY + currentRow * (size.h + gap)

                    pdf.addImage(dataUrl, 'JPEG', x, y, size.w, size.h)

                    // Cutting lines
                    if (showGuides) {
                        pdf.setDrawColor(200)
                        pdf.setLineDashPattern([1, 1], 0)
                        pdf.setLineWidth(0.2)
                        pdf.rect(x - 0.5, y - 0.5, size.w + 1, size.h + 1)
                    }
                    photoCount++
                }
                currentRow++
            }

            // Footer on the very last page
            const lastY = startY + currentRow * (size.h + gap)
            if (lastY < a4H - 15) {
                pdf.setFontSize(8)
                pdf.setTextColor(150)
                pdf.text('Print at 100% scale. Do NOT "Fit to Page" or "Scale to Fit".', a4W / 2, lastY + 8, { align: 'center' })
            }

            const blob = pdf.output('blob')
            setResult({
                url: URL.createObjectURL(blob),
                name: `passport_photos_${size.w}x${size.h}mm_${copies}copies.pdf`,
                singleUrl: singleCanvas.toDataURL('image/jpeg', quality / 100),
                singleName: `passport_${size.w}x${size.h}mm_HQ.jpg`,
            })

        } catch (e) {
            console.error(e)
            alert('An error occurred during generation.')
        }

        setProcessing(false)
    }

    const currentAspect = selectedSize.name === 'Custom' ? customW / customH : selectedSize.w / selectedSize.h

    return (
        <>
            <SEO title="Passport Size Photo Maker - Free Online" description="Create advanced passport size photos. Manual visual crop, AI background removal, custom copies setup, and print-ready formats." canonical="/passport-size-photo" />
            <ToolLayout toolSlug="passport-size-photo" title="Advanced Passport Photo Maker" description="Premium passport studio. Visually crop, auto-remove background, tune photo limits, and create bulk print-ready PDF sheets." breadcrumb="Passport Photo">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {!photo ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-id-card text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop your photo or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">We support manual crop and automatic backgrounds!</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-sm">
                                {/* Preview with Cropper */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">
                                        <i className="fas fa-crop-simple text-blue-500 mr-2"></i>Crop &amp; Adjust — {selectedSize.name}
                                    </span>
                                    <button onClick={() => { setPhoto(null); setResult(null); setIsBgRemoved(false) }} className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-full">
                                        <i className="fas fa-xmark mr-1"></i>Remove Photo
                                    </button>
                                </div>

                                <div className="relative w-full h-[380px] rounded-xl overflow-hidden shadow-inner border border-slate-200 group">
                                    <Cropper
                                        image={photo.url}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={currentAspect}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        style={{
                                            containerStyle: { background: bgColor !== 'none' ? bgColor : '#e2e8f0', backgroundImage: bgColor === 'none' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' },
                                            mediaStyle: { filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }
                                        }}
                                    />
                                    {/* Face guide overlay */}
                                    {showGuides && (
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity opacity-60 group-hover:opacity-100">
                                            <div className="border-[3px] border-dashed border-white/80 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] mix-blend-difference" style={{ width: '45%', height: '60%', marginTop: '-10%' }}></div>
                                        </div>
                                    )}
                                </div>

                                {/* Fine-tune Sliders */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 justify-between flex mb-1">
                                            <span><i className="fas fa-magnifying-glass mr-1"></i>Zoom</span>
                                            <span className="text-blue-600">{zoom.toFixed(1)}x</span>
                                        </label>
                                        <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={e => setZoom(+e.target.value)} className="slider-range w-full" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 justify-between flex mb-1">
                                            <span><i className="fas fa-sun mr-1"></i>Brightness</span>
                                            <span className="text-blue-600">{brightness}%</span>
                                        </label>
                                        <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(+e.target.value)} className="slider-range w-full" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 justify-between flex mb-1">
                                            <span><i className="fas fa-circle-half-stroke mr-1"></i>Contrast</span>
                                            <span className="text-blue-600">{contrast}%</span>
                                        </label>
                                        <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(+e.target.value)} className="slider-range w-full" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 justify-between flex mb-1">
                                            <span><i className="fas fa-droplet mr-1"></i>Saturation</span>
                                            <span className="text-blue-600">{saturation}%</span>
                                        </label>
                                        <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(+e.target.value)} className="slider-range w-full" />
                                    </div>
                                </div>

                                {/* AI Button */}
                                {!isBgRemoved && (
                                    <button onClick={removeBg} disabled={bgProcessing} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2">
                                        {bgProcessing ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> AI processing...</>
                                        ) : (
                                            <><i className="fas fa-wand-magic-sparkles"></i> Auto Remove Background</>
                                        )}
                                    </button>
                                )}

                                {/* Results Banner */}
                                {result && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                                                <i className="fas fa-check"></i>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-green-800">Ready to Print!</p>
                                                <p className="text-[10px] text-green-600">Your high quality layout is prepared successfully.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a href={result.url} download={result.name} className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                                                <i className="fas fa-file-pdf"></i> Download {copies} Print PDF
                                            </a>
                                            <a href={result.singleUrl} download={result.singleName} className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                                                <i className="fas fa-image"></i> Download Single Photo
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <i className="fas fa-sliders text-blue-500"></i> Settings
                            </h3>

                            {/* Photo Size categories */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Document Type</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {CATS.map(c => (
                                        <button key={c} onClick={() => setSizeCat(c)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${sizeCat === c ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-blue-50 border border-slate-100'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Standard Size Selector or Custom */}
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 stylish-scroll">
                                {SIZES.filter(s => s.cat === sizeCat).map(s => (
                                    <button key={s.name} onClick={() => setSelectedSize(s)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left border ${selectedSize.name === s.name ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                        <span className={`text-xs font-bold ${selectedSize.name === s.name ? 'text-blue-700' : 'text-slate-600'}`}>{s.name}</span>
                                        <span className={`text-[10px] ${selectedSize.name === s.name ? 'text-blue-500' : 'text-slate-400'}`}>{s.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom size inputs */}
                            {selectedSize.name === 'Custom' && (
                                <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-500 font-bold mb-1">Width (mm)</label>
                                        <input type="number" min="10" max="200" value={customW} onChange={e => setCustomW(+e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-500 font-bold mb-1">Height (mm)</label>
                                        <input type="number" min="10" max="200" value={customH} onChange={e => setCustomH(+e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            )}

                            {/* Background Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Background Canvas</label>
                                <div className="flex gap-2 flex-wrap">
                                    {BACKGROUNDS.map(b => (
                                        <button key={b.color} onClick={() => setBgColor(b.color)}
                                            className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 shadow-sm ${bgColor === b.color ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}
                                            style={{ backgroundColor: b.color === 'none' ? 'transparent' : b.color, backgroundImage: b.color === 'none' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' }}
                                            title={b.name}>
                                        </button>
                                    ))}
                                </div>
                                {!isBgRemoved && (
                                    <p className="text-[9px] text-amber-500 font-medium mt-1.5 flex items-center gap-1"><i className="fas fa-circle-exclamation"></i> Hit 'Auto Remove Background' to view canvas.</p>
                                )}
                            </div>

                            {/* Copies count wrapper */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">Number of Copies</label>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{copies} {copies === 1 ? 'Copy' : 'Copies'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 grid grid-cols-4 gap-1">
                                        {[4, 6, 8, 12].map(c => (
                                            <button key={c} onClick={() => setCopies(c)}
                                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${copies === c ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-16 relative">
                                        <input type="number" min="1" max="99" value={copies} onChange={e => setCopies(parseInt(e.target.value) || 1)} className="w-full h-full px-1 border border-slate-200 rounded-lg text-xs text-center font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" title="Custom Copies" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-3">
                                {/* Print Paper Selection */}
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Canvas Size</label>
                                    <select value={printPaper.id} onChange={(e) => setPrintPaper(PAPER_SIZES.find(p => p.id === e.target.value))} className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none">
                                        {PAPER_SIZES.map(p => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* DPI Selection */}
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Print Quality</label>
                                    <select value={printDpi} onChange={(e) => setPrintDpi(+e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none">
                                        {DPI_OPTIONS.map(d => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Cut Guides Slider Toggle */}
                            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-700">Dashed Cut Lines</p>
                                    <p className="text-[10px] text-slate-400">Guides for scissors</p>
                                </div>
                                <button onClick={() => setShowGuides(g => !g)}
                                    className={`w-10 h-5 rounded-full transition-all ${showGuides ? 'bg-blue-500' : 'bg-slate-300'} relative`}>
                                    <span className={`block w-4 h-4 bg-white rounded-full shadow transition-all absolute top-0.5 ${showGuides ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>

                            {/* Generate */}
                            <button onClick={generatePhoto} disabled={!photo || processing}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 text-sm">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating PDF...</>
                                ) : (
                                    <><i className="fas fa-print"></i> Generate {copies} Photos Layout</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <img
                        src="/images/tools/passport-photo-tool.png"
                        alt="Online Passport Size Photo Maker Interface"
                        title="Create Professional Passport Photos"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                    />

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Generate Perfect Passport and ID Photos at Home</h2>
                        <p>
                            Applying for a new passport, securing a travel visa, or registering for official government examinations often comes with notoriously strict photograph requirements. Historically, this meant taking time out of your day to visit a professional photography studio or a local pharmacy, paying premium prices for a simple sheet of four photos. With our online Passport Size Photo Maker, you can bypass the studio entirely. By combining advanced browser-based image cropping with precise millimeter-accurate PDF generation, you can transform a casual selfie taken in your living room into a perfectly formatted, print-ready document in less than a minute.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">A Comprehensive Library of Official Dimensions</h3>
                        <p>
                            One of the most frustrating aspects of bureaucratic applications is that every country and institution seems to require a slightly different photo size. A standard Schengen Visa demands a neat 35×45mm vertical rectangle, while a US Passport requires a perfectly square 2×2 inch (51×51mm) crop. Our utility comes pre-loaded with an extensive directory of official dimensions covering global passports, international visas, driver's licenses, and specific regional requirements like Indian PAN cards or UPSC/SSC examination formats. If your specific requirement isn't listed, simply select the "Custom" option to manually input the exact width and height you need.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Advanced AI Background Eraser</h3>
                        <p>
                            One of the most common reasons a passport application photograph is rejected by authorities is due to a dark, cluttered, or non-compliant background behind your head. Our tool integrates advanced, purely browser-based AI to automatically erase messy backgrounds flawlessly with a single click. Once stripped, you can utilize our studio selector to place a perfectly clean white, gray, or soft blue canvas back behind your head.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Preparing Your Photo for Printing</h3>
                        <p>
                            Once you have aligned your face using our intuitive visual guides, the tool doesn't just give you a single cropped image—it automatically generates a professional, high-resolution PDF document perfectly sized for standard A4 printer paper. You can choose whether you need a quick strip of four photos, or a full sheet of 24. We even automatically draw light, dotted cutting lines around each portrait so you know exactly where to trim with your scissors. Simply download the PDF and send it to your home printer or a local print shop.
                        </p>

                        <img
                            src="/images/tools/passport-photo-example.png"
                            alt="Visual showing a single portrait transformed into a printable A4 grid of passport photos"
                            title="Passport Photo Printing Layout Example"
                            loading="lazy"
                            className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                        />

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Tips for a Successfully Accepted Photograph</h3>
                        <p>
                            Even with perfect cropping and a pure white background, your photo can still be rejected if you don't follow basic biometric guidelines. Always ensure you are facing the camera directly, not angled to the side. Maintain a neutral facial expression—no wide smiles or frowning. Ensure both of your ears are visible, and remove any bulky glasses that might cause glare or obscure your eyes. Finally, make sure the original photograph was taken in a well-lit environment so there are no harsh, distracting shadows.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Essential Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Biometric Guidelines:</strong> The preview canvas features a helpful oval overlay designed to ensure your head and shoulders take up the correct percentage of the final cropped frame.</li>
                            <li><strong>Interactive Cropper:</strong> Precisely zoom and reposition your photo, controlling exactly how it fits inside the required official borders.</li>
                            <li><strong>Smart Generation:</strong> Choose precise number of copies. Our PDF generator automatically structures dynamic layouts from 1 single photo up to a 50 piece grid layout spanning multiple sheets.</li>
                            <li><strong>100% Data Privacy:</strong> Because this tool utilizes JavaScript to manipulate the canvas locally in your browser, your personal face data and identification photos are never uploaded to any remote server.</li>
                        </ul>

                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
