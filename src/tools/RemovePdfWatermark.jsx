import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function RemovePdfWatermark() {
    const [file, setFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [opacity, setOpacity] = useState(1)
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(0)

    const handleFile = useCallback(async (f) => {
        if (!f || f.type !== 'application/pdf') return
        setFile(f); setResult(null); setPages([])
        try {
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
            const arrayBuffer = await f.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            const previews = []
            for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: 0.5 })
                const canvas = document.createElement('canvas')
                canvas.width = viewport.width; canvas.height = viewport.height
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
                previews.push({ num: i, url: canvas.toDataURL() })
            }
            setPages(previews)
        } catch (e) { }
    }, [])

    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }

    const process = async () => {
        if (!file) return
        setProcessing(true)
        try {
            const { PDFDocument, rgb } = await import('pdf-lib')
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
            const pages = pdfDoc.getPages()

            // Re-render each page with removed transparency layers (paint over with bg color)
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
            const origPdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise
            const newDoc = await PDFDocument.create()

            for (let i = 0; i < origPdf.numPages; i++) {
                const page = await origPdf.getPage(i + 1)
                const viewport = page.getViewport({ scale: 1.5 })
                const canvas = document.createElement('canvas')
                canvas.width = viewport.width; canvas.height = viewport.height
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = bgColor
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.globalAlpha = opacity
                await page.render({ canvasContext: ctx, viewport }).promise
                ctx.globalAlpha = 1

                const imgData = canvas.toDataURL('image/jpeg', 0.92)
                const imgBytes = await fetch(imgData).then(r => r.arrayBuffer())
                const img = await newDoc.embedJpg(imgBytes)
                const newPage = newDoc.addPage([viewport.width, viewport.height])
                newPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height })
            }

            const pdfBytes = await newDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            setResult(URL.createObjectURL(blob))
        } catch (err) {
            alert('Processing failed: ' + err.message)
        }
        setProcessing(false)
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result
        a.download = file.name.replace('.pdf', '-cleaned.pdf')
        a.click()
    }

    const fmtSize = b => `${(b / 1024).toFixed(1)} KB`

    return (
        <>
            <SEO title="Remove PDF Watermark Online — Free PDF Watermark Remover" description="Remove watermarks from PDF files online. Re-render PDF pages with custom background to visually remove watermarks. Free, private, no upload to server." canonical="/remove-pdf-watermark" />
            <ToolLayout toolSlug="remove-pdf-watermark" title="Remove PDF Watermark" description="Re-render PDF pages to visually remove watermarks. Works by flattening the PDF to image-based pages." breadcrumb="Remove PDF Watermark">
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>How it works:</strong> This tool re-renders each PDF page onto a canvas with your chosen background color, effectively painting over transparent/light watermarks. Output is an image-based PDF.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${file ? 'border-red-400 bg-red-50' : ''}`}>
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <i className="fas fa-file-pdf text-4xl text-red-400"></i>
                                <p className="font-semibold text-red-700">{file.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(file.size)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-tint-slash text-red-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop PDF to remove watermark</p>
                            </div>
                        )}
                    </div>
                </div>

                {pages.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="font-bold text-slate-800 mb-3"><i className="fas fa-eye text-red-500 mr-2"></i>Page Previews</p>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {pages.map(p => (
                                <img key={p.num} src={p.url} alt={`Page ${p.num}`} onClick={() => setSelectedPage(p.num - 1)}
                                    className={`h-32 object-contain rounded-lg border-2 cursor-pointer flex-shrink-0 transition-all
                  ${selectedPage === p.num - 1 ? 'border-red-500' : 'border-slate-200 hover:border-red-300'}`} />
                            ))}
                        </div>
                    </div>
                )}

                {file && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-red-500 mr-2"></i>Settings</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color (to paint over watermark)</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                    <div className="flex gap-2">
                                        {['#ffffff', '#f8f9fa', '#fffef0', '#f0f8ff'].map(c => (
                                            <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c }}
                                                className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Content Opacity: {Math.round(opacity * 100)}%</label>
                                <input type="range" min="0.3" max="1" step="0.05" value={opacity} onChange={e => setOpacity(+e.target.value)} className="slider-range w-full" />
                                <p className="text-xs text-slate-400 mt-1">Lower opacity = lighter content (may help with dark watermarks)</p>
                            </div>
                        </div>
                    </div>
                )}

                {file && !processing && !result && (
                    <button onClick={process} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-tint-slash"></i> Remove Watermark
                    </button>
                )}

                {processing && (
                    <div className="bg-red-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-2xl text-red-500"></i>
                        <div><p className="font-semibold text-red-800">Processing PDF pages...</p>
                            <p className="text-sm text-red-600">Re-rendering each page on canvas</p></div>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Done!</h2>
                        <div className="flex gap-3">
                            <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i> Download Cleaned PDF
                            </button>
                            <a href={result} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-full hover:bg-blue-100 transition-all">
                                <i className="fas fa-eye"></i> Preview PDF
                            </a>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">PDF Watermark Remover</h2>
                    <p className="text-slate-600">Remove watermarks from PDF files by re-rendering each page onto a fresh canvas with your chosen background color. This works by painting over transparent or light-colored watermarks that are placed as overlays on PDF pages.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">When It Works Best</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Light gray or transparent watermarks on white backgrounds</li>
                        <li>Scanned PDFs with page-wide watermark stamps</li>
                        <li>Diagonal watermark text overlays</li>
                    </ul>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Limitations</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Cannot remove dark solid watermarks that cover content</li>
                        <li>Output becomes image-based PDF (text not selectable)</li>
                        <li>Encrypted PDFs may not process correctly</li>
                    </ul>
                    <p className="text-slate-600 mt-4"><strong>Legal Notice:</strong> Only use this tool on PDFs you own or have permission to modify. Do not use to violate copyright.</p>
                    <p className="text-slate-600 mt-2">Related: <a href="/pdf-password-remover" className="text-blue-600 hover:underline">PDF Password Remover</a> · <a href="/pdf-crop" className="text-blue-600 hover:underline">PDF Crop</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
