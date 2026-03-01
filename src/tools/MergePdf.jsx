import { useState, useRef, useCallback } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

export default function MergePdf() {
    const [files, setFiles] = useState([])
    const [merging, setMerging] = useState(false)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [dragIdx, setDragIdx] = useState(null)
    const inputRef = useRef()

    const addFiles = useCallback(async (newFiles) => {
        const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf')
        const items = []
        for (const f of pdfs) {
            let pageCount = '?'
            let thumbUrl = null
            try {
                const buf = await f.arrayBuffer()
                const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise
                pageCount = doc.numPages
                // Render first page thumbnail
                const page = await doc.getPage(1)
                const vp = page.getViewport({ scale: 0.5 })
                const canvas = document.createElement('canvas')
                canvas.width = vp.width; canvas.height = vp.height
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = '#fff'
                ctx.fillRect(0, 0, vp.width, vp.height)
                await page.render({ canvasContext: ctx, viewport: vp }).promise
                thumbUrl = canvas.toDataURL('image/jpeg', 0.6)
            } catch { }
            items.push({ file: f, name: f.name, size: f.size, pages: pageCount, thumb: thumbUrl })
        }
        setFiles(prev => [...prev, ...items])
        setResult(null)
    }, [])

    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx))
    const moveFile = (from, to) => {
        setFiles(prev => {
            const a = [...prev]
            const [item] = a.splice(from, 1)
            a.splice(to, 0, item)
            return a
        })
    }

    const mergePdfs = async () => {
        if (files.length < 2) return
        setMerging(true)
        await new Promise(r => setTimeout(r, 50))

        try {
            const { PDFDocument } = await import('pdf-lib')
            const merged = await PDFDocument.create()

            for (const f of files) {
                const buf = await f.file.arrayBuffer()
                const src = await PDFDocument.load(buf)
                const pages = await merged.copyPages(src, src.getPageIndices())
                pages.forEach(p => merged.addPage(p))
            }

            const bytes = await merged.save()
            const blob = new Blob([bytes], { type: 'application/pdf' })
            setResult({ url: URL.createObjectURL(blob), name: 'merged.pdf', size: blob.size })
        } catch (e) {
            alert('Merge error: ' + e.message)
        }
        setMerging(false)
    }

    const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`
    const totalPages = files.reduce((a, f) => a + (typeof f.pages === 'number' ? f.pages : 0), 0)

    return (
        <>
            <SEO title="Merge PDF Files - Free Online PDF Merger" description="Merge multiple PDF files into one with first page preview. Drag to reorder, see page counts. 100% browser-based." canonical="/merge-pdf" />
            <ToolLayout toolSlug="merge-pdf" title="Merge PDF" description="Combine multiple PDF files into a single document with page previews, drag reorder, and page counts." breadcrumb="Merge PDF">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Drop Zone */}
                    <div
                        className={`drop-zone group cursor-pointer ${dragging && dragIdx === null ? 'active' : ''}`}
                        onDrop={e => { e.preventDefault(); setDragging(false); if (dragIdx === null) addFiles(e.dataTransfer.files) }}
                        onDragOver={e => { e.preventDefault(); if (dragIdx === null) setDragging(true) }}
                        onDragLeave={() => { if (dragIdx === null) setDragging(false) }}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input ref={inputRef} type="file" multiple accept="application/pdf" className="hidden" onChange={e => addFiles(e.target.files)} />
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                                <i className="fas fa-object-group text-white text-2xl"></i>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-700">Drop PDF files or <span className="text-blue-600">browse</span></p>
                                <p className="text-slate-400 text-sm mt-0.5">Add multiple PDFs · First page preview · Drag to reorder</p>
                            </div>
                        </div>
                    </div>

                    {/* File List with Previews */}
                    {files.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700">{files.length} files</span>
                                    {totalPages > 0 && (
                                        <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">{totalPages} total pages</span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 font-medium"><i className="fas fa-plus mr-1"></i>Add More</button>
                                    <button onClick={() => { setFiles([]); setResult(null) }} className="text-xs text-red-400 hover:text-red-600"><i className="fas fa-trash mr-1"></i>Clear All</button>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors cursor-move"
                                        draggable onDragStart={() => setDragIdx(i)} onDragEnd={() => setDragIdx(null)}
                                        onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) moveFile(dragIdx, i) }}>
                                        {/* Page Preview Thumbnail */}
                                        <div className="relative flex-shrink-0">
                                            {f.thumb ? (
                                                <img src={f.thumb} alt={`Page 1 of ${f.name}`} className="w-14 h-18 object-cover rounded-lg border border-slate-200 shadow-sm" style={{ height: 72 }} />
                                            ) : (
                                                <div className="w-14 flex items-center justify-center rounded-lg border border-slate-200 bg-red-50" style={{ height: 72 }}>
                                                    <i className="fas fa-file-pdf text-red-300 text-xl"></i>
                                                </div>
                                            )}
                                            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                                                {i + 1}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-slate-400">{formatSize(f.size)}</span>
                                                <span className="text-[10px] text-slate-300">·</span>
                                                <span className="text-xs text-blue-500 font-bold">{f.pages} page{f.pages !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); if (i > 0) moveFile(i, i - 1) }} disabled={i === 0}
                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 disabled:opacity-30 text-slate-500 text-xs flex items-center justify-center transition-all">
                                                <i className="fas fa-arrow-up"></i>
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); if (i < files.length - 1) moveFile(i, i + 1) }} disabled={i === files.length - 1}
                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 disabled:opacity-30 text-slate-500 text-xs flex items-center justify-center transition-all">
                                                <i className="fas fa-arrow-down"></i>
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 text-xs flex items-center justify-center transition-all ml-0.5">
                                                <i className="fas fa-xmark"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Merge Button */}
                    {files.length >= 2 && !result && (
                        <button onClick={mergePdfs} disabled={merging}
                            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                            {merging ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Merging {files.length} PDFs...</>
                            ) : (
                                <><i className="fas fa-object-group"></i> Merge {files.length} PDFs ({totalPages} pages)</>
                            )}
                        </button>
                    )}

                    {files.length === 1 && (
                        <div className="text-center py-3 text-xs text-amber-600 bg-amber-50 rounded-xl border border-amber-100">
                            <i className="fas fa-info-circle mr-1"></i>Add at least 2 PDFs to merge
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-circle-check text-green-500 text-xl"></i>
                                <div>
                                    <p className="font-bold text-green-800 text-sm">PDFs Merged Successfully!</p>
                                    <p className="text-xs text-green-600">{files.length} files · {totalPages} pages · {formatSize(result.size)}</p>
                                </div>
                            </div>
                            <a href={result.url} download={result.name}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
                                <i className="fas fa-download"></i> Download
                            </a>
                        </div>
                    )}

                    {result && (
                        <button onClick={() => { setFiles([]); setResult(null) }}
                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-all">
                            <i className="fas fa-plus mr-2"></i>Merge More PDFs
                        </button>
                    )}

                    {/* Info */}
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: 'fas fa-eye', text: 'Page preview' },
                                { icon: 'fas fa-lock', text: 'No uploads' },
                                { icon: 'fas fa-arrows-up-down', text: 'Drag reorder' },
                                { icon: 'fas fa-bolt', text: 'Instant merge' },
                            ].map(f => (
                                <div key={f.text} className="flex items-center gap-2 text-xs text-slate-600">
                                    <i className={`${f.icon} text-teal-500`}></i> {f.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <img
                    src="/images/tools/merge-pdf-tool.png"
                    alt="Online PDF Merger Interface"
                    title="Merge Multiple PDF Files"
                    loading="lazy"
                    className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                />

                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">Combine Multiple PDFs Quickly and Securely</h2>
                    <p>
                        Managing scattered digital documents can quickly become a logistical nightmare. Whether you are a student compiling research papers, an accountant organizing monthly tax receipts, or a lawyer assembling case files, dealing with dozens of individual PDF files is inefficient. Sending multiple attachments via email often leads to missing documents or confused recipients. The most elegant solution is to merge these disparate files into one unified, cohesive PDF document. Our secure online PDF merger provides a lightning-fast, intuitive platform to combine your files exactly the way you want them.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Intuitive Visual Reordering</h3>
                    <p>
                        Unlike basic merging utilities that blindly stitch documents together alphabetically or by upload timestamp, we give you complete visual control over your final document's structure. As soon as you add your files to the dashboard, our system generates a crisp thumbnail preview of the first page of every document. You can clearly see exactly what each file contains. To arrange your master document, simply drag and drop the thumbnails into your desired sequence. The numbering badges on each thumbnail update in real-time, guaranteeing that your final combined PDF flows perfectly from the title page to the appendix.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Client-Side Processing for Total Privacy</h3>
                    <p>
                        Perhaps the most critical feature of our PDF merger is how it handles your sensitive data. The vast majority of online document tools require you to actively upload your confidential contracts, bank statements, or medical records to a remote corporate server. That server processes the merge and sends a download link back to you. This poses a massive security risk. We built our tool using advanced, browser-based JavaScript technology. The entire merging process happens locally inside your computer's RAM. Your private files never leave your device, meaning there is absolutely zero risk of your data being intercepted, stored, or leaked.
                    </p>
                    <p>
                        Once you have successfully combined your documents, you might discover that appending several large PDFs together has resulted in a massive file that exceeds email attachment limits. If this occurs, we highly recommend utilizing our <a href="/pdf-compressor" className="text-teal-600 hover:underline">PDF Compressor Tool</a> (coming soon) to optimize the file size. Alternatively, if you need to remove a specific page from the newly merged document, you can use a PDF splitting utility to extract only what you need.
                    </p>

                    <img
                        src="/images/tools/merge-pdf-example.png"
                        alt="Visual graphic showing distinct PDF files being bound into one master document"
                        title="Visualizing PDF Merging"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                    />

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Optimized for Speed and Efficiency</h3>
                    <p>
                        Because the merging engine runs directly on your local hardware, the speed of the operation is practically instantaneous, completely bypassing the frustrating upload and download times associated with cloud-based converters. You can easily drag fifty separate invoice PDFs into the drop zone, arrange them, and hit merge. Your browser will instantly stitch the binary data together and spit out the combined file in seconds, entirely offline.
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-6">Core Merging Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Thumbnail Previews:</strong> Instantly view a generated snapshot of the first page of every uploaded PDF to ensure you are combining the correct files.</li>
                        <li><strong>Live Page Counting:</strong> The interface automatically calculates and displays the total number of pages your final document will contain before you even hit the merge button.</li>
                        <li><strong>Drag-and-Drop Canvas:</strong> Easily upload files straight from your desktop, and then drag the document cards to visually establish the perfect reading order.</li>
                        <li><strong>Unlimited Operations:</strong> We do not restrict how often you can use the tool or place artificial paywalls on the number of documents you can combine per day.</li>
                        <li><strong>Offline Functionality:</strong> Once the page loads, the core merging logic functions independently of your internet connection, making it ideal for travel or secure offline environments.</li>
                    </ul>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-slate-700">Does merging PDFs reduce the quality of the text or images?</h4>
                            <p className="mt-1">Absolutely not. Our merging engine simply concatenates the existing binary data structures of the original PDF files. It does not re-render, rasterize, or compress the contents, ensuring that vector text remains perfectly sharp and images retain their original fidelity.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Can I merge documents that have different page sizes?</h4>
                            <p className="mt-1">Yes! If you merge a standard US Letter document with an A4 contract and a tiny receipt, the final PDF will simply contain distinct pages of different sizes. The Portable Document Format natively supports varying page dimensions within the same file.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Is there a maximum limit on how many files I can merge?</h4>
                            <p className="mt-1">While we do not impose artificial limits, the theoretical maximum depends entirely on your computer's available RAM, as the files are held in memory during the merging process. Most modern laptops can easily handle merging over 100 typical PDF documents simultaneously.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Will bookmarks and hyperlinks be preserved?</h4>
                            <p className="mt-1">Internal document structures like basic text hyperlinks are generally preserved during the merge. However, complex interactive elements like fillable form fields or highly nested bookmark trees may behave unpredictably when stitched into a new document structure.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Why does the thumbnail preview sometimes look blank?</h4>
                            <p className="mt-1">To quickly generate the thumbnail, we use a lightweight PDF renderer to paint the first page. If the first page of your PDF is completely blank, or if the file contains highly complex vector encryption that our previewer cannot parse, it will display a generic PDF icon instead. This does not affect the actual merging process in any way.</p>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout >
        </>
    )
}
