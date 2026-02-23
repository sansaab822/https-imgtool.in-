import { useState, useRef, useCallback } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const ASPECT_PRESETS = [
    { label: 'Free', value: undefined, icon: '✂️' },
    { label: '1:1', value: 1, icon: '⬜' },
    { label: '4:3', value: 4 / 3, icon: '📺' },
    { label: '16:9', value: 16 / 9, icon: '🖥️' },
    { label: '3:2', value: 3 / 2, icon: '📷' },
    { label: '9:16', value: 9 / 16, icon: '📱' },
    { label: '3:4', value: 3 / 4, icon: '📋' },
    { label: '5:4', value: 5 / 4, icon: '🖼️' },
    { label: '2:1', value: 2, icon: '🌐' },
]

const OUTPUT_FORMATS = [
    { id: 'png', label: 'PNG', mime: 'image/png' },
    { id: 'jpg', label: 'JPG', mime: 'image/jpeg' },
    { id: 'webp', label: 'WebP', mime: 'image/webp' },
]

export default function CropImage() {
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState(null)
    const [aspect, setAspect] = useState(undefined)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [flipH, setFlipH] = useState(false)
    const [flipV, setFlipV] = useState(false)
    const [outputFmt, setOutputFmt] = useState('png')
    const [quality, setQuality] = useState(92)
    const [showGrid, setShowGrid] = useState(true)
    const imgRef = useRef()
    const inputRef = useRef()

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        setImage({ url, file })
        setCrop(undefined)
        setResult(null)
        setRotation(0)
        setFlipH(false)
        setFlipV(false)
    }, [])

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget
        const c = centerCrop(makeAspectCrop({ unit: '%', width: 80 }, aspect || width / height, width, height), width, height)
        setCrop(c)
    }

    const handleCrop = () => {
        if (!completedCrop || !imgRef.current) return
        const img = imgRef.current
        const canvas = document.createElement('canvas')
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height
        const cropW = completedCrop.width * scaleX
        const cropH = completedCrop.height * scaleY

        // Handle rotation
        const isRotated = rotation === 90 || rotation === 270
        canvas.width = isRotated ? cropH : cropW
        canvas.height = isRotated ? cropW : cropH
        const ctx = canvas.getContext('2d')

        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        if (flipH) ctx.scale(-1, 1)
        if (flipV) ctx.scale(1, -1)
        ctx.translate(-(isRotated ? cropH : cropW) / 2, -(isRotated ? cropW : cropH) / 2)

        const fmt = OUTPUT_FORMATS.find(f => f.id === outputFmt)
        if (outputFmt === 'jpg') {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, cropW, cropH)
        }
        ctx.drawImage(img,
            completedCrop.x * scaleX, completedCrop.y * scaleY, cropW, cropH,
            0, 0, cropW, cropH
        )
        ctx.restore()

        const q = outputFmt === 'png' ? undefined : quality / 100
        canvas.toBlob(blob => {
            const baseName = image.file.name.replace(/\.[^.]+$/, '')
            setResult({
                url: URL.createObjectURL(blob),
                name: `${baseName}_cropped.${outputFmt}`,
                w: canvas.width,
                h: canvas.height,
                size: blob.size,
            })
        }, fmt.mime, q)
    }

    const imgStyle = {
        maxHeight: '55vh',
        display: 'block',
        maxWidth: '100%',
        transform: `${flipH ? 'scaleX(-1)' : ''} ${flipV ? 'scaleY(-1)' : ''} rotate(${rotation}deg)`,
    }

    const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

    return (
        <>
            <SEO title="Crop Image Online Free - Custom Aspect Ratios" description="Crop images with custom aspect ratios. Supports 1:1, 4:3, 16:9, free crop, rotate, flip, and more. Free & private." canonical="/crop-image" />
            <ToolLayout toolSlug="crop-image" title="Crop Image" description="Crop images with precision using custom sizes or popular aspect ratio presets. Rotate, flip, and choose output format." breadcrumb="Crop Image">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* ── Main Area ── */}
                    <div className="lg:col-span-3 space-y-4">
                        {!image ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-crop text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop image here or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">Drag to crop after uploading · All formats supported</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                {/* Transform toolbar */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-slate-500 mr-1">Transform:</span>
                                    <button onClick={() => setRotation((rotation + 90) % 360)}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 text-xs font-medium rounded-lg transition-all">
                                        <i className="fas fa-rotate-right mr-1"></i>Rotate 90°
                                    </button>
                                    <button onClick={() => setRotation((rotation + 180) % 360)}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 text-xs font-medium rounded-lg transition-all">
                                        <i className="fas fa-rotate mr-1"></i>180°
                                    </button>
                                    <button onClick={() => setFlipH(!flipH)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${flipH ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'}`}>
                                        <i className="fas fa-arrows-left-right mr-1"></i>Flip H
                                    </button>
                                    <button onClick={() => setFlipV(!flipV)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${flipV ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'}`}>
                                        <i className="fas fa-arrows-up-down mr-1"></i>Flip V
                                    </button>
                                    <button onClick={() => { setRotation(0); setFlipH(false); setFlipV(false) }}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-medium rounded-lg transition-all">
                                        <i className="fas fa-undo mr-1"></i>Reset
                                    </button>
                                </div>

                                {/* Crop Area */}
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, pct) => setCrop(pct)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    minWidth={10}
                                    minHeight={10}
                                    keepSelection
                                    ruleOfThirds={showGrid}
                                >
                                    <img ref={imgRef} src={image.url} alt="Crop" onLoad={onImageLoad} style={imgStyle} />
                                </ReactCrop>

                                {/* Crop dimensions info */}
                                {completedCrop && (
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span><i className="fas fa-crop text-pink-400 mr-1"></i>Crop: {Math.round(completedCrop.width)}×{Math.round(completedCrop.height)}px</span>
                                        <span><i className="fas fa-arrows-rotate text-pink-400 mr-1"></i>Rotation: {rotation}°</span>
                                    </div>
                                )}

                                {/* Result */}
                                {result && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-circle-check text-green-500"></i>
                                            <span className="text-sm font-bold text-green-800">Cropped! {result.w}×{result.h}px</span>
                                            <span className="text-xs text-green-600">({formatSize(result.size)})</span>
                                        </div>
                                        <a href={result.url} download={result.name} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                            <i className="fas fa-download"></i> Download
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Controls ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-crop text-pink-500"></i> Crop Settings
                            </h3>

                            {/* Aspect Ratio */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Aspect Ratio</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {ASPECT_PRESETS.map(p => (
                                        <button key={p.label} onClick={() => setAspect(p.value)}
                                            className={`py-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${aspect === p.value ? 'bg-pink-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-pink-50 hover:text-pink-600'}`}>
                                            <span className="text-sm">{p.icon}</span>
                                            <span>{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500" />
                                <span className="text-xs font-medium text-slate-600">Rule of Thirds grid</span>
                            </label>

                            {/* Output Format */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Output Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {OUTPUT_FORMATS.map(f => (
                                        <button key={f.id} onClick={() => setOutputFmt(f.id)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${outputFmt === f.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            {outputFmt !== 'png' && (
                                <div>
                                    <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                        <span>Quality</span><span className="font-bold text-pink-600">{quality}%</span>
                                    </label>
                                    <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="slider-range w-full" />
                                </div>
                            )}

                            {/* Crop Button */}
                            <button onClick={handleCrop} disabled={!completedCrop}
                                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2">
                                <i className="fas fa-crop"></i> Crop & Save
                            </button>

                            <button onClick={() => { setImage(null); setResult(null) }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                Upload New Image
                            </button>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
