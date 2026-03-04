import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function MergeImagesVertically() {
    const [images, setImages] = useState([])
    const [gap, setGap] = useState(10)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [align, setAlign] = useState('center') // left/center/right
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const addImage = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => setImages(prev => [...prev, { img, name: file.name, w: img.width, h: img.height, id: Date.now() + Math.random() }])
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
        setResult(null)
    }

    const merge = () => {
        if (images.length < 2) return
        const maxW = Math.max(...images.map(i => i.w))
        const totalH = images.reduce((s, i) => s + i.h, 0) + gap * (images.length - 1)
        const canvas = canvasRef.current
        canvas.width = maxW; canvas.height = totalH
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, maxW, totalH)

        let y = 0
        images.forEach(({ img, w, h }) => {
            const x = align === 'left' ? 0 : align === 'right' ? maxW - w : Math.round((maxW - w) / 2)
            ctx.drawImage(img, x, y, w, h)
            y += h + gap
        })
        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Merge Images Vertically Online — Stack Photos Together Free" description="Stack and merge multiple images vertically online. Combine photos one on top of another with gap control. Free, browser-based image stacker tool." canonical="/merge-images-vertically" />
            <ToolLayout toolSlug="merge-images-vertically" title="Merge Images Vertically" description="Stack multiple images on top of each other. Control gap, alignment, and background. Instant download." breadcrumb="Merge Images Vertically">

                <div
                    onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = e => Array.from(e.target.files).forEach(addImage); i.click() }}
                    className={`drop-zone cursor-pointer mb-6 ${images.length ? 'border-blue-400 bg-blue-50' : ''}`}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center"><i className="fas fa-arrows-alt-v text-blue-400 text-2xl"></i></div>
                        <p className="font-semibold text-slate-700">Click to upload images (in order)</p>
                        <p className="text-xs text-slate-400">Add 2 or more images — they'll be stacked vertically</p>
                    </div>
                </div>

                {images.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-3"><i className="fas fa-list text-blue-500 mr-2"></i>Images (top to bottom)</h2>
                        <div className="space-y-2">
                            {images.map((img, i) => (
                                <div key={img.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                                    <span className="w-6 h-6 bg-blue-100 rounded text-blue-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                    <img src={img.img.src} alt="" className="w-12 h-10 object-cover rounded" />
                                    <span className="text-sm text-slate-700 flex-1 truncate">{img.name}</span>
                                    <span className="text-xs text-slate-400">{img.w}×{img.h}</span>
                                    <button onClick={() => setImages(p => p.filter(x => x.id !== img.id))} className="text-red-400 hover:text-red-600"><i className="fas fa-times"></i></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => addImage(e.target.files[0]); i.click() }}
                            className="mt-2 text-sm text-blue-600 flex items-center gap-1"><i className="fas fa-plus-circle"></i> Add more</button>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-blue-500 mr-2"></i>Settings</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Vertical Gap: {gap}px</label>
                            <input type="range" min="0" max="80" value={gap} onChange={e => setGap(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Horizontal Alignment</label>
                            <div className="flex gap-1">
                                {['left', 'center', 'right'].map(a => (
                                    <button key={a} onClick={() => setAlign(a)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border capitalize transition-all ${align === a ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 text-slate-500'}`}>{a}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background</label>
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {images.length >= 2 && <button onClick={merge} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-arrows-alt-v"></i>Merge Vertically</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Result</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'merged-vertical.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download
                            </button>
                        </div>
                        <img src={result} alt="Merged Vertical" className="w-full rounded-xl border border-slate-100 max-h-96 object-contain" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Merge Images Vertically Online</h2>
                    <p className="text-slate-600">Stack multiple images vertically online with this free browser-based tool. Upload 2 or more images and they'll be merged into a single tall image, arranged from top to bottom. Control the gap between images, horizontal alignment (left, center, right), and the background color shown in empty areas.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">When to Stack Images Vertically</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Recipe step photos stacked in order</li>
                        <li>Portfolio showcase with tall photo strips</li>
                        <li>Pinterest-style image strips for social sharing</li>
                        <li>Before/during/after comparison in vertical sequence</li>
                    </ul>
                    <p className="text-slate-600 mt-4">For horizontal stacking, use our <a href="/combine-images-side-by-side" className="text-blue-600 hover:underline">Combine Images Side by Side</a> tool. For grid layouts, try the <a href="/collage-maker" className="text-blue-600 hover:underline">Collage Maker</a>.</p>
                </div>
            </ToolLayout>
        </>
    )
}
