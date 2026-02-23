import { useState, useRef, useEffect, useCallback } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

export default function PdfCrop() {
    const [pdf, setPdf] = useState(null)
    const [pages, setPages] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [applyTo, setApplyTo] = useState('all')
    const [error, setError] = useState('')

    // Crop state
    const [cropRect, setCropRect] = useState(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawStart, setDrawStart] = useState(null)
    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
    const [pageSize, setPageSize] = useState({ w: 0, h: 0 })

    const canvasRef = useRef()
    const overlayRef = useRef()
    const containerRef = useRef()
    const inputRef = useRef()
    const pdfBufRef = useRef(null)
    const pdfDocRef = useRef(null)

    // ── Load PDF ──
    const loadPdf = async (f) => {
        if (!f || f.type !== 'application/pdf') return
        setLoading(true)
        setError('')
        setPdf(f)
        setPages([])
        setResult(null)
        setCropRect(null)

        try {
            const buf = await f.arrayBuffer()
            pdfBufRef.current = buf

            const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise
            pdfDocRef.current = doc
            setTotalPages(doc.numPages)
            setCurrentPage(1)

            // Generate thumbnails for all pages
            const thumbs = []
            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i)
                const vp = page.getViewport({ scale: 0.35 })
                const c = document.createElement('canvas')
                c.width = Math.round(vp.width)
                c.height = Math.round(vp.height)
                const ctx = c.getContext('2d')
                ctx.fillStyle = '#fff'
                ctx.fillRect(0, 0, c.width, c.height)
                await page.render({ canvasContext: ctx, viewport: vp }).promise
                thumbs.push({ num: i, thumb: c.toDataURL('image/jpeg', 0.5) })
            }
            setPages(thumbs)

            // Render first page on main canvas
            await renderPage(doc, 1)
        } catch (e) {
            console.error(e)
            setError('Error loading PDF: ' + e.message)
        }
        setLoading(false)
    }

    // ── Render page on canvas ──
    const renderPage = async (doc, pageNum) => {
        if (!canvasRef.current) return
        const page = await doc.getPage(pageNum)
        const ctr = containerRef.current
        const maxW = ctr ? ctr.clientWidth - 40 : 640
        const origVp = page.getViewport({ scale: 1 })
        const scale = Math.min(maxW / origVp.width, 680 / origVp.height, 2.5)
        const vp = page.getViewport({ scale })
        const W = Math.round(vp.width)
        const H = Math.round(vp.height)

        const canvas = canvasRef.current
        canvas.width = W
        canvas.height = H
        setCanvasSize({ w: W, h: H })
        setPageSize({ w: origVp.width, h: origVp.height })

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, W, H)
        await page.render({ canvasContext: ctx, viewport: vp }).promise
        setCropRect(null)
    }

    const goToPage = async (num) => {
        if (!pdfDocRef.current || num < 1 || num > totalPages) return
        setCurrentPage(num)
        await renderPage(pdfDocRef.current, num)
    }

    // ── Mouse crop ──
    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const sx = canvasSize.w / rect.width
        const sy = canvasSize.h / rect.height
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        const cy = e.touches ? e.touches[0].clientY : e.clientY
        return {
            x: Math.max(0, Math.min(canvasSize.w, (cx - rect.left) * sx)),
            y: Math.max(0, Math.min(canvasSize.h, (cy - rect.top) * sy)),
        }
    }

    const onDown = (e) => {
        e.preventDefault()
        const p = getPos(e)
        setDrawStart(p)
        setIsDrawing(true)
        setCropRect({ x: p.x, y: p.y, w: 0, h: 0 })
    }

    const onMove = useCallback((e) => {
        if (!isDrawing || !drawStart) return
        e.preventDefault()
        const p = getPos(e)
        setCropRect({
            x: Math.min(drawStart.x, p.x),
            y: Math.min(drawStart.y, p.y),
            w: Math.abs(p.x - drawStart.x),
            h: Math.abs(p.y - drawStart.y),
        })
    }, [isDrawing, drawStart, canvasSize])

    const onUp = () => {
        setIsDrawing(false)
        setCropRect(prev => (prev && prev.w < 8 && prev.h < 8) ? null : prev)
    }

    // ── Draw overlay ──
    useEffect(() => {
        const ov = overlayRef.current
        if (!ov || !canvasSize.w) return
        ov.width = canvasSize.w
        ov.height = canvasSize.h
        const ctx = ov.getContext('2d')
        ctx.clearRect(0, 0, ov.width, ov.height)
        if (!cropRect || cropRect.w < 2 || cropRect.h < 2) return

        const { x, y, w, h } = cropRect

        // Dim mask
        ctx.fillStyle = 'rgba(0,0,0,0.44)'
        ctx.fillRect(0, 0, ov.width, ov.height)
        ctx.clearRect(x, y, w, h)

        // Border
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 3])
        ctx.strokeRect(x, y, w, h)
        ctx.setLineDash([])

        // Rule-of-thirds
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        for (let i = 1; i <= 2; i++) {
            ctx.beginPath(); ctx.moveTo(x + w * i / 3, y); ctx.lineTo(x + w * i / 3, y + h); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(x, y + h * i / 3); ctx.lineTo(x + w, y + h * i / 3); ctx.stroke()
        }

        // Corner handles
        const HS = 8
            ;[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([cx2, cy2]) => {
                ctx.fillStyle = '#2563eb'
                ctx.fillRect(cx2 - HS / 2, cy2 - HS / 2, HS, HS)
            })

        // Dimension label
        const scX = pageSize.w / canvasSize.w
        const scY = pageSize.h / canvasSize.h
        const label = `${Math.round(w * scX)} × ${Math.round(h * scY)} pt`
        ctx.font = 'bold 12px system-ui,sans-serif'
        const tw = ctx.measureText(label).width
        const lx = x + w / 2 - tw / 2 - 6
        const ly = y + h + 26
        ctx.fillStyle = '#2563eb'
        if (ctx.roundRect) ctx.roundRect(lx, ly - 15, tw + 12, 20, 4)
        else ctx.rect(lx, ly - 15, tw + 12, 20)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.fillText(label, lx + 6, ly - 1)
    }, [cropRect, canvasSize, pageSize])

    // ── Crop PDF ──
    const doCrop = async () => {
        if (!cropRect || !pdf || !pdfBufRef.current) return
        setProcessing(true)
        setError('')
        try {
            const { PDFDocument } = await import('pdf-lib')
            const pdfDocLib = await PDFDocument.load(pdfBufRef.current.slice(0))
            const allPgs = pdfDocLib.getPages()
            const scX = pageSize.w / canvasSize.w
            const scY = pageSize.h / canvasSize.h
            const l = cropRect.x * scX
            const bot = (canvasSize.h - (cropRect.y + cropRect.h)) * scY
            const cw = cropRect.w * scX
            const ch = cropRect.h * scY
            const idxs = applyTo === 'all' ? allPgs.map((_, i) => i) : [currentPage - 1]
            idxs.forEach(i => allPgs[i].setCropBox(l, bot, cw, ch))
            const bytes = await pdfDocLib.save()
            const blob = new Blob([bytes], { type: 'application/pdf' })
            setResult({
                url: URL.createObjectURL(blob),
                name: pdf.name.replace(/\.pdf$/i, '_cropped.pdf'),
                size: blob.size,
                count: idxs.length,
            })
        } catch (e) {
            setError('Crop error: ' + e.message)
        }
        setProcessing(false)
    }

    const fs = (b) => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`
    const cropW = cropRect ? Math.round(cropRect.w * pageSize.w / canvasSize.w) : 0
    const cropH = cropRect ? Math.round(cropRect.h * pageSize.h / canvasSize.h) : 0

    return (
        <>
            <SEO title="PDF Crop Tool - Visually Crop PDF Pages Free" description="Crop PDF pages visually. Draw crop area with mouse, preview all pages, apply to single or all pages. Free & private." canonical="/pdf-crop" />
            <ToolLayout toolSlug="pdf-crop" title="PDF Crop" description="Visually crop PDF pages by drawing a selection on the preview. Apply to a single page or all pages." breadcrumb="PDF Crop">
                <div className="grid lg:grid-cols-4 gap-6">

                    {/* ═══ Main Canvas ═══ */}
                    <div className="lg:col-span-3 space-y-4" ref={containerRef}>

                        {/* Upload */}
                        {!pdf && !loading && (
                            <div className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadPdf(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}>
                                <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                                    onChange={e => loadPdf(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-4 py-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-crop text-white text-3xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-700">Drop PDF here or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-1">Draw crop area visually on the page preview</p>
                                    </div>
                                    <div className="flex gap-5 text-xs text-slate-400">
                                        <span><i className="fas fa-mouse-pointer mr-1 text-amber-400"></i>Mouse crop</span>
                                        <span><i className="fas fa-layer-group mr-1 text-amber-400"></i>All pages</span>
                                        <span><i className="fas fa-lock mr-1 text-green-400"></i>100% Private</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center gap-4 py-20">
                                <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-700">Loading PDF...</p>
                                    <p className="text-xs text-slate-400 mt-1">Rendering page previews...</p>
                                </div>
                            </div>
                        )}

                        {/* Canvas Viewer */}
                        {pdf && !loading && (
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100 flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                            <i className="fas fa-file-pdf text-red-500"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{pdf.name}</p>
                                            <p className="text-[10px] text-slate-400">{totalPages} page{totalPages !== 1 ? 's' : ''} · {fs(pdf.size)}</p>
                                        </div>
                                    </div>
                                    {/* Page Nav */}
                                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}
                                            className="w-7 h-7 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 flex items-center justify-center">
                                            <i className="fas fa-chevron-left text-xs"></i>
                                        </button>
                                        <span className="text-sm font-bold text-slate-700 px-2 min-w-[90px] text-center">
                                            Page <span className="text-amber-600">{currentPage}</span> / {totalPages}
                                        </span>
                                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}
                                            className="w-7 h-7 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 flex items-center justify-center">
                                            <i className="fas fa-chevron-right text-xs"></i>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {cropRect && cropRect.w > 8 && (
                                            <button onClick={() => setCropRect(null)} className="text-xs text-slate-400 hover:text-red-500">
                                                <i className="fas fa-undo mr-1"></i>Clear
                                            </button>
                                        )}
                                        <button onClick={() => { setPdf(null); setPages([]); setResult(null); setCropRect(null); setError('') }}
                                            className="text-xs text-slate-400 hover:text-red-500">
                                            <i className="fas fa-xmark mr-1"></i>Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Hint */}
                                <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 flex items-center gap-2">
                                    <i className="fas fa-mouse-pointer text-blue-400"></i>
                                    <span><strong>Click and drag</strong> on the page below to draw the crop area. The selected area will be <strong>kept</strong>.</span>
                                </div>

                                {/* Canvas */}
                                <div className="p-4 bg-[#e8ecf0] flex items-center justify-center min-h-[300px]">
                                    <div className="relative shadow-2xl rounded-lg overflow-hidden" style={{ lineHeight: 0 }}>
                                        <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
                                        <canvas ref={overlayRef}
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ cursor: 'crosshair', touchAction: 'none' }}
                                            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
                                            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
                                        />
                                    </div>
                                </div>

                                {/* Crop info */}
                                {cropRect && cropRect.w > 8 && (
                                    <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-100 flex flex-wrap items-center gap-4 text-xs">
                                        <span className="text-amber-800 font-bold">
                                            <i className="fas fa-crop text-amber-500 mr-1.5"></i>
                                            Selection: <span className="text-blue-700">{cropW} × {cropH} pt</span>
                                        </span>
                                        <span className="text-slate-400">Original: {Math.round(pageSize.w)} × {Math.round(pageSize.h)} pt</span>
                                        <span className="text-slate-500">
                                            Keeping: {pageSize.w ? Math.round(cropW / pageSize.w * 100) : 0}% × {pageSize.h ? Math.round(cropH / pageSize.h * 100) : 0}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Thumbnails strip */}
                        {pages.length > 1 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                                <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2">
                                    <i className="fas fa-th-large text-amber-400"></i>All Pages — Click to preview
                                </p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {pages.map(p => (
                                        <div key={p.num} onClick={() => goToPage(p.num)}
                                            className={`flex-shrink-0 cursor-pointer rounded-xl border-2 overflow-hidden transition-all
                        ${currentPage === p.num ? 'border-amber-500 ring-2 ring-amber-200 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                                            style={{ width: 72 }}>
                                            <img src={p.thumb} alt={`Page ${p.num}`} className="w-full object-cover" style={{ height: 90 }} />
                                            <p className={`text-center text-[9px] py-0.5 font-bold ${currentPage === p.num ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-500'}`}>{p.num}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className="flex items-center justify-between p-5 bg-green-50 border border-green-200 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                        <i className="fas fa-circle-check text-white text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-800">PDF Cropped!</p>
                                        <p className="text-xs text-green-600">{result.count} page{result.count > 1 ? 's' : ''} · {fs(result.size)}</p>
                                    </div>
                                </div>
                                <a href={result.url} download={result.name}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-md">
                                    <i className="fas fa-download"></i> Download
                                </a>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                                <i className="fas fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                                <div>
                                    <p className="font-bold">Error</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ Settings Panel ═══ */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-crop text-amber-500"></i> Crop Settings
                            </h3>

                            {/* Apply to */}
                            <div>
                                <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-2 font-semibold">Apply Crop To</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'current', icon: 'fa-file', label: 'Current Page', sub: `Only page ${currentPage}` },
                                        { id: 'all', icon: 'fa-layer-group', label: 'All Pages', sub: `All ${totalPages} pages` },
                                    ].map(opt => (
                                        <button key={opt.id} onClick={() => setApplyTo(opt.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all border-2
                        ${applyTo === opt.id ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200'}`}>
                                            <i className={`fas ${opt.icon} ${applyTo === opt.id ? 'text-amber-500' : 'text-slate-400'}`}></i>
                                            <div className="text-left">
                                                <div>{opt.label}</div>
                                                <div className="text-[10px] font-normal opacity-70">{opt.sub}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File info */}
                            {pdf && (
                                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">File Info</p>
                                    {[
                                        { icon: 'fa-file-pdf', c: 'text-red-400', l: 'File', v: pdf.name.length > 18 ? pdf.name.slice(0, 16) + '…' : pdf.name },
                                        { icon: 'fa-copy', c: 'text-amber-400', l: 'Pages', v: totalPages },
                                        { icon: 'fa-hdd', c: 'text-blue-400', l: 'Size', v: fs(pdf.size) },
                                        { icon: 'fa-ruler', c: 'text-green-400', l: 'Dims', v: `${Math.round(pageSize.w)} × ${Math.round(pageSize.h)} pt` },
                                        ...(cropRect && cropRect.w > 8 ? [{ icon: 'fa-crop', c: 'text-amber-500', l: 'Crop', v: `${cropW} × ${cropH} pt` }] : []),
                                    ].map(r => (
                                        <div key={r.l} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 flex items-center gap-1.5">
                                                <i className={`fas ${r.icon} ${r.c} w-3`}></i>{r.l}
                                            </span>
                                            <span className="font-semibold text-slate-700">{r.v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Crop Button */}
                            <button onClick={doCrop}
                                disabled={!cropRect || cropRect.w < 8 || !pdf || processing}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm">
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Cropping...</>
                                    : <><i className="fas fa-crop"></i> Crop {applyTo === 'all' ? `All ${totalPages} Pages` : `Page ${currentPage}`}</>
                                }
                            </button>

                            {!cropRect && pdf && (
                                <p className="text-[11px] text-center text-amber-600 bg-amber-50 rounded-lg py-2">
                                    <i className="fas fa-hand-pointer mr-1"></i>Draw a selection on the preview first
                                </p>
                            )}

                            <button onClick={() => inputRef.current?.click()}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all font-medium">
                                <i className="fas fa-folder-open mr-1.5"></i>Upload New PDF
                            </button>
                            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => loadPdf(e.target.files[0])} />
                        </div>

                        {/* How to use */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 space-y-2.5">
                            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <i className="fas fa-lightbulb text-amber-500"></i> How To Use
                            </h4>
                            {[['1', 'Upload a PDF'], ['2', 'Navigate pages with arrows'], ['3', 'Click & drag to draw crop area'], ['4', 'Choose current or all pages'], ['5', 'Crop & download']].map(([n, t]) => (
                                <div key={n} className="flex items-start gap-2 text-xs text-slate-600">
                                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{n}</span>
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
