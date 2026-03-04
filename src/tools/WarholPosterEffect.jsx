import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function WarholPosterEffect() {
    const [image, setImage] = useState(null)
    const [threshold, setThreshold] = useState(128)
    const [gridSize, setGridSize] = useState(2) // 2x2 grid
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

    // Pre-defined colorful palettes mapping Dark -> Light colors
    const PALETTES = [
        { d: '#1F2937', l: '#FCD34D' }, // dark gray -> yellow
        { d: '#831843', l: '#A7F3D0' }, // deep pink -> mint
        { d: '#1E3A8A', l: '#FCA5A5' }, // navy -> light red
        { d: '#064E3B', l: '#FDBA74' }, // forest -> orange
        { d: '#4c1d95', l: '#bef264' }, // purple -> lime
        { d: '#7c2d12', l: '#93c5fd' }, // brown -> light blue
        { d: '#881337', l: '#fef3c7' }, // ruby -> light yellow
        { d: '#0f172a', l: '#f472b6' }, // slate -> pink
        { d: '#14532d', l: '#e879f9' }  // green -> fuchsia
    ]

    const hex2rgb = (hex) => {
        const v = parseInt(hex.slice(1), 16)
        return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
    }

    const generate = () => {
        if (!image) return
        const sW = 400, sH = Math.round(400 * (image.img.height / image.img.width))
        const W_out = sW * gridSize, H_out = sH * gridSize

        // Get grayscale data
        const off = document.createElement('canvas')
        off.width = sW; off.height = sH
        const oCtx = off.getContext('2d')
        oCtx.drawImage(image.img, 0, 0, sW, sH)
        const imgData = oCtx.getImageData(0, 0, sW, sH)
        const data = imgData.data

        // Build luminosity map
        const lums = new Uint8Array(sW * sH)
        for (let i = 0; i < data.length; i += 4) {
            lums[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114 // grayscale
        }

        const canvas = canvasRef.current
        canvas.width = W_out; canvas.height = H_out
        const ctx = canvas.getContext('2d')
        const outData = ctx.createImageData(W_out, H_out)

        // Fill each grid cell
        for (let gy = 0; gy < gridSize; gy++) {
            for (let gx = 0; gx < gridSize; gx++) {
                const palIdx = (gy * gridSize + gx) % PALETTES.length
                const colors = PALETTES[palIdx]
                const cD = hex2rgb(colors.d)
                const cL = hex2rgb(colors.l)

                for (let y = 0; y < sH; y++) {
                    for (let x = 0; x < sW; x++) {
                        const outX = gx * sW + x
                        const outY = gy * sH + y
                        const inIdx = y * sW + x
                        const outIdx = (outY * W_out + outX) * 4

                        const lum = lums[inIdx]
                        // Threshold step function
                        const isLight = lum > threshold
                        const c = isLight ? cL : cD

                        outData.data[outIdx] = c.r
                        outData.data[outIdx + 1] = c.g
                        outData.data[outIdx + 2] = c.b
                        outData.data[outIdx + 3] = 255
                    }
                }
            }
        }

        ctx.putImageData(outData, 0, 0)

        // Add grid lines
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 4
        for (let i = 1; i < gridSize; i++) {
            ctx.beginPath()
            ctx.moveTo(i * sW, 0); ctx.lineTo(i * sW, H_out); ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, i * sH); ctx.lineTo(W_out, i * sH); ctx.stroke()
        }

        setResult(canvas.toDataURL('image/jpeg', 0.9))
    }

    return (
        <>
            <SEO title="Warhol Pop Art Poster Effect Generator Online" description="Turn your portrait photos into iconic Andy Warhol style pop art posters online. Threshold-based, multi-color grid generation. Free." canonical="/warhol-poster-effect" />
            <ToolLayout toolSlug="warhol-poster-effect" title="Warhol Pop Art Poster" description="Create a classic Andy Warhol style 4-panel pop art poster from your portrait." breadcrumb="Warhol Pop Art">

                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-info-circle mr-2"></i>For best results, use a photo with a <strong>solid or light background</strong> and high contrast on the face.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-fuchsia-400 bg-fuchsia-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-48 rounded object-cover" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center"><i className="fas fa-palette text-fuchsia-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop a portrait photo here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-fuchsia-500 mr-2"></i>Art Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Contrast Threshold: {threshold}</label>
                            <input type="range" min="30" max="220" value={threshold} onChange={e => setThreshold(+e.target.value)} className="slider-range w-full" />
                            <p className="text-[10px] text-slate-400 mt-1">Controls how much dark vs light area appears. Adjust to fit your face.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Poster Grid Style</label>
                            <div className="flex gap-2">
                                {[2, 3].map(sz => (
                                    <button key={sz} onClick={() => setGridSize(sz)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${gridSize === sz ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700' : 'border-slate-200 text-slate-500 hover:border-fuchsia-300'}`}>
                                        {sz}x{sz} Grid ({sz * sz} panels)
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-magic"></i>Create Pop Art</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Poster Ready!</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'popart-poster.jpg'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download JPG
                            </button>
                        </div>
                        <img src={result} alt="Pop Art" className="w-full rounded-xl border border-slate-100 shadow-md" />
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
