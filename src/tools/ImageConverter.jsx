import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'
import { getToolBySlug } from '../data/toolsData'

const FORMAT_NAMES = {
    jpg: 'JPG', jpeg: 'JPEG', png: 'PNG', webp: 'WebP', avif: 'AVIF',
    gif: 'GIF', bmp: 'BMP', ico: 'ICO', svg: 'SVG', tiff: 'TIFF',
    heic: 'HEIC', raw: 'RAW', cr2: 'CR2',
}

const LOSSY_FORMATS = ['jpg', 'jpeg', 'webp']

const FORMAT_INFO = {
    jpg: { emoji: '📷', tip: 'Best for photos & web. Lossy compression. Universal support.' },
    png: { emoji: '🖼️', tip: 'Lossless with transparency. Great for graphics & screenshots.' },
    webp: { emoji: '🌐', tip: 'Modern format by Google. 30% smaller than JPG at same quality.' },
    avif: { emoji: '⚡', tip: 'Next-gen format. 50% smaller than JPG. Growing browser support.' },
    gif: { emoji: '🎞️', tip: 'Supports animation. Limited to 256 colors per frame.' },
    bmp: { emoji: '📋', tip: 'Uncompressed bitmap. Large files but no quality loss.' },
    ico: { emoji: '🔖', tip: 'Icon format for favicons. Fixed small sizes (16-256px).' },
    svg: { emoji: '📐', tip: 'Vector format. Infinitely scalable. Best for logos & icons.' },
    tiff: { emoji: '🗄️', tip: 'Professional format. Lossless. Used in print & publishing.' },
    heic: { emoji: '📱', tip: 'Apple\'s format. 2× smaller than JPG. iPhone default.' },
    raw: { emoji: '📸', tip: 'Camera RAW. Unprocessed sensor data.' },
    cr2: { emoji: '📸', tip: 'Canon RAW format. Maximum quality from Canon cameras.' },
}

const ICO_SIZES = [
    { label: '16×16', w: 16 },
    { label: '32×32', w: 32 },
    { label: '48×48', w: 48 },
    { label: '64×64', w: 64 },
    { label: '128×128', w: 128 },
    { label: '256×256', w: 256 },
]

