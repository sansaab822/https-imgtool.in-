import { useState, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function StickerAddVirtual() {
    const [image, setImage] = useState(null)
    const [stickers, setStickers] = useState([]) // { id, emoji, x, y, size }
    const [selectedEmoji, setSelectedEmoji] = useState('😎')
    const [stickerSize, setStickerSize] = useState(100)
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const EMOJI_LIST = ['😎', '😍', '😂', '😭', '😡', '👽', '👻', '💩', '🔥', '💯', '🌟', '❤️', '👑', '🎉', '🍕', '🍔']

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => { setImage({ img, name: file.name, w: img.width, h: img.height }); setStickers([]); renderCanvas(); }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    const renderCanvas = () => {
        if (!image) return
        const canvas = canvasRef.current
        canvas.width = image.w; canvas.height = image.h
        const ctx = canvas.getContext('2d')

        // Draw base image
        ctx.drawImage(image.img, 0, 0)

        // Draw stickers
        stickers.forEach(s => {
            ctx.font = `${s.size}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            // text shadow for better visibility
            ctx.shadowColor = 'rgba(0,0,0,0.5)'
            ctx.shadowBlur = Math.max(4, s.size / 10)
            ctx.fillText(s.emoji, image.w * s.x, image.h * s.y)
            ctx.shadowBlur = 0 // reset
        })

        setResult(canvas.toDataURL('image/png'))
    }

    // Re-render when stickers change
    useEffect(() => {
        if (image) renderCanvas()
    }, [stickers, image])

    const handleCanvasClick = (e) => {
        if (!image) return
        const rect = e.target.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height

        setStickers([...stickers, {
            id: Date.now(),
            emoji: selectedEmoji,
            x, y,
            size: stickerSize * (image.w / 600) // scale relative to image size
        }])
    }

    const undoSticker = () => {
        setStickers(stickers.slice(0, -1))
    }

    return (
        <>
            <SEO title="Add Stickers and Emojis to Photos Online Free" description="Virtual sticker maker. Add emojis and stickers to your photos online. Click on the image to place stickers instantly. Free download." canonical="/sticker-add-virtual" />
            <ToolLayout toolSlug="sticker-add-virtual" title="Add Virtual Stickers" description="Add fun emojis and stickers directly onto your photos. Select a sticker and tap the image to place it." breadcrumb="Add Stickers">

                <div className="grid md:grid-cols-[1fr_300px] gap-6 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        {!image ? (
                            <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() }}
                                className="drop-zone cursor-pointer py-16 h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center"><i className="fas fa-smile text-orange-500 text-3xl"></i></div>
                                    <h3 className="font-bold text-xl text-slate-700">Upload Photo</h3>
                                </div>
                            </div>
                        ) : (
                            <div className="relative inline-block w-full cursor-crosshair">
                                <img src={result || image.img.src} alt="Canvas" onClick={handleCanvasClick} className="w-full h-auto object-contain max-h-[600px] rounded border border-slate-200 shadow-sm" />
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">
                                    Click image to place sticker
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">1. Pick a Sticker</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {EMOJI_LIST.map(e => (
                                    <button key={e} onClick={() => setSelectedEmoji(e)}
                                        className={`text-3xl p-2 rounded-xl border-2 transition-transform hover:scale-110 ${selectedEmoji === e ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-slate-50'}`}>
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">2. Size</h3>
                            <input type="range" min="30" max="300" value={stickerSize} onChange={e => setStickerSize(+e.target.value)} className="slider-range w-full" />
                            <div className="flex items-center justify-center py-4 bg-slate-50 rounded-xl mt-3 overflow-hidden">
                                <span style={{ fontSize: `${Math.min(100, stickerSize)}px` }}>{selectedEmoji}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex gap-2">
                                <button onClick={undoSticker} disabled={stickers.length === 0} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl font-bold text-slate-600 transition-all text-sm">
                                    <i className="fas fa-undo mr-2"></i>Undo
                                </button>
                                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'stickers.png'; a.click() }} disabled={stickers.length === 0}
                                    className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl font-bold text-white transition-all text-sm whitespace-nowrap">
                                    <i className="fas fa-download mr-1"></i> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

            </ToolLayout>
        </>
    )
}
