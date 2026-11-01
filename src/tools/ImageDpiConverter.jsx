import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── Common DPI Presets ────────────────────────────────────────────────────────
const DPI_PRESETS = [
    { value: 300, label: '300 DPI', tag: 'Standard Print & Passport', desc: 'Required by exam portals, passport offices, and print labs' },
    { value: 600, label: '600 DPI', tag: 'High-Res Archival', desc: 'For ultra-detailed fine art prints and professional lithography' },
    { value: 150, label: '150 DPI', tag: 'Newspaper & Drafts', desc: 'Standard resolution for newsprint and flyers' },
    { value: 72, label: '72 DPI', tag: 'Screen / Web', desc: 'Legacy standard screen display resolution' },
]

// ── Binary Lossless JFIF (JPEG) DPI Injector / Modifier ───────────────────────
function patchJpegDpi(arrayBuffer, targetDpi) {
    const view = new DataView(arrayBuffer)
    // Verify JPEG SOI marker (0xFF 0xD8)
    if (view.getUint16(0) !== 0xFFD8) {
        throw new Error('Not a valid JPEG image.')
    }

    let offset = 2
    let jfifFound = false

    // Scan for JFIF APP0 marker (0xFF 0xE0)
    while (offset < view.byteLength) {
        const marker = view.getUint16(offset)
        if (marker === 0xFFE0) {
            const length = view.getUint16(offset + 2)
            // Check for 'JFIF\0'
            if (
                view.getUint8(offset + 4) === 0x4A && // J
                view.getUint8(offset + 5) === 0x46 && // F
                view.getUint8(offset + 6) === 0x49 && // I
                view.getUint8(offset + 7) === 0x46 && // F
                view.getUint8(offset + 8) === 0x00
            ) {
                // Set density unit to 1 (pixels per inch / dots per inch)
                view.setUint8(offset + 11, 1)
                // Set X density
                view.setUint16(offset + 12, targetDpi)
                // Set Y density
                view.setUint16(offset + 14, targetDpi)
                jfifFound = true
                return new Uint8Array(arrayBuffer)
            }
        }
        if ((marker & 0xFF00) !== 0xFF00) break
        const segLen = view.getUint16(offset + 2)
        offset += 2 + segLen
    }

    if (!jfifFound) {
        // Construct an APP0 JFIF marker block (18 bytes)
        const jfifHeader = new Uint8Array([
            0xFF, 0xE0, // Marker APP0
            0x00, 0x10, // Length = 16 bytes
            0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
            0x01, 0x01, // Version 1.01
            0x01,       // Density unit: 1 = dots per inch
            (targetDpi >> 8) & 0xFF, targetDpi & 0xFF, // X density
            (targetDpi >> 8) & 0xFF, targetDpi & 0xFF, // Y density
            0x00, 0x00  // Thumbnail size: 0x0
        ])

        // Insert immediately after SOI marker (offset 2)
        const originalBytes = new Uint8Array(arrayBuffer)
        const combined = new Uint8Array(originalBytes.length + jfifHeader.length)
        combined.set(originalBytes.subarray(0, 2), 0)
        combined.set(jfifHeader, 2)
        combined.set(originalBytes.subarray(2), 2 + jfifHeader.length)
        return combined
    }

    return new Uint8Array(arrayBuffer)
}

// ── Binary Lossless pHYs (PNG) DPI Injector / Modifier ────────────────────────
function patchPngDpi(arrayBuffer, targetDpi) {
    const ppm = Math.round(targetDpi * 39.37007874015748) // Pixels per meter
    const originalBytes = new Uint8Array(arrayBuffer)

    // Check PNG signature
    if (
        originalBytes[0] !== 0x89 || originalBytes[1] !== 0x50 ||
        originalBytes[2] !== 0x4E || originalBytes[3] !== 0x47
    ) {
        throw new Error('Not a valid PNG image.')
    }

    // CRC32 calculation table
    const crcTable = []
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
        }
        crcTable[n] = c
    }
    const calcCrc = (buf, start, len) => {
        let crc = -1
        for (let i = start; i < start + len; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF]
        }
        return (crc ^ (-1)) >>> 0
    }

    // Create 9-byte pHYs data: 4 bytes X, 4 bytes Y, 1 byte unit (1 = meter)
    const physChunk = new Uint8Array(21) // 4 (len) + 4 (type) + 9 (data) + 4 (crc)
    const pView = new DataView(physChunk.buffer)
    pView.setUint32(0, 9) // Chunk data length
    physChunk[4] = 0x70 // p
    physChunk[5] = 0x48 // H
    physChunk[6] = 0x59 // Y
    physChunk[7] = 0x73 // s
    pView.setUint32(8, ppm)  // X pixels per unit
    pView.setUint32(12, ppm) // Y pixels per unit
    physChunk[16] = 1        // Unit: meter

    const crc = calcCrc(physChunk, 4, 13)
    pView.setUint32(17, crc)

    // Check if pHYs chunk already exists
    let offset = 8
    const view = new DataView(arrayBuffer)
    while (offset < view.byteLength) {
        const length = view.getUint32(offset)
        const type = String.fromCharCode(
            view.getUint8(offset + 4), view.getUint8(offset + 5),
            view.getUint8(offset + 6), view.getUint8(offset + 7)
        )

        if (type === 'pHYs') {
            // Overwrite existing pHYs chunk
            const updated = new Uint8Array(originalBytes)
            updated.set(physChunk, offset)
            return updated
        }

        if (type === 'IHDR') {
            // Insert pHYs immediately after IHDR chunk
            const insertAt = offset + 12 + length
            const combined = new Uint8Array(originalBytes.length + physChunk.length)
            combined.set(originalBytes.subarray(0, insertAt), 0)
            combined.set(physChunk, insertAt)
            combined.set(originalBytes.subarray(insertAt), insertAt + physChunk.length)
            return combined
        }

        offset += 12 + length
    }

    return originalBytes
}

