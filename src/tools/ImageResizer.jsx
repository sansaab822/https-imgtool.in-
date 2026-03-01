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
    const imgRef = useRef()
    const inputRef = useRef()

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
                                        <p className="text-slate-400 text-sm mt-0.5">All formats supported · Pixel-perfect resize</p>
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

                                {/* Preview */}
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[200px]">
                                    <img ref={imgRef} src={result?.url || image.url} alt="Preview" className="max-h-[350px] max-w-full object-contain rounded-lg" />
                                </div>

                                {/* Result Info */}
                                {result && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-circle-check text-green-500"></i>
                                            <span className="text-sm font-bold text-green-800">Resized to {result.w}×{result.h}px</span>
                                            <span className="text-xs text-green-600">({formatSize(result.size)})</span>
                                        </div>
                                        <a href={result.url} download={result.name} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                            <i className="fas fa-download"></i> Download
                                        </a>
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
                        <h2 className="text-2xl font-bold text-slate-800">The Ultimate Free Image Resizer for Every Platform</h2>
                        <p>
                            Getting your visual content to fit perfectly across different digital platforms is a constant struggle for creators, marketers, and developers alike. Whether you are trying to upload a profile picture that keeps getting cropped awkwardly or preparing an advertising banner that requires exact pixel dimensions, a reliable image resizer is an absolute must-have utility. Our tool empowers you to scale your photographs precisely without relying on heavy desktop software. It takes the guesswork out of formatting by giving you total control over the exact width, height, and aspect ratio of your files directly within your browser.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Why Precise Dimensions Matter</h3>
                        <p>
                            Digital platforms enforce strict dimension guidelines for a reason. If you upload a massive 4K photograph as your Facebook profile picture, the social network will aggressively shrink and compress it, often resulting in a blurry, pixelated mess. Conversely, if you try to stretch a tiny thumbnail to fit a YouTube banner, it will look completely distorted. By manually adjusting the pixel dimensions of your assets prior to uploading them, you ensure that algorithms do not ruin your hard work. This process guarantees that your visuals look incredibly sharp and professional exactly where they are meant to be displayed.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Versatile Real-World Scenarios</h3>
                        <p>
                            This utility is designed for maximum versatility. Graphic designers use it consistently to generate multiple variations of a single master concept, exporting perfectly sized copies for Instagram stories, Twitter headers, and LinkedIn banners in seconds using our built-in preset buttons. E-commerce store owners leverage the pixel-perfect controls to ensure all product gallery thumbnails have completely uniform dimensions, which is critical for maintaining a clean, trustworthy website design. Even everyday users find it invaluable for shrinking massive smartphone photos down to more reasonable dimensions before emailing them to family members.
                        </p>

                        <p>
                            If you have successfully scaled your graphic but find that the resulting file size in megabytes is still too large for your specific needs, we highly recommend running the output through our dedicated <a href="/image-compressor" className="text-cyan-600 hover:underline">Image Compressor Tool</a> next. If you are preparing an image and realize the background is distracting, you can use our <a href="/bg-remover" className="text-cyan-600 hover:underline">Background Remover Tool</a> before resizing it. Or, if you simply need to convert the final asset into a document format, our <a href="/jpg-to-pdf" className="text-cyan-600 hover:underline">JPG to PDF Converter</a> is always freely accessible on imgtool.in.
                        </p>

                        <img
                            src="/images/tools/image-resizer-example.png"
                            alt="Visual Example of an Image Being Resized Proportionally"
                            title="Image Resizer Example"
                            loading="lazy"
                            className="w-full h-auto rounded-xl shadow-sm my-8 border border-slate-100"
                        />

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Valuable Best Practices</h3>
                        <p>
                            To achieve the best possible results when modifying your graphics, always try to scale down rather than scale up. Taking a massive 3000-pixel wide photo and shrinking it to 1000 pixels will result in a beautifully crisp image. However, taking a 300-pixel wide thumbnail and forcing it to stretch to 1000 pixels will inevitably cause severe blurriness and visual artifacting because the computer has to invent pixels that do not exist in the original file. Whenever possible, always start your workflow with the highest resolution master file you have available.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Smart Tool Capabilities</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Aspect Ratio Locking:</strong> Ensure your photos never look squished or stretched by automatically calculating the reciprocal height when you type in a new width constraint.</li>
                            <li><strong>Social Media Presets:</strong> Instant one-click resizing for the most common digital platforms, removing the need to memorize complex dimension requirements.</li>
                            <li><strong>Percentage Scaling:</strong> Quickly halve (50%) or double (200%) an image's size without having to do any complicated pixel math.</li>
                            <li><strong>Intelligent Fit Modes:</strong> Choose exactly how your graphic behaves within the new boundaries—whether it should fit proportionally, stretch to fill, or crop the excess.</li>
                            <li><strong>Local Processing Strategy:</strong> Benefit from instant, zero-latency processing as all canvas manipulations happen exclusively within your device's memory.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">Does changing the pixel dimensions also reduce the file size?</h4>
                                <p className="mt-1">Yes, in the vast majority of cases, scaling down the physical dimensions (e.g., from 4000px to 1000px) significantly reduces the total amount of pixel data the file contains, naturally resulting in a much smaller file footprint stored in kilobytes or megabytes.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why does my photo look distorted or squished after resizing?</h4>
                                <p className="mt-1">Distortion occurs when you manually enter a new width and height while the "Lock Aspect Ratio" feature is disabled. If you force a rectangular landscape photo into a perfect square constraint without using a cropping mode, the visual elements will compress awkwardly to fit into the new boundaries.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What is the difference between the Fit and Fill modes?</h4>
                                <p className="mt-1">The 'Fit' mode scales your graphic until both its width and height comfortably fit inside your targeted dimensions, adding transparent or white space to fill any gaps. The 'Fill' mode aggressively scales the graphic until the targeted area is completely covered, which often results in the edges of the image being cropped out.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I enlarge a tiny photo without it becoming blurry?</h4>
                                <p className="mt-1">Traditional resizing cannot magically invent missing detail. While you can technically enlarge a small file using this utility, the browser has to stretch existing pixels, which naturally leads to a blurry or blocky appearance depending on how aggressively you try to scale it up.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Are there any limits on the formats I can upload?</h4>
                                <p className="mt-1">Our canvas engine natively supports all standard web formats including JPEG, PNG, WebP, and BMP. You can drop any of these files onto the interface, modify their dimensions, and freely select which format you want the final downloaded file to utilize.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
