import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

/**
 * DocumentPhotoResizer — shared component for document/ID photo resizers.
 *
 * Props:
 *  docName       — "Aadhaar Card", "Voter ID", etc.
 *  slug          — Route slug
 *  width         — Target width in pixels
 *  height        — Target height in pixels
 *  maxKb         — Max file size in KB
 *  minKb         — Min file size in KB
 *  note          — Extra requirement note
 *  isMisc        — If true, show as a misc document tool
 *  seoTitle      — Title tag
 *  seoDesc       — Meta description
 */

async function resizeAndCompress(imgEl, width, height, minKb, maxKb, mime) {
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    const scale = Math.max(width / imgEl.naturalWidth, height / imgEl.naturalHeight)
    const sw = imgEl.naturalWidth * scale, sh = imgEl.naturalHeight * scale
    ctx.drawImage(imgEl, (width - sw) / 2, (height - sh) / 2, sw, sh)

    if (mime !== 'image/jpeg') {
        return new Promise(res => canvas.toBlob(res, mime))
    }

    return new Promise((resolve) => {
        const target = (minKb + maxKb) / 2
        let lo = 0.05, hi = 0.99, best = null
        function attempt(q) {
            canvas.toBlob((blob) => {
                const kb = blob.size / 1024
                if (!best || Math.abs(kb - target) < Math.abs(best.size / 1024 - target)) best = blob
                if (kb > maxKb && q > lo + 0.005) { hi = q; attempt((q + lo) / 2) }
                else if (kb < minKb && q < hi - 0.005) { lo = q; attempt((q + hi) / 2) }
                else resolve(best)
            }, mime, q)
        }
        attempt(0.85)
    })
}

export default function DocumentPhotoResizer({
    docName = 'Document',
    slug,
    width = 200,
    height = 230,
    maxKb = 50,
    minKb = 10,
    note = '',
    seoTitle,
    seoDesc,
}) {
    const [image, setImage] = useState(null)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const [outputFmt, setOutputFmt] = useState('jpg')
    const imgRef = useRef()
    const inputRef = useRef()

    const title = seoTitle || `${docName} Photo Resizer — ${width}×${height}px, ${minKb}–${maxKb}KB`
    const desc = seoDesc || `Resize your photo to exact ${docName} specifications: ${width}×${height}px, ${minKb}–${maxKb}KB. Free, fast, 100% private — no upload to server.`

    const loadImage = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image file.'); return
        }
        setError(''); setResult(null)
        setImage({ url: URL.createObjectURL(file), file })
    }, [])

    const processImage = async () => {
        if (!imgRef.current) return
        setProcessing(true); setError('')
        try {
            const mime = outputFmt === 'png' ? 'image/png' : 'image/jpeg'
            const blob = await resizeAndCompress(imgRef.current, width, height, minKb, maxKb, mime)
            setResult({
                url: URL.createObjectURL(blob),
                name: `${slug}_${width}x${height}.${outputFmt}`,
                kb: (blob.size / 1024).toFixed(1),
            })
        } catch {
            setError('Processing failed. Please try a different image.')
        }
        setProcessing(false)
    }

    return (
        <>
            <SEO title={title} description={desc}
                keywords={`${docName.toLowerCase()} photo resize, ${docName.toLowerCase()} photo size, ${docName.toLowerCase()} photo online, document photo resize ${width}x${height}`}
                canonical={`/${slug}`} />
            <ToolLayout toolSlug={slug} title={title} description={desc} breadcrumb={`${docName} Photo`}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-4 flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-id-badge text-teal-500 w-4"></i>
                                <span className="text-slate-600">Dimensions:</span>
                                <span className="font-bold text-teal-700">{width}×{height}px</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-weight-hanging text-cyan-500 w-4"></i>
                                <span className="text-slate-600">File size:</span>
                                <span className="font-bold text-cyan-700">{minKb}–{maxKb}KB</span>
                            </div>
                            {note && (
                                <div className="w-full text-xs text-slate-500">
                                    <i className="fas fa-info-circle mr-1 text-teal-400"></i>{note}
                                </div>
                            )}
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
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-id-badge text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop photo here or <span className="text-teal-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP accepted</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600"><i className="fas fa-image text-teal-400 mr-1"></i>Preview</span>
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
                                            <span className="text-sm font-bold text-green-800 flex items-center gap-2"><i className="fas fa-circle-check text-green-500"></i> Ready!</span>
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

                    {/* Right Settings */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders-h text-teal-500"></i> Settings
                            </h3>
                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['jpg', 'png'].map(f => (
                                        <button key={f} onClick={() => setOutputFmt(f)}
                                            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${outputFmt === f ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-teal-50'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
                                <div className="flex justify-between"><span>Dimensions</span><span className="font-bold text-slate-800">{width}×{height}px</span></div>
                                <div className="flex justify-between"><span>Target size</span><span className="font-bold text-slate-800">{minKb}–{maxKb}KB</span></div>
                            </div>
                            <button onClick={processImage} disabled={!image || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing…</>
                                    : <><i className="fas fa-magic-wand-sparkles"></i> Resize Photo</>}
                            </button>
                        </div>
                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-xs text-teal-700 space-y-1">
                            <p className="font-bold flex items-center gap-1"><i className="fas fa-shield-alt"></i> 100% Secure & Private</p>
                            <p>Photo never leaves your device. Processed in your web browser.</p>
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">{docName} Photo Resizer — {width}×{height}px Online</h2>
                        <p>
                            Different government-issued documents and official forms require photographs in very specific digital formats. For <strong>{docName}</strong> applications, the required photo dimensions are <strong>{width}×{height} pixels</strong> with a file size between <strong>{minKb}KB and {maxKb}KB</strong>. Submitting a photo that doesn't match these exact specs leads to rejection during online form scrutiny. Our tool handles all the technical details automatically — just upload any clear photo and get a perfectly sized file ready for your application.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">Step-by-Step Guide</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Upload your photo — ideally a clear, well-lit portrait against a light background</li>
                            <li>Select JPG format (most portals require JPG/JPEG)</li>
                            <li>Click "Resize Photo" — the tool resizes to {width}×{height}px and compresses to {minKb}–{maxKb}KB</li>
                            <li>Download and use directly in your {docName} application form</li>
                        </ol>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">Important Tips</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Use a recent, clear photo that shows your face clearly against a light or white background</li>
                            <li>Avoid glasses, hats, or other accessories that obscure your face</li>
                            <li>Make sure the original photo has good brightness and contrast before uploading</li>
                            <li>JPG format is accepted on almost all official Indian government portals</li>
                        </ul>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">FAQs</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-slate-700">Does this tool crop my face automatically?</h4>
                                <p className="mt-1">The tool center-crops or scales your image to fit {width}×{height}px. For best results, upload a photo where your face is already centered and framed appropriately.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is there any cost to use this?</h4>
                                <p className="mt-1">This tool is completely free with no registration required. For more photo tools, explore our <a href="/passport-size-photo" className="text-blue-600 hover:underline">Passport Photo Maker</a> or <a href="/image-compressor" className="text-blue-600 hover:underline">Image Compressor</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
