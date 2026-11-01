import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

function readFileAsBuffer(file) {
    return new Promise((res) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target.result)
        reader.readAsArrayBuffer(file)
    })
}

// Minimal robust EXIF reader
function parseExif(buffer) {
    const view = new DataView(buffer)
    if (view.getUint16(0) !== 0xFFD8) return null // not JPEG
    let offset = 2
    while (offset < view.byteLength) {
        const marker = view.getUint16(offset)
        offset += 2
        if (marker === 0xFFE1) {
            const len = view.getUint16(offset)
            const exifData = new DataView(buffer, offset + 2, len - 2)
            const exifHeader = String.fromCharCode(
                exifData.getUint8(0), exifData.getUint8(1),
                exifData.getUint8(2), exifData.getUint8(3)
            )
            if (exifHeader === 'Exif') return parseIFD(exifData, 8)
        }
        if ((marker & 0xFF00) !== 0xFF00) break
        offset += view.getUint16(offset)
    }
    return null
}

const EXIF_TAGS = {
    0x010F: 'Camera Make', 0x0110: 'Camera Model', 0x0112: 'Orientation',
    0x011A: 'X Resolution', 0x011B: 'Y Resolution', 0x0128: 'Resolution Unit',
    0x0131: 'Software', 0x0132: 'Date/Time Taken', 0x013B: 'Artist',
    0x013E: 'White Point', 0x013F: 'Primary Chromaticities',
    0x8298: 'Copyright', 0x8769: 'Exif IFD',
    0x829A: 'Exposure Time', 0x829D: 'F-Number (Aperture)', 0x8822: 'Exposure Program',
    0x8827: 'ISO Speed Rating', 0x9003: 'Original Timestamp', 0x9004: 'Digitized Timestamp',
    0x9201: 'Shutter Speed', 0x9202: 'Aperture Value', 0x9203: 'Brightness',
    0x9204: 'Exposure Bias', 0x9205: 'Max Aperture', 0x9207: 'Metering Mode',
    0x9208: 'Light Source', 0x9209: 'Flash Fired', 0x920A: 'Focal Length',
    0xA402: 'Exposure Mode', 0xA403: 'White Balance', 0xA404: 'Digital Zoom Ratio',
    0xA405: 'Focal Length 35mm', 0xA406: 'Scene Capture Type',
    0x0001: 'GPS Latitude Ref', 0x0002: 'GPS Latitude',
    0x0003: 'GPS Longitude Ref', 0x0004: 'GPS Longitude',
    0x0006: 'GPS Altitude', 0x001D: 'GPS Date',
}

function parseIFD(view, offset) {
    try {
        const littleEndian = view.getUint16(0) === 0x4949
        const count = view.getUint16(offset, littleEndian)
        const result = {}
        for (let i = 0; i < count; i++) {
            const entryOffset = offset + 2 + i * 12
            const tag = view.getUint16(entryOffset, littleEndian)
            const type = view.getUint16(entryOffset + 2, littleEndian)
            const numValues = view.getUint32(entryOffset + 4, littleEndian)
            let value = ''
            try {
                if (type === 2) { // ASCII
                    const strOffset = numValues > 4 ? view.getUint32(entryOffset + 8, littleEndian) : entryOffset + 8
                    for (let j = 0; j < numValues - 1; j++) {
                        const c = view.getUint8(strOffset + j)
                        if (c) value += String.fromCharCode(c)
                    }
                } else if (type === 3 && numValues === 1) { // SHORT
                    value = view.getUint16(entryOffset + 8, littleEndian)
                } else if (type === 4 && numValues === 1) { // LONG
                    value = view.getUint32(entryOffset + 8, littleEndian)
                } else if (type === 5) { // RATIONAL
                    const ratOffset = view.getUint32(entryOffset + 8, littleEndian)
                    const num = view.getUint32(ratOffset, littleEndian)
                    const den = view.getUint32(ratOffset + 4, littleEndian)
                    value = den ? `${(num / den).toFixed(4)}` : `${num}/${den}`
                }
            } catch { }
            if (EXIF_TAGS[tag] && value !== '') result[EXIF_TAGS[tag]] = String(value).trim()
        }
        return result
    } catch { return {} }
}

