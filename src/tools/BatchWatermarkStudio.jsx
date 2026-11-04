import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import JSZip from 'jszip'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'
import Button from '../components/ui/Button'
import IconButton from '../components/ui/IconButton'
import UploadDropzone from '../components/ui/UploadDropzone'
import Slider from '../components/ui/Slider'
import Tabs from '../components/ui/Tabs'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'

// ── Text Watermark Presets ─────────────────────────────────────────────────────
const TEXT_PRESETS = [
    { label: 'Copyright ©', text: `© ${new Date().getFullYear()} All Rights Reserved` },
    { label: 'SAMPLE', text: 'SAMPLE' },
    { label: 'CONFIDENTIAL', text: 'CONFIDENTIAL' },
    { label: 'DRAFT', text: 'DRAFT' },
    { label: 'PROOF', text: 'CLIENT PROOF — DO NOT REPRODUCE' },
]

// ── 9-Point Position Grid ──────────────────────────────────────────────────────
const POSITIONS = [
    { id: 'top-left', label: 'Top Left', icon: 'fa-arrow-up-left' },
    { id: 'top-center', label: 'Top Center', icon: 'fa-arrow-up' },
    { id: 'top-right', label: 'Top Right', icon: 'fa-arrow-up-right' },
    { id: 'center-left', label: 'Center Left', icon: 'fa-arrow-left' },
    { id: 'center', label: 'Center', icon: 'fa-crosshairs' },
    { id: 'center-right', label: 'Center Right', icon: 'fa-arrow-right' },
    { id: 'bottom-left', label: 'Bottom Left', icon: 'fa-arrow-down-left' },
    { id: 'bottom-center', label: 'Bottom Center', icon: 'fa-arrow-down' },
    { id: 'bottom-right', label: 'Bottom Right', icon: 'fa-arrow-down-right' },
]

// ── Fonts ──────────────────────────────────────────────────────────────────────
const FONTS = [
    { id: 'Inter, sans-serif', label: 'Inter (Modern Sans)' },
    { id: 'Arial, sans-serif', label: 'Arial (Standard)' },
    { id: 'Impact, sans-serif', label: 'Impact (Bold Headline)' },
    { id: 'Georgia, serif', label: 'Georgia (Classic Serif)' },
    { id: 'Courier New, monospace', label: 'Courier New (Monospace)' },
]

const DEFAULT_SETTINGS = {
    type: 'text', // 'text' | 'logo'
    text: `© ${new Date().getFullYear()} My Photography`,
    fontFamily: 'Inter, sans-serif',
    fontSizePercent: 5, // 2% to 20% of image height
    fontWeight: 'bold',
    color: '#ffffff',
    opacity: 0.75,
    rotation: 0, // -180 to 180 deg
    hasStroke: true,
    strokeColor: '#000000',
    strokeWidthPercent: 0.4,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 6,
    position: 'bottom-right',
    marginPercent: 4, // margin from edge in %
    // Repeated / Diagonal Pattern
    isRepeated: false,
    repeatSpacing: 180, // px between repeats
    repeatAngle: -35, // deg
    // Logo settings
    logoFile: null,
    logoImg: null,
    logoScalePercent: 18, // 5% to 50% of image width
    logoOpacity: 0.8,
    logoRotation: 0,
    // Export options
    outputFormat: 'original', // 'original' | 'image/jpeg' | 'image/png' | 'image/webp'
    jpegQuality: 0.92,
}

