import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function GifMaker() {
    const [frames, setFrames] = useState([])
    const [delay, setDelay] = useState(200)
    const [progress, setProgress] = useState(null)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    const addFrames = (files) => {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return
            const reader = new FileReader()
            reader.onload = e => {
                const img = new Image()
                img.onload = () => setFrames(prev => [...prev, { img, name: file.name, src: e.target.result, id: Date.now() + Math.random() }])
                img.src = e.target.result
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFrame = (id) => setFrames(p => p.filter(f => f.id !== id))
    const moveFrame = (idx, dir) => {
        const arr = [...frames]
        const to = idx + dir
        if (to < 0 || to >= arr.length) return
            ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
        setFrames(arr)
    }

    const makeGif = async () => {
        if (frames.length < 2) { setError('Add at least 2 images'); return }
        setProgress('Loading GIF.js...')
        setError('')
        try {
            // Dynamically load GIF.js via CDN script tag
            if (!window.GIF) {
                await new Promise((res, rej) => {
                    const s = document.createElement('script')
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js'
                    s.onload = res; s.onerror = rej
                    document.head.appendChild(s)
                })
            }
            setProgress('Creating GIF...')
            const W = frames[0].img.width
            const H = frames[0].img.height
            const gif = new window.GIF({ workers: 2, quality: 10, width: W, height: H, workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js' })

            const canvas = document.createElement('canvas')
            canvas.width = W; canvas.height = H
            const ctx = canvas.getContext('2d')

            frames.forEach(f => {
                ctx.clearRect(0, 0, W, H)
                ctx.drawImage(f.img, 0, 0, W, H)
                gif.addFrame(canvas, { copy: true, delay })
            })

            gif.on('progress', p => setProgress(`Encoding GIF: ${Math.round(p * 100)}%`))
            gif.on('finished', blob => {
                setResult(URL.createObjectURL(blob))
                setProgress(null)
            })
            gif.render()
        } catch (e) {
            setError('GIF creation failed: ' + e.message)
            setProgress(null)
        }
    }

    return (
        <>
            <SEO title="GIF Maker from Images Online — Animated GIF Creator Free" description="Create animated GIFs from multiple images online. Control frame delay, order, and download instantly. Free browser-based GIF maker from photos." canonical="/gif-maker" />
            <ToolLayout toolSlug="gif-maker" title="GIF Maker" description="Create animated GIFs from a series of images. Control frame speed and order. Download instantly." breadcrumb="GIF Maker">

                <div
                    onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = e => addFrames(e.target.files); i.click() }}
                    className={`drop-zone cursor-pointer mb-6 ${frames.length ? 'border-pink-400 bg-pink-50' : ''}`}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center"><i className="fas fa-film text-pink-400 text-2xl"></i></div>
                        <p className="font-semibold text-slate-700">Click to add image frames</p>
                        <p className="text-xs text-slate-400">You can add multiple images at once — each becomes a GIF frame</p>
                    </div>
                </div>

                {frames.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-film text-pink-500 mr-2"></i>Frames ({frames.length})</h2>
                            <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = e => addFrames(e.target.files); i.click() }}
                                className="text-sm text-pink-600 flex items-center gap-1 hover:text-pink-800"><i className="fas fa-plus-circle"></i>Add Frames</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {frames.map((f, i) => (
                                <div key={f.id} className="relative group">
                                    <img src={f.src} alt={`Frame ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-slate-200" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center gap-1 transition-opacity">
                                        {i > 0 && <button onClick={() => moveFrame(i, -1)} className="text-white text-xs"><i className="fas fa-arrow-left"></i></button>}
                                        <button onClick={() => removeFrame(f.id)} className="text-red-300 text-xs"><i className="fas fa-times"></i></button>
                                        {i < frames.length - 1 && <button onClick={() => moveFrame(i, 1)} className="text-white text-xs"><i className="fas fa-arrow-right"></i></button>}
                                    </div>
                                    <span className="absolute -top-1 -left-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-pink-500 mr-2"></i>GIF Settings</h2>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Frame Delay: {delay}ms ({Math.round(1000 / delay)} fps)</label>
                        <input type="range" min="50" max="2000" step="50" value={delay} onChange={e => setDelay(+e.target.value)} className="slider-range w-full" />
                        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Fast (50ms)</span><span>Normal (200ms)</span><span>Slow (2s)</span></div>
                    </div>
                </div>

                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4"><i className="fas fa-exclamation-triangle mr-2"></i>{error}</div>}

                {frames.length >= 2 && !progress && (
                    <button onClick={makeGif} className="btn-primary flex items-center gap-2 mb-6"><i className="fas fa-film"></i>Create GIF ({frames.length} frames)</button>
                )}

                {progress && (
                    <div className="bg-pink-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-2xl text-pink-500"></i>
                        <p className="font-semibold text-pink-800">{progress}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-check-circle text-green-500 mr-2"></i>Your GIF is Ready!</h2>
                            <a href={result} download="animated.gif"
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i>Download GIF
                            </a>
                        </div>
                        <img src={result} alt="Animated GIF" className="max-w-sm mx-auto rounded-xl border border-slate-100" />
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Animated GIF from Images Online</h2>
                    <p className="text-slate-600">Turn a series of images into an animated GIF in seconds. Upload your frames (any order), arrange them via drag and hover controls, set the delay between frames, and click to encode. Uses the open-source gif.js library for client-side GIF encoding — no file upload required. Perfect for animations, reactions, product carousels, and social media content.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Frame Delay Guide</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>100ms (10fps)</strong>: Smooth animation</li>
                        <li><strong>200ms (5fps)</strong>: Normal for memes and reactions</li>
                        <li><strong>500ms</strong>: Slideshow-style</li>
                        <li><strong>1000ms+</strong>: Slow, deliberate transitions</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related: <a href="/meme-generator" className="text-blue-600 hover:underline">Meme Generator</a> · <a href="/collage-maker" className="text-blue-600 hover:underline">Collage Maker</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
