import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function VideoToAudio() {
    const [video, setVideo] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [format, setFormat] = useState('webm')
    const videoRef = useRef(null)

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

    const extract = async () => {
        if (!video) return
        setProcessing(true)
        try {
            const videoEl = videoRef.current
            videoEl.src = video.url
            videoEl.muted = false
            await new Promise(res => { videoEl.onloadedmetadata = res })

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
            const source = audioCtx.createMediaElementSource(videoEl)
            const dest = audioCtx.createMediaStreamDestination()
            source.connect(dest)

            const mimeType = 'audio/webm;codecs=opus'
            const recorder = new MediaRecorder(dest.stream, { mimeType })
            const chunks = []

            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' })
                const url = URL.createObjectURL(blob)
                setResult({ url, size: blob.size })
                setProcessing(false)
                audioCtx.close()
            }

            recorder.start(100)
            videoEl.currentTime = 0
            await videoEl.play()
            videoEl.onended = () => recorder.stop()
        } catch (err) {
            setProcessing(false)
            alert('Audio extraction failed. Your browser may not support this feature. Please try Chrome or Edge.')
        }
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result.url
        a.download = video.name.replace(/\.[^.]+$/, '') + '-audio.webm'
        a.click()
    }

    const fmtSize = b => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    return (
        <>
            <SEO
                title="Video to Audio Extractor — Extract Audio from Video Free"
                description="Extract audio from any video file online. Convert MP4, WebM, MOV to audio format. Free, no upload, works in browser. Download audio track instantly."
                canonical="/video-to-audio"
            />
            <ToolLayout
                toolSlug="video-to-audio"
                title="Video to Audio"
                description="Extract the audio track from any video file. Works in your browser, no upload required."
                breadcrumb="Video to Audio"
            >
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
                                <i className="fas fa-music text-4xl text-violet-400"></i>
                                <p className="font-semibold text-violet-700">{video.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(video.size)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-music text-violet-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop a video file to extract its audio</p>
                                <p className="text-sm text-slate-400">MP4, WebM, MOV supported</p>
                            </div>
                        )}
                    </div>
                </div>

                {video && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Video Preview:</p>
                        <video src={video.url} controls className="w-full rounded-xl max-h-64" />
                    </div>
                )}

                {video && !processing && !result && (
                    <button onClick={extract} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-music"></i> Extract Audio Track
                    </button>
                )}

                {processing && (
                    <div className="bg-violet-50 rounded-2xl border border-violet-200 p-6 mb-6 flex items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-2xl text-violet-500"></i>
                        <div>
                            <p className="font-semibold text-violet-800">Extracting audio...</p>
                            <p className="text-sm text-violet-600">Video is playing in background to capture audio stream</p>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-check-circle text-green-500 mr-2"></i>Audio Extracted!</h2>
                        <p className="text-sm text-slate-500 mb-3">Extracted size: {fmtSize(result.size)}</p>
                        <audio src={result.url} controls className="w-full mb-4" />
                        <button onClick={download}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download Audio (.webm)
                        </button>
                    </div>
                )}

                <video ref={videoRef} className="hidden" />

                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>Browser Compatibility:</strong> This tool works best in Google Chrome and Microsoft Edge. Firefox may have limited audio capture support. The audio is extracted as WebM/Opus format.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Video to Audio Extractor</h2>
                    <p className="text-slate-600">Extract the audio track from any video file directly in your browser using the Web Audio API. This tool captures the audio stream from your video while it plays and saves it as a compressed audio file. No video data is sent to any server.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Common Use Cases</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Extract background music from a video recording</li>
                        <li>Save a speech or lecture audio from a video file</li>
                        <li>Extract podcast audio from a video interview</li>
                        <li>Get the soundtrack from a movie clip</li>
                    </ul>
                    <p className="text-slate-600 mt-4">You can also try our <a href="/video-trimmer" className="text-blue-600 hover:underline">Video Trimmer</a> to extract a specific segment, or use our <a href="/video-compressor" className="text-blue-600 hover:underline">Video Compressor</a> to reduce file size.</p>
                </div>
            </ToolLayout>
        </>
    )
}
