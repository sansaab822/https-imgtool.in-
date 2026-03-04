import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function JigsawPuzzleMaker() {
    const [image, setImage] = useState(null)
    const [cols, setCols] = useState(4)
    const [rows, setRows] = useState(3)
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
        ctx.drawImage(image.img, 0, 0, W, H)

        const cellW = W / cols
        const cellH = H / rows
        const tabRadius = Math.min(cellW, cellH) * 0.15

        // Basic logic mapping jigsaw outlines over the image
        ctx.lineWidth = Math.max(2, W / 400)
        ctx.strokeStyle = 'rgba(0,0,0,0.8)'

        const drawTab = (x, y, isHoriz, isReversed) => {
            const cx = isHoriz ? x + cellW / 2 : x
            const cy = isHoriz ? y : y + cellH / 2

            // simplistic bezier bump overlay
            ctx.beginPath()
            if (isHoriz) {
                ctx.moveTo(x, y)
                ctx.lineTo(cx - tabRadius, y)
                ctx.arc(cx, y + (isReversed ? -1 : 1) * tabRadius, tabRadius, Math.PI, 0, isReversed)
                ctx.lineTo(x + cellW, y)
            } else {
                ctx.moveTo(x, y)
                ctx.lineTo(x, cy - tabRadius)
                ctx.arc(x + (isReversed ? -1 : 1) * tabRadius, cy, tabRadius, -Math.PI / 2, Math.PI / 2, isReversed)
                ctx.lineTo(x, y + cellH)
            }
            ctx.stroke()

            // add highlight
            ctx.strokeStyle = 'rgba(255,255,255,0.4)'
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.strokeStyle = 'rgba(0,0,0,0.8)'
            ctx.lineWidth = Math.max(2, W / 400)
        }

        // Draw horizontal lines
        for (let y = 1; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                drawTab(x * cellW, y * cellH, true, (x + y) % 2 === 0)
            }
        }
        // Draw vertical lines
        for (let x = 1; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                drawTab(x * cellW, y * cellH, false, (x + y) % 2 !== 0)
            }
        }

        setResult(canvas.toDataURL('image/jpeg', 0.9))
    }

    return (
        <>
            <SEO title="Turn Photo into Jigsaw Puzzle Online Free" description="Add realistic jigsaw puzzle cut lines over your images online. Free jigsaw puzzle effect generator. Specify grid sizes and instantly download." canonical="/jigsaw-puzzle-maker" />
            <ToolLayout toolSlug="jigsaw-puzzle-maker" title="Jigsaw Puzzle Creator" description="Add realistic puzzle piece cut lines overlay to your images." breadcrumb="Jigsaw Maker">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-emerald-400 bg-emerald-50' : ''}`}>
                        {image ? (
                            <img src={image.img.src} alt="" className="max-h-36 mx-auto rounded" />
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center"><i className="fas fa-puzzle-piece text-emerald-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop an image here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-emerald-500 mr-2"></i>Puzzle Grid</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Columns: {cols}</label>
                            <input type="range" min="2" max="25" value={cols} onChange={e => setCols(+e.target.value)} className="slider-range w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Rows: {rows}</label>
                            <input type="range" min="2" max="25" value={rows} onChange={e => setRows(+e.target.value)} className="slider-range w-full" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 text-center">Total pieces: <strong className="text-emerald-600 text-base">{cols * rows}</strong></p>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-puzzle-piece"></i>Draw Puzzle Lines</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Puzzle Overlay Added!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'puzzle.jpg'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download JPG
                            </button>
                        </div>
                        <img src={result} alt="Puzzle" className="w-full rounded-xl border border-slate-100" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
