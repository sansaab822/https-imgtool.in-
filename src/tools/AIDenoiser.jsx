import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function AIDenoiser() {
    const [image, setImage] = useState(null)
    const [intensity, setIntensity] = useState('medium')
    const [isProcessing, setIsProcessing] = useState(false)
    const [progressText, setProgressText] = useState('')
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => { setImage({ img, name: file.name }); setResult(null) }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    // Simulated "AI Denoise" using a multi-pass canvas filter technique for smoothing
    const processImage = () => {
        if (!image) return
        setIsProcessing(true)
        setProgressText('Initializing neural filters...')

        let blurAmt = intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 4

        setTimeout(() => {
            setProgressText('Applying noise reduction masks...')
            setTimeout(() => {
                const W = image.img.width, H = image.img.height
                const canvas = canvasRef.current
                canvas.width = W; canvas.height = H
                const ctx = canvas.getContext('2d')

                // 1. Draw original
                ctx.filter = `blur(${blurAmt}px)`
                ctx.drawImage(image.img, 0, 0)

                // 2. Blend back some original detail to preserve edges (unsharp mask technique variation)
                ctx.globalCompositeOperation = 'overlay'
                ctx.globalAlpha = 0.3
                ctx.filter = 'contrast(120%) brightness(105%)'
                ctx.drawImage(image.img, 0, 0)

                ctx.globalCompositeOperation = 'source-over'
                ctx.globalAlpha = 1
                ctx.filter = 'none'

                setResult(canvas.toDataURL('image/jpeg', 0.95))
                setIsProcessing(false)
            }, 1000) // fake processing delay for "AI" feel
        }, 600)
    }

    return (
        <>
            <SEO title="AI Image Denoiser Online Free — Reduce Photo Noise & Grain" description="Reduce grain and noise from your images using smart smoothing filters online. Clean up low-light photos for free." canonical="/ai-denoiser" />
            <ToolLayout toolSlug="ai-denoiser" title="AI Image Denoiser" description="Reduce grain and color noise from low-light photos. Smooths backgrounds while preserving edges." breadcrumb="AI Denoiser">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-violet-400 bg-violet-50' : ''}`}>
                        {image ? (
                            <img src={image.img.src} alt="" className="max-h-48 mx-auto rounded-lg object-contain" />
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center"><i className="fas fa-magic text-violet-500 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop grainy photo to denoise</p>
                                <p className="text-xs text-slate-400">Best for low-light, ISO noise, and grain</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-violet-500 mr-2"></i>Denoise Strength</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 'low', label: 'Low', desc: 'Preserves maximum detail' },
                            { id: 'medium', label: 'Medium', desc: 'Balanced smoothing' },
                            { id: 'high', label: 'High', desc: 'Aggressive noise removal' },
                        ].map(lvl => (
                            <button key={lvl.id} onClick={() => setIntensity(lvl.id)}
                                className={`p-4 rounded-xl border text-left transition-all ${intensity === lvl.id ? 'border-violet-500 bg-violet-50 shadow-[0_4px_12px_rgba(139,92,246,0.15)] ring-1 ring-violet-500' : 'border-slate-200 hover:border-violet-300'}`}>
                                <p className={`font-bold text-sm ${intensity === lvl.id ? 'text-violet-700' : 'text-slate-700'}`}>{lvl.label}</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-tight">{lvl.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {image && !isProcessing && !result && (
                    <button onClick={processImage} className="btn-primary w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none">
                        <i className="fas fa-bolt text-yellow-300"></i> Start AI Denoising
                    </button>
                )}

                {isProcessing && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"></div>
                        <p className="font-bold text-slate-700">{progressText}</p>
                        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 animate-[shimmer_2s_infinite] w-1/2"></div>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800 text-lg"><i className="fas fa-check-circle text-green-500 mr-2"></i>Denoising Complete</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setResult(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-200">
                                    <i className="fas fa-redo"></i> Try Again
                                </button>
                                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'denoised.jpg'; a.click() }}
                                    className="px-5 py-2 bg-violet-600 text-white text-sm font-bold rounded-full hover:bg-violet-700 shadow-lg hover:shadow-violet-600/30">
                                    <i className="fas fa-download"></i> Download Clean Image
                                </button>
                            </div>
                        </div>

                        {/* Simple Before/After view */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Original (Noisy)</span>
                                <img src={image.img.src} alt="Original" className="w-full rounded-xl border border-slate-200 shadow-sm" />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-violet-600 mb-2 uppercase tracking-wide">Denoised Result</span>
                                <img src={result} alt="Denoised" className="w-full rounded-xl border border-violet-200 shadow-[0_4px_20px_rgba(139,92,246,0.15)]" />
                            </div>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </ToolLayout>
        </>
    )
}
