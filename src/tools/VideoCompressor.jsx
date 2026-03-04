import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function VideoCompressor() {
    const [video, setVideo] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [quality, setQuality] = useState(0.7)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('video/')) return
        const url = URL.createObjectURL(file)
        setVideo({ file, url, name: file.name, size: file.size })
        setResult(null)
        setProgress(0)
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const compress = async () => {
        if (!video) return
        setProcessing(true)
        setProgress(10)
        chunksRef.current = []

        const videoEl = videoRef.current
        videoEl.src = video.url
        videoEl.muted = true

        await new Promise(res => { videoEl.onloadedmetadata = res })

        const w = Math.round(videoEl.videoWidth * quality)
        const h = Math.round(videoEl.videoHeight * quality)
        const canvas = canvasRef.current
        canvas.width = w; canvas.height = h

        const ctx = canvas.getContext('2d')
        const stream = canvas.captureStream(24)

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : MediaRecorder.isTypeSupported('video/webm')
                ? 'video/webm'
                : 'video/mp4'

        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: Math.round(1500000 * quality * quality),
        })
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mimeType })
            const url = URL.createObjectURL(blob)
            const ext = mimeType.includes('webm') ? 'webm' : 'mp4'
            setResult({ url, size: blob.size, ext })
            setProcessing(false)
            setProgress(100)
        }

        recorder.start(100)
        videoEl.currentTime = 0
        videoEl.play()
        setProgress(20)

        const draw = () => {
            if (!videoEl.paused && !videoEl.ended) {
                ctx.drawImage(videoEl, 0, 0, w, h)
                const pct = (videoEl.currentTime / videoEl.duration) * 80 + 20
                setProgress(Math.round(pct))
                requestAnimationFrame(draw)
            }
        }

        videoEl.onplay = () => requestAnimationFrame(draw)
        videoEl.onended = () => recorder.stop()
    }

    const download = () => {
        if (!result) return
        const a = document.createElement('a')
        a.href = result.url
        a.download = video.name.replace(/\.[^.]+$/, '') + '-compressed.' + result.ext
        a.click()
    }

    const fmtSize = b => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    return (
        <>
            <SEO
                title="Video Compressor Online — Reduce Video File Size Free"
                description="Compress video files online for free. Reduce video size without heavy software. Works in browser, no upload to server, 100% private. Download compressed video instantly."
                canonical="/video-compressor"
            />
            <ToolLayout
                toolSlug="video-compressor"
                title="Video Compressor"
                description="Reduce video file size directly in your browser. No upload, 100% private."
                breadcrumb="Video Compressor"
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
                                <i className="fas fa-video text-4xl text-violet-400"></i>
                                <p className="font-semibold text-violet-700">{video.name}</p>
                                <p className="text-sm text-slate-500">Size: {fmtSize(video.size)}</p>
                                <p className="text-xs text-slate-400">Click to change</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-video text-violet-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop your video here</p>
                                <p className="text-sm text-slate-400">MP4, WebM, MOV, AVI supported</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quality */}
                {video && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-violet-500 mr-2"></i>Compression Level</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 w-20">Smallest</span>
                            <input type="range" min="0.3" max="1" step="0.1" value={quality} onChange={e => setQuality(+e.target.value)} className="flex-1 slider-range" />
                            <span className="text-sm text-slate-500 w-20 text-right">Best Quality</span>
                        </div>
                        <div className="flex justify-between mt-3">
                            <span className="text-xs text-slate-400">Resolution scale: {Math.round(quality * 100)}%</span>
                            <span className="text-xs text-slate-400">Bitrate: ~{Math.round(1500 * quality * quality)} kbps</span>
                        </div>
                    </div>
                )}

                {/* Compress Button */}
                {video && !processing && !result && (
                    <button onClick={compress} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-compress-arrows-alt"></i> Compress Video
                    </button>
                )}

                {/* Progress */}
                {processing && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="font-semibold text-slate-700 mb-3"><i className="fas fa-spinner fa-spin text-violet-500 mr-2"></i>Compressing... {progress}%</p>
                        <div className="bg-slate-100 rounded-full h-3">
                            <div className="bg-violet-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Processing in browser — this may take a moment for large videos</p>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Compression Complete!</h2>
                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-slate-500 mb-1">Original Size</p>
                                <p className="font-bold text-slate-800">{fmtSize(video.size)}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-slate-500 mb-1">Compressed Size</p>
                                <p className="font-bold text-green-700">{fmtSize(result.size)}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-slate-500 mb-1">Reduction</p>
                                <p className="font-bold text-blue-700">{Math.round((1 - result.size / video.size) * 100)}% smaller</p>
                            </div>
                        </div>
                        <video src={result.url} controls className="w-full rounded-xl mb-4" />
                        <div className="flex gap-3">
                            <button onClick={download}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i> Download Compressed Video
                            </button>
                            <button onClick={() => { setResult(null); setProgress(0) }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-200 transition-all">
                                <i className="fas fa-redo"></i> Compress Again
                            </button>
                        </div>
                    </div>
                )}

                <video ref={videoRef} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Free Online Video Compressor</h2>
                    <p className="text-slate-600">Reduce video file size directly in your browser using the Web Canvas API and MediaRecorder API. No file is ever uploaded to any server — your videos remain completely private. This tool works by re-encoding the video at a lower resolution and bitrate while maintaining good visual quality.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How It Works</h3>
                    <ol className="list-decimal list-inside text-slate-600 space-y-2">
                        <li>Upload your video file (MP4, WebM, MOV, AVI)</li>
                        <li>Select compression level (lower = smaller file, higher = better quality)</li>
                        <li>The video is re-rendered at reduced resolution using HTML5 Canvas</li>
                        <li>MediaRecorder captures the canvas output and saves as compressed WebM</li>
                        <li>Download the compressed file instantly</li>
                    </ol>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Tips for Best Results</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>For social media sharing: use 50-60% quality setting</li>
                        <li>For email attachments: use 30-40% quality setting</li>
                        <li>For archiving with good quality: use 70-80% quality setting</li>
                        <li>Large videos (over 100MB) may take several minutes to process</li>
                    </ul>
                    <p className="text-slate-600 mt-4">You can also use our <a href="/video-trimmer" className="text-blue-600 hover:underline">Video Trimmer</a> to cut the video first, then compress the shorter clip. Or extract just the audio with our <a href="/video-to-audio" className="text-blue-600 hover:underline">Video to Audio</a> tool.</p>
                </div>
            </ToolLayout>
        </>
    )
}
