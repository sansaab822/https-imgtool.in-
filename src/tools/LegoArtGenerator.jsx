import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function LegoArtGenerator() {
    const [image, setImage] = useState(null)
    const [blockSize, setBlockSize] = useState(16)
    const [palette, setPalette] = useState('classic') // classic, grayscale, vibrant
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

    // Generic color distance
    const colorDist = (r1, g1, b1, r2, g2, b2) => Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)

    const generate = () => {
        if (!image) return
        const W = image.img.width, H = image.img.height
        // Limit processing size for performance, max 100 blocks wide
        const scale = W / blockSize > 120 ? 120 / (W / blockSize) : 1
        const sW = Math.round(W * scale), sH = Math.round(H * scale)
        const blocksX = Math.floor(sW / blockSize), blocksY = Math.floor(sH / blockSize)

        // Create offscreen canvas to get pixel data
        const off = document.createElement('canvas')
        off.width = sW; off.height = sH
        const oCtx = off.getContext('2d')
        oCtx.drawImage(image.img, 0, 0, sW, sH)
        const data = oCtx.getImageData(0, 0, sW, sH).data

        const PALETTES = {
            classic: [[228, 0, 43], [0, 133, 199], [255, 213, 0], [0, 146, 70], [255, 255, 255], [0, 0, 0], [140, 140, 140], [163, 86, 52], [242, 169, 0]],
            grayscale: [[255, 255, 255], [200, 200, 200], [150, 150, 150], [100, 100, 100], [50, 50, 50], [0, 0, 0]],
            vibrant: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255], [255, 128, 0], [128, 0, 255]]
        }
        const colors = PALETTES[palette]

        const getClosest = (r, g, b) => {
            let minDis = 9999, c = colors[0]
            for (const p of colors) {
                const d = colorDist(r, g, b, p[0], p[1], p[2])
                if (d < minDis) { minDis = d; c = p }
            }
            return `rgb(${c[0]},${c[1]},${c[2]})`
        }

        const W_out = blocksX * blockSize, H_out = blocksY * blockSize
        const canvas = canvasRef.current
        canvas.width = W_out; canvas.height = H_out
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#222'
        ctx.fillRect(0, 0, W_out, H_out)

        for (let y = 0; y < blocksY; y++) {
            for (let x = 0; x < blocksX; x++) {
                // Sample center of block
                const px = x * blockSize + Math.floor(blockSize / 2)
                const py = y * blockSize + Math.floor(blockSize / 2)
                const i = (py * sW + px) * 4
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
                if (a < 10) continue // skip transparent

                const fill = getClosest(r, g, b)

                // Draw Lego brick base
                ctx.fillStyle = fill
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)

                // Brick borders for depth
                ctx.strokeStyle = 'rgba(0,0,0,0.3)'
                ctx.lineWidth = 1
                ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize)

                // Draw stud (circle in middle)
                ctx.beginPath()
                const rStud = blockSize * 0.35
                ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, rStud, 0, Math.PI * 2)
                ctx.fillStyle = fill
                ctx.fill()

                // Stud highlight and shadow to make it pop
                ctx.strokeStyle = 'rgba(255,255,255,0.4)'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, rStud, Math.PI, Math.PI * 1.5)
                ctx.stroke()

                ctx.strokeStyle = 'rgba(0,0,0,0.3)'
                ctx.beginPath()
                ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, rStud, 0, Math.PI * 0.5)
                ctx.stroke()
            }
        }

        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Lego Art Generator — Turn Photo into Toy Bricks Online Free" description="Convert any image into a Lego brick mosaic style art online. Choose classic, vibrant, or grayscale brick palettes. Fun, free, instant download." canonical="/lego-art-generator" />
            <ToolLayout toolSlug="lego-art-generator" title="Lego Bricks Art Generator" description="Turn your photos into a masterpiece made of toy building blocks. Select grid size and colors." breadcrumb="Lego Art">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-red-400 bg-red-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-36 rounded-lg object-contain" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center"><i className="fas fa-th text-red-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop your photo here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-red-500 mr-2"></i>Brick Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Brick Size: {blockSize}px</label>
                            <input type="range" min="8" max="40" step="2" value={blockSize} onChange={e => setBlockSize(+e.target.value)} className="slider-range w-full" />
                            <p className="text-[10px] text-slate-400 mt-1">Smaller sizes = more detail, bigger size = chunky toys</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Color Palette</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { k: 'classic', l: 'Classic Toy Colors' },
                                    { k: 'grayscale', l: 'Monochrome' },
                                    { k: 'vibrant', l: 'Neon RGB' }
                                ].map(p => (
                                    <button key={p.k} onClick={() => setPalette(p.k)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${palette === p.k ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500 hover:border-red-300'}`}>{p.l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-hammer"></i>Assemble Bricks!</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Your Art Piece!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'lego-art.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <img src={result} alt="Lego Art" className="w-full rounded-xl border border-slate-100 max-h-[600px] object-contain" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
