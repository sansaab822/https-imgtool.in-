import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function ZoomedInset() {
    const [image, setImage] = useState(null)
    const [region, setRegion] = useState({ x: 0.25, y: 0.25, w: 0.25, h: 0.25 })
    const [insetScale, setInsetScale] = useState(2.5)
    const [insetPos, setInsetPos] = useState('bottom-right')
    const [borderColor, setBorderColor] = useState('#ff0000')
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => { setImage({ img, name: file.name }); setResult(null) }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    const generate = () => {
        if (!image) return
        const W = image.img.width, H = image.img.height
        const rx = Math.round(region.x * W), ry = Math.round(region.y * H)
        const rw = Math.round(region.w * W), rh = Math.round(region.h * H)
        const insetW = Math.round(rw * insetScale), insetH = Math.round(rh * insetScale)
        const pad = 10, border = 3

        const canvas = canvasRef.current
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')

        // Draw original
        ctx.drawImage(image.img, 0, 0)

        // Draw region highlight rectangle
        ctx.strokeStyle = borderColor
        ctx.lineWidth = 3
        ctx.strokeRect(rx, ry, rw, rh)

        // Calculate inset position
        let insetX, insetY
        if (insetPos === 'top-left') { insetX = pad; insetY = pad }
        else if (insetPos === 'top-right') { insetX = W - insetW - pad; insetY = pad }
        else if (insetPos === 'bottom-left') { insetX = pad; insetY = H - insetH - pad }
        else { insetX = W - insetW - pad; insetY = H - insetH - pad } // bottom-right

        // Draw inset shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 10
        ctx.fillStyle = borderColor
        ctx.fillRect(insetX - border, insetY - border, insetW + border * 2, insetH + border * 2)
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0

        // Draw zoomed region in inset
        ctx.drawImage(image.img, rx, ry, rw, rh, insetX, insetY, insetW, insetH)

        // Draw ZOOM indicator arrow from region to inset using line
        const rCx = rx + rw / 2, rCy = ry + rh / 2
        const iCx = insetX + insetW / 2, iCy = insetY + insetH / 2
        ctx.beginPath()
        ctx.moveTo(rCx, rCy)
        ctx.lineTo(iCx, iCy)
        ctx.strokeStyle = borderColor
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 3])
        ctx.stroke()
        ctx.setLineDash([])

        setResult(canvas.toDataURL('image/png'))
    }

    const POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

    return (
        <>
            <SEO title="Zoomed Inset Image Creator Online — Add Magnifier Overlay" description="Create a zoomed inset magnifier on any image online. Select a region, set zoom level and position. Perfect for tutorials, manuals, product photos. Free." canonical="/zoomed-inset-image" />
            <ToolLayout toolSlug="zoomed-inset-image" title="Zoomed Inset Creator" description="Add a zoomed magnifier inset overlay to any image. Set region, zoom level, and inset position." breadcrumb="Zoomed Inset">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-orange-400 bg-orange-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded-lg object-contain" />
                                <p className="text-xs text-orange-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center"><i className="fas fa-search-plus text-orange-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop image to add zoom inset</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-search-plus text-orange-500 mr-2"></i>Zoom Region Settings</h2>
                    <p className="text-xs text-slate-400 mb-4">Adjust the region position and size as percentage of the full image. Region is the area that gets magnified.</p>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Region X: {Math.round(region.x * 100)}%</label>
                            <input type="range" min="0" max="0.7" step="0.01" value={region.x} onChange={e => setRegion(r => ({ ...r, x: +e.target.value }))} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Region Y: {Math.round(region.y * 100)}%</label>
                            <input type="range" min="0" max="0.7" step="0.01" value={region.y} onChange={e => setRegion(r => ({ ...r, y: +e.target.value }))} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Region Width: {Math.round(region.w * 100)}%</label>
                            <input type="range" min="0.05" max="0.5" step="0.01" value={region.w} onChange={e => setRegion(r => ({ ...r, w: +e.target.value }))} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Region Height: {Math.round(region.h * 100)}%</label>
                            <input type="range" min="0.05" max="0.5" step="0.01" value={region.h} onChange={e => setRegion(r => ({ ...r, h: +e.target.value }))} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Zoom Level: {insetScale}x</label>
                            <input type="range" min="1.5" max="5" step="0.5" value={insetScale} onChange={e => setInsetScale(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Inset Position</label>
                            <div className="grid grid-cols-2 gap-1">
                                {POSITIONS.map(p => (
                                    <button key={p} onClick={() => setInsetPos(p)}
                                        className={`py-1 rounded text-xs font-medium border capitalize transition-all ${insetPos === p ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500'}`}>
                                        {p.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Border & Line Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ff0000', '#ffff00', '#00ff00', '#00aaff'].map(c => (
                                    <button key={c} onClick={() => setBorderColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-search-plus"></i>Generate Zoomed Inset</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Inset Created!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'zoomed-inset.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Zoomed Inset" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Zoomed Inset on Image Online</h2>
                    <p className="text-slate-600">Add a zoomed-in magnifier inset to highlight important details in any image. Perfect for tutorials, instruction manuals, product close-ups, UI screenshots, and technical documentation. The tool draws a highlighted region box on the original image, then renders a zoomed version of that region as an inset overlay connected by a dotted line.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Uses</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Software tutorials showing button locations</li>
                        <li>Product photography highlighting fine details</li>
                        <li>Medical imaging annotations</li>
                        <li>Map detail insets for geographic presentations</li>
                    </ul>
                </div>
            </ToolLayout>
        </>
    )
}
