import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function EmojiMosaic() {
    const [image, setImage] = useState(null)
    const [density, setDensity] = useState(40) // width size for processing
    const [progress, setProgress] = useState('')
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

    // Limited emoji palette mapped to approximate average RGB colors for simplicity
    const EMOJI_PALETTE = [
        { c: [255, 204, 77], e: '😀' }, { c: [221, 46, 68], e: '❤️' }, { c: [85, 172, 238], e: '🥶' },
        { c: [119, 178, 85], e: '🤢' }, { c: [49, 55, 59], e: '🌑' }, { c: [230, 231, 232], e: '☁️' },
        { c: [244, 144, 36], e: '🎃' }, { c: [146, 102, 204], e: '👿' }, { c: [255, 172, 51], e: '🧀' },
        { c: [193, 105, 79], e: '💩' }, { c: [255, 255, 255], e: '🥚' }, { c: [0, 0, 0], e: '🎱' },
        { c: [190, 25, 49], e: '🍎' }, { c: [0, 110, 40], e: '🌲' }, { c: [0, 0, 200], e: '💧' }
    ]

    const colorDist = (r1, g1, b1, r2, g2, b2) => Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)

    const generate = () => {
        if (!image) return
        setProgress('Analyzing pixels...')

        // allow UI update
        setTimeout(() => {
            const W = image.img.width, H = image.img.height
            const ratio = H / W
            const sW = parseInt(density)
            const sH = Math.round(sW * ratio)

            const emojiSize = Math.max(16, Math.round(1800 / sW)) // output res max ~1800px width
            const oW = sW * emojiSize, oH = sH * emojiSize

            const off = document.createElement('canvas')
            off.width = sW; off.height = sH
            const oCtx = off.getContext('2d')
            oCtx.drawImage(image.img, 0, 0, sW, sH)
            const data = oCtx.getImageData(0, 0, sW, sH).data

            const canvas = canvasRef.current
            canvas.width = oW; canvas.height = oH
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#f0f0f0'
            ctx.fillRect(0, 0, oW, oH)
            ctx.font = `${emojiSize}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            setProgress('Converting to emojis...')

            for (let y = 0; y < sH; y++) {
                for (let x = 0; x < sW; x++) {
                    const i = (y * sW + x) * 4
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
                    if (a < 10) continue

                    let minD = 9999, e = '😀'
                    for (let pi = 0; pi < EMOJI_PALETTE.length; pi++) {
                        const pal = EMOJI_PALETTE[pi]
                        const d = colorDist(r, g, b, pal.c[0], pal.c[1], pal.c[2])
                        if (d < minD) { minD = d; e = pal.e }
                    }

                    ctx.fillText(e, x * emojiSize + emojiSize / 2, y * emojiSize + emojiSize / 2 + emojiSize * 0.1)
                }
            }

            setResult(canvas.toDataURL('image/jpeg', 0.8))
            setProgress('')
        }, 100)
    }

    return (
        <>
            <SEO title="Photo to Emoji Mosaic Generator Online Free" description="Recreate your photos using hundreds of emojis! Convert any image to emoji art online for free. Fun, creative mosaic generator." canonical="/emoji-mosaic" />
            <ToolLayout toolSlug="emoji-mosaic" title="Emoji Mosaic Art" description="Rebuild your photos entirely out of colorful emojis. Instant generation." breadcrumb="Emoji Mosaic">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-indigo-400 bg-indigo-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-36 rounded" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center"><i className="fas fa-smile-beam text-indigo-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop photo to emojify</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-indigo-500 mr-2"></i>Mosaic Details</h2>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Detail Level (Emojis per row): {density}</label>
                        <input type="range" min="20" max="80" value={density} onChange={e => setDensity(+e.target.value)} className="slider-range w-full max-w-md" />
                        <p className="text-[10px] text-slate-400 mt-1">More emojis means higher detail, but takes slightly longer to generate.</p>
                    </div>
                </div>

                {image && !progress && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-magic"></i>Emojify It!</button>}

                {progress && (
                    <div className="font-bold text-indigo-600 flex items-center gap-2 mb-6 bg-indigo-50 p-4 rounded-xl">
                        <i className="fas fa-spinner fa-spin"></i> {progress}
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Success!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'emoji-art.jpg'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download JPG
                            </button>
                        </div>
                        <img src={result} alt="Emoji Art" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
