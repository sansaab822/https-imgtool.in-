import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

/**
 * GovernmentPhotoResizer — shared component for all govt exam photo resizers.
 *
 * Props:
 *  examName      — Display name: "SSC CGL"
 *  slug          — Route slug (for canonical + ToolLayout)
 *  width         — Target width in pixels
 *  height        — Target height in pixels
 *  minKb         — Minimum file size in KB
 *  maxKb         — Maximum file size in KB
 *  isSignature   — If true, show signature-specific guidance
 *  extraInfo     — Optional extra sentence shown in specs card
 *  seoTitle      — Title tag
 *  seoDesc       — Meta description
 *  keywords      — Meta keywords
 */

function compressToKbRange(canvas, minKb, maxKb, mime = 'image/jpeg') {
    return new Promise((resolve) => {
        if (mime !== 'image/jpeg') {
            canvas.toBlob((b) => resolve(b), mime)
            return
        }
        let lo = 0.05, hi = 0.99, best = null
        function attempt(q) {
            canvas.toBlob((blob) => {
                const kb = blob.size / 1024
                if (!best || Math.abs(kb - (minKb + maxKb) / 2) < Math.abs(best.size / 1024 - (minKb + maxKb) / 2)) {
                    best = blob
                }
                if (kb > maxKb && q > lo + 0.01) attempt((q + lo) / 2)
                else if (kb < minKb && q < hi - 0.01) { lo = q; attempt((q + hi) / 2) }
                else resolve(best)
            }, mime, q)
        }
        attempt(0.85)
    })
}

