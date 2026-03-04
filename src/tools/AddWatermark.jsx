import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function AddWatermark() {
    const [image, setImage] = useState(null)
    const [text, setText] = useState('© imgtool.in')
    const [textSize, setTextSize] = useState(36)
    const [opacity, setOpacity] = useState(0.5)
    const [color, setColor] = useState('#ffffff')
    const [position, setPosition] = useState('bottom-right')
    const [rotation, setRotation] = useState(0)
    const [result, setResult] = useState(null)
    const [mode, setMode] = useState('text') // text or diagonal
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

    const apply = () => {
        if (!image) return
        const canvas = canvasRef.current
        canvas.width = image.img.width
        canvas.height = image.img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image.img, 0, 0)

        const pad = 20
        const fontSize = Math.round(textSize * (image.img.width / 800))
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
        ctx.fillStyle = color
        ctx.globalAlpha = opacity

        if (mode === 'diagonal') {
            // Tiled diagonal watermark
            ctx.save()
            const metrics = ctx.measureText(text)
            const tw = metrics.width + 60
            const th = fontSize + 40
            for (let y = -image.img.height; y < image.img.height * 2; y += th) {
                for (let x = -image.img.width; x < image.img.width * 2; x += tw) {
                    ctx.save()
                    ctx.translate(x, y)
                    ctx.rotate(-Math.PI / 4)
                    ctx.fillText(text, 0, 0)
                    ctx.restore()
                }
            }
            ctx.restore()
        } else {
            ctx.textBaseline = 'bottom'
            ctx.textAlign = 'left'
            const metrics = ctx.measureText(text)
            const tw = metrics.width
            let x, y
            const w = canvas.width, h = canvas.height
            if (position === 'top-left') { x = pad; y = fontSize + pad }
            else if (position === 'top-right') { x = w - tw - pad; y = fontSize + pad }
            else if (position === 'bottom-left') { x = pad; y = h - pad }
            else if (position === 'bottom-right') { x = w - tw - pad; y = h - pad }
            else { x = (w - tw) / 2; y = (h + fontSize) / 2 } // center

            if (rotation !== 0) {
                ctx.save()
                ctx.translate(x + tw / 2, y - fontSize / 2)
                ctx.rotate(rotation * Math.PI / 180)
                ctx.fillText(text, -tw / 2, fontSize / 2)
                ctx.restore()
            } else {
                ctx.fillText(text, x, y)
            }
        }

        ctx.globalAlpha = 1
        setResult(canvas.toDataURL('image/png'))
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result
        a.download = image.name.replace(/\.[^.]+$/, '') + '-watermarked.png'
        a.click()
    }

    const positions = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']

    return (
        <>
            <SEO title="Add Watermark to Image Online Free — Text Watermark Tool" description="Add transparent text watermark to images online. Custom position, opacity, color, and rotation. Free, no upload, works in browser instantly." canonical="/add-watermark-to-image" />
            <ToolLayout toolSlug="add-watermark-to-image" title="Add Watermark to Image" description="Add transparent text watermarks to your photos. Customizable position, opacity, color, and rotation." breadcrumb="Add Watermark">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-cyan-400 bg-cyan-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded-lg object-contain" />
                                <p className="text-xs text-cyan-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center"><i className="fas fa-copyright text-cyan-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop image to watermark</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-cyan-500 mr-2"></i>Watermark Settings</h2>

                    {/* Mode */}
                    <div className="flex gap-2 mb-5">
                        {[{ v: 'text', l: 'Single Position' }, { v: 'diagonal', l: 'Diagonal Tile' }].map(m => (
                            <button key={m.v} onClick={() => setMode(m.v)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${mode === m.v ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-200 text-slate-600 hover:border-cyan-300'}`}>{m.l}</button>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Watermark Text</label>
                            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Text Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ffffff', '#000000', '#ff0000', '#ffd700'].map(c => (
                                    <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Font Size: {textSize}px</label>
                            <input type="range" min="12" max="120" value={textSize} onChange={e => setTextSize(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Opacity: {Math.round(opacity * 100)}%</label>
                            <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(+e.target.value)} className="slider-range w-full" />
                        </div>
                        {mode === 'text' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2">Position</label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {positions.map(p => (
                                            <button key={p} onClick={() => setPosition(p)}
                                                className={`py-1 rounded text-xs font-medium border capitalize transition-all ${position === p ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-500 hover:border-cyan-300'}`}>
                                                {p.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2">Rotation: {rotation}°</label>
                                    <input type="range" min="-45" max="45" value={rotation} onChange={e => setRotation(+e.target.value)} className="slider-range w-full" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {image && <button onClick={apply} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-copyright"></i>Apply Watermark</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Watermarked Image</h2>
                            <button onClick={download} className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Watermarked" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Add Transparent Watermark to Image Online</h2>
                    <p className="text-slate-600">Protect your photos by adding a transparent text watermark online. Choose from single position (top-left, top-right, center, bottom-left, bottom-right) or diagonal tiled mode that covers the entire image. Customize the font size, color, opacity, and rotation angle. All processing is done in your browser — no file is uploaded.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why Add a Watermark?</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Protect photographer copyright on published work</li>
                        <li>Brand your product photos with your logo or website name</li>
                        <li>Add draft/preview stamps to documents sent for approval</li>
                        <li>Mark confidential images with a "Confidential" text overlay</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related tools: <a href="/collage-maker" className="text-blue-600 hover:underline">Collage Maker</a> · <a href="/combine-images-side-by-side" className="text-blue-600 hover:underline">Combine Images Side by Side</a> · <a href="/image-enhancer" className="text-blue-600 hover:underline">Image Enhancer</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
