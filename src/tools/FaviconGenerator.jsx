import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512]
const SELECTED_DEFAULT = [16, 32, 48, 180, 192]

export default function FaviconGenerator() {
    const [image, setImage] = useState(null)
    const [selectedSizes, setSelectedSizes] = useState(new Set(SELECTED_DEFAULT))
    const [previews, setPreviews] = useState({})
    const [generating, setGenerating] = useState(false)
    const [generated, setGenerated] = useState(false)
    const [bgMode, setBgMode] = useState('transparent')
    const [bgColor, setBgColor] = useState('#ffffff')
    const [padding, setPadding] = useState(10)
    const [isDragging, setIsDragging] = useState(false)
    const canvasRef = useRef(null)

    const handleFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => setImage({ img, url })
        img.src = url
        setPreviews({})
        setGenerated(false)
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const toggleSize = (sz) => setSelectedSizes(prev => {
        const n = new Set(prev)
        n.has(sz) ? n.delete(sz) : n.add(sz)
        return n
    })

    const generate = async () => {
        if (!image || !selectedSizes.size) return
        setGenerating(true)
        const canvas = canvasRef.current
        const newPreviews = {}
        for (const sz of SIZES) {
            if (!selectedSizes.has(sz)) continue
            canvas.width = sz; canvas.height = sz
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, sz, sz)
            if (bgMode === 'color') {
                ctx.fillStyle = bgColor
                ctx.fillRect(0, 0, sz, sz)
            }
            const pad = Math.floor(sz * padding / 100)
            const drawSz = sz - pad * 2
            const { naturalWidth: iw, naturalHeight: ih } = image.img
            const scale = Math.min(drawSz / iw, drawSz / ih)
            const dw = iw * scale, dh = ih * scale
            const dx = pad + (drawSz - dw) / 2, dy = pad + (drawSz - dh) / 2
            ctx.drawImage(image.img, dx, dy, dw, dh)
            newPreviews[sz] = canvas.toDataURL('image/png')
        }
        setPreviews(newPreviews)
        setGenerated(true)
        setGenerating(false)
    }

    const downloadSingle = (sz) => {
        const a = document.createElement('a')
        a.href = previews[sz]
        a.download = sz === 16 || sz === 32 || sz === 48 ? `favicon-${sz}x${sz}.png` : `icon-${sz}x${sz}.png`
        a.click()
    }

    const downloadAll = async () => {
        // Download each selected size
        for (const sz of selectedSizes) {
            if (previews[sz]) {
                await new Promise(res => setTimeout(res, 200))
                downloadSingle(sz)
            }
        }
    }

    return (
        <>
            <SEO
                title="Favicon Generator — Create Favicon.ico & PNG Icons Free"
                description="Generate favicon.ico and PNG icons in all sizes (16x16, 32x32, 180x180, 192x192, 512x512) from any image. Free, instant, no signup required."
                canonical="/favicon-generator"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'Favicon Generator',
                    applicationCategory: 'DeveloperApplication',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                }}
            />
            <ToolLayout
                toolSlug="favicon-generator"
                title="Favicon Generator"
                description="Generate favicon and app icons in all sizes from any image. Perfect for websites & PWAs."
                breadcrumb="Favicon Generator"
            >
                {/* Upload */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${image ? 'border-orange-400 bg-orange-50' : ''}`}
                    >
                        {image ? (
                            <div className="flex flex-col items-center gap-3">
                                <img src={image.url} alt="Source" className="w-24 h-24 object-contain rounded-xl border border-orange-200" />
                                <p className="text-sm font-medium text-orange-700">Image loaded — click to change</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-star text-orange-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop your logo or image here</p>
                                <p className="text-sm text-slate-400">PNG with transparent background works best</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-orange-500 mr-2"></i>Options</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Background</label>
                            <div className="flex gap-3">
                                {['transparent', 'color'].map(m => (
                                    <button key={m} onClick={() => setBgMode(m)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize
                    ${bgMode === m ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                            {bgMode === 'color' && (
                                <div className="flex items-center gap-2 mt-3">
                                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer" />
                                    <span className="text-sm text-slate-500">{bgColor}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Padding: {padding}%</label>
                            <input type="range" min="0" max="30" value={padding} onChange={e => setPadding(+e.target.value)}
                                className="slider-range w-full" />
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mt-6">
                        <label className="block text-xs font-semibold text-slate-600 mb-3">Export Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map(sz => (
                                <button key={sz} onClick={() => toggleSize(sz)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                  ${selectedSizes.has(sz) ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}>
                                    {sz}×{sz}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            <strong>Tip:</strong> 16/32/48 = Website favicon · 180 = Apple Touch Icon · 192/512 = PWA icons
                        </p>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={generate} disabled={!image || !selectedSizes.size || generating}
                        className="btn-primary disabled:opacity-50 flex items-center gap-2">
                        {generating ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> Generate Favicons</>}
                    </button>
                    {generated && (
                        <button onClick={downloadAll}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download All
                        </button>
                    )}
                </div>

                {/* Previews */}
                {generated && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-eye text-orange-500 mr-2"></i>Generated Icons</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {SIZES.filter(sz => selectedSizes.has(sz) && previews[sz]).map(sz => (
                                <div key={sz} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm"
                                        style={{ backgroundImage: bgMode === 'transparent' ? 'repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0/16px 16px' : 'none' }}>
                                        <img src={previews[sz]} alt={`${sz}x${sz}`} className="max-w-full max-h-full" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-600">{sz}×{sz}px</p>
                                    <button onClick={() => downloadSingle(sz)}
                                        className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-all font-medium">
                                        <i className="fas fa-download mr-1"></i>Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* SEO Content */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Free Favicon Generator Online</h2>
                    <p className="text-slate-600">A favicon is the small icon that appears in browser tabs, bookmarks, and search results. Our favicon generator lets you create all necessary icon sizes from a single image, supporting everything from classic browser favicons (16×16, 32×32) to modern PWA icons (192×192, 512×512) and Apple Touch Icons (180×180).</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How to Create a Favicon</h3>
                    <ol className="list-decimal list-inside text-slate-600 space-y-2">
                        <li>Upload your logo or brand icon (PNG with transparency recommended)</li>
                        <li>Choose whether you want a transparent or colored background</li>
                        <li>Adjust padding to add breathing room around your icon</li>
                        <li>Select which sizes you need (16×16 and 32×32 are essential for websites)</li>
                        <li>Click Generate and download each size individually or all at once</li>
                    </ol>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Which Favicon Sizes Do You Need?</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>16×16</strong> — Browser tab favicon (standard)</li>
                        <li><strong>32×32</strong> — Taskbar and higher-resolution displays</li>
                        <li><strong>48×48</strong> — Windows Start menu tile</li>
                        <li><strong>180×180</strong> — Apple Touch Icon for iOS Safari bookmarks</li>
                        <li><strong>192×192</strong> — Android Chrome PWA icon</li>
                        <li><strong>512×512</strong> — PWA splash screen and app store requirements</li>
                    </ul>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How to Add Favicon to Your Website</h3>
                    <p className="text-slate-600">After downloading, add these tags to your HTML head section:</p>
                    <pre className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 overflow-x-auto">{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}</pre>
                    <p className="text-slate-600 mt-4">You can also use our <a href="/png-to-ico" className="text-blue-600 hover:underline">PNG to ICO converter</a> if you need traditional .ico format for older browser compatibility.</p>
                </div>
            </ToolLayout>
        </>
    )
}
