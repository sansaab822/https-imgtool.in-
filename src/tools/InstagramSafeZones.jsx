import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

const SAFE_ZONES = {
    reel: { top: 0.12, bottom: 0.12, left: 0, right: 0, label: 'Instagram Reel Safe Zone (12% top/bottom)' },
    story: { top: 0.14, bottom: 0.14, left: 0, right: 0, label: 'Instagram Story Safe Zone (14% top/bottom)' },
    youtube: { top: 0.055, bottom: 0.055, left: 0.055, right: 0.055, label: 'YouTube Safe Zone (5.5% all sides)' },
    tiktok: { top: 0.15, bottom: 0.2, left: 0.03, right: 0.03, label: 'TikTok Safe Zone' },
}

export default function InstagramSafeZones() {
    const [image, setImage] = useState(null)
    const [platform, setPlatform] = useState('reel')
    const [showGrid, setShowGrid] = useState(false)
    const [overlayColor, setOverlayColor] = useState('#ff0080')
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
        const zone = SAFE_ZONES[platform]
        const W = image.img.width, H = image.img.height
        const canvas = canvasRef.current
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image.img, 0, 0)

        // Unsafe regions (overlay with semi-transparent color)
        const overlayAlpha = 0.3
        ctx.fillStyle = overlayColor
        ctx.globalAlpha = overlayAlpha

        // Top unsafe
        ctx.fillRect(0, 0, W, H * zone.top)
        // Bottom unsafe
        ctx.fillRect(0, H * (1 - zone.bottom), W, H * zone.bottom)
        // Left unsafe
        if (zone.left > 0) ctx.fillRect(0, 0, W * zone.left, H)
        // Right unsafe
        if (zone.right > 0) ctx.fillRect(W * (1 - zone.right), 0, W * zone.right, H)

        ctx.globalAlpha = 1

        // Safe zone border lines
        ctx.strokeStyle = overlayColor
        ctx.lineWidth = Math.max(2, W / 300)
        ctx.setLineDash([8, 4])
        const safeX = W * zone.left, safeY = H * zone.top
        const safeW = W * (1 - zone.left - zone.right), safeH = H * (1 - zone.top - zone.bottom)
        ctx.strokeRect(safeX, safeY, safeW, safeH)
        ctx.setLineDash([])

        // Labels
        const fSize = Math.max(14, W / 35)
        ctx.font = `bold ${fSize}px Arial`
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('SAFE ZONE', W / 2, H / 2)
        ctx.font = `${Math.round(fSize * 0.7)}px Arial`
        ctx.fillText('Content visible here', W / 2, H / 2 + fSize * 1.3)

        // Grid
        if (showGrid) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'
            ctx.lineWidth = 1
            for (let x = safeW / 3; x < safeW; x += safeW / 3) { ctx.beginPath(); ctx.moveTo(safeX + x, safeY); ctx.lineTo(safeX + x, safeY + safeH); ctx.stroke() }
            for (let y = safeH / 3; y < safeH; y += safeH / 3) { ctx.beginPath(); ctx.moveTo(safeX, safeY + y); ctx.lineTo(safeX + safeW, safeY + y); ctx.stroke() }
        }

        setResult(canvas.toDataURL('image/png'))
    }

    return (
        <>
            <SEO title="Instagram Reel Safe Zones Overlay — Story Safe Area Tool Free" description="Add Instagram Reel or Story safe zones overlay to images. Check content visibility. Free browser-based tool for creators and social media managers." canonical="/instagram-safe-zones" />
            <ToolLayout toolSlug="instagram-safe-zones" title="Instagram Reel Safe Zones" description="Add safe zone overlays for Reels, Stories, YouTube Shorts, and TikTok. Preview where content will be visible." breadcrumb="Instagram Safe Zones">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${image ? 'border-pink-400 bg-pink-50' : ''}`}>
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image.img.src} alt="" className="max-h-36 rounded-lg object-contain" style={{ aspectRatio: '9/16', objectFit: 'cover', maxWidth: '80px' }} />
                                <p className="text-xs text-pink-700 font-medium">{image.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center"><i className="fas fa-mobile-alt text-pink-400 text-2xl"></i></div>
                                <p className="font-semibold text-slate-700">Drop your Reel / Story image</p>
                                <p className="text-xs text-slate-400">Best with 9:16 (1080×1920) images</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-mobile-alt text-pink-500 mr-2"></i>Platform Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        {Object.entries(SAFE_ZONES).map(([key, zone]) => (
                            <button key={key} onClick={() => { setPlatform(key); setResult(null) }}
                                className={`p-3 rounded-xl border text-left transition-all ${platform === key ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-pink-300'}`}>
                                <p className="font-bold text-sm text-slate-800 capitalize">{key === 'reel' ? 'Instagram Reel' : key === 'story' ? 'Instagram Story' : key === 'youtube' ? 'YouTube Shorts' : 'TikTok'}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Top {Math.round(zone.top * 100)}% · Bottom {Math.round(zone.bottom * 100)}%{zone.left ? ` · Sides ${Math.round(zone.left * 100)}%` : ''}</p>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4 items-center flex-wrap">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="rounded text-pink-600" />
                            Show rule-of-thirds grid
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-600">Overlay color:</span>
                            <input type="color" value={overlayColor} onChange={e => setOverlayColor(e.target.value)} className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {image && <button onClick={generate} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-mobile-alt"></i>Apply Safe Zone Overlay</button>}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Safe Zone Preview</h2>
                            <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'safe-zones-overlay.png'; a.click() }}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download PNG
                            </button>
                        </div>
                        <div className="max-w-xs mx-auto"><img src={result} alt="Safe Zones" className="w-full rounded-xl border border-slate-100" /></div>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Instagram Reel Safe Zones Overlay Tool</h2>
                    <p className="text-slate-600">Add safe zone guides to your Instagram Reel, Story, TikTok and YouTube Shorts images. The colored overlay shows which parts of your image may be hidden by platform UI elements (like the caption area, like/comment buttons, and profile info). Content in the highlighted safe zone area will always be visible to viewers.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Platform Safe Zone Guidelines</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>Instagram Reels</strong>: Keep important content out of top 12% and bottom 12%</li>
                        <li><strong>Instagram Stories</strong>: Keep content out of top 14% and bottom 14%</li>
                        <li><strong>TikTok</strong>: Bottom 20% has buttons and caption — keep text away from there</li>
                        <li><strong>YouTube Shorts</strong>: 5.5% on all sides is the danger zone</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/image-resizer" className="text-blue-600 hover:underline">Image Resizer</a> · <a href="/add-watermark-to-image" className="text-blue-600 hover:underline">Add Watermark</a> · <a href="/crop-image" className="text-blue-600 hover:underline">Crop Image</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
