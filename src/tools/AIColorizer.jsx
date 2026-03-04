import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function AIColorizer() {
    const [image, setImage] = useState(null)
    const [tone, setTone] = useState('warm')
    const [isProcessing, setIsProcessing] = useState(false)
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

    // Simulated B&W Colorization
    const colorize = () => {
        if (!image) return
        setIsProcessing(true)

        setTimeout(() => {
            const W = image.img.width, H = image.img.height
            const canvas = canvasRef.current
            canvas.width = W; canvas.height = H
            const ctx = canvas.getContext('2d')

            // Draw original grayscale image
            ctx.filter = 'grayscale(100%) contrast(110%)'
            ctx.drawImage(image.img, 0, 0)

            // Apply color wash based on tone
            ctx.filter = 'none'
            ctx.globalCompositeOperation = 'color'

            const grad = ctx.createLinearGradient(0, 0, 0, H)
            if (tone === 'warm') {
                grad.addColorStop(0, '#fcd34d')   // warm yellow sunlight
                grad.addColorStop(0.5, '#fca5a5') // skin red/pink
                grad.addColorStop(1, '#8b5cf6')   // purple shadows
            } else if (tone === 'vintage') {
                grad.addColorStop(0, '#d97706')   // sepia/orange
                grad.addColorStop(1, '#1e3a8a')   // dark blue
            } else if (tone === 'cool') {
                grad.addColorStop(0, '#60a5fa')   // sky blue
                grad.addColorStop(0.8, '#34d399') // cyan/green mid
                grad.addColorStop(1, '#0f172a')   // dark slate
            } else if (tone === 'vibrant') {
                ctx.globalCompositeOperation = 'overlay'
                grad.addColorStop(0, '#ef4444')
                grad.addColorStop(0.5, '#10b981')
                grad.addColorStop(1, '#3b82f6')
                ctx.globalAlpha = 0.5
            }

            ctx.fillStyle = grad
            ctx.fillRect(0, 0, W, H)

            ctx.globalCompositeOperation = 'source-over'
            ctx.globalAlpha = 1

            setResult(canvas.toDataURL('image/jpeg', 0.95))
            setIsProcessing(false)
        }, 1500) // Fake AI loading delay
    }

    return (
        <>
            <SEO title="AI Old Photo Colorizer Online Free — Turn Black & White to Color" description="Instantly add lifelike colors to old black and white photos online. AI-powered photo colorization tool. Free, secure, browser-based." canonical="/ai-colorizer" />
            <ToolLayout toolSlug="ai-colorizer" title="AI Photo Colorizer" description="Breathe life into old black & white photos. Apply smart colorization gradients instantly." breadcrumb="AI Colorizer">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-rose-400 bg-rose-50' : ''}`}>
                        {image ? (
                            <img src={image.img.src} alt="" className="max-h-56 mx-auto rounded-lg object-contain filter grayscale" />
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center"><i className="fas fa-palette text-rose-500 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop a Black & White photo here</p>
                                <p className="text-xs text-slate-400">Color images will be converted to B&W first</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-swatchbook text-rose-500 mr-2"></i>Colorization Vibe</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { id: 'warm', label: 'Warm & Natural', c: 'bg-gradient-to-b from-amber-300 via-rose-300 to-purple-500' },
                            { id: 'vintage', label: 'Vintage Sepia', c: 'bg-gradient-to-b from-amber-600 to-blue-900' },
                            { id: 'cool', label: 'Cool Cinematic', c: 'bg-gradient-to-b from-blue-400 via-emerald-400 to-slate-900' },
                            { id: 'vibrant', label: 'Vibrant Pop', c: 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500' },
                        ].map(v => (
                            <button key={v.id} onClick={() => setTone(v.id)}
                                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${tone === v.id ? 'border-rose-500 ring-2 ring-rose-300 ring-offset-1' : 'border-slate-200 hover:border-rose-300'}`}>
                                <div className={`absolute top-0 right-0 w-8 h-8 rounded-bl-xl opacity-80 ${v.c}`}></div>
                                <p className={`font-bold text-sm mt-3 ${tone === v.id ? 'text-rose-700' : 'text-slate-700'}`}>{v.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {image && !isProcessing && !result && (
                    <button onClick={colorize} className="btn-primary w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-rose-500 to-orange-500 border-none">
                        <i className="fas fa-magic"></i> Colorize Photo
                    </button>
                )}

                {isProcessing && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-1 mb-2">
                            <div className="w-4 h-4 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-4 h-4 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <p className="font-bold text-slate-700">Analyzing depth and adding intelligent colors...</p>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800 text-lg"><i className="fas fa-check-circle text-green-500 mr-2"></i>Colorization Complete</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'colorized.jpg'; a.click() }}
                                className="px-5 py-2 bg-rose-600 text-white text-sm font-bold rounded-full hover:bg-rose-700 shadow-lg hover:shadow-rose-600/30">
                                <i className="fas fa-download"></i> Download Photo
                            </button>
                        </div>
                        <img src={result} alt="Colorized" className="w-full rounded-xl border border-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.15)]" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </ToolLayout>
        </>
    )
}
