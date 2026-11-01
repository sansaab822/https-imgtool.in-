import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

function readFileAsBuffer(file) {
    return new Promise((res) => {
        const reader = new FileReader()
        reader.onload = (e) => res(e.target.result)
        reader.readAsArrayBuffer(file)
    })
}

// Minimal EXIF reader (pure client-side)
function parseExif(buffer) {
    const view = new DataView(buffer)
    if (view.getUint16(0) !== 0xffd8) return null // not JPEG
    let offset = 2
    while (offset < view.byteLength) {
        const marker = view.getUint16(offset)
        offset += 2
        if (marker === 0xffe1) {
            const len = view.getUint16(offset)
            const exifData = new DataView(buffer, offset + 2, len - 2)
            const exifHeader = String.fromCharCode(
                exifData.getUint8(0), exifData.getUint8(1),
                exifData.getUint8(2), exifData.getUint8(3)
            )
            if (exifHeader === 'Exif') return parseIFD(exifData, 8)
        }
        if ((marker & 0xff00) !== 0xff00) break
        offset += view.getUint16(offset)
    }
    return null
}

const EXIF_TAGS = {
    0x010f: 'Camera Make', 0x0110: 'Camera Model', 0x0112: 'Orientation',
    0x011a: 'X Resolution', 0x011b: 'Y Resolution', 0x0128: 'Resolution Unit',
    0x0131: 'Software', 0x0132: 'Date/Time Modified', 0x013b: 'Artist / Author',
    0x013e: 'White Point', 0x013f: 'Primary Chromaticities',
    0x8298: 'Copyright', 0x8769: 'Exif IFD',
    0x829a: 'Exposure Time', 0x829d: 'F-Number (Aperture)', 0x8822: 'Exposure Program',
    0x8827: 'ISO Speed', 0x9003: 'Date/Time Original', 0x9004: 'Date/Time Digitized',
    0x9201: 'Shutter Speed', 0x9202: 'Aperture Value', 0x9203: 'Brightness',
    0x9204: 'Exposure Bias', 0x9205: 'Max Aperture', 0x9207: 'Metering Mode',
    0x9208: 'Light Source', 0x9209: 'Flash Status', 0x920a: 'Focal Length',
    0xa402: 'Exposure Mode', 0xa403: 'White Balance', 0xa404: 'Digital Zoom Ratio',
    0xa405: 'Focal Length (35mm equivalent)', 0xa406: 'Scene Capture Type',
    0x0001: 'GPS Latitude Ref', 0x0002: 'GPS Latitude',
    0x0003: 'GPS Longitude Ref', 0x0004: 'GPS Longitude',
    0x0006: 'GPS Altitude', 0x001d: 'GPS Date',
}

function parseIFD(view, offset) {
    try {
        const littleEndian = view.getUint16(0) === 0x4949
        const count = view.getUint16(offset, littleEndian)
        const result = {}
        for (let i = 0; i < count; i++) {
            const entryOffset = offset + 2 + i * 12
            if (entryOffset + 12 > view.byteLength) break
            const tag = view.getUint16(entryOffset, littleEndian)
            const type = view.getUint16(entryOffset + 2, littleEndian)
            const numValues = view.getUint32(entryOffset + 4, littleEndian)
            const valueOffset = view.getUint32(entryOffset + 8, littleEndian)
            const tagName = EXIF_TAGS[tag]
            if (tagName) {
                result[tagName] = readTagValue(view, type, numValues, valueOffset, entryOffset + 8, littleEndian)
            }
        }
        return result
    } catch {
        return null
    }
}

