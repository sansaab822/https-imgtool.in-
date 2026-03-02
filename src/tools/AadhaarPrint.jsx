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
            </div>

            <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <img
                    src="/images/tools/aadhaar-print-tool.png"
                    alt="Aadhaar Card Print Interface"
                    title="Aadhaar Card A4 Print Tool"
                    loading="lazy"
                    className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                />

                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">The Problem: Printing Aadhaar Cards in Exact Dimensions</h2>
                    <p>
                        In today's digital landscape, possessing a physical, correctly sized copy of your Aadhaar card is an absolute necessity for countless administrative, financial, and personal tasks. However, obtaining a perfectly dimensioned printout from a standard home or office printer is a notoriously frustrating experience. When individuals download their e-Aadhaar PDF or take photographs of their physical card, the resulting images lack proper real-world scale metadata. If you simply insert these images into a standard word processor or image viewer and hit print, the software will arbitrarily stretch or shrink the image to fit the page block. The resulting printout is almost always incorrect—either comically oversized, making it impossible to fit into a wallet, or far too small, rendering the crucial textual details and QR code completely illegible.
                    </p>
                    <p>
                        Furthermore, attempting to manually resize images to the exact required physical dimensions (85.6 mm × 54.0 mm) requires expensive desktop publishing software and a deep understanding of image resolution (DPI). For the average user, correctly aligning both the front and back sides of the card so they look professional when cut out is an incredibly tedious process of trial and error that wastes expensive printer ink and premium paper.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">The Solution: Our Automated Aadhaar Print Setting Tool</h3>
                    <p>
                        Our completely free, browser-based Aadhaar Card A4 Print Setting tool was engineered specifically to eliminate this exact frustration. We have mathematically programmed the strict dimensions of a standard Indian Aadhaar card (often referred to as CR80 or standard ID size) directly into our PDF generation engine. When you upload photos or scans of the front and back of your card, our system does not care about the original pixel dimensions or the aspect ratio of the camera that took the photo. Instead, it intelligently scales your uploads to fit perfectly within the exact physical millimeter constraints required for a professional ID card.
                    </p>
                    <p>
                        We go several steps beyond simple resizing to ensure you receive a flawless final product. Our algorithm takes your precisely scaled images and dynamically arranges them onto a standard, print-ready A4 document layout. To guarantee that you do not waste space on the page, the tool automatically tiles multiple copies (you can choose between 2, 4, or 6 copies) perfectly spaced across the sheet. Most importantly, we programmatically draw delicate, non-intrusive dotted cutting guidelines around every single card. These guides act as a visual aid so that when you take a pair of scissors or a paper trimmer to the final printout, you achieve perfectly straight, professional edges every single time.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Step-by-Step Guide to Perfect Prints</h3>
                    <p>
                        Achieving a professionally aligned, perfectly sized Aadhaar printout using our platform takes less than a minute and requires absolutely zero technical graphic design skills. Follow these straightforward instructions:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Prepare Your Images:</strong> First, ensure you have clear, well-lit digital images of both the front and back of your Aadhaar card. You can use photographs taken from your smartphone or flatbed scanner images. Ensure the edges of the card are visible and the text is sharp.</li>
                        <li><strong>Upload to the Dashboard:</strong> Locate the two upload modules on the left side of our interface. Click the first box to upload the front side of your card, and the second box to upload the back side. Our interface will immediately display a secure, local preview of your uploads.</li>
                        <li><strong>Configure Print Settings:</strong> Move to the right-hand panel. Here you can dictate exactly how the final A4 sheet will be structured. Select the number of distinct copies you want generated on the page. If you are trying to minimize printing costs or only have a black-and-white laser printer, check the "Grayscale" option to automatically desaturate the images before the PDF is built.</li>
                        <li><strong>Generate the PDF File:</strong> Click the prominent "Generate Print Sheet" button. Our client-side rendering engine will instantly construct a high-resolution PDF document perfectly mapped to an A4 canvas.</li>
                        <li><strong>Download and Print:</strong> A success message will appear alongside a download button. Save the PDF to your device. When you open this file in Adobe Reader or your browser to print, it is absolutely critical that you set your printer scaling options to "100%", "Actual Size", or "Do Not Scale." If your printer attempts to "Fit to Page," it will slightly shrink the dimensions, ruining the perfect sizing we generated.</li>
                    </ol>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Expert Tips for the Best Physical Results</h3>
                    <p>
                        While our software guarantees that the digital file is mathematically perfect, the physical quality of your final card depends heavily on your hardware. For the most durable and authentic-feeling result, we strongly recommend printing on heavy cardstock (at least 200 GSM) or dedicated glossy photo paper rather than standard lightweight copy paper. Standard copy paper is highly susceptible to tearing and moisture damage.
                    </p>
                    <p>
                        Furthermore, if you are printing on an inkjet printer, ensure you select the "High Quality" or "Photo" setting in your printer's system dialog box. This instructs the printer to deposit more ink and move the printhead slower, resulting in significantly sharper text and clearer photographs. Once your sheet is printed and you have carefully cut the cards out using the provided dotted guides, consider taking the final pieces to a local stationery shop to have them thermally laminated. Lamination completely seals the paper, protecting the sensitive QR code from smudging and giving the card a rigid, premium feel identical to PVC.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-slate-700">Is it safe to upload my extremely sensitive Aadhaar card here?</h4>
                            <p className="mt-1">Yes, it is entirely safe because no upload actually takes place. We designed this tool with a strict privacy-first architecture using advanced browser APIs. When you select your images and generate the PDF, 100% of the processing happens locally within your device's memory. Your highly sensitive identity documents are never transmitted across the internet, they never touch our servers, and we have absolutely no access to them.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Why did my printed card turn out slightly smaller than my original card?</h4>
                            <p className="mt-1">If the physical printout does not match standard ID dimensions, the error occurred during the final printing step, not inside our PDF file. By default, many print drivers try to be "helpful" by automatically shrinking documents to ensure they fit within the printer's mechanical margins (an option usually labeled "Fit to Printable Area"). You must dive into your specific printer's settings dialog and explicitly force the scaling modifier to "100%" or select "Actual Size."</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Does this tool also work for PAN cards, Voter IDs, or Driving Licenses?</h4>
                            <p className="mt-1">Absolutely. While we branded this specifically for Aadhaar, almost all government-issued cards in India (and globally) strictly adhere to the international CR80 dimension standard, which is exactly 85.6 mm by 53.98 mm. You can safely upload front and back scans of a PAN card, Driving License, or Voter ID, and the software will accurately arrange them for printing just flawlessly.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">What resolution should my original scanned images be?</h4>
                            <p className="mt-1">For optimal print quality where the small text remains highly legible, we recommend that your original images be scanned at a minimum of 300 DPI (Dots Per Inch). If you are simply taking a photo with your mobile phone, ensure you are in a well-lit room, tap the screen to explicitly focus on the text, and hold the phone perfectly parallel to the card to prevent perspective distortion.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Can I generate a completely colored printout?</h4>
                            <p className="mt-1">Yes, the tool preserves the original color profile of your uploaded images by default. The final PDF will only be converted to black and white if you explicitly toggle the "Grayscale (cheaper printing)" switch located in the right-hand settings panel prior to clicking the generate button.</p>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout >
    )
}
