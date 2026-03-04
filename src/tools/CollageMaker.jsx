import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

const LAYOUTS = [
    { id: '2x1', label: '2 Photos Side by Side', cols: 2, rows: 1, cells: [[0, 0, 1, 1], [1, 0, 2, 1]] },
    { id: '1+2', label: '1 Big + 2 Small', cols: 2, rows: 2, cells: [[0, 0, 1, 2], [1, 0, 2, 1], [1, 1, 2, 2]] },
    { id: '3x1', label: '3 in a Row', cols: 3, rows: 1, cells: [[0, 0, 1, 1], [1, 0, 2, 1], [2, 0, 3, 1]] },
    { id: '2x2', label: '2×2 Grid', cols: 2, rows: 2, cells: [[0, 0, 1, 1], [1, 0, 2, 1], [0, 1, 1, 2], [1, 1, 2, 2]] },
    { id: '1+3', label: '1 Big + 3 Small', cols: 3, rows: 2, cells: [[0, 0, 2, 2], [2, 0, 3, 1], [2, 1, 3, 2]] },
    { id: '3x2', label: '3×2 Grid', cols: 3, rows: 2, cells: [[0, 0, 1, 1], [1, 0, 2, 1], [2, 0, 3, 1], [0, 1, 1, 2], [1, 1, 2, 2], [2, 1, 3, 2]] },
]

const CANVS = 900
const GAP = 8
const BGSIZES = { small: 8, medium: 16, large: 24 }

