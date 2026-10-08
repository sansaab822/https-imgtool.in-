import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const PRESETS = [
    { name: 'HD', w: 1280, h: 720, cat: 'Video' },
    { name: 'Full HD', w: 1920, h: 1080, cat: 'Video' },
    { name: '4K', w: 3840, h: 2160, cat: 'Video' },
    { name: 'Instagram Post', w: 1080, h: 1080, cat: 'Social' },
    { name: 'Instagram Story', w: 1080, h: 1920, cat: 'Social' },
    { name: 'Facebook Cover', w: 820, h: 312, cat: 'Social' },
    { name: 'Twitter Header', w: 1500, h: 500, cat: 'Social' },
    { name: 'YouTube Thumb', w: 1280, h: 720, cat: 'Social' },
    { name: 'LinkedIn Banner', w: 1584, h: 396, cat: 'Social' },
    { name: 'Pinterest Pin', w: 1000, h: 1500, cat: 'Social' },
    { name: 'WhatsApp DP', w: 500, h: 500, cat: 'Social' },
    { name: 'TikTok', w: 1080, h: 1920, cat: 'Social' },
    { name: 'Thumbnail', w: 320, h: 180, cat: 'General' },
    { name: 'A4 (300dpi)', w: 2480, h: 3508, cat: 'Print' },
    { name: 'A3 (300dpi)', w: 3508, h: 4961, cat: 'Print' },
    { name: 'Desktop 1080p', w: 1920, h: 1080, cat: 'General' },
    { name: 'Desktop 4K', w: 3840, h: 2160, cat: 'General' },
]

const PCT_PRESETS = [25, 50, 75, 125, 150, 200]

const FIT_MODES = [
    { id: 'fit', label: 'Fit', icon: 'fa-down-left-and-up-right-to-center', desc: 'Keep aspect ratio, fit inside' },
    { id: 'fill', label: 'Fill', icon: 'fa-up-right-and-down-left-from-center', desc: 'Fill area, may crop' },
    { id: 'stretch', label: 'Stretch', icon: 'fa-expand', desc: 'Exact size, ignore ratio' },
]

const OUTPUT_FORMATS = [
    { id: 'png', label: 'PNG', mime: 'image/png' },
    { id: 'jpg', label: 'JPG', mime: 'image/jpeg' },
    { id: 'webp', label: 'WebP', mime: 'image/webp' },
]

