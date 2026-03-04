import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function AddDropShadow() {
    const [image, setImage] = useState(null)
    const [shadowX, setShadowX] = useState(8)
    const [shadowY, setShadowY] = useState(8)
    const [blur, setBlur] = useState(12)
    const [shadowColor, setShadowColor] = useState('#000000')
    const [shadowOpacity, setShadowOpacity] = useState(0.5)
    const [padding, setPadding] = useState(30)
    const [bgColor, setBgColor] = useState('transparent')
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => setImage({ img, name: file.name })
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
        setResult(null)
    }

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
        return `${r},${g},${b}`
    }

    const apply = () => {
        if (!image) return
        const extraX = Math.max(0, shadowX) + blur + padding
        const extraY = Math.max(0, shadowY) + blur + padding
        const padL = Math.max(blur + padding, blur - shadowX + padding)
        const padT = Math.max(blur + padding, blur - shadowY + padding)
        const canvas = canvasRef.current
        canvas.width = image.img.width + padL + extraX
        canvas.height = image.img.height + padT + extraY
        const ctx = canvas.getContext('2d')

        // Background
        if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Shadow
        ctx.save()
        ctx.shadowColor = `rgba(${hexToRgb(shadowColor)},${shadowOpacity})`
        ctx.shadowBlur = blur
        ctx.shadowOffsetX = shadowX
        ctx.shadowOffsetY = shadowY
        ctx.drawImage(image.img, padL, padT)
        ctx.restore()

        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Add Drop Shadow to PNG Image Online Free" description="Add customizable drop shadow to transparent PNG images online. Set shadow offset, blur, color, and opacity. Free browser-based shadow generator." canonical="/add-drop-shadow" />
            <ToolLayout toolSlug="add-drop-shadow" title="Add Drop Shadow" description="Add a customizable drop shadow to PNG images. Works best with transparent PNGs. Browser-based." breadcrumb="Add Drop Shadow">

                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-info-circle mr-2"></i>For best results, upload a <strong>transparent PNG</strong> — the shadow will appear around the subject with no background.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/png,image/webp'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-slate-400 bg-slate-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded-lg object-contain" />
                                <p className="text-xs text-slate-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center"><i className="fas fa-clone text-slate-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop transparent PNG here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-slate-500 mr-2"></i>Shadow Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow X Offset: {shadowX}px</label>
                            <input type="range" min="-40" max="40" value={shadowX} onChange={e => setShadowX(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow Y Offset: {shadowY}px</label>
                            <input type="range" min="-40" max="40" value={shadowY} onChange={e => setShadowY(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Blur Radius: {blur}px</label>
                            <input type="range" min="0" max="60" value={blur} onChange={e => setBlur(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow Opacity: {Math.round(shadowOpacity * 100)}%</label>
                            <input type="range" min="0.1" max="1" step="0.05" value={shadowOpacity} onChange={e => setShadowOpacity(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={shadowColor} onChange={e => setShadowColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#000000', '#1e3a8a', '#7c3aed', '#c2410c'].map(c => (
                                    <button key={c} onClick={() => setShadowColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Canvas Background</label>
                            <div className="flex gap-2">
                                {[{ l: 'Transparent', v: 'transparent' }, { l: 'White', v: '#ffffff' }, { l: 'Black', v: '#000000' }].map(b => (
                                    <button key={b.v} onClick={() => setBgColor(b.v)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${bgColor === b.v ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-200 text-slate-600'}`}>{b.l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={apply} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-clone"></i>Add Drop Shadow</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Done!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'with-shadow.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <div className="bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] rounded-xl p-4">
                            <img src={result} alt="With Shadow" className="max-w-full mx-auto rounded-xl" />
                        </div>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Add Drop Shadow to PNG Image Online</h2>
                    <p className="text-slate-600">Add a professional drop shadow effect to transparent PNG images directly in your browser. Control the shadow's X/Y offset, blur radius, color, and opacity. The tool automatically expands the canvas to accommodate the shadow so nothing is cropped. Works best with transparent PNGs — perfect for product photos, icons, UI elements, and sticker packs.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Shadow Style Guide</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>Soft shadow</strong>: High blur (30-40px), low opacity (30-40%)</li>
                        <li><strong>Hard shadow</strong>: Zero or low blur, high opacity (70-100%)</li>
                        <li><strong>Floating effect</strong>: Large offset (10-20px), medium blur</li>
                        <li><strong>Glow effect</strong>: Use colored shadow (blue/purple), zero offset, high blur</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/polaroid-photo-effect" className="text-blue-600 hover:underline">Polaroid Effect</a> · <a href="/wet-floor-reflection" className="text-blue-600 hover:underline">Wet Floor Reflection</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