export default function CollageMaker() {
    const [layout, setLayout] = useState(LAYOUTS[3])
    const [images, setImages] = useState({})
    const [bgColor, setBgColor] = useState('#ffffff')
    const [gap, setGap] = useState('medium')
    const [rounded, setRounded] = useState(true)
    const [isDragging, setIsDragging] = useState(null)
    const [generated, setGenerated] = useState(null)
    const [generating, setGenerating] = useState(false)
    const canvasRef = useRef(null)

    const required = layout.cells.length

    const loadImage = (file) => new Promise((res, rej) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => res({ img, url })
        img.onerror = rej
        img.src = url
    })

    const handleDrop = useCallback(async (e, idx) => {
        e.preventDefault()
        setIsDragging(null)
        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
        if (!file || !file.type.startsWith('image/')) return
        const result = await loadImage(file)
        setImages(prev => ({ ...prev, [idx]: result }))
        if (generated) setGenerated(null)
    }, [generated])

    const handleFileClick = (idx) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => handleDrop(e, idx)
        input.click()
    }

    const generateCollage = async () => {
        if (Object.keys(images).length < required) return
        setGenerating(true)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const gapPx = BGSIZES[gap]
        const cols = layout.cols
        const rows = layout.rows
        const cellW = (CANVS - gapPx * (cols + 1)) / cols
        const cellH = (CANVS - gapPx * (rows + 1)) / rows

        canvas.width = CANVS
        canvas.height = CANVS

        // Background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, CANVS, CANVS)

        for (let i = 0; i < layout.cells.length; i++) {
            const [c1, r1, c2, r2] = layout.cells[i]
            const x = gapPx + c1 * (cellW + gapPx)
            const y = gapPx + r1 * (cellH + gapPx)
            const w = (c2 - c1) * cellW + (c2 - c1 - 1) * gapPx
            const h = (r2 - r1) * cellH + (r2 - r1 - 1) * gapPx

            const imgData = images[i]
            if (!imgData) continue

            ctx.save()
            if (rounded) {
                ctx.beginPath()
                const r = 12
                ctx.moveTo(x + r, y)
                ctx.arcTo(x + w, y, x + w, y + h, r)
                ctx.arcTo(x + w, y + h, x, y + h, r)
                ctx.arcTo(x, y + h, x, y, r)
                ctx.arcTo(x, y, x + w, y, r)
                ctx.closePath()
                ctx.clip()
            }

            // Cover fit
            const scaleW = w / imgData.img.naturalWidth
            const scaleH = h / imgData.img.naturalHeight
            const scale = Math.max(scaleW, scaleH)
            const dw = imgData.img.naturalWidth * scale
            const dh = imgData.img.naturalHeight * scale
            const dx = x + (w - dw) / 2
            const dy = y + (h - dh) / 2
            ctx.drawImage(imgData.img, dx, dy, dw, dh)
            ctx.restore()
        }

        const url = canvas.toDataURL('image/jpeg', 0.92)
        setGenerated(url)
        setGenerating(false)
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = generated
        a.download = 'collage-imgtool.jpg'
        a.click()
    }

    const reset = () => { setImages({}); setGenerated(null) }

    return (
        <>
            <SEO
                title="Free Online Collage Maker — Create Photo Collages Instantly"
                description="Create beautiful photo collages online with multiple layouts. Choose from 2x2 grid, side-by-side, or custom layouts. Download as high-quality JPG. Free, no signup."
                canonical="/collage-maker"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'Collage Maker',
                    applicationCategory: 'MultimediaApplication',
                    operatingSystem: 'Any',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                }}
            />
            <ToolLayout
                toolSlug="collage-maker"
                title="Collage Maker"
                description="Create beautiful photo collages with multiple layouts. Download as high-quality JPG instantly."
                breadcrumb="Collage Maker"
            >
                {/* Layout Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-th text-pink-500"></i> Choose Layout
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {LAYOUTS.map(l => (
                            <button
                                key={l.id}
                                onClick={() => { setLayout(l); setImages({}); setGenerated(null) }}
                                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${layout.id === l.id ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 hover:border-pink-300 text-slate-600'}`}
                            >
                                <i className="fas fa-border-all mr-2 opacity-60"></i>{l.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-sliders-h text-pink-500"></i> Settings
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                <span className="text-sm text-slate-500">{bgColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Gap Size</label>
                            <select value={gap} onChange={e => setGap(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="small">Small (8px)</option>
                                <option value="medium">Medium (16px)</option>
                                <option value="large">Large (24px)</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={rounded} onChange={e => setRounded(e.target.checked)}
                                    className="w-4 h-4 text-pink-600 rounded" />
                                <span className="text-sm font-medium text-slate-700">Rounded corners</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Photo Upload Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-images text-pink-500"></i> Upload Photos ({Object.keys(images).length}/{required})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {layout.cells.map((_, idx) => (
                            <div
                                key={idx}
                                onDragOver={e => { e.preventDefault(); setIsDragging(idx) }}
                                onDragLeave={() => setIsDragging(null)}
                                onDrop={e => handleDrop(e, idx)}
                                onClick={() => handleFileClick(idx)}
                                className={`aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden relative
                  ${isDragging === idx ? 'border-pink-500 bg-pink-50' : 'border-slate-300 hover:border-pink-400 hover:bg-pink-50/50'}
                  ${images[idx] ? 'border-solid border-pink-400' : ''}`}
                            >
                                {images[idx] ? (
                                    <>
                                        <img src={images[idx].url} alt={`Photo ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                                            <i className="fas fa-edit text-white text-2xl opacity-0 hover:opacity-100 transition-opacity"></i>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus-circle text-3xl text-slate-300 mb-2"></i>
                                        <span className="text-xs text-slate-400 font-medium">Photo {idx + 1}</span>
                                        <span className="text-xs text-slate-300">click or drag</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={generateCollage}
                        disabled={Object.keys(images).length < required || generating}
                        className="flex-1 sm:flex-none btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {generating ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> Create Collage</>}
                    </button>
                    {generated && (
                        <button onClick={download}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download JPG
                        </button>
                    )}
                    <button onClick={reset}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-200 transition-all">
                        <i className="fas fa-redo"></i> Reset
                    </button>
                </div>

                {/* Preview */}
                {generated && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-eye text-pink-500 mr-2"></i>Preview</h2>
                        <img src={generated} alt="Collage preview" className="w-full max-w-2xl mx-auto rounded-xl shadow-lg" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* SEO Content */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Free Online Collage Maker</h2>
                    <p className="text-slate-600">Create stunning photo collages directly in your browser without any software installation. Our collage maker supports multiple layouts including 2x2 grids, side-by-side comparisons, and asymmetric designs perfect for social media, family albums, and presentations.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How to Make a Photo Collage</h3>
                    <ol className="list-decimal list-inside text-slate-600 space-y-2">
                        <li>Select a layout that fits the number of photos you want to combine</li>
                        <li>Customize the background color, gap size, and corner style</li>
                        <li>Upload your photos by clicking each slot or dragging and dropping</li>
                        <li>Click "Create Collage" to generate your high-quality 900×900px collage</li>
                        <li>Download as JPG to share on Instagram, WhatsApp, or print</li>
                    </ol>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Features</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>6 professional layouts</strong> — 2x1, 1+2, 3x1, 2x2, 1+3, 3x2 grids</li>
                        <li><strong>Custom background colors</strong> — white, black, or any color you pick</li>
                        <li><strong>Smart cropping</strong> — images auto-fit each cell with cover scaling</li>
                        <li><strong>Rounded corners</strong> — toggle for a modern or classic look</li>
                        <li><strong>High resolution output</strong> — 900×900px JPG at 92% quality</li>
                        <li><strong>100% private</strong> — all processing done in your browser, no uploads</li>
                    </ul>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Perfect For</h3>
                    <p className="text-slate-600">Instagram posts, WhatsApp status, Facebook memories, wedding albums, travel diaries, before-and-after comparisons, recipe cards, and school project presentations. Our collage maker is completely free with no watermarks added to your output.</p>
                    <p className="text-slate-600 mt-4">You can also use our <a href="/image-resizer" className="text-blue-600 hover:underline">Image Resizer</a> to prepare photos before making a collage, or our <a href="/image-compressor" className="text-blue-600 hover:underline">Image Compressor</a> to reduce the final collage file size.</p>
                </div>
            </ToolLayout>
        </>
    )
}