export default function BatchWatermarkStudio() {
    // ── Multi-image state ──────────────────────────────────────────────────────
    const [files, setFiles] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS)
    const [customOverrides, setCustomOverrides] = useState({}) // id -> overrides

    // ── Preview Canvas State ───────────────────────────────────────────────────
    const canvasRef = useRef(null)
    const [zoomLevel, setZoomLevel] = useState(1) // 1 = fit, 0.5, 1.5, 2
    const [showOriginal, setShowOriginal] = useState(false)
    const [isDraggingWatermark, setIsDraggingWatermark] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    // ── Processing State ───────────────────────────────────────────────────────
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [processedBlobs, setProcessedBlobs] = useState({}) // id -> { blob, url, size }

    // Currently selected file
    const selectedFile = useMemo(() => {
        return files.find(f => f.id === selectedId) || files[0] || null
    }, [files, selectedId])

    // Effective settings for selected file (global + per-image override)
    const currentSettings = useMemo(() => {
        if (!selectedFile) return globalSettings
        const override = customOverrides[selectedFile.id]
        return override ? { ...globalSettings, ...override } : globalSettings
    }, [globalSettings, customOverrides, selectedFile])

    // ── Handle Multiple File Additions ─────────────────────────────────────────
    const handleFilesAdded = useCallback((newFiles) => {
        const imageFiles = newFiles.filter(f => f.type.startsWith('image/'))
        if (imageFiles.length === 0) return

        const queueEntries = imageFiles.map((file, idx) => {
            const id = `img-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`
            const previewUrl = URL.createObjectURL(file)
            return {
                id,
                file,
                name: file.name,
                originalSize: file.size,
                type: file.type,
                previewUrl,
                width: 0,
                height: 0,
                status: 'ready' // 'ready' | 'processing' | 'done' | 'error'
            }
        })

        // Measure image dimensions
        queueEntries.forEach((entry) => {
            const img = new Image()
            img.onload = () => {
                setFiles(prev => prev.map(item => item.id === entry.id ? { ...item, width: img.naturalWidth, height: img.naturalHeight } : item))
            }
            img.src = entry.previewUrl
        })

        setFiles(prev => [...prev, ...queueEntries])
        if (!selectedId && queueEntries.length > 0) {
            setSelectedId(queueEntries[0].id)
        }
    }, [selectedId])

    // Cleanup object URLs on unmount or removal
    useEffect(() => {
        return () => {
            files.forEach(f => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
            })
            Object.values(processedBlobs).forEach(b => {
                if (b.url) URL.revokeObjectURL(b.url)
            })
        }
    }, [])

    const handleRemoveFile = (id) => {
        const target = files.find(f => f.id === id)
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
        if (processedBlobs[id]?.url) URL.revokeObjectURL(processedBlobs[id].url)

        setFiles(prev => prev.filter(f => f.id !== id))
        setProcessedBlobs(prev => {
            const copy = { ...prev }
            delete copy[id]
            return copy
        })
        setCustomOverrides(prev => {
            const copy = { ...prev }
            delete copy[id]
            return copy
        })

        if (selectedId === id) {
            const remaining = files.filter(f => f.id !== id)
            setSelectedId(remaining[0]?.id || null)
        }
    }

    const handleClearAll = () => {
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        Object.values(processedBlobs).forEach(b => URL.revokeObjectURL(b.url))
        setFiles([])
        setSelectedId(null)
        setProcessedBlobs({})
        setCustomOverrides({})
    }

    // ── Logo Upload Handler ────────────────────────────────────────────────────
    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const logoUrl = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            updateSetting('logoFile', file)
            updateSetting('logoImg', img)
        }
        img.src = logoUrl
    }

    // ── Setting Updaters ───────────────────────────────────────────────────────
    const updateSetting = (key, val) => {
        setGlobalSettings(prev => ({ ...prev, [key]: val }))
    }

    const updateCurrentOverride = (key, val) => {
        if (!selectedFile) return
        setCustomOverrides(prev => {
            const existing = prev[selectedFile.id] || {}
            return {
                ...prev,
                [selectedFile.id]: { ...existing, [key]: val }
            }
        })
    }

    // ── Watermark Rendering Core Function ──────────────────────────────────────
    const renderWatermarkOnContext = (ctx, width, height, settings, isOriginalOnly = false) => {
        if (isOriginalOnly) return

        ctx.save()

        // 1. REPEATED DIAGONAL GRID WATERMARK
        if (settings.isRepeated) {
            ctx.globalAlpha = settings.opacity * 0.8
            ctx.fillStyle = settings.color
            const fontSize = Math.max(14, (height * (settings.fontSizePercent || 4)) / 100)
            ctx.font = `${settings.fontWeight || 'bold'} ${fontSize}px ${settings.fontFamily}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            const angle = (settings.repeatAngle * Math.PI) / 180
            const spacing = Math.max(120, settings.repeatSpacing * (width / 1200))

            // Expand bounds for rotation
            const diagonal = Math.hypot(width, height)
            ctx.translate(width / 2, height / 2)
            ctx.rotate(angle)

            for (let y = -diagonal; y < diagonal; y += spacing) {
                for (let x = -diagonal; x < diagonal; x += spacing * 1.6) {
                    if (settings.hasShadow) {
                        ctx.shadowColor = settings.shadowColor
                        ctx.shadowBlur = settings.shadowBlur
                    }
                    if (settings.hasStroke) {
                        ctx.strokeStyle = settings.strokeColor
                        ctx.lineWidth = Math.max(1, fontSize * 0.08)
                        ctx.strokeText(settings.text, x, y)
                    }
                    ctx.fillText(settings.text, x, y)
                }
            }
            ctx.restore()
            return
        }

        // 2. LOGO WATERMARK
        if (settings.type === 'logo' && settings.logoImg) {
            const logo = settings.logoImg
            const aspect = logo.naturalWidth / logo.naturalHeight
            const logoW = (width * settings.logoScalePercent) / 100
            const logoH = logoW / aspect

            const marginX = (width * settings.marginPercent) / 100
            const marginY = (height * settings.marginPercent) / 100

            let posX = marginX
            let posY = marginY

            switch (settings.position) {
                case 'top-left': posX = marginX; posY = marginY; break
                case 'top-center': posX = (width - logoW) / 2; posY = marginY; break
                case 'top-right': posX = width - logoW - marginX; posY = marginY; break
                case 'center-left': posX = marginX; posY = (height - logoH) / 2; break
                case 'center': posX = (width - logoW) / 2; posY = (height - logoH) / 2; break
                case 'center-right': posX = width - logoW - marginX; posY = (height - logoH) / 2; break
                case 'bottom-left': posX = marginX; posY = height - logoH - marginY; break
                case 'bottom-center': posX = (width - logoW) / 2; posY = height - logoH - marginY; break
                case 'bottom-right': default: posX = width - logoW - marginX; posY = height - logoH - marginY; break
            }

            // Apply manual drag offset if any
            posX += (settings.dragOffsetX || 0) * (width / 800)
            posY += (settings.dragOffsetY || 0) * (height / 800)

            ctx.globalAlpha = settings.logoOpacity
            ctx.translate(posX + logoW / 2, posY + logoH / 2)
            if (settings.logoRotation) {
                ctx.rotate((settings.logoRotation * Math.PI) / 180)
            }
            ctx.drawImage(logo, -logoW / 2, -logoH / 2, logoW, logoH)
            ctx.restore()
            return
        }

        // 3. SINGLE TEXT WATERMARK
        const fontSize = Math.max(12, (height * settings.fontSizePercent) / 100)
        ctx.font = `${settings.fontWeight || 'bold'} ${fontSize}px ${settings.fontFamily}`
        const textMetrics = ctx.measureText(settings.text)
        const textW = textMetrics.width
        const textH = fontSize

        const marginX = (width * settings.marginPercent) / 100
        const marginY = (height * settings.marginPercent) / 100

        let anchorX = marginX
        let anchorY = marginY + textH

        switch (settings.position) {
            case 'top-left':
                ctx.textAlign = 'left'
                anchorX = marginX
                anchorY = marginY + textH
                break
            case 'top-center':
                ctx.textAlign = 'center'
                anchorX = width / 2
                anchorY = marginY + textH
                break
            case 'top-right':
                ctx.textAlign = 'right'
                anchorX = width - marginX
                anchorY = marginY + textH
                break
            case 'center-left':
                ctx.textAlign = 'left'
                anchorX = marginX
                anchorY = height / 2 + textH / 2
                break
            case 'center':
                ctx.textAlign = 'center'
                anchorX = width / 2
                anchorY = height / 2 + textH / 2
                break
            case 'center-right':
                ctx.textAlign = 'right'
                anchorX = width - marginX
                anchorY = height / 2 + textH / 2
                break
            case 'bottom-left':
                ctx.textAlign = 'left'
                anchorX = marginX
                anchorY = height - marginY
                break
            case 'bottom-center':
                ctx.textAlign = 'center'
                anchorX = width / 2
                anchorY = height - marginY
                break
            case 'bottom-right':
            default:
                ctx.textAlign = 'right'
                anchorX = width - marginX
                anchorY = height - marginY
                break
        }

        // Apply manual drag offset if any
        anchorX += (settings.dragOffsetX || 0) * (width / 800)
        anchorY += (settings.dragOffsetY || 0) * (height / 800)

        ctx.globalAlpha = settings.opacity

        // Rotation around anchor
        if (settings.rotation) {
            ctx.translate(anchorX, anchorY)
            ctx.rotate((settings.rotation * Math.PI) / 180)
            anchorX = 0
            anchorY = 0
        }

        // Shadow
        if (settings.hasShadow) {
            ctx.shadowColor = settings.shadowColor
            ctx.shadowBlur = settings.shadowBlur
            ctx.shadowOffsetX = 2
            ctx.shadowOffsetY = 2
        }

        // Stroke
        if (settings.hasStroke) {
            ctx.strokeStyle = settings.strokeColor
            ctx.lineWidth = Math.max(1, fontSize * (settings.strokeWidthPercent / 100) * 10)
            ctx.strokeText(settings.text, anchorX, anchorY)
        }

        // Main text fill
        ctx.fillStyle = settings.color
        ctx.fillText(settings.text, anchorX, anchorY)

        ctx.restore()
    }

    // ── Live Canvas Preview Renderer ───────────────────────────────────────────
    useEffect(() => {
        if (!selectedFile || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // Render at full crisp dimensions
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            if (!showOriginal) {
                renderWatermarkOnContext(ctx, canvas.width, canvas.height, currentSettings)
            }
        }
        img.src = selectedFile.previewUrl
    }, [selectedFile, currentSettings, showOriginal])

    // ── Batch Processing Execution ─────────────────────────────────────────────
    const handleProcessAll = async () => {
        if (files.length === 0 || isProcessing) return

        setIsProcessing(true)
        setProgress(0)

        const results = {}
        const offCanvas = document.createElement('canvas')
        const offCtx = offCanvas.getContext('2d')

        for (let i = 0; i < files.length; i++) {
            const entry = files[i]
            const settings = customOverrides[entry.id]
                ? { ...globalSettings, ...customOverrides[entry.id] }
                : globalSettings

            try {
                // Load source image
                const img = await new Promise((resolve, reject) => {
                    const temp = new Image()
                    temp.onload = () => resolve(temp)
                    temp.onerror = reject
                    temp.src = entry.previewUrl
                })

                offCanvas.width = img.naturalWidth
                offCanvas.height = img.naturalHeight
                offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height)
                offCtx.drawImage(img, 0, 0)

                // Render watermark
                renderWatermarkOnContext(offCtx, offCanvas.width, offCanvas.height, settings)

                // Determine output MIME type
                let mime = entry.type || 'image/jpeg'
                if (settings.outputFormat !== 'original') {
                    mime = settings.outputFormat
                }

                // Export blob
                const blob = await new Promise((resolve) => {
                    offCanvas.toBlob(
                        (b) => resolve(b),
                        mime,
                        mime === 'image/jpeg' ? settings.jpegQuality : undefined
                    )
                })

                const url = URL.createObjectURL(blob)
                results[entry.id] = {
                    blob,
                    url,
                    size: blob.size,
                    mime
                }
            } catch (err) {
                console.error('Error processing', entry.name, err)
            }

            setProgress(Math.round(((i + 1) / files.length) * 100))
        }

        setProcessedBlobs(results)
        setIsProcessing(false)
    }

    // ── Individual File Download ───────────────────────────────────────────────
    const handleDownloadSingle = (entry) => {
        const processed = processedBlobs[entry.id]
        if (!processed) return

        const ext = processed.mime === 'image/png' ? 'png' : processed.mime === 'image/webp' ? 'webp' : 'jpg'
        const baseName = entry.name.replace(/\.[^/.]+$/, '')
        const downloadName = `${baseName}_watermarked.${ext}`

        const a = document.createElement('a')
        a.href = processed.url
        a.download = downloadName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    // ── Batch ZIP Download ─────────────────────────────────────────────────────
    const handleDownloadZip = async () => {
        const processedIds = Object.keys(processedBlobs)
        if (processedIds.length === 0) return

        const zip = new JSZip()
        const folder = zip.folder('watermarked_photos')

        for (const entry of files) {
            const processed = processedBlobs[entry.id]
            if (processed) {
                const ext = processed.mime === 'image/png' ? 'png' : processed.mime === 'image/webp' ? 'webp' : 'jpg'
                const baseName = entry.name.replace(/\.[^/.]+$/, '')
                folder.file(`${baseName}_watermarked.${ext}`, processed.blob)
            }
        }

        const content = await zip.generateAsync({ type: 'blob' })
        const zipUrl = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = zipUrl
        a.download = `watermarked_photos_${Date.now()}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(zipUrl)
    }

    // ── Interactive Drag to Reposition on Canvas ───────────────────────────────
    const handleMouseDown = (e) => {
        setIsDraggingWatermark(true)
        setDragOffset({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = (e) => {
        if (!isDraggingWatermark || !selectedFile) return
        const dx = e.clientX - dragOffset.x
        const dy = e.clientY - dragOffset.y
        setDragOffset({ x: e.clientX, y: e.clientY })

        const prevX = currentSettings.dragOffsetX || 0
        const prevY = currentSettings.dragOffsetY || 0
        updateCurrentOverride('dragOffsetX', prevX + dx)
        updateCurrentOverride('dragOffsetY', prevY + dy)
    }

    const handleMouseUp = () => {
        setIsDraggingWatermark(false)
    }

    return (
        <ToolLayout
            toolSlug="batch-watermark-images"
            title="Batch Image Watermark Studio"
            description="Protect photography portfolios, client proofs, and marketplace products with custom text or transparent logo watermarks across multiple images simultaneously. 100% in-browser RAM."
            breadcrumb="Batch Watermark Studio"
        >
            <SEO
                title="Batch Image Watermark Studio | Add Text & Logo Watermarks Free"
                description="Apply customizable text, copyright presets, or PNG logo watermarks across multiple photos in batch. Diagonal repeat protection, 100% client-side privacy, zero cloud uploads."
                keywords="batch watermark images online, watermark multiple photos free, add copyright logo to photos, diagonal repeat watermark, client side watermark"
                canonical="/batch-watermark-images"
            />

            {/* ── TOP WORKSTATION ACTION BAR ───────────────────────────────── */}
            <div className="bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Queue:
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-workstation-800 px-2.5 py-1 rounded-lg">
                        {files.length} Photo{files.length !== 1 ? 's' : ''} Loaded
                    </span>
                    {files.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 font-medium ml-2"
                        >
                            <i className="fas fa-trash-can text-[11px]"></i> Clear All
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {files.length > 0 && (
                        <>
                            <Button
                                variant="primary"
                                icon="fa-bolt"
                                onClick={handleProcessAll}
                                loading={isProcessing}
                                disabled={isProcessing || files.length === 0}
                            >
                                Process All ({files.length})
                            </Button>

                            {Object.keys(processedBlobs).length > 0 && (
                                <Button
                                    variant="success"
                                    icon="fa-file-zipper"
                                    onClick={handleDownloadZip}
                                >
                                    Download All ZIP ({Object.keys(processedBlobs).length})
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── EMPTY STATE / DROPZONE ───────────────────────────────────── */}
            {files.length === 0 && (
                <div className="max-w-2xl mx-auto my-8">
                    <UploadDropzone
                        onFilesSelected={handleFilesAdded}
                        title="Drop multiple photos to watermark"
                        subtitle="Supports batch JPG, PNG, and WebP files. No file count limits."
                        formats={['JPG', 'PNG', 'WEBP']}
                        maxFilesText="100% In-Browser Execution · Zero Server Uploads"
                    />
                </div>
            )}

            {/* ── ACTIVE WORKSPACE (SPLIT LAYOUT) ──────────────────────────── */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ── LEFT CONTROLS PANEL (5 COLUMNS) ─────────────────────── */}
                    <div className="lg:col-span-5 space-y-5">
                        
                        {/* 1. Thumbnail Queue Drawer */}
                        <div className="bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Photo Queue ({files.length})
                                </label>
                                <label
                                    className="cursor-pointer text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <i className="fas fa-plus text-[10px]"></i> Add More
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        multiple
                                        onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Horizontal scroll queue */}
                            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                                {files.map((entry) => {
                                    const isSelected = entry.id === selectedId
                                    const isProcessed = Boolean(processedBlobs[entry.id])
                                    return (
                                        <div
                                            key={entry.id}
                                            onClick={() => setSelectedId(entry.id)}
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 group ${
                                                isSelected
                                                    ? 'border-blue-600 shadow-md scale-105 ring-2 ring-blue-500/30'
                                                    : 'border-slate-200 dark:border-workstation-750 hover:border-slate-400 opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={entry.previewUrl}
                                                alt={entry.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {isProcessed && (
                                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveFile(entry.id)
                                                }}
                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="Remove photo"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Selected Photo Info */}
                            {selectedFile && (
                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-workstation-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                                    <span className="truncate max-w-[200px]" title={selectedFile.name}>
                                        {selectedFile.name}
                                    </span>
                                    <span>
                                        {selectedFile.width}×{selectedFile.height}px · {(selectedFile.originalSize / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 2. Watermark Mode Tabs (Text vs Logo) */}
                        <div className="bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-5 shadow-sm space-y-5">
                            <Tabs
                                tabs={[
                                    { id: 'text', label: 'Text Watermark', icon: 'fa-font' },
                                    { id: 'logo', label: 'PNG Logo Stamp', icon: 'fa-image' },
                                ]}
                                activeTab={currentSettings.type}
                                onChange={(tab) => updateSetting('type', tab)}
                            />

                            {/* ── TEXT CONTROLS ── */}
                            {currentSettings.type === 'text' && (
                                <div className="space-y-4">
                                    {/* Presets */}
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Quick Presets
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {TEXT_PRESETS.map((p) => (
                                                <button
                                                    key={p.label}
                                                    type="button"
                                                    onClick={() => updateSetting('text', p.text)}
                                                    className="px-2 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-workstation-800 dark:hover:bg-workstation-750 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Text Input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Watermark Text
                                        </label>
                                        <input
                                            type="text"
                                            value={currentSettings.text}
                                            onChange={(e) => updateSetting('text', e.target.value)}
                                            className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200 dark:border-workstation-750 bg-white dark:bg-workstation-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            placeholder="Enter watermark text..."
                                        />
                                    </div>

                                    {/* Typography & Color Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Font Style
                                            </label>
                                            <select
                                                value={currentSettings.fontFamily}
                                                onChange={(e) => updateSetting('fontFamily', e.target.value)}
                                                className="w-full h-9 px-2 text-xs rounded-xl border border-slate-200 dark:border-workstation-750 bg-white dark:bg-workstation-950 text-slate-800 dark:text-slate-200"
                                            >
                                                {FONTS.map(f => (
                                                    <option key={f.id} value={f.id}>{f.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Font Color
                                            </label>
                                            <div className="flex items-center gap-2 h-9 px-2 rounded-xl border border-slate-200 dark:border-workstation-750 bg-white dark:bg-workstation-950">
                                                <input
                                                    type="color"
                                                    value={currentSettings.color}
                                                    onChange={(e) => updateSetting('color', e.target.value)}
                                                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                                                />
                                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                                    {currentSettings.color}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Size & Opacity Sliders */}
                                    <Slider
                                        label="Font Size Relative to Photo"
                                        value={currentSettings.fontSizePercent}
                                        onChange={(v) => updateSetting('fontSizePercent', v)}
                                        min={2}
                                        max={20}
                                        unit="%"
                                    />

                                    <Slider
                                        label="Watermark Opacity"
                                        value={Math.round(currentSettings.opacity * 100)}
                                        onChange={(v) => updateSetting('opacity', v / 100)}
                                        min={5}
                                        max={100}
                                        unit="%"
                                    />

                                    {/* Outline & Shadow Toggles */}
                                    <div className="flex items-center gap-4 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={currentSettings.hasStroke}
                                                onChange={(e) => updateSetting('hasStroke', e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>Text Outline (Stroke)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={currentSettings.hasShadow}
                                                onChange={(e) => updateSetting('hasShadow', e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>Drop Shadow</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* ── LOGO CONTROLS ── */}
                            {currentSettings.type === 'logo' && (
                                <div className="space-y-4">
                                    <div className="border border-dashed border-slate-300 dark:border-workstation-750 rounded-xl p-4 text-center">
                                        {currentSettings.logoImg ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-workstation-850 p-1 flex items-center justify-center">
                                                        <img
                                                            src={currentSettings.logoImg.src}
                                                            alt="Logo preview"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="text-left text-xs">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">
                                                            {currentSettings.logoFile?.name || 'Custom Logo'}
                                                        </span>
                                                        <span className="text-slate-400 font-mono text-[10px]">
                                                            {currentSettings.logoImg.naturalWidth}×{currentSettings.logoImg.naturalHeight}px
                                                        </span>
                                                    </div>
                                                </div>
                                                <label className="btn-secondary text-xs cursor-pointer py-1.5 px-3">
                                                    Replace
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/svg+xml, image/webp"
                                                        onChange={handleLogoUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center">
                                                <i className="fas fa-arrow-up-from-bracket text-blue-500 text-lg mb-2"></i>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                    Upload Transparent PNG Logo
                                                </span>
                                                <span className="text-[11px] text-slate-400 mt-0.5">
                                                    Square or horizontal vector marks work best
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/png, image/svg+xml, image/webp"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {currentSettings.logoImg && (
                                        <>
                                            <Slider
                                                label="Logo Size (% of Image Width)"
                                                value={currentSettings.logoScalePercent}
                                                onChange={(v) => updateSetting('logoScalePercent', v)}
                                                min={5}
                                                max={60}
                                                unit="%"
                                            />
                                            <Slider
                                                label="Logo Opacity"
                                                value={Math.round(currentSettings.logoOpacity * 100)}
                                                onChange={(v) => updateSetting('logoOpacity', v / 100)}
                                                min={10}
                                                max={100}
                                                unit="%"
                                            />
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ── POSITIONING GRID ── */}
                            <div className="pt-3 border-t border-slate-100 dark:border-workstation-800">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Position & Placement
                                    </label>
                                    <span className="text-[10px] text-slate-400">
                                        or drag on preview
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto p-1.5 bg-slate-100 dark:bg-workstation-850 rounded-xl">
                                    {POSITIONS.map((pos) => {
                                        const isSelected = currentSettings.position === pos.id
                                        return (
                                            <button
                                                key={pos.id}
                                                type="button"
                                                onClick={() => {
                                                    updateSetting('position', pos.id)
                                                    updateCurrentOverride('dragOffsetX', 0)
                                                    updateCurrentOverride('dragOffsetY', 0)
                                                }}
                                                className={`h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-workstation-800'
                                                }`}
                                                title={pos.label}
                                            >
                                                <i className={`fas ${pos.icon}`}></i>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="mt-3">
                                    <Slider
                                        label="Edge Margin"
                                        value={currentSettings.marginPercent}
                                        onChange={(v) => updateSetting('marginPercent', v)}
                                        min={1}
                                        max={15}
                                        unit="%"
                                    />
                                </div>
                            </div>

                            {/* ── ADVANCED REPEATED / DIAGONAL WATERMARK ── */}
                            <div className="pt-3 border-t border-slate-100 dark:border-workstation-800 space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                            Tile Watermark Across Entire Photo
                                        </span>
                                        <span className="text-[11px] text-slate-400 block">
                                            Diagonal repeat pattern to deter AI and manual cropping
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={currentSettings.isRepeated}
                                        onChange={(e) => updateSetting('isRepeated', e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                </label>

                                {currentSettings.isRepeated && (
                                    <div className="p-3 bg-slate-50 dark:bg-workstation-850 rounded-xl border border-slate-200/60 dark:border-workstation-800 space-y-3">
                                        <Slider
                                            label="Diagonal Angle"
                                            value={currentSettings.repeatAngle}
                                            onChange={(v) => updateSetting('repeatAngle', v)}
                                            min={-90}
                                            max={90}
                                            unit="°"
                                        />
                                        <Slider
                                            label="Pattern Grid Spacing"
                                            value={currentSettings.repeatSpacing}
                                            onChange={(v) => updateSetting('repeatSpacing', v)}
                                            min={80}
                                            max={300}
                                            unit="px"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ── EXPORT OPTIONS ── */}
                            <div className="pt-3 border-t border-slate-100 dark:border-workstation-800 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Export Format & Compression
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-500 mb-1">
                                            Output Container
                                        </label>
                                        <select
                                            value={currentSettings.outputFormat}
                                            onChange={(e) => updateSetting('outputFormat', e.target.value)}
                                            className="w-full h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-workstation-750 bg-white dark:bg-workstation-950 text-slate-800 dark:text-slate-200"
                                        >
                                            <option value="original">Preserve Original (JPG/PNG)</option>
                                            <option value="image/jpeg">JPG (Lightweight)</option>
                                            <option value="image/png">PNG (Lossless)</option>
                                            <option value="image/webp">WebP (Modern Web)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-500 mb-1">
                                            JPEG Quality
                                        </label>
                                        <select
                                            value={currentSettings.jpegQuality}
                                            onChange={(e) => updateSetting('jpegQuality', Number(e.target.value))}
                                            className="w-full h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-workstation-750 bg-white dark:bg-workstation-950 text-slate-800 dark:text-slate-200"
                                        >
                                            <option value={0.95}>95% (Maximum Quality)</option>
                                            <option value={0.88}>88% (Standard Web)</option>
                                            <option value={0.78}>78% (Compact File Size)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PREVIEW CANVAS PANEL (7 COLUMNS) ───────────────── */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-4 shadow-sm">
                            
                            {/* Canvas Toolbar */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-workstation-800 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        Live Canvas Preview
                                    </span>
                                    {selectedFile && (
                                        <Badge variant="neutral" size="sm">
                                            {selectedFile.width}×{selectedFile.height}px
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Hold to compare before/after */}
                                    <button
                                        type="button"
                                        onMouseDown={() => setShowOriginal(true)}
                                        onMouseUp={() => setShowOriginal(false)}
                                        onTouchStart={() => setShowOriginal(true)}
                                        onTouchEnd={() => setShowOriginal(false)}
                                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-workstation-800 dark:hover:bg-workstation-750 text-slate-700 dark:text-slate-300 font-semibold select-none transition-colors"
                                        title="Hold to see original without watermark"
                                    >
                                        <i className="fas fa-eye text-[11px] mr-1"></i>
                                        {showOriginal ? 'Showing Original' : 'Hold for Original'}
                                    </button>

                                    {/* Zoom Fit */}
                                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-workstation-750 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-workstation-800"
                                            title="Zoom Out"
                                        >
                                            <i className="fas fa-minus text-[10px]"></i>
                                        </button>
                                        <span className="px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                                            {Math.round(zoomLevel * 100)}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-workstation-800"
                                            title="Zoom In"
                                        >
                                            <i className="fas fa-plus text-[10px]"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Canvas Viewport */}
                            <div
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className="relative w-full min-h-[420px] max-h-[580px] bg-slate-100 dark:bg-workstation-950 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200/60 dark:border-workstation-800 cursor-crosshair select-none"
                            >
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        maxWidth: `${100 * zoomLevel}%`,
                                        maxHeight: `${540 * zoomLevel}px`,
                                        objectFit: 'contain',
                                    }}
                                    className="rounded shadow-md transition-transform duration-75"
                                />
                            </div>

                            {/* Canvas Hint */}
                            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                                <span className="flex items-center gap-1.5">
                                    <i className="fas fa-arrows-up-down-left-right text-[10px]"></i>
                                    Click & drag anywhere on photo to adjust watermark offset
                                </span>
                                {selectedFile && processedBlobs[selectedFile.id] && (
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadSingle(selectedFile)}
                                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <i className="fas fa-download text-[10px]"></i> Download This Photo ({Math.round(processedBlobs[selectedFile.id].size / 1024)} KB)
                                    </button>
                                )}
                            </div>

                            {/* Batch Processing Progress Bar */}
                            {isProcessing && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/40">
                                    <ProgressBar
                                        value={progress}
                                        label="Watermarking Photos in Batch..."
                                        statusText={`${progress}%`}
                                        variant="blue"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Completed Output Gallery Bar */}
                        {Object.keys(processedBlobs).length > 0 && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                            {Object.keys(processedBlobs).length} Photos Watermarked Successfully
                                        </h4>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                            Ready for instant individual or ZIP archive download.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="success"
                                        size="md"
                                        icon="fa-download"
                                        onClick={handleDownloadZip}
                                    >
                                        Download ZIP Archive
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── RICH TECHNICAL EDITORIAL DOCUMENTATION SECTION ───────────── */}
            <section className="mt-16 bg-white dark:bg-workstation-900 rounded-3xl border border-slate-200 dark:border-workstation-750 p-8 sm:p-12 shadow-sm">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* 1. Header Overview */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                            <i className="fas fa-shield-halved"></i> Photography & Asset Protection Standards
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                            Why Photographers & Creators Need In-Browser Batch Watermarking
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                            Publishing high-resolution photographs, event previews, or e-commerce catalog proofs without watermarks exposes creative assets to unauthorized content scraping, unauthorized commercial resale, and AI model ingestion. Traditional desktop software like Photoshop requires tedious action scripts, while SaaS cloud watermarking portals charge monthly subscriptions and force users to upload gigabytes of private files to remote storage buckets.
                        </p>
                    </div>

                    {/* 2. Feature Comparison Matrix */}
                    <div className="border border-slate-200 dark:border-workstation-750 rounded-2xl overflow-hidden">
                        <div className="bg-slate-100 dark:bg-workstation-850 px-6 py-4 border-b border-slate-200 dark:border-workstation-750">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                Comparison: ImgTool Studio vs Traditional Cloud Watermarkers
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-workstation-900 border-b border-slate-200 dark:border-workstation-750 text-slate-700 dark:text-slate-200 font-bold">
                                    <tr>
                                        <th className="p-3.5">Evaluation Standard</th>
                                        <th className="p-3.5 text-blue-600 dark:text-blue-400">ImgTool Batch Studio</th>
                                        <th className="p-3.5">Typical Cloud SaaS Portals</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-workstation-800">
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">File Privacy & Server Storage</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">100% In-Browser RAM (Zero Uploads)</td>
                                        <td className="p-3.5 text-red-500 font-medium">Uploaded to third-party cloud disks</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">Batch File Quantity Limits</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Unlimited (Subject only to device RAM)</td>
                                        <td className="p-3.5 text-slate-500">Capped at 5 to 10 photos on free tiers</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">Forced Competitor Watermark</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">None (100% Clean Exports)</td>
                                        <td className="p-3.5 text-amber-500">Stamps "Made with XYZ" unless paid</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">Diagonal Repeat Tiling</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Full diagonal angle & spacing controls</td>
                                        <td className="p-3.5 text-slate-500">Often restricted to corner placement</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">One-Click ZIP Export</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Instant client-side archive via JSZip</td>
                                        <td className="p-3.5 text-slate-500">Slow server zip creation & wait queues</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. Text vs Logo Watermarks Guidance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-workstation-850 border border-slate-200/80 dark:border-workstation-750 space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                                <i className="fas fa-font"></i>
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                When to Use Text Watermarks
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Text watermarks excel for copyright declarations, photographer names, client proof stamping, and date-stamping. Our engine automatically adds subtle outlines and drop shadows to ensure text remains legible across both dark shadows and bright daylight skies.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-workstation-850 border border-slate-200/80 dark:border-workstation-750 space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                                <i className="fas fa-image"></i>
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                When to Use PNG Logo Watermarks
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Logo stamps are ideal for agency branding, real estate brokerages, e-commerce brand stores, and digital artists with recognized insignia. Upload a high-resolution transparent PNG with alpha channel to keep background pixels completely transparent.
                            </p>
                        </div>
                    </div>

                    {/* 4. Practical FAQs */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h3>
                        
                        <div className="space-y-3">
                            <details className="group bg-slate-50 dark:bg-workstation-850 rounded-xl border border-slate-200/80 dark:border-workstation-750 p-4">
                                <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between list-none">
                                    <span>Does watermarking reduce the original resolution or clarity of my photos?</span>
                                    <i className="fas fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition-transform"></i>
                                </summary>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                    No. The processing engine matches the exact natural pixel width and height of each image (e.g. 4000×3000px). When exporting as JPEG, you can set the quality slider to 95% to preserve maximum optical fidelity. For zero compression loss, choose PNG export.
                                </p>
                            </details>

                            <details className="group bg-slate-50 dark:bg-workstation-850 rounded-xl border border-slate-200/80 dark:border-workstation-750 p-4">
                                <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between list-none">
                                    <span>Why is the diagonal repeated pattern more secure than a corner logo?</span>
                                    <i className="fas fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition-transform"></i>
                                </summary>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                    Watermarks placed strictly in the bottom-right corner can be easily cropped out or infilled using content-aware fill tools. A low-opacity diagonal pattern repeating across the subject makes unauthorized cropping impossible while still allowing clients to evaluate the photo composition.
                                </p>
                            </details>

                            <details className="group bg-slate-50 dark:bg-workstation-850 rounded-xl border border-slate-200/80 dark:border-workstation-750 p-4">
                                <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between list-none">
                                    <span>Can I watermark different orientations (portrait and landscape) in the same batch?</span>
                                    <i className="fas fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition-transform"></i>
                                </summary>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                    Yes. Our font size and margin calculations are proportional percentages (e.g. 5% font size, 4% edge margin). This ensures the watermark scales harmoniously whether an image is portrait, landscape, or square. Furthermore, you can click any individual photo in the queue to fine-tune its position.
                                </p>
                            </details>

                            <details className="group bg-slate-50 dark:bg-workstation-850 rounded-xl border border-slate-200/80 dark:border-workstation-750 p-4">
                                <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between list-none">
                                    <span>How can I verify that my photos are not uploaded to your server?</span>
                                    <i className="fas fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition-transform"></i>
                                </summary>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                    Open your browser's Developer Tools (<kbd className="font-mono">F12</kbd> or right-click &rarr; <em>Inspect</em>), switch to the <strong>Network</strong> tab, and drag photos into the tool. You will observe zero POST or upload requests. You can even disconnect your Wi-Fi after the page loads; the entire watermarking engine will continue to operate flawlessly offline.
                                </p>
                            </details>
                        </div>
                    </div>

                </div>
            </section>
        </ToolLayout>
    )
}
