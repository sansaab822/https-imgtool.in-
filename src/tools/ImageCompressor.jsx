import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const PRESETS = [
    { label: 'Light', quality: 85, desc: 'Minimal loss', icon: 'fa-feather', color: 'text-green-500' },
    { label: 'Balanced', quality: 65, desc: 'Good balance', icon: 'fa-scale-balanced', color: 'text-blue-500' },
    { label: 'Maximum', quality: 40, desc: 'Smallest size', icon: 'fa-compress', color: 'text-amber-500' },
]

const OUTPUT_FORMATS = [
    { id: 'original', label: 'Keep Original', mime: null },
    { id: 'jpg', label: 'JPG', mime: 'image/jpeg' },
    { id: 'webp', label: 'WebP', mime: 'image/webp' },
    { id: 'png', label: 'PNG', mime: 'image/png' },
]

export default function ImageCompressor() {
    const [files, setFiles] = useState([])
    const [results, setResults] = useState([])
    const [quality, setQuality] = useState(75)
    const [outputFmt, setOutputFmt] = useState('original')
    const [compressing, setCompressing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [compareIdx, setCompareIdx] = useState(null)
    const [compareX, setCompareX] = useState(50)
    const [isDraggingSlider, setIsDraggingSlider] = useState(false)
    const inputRef = useRef()
    const compareRef = useRef()

    const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    const getMime = (file) => {
        if (outputFmt !== 'original') return OUTPUT_FORMATS.find(f => f.id === outputFmt)?.mime
        if (file.type === 'image/png') return 'image/png'
        if (file.type === 'image/webp') return 'image/webp'
        return 'image/jpeg'
    }

    const getExt = (file) => {
        if (outputFmt !== 'original') return outputFmt
        if (file.type === 'image/png') return 'png'
        if (file.type === 'image/webp') return 'webp'
        return 'jpg'
    }

    const addFiles = useCallback((newFiles) => {
        const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
        setFiles(prev => [...prev, ...valid.map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
        }))])
        setResults([])
        setCompareIdx(null)
    }, [])

    const compress = async () => {
        if (!files.length) return
        setCompressing(true)
        setProgress(0)

        const out = []
        for (let i = 0; i < files.length; i++) {
            const f = files[i]
            try {
                const img = new Image()
                img.src = f.preview
                await new Promise(r => { img.onload = r })
                const canvas = document.createElement('canvas')
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight
                const ctx = canvas.getContext('2d')
                const mime = getMime(f.file)
                if (mime === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                }
                ctx.drawImage(img, 0, 0)
                const blob = await new Promise(r => canvas.toBlob(r, mime, quality / 100))
                const baseName = f.name.replace(/\.[^.]+$/, '')
                const ext = getExt(f.file)
                out.push({
                    url: URL.createObjectURL(blob),
                    preview: f.preview,
                    name: `${baseName}_compressed.${ext}`,
                    originalSize: f.size,
                    compressedSize: blob.size,
                    width: canvas.width,
                    height: canvas.height,
                    savedPct: Math.round((1 - blob.size / f.size) * 100),
                })
            } catch (err) {
                out.push({ error: true, name: f.name, message: err.message })
            }
            setProgress(Math.round(((i + 1) / files.length) * 100))
        }
        setResults(out)
        setCompressing(false)
    }

    const downloadAll = async () => {
        const valid = results.filter(r => !r.error)
        if (valid.length === 1) {
            const a = document.createElement('a'); a.href = valid[0].url; a.download = valid[0].name; a.click()
            return
        }
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        for (const r of valid) {
            const res = await fetch(r.url)
            zip.file(r.name, await res.blob())
        }
        const blob = await zip.generateAsync({ type: 'blob' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob); a.download = 'compressed_images.zip'; a.click()
    }

    const totalOriginal = results.reduce((a, r) => a + (r.originalSize || 0), 0)
    const totalCompressed = results.reduce((a, r) => a + (r.compressedSize || 0), 0)
    const totalSaved = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0

    // Compare slider handlers
    const onCompareMove = useCallback((e) => {
        if (!isDraggingSlider || !compareRef.current) return
        const rect = compareRef.current.getBoundingClientRect()
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        setCompareX(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
    }, [isDraggingSlider])

    return (
        <>
            <SEO title="Image Compressor - Reduce File Size Free Online" description="Compress images without losing quality. Supports JPG, PNG, WebP. Batch compression with visual comparison. 100% private." canonical="/image-compressor" />
            <ToolLayout toolSlug="image-compressor" title="Image Compressor" description="Reduce image file size while maintaining quality. Batch compress with before/after comparison." breadcrumb="Image Compressor">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Drop Zone */}
                        <div
                            className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                            onDragOver={e => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addFiles(e.target.files)} />
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-compress text-white text-2xl"></i>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-700">Drop images to compress or <span className="text-blue-600">browse</span></p>
                                    <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP supported · Batch processing</p>
                                </div>
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && !results.length && (
                            <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-slate-700 text-sm">{files.length} image{files.length > 1 ? 's' : ''} selected</h3>
                                    <div className="flex gap-3">
                                        <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 font-medium"><i className="fas fa-plus mr-1"></i>Add</button>
                                        <button onClick={() => { setFiles([]); setResults([]) }} className="text-xs text-red-400 hover:text-red-600"><i className="fas fa-trash mr-1"></i>Clear</button>
                                    </div>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                            <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 truncate font-medium">{f.name}</p>
                                                <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                                            </div>
                                            <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 text-xs"><i className="fas fa-xmark"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Progress */}
                        {compressing && (
                            <div className="bg-white rounded-xl border border-orange-100 p-5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-semibold text-slate-700">Compressing...</span>
                                    </div>
                                    <span className="text-sm font-bold text-orange-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {results.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                {/* Summary Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-b border-green-100">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-circle-check text-green-500"></i>
                                        <span className="font-bold text-green-800 text-sm">{results.filter(r => !r.error).length} compressed</span>
                                        {totalSaved > 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                                {formatSize(totalOriginal - totalCompressed)} saved ({totalSaved}%)
                                            </span>
                                        )}
                                    </div>
                                    <button onClick={downloadAll} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                        <i className="fas fa-download"></i>{results.filter(r => !r.error).length > 1 ? 'Download All (ZIP)' : 'Download'}
                                    </button>
                                </div>

                                {/* Individual Results */}
                                <div className="divide-y divide-slate-100">
                                    {results.map((r, i) => !r.error && (
                                        <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                                            <img src={r.url} alt="" className="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 truncate">{r.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-400 line-through">{formatSize(r.originalSize)}</span>
                                                    <i className="fas fa-arrow-right text-[8px] text-slate-300"></i>
                                                    <span className="text-xs text-green-600 font-bold">{formatSize(r.compressedSize)}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.savedPct > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {r.savedPct > 0 ? `−${r.savedPct}%` : `+${Math.abs(r.savedPct)}%`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button onClick={() => { setCompareIdx(i); setCompareX(50) }} className="text-xs text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-eye mr-1"></i>Compare</button>
                                                <a href={r.url} download={r.name} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-lg transition-all">
                                                    <i className="fas fa-download mr-1"></i>Save
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Compare View */}
                        {compareIdx !== null && results[compareIdx] && !results[compareIdx].error && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                                    <span className="text-sm font-bold text-slate-700">← Original / Compressed → (drag to compare)</span>
                                    <button onClick={() => setCompareIdx(null)} className="text-xs text-slate-400 hover:text-slate-600"><i className="fas fa-xmark mr-1"></i>Close</button>
                                </div>
                                <div
                                    ref={compareRef}
                                    className="relative select-none overflow-hidden bg-slate-100"
                                    style={{ minHeight: 300, cursor: 'col-resize' }}
                                    onMouseDown={() => setIsDraggingSlider(true)}
                                    onTouchStart={() => setIsDraggingSlider(true)}
                                    onMouseMove={onCompareMove}
                                    onTouchMove={onCompareMove}
                                    onMouseUp={() => setIsDraggingSlider(false)}
                                    onTouchEnd={() => setIsDraggingSlider(false)}
                                    onMouseLeave={() => setIsDraggingSlider(false)}
                                >
                                    <img src={results[compareIdx].preview} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}>
                                        <div className="absolute inset-0 bg-slate-100" />
                                        <img src={results[compareIdx].url} alt="Compressed" className="absolute inset-0 w-full h-full object-contain" />
                                    </div>
                                    <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareX}%` }}>
                                        <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-lg" />
                                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-orange-100">
                                            <i className="fas fa-arrows-left-right text-orange-500 text-xs"></i>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">
                                        ORIGINAL · {formatSize(results[compareIdx].originalSize)}
                                    </div>
                                    <div className="absolute top-3 right-3 z-10 bg-orange-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">
                                        COMPRESSED · {formatSize(results[compareIdx].compressedSize)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* New batch */}
                        {results.length > 0 && (
                            <button onClick={() => { setFiles([]); setResults([]); setCompareIdx(null) }}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-all">
                                <i className="fas fa-plus mr-2"></i>Compress More Images
                            </button>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-gear text-orange-500"></i> Compression Settings
                            </h3>

                            {/* Preset Buttons */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">Quick Presets</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PRESETS.map(p => (
                                        <button key={p.label} onClick={() => setQuality(p.quality)}
                                            className={`py-2.5 rounded-xl text-center transition-all ${quality === p.quality ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-slate-50 hover:bg-orange-50 text-slate-600'}`}>
                                            <i className={`fas ${p.icon} ${quality === p.quality ? 'text-white' : p.color} text-sm mb-0.5`}></i>
                                            <p className="text-xs font-bold">{p.label}</p>
                                            <p className="text-[10px] opacity-75">{p.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                                    <span>Quality</span>
                                    <span className={`font-bold ${quality >= 80 ? 'text-green-600' : quality >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{quality}%</span>
                                </label>
                                <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>Maximum compression</span><span>Maximum quality</span>
                                </div>
                            </div>

                            {/* Output Format */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {OUTPUT_FORMATS.map(f => (
                                        <button key={f.id} onClick={() => setOutputFmt(f.id)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${outputFmt === f.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Compress Button */}
                            <button
                                onClick={compress}
                                disabled={!files.length || compressing}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                {compressing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Compressing {progress}%</>
                                ) : (
                                    <><i className="fas fa-compress"></i> Compress {files.length > 1 ? `${files.length} Images` : 'Image'}</>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl border border-orange-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm"><i className="fas fa-bolt text-orange-500 mr-2"></i>Features</h4>
                            {['Batch compress multiple images', 'Visual before/after comparison', 'Output format selection', 'Download all as ZIP', '100% browser-based — no uploads'].map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                    <i className="fas fa-check text-green-500 flex-shrink-0"></i> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
