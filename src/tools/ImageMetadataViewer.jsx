import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

function readFileAsBuffer(file) {
    return new Promise((res) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target.result)
        reader.readAsArrayBuffer(file)
    })
}

// Minimal EXIF reader (no external library needed)
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
    0x0131: 'Software', 0x0132: 'Date/Time', 0x013B: 'Artist',
    0x013E: 'White Point', 0x013F: 'Primary Chromaticities',
    0x8298: 'Copyright', 0x8769: 'Exif IFD',
    0x829A: 'Exposure Time', 0x829D: 'F-Number', 0x8822: 'Exposure Program',
    0x8827: 'ISO Speed', 0x9003: 'Date/Time Original', 0x9004: 'Date/Time Digitized',
    0x9201: 'Shutter Speed', 0x9202: 'Aperture', 0x9203: 'Brightness',
    0x9204: 'Exposure Bias', 0x9205: 'Max Aperture', 0x9207: 'Metering Mode',
    0x9208: 'Light Source', 0x9209: 'Flash', 0x920A: 'Focal Length',
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

export default function ImageMetadataViewer() {
    const [image, setImage] = useState(null)
    const [meta, setMeta] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            const basicMeta = {
                'File Name': file.name,
                'File Size': `${(file.size / 1024).toFixed(1)} KB (${file.size.toLocaleString()} bytes)`,
                'File Type': file.type,
                'Width': `${img.naturalWidth}px`,
                'Height': `${img.naturalHeight}px`,
                'Aspect Ratio': `${(img.naturalWidth / img.naturalHeight).toFixed(3)}:1`,
                'Megapixels': `${((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2)} MP`,
                'Last Modified': new Date(file.lastModified).toLocaleString(),
            }
            setImage({ url, name: file.name })
            if (file.type === 'image/jpeg') {
                readFileAsBuffer(file).then(buf => {
                    const exif = parseExif(buf)
                    setMeta({ basic: basicMeta, exif })
                })
            } else {
                setMeta({ basic: basicMeta, exif: null })
            }
        }
        img.src = url
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
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

    const MetaRow = ({ label, value }) => (
        <div className="flex items-start gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <span className="w-48 text-xs font-semibold text-slate-500 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-slate-800 break-all">{value}</span>
        </div>
    )

    return (
        <>
            <SEO
                title="Image Metadata Viewer — View EXIF Data Online Free"
                description="View and analyze image metadata and EXIF data online. See camera model, GPS location, exposure settings, file size, dimensions and more. Free, no upload."
                canonical="/image-metadata-viewer"
            />
            <ToolLayout
                toolSlug="image-metadata-viewer"
                title="Image Metadata Viewer"
                description="View EXIF data, GPS coordinates, camera settings, and file properties from any image."
                breadcrumb="Image Metadata Viewer"
            >
                {/* Upload */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${image ? 'border-blue-400 bg-blue-50' : ''}`}
                    >
                        {image ? (
                            <div className="flex flex-col items-center gap-3">
                                <img src={image.url} alt="Preview" className="h-24 object-contain rounded-lg" />
                                <p className="text-sm font-medium text-blue-700">{image.name}</p>
                                <p className="text-xs text-slate-400">Click to analyze a different image</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-info-circle text-blue-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop any image to view its metadata</p>
                                <p className="text-sm text-slate-400">JPEG, PNG, WebP, HEIC and more · EXIF data supported for JPEGs</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                {meta && (
                    <>
                        <div className="flex justify-end mb-3">
                            <button onClick={copyAll}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-full hover:bg-blue-100 transition-all">
                                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                {copied ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fas fa-file-image text-blue-500"></i> File Information
                            </h2>
                            {Object.entries(meta.basic).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)}
                        </div>

                        {/* EXIF Data */}
                        {meta.exif && Object.keys(meta.exif).length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fas fa-camera text-blue-500"></i> EXIF Camera Data
                                </h2>
                                {Object.entries(meta.exif).map(([k, v]) => <MetaRow key={k} label={k} value={v} />)}
                            </div>
                        )}
                        {meta.exif === null && (
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-500 mb-4">
                                <i className="fas fa-info-circle mr-2"></i>
                                EXIF metadata is only available for JPEG files. This image format does not contain EXIF data.
                            </div>
                        )}
                    </>
                )}

                {/* SEO Content */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">What is Image Metadata?</h2>
                    <p className="text-slate-600">Image metadata is hidden information stored inside image files. EXIF (Exchangeable Image File Format) data is embedded by cameras and smartphones when you take a photo. It contains details like camera model, lens settings, shooting date, GPS coordinates, and exposure information.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">What Metadata Can You View?</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>File Properties</strong> — name, size, type, dimensions, megapixels</li>
                        <li><strong>Camera Info</strong> — make, model, lens, software version</li>
                        <li><strong>Shooting Settings</strong> — aperture (f-stop), shutter speed, ISO, focal length</li>
                        <li><strong>Date & Time</strong> — when the photo was taken and last modified</li>
                        <li><strong>GPS Location</strong> — latitude, longitude, altitude (if location was enabled)</li>
                        <li><strong>Image Properties</strong> — resolution, color profile, orientation</li>
                    </ul>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Privacy Warning</h3>
                    <p className="text-slate-600">Photos taken on smartphones often contain GPS coordinates revealing your exact location. Before sharing photos online, consider stripping metadata using our tool to protect your privacy. Social media platforms like Facebook and Twitter automatically strip EXIF data, but other platforms may not.</p>
                    <p className="text-slate-600 mt-4">After viewing metadata, you may want to use our <a href="/image-compressor" className="text-blue-600 hover:underline">Image Compressor</a> to reduce file size or our <a href="/image-resizer" className="text-blue-600 hover:underline">Image Resizer</a> to adjust dimensions.</p>
                </div>
            </ToolLayout>
        </>
    )
}
