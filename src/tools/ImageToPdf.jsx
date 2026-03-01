import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const PAGE_SIZES = [
    { id: 'a4', label: 'A4', w: 210, h: 297 },
    { id: 'letter', label: 'US Letter', w: 216, h: 279 },
    { id: 'a3', label: 'A3', w: 297, h: 420 },
    { id: 'a5', label: 'A5', w: 148, h: 210 },
]

const ORIENTATIONS = [
    { id: 'portrait', label: 'Portrait', icon: 'fa-mobile-screen' },
    { id: 'landscape', label: 'Landscape', icon: 'fa-mobile-screen-button' },
    { id: 'auto', label: 'Auto', icon: 'fa-magic' },
]

const MARGINS = [
    { id: 'none', label: 'None', value: 0 },
    { id: 'small', label: 'Small', value: 8 },
    { id: 'medium', label: 'Medium', value: 15 },
    { id: 'large', label: 'Large', value: 25 },
]

export default function ImageToPdf() {
    const [images, setImages] = useState([])
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
    const [orient, setOrient] = useState('portrait')
    const [margin, setMargin] = useState(MARGINS[2])
    const [quality, setQuality] = useState(90)
    const [fitMode, setFitMode] = useState('contain')
    const [pdfTitle, setPdfTitle] = useState('')
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [dragIdx, setDragIdx] = useState(null)
    const inputRef = useRef()

    const addImages = useCallback((files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
        const newItems = valid.map(f => ({
            file: f, url: URL.createObjectURL(f), name: f.name,
        }))
        setImages(prev => [...prev, ...newItems])
        setResult(null)
    }, [])

    const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))
    const moveImage = (from, to) => {
        setImages(prev => {
            const a = [...prev]
            const [item] = a.splice(from, 1)
            a.splice(to, 0, item)
            return a
        })
    }

    const blobToDataUrl = (blob) => new Promise(r => {
        const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob)
    })

    const generatePdf = async () => {
        if (!images.length) return
        setProcessing(true)
        await new Promise(r => setTimeout(r, 50))

        const { jsPDF } = await import('jspdf')
        let pdf = null

        for (let i = 0; i < images.length; i++) {
            const img = new Image()
            img.src = images[i].url
            await new Promise(r => { img.onload = r })

            let pageOrient = orient
            if (orient === 'auto') pageOrient = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait'

            if (i === 0) {
                pdf = new jsPDF({ orientation: pageOrient, unit: 'mm', format: [pageSize.w, pageSize.h] })
                if (pdfTitle.trim()) { pdf.setProperties({ title: pdfTitle.trim() }) }
            } else {
                pdf.addPage([pageSize.w, pageSize.h], pageOrient)
            }

            const pw = pageOrient === 'landscape' ? pageSize.h : pageSize.w
            const ph = pageOrient === 'landscape' ? pageSize.w : pageSize.h
            const m = margin.value
            const areaW = pw - m * 2
            const areaH = ph - m * 2

            // Create a canvas to encode at our quality
            const canvas = document.createElement('canvas')
            canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const dataUrl = canvas.toDataURL('image/jpeg', quality / 100)

            if (fitMode === 'cover') {
                pdf.addImage(dataUrl, 'JPEG', m, m, areaW, areaH)
            } else {
                const imgRatio = img.naturalWidth / img.naturalHeight
                const areaRatio = areaW / areaH
                let drawW, drawH
                if (imgRatio > areaRatio) {
                    drawW = areaW; drawH = areaW / imgRatio
                } else {
                    drawH = areaH; drawW = areaH * imgRatio
                }
                const x = m + (areaW - drawW) / 2
                const y = m + (areaH - drawH) / 2
                pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH)
            }
        }

        const blob = pdf.output('blob')
        setResult({ url: URL.createObjectURL(blob), name: `${pdfTitle.trim() || 'images'}.pdf` })
        setProcessing(false)
    }

    return (
        <>
            <SEO title="Image to PDF Converter - Free Online" description="Convert multiple images to a single PDF. Supports reordering, page sizes, orientation, margin, and quality control. Free & private." canonical="/images-to-pdf" />
            <ToolLayout toolSlug="images-to-pdf" title="Images to PDF" description="Combine multiple images into a single PDF with page size, orientation, margin, and quality controls." breadcrumb="Images to PDF">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div
                            className={`drop-zone group cursor-pointer ${dragging && dragIdx === null ? 'active' : ''}`}
                            onDrop={e => { e.preventDefault(); setDragging(false); if (dragIdx === null) addImages(e.dataTransfer.files) }}
                            onDragOver={e => { e.preventDefault(); if (dragIdx === null) setDragging(true) }}
                            onDragLeave={() => { if (dragIdx === null) setDragging(false) }}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addImages(e.target.files)} />
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-file-pdf text-white text-2xl"></i>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-700">Drop images or <span className="text-blue-600">browse</span></p>
                                    <p className="text-slate-400 text-sm mt-0.5">Add multiple images · Drag to reorder</p>
                                </div>
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-700 text-sm">{images.length} image{images.length > 1 ? 's' : ''}</h3>
                                    <div className="flex gap-3">
                                        <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 font-medium"><i className="fas fa-plus mr-1"></i>Add</button>
                                        <button onClick={() => setImages([])} className="text-xs text-red-400 hover:text-red-600"><i className="fas fa-trash mr-1"></i>Clear</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group rounded-xl border border-slate-200 overflow-hidden"
                                            draggable onDragStart={() => setDragIdx(i)} onDragEnd={() => setDragIdx(null)}
                                            onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) moveImage(dragIdx, i) }}>
                                            <img src={img.url} alt="" className="w-full h-28 object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all">
                                                <button onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <i className="fas fa-xmark"></i>
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">{i + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-circle-check text-green-500"></i>
                                    <span className="font-bold text-green-800 text-sm">PDF Ready! ({images.length} pages)</span>
                                </div>
                                <a href={result.url} download={result.name} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all">
                                    <i className="fas fa-download"></i> Download PDF
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-gear text-violet-500"></i> PDF Settings
                            </h3>

                            {/* Title */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">PDF Title (optional)</label>
                                <input type="text" value={pdfTitle} onChange={e => setPdfTitle(e.target.value)} placeholder="My Photo Album"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-violet-500 outline-none" />
                            </div>

                            {/* Page Size */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Page Size</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PAGE_SIZES.map(s => (
                                        <button key={s.id} onClick={() => setPageSize(s)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${pageSize.id === s.id ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50'}`}>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Orientation */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Orientation</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {ORIENTATIONS.map(o => (
                                        <button key={o.id} onClick={() => setOrient(o.id)}
                                            className={`py-2 rounded-lg text-center transition-all ${orient === o.id ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50'}`}>
                                            <i className={`fas ${o.icon} text-sm block mb-0.5`}></i>
                                            <span className="text-[10px] font-bold">{o.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Margin */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Margin</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {MARGINS.map(m => (
                                        <button key={m.id} onClick={() => setMargin(m)}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${margin.id === m.id ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50'}`}>
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fit Mode */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Image Fit</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setFitMode('contain')}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${fitMode === 'contain' ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50'}`}>
                                        Fit (no crop)
                                    </button>
                                    <button onClick={() => setFitMode('cover')}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${fitMode === 'cover' ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50'}`}>
                                        Fill (may crop)
                                    </button>
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Image Quality</span><span className="font-bold text-violet-600">{quality}%</span>
                                </label>
                                <input type="range" min="30" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Generate */}
                            <button onClick={generatePdf} disabled={!images.length || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating PDF...</>
                                ) : (
                                    <><i className="fas fa-file-pdf"></i> Create PDF ({images.length} pages)</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <img
                        src="/images/tools/image-to-pdf-tool.png"
                        alt="Online Image to PDF Converter Interface"
                        title="Convert Images to PDF Documents"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                    />

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">The Ultimate Tool to Convert Images to PDF</h2>
                        <p>
                            In today's digital workspace, sharing multiple photographs or scanned documents as individual image files can be incredibly frustrating for the recipient. Sending ten separate JPG or PNG files over email often leads to disorganized attachments that are difficult to print or review in a logical order. The most professional and universally accepted solution is to combine these images into a single, cohesive PDF document. Our Image to PDF Converter is engineered specifically to solve this problem, allowing you to seamlessly merge dozens of pictures into a perfectly formatted, easily shareable file in just a few clicks.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Why Combine Pictures into a PDF?</h3>
                        <p>
                            The Portable Document Format (PDF) was designed to look exactly the same regardless of what device, operating system, or software the viewer is using. When you convert your images to PDF, you guarantee that your presentation slides, scanned receipts, portfolio artwork, or assignment pages will be viewed precisely as you intended. Furthermore, a single multi-page PDF is significantly easier for clients, teachers, or colleagues to download and archive compared to a messy folder of scattered JPEGs.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Complete Layout Control</h3>
                        <p>
                            Unlike basic converters that haphazardly slap your photos onto a page, our tool provides desktop-grade layout controls directly in your browser. Whether you are generating a formal US Letter sized business report or compiling an A4 portfolio, you have complete authority over the final output. You can force all pages into portrait or landscape mode, or let our "Auto" feature intelligently rotate the page depending on the dimensions of each individual image. We also provide granular control over page margins and image scaling—choose "Fit" to ensure nothing is cut off, or "Fill" to stretch the image edge-to-edge for stunning, borderless presentations.
                        </p>
                        <p>
                            If you ever need to reverse this process and extract pages from a document back into standalone images, you can easily use our companion <a href="/pdf-to-image" className="text-violet-600 hover:underline">PDF to Image Converter</a>. Alternatively, if you already have several smaller PDF files that need to be grouped together, our <a href="/merge-pdf" className="text-violet-600 hover:underline">Merge PDF Tool</a> is perfectly suited for combining existing documents.
                        </p>

                        <img
                            src="/images/tools/image-to-pdf-example.png"
                            alt="Illustration showing scattered photos organized into a single PDF binder"
                            title="Visualizing Image to PDF Compilation"
                            loading="lazy"
                            className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                        />

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Secure, Private, and Client-Side</h3>
                        <p>
                            When dealing with scanned bank statements, medical records, or signed contracts, data privacy is paramount. Many free online PDF converters force you to upload your sensitive documents to remote servers where they may be stored indefinitely. Our architecture is fundamentally different. We utilize advanced JavaScript libraries to process all image compilation and PDF generation entirely on your local device. Because your files never actually leave your computer or phone, you can convert highly confidential materials with 100% peace of mind, knowing that interception or data leaks are technically impossible.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Key Conversion Capabilities</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Drag & Drop Reordering:</strong> Before generating the document, visually rearrange the order of your pages simply by clicking and dragging the image thumbnails into the correct sequence.</li>
                            <li><strong>Adjustable Compression:</strong> Use the quality slider to dial in the perfect balance between high-fidelity visual sharpness and smaller, email-friendly final file sizes.</li>
                            <li><strong>Universal Format Support:</strong> Import JPG, PNG, WebP, and standard image formats simultaneously, and let the tool automatically normalize them into the PDF structure.</li>
                            <li><strong>Document Metatags:</strong> Embed an optional, searchable Title directly into the metadata of the compiled file to ensure professional presentation in business environments.</li>
                            <li><strong>Zero Uploads Required:</strong> Enjoy blazing-fast conversion speeds regardless of your internet connection, since all processing happens locally inside your browser cache.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Common Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">How do I rearrange the order of the photos?</h4>
                                <p className="mt-1">Once you have uploaded your images, you will see a grid of thumbnails. Simply click and hold your mouse (or drag your finger on mobile) on an image, and drag it to the desired position. The tiny number at the bottom of each thumbnail indicates its final page number.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What is the difference between "Fit" and "Fill" image modes?</h4>
                                <p className="mt-1">"Fit (no crop)" ensures that your entire image is visible on the page, even if that means leaving blank white space around the edges. "Fill (may crop)" will expand the image to cover the entire printable area of the page, but might slice off the edges of your photo if its aspect ratio doesn't perfectly match the paper size.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why is the resulting PDF file so large?</h4>
                                <p className="mt-1">If you upload twenty high-resolution 12-megapixel smartphone photos, combining them into a PDF will naturally create a very large file. To reduce the final size, try lowering the "Image Quality" slider in the settings panel before generating the document.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I convert images to PDF on my iPhone or Android device?</h4>
                                <p className="mt-1">Absolutely. Because the tool runs entirely in the browser using web standards, it functions flawlessly on modern mobile browsers like Safari and Chrome without requiring you to install a dedicated app.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Are there any limits on how many images I can upload at once?</h4>
                                <p className="mt-1">While we do not impose strict artificial limits, your web browser's memory dictates how many images can be processed simultaneously. Most modern computers can comfortably handle compiling 50-100 standard images into a single document without crashing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