export default function ImageConverter({ from, to }) {
    const slug = `${from}-to-${to}`
    const tool = getToolBySlug(slug)
    const fromName = FORMAT_NAMES[from] || from.toUpperCase()
    const toName = FORMAT_NAMES[to] || to.toUpperCase()
    const title = `${fromName} to ${toName} Converter`
    const desc = tool?.description || `Convert ${fromName} images to ${toName} format free online. No upload needed — 100% private.`

    const [files, setFiles] = useState([])
    const [results, setResults] = useState([])
    const [quality, setQuality] = useState(92)
    const [resizeEnabled, setResizeEnabled] = useState(false)
    const [resizeW, setResizeW] = useState('')
    const [resizeH, setResizeH] = useState('')
    const [keepAspect, setKeepAspect] = useState(true)
    const [icoSize, setIcoSize] = useState(32)
    const [dragging, setDragging] = useState(false)
    const [converting, setConverting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentFile, setCurrentFile] = useState('')
    const fileInputRef = useRef()

    const getMimeType = (fmt) => {
        const map = {
            jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
            gif: 'image/gif', bmp: 'image/bmp', svg: 'image/svg+xml', tiff: 'image/tiff', avif: 'image/avif',
        }
        return map[fmt] || 'image/png'
    }

    const addFiles = useCallback((newFiles) => {
        const valid = Array.from(newFiles).filter(f => {
            if (from === 'heic') return f.name.toLowerCase().match(/\.(heic|heif)$/)
            if (from === 'avif') return f.type === 'image/avif' || f.name.toLowerCase().endsWith('.avif')
            if (from === 'raw' || from === 'cr2') return f.name.toLowerCase().match(/\.(raw|cr2|nef|arw)$/)
            return f.type.startsWith('image/')
        })
        setFiles(prev => [...prev, ...valid.map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            status: 'pending',
        }))])
        setResults([])
    }, [from])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setDragging(false)
        addFiles(e.dataTransfer.files)
    }, [addFiles])

    const convertFile = async (fileObj, idx, total) => {
        const { file } = fileObj
        try {
            setCurrentFile(file.name)

            // Handle HEIC via heic2any
            if (from === 'heic') {
                const heic2any = (await import('heic2any')).default
                const blob = await heic2any({ blob: file, toType: getMimeType(to), quality: quality / 100 })
                const resultBlob = blob instanceof Array ? blob[0] : blob
                const url = URL.createObjectURL(resultBlob)
                const baseName = file.name.replace(/\.(heic|heif)$/i, '')
                return { url, name: `${baseName}.${to}`, originalSize: file.size, convertedSize: resultBlob.size }
            }

            // All other formats via Canvas
            const img = new Image()
            const srcUrl = URL.createObjectURL(file)
            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = srcUrl })
            URL.revokeObjectURL(srcUrl)

            let width = img.naturalWidth, height = img.naturalHeight

            // Apply resize if enabled
            if (resizeEnabled && (resizeW || resizeH)) {
                const newW = parseInt(resizeW) || 0
                const newH = parseInt(resizeH) || 0
                if (keepAspect) {
                    if (newW && !newH) { height = Math.round(height * (newW / width)); width = newW }
                    else if (newH && !newW) { width = Math.round(width * (newH / height)); height = newH }
                    else if (newW && newH) { height = Math.round(height * (newW / width)); width = newW }
                } else {
                    if (newW) width = newW
                    if (newH) height = newH
                }
            }

            // ICO output size
            if (to === 'ico') { width = icoSize; height = icoSize }

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')

            // White background for formats that don't support transparency
            if (LOSSY_FORMATS.includes(to) || to === 'bmp') {
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, width, height)
            }
            ctx.drawImage(img, 0, 0, width, height)

            let blob
            if (to === 'ico') {
                blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
            } else if (to === 'svg') {
                const dataUrl = canvas.toDataURL('image/png')
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="${dataUrl}" width="${width}" height="${height}"/></svg>`
                blob = new Blob([svgContent], { type: 'image/svg+xml' })
            } else {
                const mime = getMimeType(to)
                const q = LOSSY_FORMATS.includes(to) ? quality / 100 : undefined
                blob = await new Promise(r => canvas.toBlob(r, mime, q))
            }

            const url = URL.createObjectURL(blob)
            const baseName = file.name.replace(/\.[^.]+$/, '')
            setProgress(Math.round(((idx + 1) / total) * 100))
            return {
                url,
                name: `${baseName}.${to === 'ico' ? 'ico' : to}`,
                originalSize: file.size,
                convertedSize: blob.size,
                width,
                height,
            }
        } catch (err) {
            console.error('Conversion error:', err)
            return { error: true, name: file.name, message: err.message }
        }
    }

    const handleConvert = async () => {
        if (!files.length) return
        setConverting(true)
        setProgress(0)
        const out = []
        for (let i = 0; i < files.length; i++) {
            const result = await convertFile(files[i], i, files.length)
            if (result) out.push(result)
        }
        setResults(out)
        setConverting(false)
        setProgress(100)
        setCurrentFile('')
    }

    const downloadAll = async () => {
        const valid = results.filter(r => !r.error)
        if (valid.length === 1) {
            const a = document.createElement('a')
            a.href = valid[0].url; a.download = valid[0].name; a.click()
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
        a.href = URL.createObjectURL(blob); a.download = `${fromName}_to_${toName}.zip`; a.click()
    }

    const moveFile = (idx, dir) => {
        setFiles(prev => {
            const arr = [...prev]
            const newIdx = idx + dir
            if (newIdx < 0 || newIdx >= arr.length) return arr
                ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
            return arr
        })
    }

    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx))
    const clearAll = () => { setFiles([]); setResults([]) }

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / 1048576).toFixed(2)} MB`
    }

    const totalOriginal = results.reduce((a, r) => a + (r.originalSize || 0), 0)
    const totalConverted = results.reduce((a, r) => a + (r.convertedSize || 0), 0)
    const savedPct = totalOriginal > 0 ? Math.round((1 - totalConverted / totalOriginal) * 100) : 0

    const fromInfo = FORMAT_INFO[from] || { emoji: '📄', tip: '' }
    const toInfo = FORMAT_INFO[to] || { emoji: '📄', tip: '' }

    return (
        <>
            <SEO title={`${title} - Free Online`} description={desc} canonical={`/${slug}`} />
            <ToolLayout toolSlug={slug} title={title} description={desc} breadcrumb={title}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Format Info Banner */}
                        <div className="flex gap-3">
                            <div className="flex-1 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-3 flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">{fromInfo.emoji}</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">{fromName}</p>
                                    <p className="text-[11px] text-slate-500 leading-snug">{fromInfo.tip}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-slate-300"><i className="fas fa-arrow-right"></i></div>
                            <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-3 flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">{toInfo.emoji}</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-700">{toName}</p>
                                    <p className="text-[11px] text-slate-500 leading-snug">{toInfo.tip}</p>
                                </div>
                            </div>
                        </div>

                        {/* Drop Zone */}
                        <div
                            className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={e => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" multiple accept={`image/*,.${from},.heic,.heif,.avif,.raw,.cr2`} className="hidden" onChange={e => addFiles(e.target.files)} />
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-cloud-arrow-up text-white text-2xl"></i>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-700">Drop {fromName} files here or <span className="text-blue-600">browse</span></p>
                                    <p className="text-slate-400 text-sm mt-0.5">Batch upload supported · Processed 100% in your browser</p>
                                </div>
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-700 text-sm">
                                        <i className="fas fa-layer-group text-blue-500 mr-2"></i>
                                        {files.length} file{files.length > 1 ? 's' : ''} selected
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                            <i className="fas fa-plus mr-1"></i>Add More
                                        </button>
                                        <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-600">
                                            <i className="fas fa-trash mr-1"></i>Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                                            <img src={f.preview} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
                                                <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {files.length > 1 && (
                                                    <>
                                                        <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-500 text-xs flex items-center justify-center">
                                                            <i className="fas fa-chevron-up"></i>
                                                        </button>
                                                        <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-500 text-xs flex items-center justify-center">
                                                            <i className="fas fa-chevron-down"></i>
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => removeFile(i)} className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 text-xs flex items-center justify-center ml-1">
                                                    <i className="fas fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Progress */}
                        {converting && (
                            <div className="bg-white rounded-xl border border-blue-100 p-5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Converting...</p>
                                            <p className="text-xs text-slate-400 truncate max-w-xs">{currentFile}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600 tabular-nums">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {results.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-b border-green-100">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-circle-check text-green-500"></i>
                                        <span className="font-bold text-green-800 text-sm">
                                            {results.filter(r => !r.error).length} converted successfully
                                        </span>
                                        {savedPct > 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{savedPct}% smaller</span>
                                        )}
                                        {savedPct < 0 && (
                                            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{Math.abs(savedPct)}% larger</span>
                                        )}
                                    </div>
                                    <button onClick={downloadAll} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                                        <i className="fas fa-download"></i>
                                        {results.filter(r => !r.error).length > 1 ? 'Download All (ZIP)' : `Download ${toName}`}
                                    </button>
                                </div>

                                {/* Summary */}
                                {results.length > 1 && (
                                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-6 text-xs text-slate-500">
                                        <span><i className="fas fa-file-import mr-1 text-slate-400"></i>Original: {formatSize(totalOriginal)}</span>
                                        <span><i className="fas fa-file-export mr-1 text-blue-400"></i>Converted: {formatSize(totalConverted)}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
                                    {results.map((r, i) => (
                                        <div key={i} className={`border rounded-xl overflow-hidden group transition-all hover:shadow-md ${r.error ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}>
                                            {r.error ? (
                                                <div className="h-28 flex flex-col items-center justify-center p-3">
                                                    <i className="fas fa-circle-xmark text-red-400 text-2xl mb-1"></i>
                                                    <p className="text-[10px] text-red-500 text-center truncate w-full">{r.name}</p>
                                                    <p className="text-[10px] text-red-400">{r.message}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {to !== 'ico' && to !== 'svg' ? (
                                                        <img src={r.url} alt={r.name} className="w-full h-28 object-cover" />
                                                    ) : (
                                                        <div className="w-full h-28 bg-slate-50 flex items-center justify-center text-3xl">{toInfo.emoji}</div>
                                                    )}
                                                    <div className="p-2.5 space-y-1.5">
                                                        <p className="text-xs text-slate-700 truncate font-medium">{r.name}</p>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] text-slate-400 line-through">{formatSize(r.originalSize)}</span>
                                                                <span className="text-xs text-green-600 font-bold">{formatSize(r.convertedSize)}</span>
                                                            </div>
                                                            {r.width && <span className="text-[10px] text-slate-400">{r.width}×{r.height}</span>}
                                                        </div>
                                                        <a href={r.url} download={r.name} className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-lg transition-all">
                                                            <i className="fas fa-download"></i> Download
                                                        </a>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel: Settings ── */}
                    <div className="space-y-4">
                        {/* Conversion Settings */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-gear text-blue-500"></i> Conversion Settings
                            </h3>

                            {/* Quality Slider */}
                            {LOSSY_FORMATS.includes(to) && (
                                <div>
                                    <label className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                                        <span>Output Quality</span>
                                        <span className={`font-bold ${quality >= 80 ? 'text-green-600' : quality >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{quality}%</span>
                                    </label>
                                    <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>Smaller file</span>
                                        <span>Better quality</span>
                                    </div>
                                    {/* Quick presets */}
                                    <div className="flex gap-2 mt-2">
                                        {[
                                            { label: 'Low', val: 40, desc: 'Smallest' },
                                            { label: 'Medium', val: 70, desc: 'Balanced' },
                                            { label: 'High', val: 92, desc: 'Best' },
                                            { label: 'Max', val: 100, desc: 'Original' },
                                        ].map(p => (
                                            <button key={p.val} onClick={() => setQuality(p.val)}
                                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${quality === p.val ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
                                            >{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ICO Size */}
                            {to === 'ico' && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">Icon Size</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {ICO_SIZES.map(s => (
                                            <button key={s.w} onClick={() => setIcoSize(s.w)}
                                                className={`py-2 rounded-lg text-xs font-bold transition-all ${icoSize === s.w ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}
                                            >{s.label}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resize on Convert */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={resizeEnabled} onChange={e => setResizeEnabled(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-medium text-slate-600">Resize while converting</span>
                                </label>
                                {resizeEnabled && (
                                    <div className="mt-3 space-y-2 pl-6">
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-0.5">Width (px)</label>
                                                <input type="number" value={resizeW} onChange={e => setResizeW(e.target.value)} placeholder="auto"
                                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-blue-500 outline-none" />
                                            </div>
                                            <span className="text-slate-300 mt-3.5">×</span>
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-0.5">Height (px)</label>
                                                <input type="number" value={resizeH} onChange={e => setResizeH(e.target.value)} placeholder="auto"
                                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-blue-500 outline-none" />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600" />
                                            <span className="text-[11px] text-slate-500">Keep aspect ratio</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Convert Button */}
                            <button
                                onClick={handleConvert}
                                disabled={!files.length || converting}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {converting ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Converting {progress}%</>
                                ) : (
                                    <><i className="fas fa-bolt"></i> Convert {files.length > 1 ? `${files.length} Files` : 'File'} to {toName}</>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-blue-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2"><i className="fas fa-shield-halved text-blue-500"></i> Features</h4>
                            {[
                                { icon: 'fa-layer-group', text: 'Batch convert multiple files at once', color: 'text-blue-500' },
                                { icon: 'fa-sliders', text: 'Quality control for lossy formats', color: 'text-purple-500' },
                                { icon: 'fa-expand', text: 'Optional resize during conversion', color: 'text-green-500' },
                                { icon: 'fa-file-zipper', text: 'Download all as ZIP', color: 'text-amber-500' },
                                { icon: 'fa-lock', text: '100% private — browser only', color: 'text-slate-500' },
                            ].map(f => (
                                <div key={f.text} className="flex items-center gap-2 text-xs text-slate-600">
                                    <i className={`fas ${f.icon} ${f.color} w-4 text-center flex-shrink-0`}></i> {f.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                {slug === 'bmp-to-gif' ? (
                    <div className="mt-8 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">BMP to GIF Converter: A Complete Guide</h2>
                            <p>
                                Working with different image formats can sometimes feel like trying to fit a square peg into a round hole. If you have ever dealt with old digital graphics, screenshots from legacy software, or raw scanner outputs, you have likely encountered Bitmap or BMP files. These files are notorious for being completely uncompressed and extraordinarily large, which makes them highly impractical for modern digital use. Sharing them online, embedding them in web pages, or trying to send them through standard email attachments often results in frustrating error messages. Furthermore, if you are building a website, loading heavy, unoptimized graphics will slow down your page speed significantly, driving visitors away and harming your search engine rankings.
                            </p>
                            <p>
                                This is exactly where a reliable BMP to GIF converter becomes an essential part of your digital toolkit. Instead of wasting valuable device storage or failing to upload graphics to message boards and social platforms that only accept lightweight formats, you can easily change these bulky files into something much more manageable. The GIF format is universally recognized, incredibly lightweight, and perfectly suited for simple graphics, logos, flat illustrations, and line art. Imgtool.in offers a remarkably straightforward way to handle this conversion right inside your web browser. You get to fix the problem of oversized, clunky images without ever needing to download complicated software, register for an account, or pay for premium subscriptions.
                            </p>

                            <h3 className="text-lg font-bold text-slate-800 mt-6">Tool Solution</h3>
                            <p>
                                Our conversion utility takes the heavy, pixel-by-pixel data from your original file and intelligently translates it into the highly compressed, indexed color palette of a GIF. Because the entire underlying structure of the image is rebuilt efficiently during the conversion process, the resulting file is often a mere fraction of its original size. This makes the new graphic instantly ready for web use, quick sharing, or archiving without chewing up your hard drive space.
                            </p>

                            <h3 className="text-lg font-bold text-slate-800 mt-6">Benefits of Changing Formats</h3>
                            <p>
                                There are several distinct advantages when you convert BMP to GIF, especially if you handle simple illustrations, digital drawings, or web UI elements frequently.
                            </p>
                            <p>
                                First and foremost is the massive reduction in file size. Bitmaps store exact color and positional data for every single pixel without applying any real compression algorithms. This is why even a relatively small, simple drawing can take up several megabytes of storage space. By switching to the target format, the image relies on a limited, optimized color palette consisting of 256 colors maximum. For graphics without complex gradients or millions of shades, this algorithm means you save an enormous amount of digital space without losing the crisp sharpness of the original image.
                            </p>
                            <p>
                                Another major benefit is widespread, flawless compatibility. Almost every digital platform in existence—including ancient message boards, modern social media platforms, basic email clients, and every single web browser—fully supports reading and displaying these files. You will rarely, if ever, encounter an "unsupported format" error when sharing your work. Additionally, if you are preparing graphics for a webpage, this file type is historically trusted and extremely reliable for interface elements that do not require high color depth.
                            </p>
                            <p>
                                While working on your digital pictures, you might also find that you need to optimize other formats in your library. For instance, if you have standard JPG photographs that are too large for an online application, you can try our <a href="/image-compressor" className="text-blue-600 hover:underline">Image Compressor Tool</a> to shrink them down. Or, if you need to adjust the physical pixel dimensions of your graphic before converting it to another format, our <a href="/image-resizer" className="text-blue-600 hover:underline">Image Resizer Tool</a> works perfectly alongside this format conversion utility. We also feature a <a href="/heic-to-jpg" className="text-blue-600 hover:underline">HEIC to JPG Converter</a> if you are trying to deal with photos taken on modern smartphone devices.
                            </p>

                            <h3 className="text-lg font-bold text-slate-800 mt-6">Step-by-Step Instructions</h3>
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Click the main upload box visible on the page, or simply drag your bulky Bitmap file directly from your computer's folder and drop it into the designated upload area.</li>
                                    <li>Wait a brief moment as the local system reads your file. The tool will display its current size and dimensions so you can verify you have selected the correct graphic.</li>
                                    <li>Hit the convert button to let your browser process the image. The time this takes depends entirely on the initial size of your file and the processing power of your device, but it usually finishes in seconds.</li>
                                    <li>Once the mathematical processing finishes, the interface will present your newly generated file. Click the download button to save your lightweight, web-ready graphic directly to your device's local storage.</li>
                                </ol>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mt-6">Best Practices and Tips</h3>
                            <p>
                                To get the most out of your BMP image converter, it helps to understand best practices and when this specific format change is actually appropriate for your needs.
                            </p>
                            <p>
                                Always review the visual complexity of your source image first. Because the destination format only supports up to 256 colors simultaneously, this conversion is absolutely perfect for flat graphics, text-based images, company logos, and sharp pixel art. However, if your original image is a highly detailed, colorful photograph of a natural landscape or a portrait, forcing it into this format will result in a noticeable loss of color depth and visible banding across smooth gradients.
                            </p>
                            <p>
                                Furthermore, try to crop away any unnecessary blank borders before you upload the file for conversion. Less visual information for the algorithm to process means an even smaller final output. You can utilize our <a href="/crop-image" className="text-blue-600 hover:underline">Image Cropper Tool</a> prior to making the GIF format converter switch if you need to cleanly trim the edges of your canvas.
                            </p>

                            <h3 className="text-lg font-bold text-slate-800 mt-6 pt-4 border-t border-slate-100">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-slate-700">Why does my converted image look slightly grainy or speckled?</h4>
                                    <p className="mt-1">This visual artifact happens because the final format maps the original file's potential millions of colors down to a strict, limited palette of just 256 colors. For simple, flat graphics, this reduction is completely invisible. However, for complex photos with smooth, subtle gradients, the color reduction process uses a technique called dithering to simulate missing colors, which can create a grainy or speckled appearance across the image.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700">Does this tool support creating animated loops from my static files?</h4>
                                    <p className="mt-1">No, it does not. This specific conversion utility is designed exclusively to convert a single, static frame Bitmap into a static, single-frame graphic. It does not contain the timeline features necessary to stitch multiple separate files together into a moving animation.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700">How large of a file can I attempt to upload at once?</h4>
                                    <p className="mt-1">Because imgtool.in handles the heavy lifting directly within your own web browser rather than sending the massive files over the internet to a server, the practical upload limit depends heavily on your specific device's available memory. Most modern desktop computers, laptops, and newer smartphones should easily handle processing files up to 20MB without experiencing any browser stuttering or crashing.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700">Will the background of my image become transparent automatically?</h4>
                                    <p className="mt-1">The conversion process simply translates your existing visible pixels. If your original file had a solid white background covering the canvas, the newly generated file will also have a solid white background. Standard Bitmap files do not support transparency initially, so there is no transparent alpha-channel data to carry over during the format change.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700">If I convert the file back again later, will I regain the lost colors?</h4>
                                    <p className="mt-1">Unfortunately, no. Changing a file into a 256-color palette is a destructive process regarding color data. The intricate color information that was discarded to make the file smaller is gone permanently. Converting it back to a heavier format later will only result in a large file that still looks exactly like the color-restrained version. Always keep a backup of your master files.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-3">How to Convert {fromName} to {toName}</h2>
                        <div className="grid sm:grid-cols-4 gap-4">
                            {[
                                { step: '1', icon: 'fa-upload', title: 'Upload', desc: `Drop or browse your ${fromName} file(s)` },
                                { step: '2', icon: 'fa-sliders', title: 'Adjust', desc: 'Set quality, size, or other options' },
                                { step: '3', icon: 'fa-bolt', title: 'Convert', desc: `Click convert to process to ${toName}` },
                                { step: '4', icon: 'fa-download', title: 'Download', desc: 'Get your files individually or as ZIP' },
                            ].map(s => (
                                <div key={s.step} className="text-center">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                                        <i className={`fas ${s.icon} text-sm`}></i>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{s.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-slate-500 text-xs mt-4 text-center">
                            All conversions happen in your browser. Files are never uploaded to any server.
                        </p>
                    </div>
                )}
            </ToolLayout>
        </>
    )
}
