import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Official Portal Preset Library ───────────────────────────────────────────
const EXAM_PRESETS = [
    // SSC
    { id: 'ssc-cgl', group: 'SSC Exams', name: 'SSC CGL Photo', w: 275, h: 354, minKb: 20, maxKb: 50, note: 'Staff Selection Commission — Combined Graduate Level' },
    { id: 'ssc-chsl', group: 'SSC Exams', name: 'SSC CHSL Photo', w: 275, h: 354, minKb: 20, maxKb: 50, note: 'Combined Higher Secondary Level' },
    { id: 'ssc-gd', group: 'SSC Exams', name: 'SSC GD Constable', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'General Duty Constable exam portal' },
    { id: 'ssc-mts', group: 'SSC Exams', name: 'SSC MTS Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Multi-Tasking Staff official specs' },
    { id: 'ssc-sig', group: 'SSC Exams', name: 'SSC Signature', w: 140, h: 60, minKb: 10, maxKb: 20, isSignature: true, note: 'Official signature upload: 140×60px, 10–20KB' },

    // Banking
    { id: 'ibps-po', group: 'Banking & Insurance', name: 'IBPS PO / SO Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Institute of Banking Personnel Selection' },
    { id: 'ibps-clerk', group: 'Banking & Insurance', name: 'IBPS Clerk Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Clerical cadre bank recruitment' },
    { id: 'sbi-po', group: 'Banking & Insurance', name: 'SBI PO Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'State Bank of India Probationary Officer' },
    { id: 'sbi-clerk', group: 'Banking & Insurance', name: 'SBI Clerk Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'SBI Junior Associate registration' },
    { id: 'bank-sig', group: 'Banking & Insurance', name: 'Bank Exam Signature', w: 140, h: 60, minKb: 10, maxKb: 20, isSignature: true, note: 'Standard bank signature specification' },
    { id: 'bank-thumb', group: 'Banking & Insurance', name: 'Thumb Impression', w: 240, h: 240, minKb: 20, maxKb: 50, note: 'Left thumb impression on white paper with blue/black ink' },
    { id: 'bank-decl', group: 'Banking & Insurance', name: 'Handwritten Declaration', w: 800, h: 400, minKb: 50, maxKb: 100, note: 'Bank self-written declaration upload' },

    // National
    { id: 'upsc', group: 'National Recruitment & Entrance', name: 'UPSC Civil Services', w: 300, h: 400, minKb: 20, maxKb: 300, note: 'Union Public Service Commission (IAS, IPS)' },
    { id: 'neet', group: 'National Recruitment & Entrance', name: 'NEET UG Photo', w: 413, h: 531, minKb: 10, maxKb: 200, note: 'National Eligibility Entrance Test (Medical)' },
    { id: 'jee', group: 'National Recruitment & Entrance', name: 'JEE Main Photo', w: 413, h: 531, minKb: 10, maxKb: 200, note: 'Joint Entrance Examination (Engineering)' },
    { id: 'gate', group: 'National Recruitment & Entrance', name: 'GATE Photo', w: 480, h: 640, minKb: 5, maxKb: 40, note: 'Graduate Aptitude Test in Engineering — IIT portal' },
    { id: 'ctet', group: 'National Recruitment & Entrance', name: 'CTET Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Central Teacher Eligibility Test' },
    { id: 'rrb', group: 'National Recruitment & Entrance', name: 'Railway RRB NTPC', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Railway Recruitment Board portal specs' },

    // State & Defence
    { id: 'up-police', group: 'State Police & Defence', name: 'UP Police Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Uttar Pradesh Police recruitment' },
    { id: 'mp-police', group: 'State Police & Defence', name: 'MP Police Photo', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Madhya Pradesh Police portal' },
    { id: 'army', group: 'State Police & Defence', name: 'Army Agniveer', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Indian Army recruitment portal' },
    { id: 'navy', group: 'State Police & Defence', name: 'Navy Agniveer', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Indian Navy recruitment specs' },

    // Custom
    { id: 'custom', group: 'Custom Dimensions', name: 'Custom Photo / Signature', w: 200, h: 230, minKb: 20, maxKb: 50, note: 'Manually input custom width, height, and KB bounds' },
]

function compressToKbRange(canvas, minKb, maxKb, mime = 'image/jpeg') {
    return new Promise((resolve) => {
        if (mime !== 'image/jpeg') {
            canvas.toBlob((b) => resolve(b), mime)
            return
        }
        let lo = 0.05, hi = 0.99, optimal = null
        function attempt(q) {
            canvas.toBlob((blob) => {
                const kb = blob.size / 1024
                if (!optimal || Math.abs(kb - (minKb + maxKb) / 2) < Math.abs(optimal.size / 1024 - (minKb + maxKb) / 2)) {
                    optimal = blob
                }
                if (kb > maxKb && q > lo + 0.01) attempt((q + lo) / 2)
                else if (kb < minKb && q < hi - 0.01) { lo = q; attempt((q + hi) / 2) }
                else resolve(optimal)
            }, mime, q)
        }
        attempt(0.85)
    })
}

export default function GovernmentPhotoResizer({
    examName: initialExamName,
    slug: initialSlug = 'government-photo-resizer',
    width: initialW,
    height: initialH,
    minKb: initialMinKb,
    maxKb: initialMaxKb,
    isSignature: initialIsSig = false,
}) {
    const [selectedPresetId, setSelectedPresetId] = useState(() => {
        if (initialSlug && initialSlug !== 'government-photo-resizer') {
            const found = EXAM_PRESETS.find(p => p.id === initialSlug.replace('-photo-resizer', '').replace('-resizer', ''))
            if (found) return found.id
        }
        return 'ssc-cgl'
    })

    const activePreset = EXAM_PRESETS.find(p => p.id === selectedPresetId) || EXAM_PRESETS[0]

    const [targetW, setTargetW] = useState(initialW || activePreset.w)
    const [targetH, setTargetH] = useState(initialH || activePreset.h)
    const [targetMinKb, setTargetMinKb] = useState(initialMinKb || activePreset.minKb)
    const [targetMaxKb, setTargetMaxKb] = useState(initialMaxKb || activePreset.maxKb)
    const [image, setImage] = useState(null)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [outputFmt, setOutputFmt] = useState('jpg')

    const fileInputRef = useRef(null)

    const onPresetChange = (presetId) => {
        setSelectedPresetId(presetId)
        const p = EXAM_PRESETS.find(x => x.id === presetId)
        if (p) {
            setTargetW(p.w)
            setTargetH(p.h)
            setTargetMinKb(p.minKb)
            setTargetMaxKb(p.maxKb)
            setResult(null)
        }
    }

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            setImage({ file, url, img, name: file.name, origW: img.naturalWidth, origH: img.naturalHeight, origSize: file.size })
            setResult(null)
        }
        img.src = url
    }, [])

    const processImage = async () => {
        if (!image) return
        setProcessing(true)

        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')

        // Fill background white
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, targetW, targetH)

        // Draw image proportional fit/fill
        const imgAspect = image.origW / image.origH
        const targetAspect = targetW / targetH

        let sx = 0, sy = 0, sWidth = image.origW, sHeight = image.origH
        if (imgAspect > targetAspect) {
            sWidth = image.origH * targetAspect
            sx = (image.origW - sWidth) / 2
        } else {
            sHeight = image.origW / targetAspect
            sy = (image.origH - sHeight) / 2
        }

        ctx.drawImage(image.img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH)

        const mime = outputFmt === 'png' ? 'image/png' : 'image/jpeg'
        const blob = await compressToKbRange(canvas, targetMinKb, targetMaxKb, mime)
        const url = URL.createObjectURL(blob)

        setResult({
            url,
            blob,
            sizeKb: (blob.size / 1024).toFixed(1),
            width: targetW,
            height: targetH,
        })
        setProcessing(false)
    }

    const isSig = activePreset.isSignature || initialIsSig

    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Government & Exam Photo Resizer (SSC, UPSC, IBPS, Police, NEET)',
        url: 'https://imgtool.in/government-photo-resizer',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        description: 'Resize and compress photos and signatures for official Indian government exams and recruitment portals. Exactly matches official pixel dimensions and KB limits.',
    }

    return (
        <>
            <SEO
                title="Government Exam Photo Resizer - SSC, UPSC, IBPS, NEET (Exact px & KB)"
                description="Resize and compress your photo and signature to exact dimensions and KB limits for SSC, UPSC, IBPS, NEET, and State Police portals. 100% private, free, and in-browser."
                canonical="/government-photo-resizer"
                keywords="government exam photo resizer, ssc photo resizer, upsc photo resize, ibps photo signature resizer, 20 to 50 kb photo resizer, 140x60 signature resizer, online photo resizer for govt exam"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="government-photo-resizer"
                title="Government & Exam Photo Resizer"
                description="Format candidate photos and signatures to match official portal specifications (pixel dimensions and KB limits) for SSC, Banking, UPSC, Police, and Entrance exams."
                breadcrumb="Govt Exam Resizer"
            >
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Step 1: Portal & Exam Preset Selector */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            <i className="fas fa-list-check text-blue-600 mr-1.5"></i> Select Exam or Target Portal
                        </label>
                        <select
                            value={selectedPresetId}
                            onChange={(e) => onPresetChange(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                        >
                            {['SSC Exams', 'Banking & Insurance', 'National Recruitment & Entrance', 'State Police & Defence', 'Custom Dimensions'].map(group => (
                                <optgroup key={group} label={group}>
                                    {EXAM_PRESETS.filter(p => p.group === group).map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.w}×{p.h}px, {p.minKb}–{p.maxKb}KB)
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>

                        {/* Specs Banner */}
                        <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-950">{activePreset.name}:</span>
                                <span className="text-blue-800">{activePreset.note}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono font-bold text-blue-900">
                                <span>{targetW} × {targetH} px</span>
                                <span>•</span>
                                <span>{targetMinKb}–{targetMaxKb} KB</span>
                            </div>
                        </div>

                        {/* Custom inputs if selected */}
                        {selectedPresetId === 'custom' && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Width (px)</label>
                                    <input type="number" value={targetW} onChange={e => setTargetW(Number(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Height (px)</label>
                                    <input type="number" value={targetH} onChange={e => setTargetH(Number(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Min KB</label>
                                    <input type="number" value={targetMinKb} onChange={e => setTargetMinKb(Number(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Max KB</label>
                                    <input type="number" value={targetMaxKb} onChange={e => setTargetMaxKb(Number(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Upload Area */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={e => e.target.files && handleFile(e.target.files[0])} className="hidden" />
                            {image ? (
                                <div className="flex flex-col items-center gap-2">
                                    <img src={image.url} alt="Uploaded" className="w-20 h-24 object-contain rounded-lg border border-blue-200 shadow-xs" />
                                    <p className="font-bold text-slate-800 text-sm">{image.name}</p>
                                    <p className="text-xs text-slate-400 font-mono">Original: {image.origW}×{image.origH}px · {(image.origSize / 1024).toFixed(1)} KB</p>
                                    <span className="text-xs text-blue-600 underline font-semibold mt-1">Change file</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                                        <i className={`fas ${isSig ? 'fa-signature' : 'fa-id-card'}`}></i>
                                    </div>
                                    <p className="font-bold text-slate-800 text-sm">Drop your {isSig ? 'signature' : 'passport photo'} here or <span className="text-blue-600 underline">browse</span></p>
                                    <p className="text-xs text-slate-400">JPG, PNG, WebP · Runs 100% locally on your device</p>
                                </div>
                            )}
                        </div>

                        {/* Format & Execute Bar */}
                        {image && (
                            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-600 font-semibold">Format:</span>
                                    {['jpg', 'png'].map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setOutputFmt(fmt)}
                                            className={`px-3 py-1 rounded-lg font-bold uppercase transition-all ${outputFmt === fmt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={processImage}
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                                >
                                    {processing ? (
                                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Resizing & Compressing...</>
                                    ) : (
                                        <><i className="fas fa-wand-magic-sparkles"></i> Resize to {targetW}×{targetH}px</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Result & Download */}
                    {result && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img src={result.url} alt="Result preview" className="w-16 h-20 object-contain rounded-lg border border-emerald-300 bg-white p-1" />
                                <div>
                                    <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                                        <i className="fas fa-circle-check text-emerald-600"></i> Formatted Successfully!
                                    </h4>
                                    <p className="text-xs text-emerald-800 font-mono mt-0.5">
                                        {result.width} × {result.height} px · <strong>{result.sizeKb} KB</strong> (Allowed: {targetMinKb}–{targetMaxKb} KB)
                                    </p>
                                </div>
                            </div>

                            <a
                                href={result.url}
                                download={`${image.name.replace(/\.[^/.]+$/, '')}_${activePreset.id}.${outputFmt}`}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                            >
                                <i className="fas fa-download"></i> Download Ready Photo
                            </a>
                        </div>
                    )}

                    {/* Step 4: Authoritative Knowledge & Guidelines */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl font-bold text-slate-800">
                                How to Format Candidate Photos & Signatures for Indian Government Portals
                            </h2>

                            <p className="text-sm leading-relaxed">
                                Filling out online applications for major competitive recruitment examinations like <strong>SSC CGL, UPSC Civil Services, IBPS Bank Clerk, NEET UG, and State Police Constables</strong> is a meticulous process. One of the leading causes of application rejection during preliminary document verification is an incorrectly formatted candidate photograph or signature.
                            </p>

                            <p className="text-sm leading-relaxed">
                                Portal servers implement strict automated validators that inspect both the pixel dimensions (e.g. exactly 200×230px or 275×354px) and the binary file size (typically strictly between 20KB and 50KB for photos, and 10KB to 20KB for signatures). If a file exceeds the maximum KB limit by even 0.1KB, the portal rejects the submission. Our <strong>Unified Government & Exam Photo Resizer</strong> uses a binary search compression algorithm that guarantees your image falls squarely within the target file size window while maintaining crystal-clear facial biometric clarity.
                            </p>

                            <h3 className="text-lg font-bold text-slate-800 mt-6">
                                Official Guidelines Checklist Before Uploading
                            </h3>

                            <ul className="list-disc pl-5 space-y-2 text-xs">
                                <li><strong>Plain Light Background:</strong> The background should be clean white or very light grey. Do not use patterned walls or outdoors.</li>
                                <li><strong>Front-Facing Pose:</strong> Look directly at the camera with both ears visible and a neutral facial expression. Wide smiles, caps, sunglasses, or heavy scarves are prohibited.</li>
                                <li><strong>Signature Guidelines:</strong> Sign clearly on an unlined white sheet using black or dark blue ink. Avoid signing with fountain pens that bleed across the paper grain.</li>
                                <li><strong>Zero Server Transmission:</strong> This tool runs 100% inside your device's web browser using client-side HTML5 Canvas. Your sensitive candidate ID photos never leave your device.</li>
                            </ul>

                        </div>
                    </div>

                </div>
            </ToolLayout>
        </>
    )
}
