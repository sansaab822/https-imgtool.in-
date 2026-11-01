import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

// ── CRC32 implementation for PNG pHYs chunk calculation ───────────────────────
function makeCrcTable() {
    let c
    const table = []
    for (let n = 0; n < 256; n++) {
        c = n
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        }
        table[n] = c
    }
    return table
}
const CRC_TABLE = makeCrcTable()

function crc32(buf, offset, length) {
    let crc = 0 ^ -1
    for (let i = offset; i < offset + length; i++) {
        crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff]
    }
    return (crc ^ -1) >>> 0
}

// ── Change JPEG DPI Losslessly via JFIF Segment ───────────────────────────────
function changeJpegDpi(arrayBuffer, dpi) {
    const view = new DataView(arrayBuffer)
    if (view.getUint16(0) !== 0xffd8) {
        throw new Error('Not a valid JPEG file')
    }

    // Check if first marker is APP0 (JFIF)
    if (view.getUint16(2) === 0xffe0) {
        const length = view.getUint16(4)
        // Check "JFIF\0" identifier
        if (
            view.getUint8(6) === 0x4a &&
            view.getUint8(7) === 0x46 &&
            view.getUint8(8) === 0x49 &&
            view.getUint8(9) === 0x46 &&
            view.getUint8(10) === 0x00
        ) {
            // Found existing JFIF segment! Modify in-place:
            // Byte 13: Units (1 = dots per inch)
            view.setUint8(13, 1)
            // Bytes 14-15: Xdensity
            view.setUint16(14, dpi, false)
            // Bytes 16-17: Ydensity
            view.setUint16(16, dpi, false)
            return new Blob([arrayBuffer], { type: 'image/jpeg' })
        }
    }

    // If no JFIF APP0 is present, inject an 18-byte JFIF APP0 marker immediately after SOI (0xFFD8)
    const jfifMarker = new Uint8Array([
        0xff, 0xe0, // APP0 marker
        0x00, 0x10, // Length: 16 bytes
        0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
        0x01, 0x01, // Version 1.01
        0x01, // Units: 1 = DPI
        (dpi >> 8) & 0xff, dpi & 0xff, // Xdensity
        (dpi >> 8) & 0xff, dpi & 0xff, // Ydensity
        0x00, 0x00 // Thumbnail X and Y (0)
    ])

    const originalBytes = new Uint8Array(arrayBuffer)
    const newBytes = new Uint8Array(originalBytes.length + jfifMarker.length)

    // Copy SOI (first 2 bytes)
    newBytes[0] = 0xff
    newBytes[1] = 0xd8

    // Insert JFIF marker
    newBytes.set(jfifMarker, 2)

    // Copy the rest of the original JPEG
    newBytes.set(originalBytes.subarray(2), 2 + jfifMarker.length)

    return new Blob([newBytes], { type: 'image/jpeg' })
}

// ── Change PNG DPI Losslessly via pHYs Chunk ──────────────────────────────────
function changePngDpi(arrayBuffer, dpi) {
    const bytes = new Uint8Array(arrayBuffer)
    // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
        throw new Error('Not a valid PNG file')
    }

    // Convert DPI to pixels per meter (1 inch = 0.0254 meters)
    const ppm = Math.round(dpi / 0.0254)

    // Create 9-byte data for pHYs chunk: [ppmX (4), ppmY (4), unit (1)]
    const physData = new Uint8Array(9)
    const dView = new DataView(physData.buffer)
    dView.setUint32(0, ppm, false)
    dView.setUint32(4, ppm, false)
    dView.setUint8(8, 1) // 1 = meters

    // Build the complete 21-byte chunk: Length (4) + Type (4) + Data (9) + CRC (4)
    const physChunk = new Uint8Array(21)
    const cView = new DataView(physChunk.buffer)
    cView.setUint32(0, 9, false) // Data length
    physChunk[4] = 0x70 // 'p'
    physChunk[5] = 0x48 // 'H'
    physChunk[6] = 0x79 // 'y'
    physChunk[7] = 0x73 // 's'
    physChunk.set(physData, 8)

    // Compute CRC over Type + Data (13 bytes)
    const crc = crc32(physChunk, 4, 13)
    cView.setUint32(17, crc, false)

    // Scan for existing pHYs chunk or insert immediately after IHDR (which ends at byte 33)
    let pos = 8
    let foundPhys = -1
    let physLength = 0

    while (pos < bytes.length) {
        const len = (bytes[pos] << 24) | (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3]
        const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7])
        if (type === 'pHYs') {
            foundPhys = pos
            physLength = len + 12
            break
        }
        pos += len + 12
    }

    let outBytes
    if (foundPhys !== -1) {
        // Replace existing pHYs chunk
        outBytes = new Uint8Array(bytes.length)
        outBytes.set(bytes.subarray(0, foundPhys), 0)
        outBytes.set(physChunk, foundPhys)
        outBytes.set(bytes.subarray(foundPhys + physLength), foundPhys + 21)
    } else {
        // Insert pHYs right after IHDR chunk (IHDR length 13 + 12 chunk header/footer = at offset 33)
        const insertPos = 33
        outBytes = new Uint8Array(bytes.length + 21)
        outBytes.set(bytes.subarray(0, insertPos), 0)
        outBytes.set(physChunk, insertPos)
        outBytes.set(bytes.subarray(insertPos), insertPos + 21)
    }

    return new Blob([outBytes], { type: 'image/png' })
}

