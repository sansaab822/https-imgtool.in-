import React, { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function CollageMaker() {
    const [images, setImages] = useState([])
    const [layout, setLayout] = useState('grid') // grid, row, col
    const [gap, setGap] = useState(10)
    const [bgColor, setBgColor] = useState('#ffffff')
    const canvasRef = useRef(null)

    // Handle File Drop
    const handleDrop = useCallback((e) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
        const validFiles = files.filter(f => f.type.startsWith('image/'))

        validFiles.forEach(file => {
            const reader = new FileReader()
            reader.onload = (event) => {
                const img = new Image()
                img.onload = () => {
                    setImages(prev => [...prev, { file, src: event.target.result, img, id: Date.now() + Math.random() }])
                }
                img.src = event.target.result
            }
            reader.readAsDataURL(file)
        })
    }, [])

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id))
    }

    // Canvas Renderer
    useEffect(() => {
        if (images.length === 0 || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Simple Layout Math
        const count = images.length
        let canvasWidth = 800
        let canvasHeight = 800

        if (layout === 'row') {
            canvasWidth = count * 400 + (count + 1) * gap
            canvasHeight = 400 + gap * 2
        } else if (layout === 'col') {
            canvasWidth = 400 + gap * 2
            canvasHeight = count * 400 + (count + 1) * gap
        } else {
            // Grid
            const cols = Math.ceil(Math.sqrt(count))
            const rows = Math.ceil(count / cols)
            canvasWidth = cols * 400 + (cols + 1) * gap
            canvasHeight = rows * 400 + (rows + 1) * gap
        }

        // Limit huge sizes for preview performance
        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // Draw background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw images
        images.forEach((imageObj, i) => {
            const { img } = imageObj

            let x = 0, y = 0, targetW = 400, targetH = 400

            if (layout === 'row') {
                x = gap + i * (targetW + gap)
                y = gap
            } else if (layout === 'col') {
                x = gap
                y = gap + i * (targetH + gap)
            } else {
                // Grid
                const cols = Math.ceil(Math.sqrt(count))
                const col = i % cols
                const row = Math.floor(i / cols)
                x = gap + col * (targetW + gap)
                y = gap + row * (targetH + gap)
            }

            // Draw with object-fit: cover logic
            const scale = Math.max(targetW / img.width, targetH / img.height)
            const sx = (img.width - targetW / scale) / 2
            const sy = (img.height - targetH / scale) / 2
            const sw = targetW / scale
            const sh = targetH / scale

            ctx.drawImage(img, sx, sy, sw, sh, x, y, targetW, targetH)
        })
    }, [images, layout, gap, bgColor])

    const handleDownload = () => {
        if (!canvasRef.current) return
        const link = document.createElement('a')
        link.download = `imgtool-collage-${Date.now()}.jpg`
        link.href = canvasRef.current.toDataURL('image/jpeg', 0.95)
        link.click()
    }

    return (
        <ToolLayout
            title="Free Photo Collage Maker"
            description="Create beautiful photo collages instantly. Combine multiple images into perfect grids, rows, or columns. 100% Free, no watermarks, secure in-browser processing."
            toolSlug="collage-maker"
            breadcrumb="Collage Maker"
        >
            {/* Tool UI */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-12">
                <div className="grid lg:grid-cols-[1fr_350px] gap-8">

                    {/* Workspace */}
                    <div className="space-y-6">
                        {/* Dropzone */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`drop-zone ${images.length > 0 ? 'bg-slate-50 py-8 px-4' : 'py-20'}`}
                        >
                            <label className="cursor-pointer block">
                                <i className="fas fa-images text-5xl text-blue-500 mb-4"></i>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Drag &amp; Drop Images Here</h3>
                                <p className="text-slate-500 mb-6">or click to browse from your device</p>
                                <input type="file" onChange={handleDrop} accept="image/*" multiple className="hidden" />
                                <span className="btn-primary">Select Images</span>
                            </label>

                            {images.length > 0 && (
                                <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 gap-3 pt-6 border-t border-slate-200">
                                    {images.map(img => (
                                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={img.src} alt="thumbnail" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 shadow"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Preview Canvas */}
                        {images.length > 0 && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center p-4">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-[600px] w-auto h-auto shadow-sm"
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Controls Sidebar */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-fit sticky top-24">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <i className="fas fa-sliders-h text-blue-500"></i> Settings
                        </h3>

                        {/* Layout Select */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Layout Style</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'grid', icon: 'fa-th-large', label: 'Grid' },
                                    { id: 'row', icon: 'fa-grip-lines', label: 'Row' },
                                    { id: 'col', icon: 'fa-ellipsis-v', label: 'Column' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setLayout(t.id)}
                                        className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-all ${layout === t.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
                                    >
                                        <i className={`fas ${t.icon} mb-1 text-lg`}></i>
                                        <span className="text-xs font-bold">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Spacing / Gap Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-slate-700">Photos Spacing (Gap)</label>
                                <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{gap}px</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100"
                                value={gap}
                                onChange={(e) => setGap(Number(e.target.value))}
                                className="slider-range w-full"
                            />
                        </div>

                        {/* Background Color */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-sm text-slate-600 font-mono bg-white px-2 py-1 border border-slate-200 rounded">{bgColor.toUpperCase()}</span>
                            </div>
                        </div>

                        {/* Download CTA */}
                        <button
                            onClick={handleDownload}
                            disabled={images.length === 0}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${images.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 shadow-green-500/30 hover:-translate-y-1'}`}
                        >
                            <i className="fas fa-download"></i> Download Collage
                        </button>

                        {images.length > 0 && (
                            <button onClick={() => setImages([])} className="w-full mt-3 py-2 text-slate-500 text-sm font-semibold hover:text-red-500 transition-colors">
                                Clear All Images
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* SEO Content */}
            <div className="seo-content prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-700 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2>The Best Free Online Photo Collage Maker</h2>
                <p>Welcome to the ultimate tool for combining multiple memories into one stunning picture. The <strong>Collage Maker</strong> by IMG Tool is designed to be ridiculously easy to use while offering professional results. Whether you need a side-by-side comparison image, a beautiful photo grid for Instagram, or a horizontal filmstrip, our in-browser tool does it perfectly in seconds.</p>

                <h3>Why Use Our Collage Maker?</h3>
                <p>Most online collage builders ask you to sign up, pay for premium templates, or worst of all, they ruin your photos by stamping their ugly watermarks all over them. Our philosophy is different:</p>
                <ul>
                    <li><strong>100% Free & No Watermarks:</strong> We will never watermark your collages or put features behind a paywall. What you make is yours.</li>
                    <li><strong>Secure Client-Side Processing:</strong> We do not upload your personal photos to an external server. Your images stay locally in your browser cache. This is vital for privacy when handling personal or family photos.</li>
                    <li><strong>Instant Rendering:</strong> Because everything runs on your device's RAM/CPU via HTML5 Canvas, the processing speed is practically instantaneous. There's zero upload time and zero download wait.</li>
                    <li><strong>Smart Auto-Cropping:</strong> To ensure your grids look uniform, our Canvas engine automatically applies a smart 'object-fit: cover' logic. It centers your images so the focal point remains intact without stretching or distorting the aspect ratios.</li>
                </ul>

                <h3>How to Combine Multiple Photos</h3>
                <ol>
                    <li><strong>Drag & Drop:</strong> Select 2 or more images from your phone gallery or computer folders and drag them into the upload zone. You can also click the blue select button.</li>
                    <li><strong>Choose Layout:</strong> Select your preferred layout style from the right-hand sidebar. 'Grid' works best for 4+ photos. 'Row' places them side-by-side horizontally. 'Column' stacks them vertically.</li>
                    <li><strong>Adjust Spacing:</strong> Use the Gap slider to add white space (or colored borders) between your photos. Setting it to 0px creates a seamless, edge-to-edge collage.</li>
                    <li><strong>Pick a Color:</strong> Change the background color to match the theme of your photos. A plain black or white background often looks the most professional, but you have access to a full hex color picker.</li>
                    <li><strong>Download:</strong> Once satisfied with the preview, hit the exact green 'Download Collage' button. It instantly saves to your device as a crisp, high-quality JPG.</li>
                </ol>

                <p>If you're looking to modify your images before adding them to the collage, you should try our other tools. For instance, use the <a href="/crop-image">Crop Image</a> tool to cut out unwanted edges, or the <a href="/image-enhancer">Image Enhancer</a> to fix the lighting beforehand.</p>

                <h3>Collage Layout Ideas and Inspiration</h3>
                <p>Not sure how to arrange your photos? Here are some classic layouts that look great on social media, blogs, or printed out:</p>
                <ul>
                    <li><strong>The Before & After (Row):</strong> Perfect for showing progress. Upload a "before" image and an "after" image, select the 'Row' layout, and set the gap to 10px with a white background. Very popular for fitness progress, room renovations, or photo editing comparisons.</li>
                    <li><strong>The Instagram Grid:</strong> Upload 4 or 9 photos of the same theme (e.g., a vacation to Paris, a wedding, or a recipe step-by-step). Select the 'Grid' layout. This creates a beautifully balanced, symmetrical square perfect for social feeds.</li>
                    <li><strong>The Vertical Story (Column):</strong> Ideal for Pinterest or mobile-scrolling content. Upload 3-5 images and stack them vertically with a tiny 5px gap.</li>
                </ul>

                <h3>Fast, Built on Canvas API</h3>
                <p>We leverage the power of HTML5 Canvas and modern JavaScript to stitch your images together. When you pick a layout, our system calculates the exact `ctx.drawImage()` coordinates necessary to build the mosaic perfectly. We automatically scale photos to uniformly match a 400x400 block ratio, ensuring the final output is high-resolution but perfectly framed.</p>

                <p>Need to compress the final collage? Use our <a href="/image-compressor">Image Compressor</a> to shrink the file size before sharing it on Discord, WhatsApp or uploading it to a website.</p>

                {/* JSON-LD Schema */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Photo Collage Maker",
                        "applicationCategory": "MultimediaApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Combine multiple photos into beautiful grids, side-by-side rows, or vertical columns instantly. Free, no watermarks, secure in-browser processing."
                    })
                }} />

                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [{
                            "@type": "Question",
                            "name": "Is there a watermark on the downloaded collage?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "No! Our Collage Maker is 100% free and we never add watermarks to your pictures. What you create is completely yours."
                            }
                        }, {
                            "@type": "Question",
                            "name": "Are my photos uploaded to a server?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Absolutely not. This tool processes your images locally in your web browser. No photos are uploaded to any external server, meaning complete privacy for you."
                            }
                        }, {
                            "@type": "Question",
                            "name": "How many photos can I add?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "You can add as many photos as you need, but we recommend between 2 to 9 photos for the best-looking grid proportions."
                            }
                        }]
                    })
                }} />
            </div>
        </ToolLayout>
    )
}