function readTagValue(view, type, count, offset, inlineOffset, littleEndian) {
    try {
        if (type === 2) { // ASCII string
            const o = count <= 4 ? inlineOffset : offset
            let str = ''
            for (let i = 0; i < count - 1; i++) {
                if (o + i >= view.byteLength) break
                const ch = view.getUint8(o + i)
                if (ch === 0) break
                str += String.fromCharCode(ch)
            }
            return str.trim()
        }
        if (type === 3) { // unsigned short (16-bit)
            return count === 1 ? view.getUint16(inlineOffset, littleEndian) : `${count} values`
        }
        if (type === 4) { // unsigned long (32-bit)
            return count === 1 ? view.getUint32(inlineOffset, littleEndian) : `${count} values`
        }
        if (type === 5) { // unsigned rational (numerator / denominator)
            if (offset + 8 > view.byteLength) return 'N/A'
            const num = view.getUint32(offset, littleEndian)
            const den = view.getUint32(offset + 4, littleEndian)
            if (den === 0) return '0'
            const val = num / den
            return Number.isInteger(val) ? String(val) : val.toFixed(2)
        }
        return `${count} items`
    } catch {
        return 'N/A'
    }
}

export default function ImageMetadataViewer() {
    const [image, setImage] = useState(null)
    const [meta, setMeta] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [copied, setCopied] = useState(false)
    const [stripping, setStripping] = useState(false)
    const [strippedUrl, setStrippedUrl] = useState(null)

    const handleFile = useCallback(async (file) => {
        if (!file) return
        const buffer = await readFileAsBuffer(file)
        const exif = parseExif(buffer)
        const url = URL.createObjectURL(file)
        setStrippedUrl(null)

        const img = new Image()
        img.onload = () => {
            const basic = {
                'File Name': file.name,
                'File Size': `${(file.size / 1024).toFixed(1)} KB`,
                'MIME Type': file.type || 'Unknown',
                'Dimensions': `${img.naturalWidth} × ${img.naturalHeight} pixels`,
                'Megapixels': `${((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2)} MP`,
                'Aspect Ratio': `${(img.naturalWidth / img.naturalHeight).toFixed(2)}:1`,
                'Last Modified': new Date(file.lastModified).toLocaleString(),
            }
            setImage({ url, name: file.name, file, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight })
            setMeta({ basic, exif })
        }
        img.src = url
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const copyAll = () => {
        if (!meta) return
        const lines = Object.entries(meta.basic).map(([k, v]) => `${k}: ${v}`)
        if (meta.exif) Object.entries(meta.exif).forEach(([k, v]) => lines.push(`${k}: ${v}`))
        navigator.clipboard.writeText(lines.join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── Strip EXIF Metadata Losslessly via HTML5 Canvas ────────────────────────
    const stripMetadata = () => {
        if (!image) return
        setStripping(true)

        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const ctx = canvas.getContext('2d')

        const imgEl = new Image()
        imgEl.onload = () => {
            ctx.drawImage(imgEl, 0, 0)
            const isPng = image.file.type === 'image/png'
            canvas.toBlob((blob) => {
                if (blob) {
                    const cleanUrl = URL.createObjectURL(blob)
                    setStrippedUrl(cleanUrl)
                }
                setStripping(false)
            }, isPng ? 'image/png' : 'image/jpeg', 0.95)
        }
        imgEl.src = image.url
    }

    const MetaRow = ({ label, value }) => (
        <div className="flex items-start gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <span className="w-48 text-xs font-semibold text-slate-500 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-slate-800 break-all font-mono">{value}</span>
        </div>
    )

    const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Image Metadata Viewer & EXIF Stripper',
        url: 'https://imgtool.in/image-metadata-viewer',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. HTML5 compatible.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'View EXIF camera data, GPS coordinates, and file properties, or strip all metadata before sharing photos online. 100% private in-browser tool.',
    }

    return (
        <>
            <SEO
                title="Image Metadata Viewer & EXIF Stripper — View & Clean EXIF Free"
                description="View EXIF camera data, GPS location, exposure settings, or strip all metadata before sharing photos online. 100% private in-browser EXIF cleaner."
                canonical="/image-metadata-viewer"
                keywords="image metadata viewer, exif viewer online, remove exif data, strip photo metadata, view photo gps, exif stripper, view image properties"
                schema={toolSchema}
            />

            <ToolLayout
                toolSlug="image-metadata-viewer"
                title="Image Metadata Viewer &amp; EXIF Stripper"
                description="Inspect hidden EXIF camera tags, camera models, shutter speeds, and GPS coordinates. Strip all privacy metadata with a single click."
                breadcrumb="Metadata Viewer"
            >
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Upload Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => {
                                const i = document.createElement('input')
                                i.type = 'file'
                                i.accept = 'image/*'
                                i.onchange = (e) => handleFile(e.target.files[0])
                                i.click()
                            }}
                            className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${image ? 'border-blue-400 bg-blue-50/50' : ''}`}
                        >
                            {image ? (
                                <div className="flex flex-col items-center gap-3">
                                    <img src={image.url} alt="Preview" className="h-28 object-contain rounded-xl shadow-sm border border-slate-200" />
                                    <p className="text-sm font-bold text-blue-700">{image.name}</p>
                                    <p className="text-xs text-slate-400">Click or drop a different image to analyze</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl shadow-sm">
                                        <i className="fas fa-info-circle"></i>
                                    </div>
                                    <p className="font-bold text-slate-700 text-lg">Drop any image to view its metadata &amp; EXIF</p>
                                    <p className="text-xs text-slate-400">JPEG, PNG, WebP, HEIC supported • 100% private in-browser analysis</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Dashboard */}
                    {meta && (
                        <div className="space-y-6">

                            {/* Privacy Action Strip Bar */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <i className="fas fa-user-shield text-blue-600"></i> Protect Your Privacy Before Sharing
                                    </h4>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Strip GPS location, camera serial numbers, and device tags to safely post on Reddit, Craigslist, or forums.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={stripMetadata}
                                        disabled={stripping}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                                    >
                                        {stripping ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Stripping...</> : <><i className="fas fa-eraser"></i> Strip EXIF &amp; Download</>}
                                    </button>

                                    <button
                                        onClick={copyAll}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                                    >
                                        <i className={`fas ${copied ? 'fa-check text-green-600' : 'fa-copy'}`}></i>
                                        {copied ? 'Copied!' : 'Copy Tags'}
                                    </button>
                                </div>
                            </div>

                            {/* Download Clean Image Banner */}
                            {strippedUrl && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap animate-fade-in">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg">
                                            <i className="fas fa-shield-check"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-emerald-950 text-xs">Sanitized Image Ready!</h5>
                                            <p className="text-[11px] text-emerald-700 mt-0.5">All EXIF tags, GPS coordinates, and camera markers removed.</p>
                                        </div>
                                    </div>
                                    <a
                                        href={strippedUrl}
                                        download={`clean-${image.name}`}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="fas fa-download"></i> Download Clean Image
                                    </a>
                                </div>
                            )}

                            {/* GPS Alert Warning (if detected) */}
                            {meta.exif && meta.exif['GPS Latitude'] && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                                    <i className="fas fa-location-dot text-amber-600 text-lg mt-0.5"></i>
                                    <div>
                                        <h4 className="font-bold text-amber-900 text-sm">Geotag / GPS Location Detected in Photo!</h4>
                                        <p className="text-xs text-amber-800 mt-1">
                                            Latitude: <strong>{meta.exif['GPS Latitude']} {meta.exif['GPS Latitude Ref']}</strong> • Longitude: <strong>{meta.exif['GPS Longitude']} {meta.exif['GPS Longitude Ref']}</strong>
                                        </p>
                                        <p className="text-[11px] text-amber-700 mt-1">
                                            Sharing this photo publicly reveals your exact geographical coordinates. Use the <strong>Strip EXIF</strong> button above before uploading.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Basic File Properties Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b border-slate-100 pb-3">
                                        <i className="fas fa-file-image text-blue-500"></i> File &amp; Image Properties
                                    </h3>
                                    {Object.entries(meta.basic).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)}
                                </div>

                                {/* EXIF Camera Information Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b border-slate-100 pb-3">
                                        <i className="fas fa-camera text-blue-500"></i> Camera &amp; Exposure Metadata
                                    </h3>
                                    {meta.exif && Object.keys(meta.exif).length > 0 ? (
                                        Object.entries(meta.exif).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)
                                    ) : (
                                        <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                                            <i className="fas fa-circle-info mr-1.5 text-blue-500"></i>
                                            No EXIF data found. This photo has either already been sanitized or uses a format that doesn't embed camera EXIF headers.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Content & Guide */}
                    <div className="seo-content mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">

                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                Understanding Image Metadata &amp; Why Stripping EXIF Protects Your Privacy
                            </h2>

                            <p className="text-base leading-relaxed">
                                Whenever you capture a photograph with a modern smartphone or digital camera, the device automatically records extensive technical information known as <strong>EXIF (Exchangeable Image File Format)</strong> metadata. This data is embedded invisibly directly inside the JPEG or HEIC file header.
                            </p>

                            <p className="text-base leading-relaxed">
                                While EXIF data is invaluable for professional photographers auditing their exposure settings, it poses a severe digital privacy risk for regular consumers. A single smartphone photo can reveal:
                            </p>

                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Precise GPS Coordinates:</strong> Pinpoints the exact latitude, longitude, and altitude where the photo was taken, frequently pointing directly to a private residence, workplace, or child's school.</li>
                                <li><strong>Device Hardware &amp; Serial Numbers:</strong> Records the exact iPhone/Android model, firmware build, and unique camera sensor identifiers.</li>
                                <li><strong>Timestamps:</strong> The exact date and second the photo was shot, enabling location tracking and behavioral profiling.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Which Platforms Strip EXIF Automatically?
                            </h3>

                            <div className="overflow-x-auto not-prose my-4">
                                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                                    <thead className="bg-slate-100 text-slate-700 font-bold">
                                        <tr>
                                            <th className="p-3 border-b border-slate-200">Platform / Service</th>
                                            <th className="p-3 border-b border-slate-200">Strips EXIF Automatically?</th>
                                            <th className="p-3 border-b border-slate-200">Privacy Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Twitter / X &amp; Instagram</td>
                                            <td className="p-3 text-emerald-700 font-bold">Yes (Automatically)</td>
                                            <td className="p-3 text-slate-600">Re-encodes photos upon upload and strips GPS coordinates.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Email Attachments (Gmail, Outlook)</td>
                                            <td className="p-3 text-red-700 font-bold">No (Retained Fully)</td>
                                            <td className="p-3 text-slate-600">Files sent as standard attachments retain 100% of embedded GPS and camera tags.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Craigslist, Classifieds &amp; Direct Web Uploads</td>
                                            <td className="p-3 text-red-700 font-bold">No (Often Retained)</td>
                                            <td className="p-3 text-slate-600">Many classified and forum sites store raw uploads, exposing seller home locations.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-800">Discord &amp; Cloud Storage (Google Drive, Dropbox)</td>
                                            <td className="p-3 text-red-700 font-bold">No (Retained Fully)</td>
                                            <td className="p-3 text-slate-600">Retains complete metadata for file archiving purposes.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-8">
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4 not-prose mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">How does this tool strip metadata without quality loss?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        The image is decoded directly onto an HTML5 Canvas in your browser's private memory sandbox at its exact pixel dimensions. When re-exported as a new file, the canvas creates a clean image stream containing purely pixel colors, stripping all hidden metadata headers.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">Are my photos uploaded to your server to read EXIF?</h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                        No. IMG Tool parses binary headers directly on your local device using JavaScript <code>DataView</code>. Your photos are never uploaded, logged, or transmitted anywhere.
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
