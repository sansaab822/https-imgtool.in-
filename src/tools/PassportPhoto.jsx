import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const SIZES = [
    { name: 'Standard Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
    { name: 'US Passport', w: 51, h: 51, unit: 'mm', desc: '51×51mm (2×2")', cat: 'Passport' },
    { name: 'UK Passport', w: 35, h: 45, unit: 'mm', desc: '35×45mm', cat: 'Passport' },
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

const LAYOUTS = [
    { count: 4, cols: 2, label: '4 Photos (2×2)' },
    { count: 6, cols: 3, label: '6 Photos (3×2)' },
    { count: 8, cols: 4, label: '8 Photos (4×2)' },
]

export default function PassportPhoto() {
    const [photo, setPhoto] = useState(null)
    const [selectedSize, setSelectedSize] = useState(SIZES[0])
    const [customW, setCustomW] = useState(35)
    const [customH, setCustomH] = useState(45)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [layout, setLayout] = useState(LAYOUTS[0])
    const [quality, setQuality] = useState(95)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [sizeCat, setSizeCat] = useState('Passport')
    const inputRef = useRef()
    const imgRef = useRef()

    const mmToPx = (mm) => Math.round(mm * 300 / 25.4) // 300 DPI

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        setPhoto({ url: URL.createObjectURL(file), file })
        setResult(null)
    }, [])

    const generatePhoto = async () => {
        if (!imgRef.current) return
        setProcessing(true)
        await new Promise(r => setTimeout(r, 50))

        const img = imgRef.current
        const size = selectedSize.name === 'Custom' ? { w: customW, h: customH } : selectedSize
        const photoW = mmToPx(size.w)
        const photoH = mmToPx(size.h)

        // Create single photo
        const singleCanvas = document.createElement('canvas')
        singleCanvas.width = photoW
        singleCanvas.height = photoH
        const sCtx = singleCanvas.getContext('2d')

        // Background
        if (bgColor !== 'none') {
            sCtx.fillStyle = bgColor
            sCtx.fillRect(0, 0, photoW, photoH)
        }

        // Fit image (center crop)
        const imgRatio = img.naturalWidth / img.naturalHeight
        const photoRatio = photoW / photoH
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
        if (imgRatio > photoRatio) {
            sw = img.naturalHeight * photoRatio
            sx = (img.naturalWidth - sw) / 2
        } else {
            sh = img.naturalWidth / photoRatio
            sy = (img.naturalHeight - sh) / 2
        }
        sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, photoW, photoH)

        // Create A4 sheet with multiples
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const a4W = 210, a4H = 297
        const gap = 3
        const cols = layout.cols
        const rows = Math.ceil(layout.count / cols)
        const totalW = cols * size.w + (cols - 1) * gap
        const totalH = rows * size.h + (rows - 1) * gap
        const startX = (a4W - totalW) / 2
        const startY = 35

        // Header
        pdf.setFontSize(12)
        pdf.setTextColor(80)
        pdf.text('Passport Photos — Print Ready', a4W / 2, 15, { align: 'center' })
        pdf.setFontSize(8)
        pdf.setTextColor(150)
        pdf.text(`Size: ${size.w}×${size.h}mm · ${layout.label} · Print at 100% scale`, a4W / 2, 22, { align: 'center' })

        const dataUrl = singleCanvas.toDataURL('image/jpeg', quality / 100)
        let photoCount = 0
        for (let row = 0; row < rows && photoCount < layout.count; row++) {
            for (let col = 0; col < cols && photoCount < layout.count; col++) {
                const x = startX + col * (size.w + gap)
                const y = startY + row * (size.h + gap)
                pdf.addImage(dataUrl, 'JPEG', x, y, size.w, size.h)
                // Cutting lines
                pdf.setDrawColor(200)
                pdf.setLineDashPattern([1, 1], 0)
                pdf.rect(x, y, size.w, size.h)
                photoCount++
            }
        }

        pdf.setFontSize(7)
        pdf.setTextColor(180)
        pdf.text('Cut along dotted lines. Print at 100% scale on A4 paper.', a4W / 2, startY + totalH + 8, { align: 'center' })

        const blob = pdf.output('blob')
        setResult({
            url: URL.createObjectURL(blob),
            name: `passport_photos_${size.w}x${size.h}mm.pdf`,
            // Also create single photo download
            singleUrl: singleCanvas.toDataURL('image/jpeg', quality / 100),
            singleName: `passport_${size.w}x${size.h}mm.jpg`,
        })
        setProcessing(false)
    }

    const cats = [...new Set(SIZES.map(s => s.cat))]

    return (
        <>
            <SEO title="Passport Size Photo Maker - Free Online" description="Create passport size photos for any document. Multiple sizes for passport, visa, ID cards, and exams. Print-ready A4 PDF layout." canonical="/passport-size-photo" />
            <ToolLayout toolSlug="passport-size-photo" title="Passport Photo Maker" description="Create perfectly sized passport photos with background options and print-ready A4 layouts." breadcrumb="Passport Photo">
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
                                        <p className="text-slate-400 text-sm mt-0.5">Face-centered photo recommended · All formats</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                {/* Preview with aspect overlay */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">
                                        <i className="fas fa-image text-blue-400 mr-1"></i>Photo Preview — {selectedSize.name} ({selectedSize.desc})
                                    </span>
                                    <button onClick={() => { setPhoto(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[250px]">
                                    <div className="relative inline-block" style={{ backgroundColor: bgColor !== 'none' ? bgColor : 'transparent' }}>
                                        <img ref={imgRef} src={photo.url} alt="Photo" className="max-h-[350px] max-w-full object-contain rounded-lg" crossOrigin="anonymous" />
                                        {/* Face guide overlay */}
                                        <div className="absolute inset-0 pointer-events-none flex items-start justify-center pt-[8%]">
                                            <div className="border-2 border-dashed border-blue-300/50 rounded-full" style={{ width: '40%', height: '55%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results */}
                                {result && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <i className="fas fa-circle-check text-green-500 flex-shrink-0"></i>
                                            <span className="text-sm font-bold text-green-800 flex-1">Print-ready PDF generated!</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a href={result.url} download={result.name} className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all">
                                                <i className="fas fa-file-pdf"></i> Download A4 PDF
                                            </a>
                                            <a href={result.singleUrl} download={result.singleName} className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all">
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
                        {/* Photo Size */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-ruler-combined text-blue-500"></i> Photo Settings
                            </h3>

                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Category</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {cats.map(c => (
                                        <button key={c} onClick={() => setSizeCat(c)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${sizeCat === c ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                {SIZES.filter(s => s.cat === sizeCat).map(s => (
                                    <button key={s.name} onClick={() => setSelectedSize(s)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${selectedSize.name === s.name ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                        <span className="text-xs font-medium">{s.name}</span>
                                        <span className="text-[10px] opacity-75">{s.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom size */}
                            {selectedSize.name === 'Custom' && (
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-500 mb-0.5">Width (mm)</label>
                                        <input type="number" value={customW} onChange={e => setCustomW(+e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-500 mb-0.5">Height (mm)</label>
                                        <input type="number" value={customH} onChange={e => setCustomH(+e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
                                    </div>
                                </div>
                            )}

                            {/* Background Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Background Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {BACKGROUNDS.map(b => (
                                        <button key={b.color} onClick={() => setBgColor(b.color)}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor === b.color ? 'border-blue-500 scale-110 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}
                                            style={{ backgroundColor: b.color === 'none' ? 'transparent' : b.color, backgroundImage: b.color === 'none' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' }}
                                            title={b.name}>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Layout */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Photos Per Sheet</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {LAYOUTS.map(l => (
                                        <button key={l.count} onClick={() => setLayout(l)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${layout.count === l.count ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {l.count} Photos
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Print Quality</span><span className="font-bold text-blue-600">{quality}%</span>
                                </label>
                                <input type="range" min="70" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Generate */}
                            <button onClick={generatePhoto} disabled={!photo || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
                                ) : (
                                    <><i className="fas fa-id-card"></i> Generate Passport Photos</>
                                )}
                            </button>

                            <button onClick={() => { setPhoto(null); setResult(null) }} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                Upload New Photo
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

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Preparing Your Photo for Printing</h3>
                        <p>
                            Once you have aligned your face using our intuitive visual guides, the tool doesn't just give you a single cropped image—it automatically generates a professional, high-resolution PDF document perfectly sized for standard A4 printer paper. You can choose whether you need a quick strip of four photos, or a full sheet of eight. We even automatically draw light, dotted cutting lines around each portrait so you know exactly where to trim with your scissors. Simply download the PDF and send it to your home printer or a local print shop.
                        </p>
                        <p>
                            It is important to note that most official government agencies require passport photos to be printed on a pure white or light grey background. If the selfie you upload was taken in your messy bedroom, you will likely face rejection. To solve this, we highly recommend taking your photo, running it through our <a href="/bg-remover" className="text-blue-600 hover:underline">Background Remover Tool</a> to extract yourself onto a transparent canvas, and then bringing that clean image back into this passport maker. This allows you to utilize our built-in background color selector to instantly snap a perfect, studio-grade white backdrop behind your head.
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
                            Even with perfect cropping and a pure white background, your photo can still be rejected if you don't follow basic biometric guidelines. Always ensure you are facing the camera directly, not angled to the side. Maintain a neutral facial expression—no wide smiles or frowning. Ensure both of your ears are visible, and remove any bulky glasses that might cause glare or obscure your eyes. Finally, make sure the original photograph was taken in a well-lit environment so there are no harsh, distracting shadows falling across half of your face or onto the background behind you.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Essential Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Biometric Guidelines:</strong> The preview canvas features a helpful oval overlay designed to ensure your head and shoulders take up the correct percentage of the final cropped frame.</li>
                            <li><strong>Custom Solid Backgrounds:</strong> Instantly fill transparent areas of your uploaded PNG file with official colors like pure white, light grey, or specific shades of blue required by certain nations.</li>
                            <li><strong>A4 Print Layouts:</strong> The generator actively spaces your photos intelligently on standard A4 dimensions, saving you the hassle of trying to manually align them in a word processor.</li>
                            <li><strong>Dual Download Links:</strong> In addition to the printable PDF sheet, you can also download a single, high-quality JPG version of the crop for digital application forms.</li>
                            <li><strong>100% Data Privacy:</strong> Because this tool utilizes JavaScript to manipulate the canvas locally in your browser, your personal face data and identification photos are never uploaded to any remote server.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Common Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">What type of paper should I use to print the PDF?</h4>
                                <p className="mt-1">For official government applications, you must print the generated PDF document on high-quality glossy or matte photographic paper. Printing these photos on standard, thin copy paper will almost certainly result in your application being rejected.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">How do I ensure the photos print at the exact millimeter size?</h4>
                                <p className="mt-1">When you open the downloaded PDF file to print it, you must delve into your printer settings dialogue box and ensure that options like "Fit to Page" or "Scale to Fit" are completely disabled. Make sure the scale is set exactly to "100%" or "Actual Size."</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I wear glasses in my passport photo?</h4>
                                <p className="mt-1">Policies vary drastically by country. The United States State Department strictly prohibits wearing eyeglasses in passport photos under any circumstances. However, other governments may allow them provided there is absolutely no glare on the lenses. Always check your specific application constraints.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why isn't the background changing when I select a new color?</h4>
                                <p className="mt-1">The background color selector will only work if the original image file you upload has a transparent background (like a cutout PNG). If you upload a standard JPG selfie taken against your living room wall, our tool cannot automatically erase your living room. You must use a background removal tool first.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is this tool really free to use?</h4>
                                <p className="mt-1">Yes, generating both the single digital photographs and the multi-photo A4 PDF layout is completely free and unwatermarked. We believe basic bureaucratic utilities should be accessible to everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