// ── Binary Lossless EXIF Stripper for JPEGs ──────────────────────────────────
function stripJpegExifLossless(arrayBuffer) {
    const view = new DataView(arrayBuffer)
    if (view.getUint16(0) !== 0xFFD8) {
        throw new Error('Not a JPEG file.')
    }

    const chunks = [new Uint8Array(arrayBuffer, 0, 2)] // SOI (0xFF 0xD8)
    let offset = 2
    let strippedCount = 0

    while (offset < view.byteLength) {
        if (view.getUint8(offset) !== 0xFF) {
            // SOS payload started, copy remaining buffer to end
            chunks.push(new Uint8Array(arrayBuffer, offset))
            break
        }

        const marker = view.getUint16(offset)
        if (marker === 0xFFDA) { // SOS marker
            chunks.push(new Uint8Array(arrayBuffer, offset))
            break
        }

        const length = view.getUint16(offset + 2)

        // Strip APP1 (0xFFE1 = EXIF/XMP) and APP13 (0xFFED = Photoshop IPTC)
        if (marker === 0xFFE1 || marker === 0xFFED) {
            strippedCount++
            offset += 2 + length
            continue
        }

        // Keep all other segments (DQT, DHT, SOF, etc.)
        chunks.push(new Uint8Array(arrayBuffer, offset, 2 + length))
        offset += 2 + length
    }

    // Merge chunks
    const totalLen = chunks.reduce((acc, c) => acc + c.length, 0)
    const result = new Uint8Array(totalLen)
    let pos = 0
    for (const chunk of chunks) {
        result.set(chunk, pos)
        pos += chunk.length
    }
    return { data: result, strippedCount }
}

