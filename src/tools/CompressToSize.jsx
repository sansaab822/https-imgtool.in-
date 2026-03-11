import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

/**
 * CompressToSize — shared component for all compress-to-exact-KB tools.
 *
 * Props:
 *  targetKb      — Exact KB target (e.g. 30 for "30KB")
 *  maxKb         — Optional upper bound KB (for range like 20-30KB)
 *  minKb         — Optional lower bound KB (for range like 20-30KB)
 *  slug          — Route slug
 *  seoTitle      — Title tag
 *  seoDesc       — Meta description
 */

async function compressToTarget(file, targetKb, minKb, maxKb) {
    const img = new Image()
    const url = URL.createObjectURL(file)
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url })

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)

    return new Promise((resolve) => {
        if (file.type === 'image/png' || file.type === 'image/gif') {
            canvas.toBlob((b) => resolve({ blob: b, quality: 100 }), 'image/png')
            return
        }
        const target = ((minKb || targetKb) + (maxKb || targetKb)) / 2
        let lo = 0.01, hi = 1.0, bestBlob = null, bestQ = 0.85
        function attempt(q) {
            canvas.toBlob((blob) => {
                const kb = blob.size / 1024
                if (!bestBlob || Math.abs(kb - target) < Math.abs(bestBlob.size / 1024 - target)) {
                    bestBlob = blob; bestQ = q
                }
                if (kb > (maxKb || targetKb * 1.05) && q > lo + 0.005) {
                    hi = q; attempt((q + lo) / 2)
                } else if (kb < (minKb || targetKb * 0.80) && q < hi - 0.005) {
                    lo = q; attempt((q + hi) / 2)
                } else {
                    resolve({ blob: bestBlob, quality: Math.round(bestQ * 100) })
                }
            }, 'image/jpeg', q)
        }
        attempt(0.85)
    })
}

export default function CompressToSize({
    targetKb,
    minKb,
    maxKb,
    slug,
    seoTitle,
    seoDesc,
}) {
    const [image, setImage] = useState(null)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const [outputFmt, setOutputFmt] = useState('jpg')
    const inputRef = useRef()

    const isRange = minKb && maxKb && minKb !== maxKb
    const displayTarget = isRange ? `${minKb}–${maxKb}KB` : `${targetKb}KB`
    const title = seoTitle || `Compress Image to ${displayTarget} — Free Online Tool`
    const desc = seoDesc || `Compress any image to exactly ${displayTarget} online for free. Perfect for government exam forms, job portals, and online applications. 100% private, browser-based.`

    const loadImage = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image.')
            return
        }
        setError(''); setResult(null)
        setImage({ url: URL.createObjectURL(file), file, originalKb: (file.size / 1024).toFixed(1) })
    }, [])

    const processImage = async () => {
        if (!image) return
        setProcessing(true); setError('')
        try {
            const { blob, quality } = await compressToTarget(image.file, targetKb, minKb, maxKb)
            const kbActual = (blob.size / 1024).toFixed(1)
            setResult({
                url: URL.createObjectURL(blob),
                name: `compressed_${displayTarget.replace(/\s/g, '_')}.${outputFmt === 'png' ? 'png' : 'jpg'}`,
                kb: kbActual,
                quality,
            })
        } catch (e) {
            setError('Compression failed. Please try a different image.')
        }
        setProcessing(false)
    }

    return (
        <>
            <SEO
                title={title}
                description={desc}
                keywords={`compress image to ${displayTarget.toLowerCase()}, reduce image to ${displayTarget.toLowerCase()}, image compress ${displayTarget.toLowerCase()}, photo size reduce online`}
                canonical={`/${slug}`}
            />
            <ToolLayout toolSlug={slug} title={title} description={desc} breadcrumb={`Compress to ${displayTarget}`}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-bullseye text-orange-500 w-4"></i>
                                <span className="text-slate-600">Target size:</span>
                                <span className="font-bold text-orange-700 text-lg">{displayTarget}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-lock text-green-500 w-4"></i>
                                <span className="text-slate-600">Privacy:</span>
                                <span className="font-bold text-green-700">100% browser-based</span>
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
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-compress-arrows-alt text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop image here or <span className="text-orange-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP, BMP supported</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <i className="fas fa-file-image text-orange-400"></i>
                                        <span className="font-medium">{image.file.name}</span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">Original: {image.originalKb}KB</span>
                                    </div>
                                    <button onClick={() => { setImage(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[200px]">
                                    <img src={image.url} alt="Preview" className="max-h-64 max-w-full object-contain rounded-lg" />
                                </div>
                                {error && <p className="text-red-500 text-sm"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                                {result && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex-1">
                                            <span className="text-sm font-bold text-green-800 flex items-center gap-2">
                                                <i className="fas fa-circle-check text-green-500"></i> Compressed!
                                            </span>
                                            <span className="text-xs text-green-600 block mt-0.5">
                                                {image.originalKb}KB → <strong>{result.kb}KB</strong> ({result.quality}% quality)
                                            </span>
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

                    {/* Right Panel */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders-h text-orange-500"></i> Settings
                            </h3>
                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['jpg', 'png'].map(f => (
                                        <button key={f} onClick={() => setOutputFmt(f)}
                                            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${outputFmt === f ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-orange-50'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">JPG gives better compression, PNG is lossless</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 space-y-1.5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Target</span>
                                    <span className="font-bold text-orange-700">{displayTarget}</span>
                                </div>
                            </div>
                            <button onClick={processImage} disabled={!image || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Compressing…</>
                                    : <><i className="fas fa-compress-arrows-alt"></i> Compress to {displayTarget}</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Compress Image to Exactly {displayTarget} Online</h2>
                        <p>
                            Many Indian government job portals, university admissions, and competitive examination forms require you to upload a photograph within a very specific file size limit — exactly <strong>{displayTarget}</strong>. If your image is even slightly over the limit, the portal rejects it. If it is too small, it may look pixelated or low-quality on the printed application. This free tool automates the entire process by using a smart quality-adjustment algorithm to precisely target {displayTarget}.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">How Does the Compression Work?</h3>
                        <p>
                            When you upload your image, our tool uses the browser's built-in Canvas API to re-render the image at its original resolution. It then applies a binary-search algorithm across JPEG quality levels (from 1% to 99%) to find the exact quality setting that produces a file as close to {displayTarget} as possible. This approach preserves the visual quality of your photo while reliably hitting the required file size range, far more accurately than a simple quality slider.
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">Common Uses for {displayTarget} Images</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>SSC, IBPS, SBI, UPSC, and Railway exam photo uploads</li>
                            <li>University admission form photograph requirements</li>
                            <li>Passport and visa application digital photo submissions</li>
                            <li>Government employee ID and verification portals</li>
                            <li>Email attachments with strict size limits</li>
                        </ul>
                        <h3 className="text-lg font-bold text-slate-800 mt-6">FAQs</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-slate-700">Does compressing reduce my photo quality a lot?</h4>
                                <p className="mt-1">Our algorithm always uses the highest quality setting that still fits within {displayTarget}. For most passport-sized photos, any quality reduction is invisible to the naked eye.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What formats are supported for input?</h4>
                                <p className="mt-1">You can upload JPG, PNG, WebP, BMP, and most other standard image formats. The output will be in JPG or PNG based on your selection.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is my image uploaded to a server?</h4>
                                <p className="mt-1">No. All compression runs locally in your browser using HTML5 Canvas. Your image never leaves your device. See our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for details.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