export default function GovernmentPhotoResizer({
    examName = 'Govt Exam',
    slug,
    width = 200,
    height = 230,
    minKb = 20,
    maxKb = 50,
    isSignature = false,
    extraInfo = '',
    seoTitle,
    seoDesc,
    keywords,
}) {
    const [image, setImage] = useState(null)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [outputFmt, setOutputFmt] = useState('jpg')
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const imgRef = useRef()
    const inputRef = useRef()

    const title = seoTitle || `${examName} Photo Resizer — ${width}×${height}px, ${minKb}–${maxKb}KB`
    const desc = seoDesc || `Resize your photo to exact ${examName} specifications: ${width}×${height} pixels, ${minKb}–${maxKb}KB. Free, fast, 100% private — processed in your browser.`

    const loadImage = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image file.')
            return
        }
        setError('')
        setResult(null)
        setImage({ url: URL.createObjectURL(file), file })
    }, [])

    const processImage = async () => {
        if (!imgRef.current) return
        setProcessing(true)
        setError('')
        try {
            const img = imgRef.current
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')

            // Fill white background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)

            // Cover-fit the image
            const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
            const sw = img.naturalWidth * scale
            const sh = img.naturalHeight * scale
            const ox = (width - sw) / 2
            const oy = (height - sh) / 2
            ctx.drawImage(img, ox, oy, sw, sh)

            const mime = outputFmt === 'png' ? 'image/png' : 'image/jpeg'
            const blob = await compressToKbRange(canvas, minKb, maxKb, mime)
            const kbActual = (blob.size / 1024).toFixed(1)
            setResult({
                url: URL.createObjectURL(blob),
                name: `${slug}_${width}x${height}.${outputFmt}`,
                kb: kbActual,
            })
        } catch (e) {
            setError('An error occurred. Please try a different image.')
        }
        setProcessing(false)
    }

    return (
        <>
            <SEO
                title={title}
                description={desc}
                keywords={keywords || `${examName.toLowerCase()} photo resize, ${examName.toLowerCase()} photo size, govt exam photo resize, ${width}x${height} photo`}
                canonical={`/${slug}`}
            />
            <ToolLayout toolSlug={slug} title={title} description={desc} breadcrumb={`${examName} Photo`}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Upload + Preview */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Specs Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-ruler-combined text-blue-500 w-4"></i>
                                <span className="text-slate-600">Size:</span>
                                <span className="font-bold text-blue-700">{width}×{height} px</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fas fa-weight-hanging text-indigo-500 w-4"></i>
                                <span className="text-slate-600">File size:</span>
                                <span className="font-bold text-indigo-700">{minKb}–{maxKb} KB</span>
                            </div>
                            {extraInfo && (
                                <div className="w-full text-xs text-slate-500"><i className="fas fa-info-circle mr-1 text-blue-400"></i>{extraInfo}</div>
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
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                        <i className={`fas ${isSignature ? 'fa-signature' : 'fa-id-card'} text-white text-2xl`}></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop photo here or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">JPG, PNG, WebP accepted</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600"><i className="fas fa-image text-blue-400 mr-1"></i>Preview</span>
                                    <button onClick={() => { setImage(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[200px]">
                                    <img ref={imgRef} src={image.url} alt="Preview" className="max-h-64 max-w-full mx-auto block object-contain rounded-lg" crossOrigin="anonymous" />
                                </div>
                                {error && <p className="text-red-500 text-sm"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                                {result && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2 flex-1">
                                            <i className="fas fa-circle-check text-green-500"></i>
                                            <div>
                                                <span className="text-sm font-bold text-green-800 block">Photo Ready!</span>
                                                <span className="text-xs text-green-600">{width}×{height}px · {result.kb}KB</span>
                                            </div>
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

                    {/* Right: Settings */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders-h text-blue-500"></i> Settings
                            </h3>
                            <div>
                                <label className="block text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['jpg', 'png'].map(f => (
                                        <button key={f} onClick={() => setOutputFmt(f)}
                                            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${outputFmt === f ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">Most portals require JPG format</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
                                <div className="flex justify-between"><span>Target dimensions</span><span className="font-bold text-slate-800">{width}×{height}px</span></div>
                                <div className="flex justify-between"><span>Max file size</span><span className="font-bold text-slate-800">{maxKb}KB</span></div>
                                <div className="flex justify-between"><span>Min file size</span><span className="font-bold text-slate-800">{minKb}KB</span></div>
                            </div>
                            <button onClick={processImage} disabled={!image || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing…</>
                                    : <><i className="fas fa-magic-wand-sparkles"></i> Resize &amp; Compress</>}
                            </button>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 space-y-1">
                            <p className="font-bold flex items-center gap-1"><i className="fas fa-shield-alt"></i> 100% Private</p>
                            <p>Your photo never leaves your device. All processing happens in your browser.</p>
                        </div>
                    </div>
                </div>

                {/* SEO Content — unique per exam when available */}
                <SeoContent slug={slug} examName={examName} width={width} height={height} minKb={minKb} maxKb={maxKb} />
            </ToolLayout>
        </>
    )
}

/* ── Unique Content Renderer ────────────────────────────────────────────── */
import { EXAM_CONTENT } from '../data/examContentData'

function SeoContent({ slug, examName, width, height, minKb, maxKb }) {
    const data = EXAM_CONTENT[slug]

    // ── Fallback: original template for exams without unique content ──────
    if (!data) {
        return (
            <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">{examName} Photo Resizer — Exact {width}×{height}px, {minKb}–{maxKb}KB</h2>
                    <p>
                        Applying for <strong>{examName}</strong> requires submitting a passport-size photograph that matches very specific technical requirements. The application portal typically demands a photo that is exactly <strong>{width}×{height} pixels</strong> in dimension and between <strong>{minKb}KB and {maxKb}KB</strong> in file size. Photos that exceed these limits are automatically rejected by the portal's upload validator, forcing candidates to redo the process. Our free online tool makes this entire task effortless — upload your photo, and we automatically resize, crop, and compress it to meet the exact specification.
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 mt-6">How to Use This Tool</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Upload your photo:</strong> Drag and drop or click to select any clear, front-facing photograph. JPG, PNG, and WebP are all supported.</li>
                        <li><strong>Select output format:</strong> JPG is recommended for most government exam portals.</li>
                        <li><strong>Click Resize &amp; Compress:</strong> Our tool automatically resizes to exactly {width}×{height}px and adjusts the quality to bring the file size within the {minKb}–{maxKb}KB range.</li>
                        <li><strong>Download:</strong> Save the processed photo and upload it directly to the {examName} application form.</li>
                    </ol>
                    <p className="text-xs text-slate-400 mt-4"><em>Always verify photo specifications from the latest official notification before uploading your application.</em></p>
                </div>
            </div>
        )
    }

    // ── Rich unique content for exams with data ──────────────────────────
    return (
        <div className="seo-content mt-12 space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800">{examName} Photo Resizer — Exact {width}×{height}px, {minKb}–{maxKb}KB</h2>
                    <p>{data.intro}</p>

                    {/* Authority & Portal */}
                    {(data.authority || data.portalNote) && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 not-prose">
                            {data.authority && (
                                <p className="text-sm text-blue-800"><i className="fas fa-building mr-2 text-blue-500"></i><strong>Conducting Body:</strong> {data.authority}</p>
                            )}
                            {data.portalNote && (
                                <p className="text-sm text-blue-700 mt-1"><i className="fas fa-globe mr-2 text-blue-400"></i>{data.portalNote}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Requirements Table */}
            {data.requirements && data.requirements.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-clipboard-check text-green-500"></i> {examName} Photo Requirements
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                {data.requirements.map((req, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                        <td className="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{req.label}</td>
                                        <td className="py-2.5 px-4 text-slate-600">{req.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Why Specifications Matter */}
            {data.whyMatters && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-amber-500"></i> Why These Specifications Matter
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{data.whyMatters}</p>
                </div>
            )}

            {/* Preparation Tips */}
            {data.preparationTips && data.preparationTips.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-camera text-indigo-500"></i> How to Prepare Your {examName} Photo
                    </h3>
                    <ul className="space-y-2.5">
                        {data.preparationTips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-600">
                                <i className="fas fa-check text-green-500 mt-1 flex-shrink-0"></i>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Common Mistakes */}
            {data.commonMistakes && data.commonMistakes.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-times-circle text-red-500"></i> Common Mistakes to Avoid
                    </h3>
                    <div className="space-y-3">
                        {data.commonMistakes.map((item, i) => (
                            <div key={i} className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-red-800"><i className="fas fa-ban text-red-400 mr-1.5"></i>{item.mistake}</p>
                                <p className="text-sm text-slate-600 mt-1 pl-5">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQs */}
            {data.faqs && data.faqs.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-question-circle text-blue-500"></i> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        {data.faqs.map((faq, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-sm text-slate-700">{faq.q}</h4>
                                <p className="text-sm text-slate-600 mt-1">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Tools */}
            {data.relatedTools && data.relatedTools.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-tools text-purple-500"></i> Related Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.relatedTools.map((tool, i) => (
                            <a key={i} href={tool.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-sm text-slate-700 hover:text-indigo-700 transition-all">
                                <i className="fas fa-arrow-right text-xs"></i> {tool.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Verification Note */}
            {data.verificationNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <i className="fas fa-info-circle text-amber-500 mt-0.5 flex-shrink-0"></i>
                    <p className="text-sm text-amber-800">{data.verificationNote}</p>
                </div>
            )}
        </div>
    )
}
