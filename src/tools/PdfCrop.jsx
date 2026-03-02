import { useState, useRef, useEffect, useCallback } from 'react'
import { pdfjsLib } from '../utils/pdfWorker'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Margin Presets ──────────────────────────────────────────────────────────
const MARGIN_PRESETS = [
    { id: 'none', label: 'No Margin', top: 0, right: 0, bottom: 0, left: 0 },
    { id: 'small', label: 'Small (5pt)', top: 5, right: 5, bottom: 5, left: 5 },
    { id: 'medium', label: 'Medium (15pt)', top: 15, right: 15, bottom: 15, left: 15 },
    { id: 'large', label: 'Large (30pt)', top: 30, right: 30, bottom: 30, left: 30 },
    { id: 'custom', label: 'Custom', top: 0, right: 0, bottom: 0, left: 0 },
]

export default function PdfCrop() {
    // ── File / PDF state ──────────────────────────────────────────────────────
    const [pdf, setPdf] = useState(null)      // File object
    const [pages, setPages] = useState([])     // [{num, thumb}]
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [applyTo, setApplyTo] = useState('all')   // 'all' | 'current'
    const [error, setError] = useState('')

    // ── Canvas / Crop state ───────────────────────────────────────────────────
    const [cropRect, setCropRect] = useState(null)    // {x,y,w,h} in canvas px
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawStart, setDrawStart] = useState(null)
    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
    const [pageSize, setPageSize] = useState({ w: 0, h: 0 })  // PDF pt size

    // ── Margin mode state ─────────────────────────────────────────────────────
    const [mode, setMode] = useState('draw')          // 'draw' | 'margin'
    const [marginPreset, setMarginPreset] = useState('none')
    const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 })

    // ── Refs ──────────────────────────────────────────────────────────────────
    const canvasRef = useRef()
    const overlayRef = useRef()
    const containerRef = useRef()
    const inputRef = useRef()
    const pdfFileRef = useRef(null)   // Stores original File — NOT ArrayBuffer (avoids detachment)
    const pdfDocRef = useRef(null)    // pdfjs document
    const needsRender = useRef(false) // flag: render after loading clears

    // ── Load PDF ──────────────────────────────────────────────────────────────
    const loadPdf = async (f) => {
        if (!f || f.type !== 'application/pdf') return
        setLoading(true)
        setError('')
        setPdf(f)
        pdfFileRef.current = f          // Store File object for later re-reads
        setPages([])
        setResult(null)
        setCropRect(null)
        needsRender.current = false

        try {
            // FIX: copy the buffer before passing to pdfjs so it isn't detached
            const buf = await f.arrayBuffer()
            const bufCopy = buf.slice(0)

            const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bufCopy) }).promise
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

            // Signal that we need to render page 1 after the canvas becomes visible
            needsRender.current = true

        } catch (e) {
            console.error(e)
            setError('Error loading PDF: ' + e.message)
        }
        // FIX: set loading false AFTER all async work — the useEffect below will
        // catch the transition and render the canvas once the DOM is visible.
        setLoading(false)
    }

    // ── Render page on canvas ─────────────────────────────────────────────────
    const renderPage = useCallback(async (doc, pageNum) => {
        if (!canvasRef.current || !containerRef.current) return
        const page = await doc.getPage(pageNum)
        const ctr = containerRef.current
        const maxW = Math.max(ctr.clientWidth - 40, 400)
        const origVp = page.getViewport({ scale: 1 })
        const scale = Math.min(maxW / origVp.width, 700 / origVp.height, 2.5)
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
    }, [])

    // ── FIX: Render page once loading turns false and canvas is visible ────────
    useEffect(() => {
        if (!loading && needsRender.current && pdfDocRef.current) {
            needsRender.current = false
            // Small rAF delay ensures the DOM has painted and clientWidth is valid
            requestAnimationFrame(() => {
                renderPage(pdfDocRef.current, 1)
            })
        }
    }, [loading, renderPage])

    const goToPage = async (num) => {
        if (!pdfDocRef.current || num < 1 || num > totalPages) return
        setCurrentPage(num)
        await renderPage(pdfDocRef.current, num)
    }

    // ── Mouse / touch crop drawing ────────────────────────────────────────────
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
        if (mode !== 'draw') return
        e.preventDefault()
        const p = getPos(e)
        setDrawStart(p)
        setIsDrawing(true)
        setCropRect({ x: p.x, y: p.y, w: 0, h: 0 })
    }

    const onMove = useCallback((e) => {
        if (!isDrawing || !drawStart || mode !== 'draw') return
        e.preventDefault()
        const p = getPos(e)
        setCropRect({
            x: Math.min(drawStart.x, p.x),
            y: Math.min(drawStart.y, p.y),
            w: Math.abs(p.x - drawStart.x),
            h: Math.abs(p.y - drawStart.y),
        })
    }, [isDrawing, drawStart, canvasSize, mode])

    const onUp = () => {
        setIsDrawing(false)
        setCropRect(prev => (prev && prev.w < 8 && prev.h < 8) ? null : prev)
    }

    // ── Draw overlay canvas ───────────────────────────────────────────────────
    useEffect(() => {
        const ov = overlayRef.current
        if (!ov || !canvasSize.w) return
        ov.width = canvasSize.w
        ov.height = canvasSize.h
        const ctx = ov.getContext('2d')
        ctx.clearRect(0, 0, ov.width, ov.height)

        // In margin mode, compute effective cropRect from margins
        let rect = cropRect
        if (mode === 'margin' && pageSize.w) {
            const scX = canvasSize.w / pageSize.w
            const scY = canvasSize.h / pageSize.h
            rect = {
                x: margins.left * scX,
                y: margins.top * scY,
                w: canvasSize.w - (margins.left + margins.right) * scX,
                h: canvasSize.h - (margins.top + margins.bottom) * scY,
            }
        }

        if (!rect || rect.w < 2 || rect.h < 2) return

        const { x, y, w, h } = rect

        // Dim mask
        ctx.fillStyle = 'rgba(0,0,0,0.44)'
        ctx.fillRect(0, 0, ov.width, ov.height)
        ctx.clearRect(x, y, w, h)

        // Dashed border
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 3])
        ctx.strokeRect(x, y, w, h)
        ctx.setLineDash([])

        // Rule-of-thirds grid
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'
        ctx.lineWidth = 1
        for (let i = 1; i <= 2; i++) {
            ctx.beginPath(); ctx.moveTo(x + w * i / 3, y); ctx.lineTo(x + w * i / 3, y + h); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(x, y + h * i / 3); ctx.lineTo(x + w, y + h * i / 3); ctx.stroke()
        }

        // Corner handles
        const HS = 9
            ;[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([hx, hy]) => {
                ctx.fillStyle = '#f59e0b'
                ctx.fillRect(hx - HS / 2, hy - HS / 2, HS, HS)
            })

        // Dimension label
        const scX = pageSize.w / canvasSize.w
        const scY2 = pageSize.h / canvasSize.h
        const label = `${Math.round(w * scX)} × ${Math.round(h * scY2)} pt`
        ctx.font = 'bold 12px system-ui,sans-serif'
        const tw = ctx.measureText(label).width
        const lx = x + w / 2 - tw / 2 - 6
        const ly = Math.max(y + h + 26, y + 26)
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        if (ctx.roundRect) ctx.roundRect(lx, ly - 15, tw + 12, 20, 4)
        else ctx.rect(lx, ly - 15, tw + 12, 20)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.fillText(label, lx + 6, ly - 1)
    }, [cropRect, canvasSize, pageSize, mode, margins])

    // ── Margin preset change handler ──────────────────────────────────────────
    const applyMarginPreset = (id) => {
        setMarginPreset(id)
        const p = MARGIN_PRESETS.find(m => m.id === id)
        if (p && id !== 'custom') setMargins({ top: p.top, right: p.right, bottom: p.bottom, left: p.left })
    }

    // ── Compute effective cropRect for cropping ───────────────────────────────
    const getEffectiveCropRect = () => {
        if (mode === 'margin') {
            if (!pageSize.w) return null
            const scX = canvasSize.w / pageSize.w
            const scY = canvasSize.h / pageSize.h
            return {
                x: margins.left * scX,
                y: margins.top * scY,
                w: canvasSize.w - (margins.left + margins.right) * scX,
                h: canvasSize.h - (margins.top + margins.bottom) * scY,
            }
        }
        return cropRect
    }

    // ── Crop PDF using pdf-lib ────────────────────────────────────────────────
    const doCrop = async () => {
        const eff = getEffectiveCropRect()
        if (!eff || eff.w < 4 || !pdf) return
        setProcessing(true)
        setError('')
        try {
            // FIX: re-read file fresh → new ArrayBuffer, never detached
            const freshBuf = await pdfFileRef.current.arrayBuffer()
            const { PDFDocument } = await import('pdf-lib')
            const pdfDocLib = await PDFDocument.load(freshBuf)
            const allPgs = pdfDocLib.getPages()
            const scX = pageSize.w / canvasSize.w
            const scY = pageSize.h / canvasSize.h
            const l = eff.x * scX
            const bot = (canvasSize.h - (eff.y + eff.h)) * scY
            const cw = eff.w * scX
            const ch = eff.h * scY
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
            console.error(e)
            setError('Crop error: ' + e.message)
        }
        setProcessing(false)
    }

    const fs = (b) => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    // Derived effective rect for the info bar
    const eff = getEffectiveCropRect()
    const cropW = eff ? Math.round(eff.w * pageSize.w / canvasSize.w) : 0
    const cropH = eff ? Math.round(eff.h * pageSize.h / canvasSize.h) : 0
    const hasSelection = eff && eff.w > 8 && eff.h > 8

    return (
        <>
            <SEO
                title="PDF Crop Tool - Visually Crop PDF Pages Free Online"
                description="Crop PDF pages visually. Draw crop area with mouse or set margins, apply to one or all pages, batch download. Free, 100% private — no upload."
                canonical="/pdf-crop"
            />
            <ToolLayout
                toolSlug="pdf-crop"
                title="PDF Crop Tool"
                description="Crop PDF pages visually — draw a selection or set precise margins. Apply to current page or all pages at once."
                breadcrumb="PDF Crop"
            >
                <div className="grid lg:grid-cols-4 gap-6">

                    {/* ═════ Main Canvas ═════ */}
                    <div className="lg:col-span-3 space-y-4" ref={containerRef}>

                        {/* Upload Drop Zone */}
                        {!pdf && !loading && (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadPdf(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                                    onChange={e => loadPdf(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <i className="fas fa-crop text-white text-4xl"></i>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-xl font-bold text-slate-700">Drop PDF here or <span className="text-amber-600">browse</span></p>
                                        <p className="text-slate-400 text-sm">Draw crop area visually — no upload, 100% private</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                                        <span><i className="fas fa-mouse-pointer mr-1 text-amber-400"></i>Draw crop area</span>
                                        <span><i className="fas fa-layer-group mr-1 text-amber-400"></i>All pages at once</span>
                                        <span><i className="fas fa-ruler mr-1 text-blue-400"></i>Margin mode</span>
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
                                    <p className="text-xs text-slate-400 mt-1">Rendering page thumbnails</p>
                                </div>
                            </div>
                        )}

                        {/* Canvas Viewer — only shown when pdf loaded and not loading */}
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
                                        {hasSelection && (
                                            <button onClick={() => { setCropRect(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                                <i className="fas fa-undo mr-1"></i>Clear
                                            </button>
                                        )}
                                        <button onClick={() => { setPdf(null); setPages([]); setResult(null); setCropRect(null); setError(''); pdfDocRef.current = null; pdfFileRef.current = null }}
                                            className="text-xs text-slate-400 hover:text-red-500">
                                            <i className="fas fa-xmark mr-1"></i>Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Mode Switch */}
                                <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500">Mode:</span>
                                    <div className="flex rounded-lg overflow-hidden border border-slate-200">
                                        {[['draw', '✏️ Draw Crop Area'], ['margin', '📐 Margin Trim']].map(([id, label]) => (
                                            <button key={id} onClick={() => setMode(id)}
                                                className={`px-4 py-1.5 text-xs font-bold transition-all ${mode === id ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 hover:bg-amber-50'}`}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-400 hidden sm:block">
                                        {mode === 'draw' ? 'Click and drag on the page to select the area to keep' : 'Set margins from each edge to trim uniformly'}
                                    </span>
                                </div>

                                {/* Margin mode controls */}
                                {mode === 'margin' && (
                                    <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 space-y-3">
                                        <div className="flex gap-2 flex-wrap">
                                            {MARGIN_PRESETS.map(p => (
                                                <button key={p.id} onClick={() => applyMarginPreset(p.id)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${marginPreset === p.id ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-amber-100 border border-slate-200'}`}>
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['top', 'right', 'bottom', 'left'].map(side => (
                                                <div key={side}>
                                                    <label className="block text-[10px] text-slate-500 capitalize mb-0.5">{side} (pt)</label>
                                                    <input
                                                        type="number" min="0" max="300"
                                                        value={margins[side]}
                                                        onChange={e => { setMarginPreset('custom'); setMargins(m => ({ ...m, [side]: +e.target.value })) }}
                                                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Main Canvas */}
                                <div className="p-4 bg-[#e8ecf0] flex items-center justify-center min-h-[350px]">
                                    <div className="relative shadow-2xl rounded-lg overflow-hidden" style={{ lineHeight: 0 }}>
                                        <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
                                        <canvas ref={overlayRef}
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ cursor: mode === 'draw' ? 'crosshair' : 'default', touchAction: 'none' }}
                                            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
                                            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
                                        />
                                    </div>
                                </div>

                                {/* Selection info bar */}
                                {hasSelection && (
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
                        {pages.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <i className="fas fa-th text-amber-400 text-sm"></i>
                                    <span className="text-xs font-bold text-slate-700">All Pages — Click to preview</span>
                                </div>
                                <div className="flex gap-3 p-4 overflow-x-auto">
                                    {pages.map(p => (
                                        <button key={p.num} onClick={() => goToPage(p.num)}
                                            className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${currentPage === p.num ? 'border-amber-500 shadow-md shadow-amber-100' : 'border-slate-200'}`}>
                                            <img src={p.thumb} alt={`Page ${p.num}`} className="w-[90px] object-cover" />
                                            <p className={`text-center text-[10px] py-1 font-bold ${currentPage === p.num ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                                                {p.num}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <i className="fas fa-circle-exclamation text-red-500 mt-0.5"></i>
                                <div className="flex-1">
                                    <p className="font-bold text-red-700 text-sm">Error</p>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><i className="fas fa-xmark"></i></button>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-circle-check text-green-500 text-xl"></i>
                                    <div>
                                        <p className="font-bold text-green-800 text-sm">Cropped Successfully!</p>
                                        <p className="text-xs text-green-600">{result.count} page{result.count !== 1 ? 's' : ''} cropped · {fs(result.size)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={result.url} download={result.name}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
                                        <i className="fas fa-download"></i> Download PDF
                                    </a>
                                    <button onClick={() => setResult(null)}
                                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-all">
                                        Crop Again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═════ Right Panel ═════ */}
                    <div className="space-y-4">
                        {/* Crop Settings */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <i className="fas fa-crop text-amber-500"></i>Crop Settings
                            </h3>

                            {/* Apply To */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Apply Crop To</label>
                                <div className="space-y-2">
                                    <button onClick={() => setApplyTo('current')}
                                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border-2 transition-all ${applyTo === 'current' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'}`}>
                                        <i className={`fas fa-file mt-0.5 ${applyTo === 'current' ? 'text-amber-500' : 'text-slate-300'}`}></i>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-700">Current Page</p>
                                            <p className="text-[10px] text-slate-400">Only page {currentPage}</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setApplyTo('all')}
                                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border-2 transition-all ${applyTo === 'all' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'}`}>
                                        <i className={`fas fa-layer-group mt-0.5 ${applyTo === 'all' ? 'text-amber-500' : 'text-slate-300'}`}></i>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-700">All Pages</p>
                                            <p className="text-[10px] text-slate-400">All {totalPages} pages</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* File Info */}
                            {pdf && (
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] text-slate-500 mb-1 font-medium uppercase tracking-wide">File Info</label>
                                    {[
                                        { icon: 'fa-file-pdf text-red-400', label: 'File', val: pdf.name.length > 18 ? pdf.name.slice(0, 18) + '…' : pdf.name },
                                        { icon: 'fa-book-open text-amber-400', label: 'Pages', val: totalPages },
                                        { icon: 'fa-weight-hanging text-blue-400', label: 'Size', val: fs(pdf.size) },
                                        { icon: 'fa-chart-simple text-green-400', label: 'Dims', val: pageSize.w ? `${Math.round(pageSize.w)} × ${Math.round(pageSize.h)} pt` : '0 × 0 pt' },
                                        hasSelection ? { icon: 'fa-crop text-orange-400', label: 'Crop', val: `${cropW} × ${cropH} pt` } : null,
                                    ].filter(Boolean).map(it => (
                                        <div key={it.label} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500 flex items-center gap-1.5"><i className={`fas ${it.icon}`}></i>{it.label}</span>
                                            <span className="font-bold text-slate-700 text-right max-w-[110px] truncate">{it.val}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Crop Button */}
                            <button
                                onClick={doCrop}
                                disabled={!hasSelection || processing || !pdf}
                                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
                                    : <><i className="fas fa-crop"></i>Crop {applyTo === 'all' ? `All ${totalPages} Pages` : `Page ${currentPage}`}</>
                                }
                            </button>

                            {!hasSelection && pdf && !loading && (
                                <p className="text-[10px] text-center text-slate-400">
                                    {mode === 'draw' ? 'Draw a selection on the preview first' : 'Set margins above to define crop area'}
                                </p>
                            )}

                            {pdf && (
                                <button
                                    onClick={() => { setPdf(null); setPages([]); setResult(null); setCropRect(null); setError(''); pdfDocRef.current = null; pdfFileRef.current = null }}
                                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all"
                                >
                                    Upload New PDF
                                </button>
                            )}
                        </div>

                        {/* How To Use */}
                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm"><i className="fas fa-circle-info text-amber-500 mr-2"></i>How To Use</h4>
                            {[
                                'Upload a PDF',
                                'Navigate pages with arrows',
                                'Click & drag to draw crop area',
                                'Or switch to Margin mode',
                                'Choose current or all pages',
                                'Crop & download',
                            ].map((s, i) => (
                                <div key={s} className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="w-5 h-5 flex-shrink-0 rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Visual PDF Crop Tool — Trim Pages Precisely</h2>
                        <p>
                            Our advanced PDF Crop tool lets you visually select the area you want to keep on any PDF page, without the need for any desktop software. Simply upload your PDF, draw a crop region on the live canvas preview, and download the cropped document instantly — all processing happens locally in your browser.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800">Two Cropping Modes</h3>
                        <p>
                            Use <strong>Draw mode</strong> to manually drag a crop rectangle over the exact area you want to keep. Switch to <strong>Margin Trim mode</strong> to uniformly trim a fixed number of points from each edge — perfect for removing scanner borders or standardizing whitespace across a document.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800">Apply to One Page or All Pages</h3>
                        <p>
                            You can apply the crop to just the current page or to every page in the document simultaneously. When cropping all pages, the same crop box coordinates are applied to each page, making it ideal for batch-trimming scanned documents or standardizing margins across a report.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800">100% Private — No Upload</h3>
                        <p>
                            The entire PDF processing pipeline runs inside your browser using <strong>PDF.js</strong> for rendering and <strong>pdf-lib</strong> for editing. Your documents never leave your device, ensuring complete privacy.
                        </p>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
