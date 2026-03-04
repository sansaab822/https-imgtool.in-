import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function PolaroidEffect() {
    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const [rotation, setRotation] = useState(-3)
    const [frameColor, setFrameColor] = useState('#ffffff')
    const [bgColor, setBgColor] = useState('#f0ebe0')
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
        const IMG_W = 400, IMG_H = 400
        const BORDER = 24, BOTTOM = 80
        const FRAME_W = IMG_W + BORDER * 2
        const FRAME_H = IMG_H + BORDER + BOTTOM
        const CANVAS_PAD = 60

        const canvas = canvasRef.current
        canvas.width = FRAME_W + CANVAS_PAD * 2
        canvas.height = FRAME_H + CANVAS_PAD * 2
        const ctx = canvas.getContext('2d')

        // Background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Rotate canvas around center
        const cx = canvas.width / 2, cy = canvas.height / 2
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation * Math.PI / 180)
        ctx.translate(-cx, -cy)

        // Drop shadow
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.shadowBlur = 24
        ctx.shadowOffsetX = 6
        ctx.shadowOffsetY = 8

        // Polaroid frame
        ctx.fillStyle = frameColor
        ctx.fillRect(CANVAS_PAD, CANVAS_PAD, FRAME_W, FRAME_H)

        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // Photo
        ctx.drawImage(image.img, CANVAS_PAD + BORDER, CANVAS_PAD + BORDER, IMG_W, IMG_H)

        // Caption
        if (caption) {
            ctx.font = `italic 22px Georgia, serif`
            ctx.fillStyle = '#444444'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(caption, cx, CANVAS_PAD + BORDER + IMG_H + BOTTOM / 2)
        }

        ctx.restore()
        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Polaroid Photo Effect Online Free — Turn Photo Into Polaroid" description="Turn any photo into a vintage Polaroid frame online. Add caption, choose frame color, rotation angle, and background. Free browser-based Polaroid generator." canonical="/polaroid-photo-effect" />
            <ToolLayout toolSlug="polaroid-photo-effect" title="Polaroid Photo Effect" description="Turn any photo into a vintage Polaroid frame with caption and rotation. Download instantly." breadcrumb="Polaroid Effect">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-yellow-400 bg-yellow-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-32 rounded object-contain" />
                                <p className="text-xs text-yellow-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center"><i className="fas fa-camera-retro text-yellow-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop your photo here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-yellow-500 mr-2"></i>Polaroid Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Caption Text</label>
                            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Summer 2024..." maxLength={30}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Rotation: {rotation}°</label>
                            <input type="range" min="-15" max="15" value={rotation} onChange={e => setRotation(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Frame Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={frameColor} onChange={e => setFrameColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ffffff', '#fffff0', '#000000', '#f5d5c0'].map(c => (
                                    <button key={c} onClick={() => setFrameColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#f0ebe0', '#2d3748', '#1a1a2e', '#e8f5e9'].map(c => (
                                    <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-camera-retro"></i>Generate Polaroid</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Polaroid Ready!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'polaroid-photo.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Polaroid" className="max-w-xs mx-auto rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Turn Photo Into Polaroid Online Free</h2>
                    <p className="text-slate-600">Create a vintage Polaroid-style photo frame from any image in seconds. Add a handwritten-style caption, choose your frame color (classic white, cream, or black), set the rotation angle for that authentic vintage tilt, and select the background color. Perfect for Instagram posts, digital scrapbooking, and nostalgic photo sharing.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Tips for Best Results</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Square photos (1:1 ratio) work best in the Polaroid frame</li>
                        <li>Use a slight rotation (-3° to -5°) for the most authentic look</li>
                        <li>Dark backgrounds (charcoal, navy) make white Polaroid frames pop</li>
                        <li>Keep captions short — the font is large and space is limited</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Also try: <a href="/collage-maker" className="text-blue-600 hover:underline">Collage Maker</a> · <a href="/add-drop-shadow" className="text-blue-600 hover:underline">Add Drop Shadow</a> · <a href="/image-to-art" className="text-blue-600 hover:underline">Image to Art</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
