import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function BlendTwoPhotos() {
    const [imgA, setImgA] = useState(null)
    const [imgB, setImgB] = useState(null)
    const [alphaA, setAlphaA] = useState(0.5)
    const [mode, setMode] = useState('normal')
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const loadImg = (file, setter) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => setter({ img, name: file.name, w: img.width, h: img.height })
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
        setResult(null)
    }

    const blend = () => {
        if (!imgA || !imgB) return
        const canvas = canvasRef.current
        const W = Math.max(imgA.w, imgB.w)
        const H = Math.max(imgA.h, imgB.h)
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')

        // Draw image A
        ctx.globalAlpha = 1
        ctx.drawImage(imgA.img, 0, 0, W, H)

        // Apply blend mode
        ctx.globalCompositeOperation = mode
        ctx.globalAlpha = 1 - alphaA
        ctx.drawImage(imgB.img, 0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1

        setResult(canvas.toDataURL('image/png'))
    }

    const MODES = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-burn', 'color-dodge', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    const DropZone = ({ label, img, onFile }) => (
        <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => onFile(e.target.files[0]); i.click() }}
            className={`drop-zone cursor-pointer ${img ? 'border-purple-400 bg-purple-50' : ''}`}>
            {img ? (
                <div className="flex flex-col items-center gap-2">
                    <img src={img.img.src} alt="" className="max-h-28 rounded-lg object-contain" />
                    <p className="text-xs text-purple-700 font-medium truncate max-w-full px-2">{img.name}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-image text-3xl text-slate-300"></i>
                    <p className="text-sm font-semibold text-slate-600">{label}</p>
                </div>
            )}
        </div>
    )

    return (
        <>
            <SEO title="Blend Two Photos Together Online — Photo Blending Tool Free" description="Blend two images together online with opacity and blend mode controls. Mix and overlay photos with normal, multiply, screen, overlay modes. Free." canonical="/blend-two-photos" />
            <ToolLayout toolSlug="blend-two-photos" title="Blend Two Photos" description="Merge two photos with opacity and blend mode controls. 14 blend modes. Browser-based." breadcrumb="Blend Two Photos">

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div><p className="text-xs font-bold text-slate-600 mb-2">Base Image</p><DropZone label="Upload Base Image" img={imgA} onFile={f => loadImg(f, setImgA)} /></div>
                    <div><p className="text-xs font-bold text-slate-600 mb-2">Blend Image</p><DropZone label="Upload Blend Image" img={imgB} onFile={f => loadImg(f, setImgB)} /></div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-adjust text-purple-500 mr-2"></i>Blend Settings</h2>
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Blend Opacity: {Math.round((1 - alphaA) * 100)}% of second image</label>
                        <input type="range" min="0" max="1" step="0.01" value={1 - alphaA} onChange={e => setAlphaA(1 - +e.target.value)} className="slider-range w-full" />
                        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Only Base</span><span>50/50 Mix</span><span>Only Blend</span></div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Blend Mode</label>
                        <div className="flex flex-wrap gap-2">
                            {MODES.map(m => (
                                <button key={m} onClick={() => setMode(m)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium border capitalize transition-all ${mode === m ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-200 text-slate-600 hover:border-purple-300'}`}>{m}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {imgA && imgB && <button onClick={blend} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-adjust"></i>Blend Photos</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Blended Result</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'blended-photo.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download
                            </button>
                        </div>
                        <img src={result} alt="Blended" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Blend Two Photos Together Online</h2>
                    <p className="text-slate-600">Blend and overlay two photos using 14 different CSS/Canvas blend modes. Control the opacity of the second image to mix photos seamlessly. The tool uses the HTML5 Canvas globalCompositeOperation API — the same technology used in professional image editors like Photoshop — to apply blend effects instantly in your browser.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Blend Mode Guide</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li><strong>Normal</strong>: Simple opacity mix (most common)</li>
                        <li><strong>Multiply</strong>: Darkens — great for shadows and textures</li>
                        <li><strong>Screen</strong>: Lightens and brightens overlapping areas</li>
                        <li><strong>Overlay</strong>: Enhances contrast between images</li>
                        <li><strong>Luminosity</strong>: Preserves base color, uses top image brightness</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Also try: <a href="/combine-images-side-by-side" className="text-blue-600 hover:underline">Combine Images Side by Side</a> · <a href="/add-watermark-to-image" className="text-blue-600 hover:underline">Add Watermark</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
