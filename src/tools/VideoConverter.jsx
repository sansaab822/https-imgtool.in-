import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function VideoConverter() {
    const [video, setVideo] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [quality, setQuality] = useState(0.8)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('video/')) return
        const url = URL.createObjectURL(file)
        setVideo({ file, url, name: file.name, size: file.size })
        setResult(null)
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const convert = async () => {
        if (!video) return
        setProcessing(true); setProgress(10)
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
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: Math.round(2500000 * quality) })
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            setResult({ url: URL.createObjectURL(blob), size: blob.size })
            setProcessing(false); setProgress(100)
        }
        recorder.start(100)
        videoEl.currentTime = 0
        await videoEl.play()
        const draw = () => {
            if (!videoEl.paused && !videoEl.ended) {
                ctx.drawImage(videoEl, 0, 0, w, h)
                setProgress(Math.round((videoEl.currentTime / videoEl.duration) * 90 + 10))
                requestAnimationFrame(draw)
            }
        }
        videoEl.onplay = () => requestAnimationFrame(draw)
        videoEl.onended = () => recorder.stop()
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result.url
        a.download = video.name.replace(/\.[^.]+$/, '') + '-converted.webm'
        a.click()
    }

    const fmtSize = b => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    return (
        <>
            <SEO title="Video Converter Online — Convert Video to WebM Free" description="Convert video files to WebM format online. No upload, browser-based. Convert MP4, MOV, AVI to WebM free." canonical="/video-converter" />
            <ToolLayout toolSlug="video-converter" title="Video Converter" description="Convert videos to WebM format with quality control. Browser-based, no upload needed." breadcrumb="Video Converter">
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>Note:</strong> Browser conversion outputs <strong>WebM (VP9)</strong> format. For MP4/MOV output, desktop software is recommended.
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${video ? 'border-violet-400 bg-violet-50' : ''}`}>
                        {video ? (
                            <div className="flex flex-col items-center gap-2">
                                <i className="fas fa-exchange-alt text-4xl text-violet-400"></i>
                                <p className="font-semibold text-violet-700">{video.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(video.size)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-exchange-alt text-violet-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop video to convert (MP4, MOV, AVI → WebM)</p>
                            </div>
                        )}
                    </div>
                </div>
                {video && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Quality: {Math.round(quality * 100)}%</label>
                        <input type="range" min="0.3" max="1" step="0.1" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                    </div>
                )}
                {video && !processing && !result && (
                    <button onClick={convert} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-exchange-alt"></i> Convert to WebM
                    </button>
                )}
                {processing && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="font-semibold text-slate-700 mb-3"><i className="fas fa-spinner fa-spin text-violet-500 mr-2"></i>Converting... {progress}%</p>
                        <div className="bg-slate-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
                    </div>
                )}
                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Done! Output: {fmtSize(result.size)}</h2>
                        <video src={result.url} controls className="w-full rounded-xl mb-4" />
                        <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download WebM
                        </button>
                    </div>
                )}
                <video ref={videoRef} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Online Video Converter</h2>
                    <p className="text-slate-600">Convert video files to WebM format in your browser using HTML5 Canvas and MediaRecorder API. WebM with VP9 codec offers excellent quality-to-size ratio and is supported by all modern browsers. No file is uploaded — everything stays on your device.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why WebM?</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Smaller file size than MP4 at equivalent quality</li>
                        <li>Natively supported in Chrome, Firefox, and Edge</li>
                        <li>Open format with no licensing fees</li>
                        <li>Ideal for embedding in websites and apps</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Also try our <a href="/video-compressor" className="text-blue-600 hover:underline">Video Compressor</a> to reduce file size, or <a href="/video-trimmer" className="text-blue-600 hover:underline">Video Trimmer</a> to cut clips.</p>
                </div>
            </ToolLayout>
        </>
    )
}