export default function ImageResizer() {
    const [image, setImage] = useState(null)
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [lockAspect, setLockAspect] = useState(true)
    const [fitMode, setFitMode] = useState('fit')
    const [outputFmt, setOutputFmt] = useState('png')
    const [quality, setQuality] = useState(92)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [presetCat, setPresetCat] = useState('Social')
    const [resizing, setResizing] = useState(false)
    const [showCompare, setShowCompare] = useState(false)
    const [compareX, setCompareX] = useState(50)
    const [isDraggingSlider, setIsDraggingSlider] = useState(false)
    const imgRef = useRef()
    const inputRef = useRef()
    const compareRef = useRef()

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            setImage({ url, file, origW: img.naturalWidth, origH: img.naturalHeight, ratio: img.naturalWidth / img.naturalHeight })
            setWidth(img.naturalWidth)
            setHeight(img.naturalHeight)
            setResult(null)
        }
        img.src = url
    }, [])

    const handleWidthChange = (val) => {
        const w = parseInt(val) || ''
        setWidth(w)
        if (lockAspect && w && image) setHeight(Math.round(w / image.ratio))
    }
    const handleHeightChange = (val) => {
        const h = parseInt(val) || ''
        setHeight(h)
        if (lockAspect && h && image) setWidth(Math.round(h * image.ratio))
    }

    const applyPreset = (p) => {
        setWidth(p.w)
        setHeight(p.h)
        setLockAspect(false)
    }

    const applyPercent = (pct) => {
        if (!image) return
        setWidth(Math.round(image.origW * pct / 100))
        setHeight(Math.round(image.origH * pct / 100))
    }

    const handleResize = async () => {
        if (!image || !width || !height) return
        setResizing(true)
        await new Promise(r => setTimeout(r, 50))

        const img = new Image()
        img.src = image.url
        await new Promise(r => { img.onload = r })

        let canvasW = parseInt(width), canvasH = parseInt(height)
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
        let dx = 0, dy = 0, dw = canvasW, dh = canvasH

        if (fitMode === 'fit') {
            const scale = Math.min(canvasW / img.naturalWidth, canvasH / img.naturalHeight)
            dw = Math.round(img.naturalWidth * scale)
            dh = Math.round(img.naturalHeight * scale)
            canvasW = dw; canvasH = dh
        } else if (fitMode === 'fill') {
            const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight)
            sw = canvasW / scale
            sh = canvasH / scale
            sx = (img.naturalWidth - sw) / 2
            sy = (img.naturalHeight - sh) / 2
        }

        const canvas = document.createElement('canvas')
        canvas.width = canvasW
        canvas.height = canvasH
        const ctx = canvas.getContext('2d')

        const fmt = OUTPUT_FORMATS.find(f => f.id === outputFmt)
        if (outputFmt === 'jpg') {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvasW, canvasH)
        }
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)

        const q = outputFmt === 'png' ? undefined : quality / 100
        const blob = await new Promise(r => canvas.toBlob(r, fmt.mime, q))
        const baseName = image.file.name.replace(/\.[^.]+$/, '')
        setResult({
            url: URL.createObjectURL(blob),
            name: `${baseName}_${canvasW}x${canvasH}.${outputFmt}`,
            w: canvasW,
            h: canvasH,
            size: blob.size,
        })
        setResizing(false)
    }

    const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    const onCompareMove = useCallback((e) => {
        if (!isDraggingSlider || !compareRef.current) return
        const rect = compareRef.current.getBoundingClientRect()
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        setCompareX(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
    }, [isDraggingSlider])

    const categories = [...new Set(PRESETS.map(p => p.cat))]

    return (
        <>
            <SEO title="Image Resizer - Resize Images Online Free" description="Resize images by pixels, percentage, or social media presets. Supports fit, fill, stretch modes. Free & private." canonical="/image-resizer" />
            <ToolLayout toolSlug="image-resizer" title="Image Resizer" description="Resize images by pixels, percentage, or popular presets for social media, print, and web." breadcrumb="Image Resizer">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {!image ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-expand text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop image to resize or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">All formats supported · Accurate resize</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                {/* Image info bar */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center"><i className="fas fa-image text-cyan-500 text-sm"></i></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 truncate max-w-xs">{image.file.name}</p>
                                            <p className="text-xs text-slate-400">{image.origW}×{image.origH}px · {formatSize(image.file.size)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setImage(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>

                                {/* Preview / Comparison Slider */}
                                {result && showCompare ? (
                                    <div
                                        ref={compareRef}
                                        className="bg-slate-50 rounded-xl overflow-hidden relative select-none"
                                        style={{ minHeight: 250, cursor: 'col-resize' }}
                                        onMouseDown={() => setIsDraggingSlider(true)}
                                        onTouchStart={() => setIsDraggingSlider(true)}
                                        onMouseMove={onCompareMove}
                                        onTouchMove={onCompareMove}
                                        onMouseUp={() => setIsDraggingSlider(false)}
                                        onTouchEnd={() => setIsDraggingSlider(false)}
                                        onMouseLeave={() => setIsDraggingSlider(false)}
                                    >
                                        <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}>
                                            <div className="absolute inset-0 bg-slate-50" />
                                            <img src={result.url} alt="Resized" className="absolute inset-0 w-full h-full object-contain" />
                                        </div>
                                        <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareX}%` }}>
                                            <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-lg" />
                                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-cyan-100">
                                                <i className="fas fa-arrows-left-right text-cyan-500 text-xs"></i>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">ORIGINAL {image.origW}×{image.origH}</div>
                                        <div className="absolute top-2 right-2 z-10 bg-cyan-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">RESIZED {result.w}×{result.h}</div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[200px]">
                                        <img ref={imgRef} src={result?.url || image.url} alt="Preview" className="max-h-[250px] md:max-h-[350px] max-w-full object-contain rounded-lg" />
                                    </div>
                                )}

                                {/* Result Info */}
                                {result && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-circle-check text-green-500"></i>
                                            <span className="text-sm font-bold text-green-800">Resized to {result.w}×{result.h}px</span>
                                            <span className="text-xs text-green-600">({formatSize(result.size)})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setShowCompare(c => !c); setCompareX(50) }}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${showCompare ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}>
                                                <i className="fas fa-eye mr-1"></i>Compare
                                            </button>
                                            <a href={result.url} download={result.name} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                                <i className="fas fa-download"></i> Download
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        {/* Size Controls */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-ruler-combined text-cyan-500"></i> Resize Settings
                            </h3>

                            {/* Width × Height */}
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="block text-[10px] text-slate-500 mb-1 font-medium">Width (px)</label>
                                    <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} placeholder="Width"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none" />
                                </div>
                                <button onClick={() => setLockAspect(!lockAspect)}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all mb-px ${lockAspect ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <i className={`fas fa-${lockAspect ? 'lock' : 'lock-open'} text-xs`}></i>
                                </button>
                                <div className="flex-1">
                                    <label className="block text-[10px] text-slate-500 mb-1 font-medium">Height (px)</label>
                                    <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} placeholder="Height"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-cyan-500 outline-none" />
                                </div>
                            </div>

                            {/* Percentage Presets */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Scale by Percentage</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {PCT_PRESETS.map(p => (
                                        <button key={p} onClick={() => applyPercent(p)}
                                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-600 text-slate-600 text-xs font-bold rounded-lg transition-all">
                                            {p}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fit Mode */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Fit Mode</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {FIT_MODES.map(m => (
                                        <button key={m.id} onClick={() => setFitMode(m.id)}
                                            className={`py-2 rounded-lg text-center transition-all ${fitMode === m.id ? 'bg-cyan-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-cyan-50'}`}>
                                            <i className={`fas ${m.icon} text-sm mb-0.5 block`}></i>
                                            <span className="text-[10px] font-bold">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Output Format */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Output Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {OUTPUT_FORMATS.map(f => (
                                        <button key={f.id} onClick={() => setOutputFmt(f.id)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${outputFmt === f.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality for lossy */}
                            {outputFmt !== 'png' && (
                                <div>
                                    <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                        <span>Quality</span><span className="font-bold text-cyan-600">{quality}%</span>
                                    </label>
                                    <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                                </div>
                            )}

                            {/* Resize Button */}
                            <button onClick={handleResize} disabled={!image || !width || !height || resizing}
                                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                                {resizing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Resizing...</>
                                ) : (
                                    <><i className="fas fa-expand"></i> Resize Image</>
                                )}
                            </button>

                            <button onClick={() => { setImage(null); setResult(null) }} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                Upload New Image
                            </button>
                        </div>

                        {/* Presets */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <i className="fas fa-wand-magic-sparkles text-purple-500"></i> Quick Presets
                            </h3>
                            <div className="flex gap-1.5">
                                {categories.map(c => (
                                    <button key={c} onClick={() => setPresetCat(c)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${presetCat === c ? 'bg-purple-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-purple-50'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {PRESETS.filter(p => p.cat === presetCat).map(p => (
                                    <button key={p.name} onClick={() => applyPreset(p)}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-purple-50 rounded-lg transition-all group">
                                        <span className="text-xs font-medium text-slate-700 group-hover:text-purple-700">{p.name}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{p.w}×{p.h}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <img
                        src="/images/tools/image-resizer-tool.png"
                        alt="Image Resizer Tool Interface"
                        title="Resize Images Online For Free"
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-sm mb-8 border border-slate-100"
                    />

                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Browser-Based Image Resizing</h2>
                        <p>
                            Digital platforms enforce strict dimension guidelines. When you upload an image that is too large or uses the wrong aspect ratio, social networks and CMS platforms often aggressively compress or crop it. This tool lets you manually set the exact width, height, and aspect ratio of your image before uploading, giving you control over how the final asset is displayed.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">How Resizing Works Under the Hood</h3>
                        <p>
                            When you drop an image into this tool, your browser renders it onto an invisible HTML5 canvas element. Depending on the fit mode you select (Fit, Fill, or Stretch), the canvas calculates the new bounding box and redraws the image data at the new scale. Because this process uses your local machine's memory rather than a remote server, it is secure and operates with zero network latency.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Fit Modes Explained</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Fit (Preserve Ratio):</strong> The image scales down until it fits entirely inside your target dimensions. If the aspect ratios differ, transparent (or white) padding is added to the sides or top.</li>
                            <li><strong>Fill (Crop to Ratio):</strong> The image scales so that it completely covers the target dimensions. Any excess image data outside the bounding box is cropped and discarded.</li>
                            <li><strong>Stretch (Ignore Ratio):</strong> The image forces its width and height to match your targets exactly, causing the image to look squished or stretched.</li>
                        </ul>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 my-6">
                            <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <i className="fas fa-info-circle text-blue-500"></i> Next Steps
                            </h4>
                            <p className="text-sm text-blue-800 mb-0">
                                If your resized image file is still too large in kilobytes, run it through our <a href="/image-compressor" className="font-bold underline hover:text-blue-600">Image Compressor</a>. If you need to isolate a subject before resizing, use the <a href="/bg-remover" className="font-bold underline hover:text-blue-600">Background Remover</a>.
                            </p>
                        </div>

                        <img
                            src="/images/tools/image-resizer-example.png"
                            alt="Visual Example of an Image Being Resized Proportionally"
                            title="Image Resizer Example"
                            loading="lazy"
                            className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                        />

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Limitations and Recommended Practices</h3>
                        <p>
                            Traditional resizing cannot invent missing detail. While you can technically enlarge a small file using this utility, the browser must stretch existing pixels, which inevitably leads to a blurry or blocky appearance. For crisp results, we recommend starting with a high-resolution source file and scaling down.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">Does changing the pixel dimensions reduce the file size?</h4>
                                <p className="mt-1">Yes. Scaling down the physical dimensions (e.g., from 4000px to 1000px) significantly reduces the total amount of pixel data, resulting in a smaller file size in kilobytes.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why does my photo look distorted?</h4>
                                <p className="mt-1">Distortion occurs when you manually enter a new width and height while the "Lock Aspect Ratio" feature is disabled. To prevent this, keep the lock enabled or use the 'Fill' mode to crop instead of stretch.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What output formats are supported?</h4>
                                <p className="mt-1">The canvas engine natively exports to JPEG, PNG, and WebP. You can upload most standard web formats and select your preferred output.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
