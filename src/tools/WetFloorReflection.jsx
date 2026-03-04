import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function WetFloorReflection() {
    const [image, setImage] = useState(null)
    const [reflectionHeight, setReflectionHeight] = useState(50)
    const [gap, setGap] = useState(8)
    const [startOpacity, setStartOpacity] = useState(0.7)
    const [bgColor, setBgColor] = useState('#ffffff')
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

    const generate = () => {
        if (!image) return
        const W = image.img.width
        const H = image.img.height
        const reflH = Math.round(H * reflectionHeight / 100)
        const canvas = canvasRef.current
        canvas.width = W
        canvas.height = H + gap + reflH
        const ctx = canvas.getContext('2d')

        // Background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, W, canvas.height)

        // Original image
        ctx.drawImage(image.img, 0, 0, W, H)

        // Flipped image (reflection) in temp canvas
        const tmp = document.createElement('canvas')
        tmp.width = W; tmp.height = reflH
        const tCtx = tmp.getContext('2d')
        tCtx.save()
        tCtx.translate(0, reflH)
        tCtx.scale(1, -1)
        tCtx.drawImage(image.img, 0, H - reflH, W, reflH)
        tCtx.restore()

        // Draw reflection with gradient fade
        ctx.save()
        const grad = ctx.createLinearGradient(0, H + gap, 0, H + gap + reflH)
        grad.addColorStop(0, `rgba(255,255,255,${1 - startOpacity})`)
        grad.addColorStop(1, 'rgba(255,255,255,1)')
        ctx.drawImage(tmp, 0, H + gap, W, reflH)
        ctx.fillStyle = grad
        ctx.fillRect(0, H + gap, W, reflH)
        ctx.restore()

        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Wet Floor Reflection Effect Online Free — Mirror Reflection Generator" description="Add a wet floor mirror reflection effect to any image online. Customizable reflection height, opacity, and fade. Free browser-based reflection tool." canonical="/wet-floor-reflection" />
            <ToolLayout toolSlug="wet-floor-reflection" title="Wet Floor Reflection" description="Add a stunning wet floor mirror reflection below any image. Adjustable height, opacity, and fade gradient." breadcrumb="Wet Floor Reflection">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-blue-400 bg-blue-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded-lg object-contain" />
                                <p className="text-xs text-blue-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center"><i className="fas fa-water text-blue-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop image to add reflection</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-blue-500 mr-2"></i>Reflection Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Reflection Height: {reflectionHeight}% of image</label>
                            <input type="range" min="10" max="100" value={reflectionHeight} onChange={e => setReflectionHeight(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Reflection Opacity: {Math.round(startOpacity * 100)}%</label>
                            <input type="range" min="0.1" max="1" step="0.05" value={startOpacity} onChange={e => setStartOpacity(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Gap: {gap}px</label>
                            <input type="range" min="0" max="30" value={gap} onChange={e => setGap(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ffffff', '#000000', '#1e293b', '#f8fafc'].map(c => (
                                    <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-water"></i>Generate Reflection</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Result</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'wet-floor-reflection.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Reflection" className="w-full rounded-xl border border-slate-100 max-h-96 object-contain" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Wet Floor Reflection Effect Online</h2>
                    <p className="text-slate-600">Add a professional wet floor mirror reflection to any image. The tool flips the bottom portion of your image and applies a gradient opacity fade, creating the illusion of a reflective surface below. Used widely in product photography, app store screenshots, and portfolio presentations. All processing happens in your browser using HTML5 Canvas.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Best Practices</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Products on white background give the cleanest reflection look</li>
                        <li>50-70% reflection height creates the most realistic effect</li>
                        <li>Lower opacity (40-60%) looks more natural for glass surfaces</li>
                        <li>Match background color to your website or presentation background</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/add-drop-shadow" className="text-blue-600 hover:underline">Add Drop Shadow</a> · <a href="/flip-image-horizontally" className="text-blue-600 hover:underline">Flip Image</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
