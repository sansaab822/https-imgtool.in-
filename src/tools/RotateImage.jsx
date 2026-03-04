import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function RotateImage() {
    const [image, setImage] = useState(null)
    const [angle, setAngle] = useState(0)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [crop, setCrop] = useState(false)
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => setImage({ img, name: file.name, w: img.width, h: img.height })
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
        setResult(null)
    }

    const rotate = () => {
        if (!image) return
        const rad = angle * Math.PI / 180
        const sin = Math.abs(Math.sin(rad))
        const cos = Math.abs(Math.cos(rad))
        const W = image.w; const H = image.h

        let canvasW, canvasH
        if (crop) {
            canvasW = W; canvasH = H
        } else {
            canvasW = Math.round(W * cos + H * sin)
            canvasH = Math.round(W * sin + H * cos)
        }

        const canvas = canvasRef.current
        canvas.width = canvasW; canvas.height = canvasH
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.save()
        ctx.translate(canvasW / 2, canvasH / 2)
        ctx.rotate(rad)
        ctx.drawImage(image.img, -W / 2, -H / 2)
        ctx.restore()
        setResult(canvas.toDataURL('image/png'))
    }

    const presets = [0, 45, 90, 135, 180, 270, -45, -90]

    return (
        <>
            <SEO title="Rotate Image by Custom Angle Online — Free Image Rotator" description="Rotate any image by a custom angle online. Set exact degrees (1°–360°), choose background color, and download. Free browser-based image rotation tool." canonical="/rotate-image-custom-angle" />
            <ToolLayout toolSlug="rotate-image-custom-angle" title="Rotate Image" description="Rotate images by any angle — 1° to 360°. Set background color and crop or expand canvas." breadcrumb="Rotate Image">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-green-400 bg-green-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded-lg object-contain" style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.3s' }} />
                                <p className="text-xs text-green-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center"><i className="fas fa-sync-alt text-green-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop image to rotate</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-green-500 mr-2"></i>Rotation Settings</h2>
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Rotation Angle: <span className="text-green-600 font-bold">{angle}°</span></label>
                        <input type="range" min="-180" max="180" value={angle} onChange={e => setAngle(+e.target.value)} className="slider-range w-full mb-3" />
                        <div className="flex gap-1 flex-wrap">
                            {presets.map(p => (
                                <button key={p} onClick={() => setAngle(p)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${angle === p ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:border-green-300'}`}>
                                    {p > 0 ? `+${p}°` : p === 0 ? '0°' : `${p}°`}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Or enter exact angle:</label>
                            <input type="number" min="-360" max="360" value={angle} onChange={e => setAngle(+e.target.value)} className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-center focus:border-green-500 outline-none" />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color (for empty space)</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ffffff', '#000000', '#transparent'].map(c => (
                                    <button key={c} onClick={() => setBgColor(c === '#transparent' ? 'rgba(0,0,0,0)' : c)} className="w-8 h-8 rounded-full border-2 border-slate-300" style={{ backgroundColor: c === '#transparent' ? 'transparent' : c }} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="crop" checked={crop} onChange={e => setCrop(e.target.checked)} className="rounded text-green-600 w-4 h-4" />
                            <label htmlFor="crop" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Keep original canvas size (crop rotated edges)
                            </label>
                        </div>
                    </div>
                </div>

                {image && <button onClick={rotate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-sync-alt"></i>Rotate Image</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Rotated Image</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = image.name.replace(/\.[^.]+$/, '') + `-rotated-${angle}deg.png`; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download
                            </button>
                        </div>
                        <img src={result} alt="Rotated" className="w-full rounded-xl border border-slate-100 max-h-96 object-contain" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Rotate Image by Custom Angle Online</h2>
                    <p className="text-slate-600">Rotate any image by an exact angle using our free online rotation tool. Unlike simple 90°/180° rotators, this tool lets you enter any angle from -360° to 360°. Use the slider for quick, visual adjustments or type the exact degree you need. Choose background color for the empty corners created by rotation, or keep the original canvas size to crop the rotated edges.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Angles</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>90°</strong>: Rotate landscape photo to portrait</li>
                        <li><strong>-90° (270°)</strong>: Rotate portrait photo to landscape</li>
                        <li><strong>180°</strong>: Flip upside down</li>
                        <li><strong>Small angles (1°–10°)</strong>: Straighten slightly tilted horizon photos</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/flip-image-horizontally" className="text-blue-600 hover:underline">Flip Image Mirror</a> · <a href="/crop-image" className="text-blue-600 hover:underline">Crop Image</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
