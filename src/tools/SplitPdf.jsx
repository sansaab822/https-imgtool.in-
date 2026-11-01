import { useState, useRef, useEffect, useCallback } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

export default function SplitPdf() {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [pages, setPages] = useState([]) // Array of { pageNum, thumbUrl, selected }
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')
    const [rangeInput, setRangeInput] = useState('')
    const [mode, setMode] = useState('extract') // 'extract' | 'delete' | 'split-all'
    const [resultBlob, setResultBlob] = useState(null)
    const [resultUrl, setResultUrl] = useState(null)
    const [resultInfo, setResultInfo] = useState('')

    const fileInputRef = useRef(null)

    // ── Load & Render PDF Thumbnails ──────────────────────────────────────────
    const loadPdf = useCallback(async (selectedFile) => {
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setError('Please select a valid PDF document.')
            return
        }

        setLoading(true)
        setError('')
        setFile(selectedFile)
        setFileName(selectedFile.name.replace(/\.[^/.]+$/, ''))
        setResultBlob(null)
        setResultUrl(null)
        setPages([])

        try {
            const arrayBuffer = await selectedFile.arrayBuffer()
            const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
            const totalPages = pdfDoc.numPages

            const pageThumbs = []
            for (let i = 1; i <= totalPages; i++) {
                const page = await pdfDoc.getPage(i)
                const viewport = page.getViewport({ scale: 0.35 })

                const canvas = document.createElement('canvas')
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext('2d')

                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, viewport.width, viewport.height)

                await page.render({ canvasContext: ctx, viewport }).promise
                pageThumbs.push({
                    pageNum: i,
                    thumbUrl: canvas.toDataURL('image/jpeg', 0.75),
                    selected: true, // Default: all selected
                })
            }

            setPages(pageThumbs)
            setRangeInput(`1-${totalPages}`)
        } catch (err) {
            setError('Could not read PDF. It might be password-protected or corrupted. Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadPdf(e.dataTransfer.files[0])
        }
    }

    // ── Toggle Single Page Selection ─────────────────────────────────────────
    const togglePage = (pageNum) => {
        setPages((prev) => {
            const updated = prev.map((p) => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p)
            syncRangeFromPages(updated)
            return updated
        })
    }

    // ── Delete a Single Page Instantly ───────────────────────────────────────
    const deletePage = (pageNum) => {
        setPages((prev) => {
            const updated = prev.map((p) => p.pageNum === pageNum ? { ...p, selected: false } : p)
            syncRangeFromPages(updated)
            return updated
        })
    }

    // ── Select All / Deselect All ────────────────────────────────────────────
    const selectAll = () => {
        setPages((prev) => {
            const updated = prev.map((p) => ({ ...p, selected: true }))
            syncRangeFromPages(updated)
            return updated
        })
    }

    const deselectAll = () => {
        setPages((prev) => {
            const updated = prev.map((p) => ({ ...p, selected: false }))
            syncRangeFromPages(updated)
            return updated
        })
    }

    // ── Range String Parser & Synchronizer ───────────────────────────────────
    const syncRangeFromPages = (currentPages) => {
        const selectedNums = currentPages.filter((p) => p.selected).map((p) => p.pageNum)
        if (selectedNums.length === 0) {
            setRangeInput('')
            return
        }
        // Build readable range e.g. "1-3, 5, 7-9"
        const ranges = []
        let start = selectedNums[0]
        let prev = start

        for (let i = 1; i < selectedNums.length; i++) {
            const cur = selectedNums[i]
            if (cur === prev + 1) {
                prev = cur
            } else {
                ranges.push(start === prev ? `${start}` : `${start}-${prev}`)
                start = cur
                prev = cur
            }
        }
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`)
        setRangeInput(ranges.join(', '))
    }

    const applyRangeInput = (inputStr) => {
        setRangeInput(inputStr)
        const total = pages.length
        const selectedSet = new Set()

        const parts = inputStr.split(',').map((s) => s.trim()).filter(Boolean)
        for (const part of parts) {
            if (part.includes('-')) {
                const [low, high] = part.split('-').map((n) => parseInt(n.trim(), 10))
                if (!isNaN(low) && !isNaN(high)) {
                    for (let n = Math.max(1, low); n <= Math.min(total, high); n++) {
                        selectedSet.add(n)
                    }
                }
            } else {
                const n = parseInt(part, 10)
                if (!isNaN(n) && n >= 1 && n <= total) {
                    selectedSet.add(n)
                }
            }
        }

        setPages((prev) => prev.map((p) => ({ ...p, selected: selectedSet.has(p.pageNum) })))
    }

    // ── Core PDF Splice & Export Execution ────────────────────────────────────
    const executeAction = async () => {
        if (!file || pages.length === 0) return
        setProcessing(true)
        setError('')
        setResultBlob(null)
        setResultUrl(null)

        try {
            const { PDFDocument } = await import('pdf-lib')
            const arrayBuffer = await file.arrayBuffer()
            const sourceDoc = await PDFDocument.load(arrayBuffer)

            const pagesToKeep = pages.filter((p) => p.selected).map((p) => p.pageNum)

            if (pagesToKeep.length === 0) {
                setError('Please select at least one page to extract or save.')
                setProcessing(false)
                return
            }

            if (mode === 'split-all') {
                // Split every page into individual single-page PDFs & package into ZIP
                const JSZip = (await import('jszip')).default
                const zip = new JSZip()

                for (let i = 0; i < pages.length; i++) {
                    const singleDoc = await PDFDocument.create()
                    const [copiedPage] = await singleDoc.copyPages(sourceDoc, [i])
                    singleDoc.addPage(copiedPage)
                    const singleBytes = await singleDoc.save()
                    zip.file(`${fileName}_page_${i + 1}.pdf`, singleBytes)
                }

                const zipBlob = await zip.generateAsync({ type: 'blob' })
                const url = URL.createObjectURL(zipBlob)
                setResultBlob(zipBlob)
                setResultUrl(url)
                setResultInfo(`Successfully split all ${pages.length} pages into individual PDF files (ZIP Archive).`)
            } else {
                // Extract or Delete: Build a new PDF containing only selected pages
                const newDoc = await PDFDocument.create()
                // pdf-lib uses 0-based page indexes
                const pageIndices = pagesToKeep.map((num) => num - 1)
                const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices)

                copiedPages.forEach((p) => newDoc.addPage(p))

                const pdfBytes = await newDoc.save()
                const blob = new Blob([pdfBytes], { type: 'application/pdf' })
                const url = URL.createObjectURL(blob)

                setResultBlob(blob)
                setResultUrl(url)
                setResultInfo(`Created PDF with ${pagesToKeep.length} page${pagesToKeep.length > 1 ? 's' : ''} (${(blob.size / 1024).toFixed(1)} KB).`)
            }
        } catch (err) {
            setError('Failed to process PDF: ' + err.message)
        } finally {
            setProcessing(false)
        }
    }

    const selectedCount = pages.filter((p) => p.selected).length

    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Split PDF & Extract Pages Online',
        url: 'https://imgtool.in/split-pdf',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. HTML5 Canvas & WebAssembly compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Split PDF files, delete unwanted pages, or extract specific page ranges online for free. 100% private in-browser client-side processing.',
    }

    return (
        <>
            <SEO
                title="Split PDF Online - Extract & Delete PDF Pages Free"
                description="Split PDF pages, extract specific page ranges, or delete pages from any PDF document in your browser. 100% private with no server uploads. Fast, free & secure."
                canonical="/split-pdf"
                keywords="split pdf, delete pages from pdf, extract pdf pages, split pdf online free, remove pages from pdf, cut pdf, separate pdf pages, pdf page remover"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="split-pdf"
                title="Split PDF & Page Organizer"
                description="Split multi-page PDFs, extract selected page ranges, or delete unwanted pages in seconds. Runs 100% client-side in your browser for total privacy."
                breadcrumb="Split PDF"
            >
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Step 1: Upload Dropzone */}
                    {!file && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-red-300 hover:border-red-500 bg-red-50/40 hover:bg-red-50/70 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => e.target.files && loadPdf(e.target.files[0])}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                                    <i className="fas fa-scissors"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    Drop your PDF file here or <span className="text-red-600 underline">browse</span>
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                                    Select any PDF document. View visual page thumbnails, pick pages to keep or delete, and export instantly.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                                    <span><i className="fas fa-shield-alt text-red-600 mr-1"></i> 100% Private (No Cloud Uploads)</span>
                                    <span>•</span>
                                    <span><i className="fas fa-bolt text-amber-500 mr-1"></i> Instant Browser Processing</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-lg font-bold text-slate-800">Reading PDF Pages...</h3>
                            <p className="text-slate-500 text-xs mt-1">Generating visual thumbnails in browser memory</p>
                        </div>
                    )}

                    {/* Error Notice */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-3">
                            <i className="fas fa-circle-exclamation mt-0.5 text-red-600"></i>
                            <div className="flex-1">{error}</div>
                        </div>
                    )}

                    {/* Step 2: Interactive Page Grid & Action Panel */}
                    {file && !loading && pages.length > 0 && (
                        <div className="space-y-6">

                            {/* Controls Header Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                        <span className="font-bold text-slate-800 text-sm truncate max-w-xs">{file.name}</span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-mono">
                                            {pages.length} pages
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={selectAll}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={deselectAll}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                                        >
                                            Deselect All
                                        </button>
                                        <button
                                            onClick={() => { setFile(null); setPages([]); setResultUrl(null) }}
                                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 font-semibold rounded-lg text-xs transition-colors"
                                        >
                                            <i className="fas fa-trash-can mr-1"></i> Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Mode Select & Page Range Input */}
                                <div className="grid md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Action Mode</label>
                                        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                                            <button
                                                onClick={() => setMode('extract')}
                                                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'extract' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                Extract Selected
                                            </button>
                                            <button
                                                onClick={() => setMode('split-all')}
                                                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'split-all' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                Split Every Page
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Page Range Selection <span className="text-slate-400 font-normal">(e.g. 1-3, 5, 8)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={rangeInput}
                                            onChange={(e) => applyRangeInput(e.target.value)}
                                            placeholder="e.g. 1-4, 7"
                                            disabled={mode === 'split-all'}
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none disabled:bg-slate-50 disabled:text-slate-400 font-mono"
                                        />
                                    </div>

                                    <div className="md:col-span-3 flex items-end">
                                        <button
                                            onClick={executeAction}
                                            disabled={processing || (mode !== 'split-all' && selectedCount === 0)}
                                            className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
                                        >
                                            {processing ? (
                                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                                            ) : mode === 'split-all' ? (
                                                <><i className="fas fa-file-zipper"></i> Split All ({pages.length})</>
                                            ) : (
                                                <><i className="fas fa-scissors"></i> Save {selectedCount} Page{selectedCount !== 1 ? 's' : ''}</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Result Download Banner */}
                            {resultUrl && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-emerald-900 text-sm">PDF Ready for Download!</h4>
                                            <p className="text-xs text-emerald-700 mt-0.5">{resultInfo}</p>
                                        </div>
                                    </div>

                                    <a
                                        href={resultUrl}
                                        download={mode === 'split-all' ? `${fileName}_split_pages.zip` : `${fileName}_extracted.pdf`}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                                    >
                                        <i className="fas fa-download"></i> Download {mode === 'split-all' ? 'ZIP Archive' : 'New PDF'}
                                    </a>
                                </div>
                            )}

                            {/* Visual Thumbnail Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {pages.map((p) => (
                                    <div
                                        key={p.pageNum}
                                        onClick={() => togglePage(p.pageNum)}
                                        className={`group relative bg-white rounded-xl border-2 p-2 cursor-pointer transition-all duration-150 select-none ${
                                            p.selected
                                                ? 'border-red-500 shadow-md ring-2 ring-red-500/20'
                                                : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
                                        }`}
                                    >
                                        {/* Page Number Badge */}
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <span className="text-[11px] font-bold text-slate-700">Page {p.pageNum}</span>
                                            <input
                                                type="checkbox"
                                                checked={p.selected}
                                                onChange={() => {}}
                                                className="w-4 h-4 text-red-600 rounded border-slate-300 pointer-events-none"
                                            />
                                        </div>

                                        {/* Thumbnail Canvas Render */}
                                        <div className="aspect-[1/1.414] bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                                            <img
                                                src={p.thumbUrl}
                                                alt={`Page ${p.pageNum}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Delete Quick Action on Hover */}
                                        <button
                                            title="Delete this page"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deletePage(p.pageNum)
                                            }}
                                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <i className="fas fa-trash-can"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* Step 3: Comprehensive On-Page SEO Guide */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                How to Split PDF Pages & Delete Unwanted Sheets Online
                            </h2>

                            <p className="text-base leading-relaxed">
                                Multi-page PDF documents are ubiquitous in modern work and study — from combined bank statement archives, scanned tax filings, and legal contracts to academic course syllabi and digitized receipts. Frequently, you only need to submit a specific portion of a document (for example, pages 1 to 3 of a 30-page agreement) or eliminate confidential, blank, or erroneous pages before sharing a file with clients or government portals.
                            </p>

                            <p className="text-base leading-relaxed">
                                Most cloud-based PDF tools require you to upload your sensitive contracts, financial records, or medical forms to a remote server. This presents serious confidentiality risks. Our <strong>Split PDF & Page Organizer</strong> is built entirely with client-side WebAssembly and modern JavaScript. Your PDF file never leaves your laptop, phone, or tablet. The binary manipulation happens strictly inside your local web browser memory.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                    <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Guaranteed Privacy</h4>
                                    <p className="text-xs text-slate-600">Zero file uploads to third-party servers. All processing runs in browser memory.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-bolt"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Instant Speed</h4>
                                    <p className="text-xs text-slate-600">No waiting for large files to upload and re-download over slow internet connections.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-eye"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Visual Thumbnails</h4>
                                    <p className="text-xs text-slate-600">Preview every page visually so you never accidentally delete or extract the wrong page.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                How to Use This Tool: Three Common Workflows
                            </h3>

                            <ol className="list-decimal pl-5 space-y-3">
                                <li>
                                    <strong>Extracting a Specific Page Range:</strong> Upload your PDF document. In the Page Range box, enter the specific numbers you want to keep (such as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-mono">1-4, 7, 10-12</code>). Click <strong>Save Selected Pages</strong> to generate a new, compact PDF.
                                </li>
                                <li>
                                    <strong>Deleting Unwanted Pages:</strong> Hover your mouse over any unwanted or blank page thumbnail in the grid and click the red trash icon, or simply click the card to uncheck it. Then click <strong>Save Pages</strong> to download the cleaned document with those sheets permanently removed.
                                </li>
                                <li>
                                    <strong>Splitting Every Page into Separate Files:</strong> Switch the Action Mode to <strong>Split Every Page</strong> and click the button. The tool packages each page into an individual PDF file (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">document_page_1.pdf</code>) and bundles them into a convenient ZIP archive.
                                </li>
                            </ol>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Does splitting or deleting pages reduce document text quality?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. Our tool splices the native PDF vector data and page streams losslessly. Text remains razor-sharp, fonts remain embedded, and images retain 100% of their original resolution.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Are bookmarks and hyperlinks preserved?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        When you extract a continuous range of pages, standard page-level text links and annotations within those pages are preserved. Document-level outline trees and bookmarks pointing to deleted pages are automatically pruned.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Is there any limit on file size or number of pages?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Because processing happens directly on your device using your computer's RAM, there are no artificial file size paywalls. Most modern laptops and phones comfortably handle documents with up to 100+ pages in a matter of seconds.
                                    </p>
                                </div>
                            </div>

                            {/* Related PDF Tools Navigation */}
                            <div className="mt-8 pt-6 border-t border-slate-200 not-prose">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Related PDF Utilities</p>
                                <div className="flex flex-wrap gap-2">
                                    <a href="/merge-pdf" className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-object-group mr-1 text-red-600"></i> Merge Multiple PDFs
                                    </a>
                                    <a href="/pdf-crop" className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-crop mr-1 text-red-600"></i> PDF Margin Crop
                                    </a>
                                    <a href="/pdf-to-jpg" className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-file-image mr-1 text-red-600"></i> PDF to JPG Converter
                                    </a>
                                    <a href="/jpg-to-pdf" className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-file-pdf mr-1 text-red-600"></i> JPG to PDF Converter
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

