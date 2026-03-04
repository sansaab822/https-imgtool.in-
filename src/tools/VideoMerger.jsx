import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function VideoMerger() {
    const [videos, setVideos] = useState([])
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const canvasRef = useRef(null)

    const addVideo = useCallback((file) => {
        if (!file || !file.type.startsWith('video/')) return
        const url = URL.createObjectURL(file)
        setVideos(prev => [...prev, { file, url, name: file.name, size: file.size, id: Date.now() + Math.random() }])
        setResult(null)
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        Array.from(e.dataTransfer.files).forEach(f => addVideo(f))
    }

    const removeVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id))
    const fmtSize = b => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    const merge = async () => {
        if (videos.length < 2) return
        setProcessing(true); setProgress(0)
        const chunks = []

        // Load all videos and get dimensions
        const videoEls = await Promise.all(videos.map(v => new Promise(res => {
            const el = document.createElement('video')
            el.src = v.url; el.muted = true
            el.onloadedmetadata = () => res(el)
            el.onerror = () => res(null)
        })))

        const validEls = videoEls.filter(Boolean)
        if (!validEls.length) { setProcessing(false); return }

        const w = Math.max(...validEls.map(v => v.videoWidth))
        const h = Math.max(...validEls.map(v => v.videoHeight))
        const canvas = canvasRef.current
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        const stream = canvas.captureStream(24)
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 })

        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            setResult({ url: URL.createObjectURL(blob), size: blob.size })
            setProcessing(false); setProgress(100)
        }

        recorder.start(100)

        // Play each video sequentially
        for (let i = 0; i < validEls.length; i++) {
            const el = validEls[i]
            el.currentTime = 0
            await el.play()
            await new Promise(res => {
                const draw = () => {
                    if (!el.paused && !el.ended) {
                        ctx.drawImage(el, 0, 0, w, h)
                        const totalPct = ((i + el.currentTime / el.duration) / validEls.length) * 100
                        setProgress(Math.round(totalPct))
                        requestAnimationFrame(draw)
                    }
                }
                el.onplay = () => requestAnimationFrame(draw)
                el.onended = res
            })
        }

        recorder.stop()
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result.url
        a.download = 'merged-video.webm'
        a.click()
    }

    return (
        <>
            <SEO title="Video Merger Online — Combine Videos Free" description="Merge multiple video clips into one video online. No upload, browser-based. Combine MP4, WebM videos together. Free tool." canonical="/video-merger" />
            <ToolLayout toolSlug="video-merger" title="Video Merger" description="Merge multiple video clips into one seamless video. Browser-based, no upload required." breadcrumb="Video Merger">
                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*'; i.multiple = true; i.onchange = e => Array.from(e.target.files).forEach(addVideo); i.click() }}
                    className={`drop-zone cursor-pointer mb-6 ${videos.length ? 'border-violet-400 bg-violet-50' : ''}`}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                            <i className="fas fa-layer-group text-violet-400 text-2xl"></i>
                        </div>
                        <p className="font-semibold text-slate-700">Drop videos here or click to add</p>
                        <p className="text-sm text-slate-400">Add multiple videos — they will be merged in order</p>
                    </div>
                </div>

                {videos.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-list text-violet-500 mr-2"></i>Videos to Merge (in order)</h2>
                        <div className="space-y-3">
                            {videos.map((v, idx) => (
                                <div key={v.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">{idx + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{v.name}</p>
                                        <p className="text-xs text-slate-400">{fmtSize(v.size)}</p>
                                    </div>
                                    <video src={v.url} className="w-16 h-12 rounded object-cover flex-shrink-0" />
                                    <button onClick={() => removeVideo(v.id)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*'; i.onchange = e => addVideo(e.target.files[0]); i.click() }}
                            className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
                            <i className="fas fa-plus-circle"></i> Add another video
                        </button>
                    </div>
                )}

                {videos.length >= 2 && !processing && !result && (
                    <button onClick={merge} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-layer-group"></i> Merge {videos.length} Videos
                    </button>
                )}
                {videos.length === 1 && (
                    <p className="text-sm text-amber-600 mb-6"><i className="fas fa-info-circle mr-2"></i>Add at least 2 videos to merge.</p>
                )}

                {processing && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="font-semibold text-slate-700 mb-3"><i className="fas fa-spinner fa-spin text-violet-500 mr-2"></i>Merging... {progress}%</p>
                        <div className="bg-slate-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
                        <p className="text-xs text-slate-400 mt-2">Playing videos sequentially to capture merged stream...</p>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Merge Complete!</h2>
                        <p className="text-sm text-slate-500 mb-3">Merged size: {fmtSize(result.size)}</p>
                        <video src={result.url} controls className="w-full rounded-xl mb-4" />
                        <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download Merged Video
                        </button>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Online Video Merger</h2>
                    <p className="text-slate-600">Merge multiple video clips into a single seamless video file directly in your browser. No file uploads, no server processing — your videos are combined locally using HTML5 Canvas and MediaRecorder APIs. The videos are played and re-encoded sequentially into a single WebM output file.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How to Merge Videos</h3>
                    <ol className="list-decimal list-inside text-slate-600 space-y-2">
                        <li>Add two or more video files using the drop area or click to browse</li>
                        <li>Arrange them in the order you want (drag to reorder)</li>
                        <li>Click Merge Videos and wait for processing</li>
                        <li>Preview and download the merged WebM video</li>
                    </ol>
                    <p className="text-slate-600 mt-4">Also use our <a href="/video-trimmer" className="text-blue-600 hover:underline">Video Trimmer</a> to trim individual clips before merging, or <a href="/video-compressor" className="text-blue-600 hover:underline">Video Compressor</a> to reduce file size.</p>
                </div>
            </ToolLayout>
        </>
    )
}
