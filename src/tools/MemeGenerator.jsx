import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function MemeGenerator() {
    const [image, setImage] = useState(null)
    const [topText, setTopText] = useState('WHEN YOU FINALLY')
    const [bottomText, setBottomText] = useState('UNDERSTAND RECURSION')
    const [fontSize, setFontSize] = useState(48)
    const [textColor, setTextColor] = useState('#ffffff')
    const [strokeColor, setStrokeColor] = useState('#000000')
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

    const generate = () => {
        if (!image) return
        const W = image.img.width, H = image.img.height
        const canvas = canvasRef.current
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image.img, 0, 0)

        const fSize = Math.round(fontSize * (W / 500))
        ctx.font = `bold ${fSize}px Impact, Arial Black, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = textColor
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = fSize / 8
        ctx.lineJoin = 'round'

        const drawText = (text, y) => {
            ctx.strokeText(text, W / 2, y)
            ctx.fillText(text, W / 2, y)
        }

        if (topText.trim()) {
            ctx.textBaseline = 'top'
            const lines = wrapText(ctx, topText.toUpperCase(), W - 20)
            lines.forEach((line, i) => drawText(line, 10 + i * (fSize * 1.15)))
        }
        if (bottomText.trim()) {
            ctx.textBaseline = 'alphabetic'
            const lines = wrapText(ctx, bottomText.toUpperCase(), W - 20)
            lines.reverse().forEach((line, i) => drawText(line, H - 10 - i * (fSize * 1.15)))
        }

        setResult(canvas.toDataURL('image/jpeg', 0.92))
    }

    const wrapText = (ctx, text, maxW) => {
        const words = text.split(' ')
        const lines = [], cur = []
        words.forEach(w => {
            const test = [...cur, w].join(' ')
            if (ctx.measureText(test).width < maxW) { cur.push(w) }
            else { if (cur.length) lines.push(cur.join(' ')); cur.length = 0; cur.push(w) }
        })
        if (cur.length) lines.push(cur.join(' '))
        return lines
    }

    const TEMPLATES = [
        { label: 'Drake No/Yes', top: 'NO.', bottom: 'YES, PLEASE.' },
        { label: 'Distracted BF', top: 'ME LOOKING AT:', bottom: 'MY ACTUAL TASK' },
        { label: 'This Is Fine', top: 'EVERYTHING IS FINE', bottom: '🔥 THIS IS FINE 🔥' },
        { label: 'Caption Only', top: '', bottom: 'Type your caption...' },
    ]

    return (
        <>
            <SEO title="Meme Generator Online Free — Add Text to Any Image" description="Create memes online by adding Impact-style top/bottom text to any image. Customize font size, color, and stroke. Free, instant, no signup required." canonical="/meme-generator" />
            <ToolLayout toolSlug="meme-generator" title="Meme Generator" description="Add Impact-style top and bottom text to any image. The classic meme creator online." breadcrumb="Meme Generator">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-yellow-400 bg-yellow-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-36 rounded-lg object-contain" />
                                <p className="text-xs text-yellow-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center"><i className="fas fa-laugh-squint text-yellow-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Upload or drop a meme image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-font text-yellow-500 mr-2"></i>Meme Text</h2>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Top Text</label>
                        <input type="text" value={topText} onChange={e => setTopText(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none uppercase" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Bottom Text</label>
                        <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none uppercase" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Quick Templates</label>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATES.map(t => (
                                <button key={t.label} onClick={() => { setTopText(t.top); setBottomText(t.bottom) }}
                                    className="px-3 py-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:border-yellow-400 hover:bg-yellow-50 transition-all">{t.label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Font Size: {fontSize}px</label>
                            <input type="range" min="16" max="100" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Text Color</label>
                            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Stroke/Outline</label>
                            <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-laugh-squint"></i>Generate Meme</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Your Meme!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'meme.jpg'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download Meme
                            </button>
                        </div>
                        <img src={result} alt="Meme" className="w-full rounded-xl border border-slate-100 max-h-96 object-contain" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Free Meme Generator Online</h2>
                    <p className="text-slate-600">Create memes online by adding customizable text in the classic Impact font style. Upload any image and add top and bottom captions with white text and black stroke — the iconic meme format. Customize font size, text color, and stroke color. Generate in seconds and download as JPG. No account, no watermark, no limits.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Tips for Better Memes</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Keep text short for maximum impact — 5 words or less per line</li>
                        <li>All-caps text is the classic meme format (applied automatically)</li>
                        <li>White text with black stroke works on both light and dark images</li>
                        <li>Use the "Caption Only" template for single bottom text memes</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Also try: <a href="/gif-maker" className="text-blue-600 hover:underline">GIF Maker</a> · <a href="/add-watermark-to-image" className="text-blue-600 hover:underline">Add Watermark</a> · <a href="/sticker-add-virtual" className="text-blue-600 hover:underline">Add Stickers</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
