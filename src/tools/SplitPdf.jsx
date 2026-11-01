import { useState, useRef, useEffect, useCallback } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

export default function SplitPdf() {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState(0)
    const [pages, setPages] = useState([]) // [{ num: 1, thumb: string, selected: boolean }]
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState('')
    const [previewModalPage, setPreviewModalPage] = useState(null)
    const [result, setResult] = useState(null) // { url, name, size, count }
    const [rangeInput, setRangeInput] = useState('')

    const fileInputRef = useRef(null)

    // ── Load PDF and Render Page Thumbnails ──────────────────────────────────
    const loadPdf = useCallback(async (selectedFile) => {
        if (!selectedFile || selectedFile.type !== 'application/pdf') return
        setLoading(true)
        setResult(null)
        setFile(selectedFile)
        setFileName(selectedFile.name.replace(/\.[^/.]+$/, ''))
        setFileSize(selectedFile.size)
        setPages([])
        setProgress('Loading PDF document...')

        try {
            const arrayBuffer = await selectedFile.arrayBuffer()
            const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
            const total = doc.numPages
            const items = []

            for (let i = 1; i <= total; i++) {
                setProgress(`Rendering page ${i} of ${total}...`)
                const page = await doc.getPage(i)
                const vp = page.getViewport({ scale: 0.4 })
                const canvas = document.createElement('canvas')
                canvas.width = vp.width
                canvas.height = vp.height
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, vp.width, vp.height)
                await page.render({ canvasContext: ctx, viewport: vp }).promise

                items.push({
                    num: i,
                    thumb: canvas.toDataURL('image/jpeg', 0.75),
                    selected: true, // Default to all selected
                })
            }

            setPages(items)
            setRangeInput(`1-${total}`)
        } catch (err) {
            alert('Failed to load PDF: ' + err.message)
        }
        setLoading(false)
        setProgress('')
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadPdf(e.dataTransfer.files[0])
        }
    }

    // ── Selection Toggles ─────────────────────────────────────────────────────
    const togglePage = (index) => {
        setPages((prev) => {
            const updated = [...prev]
            updated[index].selected = !updated[index].selected
            return updated
        })
    }

    const selectAll = () => setPages((p) => p.map((page) => ({ ...page, selected: true })))
    const selectNone = () => setPages((p) => p.map((page) => ({ ...page, selected: false })))
    const selectOdd = () => setPages((p) => p.map((page) => ({ ...page, selected: page.num % 2 !== 0 })))
    const selectEven = () => setPages((p) => p.map((page) => ({ ...page, selected: page.num % 2 === 0 })))

    // ── Parse Range String (e.g., "1-3, 5, 8-10") ─────────────────────────────
    const applyRangeString = () => {
        if (!rangeInput.trim()) return
        const selectedNums = new Set()
        const parts = rangeInput.split(',')

        parts.forEach((p) => {
            const clean = p.trim()
            if (clean.includes('-')) {
                const [start, end] = clean.split('-').map(Number)
                if (!isNaN(start) && !isNaN(end)) {
                    for (let n = Math.min(start, end); n <= Math.max(start, end); n++) {
                        if (n >= 1 && n <= pages.length) selectedNums.add(n)
                    }
                }
            } else {
                const n = Number(clean)
                if (!isNaN(n) && n >= 1 && n <= pages.length) selectedNums.add(n)
            }
        })

        setPages((prev) => prev.map((page) => ({ ...page, selected: selectedNums.has(page.num) })))
    }

    // ── Extract or Delete Pages Execution ─────────────────────────────────────
    const executeSplit = async (mode = 'extract') => {
        if (!file || pages.length === 0) return
        const targetPages = mode === 'extract'
            ? pages.filter((p) => p.selected)
            : pages.filter((p) => !p.selected)

        if (targetPages.length === 0) {
            alert(mode === 'extract' ? 'Please select at least one page to extract.' : 'No pages remaining after deletion! Please unselect some pages.')
            return
        }

        setProcessing(true)
        setProgress(`Creating new PDF with ${targetPages.length} pages...`)

        try {
            const { PDFDocument } = await import('pdf-lib')
            const srcBuffer = await file.arrayBuffer()
            const srcDoc = await PDFDocument.load(srcBuffer)
            const destDoc = await PDFDocument.create()

            // 0-based page indices
            const indicesToCopy = targetPages.map((p) => p.num - 1)
            const copiedPages = await destDoc.copyPages(srcDoc, indicesToCopy)

            copiedPages.forEach((p) => destDoc.addPage(p))

            const destBytes = await destDoc.save()
            const blob = new Blob([destBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            setResult({
                url,
                name: `${fileName}-${mode === 'extract' ? 'extracted' : 'trimmed'}.pdf`,
                size: blob.size,
                count: targetPages.length,
            })
        } catch (err) {
            alert('Error splitting PDF: ' + err.message)
        }

        setProcessing(false)
        setProgress('')
    }

    const formatBytes = (b) => {
        if (b < 1024) return `${b} B`
        if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
        return `${(b / 1048576).toFixed(2)} MB`
    }

    const selectedCount = pages.filter((p) => p.selected).length

    // Structured data
    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Split PDF & Delete PDF Pages Online',
        url: 'https://imgtool.in/split-pdf',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. HTML5 compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Extract specific pages, delete unwanted pages, or split PDF documents with visual thumbnail previews. 100% private in-browser tool.',
    }

    return (
        <>
            <SEO
                title="Split PDF Online - Extract or Delete PDF Pages Free"
                description="Split PDF pages visually or delete unwanted pages in your browser. Select page ranges, preview thumbnails, and download new PDFs instantly with zero uploads."
                canonical="/split-pdf"
                keywords="split pdf, delete pages from pdf, extract pdf pages, pdf page remover, separate pdf pages, split pdf free online, client side pdf splitter"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="split-pdf"
                title="Split PDF & Delete Pages"
                description="Visually split PDF files, extract selected pages into a new document, or delete unwanted pages. 100% client-side with complete privacy."
                breadcrumb="Split PDF"
            >
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Step 1: Upload Card */}
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
                                    <i className="fas fa-file-pdf"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    Drop a PDF file here or <span className="text-red-600 underline">browse</span>
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                                    Supports bank statements, contracts, books, and scanned packets. Visual thumbnails for all pages.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                                    <span><i className="fas fa-shield-alt text-red-600 mr-1"></i> 100% Private (No Server Uploads)</span>
                                    <span>•</span>
                                    <span><i className="fas fa-bolt text-amber-500 mr-1"></i> Instant Browser Processing</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-sm font-semibold text-slate-700">{progress}</p>
                            <p className="text-xs text-slate-400 mt-1">Generating high-fidelity page snapshots in browser RAM...</p>
                        </div>
                    )}

                    {/* Step 2: Visual Page Grid & Actions Dashboard */}
                    {file && !loading && (
                        <div className="space-y-6">

                            {/* Control Bar */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <i className="fas fa-file-pdf text-red-600"></i> {fileName}.pdf
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {pages.length} total pages • {formatBytes(fileSize)} • <strong>{selectedCount}</strong> pages selected
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setFile(null); setPages([]); setResult(null) }}
                                        className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                        <i className="fas fa-arrow-rotate-left"></i> Change PDF
                                    </button>
                                </div>

                                {/* Selection Tools & Presets */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-semibold text-slate-500 mr-1">Quick Select:</span>
                                        <button onClick={selectAll} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                                            All ({pages.length})
                                        </button>
                                        <button onClick={selectNone} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                                            Clear
                                        </button>
                                        <button onClick={selectOdd} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                                            Odd Pages
                                        </button>
                                        <button onClick={selectEven} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                                            Even Pages
                                        </button>
                                    </div>

                                    {/* Range Input Box */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={rangeInput}
                                            onChange={(e) => setRangeInput(e.target.value)}
                                            placeholder="e.g. 1-3, 5, 8-10"
                                            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono w-44 focus:border-red-500 focus:outline-none"
                                        />
                                        <button
                                            onClick={applyRangeString}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                                        >
                                            Apply Range
                                        </button>
                                    </div>
                                </div>

                                {/* Execution Action Buttons */}
                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={() => executeSplit('extract')}
                                        disabled={processing || selectedCount === 0}
                                        className="py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <i className="fas fa-scissors"></i> Extract Selected ({selectedCount} Pages)
                                    </button>

                                    <button
                                        onClick={() => executeSplit('delete')}
                                        disabled={processing || selectedCount === 0 || selectedCount === pages.length}
                                        className="py-3 px-4 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 disabled:opacity-50 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <i className="fas fa-trash-can text-red-500"></i> Delete Selected ({pages.length - selectedCount} Pages Left)
                                    </button>
                                </div>
                            </div>

                            {/* Download Ready Banner */}
                            {result && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20">
                                            <i className="fas fa-circle-check"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-emerald-950 text-sm">New PDF Ready for Download!</h4>
                                            <p className="text-xs text-emerald-800 mt-0.5">
                                                {result.name} • {result.count} pages • {formatBytes(result.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={result.url}
                                        download={result.name}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                                    >
                                        <i className="fas fa-download"></i> Download PDF
                                    </a>
                                </div>
                            )}

                            {/* Thumbnail Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {pages.map((p, idx) => (
                                    <div
                                        key={p.num}
                                        onClick={() => togglePage(idx)}
                                        className={`group relative rounded-xl border-2 p-2 cursor-pointer transition-all duration-150 flex flex-col items-center bg-white ${
                                            p.selected
                                                ? 'border-red-600 shadow-md ring-2 ring-red-600/20'
                                                : 'border-slate-200 opacity-60 hover:opacity-90'
                                        }`}
                                    >
                                        {/* Selection Checkbox Badge */}
                                        <div className={`absolute top-3 left-3 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shadow-sm transition-all z-10 ${
                                            p.selected ? 'bg-red-600 text-white' : 'bg-slate-200 text-transparent border border-slate-300'
                                        }`}>
                                            <i className="fas fa-check"></i>
                                        </div>

                                        {/* Page Number Badge */}
                                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900/80 text-white rounded text-[10px] font-mono font-bold z-10">
                                            {p.num}
                                        </span>

                                        {/* Thumbnail Image */}
                                        <div className="w-full aspect-[1/1.4] bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                                            <img
                                                src={p.thumb}
                                                alt={`Page ${p.num}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>

                                        <p className="text-[11px] font-semibold text-slate-700">Page {p.num}</p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* Step 3: SEO Content & Privacy Guide */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                How to Split PDF Pages and Extract Documents Online Securely
                            </h2>

                            <p className="text-base leading-relaxed">
                                Multi-page PDF documents are standard across legal, academic, and business workflows. However, you rarely need every page in a 50-page document. You might need to send only pages 1–3 of a bank statement to verify your income, delete sensitive medical history pages before submitting an insurance form, or excerpt a single chapter from a research paper.
                            </p>

                            <p className="text-base leading-relaxed">
                                Most traditional online PDF utilities require you to upload your private files to remote cloud servers. For confidential tax filings, loan agreements, or patient records, this represents an unacceptable security risk. IMG Tool's <strong>Split PDF Utility</strong> operates 100% locally in your web browser. Utilizing Mozilla's <code>pdfjs</code> engine and <code>pdf-lib</code>, your browser renders visual page snapshots and parses document trees locally in device memory. Your private documents never touch the internet.
                            </p>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                    <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Zero Cloud Uploads</h4>
                                    <p className="text-xs text-slate-600">Document data stays in your browser's RAM. Perfect for bank records and legal contracts.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-images"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Visual Page Snapshots</h4>
                                    <p className="text-xs text-slate-600">Inspect every page before splitting so you never delete the wrong section by accident.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-gauge-high"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Instant Export</h4>
                                    <p className="text-xs text-slate-600">Zero queue wait times, no bandwidth caps, and no paywalls or email registration requirements.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Practical Workflows: Extract vs. Delete
                            </h3>

                            <ul className="list-disc pl-5 space-y-2.5">
                                <li>
                                    <strong>Extracting Specific Pages:</strong> When you need just a small section from a large catalog, report, or handbook, select only the pages you want (e.g. Pages 12 to 15) and click <strong>Extract Selected</strong>. A fresh PDF containing strictly those pages will be compiled instantly.
                                </li>
                                <li>
                                    <strong>Deleting Unwanted or Blank Pages:</strong> Scanners frequently introduce empty pages, misfed sheets, or unwanted cover leaves. Simply click the checkbox on the pages you wish to remove and click <strong>Delete Selected</strong> to retain everything else.
                                </li>
                                <li>
                                    <strong>Odd &amp; Even Splitting:</strong> If you scanned a double-sided document on a single-sided sheet scanner, use the <em>Odd Pages</em> and <em>Even Pages</em> presets to separate and collate your document sequence.
                                </li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Does splitting a PDF reduce text sharpness or image quality?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. This tool does not rasterize or re-compress page contents. It extracts the raw underlying vector text, fonts, and embedded images directly from the PDF container, maintaining 100% of the original fidelity.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Is there a file size limit for splitting PDFs?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Because processing runs locally on your machine, file handling depends only on your device's available memory. Most standard laptops and smartphones handle 100+ page PDFs with ease.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Can I reorder pages after splitting?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Yes! If you need to combine pages in a new sequence or merge multiple documents together, pair this tool with our free <a href="/merge-pdf" className="text-red-600 font-semibold underline">Merge PDF Tool</a>.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </ToolLayout>
        </>
    )
}

