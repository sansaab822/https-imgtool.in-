import { useState, useRef } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const COPY_OPTIONS = [
    { count: 2, label: '2 Copies' },
    { count: 4, label: '4 Copies' },
    { count: 6, label: '6 Copies' },
]

export default function AadhaarPrint() {
    const [frontImg, setFrontImg] = useState(null)
    const [backImg, setBackImg] = useState(null)
    const [copies, setCopies] = useState(2)
    const [grayscale, setGrayscale] = useState(false)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const frontRef = useRef()
    const backRef = useRef()

    const loadImg = (file, setter) => {
        if (!file) return
        setter(URL.createObjectURL(file))
        setResult(null)
    }

    const imgToDataUrl = (img, gray = false) => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (gray) ctx.filter = 'grayscale(100%)'
        ctx.drawImage(img, 0, 0)
        ctx.filter = 'none'
        return canvas.toDataURL('image/jpeg', 0.95)
    }

    const generatePrintSheet = async () => {
        if (!frontImg && !backImg) return
        setProcessing(true)
        await new Promise(r => setTimeout(r, 50))

        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const a4W = 210, a4H = 297
        const cardW = 85.6, cardH = 53.98
        const gap = 4

        // Header
        pdf.setFontSize(13)
        pdf.setTextColor(80)
        pdf.text('Aadhaar Card Print — A4 Sheet', a4W / 2, 15, { align: 'center' })
        pdf.setFontSize(8)
        pdf.setTextColor(150)
        pdf.text(`${copies} copies · Print at 100% scale · Do not scale to fit`, a4W / 2, 22, { align: 'center' })

        // Load images
        let frontDataUrl = null, backDataUrl = null
        if (frontImg) {
            const img = new Image(); img.src = frontImg
            await new Promise(r => { img.onload = r })
            frontDataUrl = imgToDataUrl(img, grayscale)
        }
        if (backImg) {
            const img = new Image(); img.src = backImg
            await new Promise(r => { img.onload = r })
            backDataUrl = imgToDataUrl(img, grayscale)
        }

        // Layout: pairs of front+back per row
        const hasBoth = frontDataUrl && backDataUrl
        const colWidth = hasBoth ? cardW * 2 + gap : cardW
        const startX = (a4W - colWidth) / 2
        let curY = 30

        for (let c = 0; c < copies; c++) {
            if (curY + cardH + 10 > a4H - 20) {
                pdf.addPage()
                curY = 20
            }

            if (frontDataUrl) {
                const x = startX
                pdf.addImage(frontDataUrl, 'JPEG', x, curY, cardW, cardH)
                // Cutting guides
                pdf.setDrawColor(200)
                pdf.setLineDashPattern([1, 1], 0)
                pdf.rect(x, curY, cardW, cardH)
                pdf.setFontSize(7); pdf.setTextColor(180)
                pdf.text('Front', x + cardW / 2, curY - 1.5, { align: 'center' })
            }
            if (backDataUrl) {
                const x = startX + (hasBoth ? cardW + gap : 0)
                if (!hasBoth) { curY += cardH + gap }
                pdf.addImage(backDataUrl, 'JPEG', x, curY, cardW, cardH)
                pdf.setDrawColor(200)
                pdf.setLineDashPattern([1, 1], 0)
                pdf.rect(x, curY, cardW, cardH)
                pdf.setFontSize(7); pdf.setTextColor(180)
                pdf.text('Back', x + cardW / 2, curY - 1.5, { align: 'center' })
            }

            curY += cardH + gap + 4
        }

        // Footer
        pdf.setFontSize(7); pdf.setTextColor(180)
        pdf.text('Cut along dotted lines. Card size: 85.6×54mm (standard ID card).', a4W / 2, a4H - 10, { align: 'center' })

        const blob = pdf.output('blob')
        setResult({ url: URL.createObjectURL(blob), name: `aadhaar_print_${copies}copies.pdf` })
        setProcessing(false)
    }

    return (
        <>
            <SEO title="Aadhaar Card A4 Print Setting - Free Online Tool" description="Print Aadhaar card on A4 paper with correct dimensions. Multiple copies, cutting guides, grayscale option. Free & private." canonical="/aadhaar-card-print-setting-a4" />
            <ToolLayout toolSlug="aadhaar-card-print-setting-a4" title="Aadhaar Card A4 Print Setting" description="Generate a print-ready A4 PDF with correct Aadhaar card dimensions (85.6×54mm). Multiple copies with cutting guides." breadcrumb="Aadhaar Print">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
                            <i className="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                            <div>Upload front and back images of your Aadhaar card. We'll arrange them at exact ID-card dimensions (85.6×54mm) on A4 paper with cutting guides.</div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Front Side', img: frontImg, ref: frontRef, setter: setFrontImg, icon: '🪪' },
                                { label: 'Back Side', img: backImg, ref: backRef, setter: setBackImg, icon: '🔄' },
                            ].map(({ label, img, ref, setter, icon }) => (
                                <div key={label} className="space-y-2">
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                        <span>{icon}</span> {label}
                                    </p>
                                    {img ? (
                                        <div className="relative rounded-xl overflow-hidden border-2 border-blue-200 group">
                                            <img src={img} alt={label} className="w-full h-44 object-cover" style={{ filter: grayscale ? 'grayscale(100%)' : 'none' }} />
                                            <button onClick={() => setter(null)}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <i className="fas fa-xmark"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div onClick={() => ref.current?.click()}
                                            className="h-44 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/30">
                                            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => loadImg(e.target.files[0], setter)} />
                                            <i className="fas fa-cloud-arrow-up text-2xl text-slate-300 mb-2"></i>
                                            <p className="text-sm text-slate-500">Upload {label}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {result && (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-circle-check text-green-500"></i>
                                    <span className="font-bold text-green-800 text-sm">Print-ready PDF generated! ({copies} copies)</span>
                                </div>
                                <a href={result.url} download={result.name} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all">
                                    <i className="fas fa-download"></i> Download PDF
                                </a>
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-print text-blue-500"></i> Print Settings
                            </h3>

                            {/* Card Info */}
                            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 text-slate-600">
                                <p><i className="fas fa-ruler-combined text-blue-500 mr-1.5"></i>Card: 85.6 × 54mm (standard ID)</p>
                                <p><i className="fas fa-file-alt text-blue-500 mr-1.5"></i>Paper: A4 (210×297mm)</p>
                                <p><i className="fas fa-print text-blue-500 mr-1.5"></i>DPI: 300 (print quality)</p>
                            </div>

                            {/* Copies */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Number of Copies</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {COPY_OPTIONS.map(c => (
                                        <button key={c.count} onClick={() => setCopies(c.count)}
                                            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${copies === c.count ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grayscale */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={grayscale} onChange={e => setGrayscale(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-xs font-medium text-slate-600">Grayscale (cheaper printing)</span>
                            </label>

                            {/* Generate */}
                            <button onClick={generatePrintSheet} disabled={(!frontImg && !backImg) || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
                                ) : (
                                    <><i className="fas fa-file-pdf"></i> Generate Print Sheet</>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm"><i className="fas fa-lightbulb text-amber-500 mr-2"></i>Print Tips</h4>
                            {[
                                'Set printer scale to 100% (actual size)',
                                'Use plain A4 paper (80gsm or higher)',
                                'Select "Best" quality in print settings',
                                'Cut along dotted border lines',
                                'Grayscale mode saves ink',
                            ].map(t => (
                                <div key={t} className="flex items-start gap-2 text-xs text-slate-600">
                                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i> {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
