import { useState, useRef } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const DPI_OPTIONS = [
    { value: 1, label: '72 DPI (Web)', desc: 'Fast, small files', icon: '🌐' },
    { value: 2, label: '150 DPI (Good)', desc: 'Balance of size & quality', icon: '✅' },
    { value: 3, label: '300 DPI (Print)', desc: 'High quality, larger files', icon: '🖨️' },
]

const FORMAT_OPTIONS = [
    { value: 'jpg', label: 'JPG', desc: 'Smaller files', mime: 'image/jpeg' },
    { value: 'png', label: 'PNG', desc: 'Lossless, transparency', mime: 'image/png' },
]

export default function PdfToImage({ to = 'jpg' }) {
    const [pages, setPages] = useState([])
    const [selected, setSelected] = useState(new Set())
    const [dpiScale, setDpiScale] = useState(2)
    const [format, setFormat] = useState(to)
    const [loading, setLoading] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [pdfName, setPdfName] = useState('')
    const [pdfSize, setPdfSize] = useState(0)
    const [previewPage, setPreviewPage] = useState(null) // large preview
    const inputRef = useRef()

    const getMime = () => format === 'png' ? 'image/png' : 'image/jpeg'

    const loadPdf = async (f) => {
        if (!f || f.type !== 'application/pdf') return
        setLoading(true)
        setPages([])
        setSelected(new Set())
        setPdfName(f.name)
        setPdfSize(f.size)
        setPreviewPage(null)

        try {
            const buf = await f.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise

            const items = []
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                // Thumbnail at lower scale
                const tvp = page.getViewport({ scale: 0.5 })
                const tc = document.createElement('canvas')
                tc.width = tvp.width; tc.height = tvp.height
                const tctx = tc.getContext('2d')
                tctx.fillStyle = '#fff'; tctx.fillRect(0, 0, tvp.width, tvp.height)
                await page.render({ canvasContext: tctx, viewport: tvp }).promise

                const origVp = page.getViewport({ scale: 1 })
                items.push({
                    num: i,
                    thumb: tc.toDataURL('image/jpeg', 0.6),
                    w: Math.round(origVp.width),
                    h: Math.round(origVp.height),
                })
            }
            setPages(items)
            setSelected(new Set(items.map(p => p.num)))

            // Auto-generate large preview of first page
            if (items.length > 0) {
                const p1 = await pdf.getPage(1)
                const pvp = p1.getViewport({ scale: 1.5 })
                const pc = document.createElement('canvas')
                pc.width = pvp.width; pc.height = pvp.height
                const pctx = pc.getContext('2d')
                pctx.fillStyle = '#fff'; pctx.fillRect(0, 0, pvp.width, pvp.height)
                await p1.render({ canvasContext: pctx, viewport: pvp }).promise
                setPreviewPage({ num: 1, url: pc.toDataURL('image/jpeg', 0.85) })
            }
        } catch (e) {
            alert('Error loading PDF: ' + e.message)
        }
        setLoading(false)
    }

    const togglePage = (num) => setSelected(prev => {
        const s = new Set(prev)
        s.has(num) ? s.delete(num) : s.add(num)
        return s
    })
    const selectAll = () => setSelected(new Set(pages.map(p => p.num)))
    const deselectAll = () => setSelected(new Set())

    const downloadSelected = async () => {
        if (!selected.size) return
        setExporting(true)
        setExportProgress(0)

        const selectedPages = pages.filter(p => selected.has(p.num))
        const file = inputRef.current?.files?.[0]
        if (!file) return
        const buf = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise

        const blobs = []
        for (let i = 0; i < selectedPages.length; i++) {
            const p = selectedPages[i]
            const page = await pdf.getPage(p.num)
            const vp = page.getViewport({ scale: dpiScale })
            const canvas = document.createElement('canvas')
            canvas.width = vp.width; canvas.height = vp.height
            const ctx = canvas.getContext('2d')
            if (format === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, vp.width, vp.height) }
            await page.render({ canvasContext: ctx, viewport: vp }).promise
            const blob = await new Promise(r => canvas.toBlob(r, getMime(), 0.95))
            blobs.push({ blob, name: `page_${p.num}.${format}` })
            setExportProgress(Math.round(((i + 1) / selectedPages.length) * 100))
        }

        if (blobs.length === 1) {
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blobs[0].blob); a.download = blobs[0].name; a.click()
        } else {
            const JSZip = (await import('jszip')).default
            const zip = new JSZip()
            blobs.forEach(b => zip.file(b.name, b.blob))
            const zipBlob = await zip.generateAsync({ type: 'blob' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(zipBlob); a.download = `pdf_to_${format}_pages.zip`; a.click()
        }
        setExporting(false)
    }

    const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`
    const toName = to.toUpperCase()

    return (
        <>
            <SEO title={`PDF to ${toName} Converter - Free Online`} description={`Convert PDF pages to ${toName} images with preview, DPI control, page selection, and batch download.`} canonical={`/pdf-to-${to}`} />
            <ToolLayout toolSlug={`pdf-to-${to}`} title={`PDF to ${toName}`} description={`Convert PDF pages to high-quality images with page preview, DPI control, and batch download as ZIP.`} breadcrumb={`PDF to ${toName}`}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {!pages.length && !loading && (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadPdf(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => loadPdf(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-file-pdf text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop PDF here or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">Preview pages and convert to {toName} images</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="flex items-center justify-center gap-3 py-16">
                                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-slate-600 font-medium">Loading PDF pages...</span>
                            </div>
                        )}

                        {/* First Page Preview */}
                        {previewPage && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-file-pdf text-red-400"></i>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[250px]">{pdfName}</p>
                                            <p className="text-[10px] text-slate-400">{pages.length} page{pages.length > 1 ? 's' : ''} · {formatSize(pdfSize)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setPages([]); setPreviewPage(null); setPdfName('') }}
                                        className="text-xs text-slate-400 hover:text-red-500"><i className="fas fa-xmark mr-1"></i>Remove</button>
                                </div>
                                <div className="p-3 bg-slate-100 flex justify-center">
                                    <img src={previewPage.url} alt="Page 1 preview" className="max-h-[250px] md:max-h-[400px] rounded-lg shadow-lg border border-slate-200" />
                                </div>
                                <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 text-xs text-blue-700 text-center">
                                    <i className="fas fa-eye mr-1"></i> First page preview — Select pages below to export
                                </div>
                            </div>
                        )}

                        {/* Page Selection Grid */}
                        {pages.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <span className="text-sm font-bold text-slate-700">
                                        <i className="fas fa-th text-red-400 mr-2"></i>
                                        {pages.length} pages · <span className="text-blue-600">{selected.size} selected</span>
                                    </span>
                                    <div className="flex gap-3">
                                        <button onClick={selectAll} className="text-xs text-blue-600 font-medium hover:text-blue-800">Select All</button>
                                        <button onClick={deselectAll} className="text-xs text-slate-400 font-medium hover:text-slate-600">Deselect All</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 max-h-64 overflow-y-auto">
                                    {pages.map(p => (
                                        <div key={p.num} onClick={() => togglePage(p.num)}
                                            className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${selected.has(p.num) ? 'border-blue-500 shadow-blue-100' : 'border-slate-200 opacity-50'}`}>
                                            <img src={p.thumb} alt={`Page ${p.num}`} className="w-full h-28 object-cover" />
                                            <div className="absolute top-1.5 right-1.5">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all shadow ${selected.has(p.num) ? 'bg-blue-500 text-white' : 'bg-white/90 text-slate-400 border'}`}>
                                                    {selected.has(p.num) ? <i className="fas fa-check"></i> : p.num}
                                                </div>
                                            </div>
                                            <p className={`text-center text-[10px] py-1 font-bold ${selected.has(p.num) ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                                                Page {p.num}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Export Progress */}
                        {exporting && (
                            <div className="bg-white rounded-xl border border-red-100 p-5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-semibold text-slate-700">Rendering {selected.size} pages...</span>
                                    </div>
                                    <span className="text-sm font-bold text-red-600">{exportProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all" style={{ width: `${exportProgress}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-gear text-red-500"></i> Export Settings
                            </h3>

                            {/* Output Format */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FORMAT_OPTIONS.map(f => (
                                        <button key={f.value} onClick={() => setFormat(f.value)}
                                            className={`py-2.5 rounded-lg text-center transition-all ${format === f.value ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-red-50'}`}>
                                            <span className="text-xs font-bold block">{f.label}</span>
                                            <span className="text-[10px] opacity-75">{f.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* DPI */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Image Quality / DPI</label>
                                <div className="space-y-1.5">
                                    {DPI_OPTIONS.map(d => (
                                        <button key={d.value} onClick={() => setDpiScale(d.value)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${dpiScale === d.value ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-red-50'}`}>
                                            <span className="text-xs font-bold">{d.icon} {d.label}</span>
                                            <span className="text-[10px] opacity-75">{d.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Export Button */}
                            <button onClick={downloadSelected} disabled={!selected.size || exporting}
                                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                {exporting ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Exporting {exportProgress}%</>
                                ) : (
                                    <><i className="fas fa-download"></i> Export {selected.size} Page{selected.size !== 1 ? 's' : ''} as {format.toUpperCase()}</>
                                )}
                            </button>

                            {pages.length > 0 && (
                                <button onClick={() => { setPages([]); setPreviewPage(null); setPdfName('') }}
                                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                    Upload New PDF
                                </button>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm"><i className="fas fa-shield-halved text-red-500 mr-2"></i>Premium Features</h4>
                            {['Full page preview loading', 'Page-by-page selection', 'DPI quality control (72–300)', 'JPG & PNG output formats', 'Download all as ZIP', '100% browser-based — no uploads'].map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                    <i className="fas fa-check text-green-500 flex-shrink-0"></i> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Content — unique per target format */}
                <PdfToImageSeoContent to={to} toName={toName} />
            </ToolLayout>
        </>
    )
}

/* ── Unique Content Renderer ────────────────────────────────────────────── */
import { PDF_TO_IMAGE_CONTENT } from '../data/converterContentData'

function PdfToImageSeoContent({ to, toName }) {
    const data = PDF_TO_IMAGE_CONTENT[`pdf-to-${to}`]

    if (!data) {
        return (
            <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">Convert PDF to {toName}</h2>
                    <p>Extract PDF pages as high-quality {toName} images with DPI control, page selection, and batch download. All processing happens in your browser.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="seo-content mt-12 space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">Convert PDF to {toName} Images</h2>
                    <p>{data.intro}</p>

                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 not-prose mt-4">
                        <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                            <i className="fas fa-info-circle text-red-500"></i> Why Convert PDF to {toName}?
                        </h3>
                        <p className="text-sm text-red-800 leading-relaxed">{data.whyConvert}</p>
                    </div>
                </div>
            </div>

            {/* Format Note */}
            {data.formatNote && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-file-image text-red-500"></i> {toName} Format Considerations
                    </h3>
                    <p className="text-sm text-slate-600">{data.formatNote}</p>
                </div>
            )}

            {/* Tips */}
            {data.tips && data.tips.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-amber-500"></i> Tips for Best Results
                    </h3>
                    <ul className="space-y-2.5">
                        {data.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-600">
                                <i className="fas fa-check text-green-500 mt-1 flex-shrink-0"></i>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* FAQs */}
            {data.faqs && data.faqs.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-question-circle text-blue-500"></i> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        {data.faqs.map((faq, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-sm text-slate-700">{faq.q}</h4>
                                <p className="text-sm text-slate-600 mt-1">{faq.a}</p>
                            </div>
                        ))}
                        <div>
                            <h4 className="font-bold text-sm text-slate-700">Does this tool upload my PDF to a server?</h4>
                            <p className="text-sm text-slate-600 mt-1">No. The PDF is processed entirely in your browser using JavaScript. Your file is never sent to any server.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Related Tools */}
            <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-3 justify-center border border-slate-200">
                <a href="/image-compressor" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-sm text-slate-700 hover:text-red-700 transition-all">
                    <i className="fas fa-arrow-right text-xs"></i> Compress Image
                </a>
                <a href="/jpg-to-pdf" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-sm text-slate-700 hover:text-red-700 transition-all">
                    <i className="fas fa-arrow-right text-xs"></i> Image to PDF
                </a>
                <a href="/merge-pdf" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-sm text-slate-700 hover:text-red-700 transition-all">
                    <i className="fas fa-arrow-right text-xs"></i> Merge PDF
                </a>
            </div>
        </div>
    )
}

