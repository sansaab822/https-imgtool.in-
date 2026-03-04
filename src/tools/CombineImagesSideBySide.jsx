import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function CombineImagesSideBySide() {
    const [imgA, setImgA] = useState(null)
    const [imgB, setImgB] = useState(null)
    const [gap, setGap] = useState(10)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [result, setResult] = useState(null)
    const [align, setAlign] = useState('center') // top/center/bottom
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

    const combine = () => {
        if (!imgA || !imgB) return
        const canvas = canvasRef.current
        const maxH = Math.max(imgA.h, imgB.h)
        const totalW = imgA.w + gap + imgB.w
        canvas.width = totalW
        canvas.height = maxH
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, totalW, maxH)

        const getY = (ih) => {
            if (align === 'top') return 0
            if (align === 'bottom') return maxH - ih
            return Math.round((maxH - ih) / 2)
        }

        ctx.drawImage(imgA.img, 0, getY(imgA.h), imgA.w, imgA.h)
        ctx.drawImage(imgB.img, imgA.w + gap, getY(imgB.h), imgB.w, imgB.h)
        setResult(canvas.toDataURL('image/png'))
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result
        a.download = 'combined-side-by-side.png'
        a.click()
    }

    const DropZone = ({ label, img, onFile }) => (
        <div
            onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => onFile(e.target.files[0]); i.click() }}
            className={`drop-zone cursor-pointer ${img ? 'border-blue-400 bg-blue-50' : ''}`}
        >
            {img ? (
                <div className="flex flex-col items-center gap-2">
                    <img src={img.img.src} alt="" className="max-h-28 rounded-lg object-contain" />
                    <p className="text-xs text-blue-700 font-medium">{img.name}</p>
                    <p className="text-xs text-slate-400">{img.w}×{img.h}px</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-image text-3xl text-slate-300"></i>
                    <p className="text-sm font-semibold text-slate-600">{label}</p>
                    <p className="text-xs text-slate-400">Click to upload</p>
                </div>
            )}
        </div>
    )

    return (
        <>
            <SEO title="Combine Two Images Side by Side Online — Free Image Merger" description="Combine two images side by side horizontally online. Merge photos together with gap and alignment control. Free, no upload, works in browser." canonical="/combine-images-side-by-side" />
            <ToolLayout toolSlug="combine-images-side-by-side" title="Combine Images Side by Side" description="Merge two photos horizontally with custom spacing and alignment. 100% browser-based." breadcrumb="Combine Images Side by Side">

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div><p className="text-xs font-bold text-slate-600 mb-2">Image 1 (Left)</p><DropZone label="Upload Left Image" img={imgA} onFile={f => loadImg(f, setImgA)} /></div>
                    <div><p className="text-xs font-bold text-slate-600 mb-2">Image 2 (Right)</p><DropZone label="Upload Right Image" img={imgB} onFile={f => loadImg(f, setImgB)} /></div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-blue-500 mr-2"></i>Settings</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Gap Between: {gap}px</label>
                            <input type="range" min="0" max="80" value={gap} onChange={e => setGap(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Vertical Alignment</label>
                            <div className="flex gap-2">
                                {['top', 'center', 'bottom'].map(a => (
                                    <button key={a} onClick={() => setAlign(a)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border capitalize transition-all
                    ${align === a ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>{a}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                {['#ffffff', '#000000', '#f8f9fa', 'transparent'].map(c => (
                                    <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c === 'transparent' ? '#ccc' : c }}
                                        className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform" title={c} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {imgA && imgB && <button onClick={combine} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-columns"></i>Combine Images</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Result</h2>
                            <button onClick={download} className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Combined" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Combine Two Images Side by Side Online</h2>
                    <p className="text-slate-600">Merge two photos horizontally into a single image using our free online tool. Perfect for before/after comparisons, product showcases, and social media posts. Control the gap between images, vertical alignment, and background color. All processing happens in your browser — no upload, instant results.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Uses</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Before and after comparison photos</li>
                        <li>Product color variant side-by-side display</li>
                        <li>Event invitation combining two portraits</li>
                        <li>Recipe step-by-step image grid</li>
                        <li>Fashion outfit left/right comparison</li>
                    </ul>
                    <p className="text-slate-600 mt-4">You can also use our <a href="/merge-images-vertically" className="text-blue-600 hover:underline">Merge Images Vertically</a> tool to stack images top to bottom, or <a href="/collage-maker" className="text-blue-600 hover:underline">Collage Maker</a> for multiple image layouts.</p>
                </div>
            </ToolLayout>
        </>
    )
}