export default function ImageMetadataViewer() {
    const [image, setImage] = useState(null)
    const [meta, setMeta] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [copied, setCopied] = useState(false)
    const [strippedUrl, setStrippedUrl] = useState(null)
    const [stripMessage, setStripMessage] = useState('')
    const fileInputRef = useRef(null)

    const handleFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) return
        setStrippedUrl(null)
        setStripMessage('')
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            const basicMeta = {
                'File Name': file.name,
                'File Size': file.size < 1048576 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1048576).toFixed(2)} MB`,
                'File Type': file.type || 'Unknown',
                'Dimensions': `${img.naturalWidth} × ${img.naturalHeight} pixels`,
                'Aspect Ratio': `${(img.naturalWidth / img.naturalHeight).toFixed(2)}:1`,
                'Megapixels': `${((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2)} MP`,
                'Last Modified': new Date(file.lastModified).toLocaleDateString(),
            }

            readFileAsBuffer(file).then(buf => {
                const exif = parseExif(buf)
                setMeta({ basic: basicMeta, exif, file, img })
            })
        }
        img.src = url
        setImage({ file, url })
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const copyAll = () => {
        if (!meta) return
        const lines = []
        lines.push('--- FILE INFO ---')
        Object.entries(meta.basic).forEach(([k, v]) => lines.push(`${k}: ${v}`))
        if (meta.exif && Object.keys(meta.exif).length > 0) {
            lines.push('\n--- EXIF CAMERA DATA ---')
            Object.entries(meta.exif).forEach(([k, v]) => lines.push(`${k}: ${v}`))
        }
        navigator.clipboard.writeText(lines.join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── Strip Metadata & Download Clean Image ──────────────────────────────────
    const stripMetadata = async () => {
        if (!meta || !meta.file) return
        try {
            const file = meta.file
            const isJpeg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')

            if (isJpeg) {
                // Lossless JPEG stripping
                const buf = await file.arrayBuffer()
                const { data } = stripJpegExifLossless(buf)
                const blob = new Blob([data], { type: 'image/jpeg' })
                const url = URL.createObjectURL(blob)
                setStrippedUrl(url)
                setStripMessage('All GPS coordinates, device serials, and EXIF headers were stripped losslessly!')
            } else {
                // Canvas strip for PNG / WebP
                const canvas = document.createElement('canvas')
                canvas.width = meta.img.naturalWidth
                canvas.height = meta.img.naturalHeight
                const ctx = canvas.getContext('2d')
                ctx.drawImage(meta.img, 0, 0)
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob)
                    setStrippedUrl(url)
                    setStripMessage('All hidden metadata removed cleanly!')
                }, file.type || 'image/png')
            }
        } catch (err) {
            alert('Failed to strip metadata: ' + err.message)
        }
    }

    const MetaRow = ({ label, value }) => (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 text-sm">
            <span className="text-slate-500 font-medium text-xs">{label}</span>
            <span className="font-semibold text-slate-800 text-right max-w-xs truncate text-xs font-mono">{value}</span>
        </div>
    )

    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Image Metadata Viewer & EXIF Privacy Stripper',
        url: 'https://imgtool.in/image-metadata-viewer',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        description: 'View hidden EXIF camera metadata, GPS coordinates, and shooting specs. Strip metadata losslessly to protect your privacy online.',
    }

    return (
        <>
            <SEO
                title="Image Metadata Viewer & EXIF Remover Free - View & Strip EXIF"
                description="View hidden camera metadata, GPS location, and camera settings from your photos. Strip EXIF data online 100% losslessly for complete digital privacy."
                canonical="/image-metadata-viewer"
                keywords="image metadata viewer, view exif online, remove exif data, strip photo metadata, delete gps from photo, exif remover free, photo privacy cleaner"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="image-metadata-viewer"
                title="Image Metadata Viewer & EXIF Stripper"
                description="Inspect hidden EXIF camera tags, camera models, shutter speeds, and GPS coordinates. Strip all metadata with one click to protect your privacy."
                breadcrumb="Metadata Viewer"
            >
                {/* Upload */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${image ? 'border-blue-400 bg-blue-50' : ''}`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={e => handleFile(e.target.files[0])}
                            className="hidden"
                        />
                        {image ? (
                            <div className="flex flex-col items-center gap-3">
                                <img src={image.url} alt="Uploaded" className="w-24 h-24 object-contain rounded-xl border border-blue-200 shadow-xs" />
                                <p className="text-sm font-semibold text-blue-700">{image.file.name}</p>
                                <p className="text-xs text-slate-400">Click to analyze a different image</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <p className="font-bold text-slate-800 text-base">Drop any image to view & strip metadata</p>
                                <p className="text-sm text-slate-400">JPEG, PNG, WebP, HEIC · 100% private in-browser analysis</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Dashboard */}
                {meta && (
                    <div className="space-y-4 mb-6">
                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={stripMetadata}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
                                >
                                    <i className="fas fa-shield-halved"></i> Strip All Metadata & Clean
                                </button>
                                <button
                                    onClick={copyAll}
                                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                                >
                                    <i className={`fas ${copied ? 'fa-check text-green-600' : 'fa-copy'}`}></i>
                                    {copied ? 'Copied Details!' : 'Copy Metadata'}
                                </button>
                            </div>

                            {strippedUrl && (
                                <a
                                    href={strippedUrl}
                                    download={`clean_${meta.file.name}`}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                                >
                                    <i className="fas fa-download"></i> Download Cleaned Photo
                                </a>
                            )}
                        </div>

                        {stripMessage && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                                <i className="fas fa-circle-check text-emerald-600"></i>
                                {stripMessage}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Basic File Info */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                    <i className="fas fa-file-image text-blue-500"></i> File Information
                                </h2>
                                {Object.entries(meta.basic).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)}
                            </div>

                            {/* EXIF Data */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                    <i className="fas fa-camera text-blue-500"></i> Camera & Exposure Tags
                                </h2>
                                {meta.exif && Object.keys(meta.exif).length > 0 ? (
                                    Object.entries(meta.exif).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)
                                ) : (
                                    <div className="py-8 text-center text-slate-400 text-xs">
                                        <i className="fas fa-shield-cat text-2xl mb-2 text-slate-300 block"></i>
                                        No EXIF tags detected. This file is already clean or in a format without EXIF markers.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Comprehensive SEO Content */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-6 prose max-w-none text-slate-600 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">What is Image EXIF Metadata and Why is It a Privacy Risk?</h2>
                    <p>
                        Every time you capture a picture with your smartphone, digital mirrorless camera, or drone, the camera automatically embeds a hidden data block called <strong>EXIF (Exchangeable Image File Format)</strong> inside the image file. This metadata records extensive technical information, including the exact camera model, lens serial number, focal length, ISO, and shutter speed.
                    </p>
                    <p>
                        Most critically, if location services were enabled on your smartphone, your photos include precise <strong>GPS Latitude, Longitude, and Altitude coordinates</strong>. When you upload photos to online marketplaces (Craigslist, Facebook Marketplace, classified ads), personal blogs, or forums, anyone who downloads that image can read those GPS coordinates and pinpoint your home address, school, or workplace with rooftop accuracy.
                    </p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6">Which Platforms Strip Metadata Automatically?</h3>
                    <div className="overflow-x-auto not-prose my-4">
                        <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                            <thead className="bg-slate-100 text-slate-700 font-bold">
                                <tr>
                                    <th className="p-3 border-b border-slate-200">Platform / Service</th>
                                    <th className="p-3 border-b border-slate-200">Strips EXIF GPS?</th>
                                    <th className="p-3 border-b border-slate-200">Risk Assessment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-3 font-semibold text-slate-800">Instagram, Facebook, X (Twitter)</td>
                                    <td className="p-3 text-emerald-600 font-bold">Yes (Automatically)</td>
                                    <td className="p-3 text-slate-500">Low risk: Social media CDN filters strip metadata during compression.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-semibold text-slate-800">Email Attachments (Gmail, Outlook)</td>
                                    <td className="p-3 text-red-600 font-bold">No (Full EXIF Retained)</td>
                                    <td className="p-3 text-slate-500">High risk: Files sent as attachments keep original GPS tags.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-semibold text-slate-800">Direct Cloud Links (Google Drive, Dropbox)</td>
                                    <td className="p-3 text-red-600 font-bold">No (100% Preserved)</td>
                                    <td className="p-3 text-slate-500">High risk: Shared file links keep all camera serials and GPS coordinates.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mt-6">How Our Lossless EXIF Stripper Protects You</h3>
                    <p>
                        Unlike online tools that upload your private photos to third-party servers to "clean" them, IMG Tool executes 100% in your local web browser. For JPEG images, we perform a <strong>lossless binary slice</strong>: we omit the APP1 (EXIF) and APP13 (IPTC) data segments while preserving 100% of the compressed image payload. The resulting photo is mathematically identical in visual quality, but completely scrubbed of personal identification markers.
                    </p>
                </div>
            </ToolLayout>
        </>
    )
}
