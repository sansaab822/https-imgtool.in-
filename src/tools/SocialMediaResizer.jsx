import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

/**
 * SocialMediaResizer — shared component for all social media photo resizers.
 *
 * Props:
 *  platform      — "Instagram", "Facebook", etc.
 *  mediaType     — "Profile Photo", "Cover Photo", "Post", etc.
 *  slug          — Route slug
 *  width         — Target width in pixels
 *  height        — Target height in pixels
 *  seoTitle      — Title tag
 *  seoDesc       — Meta description
 *  tips          — Array of platform-specific tips
 */

export default function SocialMediaResizer({
    platform = 'Social Media',
    mediaType = 'Photo',
    slug,
    width = 400,
    height = 400,
    seoTitle,
    seoDesc,
    tips = [],
}) {
    const [image, setImage] = useState(null)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const [outputFmt, setOutputFmt] = useState('jpg')
    const [fitMode, setFitMode] = useState('cover') // cover | contain | stretch
    const [bgColor, setBgColor] = useState('#FFFFFF')
    const imgRef = useRef()
    const inputRef = useRef()

    const isSquare = width === height
    const title = seoTitle || `${platform} ${mediaType} Resizer — ${width}×${height}px Online`
    const desc = seoDesc || `Resize your photo to the perfect ${platform} ${mediaType} dimensions (${width}×${height}px) online for free. Instant, private, no login required.`

    const loadImage = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image.'); return
        }
        setError(''); setResult(null)
        setImage({ url: URL.createObjectURL(file), file })
    }, [])

    const processImage = async () => {
        if (!imgRef.current) return
        setProcessing(true); setError('')
        try {
            const img = imgRef.current
            const canvas = document.createElement('canvas')
            canvas.width = width; canvas.height = height
            const ctx = canvas.getContext('2d')

            // Background
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, width, height)

            if (fitMode === 'cover') {
                const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
                const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale
                ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh)
            } else if (fitMode === 'contain') {
                const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
                const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale
                ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh)
            } else {
                ctx.drawImage(img, 0, 0, width, height)
            }

            const mime = outputFmt === 'png' ? 'image/png' : 'image/jpeg'
            canvas.toBlob((blob) => {
                setResult({
                    url: URL.createObjectURL(blob),
                    name: `${slug}_${width}x${height}.${outputFmt}`,
                    kb: (blob.size / 1024).toFixed(1),
                })
                setProcessing(false)
            }, mime, 0.95)
        } catch (e) {
            setError('An error occurred. Please try again.'); setProcessing(false)
        }
    }

    // Platform color mapping
    const platformColors = {
        WhatsApp: 'from-green-500 to-emerald-600',
        Instagram: 'from-pink-500 to-purple-600',
        Facebook: 'from-blue-600 to-blue-800',
        LinkedIn: 'from-blue-500 to-cyan-600',
        'Twitter/X': 'from-slate-700 to-slate-900',
        YouTube: 'from-red-500 to-rose-600',
    }
    const gradient = platformColors[platform] || 'from-pink-500 to-violet-600'

    return (
        <>
            <SEO title={title} description={desc}
                keywords={`${platform.toLowerCase()} ${mediaType.toLowerCase()} resize, ${platform.toLowerCase()} photo size ${width}x${height}, ${platform.toLowerCase()} image resize online`}
                canonical={`/${slug}`} />
            <ToolLayout toolSlug={slug} title={title} description={desc} breadcrumb={`${platform} ${mediaType}`}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 rounded-xl p-4 text-white`}>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="bg-white/20 rounded-full px-3 py-1 font-semibold">
                                    <i className="fas fa-ruler-combined mr-1"></i>{width}×{height}px
                                </span>
                                <span className="bg-white/20 rounded-full px-3 py-1 font-semibold">
                                    <i className="fas fa-share-nodes mr-1"></i>{platform} {mediaType}
                                </span>
                            </div>
                        </div>

                        {!image ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadImage(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadImage(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <i className="fas fa-image text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop photo here or <span className="text-pink-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP supported</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600"><i className="fas fa-image text-pink-400 mr-1"></i>Preview</span>
                                    <button onClick={() => { setImage(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[200px]">
                                    <img ref={imgRef} src={image.url} alt="Preview" className="max-h-64 max-w-full object-contain rounded-lg" crossOrigin="anonymous" />
                                </div>
                                {error && <p className="text-red-500 text-sm"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                                {result && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex-1">
                                            <span className="text-sm font-bold text-green-800 flex items-center gap-2"><i className="fas fa-circle-check text-green-500"></i> Done!</span>
                                            <span className="text-xs text-green-600 block mt-0.5">{width}×{height}px · {result.kb}KB</span>
                                        </div>
                                        <a href={result.url} download={result.name}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                            <i className="fas fa-download"></i> Download
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders-h text-pink-500"></i> Settings
                            </h3>

                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Fit Mode</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: 'cover', label: 'Cover', icon: 'fa-expand' },
                                        { id: 'contain', label: 'Fit', icon: 'fa-compress' },
                                        { id: 'stretch', label: 'Stretch', icon: 'fa-arrows-alt' },
                                    ].map(m => (
                                        <button key={m.id} onClick={() => setFitMode(m.id)}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${fitMode === m.id ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-pink-50'}`}>
                                            <i className={`fas ${m.icon} block mb-0.5`}></i>{m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Background Color</label>
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-slate-200 p-0.5 cursor-pointer" />
                            </div>

                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['jpg', 'png'].map(f => (
                                        <button key={f} onClick={() => setOutputFmt(f)}
                                            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${outputFmt === f ? 'bg-pink-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-pink-50'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={processImage} disabled={!image || processing}
                                className={`w-full py-3.5 bg-gradient-to-r ${gradient} disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}>
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Resizing…</>
                                    : <><i className="fas fa-magic-wand-sparkles"></i> Resize for {platform}</>}
                            </button>
                        </div>

                        {tips.length > 0 && (
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs text-purple-700 space-y-2">
                                <p className="font-bold"><i className="fas fa-lightbulb text-yellow-400 mr-1"></i> {platform} Tips</p>
                                <ul className="space-y-1">
                                    {tips.map((t, i) => <li key={i}><i className="fas fa-check text-green-500 mr-1"></i>{t}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Resize Photo for {platform} {mediaType} — {width}×{height}px</h2>
                        <p>
                            {platform} requires specific image dimensions for the best visual result. The ideal size for a {platform} {mediaType} is <strong>{width}×{height} pixels</strong>. If you upload an image with the wrong dimensions, {platform} will automatically crop or squish it, often in an unflattering way. Our free online resizer gives you full control — choose how your image is fitted (cover, contain, or stretch) and download the perfectly sized file ready to upload.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">Why Image Dimensions Matter on {platform}</h3>
                        <p>
                            Each social media platform renders images differently based on the device. {platform} uses {width}×{height}px for {mediaType.toLowerCase()}s across all devices. When you upload a correctly sized image, it displays sharply without any compression artifacts. Incorrectly sized images get re-processed by {platform}'s servers, which can introduce blurriness, unexpected cropping, or visual artifacts that make your profile look unprofessional.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">How to Use</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Upload your image</strong> — drag and drop or click to browse</li>
                            <li><strong>Choose fit mode</strong> — "Cover" fills the full canvas (may crop); "Fit" shows the whole image with background padding; "Stretch" fills exactly</li>
                            <li><strong>Select format</strong> — JPG for photos, PNG for logos/text with transparency</li>
                            <li><strong>Click Resize</strong> and then <strong>Download</strong> your perfectly sized photo</li>
                        </ol>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">FAQs</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-slate-700">Does {platform} compress my image after I upload it?</h4>
                                <p className="mt-1">Yes, {platform} applies its own compression. Uploading at exactly {width}×{height}px minimizes the re-compression and keeps your image as sharp as possible.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I use PNG for my {platform} {mediaType}?</h4>
                                <p className="mt-1">Yes. PNG preserves better quality for logos and text, but results in larger file sizes. JPG is recommended for photographs.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Does this tool upload my image to a server?</h4>
                                <p className="mt-1">No. All processing happens locally in your browser. Your image is never uploaded anywhere.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