// ── Read Current DPI ─────────────────────────────────────────────────────────
function detectDpi(arrayBuffer, fileType) {
    try {
        const view = new DataView(arrayBuffer)
        if (fileType === 'image/jpeg' || view.getUint16(0) === 0xffd8) {
            if (view.getUint16(2) === 0xffe0) {
                const units = view.getUint8(13)
                const x = view.getUint16(14, false)
                if (units === 1) return x // DPI
                if (units === 2) return Math.round(x * 2.54) // DPCM to DPI
            }
        } else if (fileType === 'image/png') {
            const bytes = new Uint8Array(arrayBuffer)
            let pos = 8
            while (pos < bytes.length) {
                const len = (bytes[pos] << 24) | (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3]
                const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7])
                if (type === 'pHYs') {
                    const ppmX = (bytes[pos + 8] << 24) | (bytes[pos + 9] << 16) | (bytes[pos + 10] << 8) | bytes[pos + 11]
                    const unit = bytes[pos + 16]
                    if (unit === 1) return Math.round(ppmX * 0.0254)
                }
                pos += len + 12
            }
        }
    } catch { }
    return 72 // Standard web default
}

export default function ImageDpiConverter() {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileType, setFileType] = useState('image/jpeg')
    const [previewUrl, setPreviewUrl] = useState(null)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [originalDpi, setOriginalDpi] = useState(72)
    const [targetDpi, setTargetDpi] = useState(300)
    const [customDpi, setCustomDpi] = useState('300')
    const [resultBlob, setResultBlob] = useState(null)
    const [resultUrl, setResultUrl] = useState(null)
    const [processing, setProcessing] = useState(false)

    const fileInputRef = useRef(null)

    const handleFile = useCallback(async (selectedFile) => {
        if (!selectedFile || !selectedFile.type.startsWith('image/')) return
        setFile(selectedFile)
        setFileName(selectedFile.name.replace(/\.[^/.]+$/, ''))
        setFileType(selectedFile.type)
        setResultUrl(null)
        setResultBlob(null)

        const buf = await selectedFile.arrayBuffer()
        const detected = detectDpi(buf, selectedFile.type)
        setOriginalDpi(detected)

        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)

        const img = new Image()
        img.onload = () => {
            setWidth(img.naturalWidth)
            setHeight(img.naturalHeight)
        }
        img.src = url
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const processDpi = async (dpiValue = targetDpi) => {
        if (!file) return
        setProcessing(true)

        try {
            const buf = await file.arrayBuffer()
            let modifiedBlob

            if (fileType === 'image/png') {
                modifiedBlob = changePngDpi(buf, dpiValue)
            } else {
                modifiedBlob = changeJpegDpi(buf, dpiValue)
            }

            const url = URL.createObjectURL(modifiedBlob)
            setResultBlob(modifiedBlob)
            setResultUrl(url)
        } catch (err) {
            alert('Conversion error: ' + err.message)
        }

        setProcessing(false)
    }

    // Physical dimensions calculations
    const activeDpi = targetDpi || 300
    const printWidthInches = width > 0 ? (width / activeDpi).toFixed(2) : 0
    const printHeightInches = height > 0 ? (height / activeDpi).toFixed(2) : 0
    const printWidthCm = (printWidthInches * 2.54).toFixed(1)
    const printHeightCm = (printHeightInches * 2.54).toFixed(1)

    // Structured data
    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Image DPI Converter - Change Image to 300 DPI Online',
        url: 'https://imgtool.in/image-dpi-converter',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. HTML5 compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Losslessly convert images to 300 DPI, 600 DPI, or custom print resolutions in your browser without quality loss or server uploads.',
    }

    return (
        <>
            <SEO
                title="Image DPI Converter - Convert Image to 300 DPI Online Free"
                description="Change image DPI to 300 DPI, 600 DPI, or custom resolution losslessly without re-encoding pixels. 100% private in-browser print resolution tool."
                canonical="/image-dpi-converter"
                keywords="change image dpi, convert image to 300 dpi online, 300 dpi converter, make image 300 dpi, png to 300 dpi, change photo dpi, print resolution converter"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="image-dpi-converter"
                title="Image DPI Converter (300 &amp; 600 DPI)"
                description="Losslessly change the DPI (dots per inch) resolution of your photos for official print forms, academic papers, and passports without reducing visual quality."
                breadcrumb="Image DPI Converter"
            >
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Step 1: Upload Dropzone */}
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
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                                    <i className="fas fa-print"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    Drop your image here or <span className="text-indigo-600 underline">browse</span>
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                                    Supports JPEG and PNG formats. Lossless header patching preserves 100% original pixel quality.
                                </p>
                                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                                    <span><i className="fas fa-shield-alt text-indigo-600 mr-1"></i> 100% Lossless (Zero Re-compression)</span>
                                    <span>•</span>
                                    <span><i className="fas fa-lock text-emerald-500 mr-1"></i> Client-Side Privacy</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Interactive DPI Dashboard */}
                    {file && (
                        <div className="grid lg:grid-cols-12 gap-6">

                            {/* Left: Preview & Dimensions (6 cols) */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 truncate max-w-[240px]">{fileName}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{fileType.toUpperCase()}</p>
                                        </div>
                                        <button
                                            onClick={() => { setFile(null); setResultUrl(null) }}
                                            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                                        >
                                            Change Image
                                        </button>
                                    </div>

                                    {/* Image Preview Box */}
                                    <div className="w-full h-64 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-100">
                                        <img
                                            src={previewUrl}
                                            alt="Source preview"
                                            className="max-w-full max-h-full object-contain rounded drop-shadow-sm"
                                        />
                                    </div>

                                    {/* Detected Specs Badge */}
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-slate-500 block mb-0.5">Detected Resolution:</span>
                                            <span className="font-bold text-slate-800 text-sm">{originalDpi} DPI</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-slate-500 block mb-0.5">Pixel Dimensions:</span>
                                            <span className="font-bold text-slate-800 text-sm">{width} × {height} px</span>
                                        </div>
                                    </div>

                                    {/* Physical Print Size Estimate */}
                                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs space-y-1.5">
                                        <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                                            <i className="fas fa-ruler-combined text-indigo-600"></i> Expected Physical Print Size at {activeDpi} DPI:
                                        </span>
                                        <div className="flex justify-between text-indigo-900 font-mono text-sm pt-1">
                                            <span>{printWidthInches}″ × {printHeightInches}″</span>
                                            <span className="text-indigo-600 font-sans">({printWidthCm} × {printHeightCm} cm)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Target DPI Controls (6 cols) */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                        <i className="fas fa-sliders text-indigo-600"></i> Select Target Print Resolution
                                    </h3>

                                    {/* DPI Presets */}
                                    <div className="space-y-2">
                                        {[
                                            { dpi: 300, label: '300 DPI — Standard Print & Journals', desc: 'Required by IEEE, Elsevier, passports & visa portals', badge: 'Recommended' },
                                            { dpi: 600, label: '600 DPI — Fine Art & Archival', desc: 'High-density gallery prints & medical imaging' },
                                            { dpi: 150, label: '150 DPI — Office Proof / Draft', desc: 'Flyers, newsletters, and internal documents' },
                                            { dpi: 72, label: '72 DPI — Web & Screen Resolution', desc: 'Standard monitor display density' },
                                        ].map((p) => (
                                            <button
                                                key={p.dpi}
                                                onClick={() => { setTargetDpi(p.dpi); setCustomDpi(String(p.dpi)) }}
                                                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                                                    targetDpi === p.dpi
                                                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-600'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                }`}
                                            >
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <span>{p.label}</span>
                                                        {p.badge && (
                                                            <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-semibold">
                                                                {p.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{p.desc}</p>
                                                </div>
                                                <span className="font-mono text-xs font-bold text-indigo-600">{p.dpi}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom DPI Input */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                                        <label className="font-semibold text-slate-700">Or Custom DPI:</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="10"
                                                max="2400"
                                                value={customDpi}
                                                onChange={(e) => {
                                                    setCustomDpi(e.target.value)
                                                    const val = Number(e.target.value)
                                                    if (val > 0) setTargetDpi(val)
                                                }}
                                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-center focus:border-indigo-600 focus:outline-none"
                                            />
                                            <span className="font-bold text-slate-500">DPI</span>
                                        </div>
                                    </div>

                                    {/* Process Button */}
                                    <button
                                        onClick={() => processDpi(targetDpi)}
                                        disabled={processing}
                                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm"
                                    >
                                        {processing ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Patching binary headers...</>
                                        ) : (
                                            <><i className="fas fa-wand-magic-sparkles"></i> Convert to {targetDpi} DPI</>
                                        )}
                                    </button>

                                    {/* Download Success Card */}
                                    {resultUrl && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 animate-fade-in">
                                            <div>
                                                <h4 className="font-bold text-emerald-900 text-xs">Successfully Converted to {targetDpi} DPI!</h4>
                                                <p className="text-[11px] text-emerald-700 mt-0.5">Pixel dimensions and image quality 100% preserved.</p>
                                            </div>
                                            <a
                                                href={resultUrl}
                                                download={`${fileName}-${targetDpi}dpi.${fileType === 'image/png' ? 'png' : 'jpg'}`}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                                            >
                                                <i className="fas fa-download"></i> Download
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: SEO Content & Guide */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                How to Change Image DPI to 300 Without Losing Quality
                            </h2>

                            <p className="text-base leading-relaxed">
                                When preparing photographs for academic journal submissions (such as IEEE, Springer, or Elsevier), official government visa applications, or professional offset printing, you will frequently encounter the mandatory specification: <em>"Images must be at least 300 DPI."</em>
                            </p>

                            <p className="text-base leading-relaxed">
                                Most smartphone photos and web graphics default to 72 or 96 DPI metadata. If you attempt to fix this using standard photo editing software, the program often resamples or re-compresses the image, introducing blurry artifacts or modifying the pixel count. Our free online <strong>Image DPI Converter</strong> uses lossless binary header modification. It updates the JFIF density segment in JPEG files and the <code>pHYs</code> chunk in PNG files in device RAM without touching a single pixel or re-encoding your photo.
                            </p>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-gem"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">100% Lossless</h4>
                                    <p className="text-xs text-slate-600">Zero re-compression or pixel loss. File size and visual fidelity remain perfectly intact.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Browser-Based Privacy</h4>
                                    <p className="text-xs text-slate-600">Your research figures, personal photos, and sensitive documents never touch a third-party server.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 font-bold">
                                        <i className="fas fa-calculator"></i>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Print Size Calculator</h4>
                                    <p className="text-xs text-slate-600">Instantly inspect how many inches and centimeters your photo will physically print at 300 or 600 DPI.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                DPI vs. PPI: Understanding Image Resolution
                            </h3>

                            <p className="text-base leading-relaxed">
                                While often used interchangeably, <strong>PPI (Pixels Per Inch)</strong> describes the display density of digital screens or digital image files, whereas <strong>DPI (Dots Per Inch)</strong> describes the physical density of ink droplets that a printer deposits onto paper.
                            </p>

                            <p className="text-base leading-relaxed">
                                Changing the DPI of an image does not add or remove pixels from your photograph. It simply updates the instructions telling the printer how densely to space those pixels on paper. For example, a 3000×2000 pixel image printed at 300 DPI will create a crisp 10×6.67 inch photograph. That exact same 3000×2000 pixel image printed at 72 DPI would be stretched across 41.6×27.7 inches, looking pixelated and blurry when viewed up close.
                            </p>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Will converting to 300 DPI increase the file size?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. Because our converter updates metadata headers losslessly rather than inflating pixel count, the file size remains virtually identical (within 20 bytes).
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Why did the portal reject my photo even after converting to 300 DPI?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Portals usually check two separate things: the metadata DPI flag (300 DPI) AND the minimum pixel dimensions (e.g. at least 600×600 pixels). If your starting image was tiny (e.g. 100×100 px), you must first use our <a href="/image-resizer" className="text-indigo-600 font-semibold underline">Image Resizer</a> to meet the required pixel dimensions.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Which formats support DPI metadata?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        JPEG (via JFIF APP0 marker or Exif) and PNG (via the standard pHYs chunk) natively support DPI metadata. WebP does not have a universally standardized print density chunk, so JPEG or PNG is recommended for print submissions.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </ToolLayout>
        </>
    )
}

