import { useState, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function FaceMorph() {
    const [image, setImage] = useState(null)
    const [strength, setStrength] = useState(50) // -100 to 100
    const [radius, setRadius] = useState(150)
    const [clickPos, setClickPos] = useState({ x: 0.5, y: 0.5 })
    const [result, setResult] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const canvasRef = useRef(null)
    const originalDataRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => {
                setImage({ img, name: file.name, w: img.width, h: img.height })
                setResult(null)
                // Store original pixel data
                const off = document.createElement('canvas')
                off.width = img.width; off.height = img.height
                const oCtx = off.getContext('2d')
                oCtx.drawImage(img, 0, 0)
                originalDataRef.current = oCtx.getImageData(0, 0, img.width, img.height)
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    // Bulge / Pinch distortion effect
    const applyEffect = () => {
        if (!image || !originalDataRef.current) return
        setIsProcessing(true)

        // Use timeout to allow UI to update loading state
        setTimeout(() => {
            const W = image.w, H = image.h
            const srcData = originalDataRef.current.data

            const canvas = canvasRef.current
            canvas.width = W; canvas.height = H
            const ctx = canvas.getContext('2d')
            const targetImgData = ctx.createImageData(W, H)
            const dstData = targetImgData.data

            const cx = Math.floor(W * clickPos.x)
            const cy = Math.floor(H * clickPos.y)
            const rad = radius * (W / 600) // Scale radius by image size
            const maxDist = rad * rad
            const amt = strength / 100

            for (let y = 0; y < H; y++) {
                for (let x = 0; x < W; x++) {
                    const dx = x - cx
                    const dy = y - cy
                    const distSq = dx * dx + dy * dy

                    let srcX = x, srcY = y

                    if (distSq < maxDist) {
                        const dist = Math.sqrt(distSq)
                        const r = dist / rad
                        // Bulge/Pinch formula
                        const a = Math.pow(r, amt > 0 ? (1 + amt) : (1 / (1 - amt)))
                        const factor = a / r
                        srcX = cx + dx * factor
                        srcY = cy + dy * factor
                    }

                    srcX = Math.min(Math.max(Math.floor(srcX), 0), W - 1)
                    srcY = Math.min(Math.max(Math.floor(srcY), 0), H - 1)

                    const srcIdx = (srcY * W + srcX) * 4
                    const dstIdx = (y * W + x) * 4

                    dstData[dstIdx] = srcData[srcIdx]
                    dstData[dstIdx + 1] = srcData[srcIdx + 1]
                    dstData[dstIdx + 2] = srcData[srcIdx + 2]
                    dstData[dstIdx + 3] = srcData[srcIdx + 3]
                }
            }

            ctx.putImageData(targetImgData, 0, 0)
            setResult(canvas.toDataURL('image/jpeg', 0.9))
            setIsProcessing(false)
        }, 50)
    }

    // Auto-apply when settings change if image exists
    useEffect(() => {
        if (image) applyEffect()
    }, [strength, radius, clickPos])

    const handleCanvasClick = (e) => {
        if (!image) return
        const rect = e.target.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setClickPos({ x, y })
    }

    return (
        <>
            <SEO title="Face Photo Morph & Distort Effect Online Free" description="Morph, bulge, and pinch faces in photos online. Click on any part of the image to distort it instantly. Fun free photo warping tool perfect for memes." canonical="/face-morph" />
            <ToolLayout toolSlug="face-morph" title="Face Distort & Morph" description="Create funny morphs by pinching or bulging parts of a photo. Click the image to set the center point." breadcrumb="Face Morph">

                {image ? (
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center">
                            <h2 className="font-bold text-slate-800 mb-4 w-full"><i className="fas fa-hand-pointer text-blue-500 mr-2"></i>Click to set focus point</h2>
                            <div className="relative inline-block cursor-crosshair max-w-full" onClick={handleCanvasClick}>
                                <img src={result || image.img.src} alt="" className="max-h-[500px] w-auto border border-slate-200 shadow-sm" />
                                {/* Targeting reticle */}
                                <div className="absolute w-6 h-6 border-2 border-red-500 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ left: `${clickPos.x * 100}%`, top: `${clickPos.y * 100}%` }}>
                                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-magic text-blue-500 mr-2"></i>Distort Settings</h2>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-slate-600">Distortion Effect: <span className="text-blue-600">{strength > 0 ? 'Pinch' : strength < 0 ? 'Bulge' : 'None'}</span></label>
                                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{strength}</span>
                                </div>
                                <input type="range" min="-100" max="100" value={strength} onChange={e => setStrength(+e.target.value)} className="slider-range w-full" />
                                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Bulge (Big)</span><span>Neutral</span><span>Pinch (Small)</span></div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Effect Radius</label>
                                <input type="range" min="50" max="500" value={radius} onChange={e => setRadius(+e.target.value)} className="slider-range w-full" />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStrength(0)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Reset</button>
                                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'distorted-face.jpg'; a.click() }}
                                    disabled={!result || isProcessing || strength === 0}
                                    className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-500/30">
                                    {isProcessing ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-download"></i> Download Image</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                            className="drop-zone cursor-pointer py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"><i className="fas fa-theater-masks text-blue-500 text-3xl"></i></div>
                                <h3 className="font-bold text-xl text-slate-700">Upload a Face Photo</h3>
                                <p className="text-sm text-slate-500">Click or drag & drop an image to start morphing</p>
                            </div>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