export default function ImageDpiConverter() {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [previewUrl, setPreviewUrl] = useState(null)
    const [targetDpi, setTargetDpi] = useState(300)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [fileType, setFileType] = useState('jpeg')
    const [processing, setProcessing] = useState(false)
    const [resultBlob, setResultBlob] = useState(null)
    const [resultUrl, setResultUrl] = useState(null)
    const [error, setError] = useState('')

    const fileInputRef = useRef(null)

    const handleFile = useCallback((selectedFile) => {
        if (!selectedFile) return
        setError('')
        setResultUrl(null)
        setResultBlob(null)

        const isJpeg = selectedFile.type === 'image/jpeg' || selectedFile.name.toLowerCase().endsWith('.jpg') || selectedFile.name.toLowerCase().endsWith('.jpeg')
        const isPng = selectedFile.type === 'image/png' || selectedFile.name.toLowerCase().endsWith('.png')

        if (!isJpeg && !isPng) {
            setError('Please upload a JPG, JPEG, or PNG image. Other formats do not use standard DPI headers.')
            return
        }

        setFile(selectedFile)
        setFileName(selectedFile.name.replace(/\.[^/.]+$/, ''))
        setFileType(isJpeg ? 'jpeg' : 'png')

        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)

        const img = new Image()
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
        }
        img.src = url
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const convertDpi = async () => {
        if (!file) return
        setProcessing(true)
        setError('')

        try {
            const arrayBuffer = await file.arrayBuffer()
            let modifiedBytes

            if (fileType === 'jpeg') {
                modifiedBytes = patchJpegDpi(arrayBuffer, targetDpi)
            } else {
                modifiedBytes = patchPngDpi(arrayBuffer, targetDpi)
            }

            const mimeType = fileType === 'jpeg' ? 'image/jpeg' : 'image/png'
            const blob = new Blob([modifiedBytes], { type: mimeType })
            const url = URL.createObjectURL(blob)

            setResultBlob(blob)
            setResultUrl(url)
        } catch (err) {
            setError('Could not modify image metadata: ' + err.message)
        } finally {
            setProcessing(false)
        }
    }

    // Physical print dimension calculations
    const widthInches = dimensions.width ? (dimensions.width / targetDpi).toFixed(2) : '0'
    const heightInches = dimensions.height ? (dimensions.height / targetDpi).toFixed(2) : '0'
    const widthCm = dimensions.width ? ((dimensions.width / targetDpi) * 2.54).toFixed(2) : '0'
    const heightCm = dimensions.height ? ((dimensions.height / targetDpi) * 2.54).toFixed(2) : '0'

    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Lossless Image DPI Converter Online (300 DPI, 600 DPI)',
        url: 'https://imgtool.in/image-dpi-converter',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Binary DataView compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Convert image resolution to 300 DPI or 600 DPI losslessly online. Directly modifies JFIF and PNG metadata without recompressing or losing image quality.',
    }

    return (
        <>
            <SEO
                title="Convert Image to 300 DPI Online Free - Lossless DPI Converter"
                description="Change image DPI to 300 or 600 DPI losslessly online. Fast, browser-based metadata updater for passport photos, exam submissions, and print. No recompression."
                canonical="/image-dpi-converter"
                keywords="convert image to 300 dpi, change dpi of image online, 300 dpi converter free, make photo 300 dpi, convert jpg to 300 dpi, print resolution converter"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="image-dpi-converter"
                title="Lossless Image DPI Converter"
                description="Change your photo resolution to 300 DPI, 600 DPI, or any custom value. 100% lossless: modifies file metadata headers directly without altering or recompressing pixels."
                breadcrumb="DPI Converter"
            >
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Step 1: Upload */}
                    {!file && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                                    <i className="fas fa-print"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    Drop your photo here or <span className="text-indigo-600 underline">browse</span>
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                                    Supports JPG and PNG. Direct binary metadata updating ensures zero pixel loss or blurriness.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                                    <span><i className="fas fa-gem text-indigo-600 mr-1"></i> 100% Lossless (No Quality Loss)</span>
                                    <span>•</span>
                                    <span><i className="fas fa-shield-alt text-teal-600 mr-1"></i> Runs Locally in Browser</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-3">
                            <i className="fas fa-circle-exclamation mt-0.5 text-red-600"></i>
                            <div className="flex-1">{error}</div>
                        </div>
                    )}

                    {/* Step 2: Interactive DPI Selector & Converter */}
                    {file && (
                        <div className="grid md:grid-cols-12 gap-6">

                            {/* Left Column: Image Card & Physical Size (5 cols) */}
                            <div className="md:col-span-5 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
                                    <div className="aspect-square max-h-56 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-2 mb-3">
                                        <img src={previewUrl} alt="Upload preview" className="max-w-full max-h-full object-contain rounded-lg" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{file.name}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                        {dimensions.width} × {dimensions.height} pixels · {(file.size / 1024).toFixed(1)} KB
                                    </p>

                                    <button
                                        onClick={() => { setFile(null); setResultUrl(null) }}
                                        className="text-xs text-red-600 hover:underline font-semibold mt-3 inline-block"
                                    >
                                        Upload Different Image
                                    </button>
                                </div>

                                {/* Calculated Print Dimensions at Target DPI */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                                    <h5 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                                        <i className="fas fa-ruler-combined text-indigo-600"></i> Print Size at {targetDpi} DPI:
                                    </h5>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-white/80 p-2 rounded-lg border border-indigo-100">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Inches</span>
                                            <span className="font-bold text-slate-800">{widthInches}″ × {heightInches}″</span>
                                        </div>
                                        <div className="bg-white/80 p-2 rounded-lg border border-indigo-100">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Centimeters</span>
                                            <span className="font-bold text-slate-800">{widthCm} × {heightCm} cm</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: DPI Settings & Action (7 cols) */}
                            <div className="md:col-span-7 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                        <i className="fas fa-sliders text-indigo-600"></i> Select Target Resolution
                                    </h3>

                                    {/* Preset Cards */}
                                    <div className="space-y-2.5">
                                        {DPI_PRESETS.map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setTargetDpi(p.value)}
                                                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                                    targetDpi === p.value
                                                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-slate-900 text-sm">{p.label}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${targetDpi === p.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                            {p.tag}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                                                </div>
                                                <i className={`fas fa-check-circle text-lg ${targetDpi === p.value ? 'text-indigo-600' : 'text-slate-200'}`}></i>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom DPI Input */}
                                    <div className="pt-3 border-t border-slate-100">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Or enter custom DPI:</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="10"
                                                max="2400"
                                                value={targetDpi}
                                                onChange={(e) => setTargetDpi(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                                className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold"
                                            />
                                            <span className="text-xs text-slate-500 font-bold">Dots Per Inch (DPI)</span>
                                        </div>
                                    </div>

                                    {/* Execution Button */}
                                    <button
                                        onClick={convertDpi}
                                        disabled={processing}
                                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm"
                                    >
                                        {processing ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating Metadata...</>
                                        ) : (
                                            <><i className="fas fa-bolt"></i> Convert to {targetDpi} DPI (Lossless)</>
                                        )}
                                    </button>

                                    {/* Download Output */}
                                    {resultUrl && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <a
                                                href={resultUrl}
                                                download={`${fileName}_${targetDpi}dpi.${fileType === 'jpeg' ? 'jpg' : 'png'}`}
                                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center block text-sm transition-all shadow-md shadow-emerald-600/20"
                                            >
                                                <i className="fas fa-download mr-1.5"></i> Download {targetDpi} DPI Image
                                            </a>
                                            <p className="text-[11px] text-center text-slate-400 mt-1.5">
                                                Zero recompression applied. Pixel data remains identical to source.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Step 3: SEO Guide & Educational Knowledge Base */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                Understanding Image DPI: What It Means and Why 300 DPI Matters
                            </h2>

                            <p className="text-base leading-relaxed">
                                DPI stands for <strong>Dots Per Inch</strong>. It is a measurement of spatial print resolution that specifies how many individual dots of ink a physical printer will place within one linear inch of paper. When submitting photographs for international passports (such as US, UK, Schengen, or Indian passport renewals), government job examinations (like SSC, UPSC, and IBPS), or academic research publications (IEEE, Nature, Elsevier), portals frequently enforce a strict validator requirement: <em>"Image resolution must be exactly 300 DPI."</em>
                            </p>

                            <p className="text-base leading-relaxed">
                                Most smartphone cameras and digital scanners save images with a default header value of 72 DPI or 96 DPI, even when the photo has millions of pixels (e.g. 4000×3000px). Online form validators check the file's internal metadata tag (the JFIF marker in JPEGs or the pHYs chunk in PNGs) and immediately reject the upload, leaving applicants confused and stressed.
                            </p>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Why Our Lossless DPI Converter Is Superior
                            </h3>

                            <p className="text-base leading-relaxed">
                                Conventional online converters take your photo, draw it onto an uncalibrated canvas, and re-compress it into a new JPEG. This degrades image clarity, causes blurry blocky compression artifacts, and alters file dimensions.
                            </p>

                            <p className="text-base leading-relaxed">
                                Our tool works via <strong>direct binary header modification</strong>:
                            </p>

                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>100% Lossless:</strong> We parse the binary byte stream directly. We update the 18-byte JFIF APP0 header (in JPEG) or the 21-byte pHYs chunk (in PNG) while leaving 100% of the compressed image pixels completely untouched.</li>
                                <li><strong>Instant & Private:</strong> The entire process takes less than 10 milliseconds and executes strictly in your browser memory. Your private ID or personal photos are never uploaded to any cloud server.</li>
                                <li><strong>Zero File Degradation:</strong> Unlike other tools, your photo does not lose quality, colors do not shift, and delicate hair/facial details remain sharp.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Standard DPI Requirements by Application Type
                            </h3>

                            <div className="overflow-x-auto not-prose my-4">
                                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                                    <thead className="bg-slate-100 text-slate-700 font-bold">
                                        <tr>
                                            <th className="p-3 border-b border-slate-200">Application Type</th>
                                            <th className="p-3 border-b border-slate-200">Target DPI</th>
                                            <th className="p-3 border-b border-slate-200">Why It Is Enforced</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Passport & Visa Photos (US, UK, India)</td>
                                            <td className="p-3 text-indigo-700 font-bold">300 DPI</td>
                                            <td className="p-3 text-slate-600">Guarantees crisp biometric facial feature recognition when printed on physical passport booklets.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Academic Journals & Research Papers</td>
                                            <td className="p-3 text-indigo-700 font-bold">300 to 600 DPI</td>
                                            <td className="p-3 text-slate-600">Ensures scientific charts, micrographs, and data graphs remain readable when printed in journal volumes.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Government Exam Applications (SSC, IBPS, UPSC)</td>
                                            <td className="p-3 text-indigo-700 font-bold">200 to 300 DPI</td>
                                            <td className="p-3 text-slate-600">Mandated by NIC portal upload guidelines to verify candidate identity on admit cards.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Fine Art & Photography Printing</td>
                                            <td className="p-3 text-indigo-700 font-bold">600 DPI</td>
                                            <td className="p-3 text-slate-600">Eliminates visible halftone dot grain on large-format canvas and archival cotton rag paper.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Does changing the DPI change the pixel width and height?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. A 1200×1800 pixel image remains exactly 1200×1800 pixels. DPI only defines how densely those pixels are packed when sent to a physical printer or read by a document portal validator.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">How do I verify the DPI of my downloaded image?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        On Windows, right-click the downloaded file, choose <strong>Properties</strong>, navigate to the <strong>Details</strong> tab, and look for <em>Horizontal Resolution</em> and <em>Vertical Resolution</em>. Both will display 300 dpi. On Mac, open in Preview and press <strong>Command + I</strong> to inspect resolution.
                                    </p>
                                </div>
                            </div>

                            {/* Related Tools */}
                            <div className="mt-8 pt-6 border-t border-slate-200 not-prose">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Related Image & Document Tools</p>
                                <div className="flex flex-wrap gap-2">
                                    <a href="/passport-size-photo" className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-id-card mr-1 text-indigo-600"></i> Passport Size Photo Maker
                                    </a>
                                    <a href="/image-resizer" className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-expand mr-1 text-blue-600"></i> Image Resizer
                                    </a>
                                    <a href="/image-compressor" className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-compress-arrows-alt mr-1 text-orange-600"></i> Image Compressor
                                    </a>
                                    <a href="/image-metadata-viewer" className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors">
                                        <i className="fas fa-info-circle mr-1 text-teal-600"></i> View & Strip Metadata
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </ToolLayout>
        </>
    )
}

