import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function FlipImage() {
    const [image, setImage] = useState(null)
    const [flipH, setFlipH] = useState(true)
    const [flipV, setFlipV] = useState(false)
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

    const flip = () => {
        if (!image) return
        const canvas = canvasRef.current
        canvas.width = image.img.width; canvas.height = image.img.height
        const ctx = canvas.getContext('2d')
        ctx.save()
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
        ctx.drawImage(image.img, flipH ? -canvas.width : 0, flipV ? -canvas.height : 0)
        ctx.restore()
        setResult(canvas.toDataURL('image/png'))
    }

    const suffix = flipH && flipV ? 'both' : flipH ? 'horizontal' : flipV ? 'vertical' : 'none'

    return (
        <>
            <SEO title="Flip Image Horizontally Mirror Online — Free Flip Tool" description="Flip images horizontally or vertically online. Mirror photos left-right or up-down. Free, browser-based, instant download." canonical="/flip-image-horizontally" />
            <ToolLayout toolSlug="flip-image-horizontally" title="Flip Image (Mirror)" description="Flip images horizontally (mirror), vertically, or both. Instant, browser-based." breadcrumb="Flip Image">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-teal-400 bg-teal-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-36 rounded-lg object-contain"
                                    style={{ transform: `scale(${flipH ? -1 : 1},${flipV ? -1 : 1})`, transition: 'transform 0.3s' }} />
                                <p className="text-xs text-teal-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center"><i className="fas fa-arrows-alt-h text-teal-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop image to flip</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-arrows-alt-h text-teal-500 mr-2"></i>Flip Direction</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { label: '↔ Flip Horizontally (Mirror Left-Right)', key: 'h', icon: 'fa-arrows-alt-h', desc: 'Creates a mirror image — left becomes right' },
                            { label: '↕ Flip Vertically (Upside Down)', key: 'v', icon: 'fa-arrows-alt-v', desc: 'Turns the image upside down' },
                        ].map(({ label, key, icon, desc }) => (
                            <button key={key} onClick={() => { key === 'h' ? setFlipH(!flipH) : setFlipV(!flipV); setResult(null) }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${(key === 'h' ? flipH : flipV) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <i className={`fas ${icon} text-xl ${(key === 'h' ? flipH : flipV) ? 'text-teal-600' : 'text-slate-400'}`}></i>
                                    <span className="font-bold text-sm text-slate-800">{label}</span>
                                </div>
                                <p className="text-xs text-slate-500">{desc}</p>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">You can select both to flip in both directions simultaneously.</p>
                </div>

                {image && (flipH || flipV) && <button onClick={flip} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-arrows-alt-h"></i>Flip Image</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Flipped Image</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = image.name.replace(/\.[^.]+$/, '') + `-flipped-${suffix}.png`; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download
                            </button>
                        </div>
                        <img src={result} alt="Flipped" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Flip Image Online — Mirror or Vertical Flip</h2>
                    <p className="text-slate-600">Flip or mirror your images horizontally or vertically online for free. Horizontal flipping (left-right mirror) is the most common operation — it creates a mirror reflection of your photo. Vertical flipping turns the image upside down. You can also apply both to rotate 180° while creating a full mirror effect. Processing is instant and done in your browser with the HTML5 Canvas API.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Uses</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Fix selfies that appear mirrored from front camera</li>
                        <li>Create symmetrical/mirror images for logos</li>
                        <li>Flip signage text that was accidentally scanned backwards</li>
                        <li>Create reflected or floating product shots</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/rotate-image-custom-angle" className="text-blue-600 hover:underline">Rotate Image</a> · <a href="/wet-floor-reflection" className="text-blue-600 hover:underline">Wet Floor Reflection</a> · <a href="/crop-image" className="text-blue-600 hover:underline">Crop Image</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
