import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── PAN Card photo official specs ─────────────────────────────────────────────
// NSDL/UTI requirement: 3.5cm × 2.5cm (35mm × 25mm) at minimum 200 DPI
// Width = 25mm, Height = 35mm (portrait orientation for face)
const PAN_W_MM = 25   // width in mm
const PAN_H_MM = 35   // height in mm

const OUTPUT_OPTS = [
    { id: 'jpg', label: 'JPG', mime: 'image/jpeg', ext: 'jpg', desc: 'Smaller file, ideal for online upload' },
    { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png', desc: 'Lossless, best quality for printing' },
]

const DPI_OPTS = [
    { value: 200, label: '200 DPI', desc: 'Online forms' },
    { value: 300, label: '300 DPI', desc: 'Print quality' },
    { value: 600, label: '600 DPI', desc: 'High resolution' },
]

const QUALITY_OPTS = [
    { value: 85, label: 'Good (85%)', desc: '~50 KB' },
    { value: 92, label: 'High (92%)', desc: '~90 KB' },
    { value: 98, label: 'Max (98%)', desc: '~200 KB' },
]

const BG_OPTS = [
    { color: '#ffffff', name: 'White (Standard)' },
    { color: '#f0f4fa', name: 'Light Blue' },
    { color: '#f5f5f5', name: 'Off-White' },
    { color: 'none', name: 'Transparent' },
]

const PRINT_COPIES = [
    { count: 4, label: '4 Copies', cols: 2, desc: '2×2 grid' },
    { count: 6, label: '6 Copies', cols: 3, desc: '3×2 grid' },
    { count: 8, label: '8 Copies', cols: 4, desc: '4×2 grid' },
]

// Convert mm to pixels at given DPI
const mmToPx = (mm, dpi) => Math.round((mm / 25.4) * dpi)

export default function PanCardPhoto() {
    const [photo, setPhoto] = useState(null)   // { url, file }
    const [bg, setBg] = useState('#ffffff')
    const [dpi, setDpi] = useState(300)
    const [quality, setQuality] = useState(92)
    const [outputFmt, setOutputFmt] = useState('jpg')
    const [copies, setCopies] = useState(PRINT_COPIES[0])
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)   // { single, sheet, sheetPdf }
    const [dropOver, setDropOver] = useState(false)
    const [error, setError] = useState(null)

    const inputRef = useRef()
    const imgRef = useRef()

    const fmt = OUTPUT_OPTS.find(o => o.id === outputFmt)

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
        setError(null)
        setResult(null)
        setPhoto({ url: URL.createObjectURL(file), file })
    }, [])

    // ── Generate PAN card photo sheet ──────────────────────────────────────────
    const generate = async () => {
        if (!imgRef.current) return
        setProcessing(true)
        setError(null)
        setResult(null)
        await new Promise(r => setTimeout(r, 30))

        try {
            const img = imgRef.current
            const panW = mmToPx(PAN_W_MM, dpi)  // e.g. 295px at 300 DPI
            const panH = mmToPx(PAN_H_MM, dpi)  // e.g. 413px at 300 DPI
            const mimeStr = fmt.mime
            const q = quality / 100

            // ── Step 1: Crop & resize to exact PAN dimensions ────────────────────
            const singleCanvas = document.createElement('canvas')
            singleCanvas.width = panW
            singleCanvas.height = panH
            const sCtx = singleCanvas.getContext('2d')

            // Fill background
            if (bg !== 'none') {
                sCtx.fillStyle = bg
                sCtx.fillRect(0, 0, panW, panH)
            }

            // Center-crop the image to match the PAN aspect ratio
            const imgRatio = img.naturalWidth / img.naturalHeight
            const panRatio = panW / panH
            let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
            if (imgRatio > panRatio) {
                sw = img.naturalHeight * panRatio
                sx = (img.naturalWidth - sw) / 2
            } else {
                sh = img.naturalWidth / panRatio
                sy = (img.naturalHeight - sh) / 2
            }
            sCtx.imageSmoothingEnabled = true
            sCtx.imageSmoothingQuality = 'high'
            sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, panW, panH)

            // ── Step 2: Export single file ─────────────────────────────────────
            const singleDataUrl = singleCanvas.toDataURL(mimeStr, q)

            // ── Step 3: Build print sheet (multiple copies on 2480×3508 px A4@300 DPI) ──
            const a4W = mmToPx(210, dpi)       // e.g. 2480 at 300 DPI
            const a4H = mmToPx(297, dpi)       // e.g. 3508 at 300 DPI
            const gap = mmToPx(3, dpi)         // 3mm gap
            const cols = copies.cols
            const rows = Math.ceil(copies.count / cols)

            const sheetCanvas = document.createElement('canvas')
            sheetCanvas.width = a4W
            sheetCanvas.height = a4H
            const shCtx = sheetCanvas.getContext('2d')

            // White A4 background
            shCtx.fillStyle = '#ffffff'
            shCtx.fillRect(0, 0, a4W, a4H)

            // Header text
            shCtx.fillStyle = '#4a5568'
            shCtx.font = `bold ${mmToPx(6, dpi)}px Arial`
            shCtx.textAlign = 'center'
            shCtx.fillText('PAN Card Photos — Print Ready (100% Scale)', a4W / 2, mmToPx(12, dpi))

            shCtx.fillStyle = '#a0aec0'
            shCtx.font = `${mmToPx(4, dpi)}px Arial`
            shCtx.fillText(`Size: ${PAN_W_MM}×${PAN_H_MM}mm · ${copies.label} · ${dpi} DPI`, a4W / 2, mmToPx(19, dpi))

            const totalW = cols * panW + (cols - 1) * gap
            const totalH = rows * panH + (rows - 1) * gap
            const startX = (a4W - totalW) / 2
            const startY = mmToPx(26, dpi)

            // Draw each photo + dashed border
            let count = 0
            for (let r = 0; r < rows && count < copies.count; r++) {
                for (let c = 0; c < cols && count < copies.count; c++) {
                    const px = startX + c * (panW + gap)
                    const py = startY + r * (panH + gap)

                    shCtx.drawImage(singleCanvas, px, py, panW, panH)

                    // Dashed cut border
                    shCtx.save()
                    shCtx.setLineDash([mmToPx(1.5, dpi), mmToPx(1.5, dpi)])
                    shCtx.strokeStyle = '#cbd5e0'
                    shCtx.lineWidth = 1
                    shCtx.strokeRect(px, py, panW, panH)
                    shCtx.restore()
                    count++
                }
            }

            // Footer
            shCtx.fillStyle = '#a0aec0'
            shCtx.font = `${mmToPx(3.5, dpi)}px Arial`
            shCtx.fillText('Cut along dashed lines · Do NOT scale — print at 100% (Actual Size)', a4W / 2, startY + totalH + mmToPx(8, dpi))

            const sheetDataUrl = sheetCanvas.toDataURL('image/jpeg', 0.92)

            // ── Step 4: Also create a PDF for A4 print ─────────────────────────
            const { jsPDF } = await import('jspdf')
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const a4Wmm = 210, a4Hmm = 297
            const gapMm = 3

            // PDF Header
            pdf.setFontSize(11); pdf.setTextColor(80)
            pdf.text('PAN Card Photos — Print Ready', a4Wmm / 2, 12, { align: 'center' })
            pdf.setFontSize(7); pdf.setTextColor(150)
            pdf.text(`Size: ${PAN_W_MM}×${PAN_H_MM}mm · ${copies.label} · Print at 100% scale`, a4Wmm / 2, 18, { align: 'center' })

            const imgDataUrl4Pdf = singleCanvas.toDataURL('image/jpeg', 0.96)
            const totalWmm = cols * PAN_W_MM + (cols - 1) * gapMm
            const startXmm = (a4Wmm - totalWmm) / 2
            const startYmm = 24

            let pdfCount = 0
            for (let r = 0; r < rows && pdfCount < copies.count; r++) {
                for (let c = 0; c < cols && pdfCount < copies.count; c++) {
                    const xmm = startXmm + c * (PAN_W_MM + gapMm)
                    const ymm = startYmm + r * (PAN_H_MM + gapMm)
                    pdf.addImage(imgDataUrl4Pdf, 'JPEG', xmm, ymm, PAN_W_MM, PAN_H_MM)
                    pdf.setDrawColor(200); pdf.setLineDashPattern([1, 1], 0)
                    pdf.rect(xmm, ymm, PAN_W_MM, PAN_H_MM)
                    pdfCount++
                }
            }
            pdf.setFontSize(7); pdf.setTextColor(160)
            pdf.text('Cut along dotted lines · Print at 100% scale on A4 paper', a4Wmm / 2, a4Hmm - 12, { align: 'center' })

            const pdfBlob = pdf.output('blob')
            const pdfUrl = URL.createObjectURL(pdfBlob)

            setResult({
                single: singleDataUrl,
                singleName: `pan_photo_${PAN_W_MM}x${PAN_H_MM}mm.${fmt.ext}`,
                sheet: sheetDataUrl,
                sheetName: `pan_photos_${copies.count}copies.jpg`,
                pdfUrl,
                pdfName: `pan_card_photos_${copies.count}copies.pdf`,
                sizePx: `${panW} × ${panH} px`,
                dpi,
            })
        } catch (err) {
            console.error('[PanCardPhoto]', err)
            setError('Processing failed. Please try a different image.')
        } finally {
            setProcessing(false)
        }
    }

    const reset = () => {
        setPhoto(null); setResult(null); setError(null)
    }

    const downloadDataUrl = (dataUrl, filename) => {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => document.body.removeChild(a), 200)
    }

    // ── JSON-LD Schema ─────────────────────────────────────────────────────────
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "PAN Card Photo Resizer",
                "applicationCategory": "PhotographyApplication",
                "operatingSystem": "Any",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
                "description": "Resize and format photos for PAN card applications to the exact NSDL/UTI specification of 25×35mm. Download single photo or print-ready A4 PDF.",
                "url": "https://imgtool.in/pan-card-photo"
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "What is the correct size for a PAN card photo?", "acceptedAnswer": { "@type": "Answer", "text": "The official NSDL and UTI requirement for a PAN card application photo is 25mm (width) × 35mm (height), with a white background and a minimum resolution of 200 DPI." } },
                    { "@type": "Question", "name": "Can I use a mobile photo for PAN card?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can upload any clear selfie or portrait photo (JPG, PNG, WebP). Our tool will crop it to the correct 25×35mm ratio and resize it to match the required DPI." } },
                    { "@type": "Question", "name": "Is my photo safe when I use this tool?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. This tool runs entirely in your browser using JavaScript. Your photo is never uploaded to any server and stays private on your device throughout the entire process." } },
                ]
            }
        ]
    }

    return (
        <>
            <SEO
                title="PAN Card Photo Resizer — Correct 25×35mm Size, Free Online"
                description="Resize your photo to the exact PAN card dimensions: 25mm × 35mm at 300 DPI. NSDL/UTI compliant. Download a single photo or print 4–8 copies on A4 paper. 100% free, browser-based."
                canonical="/pan-card-photo"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <ToolLayout
                toolSlug="pan-card-photo"
                title="PAN Card Photo Resizer"
                description="Resize your photo to the official NSDL/UTI PAN card dimensions (25×35mm) and download a print-ready A4 sheet. 100% browser-based — your image never leaves your device."
                breadcrumb="PAN Card Photo"
            >
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* ── LEFT PANEL: Upload & Preview ───────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                                <i className="fas fa-exclamation-circle flex-shrink-0" />
                                {error}
                                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                            </div>
                        )}

                        {/* Info banner */}
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                            <i className="fas fa-info-circle mt-0.5 flex-shrink-0 text-amber-500" />
                            <div>
                                <strong>Official PAN Card Photo Size:</strong> 25mm × 35mm, white background, minimum 200 DPI.
                                Upload any portrait/selfie — we'll auto-crop and resize to fit perfectly.
                            </div>
                        </div>

                        {/* Upload / Preview area */}
                        {!photo ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dropOver ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDropOver(false); loadFile(e.dataTransfer.files[0]) }}
                                onDragOver={e => { e.preventDefault(); setDropOver(true) }}
                                onDragLeave={() => setDropOver(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden"
                                    onChange={e => loadFile(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-4 p-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-id-card text-white text-2xl" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop your photo or <span className="text-orange-500">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP — any size up to 15 MB</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mt-2 text-center text-xs">
                                        {[
                                            { icon: 'fa-ruler-combined', label: '25×35mm', sub: 'Exact NSDL size' },
                                            { icon: 'fa-print', label: '300 DPI', sub: 'Print ready' },
                                            { icon: 'fa-shield-alt', label: '100% Private', sub: 'Browser only' },
                                        ].map(f => (
                                            <div key={f.label} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                                                <i className={`fas ${f.icon} text-orange-400 mb-1`} />
                                                <p className="font-bold text-slate-700">{f.label}</p>
                                                <p className="text-slate-400">{f.sub}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Preview header */}
                                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <i className="fas fa-image text-orange-400" />
                                        Photo Preview
                                        <span className="text-xs font-normal text-slate-400">({PAN_W_MM}×{PAN_H_MM}mm · {dpi} DPI)</span>
                                    </div>
                                    <button onClick={reset} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                                        <i className="fas fa-xmark" /> Remove
                                    </button>
                                </div>

                                {/* Preview */}
                                <div className="p-6 flex items-center justify-center bg-slate-50 min-h-[280px]">
                                    <div className="flex items-start gap-8">
                                        {/* Original */}
                                        <div className="text-center space-y-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Your Photo</p>
                                            <img ref={imgRef} src={photo.url} alt="Original"
                                                className="max-h-56 max-w-[220px] object-cover rounded-lg shadow-md border border-slate-200"
                                                crossOrigin="anonymous" />
                                        </div>

                                        {/* Arrow */}
                                        <div className="self-center">
                                            <div className="w-10 h-10 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center">
                                                <i className="fas fa-chevron-right text-orange-500" />
                                            </div>
                                        </div>

                                        {/* Preview at ratio */}
                                        <div className="text-center space-y-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">PAN Size ({PAN_W_MM}×{PAN_H_MM}mm)</p>
                                            <div className="relative inline-block shadow-md border border-slate-200 rounded-lg overflow-hidden"
                                                style={{
                                                    width: `${PAN_W_MM * 5}px`,
                                                    height: `${PAN_H_MM * 5}px`,
                                                    background: bg !== 'none' ? bg : 'repeating-conic-gradient(#e2e8f0 0% 25%,#f8fafc 0% 50%) 0 0/16px 16px',
                                                }}>
                                                <img src={photo.url} alt="PAN preview"
                                                    className="absolute inset-0 w-full h-full object-cover" />
                                                {/* Head position guide */}
                                                <div className="absolute inset-0 flex items-start justify-center pt-[10%] pointer-events-none">
                                                    <div className="w-[50%] h-[55%] border-2 border-dashed border-orange-300/60 rounded-full" title="Align face here" />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400">← Center face in oval</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Result downloads */}
                                {result && (
                                    <div className="px-5 pb-5 space-y-3">
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <i className="fas fa-circle-check text-green-500" />
                                            <span className="text-sm font-bold text-green-800">
                                                PAN Card photo generated! ({result.sizePx} at {result.dpi} DPI)
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* Single photo */}
                                            <button onClick={() => downloadDataUrl(result.single, result.singleName)}
                                                className="flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg">
                                                <i className="fas fa-image" /> Single Photo
                                            </button>
                                            {/* Sheet preview image */}
                                            <button onClick={() => downloadDataUrl(result.sheet, result.sheetName)}
                                                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg">
                                                <i className="fas fa-th" /> {copies.count} Photos JPG
                                            </button>
                                            {/* PDF */}
                                            <a href={result.pdfUrl} download={result.pdfName}
                                                className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg">
                                                <i className="fas fa-file-pdf" /> Print PDF
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT PANEL: Settings ────────────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders-h text-orange-500" /> Photo Settings
                            </h3>

                            {/* Spec display */}
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs space-y-1 text-slate-600">
                                <p className="font-bold text-orange-700 mb-1">NSDL/UTI Requirements</p>
                                <p><i className="fas fa-ruler-combined text-orange-400 mr-1.5" />Size: 25mm × 35mm</p>
                                <p><i className="fas fa-circle text-orange-400 mr-1.5" />Background: White</p>
                                <p><i className="fas fa-print text-orange-400 mr-1.5" />Min: 200 DPI</p>
                                <p><i className="fas fa-face-smile text-orange-400 mr-1.5" />Face: Centre, neutral expression</p>
                            </div>

                            {/* Background */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Background Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {BG_OPTS.map(b => (
                                        <button key={b.color} onClick={() => setBg(b.color)} title={b.name}
                                            className={`w-9 h-9 rounded-lg border-2 transition-all ${bg === b.color ? 'border-orange-500 scale-110 shadow-md' : 'border-slate-200 hover:border-orange-300'}`}
                                            style={{
                                                background: b.color === 'none'
                                                    ? 'repeating-conic-gradient(#e2e8f0 0% 25%,#f8fafc 0% 50%) 0 0/12px 12px'
                                                    : b.color
                                            }} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">White is the official requirement</p>
                            </div>

                            {/* Output format */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {OUTPUT_OPTS.map(o => (
                                        <button key={o.id} onClick={() => setOutputFmt(o.id)}
                                            className={`py-2.5 rounded-xl text-center transition-all border-2 ${outputFmt === o.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-200'}`}>
                                            <p className={`text-xs font-bold ${outputFmt === o.id ? 'text-orange-600' : 'text-slate-600'}`}>{o.label}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">{o.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* DPI */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Resolution (DPI)</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {DPI_OPTS.map(d => (
                                        <button key={d.value} onClick={() => setDpi(d.value)}
                                            className={`py-2 rounded-xl text-center transition-all ${dpi === d.value ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-orange-50'}`}>
                                            <p className="text-xs font-bold">{d.label}</p>
                                            <p className={`text-[9px] ${dpi === d.value ? 'text-orange-100' : 'text-slate-400'}`}>{d.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality (JPG only) */}
                            {outputFmt === 'jpg' && (
                                <div>
                                    <label className="block text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">JPG Quality</label>
                                    <div className="space-y-1.5">
                                        {QUALITY_OPTS.map(q => (
                                            <button key={q.value} onClick={() => setQuality(q.value)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${quality === q.value ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-orange-50'}`}>
                                                <span className="text-xs font-semibold">{q.label}</span>
                                                <span className={`text-[10px] ${quality === q.value ? 'text-orange-100' : 'text-slate-400'}`}>{q.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Print copies */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Copies Per A4 Sheet</label>
                                <div className="space-y-1.5">
                                    {PRINT_COPIES.map(c => (
                                        <button key={c.count} onClick={() => setCopies(c)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${copies.count === c.count ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            <span className="text-xs font-semibold">{c.label}</span>
                                            <span className={`text-[10px] ${copies.count === c.count ? 'text-blue-200' : 'text-slate-400'}`}>{c.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate */}
                            <button onClick={generate} disabled={!photo || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                                ) : (
                                    <><i className="fas fa-id-card" /> Generate PAN Card Photo</>
                                )}
                            </button>

                            {photo && (
                                <button onClick={reset} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                    <i className="fas fa-upload mr-1" /> Upload New Photo
                                </button>
                            )}
                        </div>

                        {/* Print tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                                <i className="fas fa-lightbulb text-amber-500" /> Print Tips
                            </h4>
                            {[
                                'Print PDF at 100% scale — never "Fit to Page"',
                                'Use glossy or matte photo paper for best results',
                                'Cut cleanly along the dashed border lines',
                                'Keep face centred, neutral expression, no glasses',
                                'White background is mandatory for PAN applications',
                            ].map(tip => (
                                <div key={tip} className="flex items-start gap-2 text-xs text-slate-600">
                                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0" /> {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SEO Content ─────────────────────────────────────────────────────── */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <img
                        src="/images/tools/pan-card-photo-tool.png"
                        alt="PAN Card Photo Resizer Tool — Resize photo to 25×35mm for NSDL/UTI"
                        title="Free PAN Card Photo Resizer Online"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                    />

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">
                            How to Get the Correct Photo for Your PAN Card Application
                        </h2>
                        <p>
                            A PAN (Permanent Account Number) card is one of the most essential financial identity documents in India.
                            Whether you are applying fresh, reapplying after a lost card, or requesting corrections, NSDL and UTI —
                            the two official agencies that process PAN applications — have strict rules about the photograph you submit.
                            The required dimensions are 25mm wide by 35mm tall, with a minimum resolution of 200 DPI and a pure white
                            background. Most smartphones take photos that are several megabytes in size and nowhere near these
                            specifications. Submitting the wrong photo format is one of the most common reasons PAN applications
                            get rejected or delayed.
                        </p>
                        <p>
                            Our PAN Card Photo Resizer solves this completely. Upload any clear portrait photo — a selfie, a scanned
                            studio photo, or an existing passport-style photograph — and the tool automatically crops it to the correct
                            25×35mm aspect ratio, scales it to your chosen DPI (200, 300, or 600), and lets you save it as either a
                            JPG or a lossless PNG file. The entire process takes under ten seconds and happens entirely within your
                            browser. Your photo is never sent to any server.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">
                            Understanding the Official Photo Specifications
                        </h3>
                        <p>
                            The exact specifications come directly from the NSDL PAN application guidelines:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-sm not-prose">
                            {[
                                ['Dimensions', '25mm (W) × 35mm (H) — portrait orientation'],
                                ['Background', 'Plain white or near-white'],
                                ['Expression', 'Neutral — mouth closed, no wide smile'],
                                ['Eyes', 'Open, looking directly into camera'],
                                ['Glasses', 'Avoid glasses to prevent rejection'],
                                ['Headwear', 'Not allowed (except religious reasons)'],
                                ['Min. Resolution', '200 DPI (300 DPI recommended for print)'],
                                ['File type for upload', 'JPG preferred for online NSDL/UTI portals'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-start gap-3">
                                    <span className="font-semibold text-slate-700 w-36 flex-shrink-0">{k}:</span>
                                    <span className="text-slate-600">{v}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">
                            Three Download Options for Every Use Case
                        </h3>
                        <p>
                            After generating your resized photo, you get three distinct download options. The <strong>Single Photo</strong>
                            download gives you the precisely sized JPG or PNG file ready for direct upload to the NSDL or UTI online
                            portal when applying digitally. The <strong>Multi-Copy JPG Sheet</strong> gives you 4, 6, or 8 photos
                            arranged neatly on a standard A4 canvas — useful if you want to preview the layout or send the image to a
                            print shop. Finally, the <strong>Print PDF</strong> is the most useful option for physical applications:
                            it places your photos at exact millimeter dimensions on an A4 page with dashed cutting guides, so you can
                            print at home and cut them cleanly with scissors.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">
                            Preparing the Perfect PAN Card Photo at Home
                        </h3>
                        <p>
                            Taking your own photo at home is perfectly acceptable for a PAN card application — you do not need to
                            visit a studio. However, a few simple steps will dramatically improve the quality:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Find even lighting.</strong> Stand near a window with natural light facing you. Avoid sitting with a window behind you, which silhouettes your face.</li>
                            <li><strong>Use a plain wall.</strong> A white or cream-coloured wall makes the background removal step unnecessary entirely.</li>
                            <li><strong>Take the photo at eye level.</strong> Propping your phone on a stack of books and using the timer produces a much more consistent, professional-looking result than a handheld selfie.</li>
                            <li><strong>Remove background if needed.</strong> If your background isn't white, run your photo through our <a href="/bg-remover" className="text-orange-500 hover:underline">Background Remover</a> first, then bring the clean cutout into this tool and select the white background option.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">
                            Printing the PDF Sheet Correctly
                        </h3>
                        <p>
                            The single most critical rule for printing the generated PDF is: <strong>always print at 100% scale</strong>.
                            In Adobe Acrobat Reader, this setting appears as "Actual size" in the page sizing options. In Windows'
                            built-in PDF viewer or Microsoft Edge, look for the scale dropdown and manually type "100". On a Mac,
                            the print dialog has a "Scale: 100%" option. If your printer software scales the page to "Fit to Printable
                            Area" or similar, your 25mm photos will come out the wrong size and your application may be rejected.
                            Always verify by measuring one printed photo with a ruler before cutting all of them.
                        </p>
                        <p>
                            For a more complete set of identity photo tools, you can also explore our <a href="/passport-size-photo" className="text-orange-500 hover:underline">Passport Size Photo Maker</a> for international photo formats, or our <a href="/aadhaar-card-print-setting-a4" className="text-orange-500 hover:underline">Aadhaar Print A4 Tool</a> to generate perfectly scaled Aadhaar card print sheets. If you need to reduce your file size after generating the photo, our <a href="/image-compressor" className="text-orange-500 hover:underline">Image Compressor</a> can help you meet online portal upload limits.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <h4 className="font-bold text-slate-700">What is the exact photo size required for a PAN card?</h4>
                                <p className="mt-1">
                                    According to the official NSDL and UTI guidelines, PAN card application photographs must be 25mm wide
                                    and 35mm tall (portrait orientation). The background should be white, and the photo should be of recent
                                    origin — ideally taken within the last six months.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I submit a digital copy of my photo for online PAN applications?</h4>
                                <p className="mt-1">
                                    Yes. For online applications filed through the NSDL or UTI Infratech portals, you typically upload a
                                    JPG image direct from your device. Use the "Single Photo" download from our tool, which gives you a
                                    correctly sized JPG or PNG ready for upload. The file size should generally be between 20KB and 200KB
                                    for most portal requirements.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why is my photo getting rejected even though I followed the size rules?</h4>
                                <p className="mt-1">
                                    Beyond dimensions, rejections often happen because of a non-white background, facial accessories like
                                    sunglasses or caps, heavy shadows across the face, a photo that is clearly older than six months or
                                    taken from a social media profile, or a selfie angle where the ears are not visible. Try to take a new
                                    photo specifically for the PAN application, following the guidelines above.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is there a file size limit for uploading on NSDL?</h4>
                                <p className="mt-1">
                                    The NSDL portal typically accepts JPG files between 20 KB and 100 KB for passport-style photographs
                                    submitted online. Use our "Good (85%)" quality setting for JPG output if your file is too large, or
                                    run it through our <a href="/image-compressor" className="text-orange-500 hover:underline">Image Compressor</a> after downloading to reduce it further.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Does this tool watermark the generated photo?</h4>
                                <p className="mt-1">
                                    No. There are absolutely no watermarks, logos, or branding of any kind added to your generated photo
                                    or PDF. The output is a completely clean, professional image suitable for official government submissions.
                                    It is also 100% free to use, with no account required.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Does the tool crop my face automatically?</h4>
                                <p className="mt-1">
                                    The tool performs a center crop of your image to match the 25×35mm aspect ratio. It shows you a face
                                    position guide overlay on the preview so you can see whether your face is well-centred. For best results,
                                    make sure your face is centred in your original photo before uploading, and that there is a reasonable
                                    amount of space above your head and below your chin.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
