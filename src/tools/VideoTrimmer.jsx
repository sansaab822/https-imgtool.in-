import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function VideoTrimmer() {
    const [video, setVideo] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(10)
    const [duration, setDuration] = useState(0)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const videoRef = useRef(null)
    const previewRef = useRef(null)
    const canvasRef = useRef(null)

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('video/')) return
        const url = URL.createObjectURL(file)
        const v = document.createElement('video')
        v.onloadedmetadata = () => {
            setDuration(v.duration)
            setEnd(Math.min(v.duration, 30))
        }
        v.src = url
        setVideo({ file, url, name: file.name, size: file.size })
        setResult(null)
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const formatTime = (s) => {
        const m = Math.floor(s / 60)
        const sec = Math.floor(s % 60)
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    const trim = async () => {
        if (!video) return
        setProcessing(true); setProgress(0)
        const chunks = []
        const videoEl = videoRef.current
        videoEl.src = video.url
        videoEl.muted = true
        await new Promise(res => { videoEl.onloadedmetadata = res })

        const w = videoEl.videoWidth, h = videoEl.videoHeight
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

        videoEl.currentTime = start
        await new Promise(res => { videoEl.onseeked = res })
        recorder.start(100)
        await videoEl.play()

        const draw = () => {
            if (videoEl.currentTime >= end) {
                recorder.stop(); videoEl.pause(); return
            }
            ctx.drawImage(videoEl, 0, 0, w, h)
            const pct = ((videoEl.currentTime - start) / (end - start)) * 100
            setProgress(Math.round(pct))
            requestAnimationFrame(draw)
        }

        videoEl.onplay = () => requestAnimationFrame(draw)
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result.url
        a.download = video.name.replace(/\.[^.]+$/, '') + `-trimmed-${formatTime(start)}-${formatTime(end)}.webm`
        a.click()
    }

    const fmtSize = b => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    return (
        <>
            <SEO
                title="Video Trimmer Online — Cut & Trim Video Free"
                description="Trim and cut videos online for free. Set start and end points to extract any clip from your video. No upload, works in browser. Download trimmed video instantly."
                canonical="/video-trimmer"
            />
            <ToolLayout
                toolSlug="video-trimmer"
                title="Video Trimmer"
                description="Trim and cut video clips to the exact segment you need. 100% in-browser, no upload."
                breadcrumb="Video Trimmer"
            >
                {/* Upload */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${video ? 'border-violet-400 bg-violet-50' : ''}`}
                    >
                        {video ? (
                            <div className="flex flex-col items-center gap-2">
                                <i className="fas fa-cut text-4xl text-violet-400"></i>
                                <p className="font-semibold text-violet-700">{video.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(video.size)} · {formatTime(duration)} total</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-cut text-violet-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop a video to trim</p>
                                <p className="text-sm text-slate-400">MP4, WebM, MOV supported</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview + Trim Controls */}
                {video && duration > 0 && (
                    <>
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                            <p className="font-bold text-slate-800 mb-3"><i className="fas fa-film text-violet-500 mr-2"></i>Preview</p>
                            <video ref={previewRef} src={video.url} controls className="w-full rounded-xl max-h-72" />
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                            <h2 className="font-bold text-slate-800 mb-5"><i className="fas fa-cut text-violet-500 mr-2"></i>Set Trim Points</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                                        Start: <span className="text-violet-600 font-bold">{formatTime(start)}</span>
                                    </label>
                                    <input type="range" min="0" max={Math.max(0, end - 1)} step="0.5" value={start}
                                        onChange={e => { const v = +e.target.value; setStart(v); if (previewRef.current) previewRef.current.currentTime = v }}
                                        className="slider-range w-full" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                                        End: <span className="text-violet-600 font-bold">{formatTime(end)}</span>
                                    </label>
                                    <input type="range" min={start + 1} max={duration} step="0.5" value={end}
                                        onChange={e => { const v = +e.target.value; setEnd(v); if (previewRef.current) previewRef.current.currentTime = v }}
                                        className="slider-range w-full" />
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-violet-50 rounded-xl text-sm text-violet-700">
                                <i className="fas fa-info-circle mr-2"></i>
                                Trim duration: <strong>{formatTime(end - start)}</strong> ({formatTime(start)} → {formatTime(end)})
                            </div>
                        </div>
                    </>
                )}

                {video && !processing && !result && duration > 0 && (
                    <button onClick={trim} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-cut"></i> Trim Video
                    </button>
                )}

                {processing && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="font-semibold text-slate-700 mb-3"><i className="fas fa-spinner fa-spin text-violet-500 mr-2"></i>Trimming... {progress}%</p>
                        <div className="bg-slate-100 rounded-full h-3">
                            <div className="bg-violet-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Trim Complete!</h2>
                        <video src={result.url} controls className="w-full rounded-xl mb-4" />
                        <div className="flex gap-3">
                            <button onClick={download}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i> Download Trimmed Video
                            </button>
                            <button onClick={() => { setResult(null); setProgress(0) }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-200 transition-all">
                                <i className="fas fa-redo"></i> Trim Again
                            </button>
                        </div>
                    </div>
                )}

                <video ref={videoRef} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Free Online Video Trimmer</h2>
                    <p className="text-slate-600">Cut and trim your video clips to exactly the segment you need, directly in your browser with no file uploads. Use the start and end sliders to set precise trim points, preview the result, and download your trimmed clip as a WebM file.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Uses</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Remove unwanted beginning or end of a recording</li>
                        <li>Extract the best moment from a longer video</li>
                        <li>Create short clips for social media stories</li>
                        <li>Remove awkward silences from video recordings</li>
                    </ul>
                    <p className="text-slate-600 mt-4">After trimming, you can use our <a href="/video-compressor" className="text-blue-600 hover:underline">Video Compressor</a> to further reduce the file size, or <a href="/video-merger" className="text-blue-600 hover:underline">Video Merger</a> to combine multiple clips.</p>
                </div>
            </ToolLayout>
        </>
    )
}
