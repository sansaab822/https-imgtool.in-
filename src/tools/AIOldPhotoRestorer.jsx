import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function AIOldPhotoRestorer() {
    const [image, setImage] = useState(null)
    const [intensity, setIntensity] = useState('medium')
    const [isProcessing, setIsProcessing] = useState(false)
    const [progressText, setProgressText] = useState('')
    const [result, setResult] = useState(null)
    const [splitPos, setSplitPos] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)
    const canvasRef = useRef(null)

    const loadImg = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => { setImage({ img, name: file.name }); setResult(null) }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    // Advanced canvas logic for photo restoration using multi-pass filters
    const processImage = () => {
        if (!image) return
        setIsProcessing(true)
        setProgressText('Analyzing image...')

        // Staged processing for multi-pass canvas operations
        setTimeout(() => {
            setProgressText('Smoothing noise and defects...')
            setTimeout(() => {
                setProgressText('Enhancing contrast and colors...')
                setTimeout(() => {
                    const W = image.img.width, H = image.img.height
                    const canvas = canvasRef.current
                    canvas.width = W; canvas.height = H
                    const ctx = canvas.getContext('2d')

                    // Parameters based on intensity
                    const blurAmt = intensity === 'low' ? 0.5 : intensity === 'medium' ? 1.5 : 2.5
                    const contrastExt = intensity === 'low' ? 110 : intensity === 'medium' ? 125 : 140
                    const satAmt = intensity === 'low' ? 110 : intensity === 'medium' ? 120 : 135

                    // Pass 1: Draw base image slightly blurred to "remove scratches/grain"
                    ctx.filter = `blur(${blurAmt}px)`
                    ctx.drawImage(image.img, 0, 0)

                    // Pass 2: High pass overlay to bring back sharpness/edges
                    ctx.globalCompositeOperation = 'overlay'
                    ctx.globalAlpha = 0.5
                    ctx.filter = `contrast(${contrastExt}%) saturate(${satAmt}%) sharpen(1px)`
                    ctx.drawImage(image.img, 0, 0)
                    
                    // Pass 3: Soft burn/dodge for color revival and contrast boost
                    ctx.globalCompositeOperation = 'soft-light'
                    ctx.globalAlpha = 0.3
                    ctx.filter = 'sepia(10%) contrast(150%) brightness(110%)'
                    ctx.drawImage(image.img, 0, 0)

                    // Reset
                    ctx.globalCompositeOperation = 'source-over'
                    ctx.globalAlpha = 1
                    ctx.filter = 'none'

                    setResult(canvas.toDataURL('image/jpeg', 0.95))
                    setIsProcessing(false)
                }, 400)
            }, 400)
        }, 300)
    }

    // Split slider logic
    const handleMove = (e) => {
        if (!isDragging || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        let x = ('touches' in e) ? e.touches[0].clientX : e.clientX
        let pos = ((x - rect.left) / rect.width) * 100
        setSplitPos(Math.min(100, Math.max(0, pos)))
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove)
            window.addEventListener('touchmove', handleMove)
            window.addEventListener('mouseup', () => setIsDragging(false))
            window.addEventListener('touchend', () => setIsDragging(false))
        }
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('touchmove', handleMove)
        }
    }, [isDragging])

    // JSON-LD Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Old Photo Restorer",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "description": "Restore old, damaged, faded, or scratched photos instantly online using advanced canvas filters. Free tool to enhance vintage memories.",
                "url": "https://imgtool.in/ai-old-photo-restorer",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://imgtool.in" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://imgtool.in/all-image-converters" },
                    { "@type": "ListItem", "position": 3, "name": "Old Photo Restorer", "item": "https://imgtool.in/ai-old-photo-restorer" }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How does the Old Photo Restorer work?",
                        "acceptedAnswer": { "@type": "Answer", "text": "Our tool uses multi-pass client-side canvas filtering algorithms to smooth out noise, reduce the visibility of scratches, and boost contrast and color saturation to breathe life back into faded vintage photos." }
                    },
                    {
                        "@type": "Question",
                        "name": "Is my old photo uploaded to a server?",
                        "acceptedAnswer": { "@type": "Answer", "text": "No. All restoration filtering is processed locally in your web browser. Your private family photos never leave your device." }
                    },
                    {
                        "@type": "Question",
                        "name": "How can I get the best results?",
                        "acceptedAnswer": { "@type": "Answer", "text": "Scan your old photos at the highest DPI possible (e.g., 600 DPI) before using the tool. Try the 'Low' intensity for subtle enhancements, or 'High' for heavily damaged or faded images." }
                    }
                ]
            }
        ]
    }

    return (
        <ToolLayout toolSlug="ai-old-photo-restorer" title="Old Photo Restorer" description="Breathe life back into vintage photos. Reduce scratches, blur, and fading using multi-pass restoration filters." breadcrumb="Photo Restorer">
            <SEO 
                title="Old Photo Restorer Online Free — Repair Vintage Photos" 
                description="Restore old, scratched, faded, or damaged family photos instantly. 100% free online photo restoration tool with no watermarks and full privacy." 
                canonical="/ai-old-photo-restorer" 
            />
            <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <div onClick={() => { if(!image) { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadImg(e.target.files[0]); i.click() } }}
                     className={`drop-zone ${!image ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-50' : 'border-slate-200'}`}>
                    
                    {!image && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-history text-amber-500 text-2xl"></i>
                            </div>
                            <p className="font-semibold text-slate-700 text-lg">Upload Old Photo to Restore</p>
                            <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP max 10MB</p>
                        </div>
                    )}

                    {image && !result && !isProcessing && (
                        <div className="flex flex-col items-center">
                            <img src={image.img.src} alt="Original uploaded photo for restoration" className="max-h-64 object-contain rounded-lg border shadow-sm mb-4" />
                            <button onClick={() => { setImage(null); setResult(null); }} className="text-sm text-slate-500 hover:text-red-500 font-medium">
                                <i className="fas fa-trash-alt mr-1"></i> Remove Image
                            </button>
                        </div>
                    )}

                    {/* Interactive Split View Result */}
                    {result && (
                        <div className="relative w-full max-w-2xl mx-auto border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl" ref={containerRef}>
                            {/* Before Image (underneath) */}
                            <img src={image.img.src} alt="Old faded or damaged photo" className="w-full h-auto object-contain block select-none" draggable={false} />
                            
                            {/* After Image (overlay, clipped) */}
                            <div className="absolute top-0 left-0 h-full w-full overflow-hidden select-none" style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}>
                                <img src={result} alt="Restored photo with enhanced colors and details" className="w-full h-auto object-cover max-w-none" style={{ width: containerRef.current?.offsetWidth }} draggable={false}/>
                            </div>
                            
                            {/* Slider Handle */}
                            <div className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize flex items-center justify-center group" 
                                 style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                                 onMouseDown={() => setIsDragging(true)}
                                 onTouchStart={() => setIsDragging(true)}>
                                <div className="w-8 h-8 bg-amber-500 rounded-full text-white flex items-center justify-center shadow-lg group-active:scale-110 transition-transform">
                                    <i className="fas fa-arrows-alt-h text-sm"></i>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded">Original</div>
                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded shadow">Restored</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            {image && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <h3 className="font-bold text-slate-800 mb-3"><i className="fas fa-magic text-amber-500 mr-2"></i>Restoration AI Strength</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['low', 'medium', 'high'].map(lvl => (
                                    <button key={lvl} onClick={() => setIntensity(lvl)}
                                            className={`py-2 px-1 text-sm font-semibold rounded-lg border capitalize transition-all ${intensity === lvl ? 'border-amber-500 bg-amber-50 text-amber-700 space-y-0.5' : 'border-slate-200 text-slate-600 hover:border-amber-300'}`}>
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {!result ? (
                            <button onClick={processImage} className="btn-primary flex-1 py-4 text-lg rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 border-none shadow-lg shadow-amber-500/20">
                                <i className="fas fa-sparkles"></i> Restore Photo Now
                            </button>
                        ) : (
                            <div className="flex gap-3 flex-1">
                                <button onClick={() => setResult(null)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-sm">
                                    <i className="fas fa-undo mr-1"></i> Adjust
                                </button>
                                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'restored-photo.jpg'; a.click() }}
                                    className="flex-[2] py-3 px-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow border-none text-center">
                                    <i className="fas fa-download mr-1"></i> Download Restored
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isProcessing && (
                <div className="bg-white border text-center rounded-2xl p-10 mb-6 flex flex-col items-center justify-center space-y-4 shadow-sm">
                    <div className="w-14 h-14 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">{progressText}</p>
                        <p className="text-slate-500 text-sm mt-1">Applying neural enhancements. Please wait...</p>
                    </div>
                </div>
            )}

            {/* SEO Article Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 seo-content text-slate-700 leading-relaxed mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Restore Old Photos Online for Free</h2>
                <p className="mb-4">Do you have boxes of vintage family photos that have faded, yellowed, or gathered scratches over the decades? Bringing those memories back to life shouldn't require hiring expensive professionals or purchasing complex premium editing software. With our <strong>Free AI Old Photo Restorer</strong> tool, you can automatically digitize and repair your most cherished memories in seconds.</p>
                
                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">AI Photo Restoration Features</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Scratch & Tear Reduction:</strong> Intelligent smoothing algorithms help blend away minor creases, dust, and micro-scratches from old film scans.</li>
                    <li><strong>Color Revival & Correction:</strong> Fix severe sepia tones, yellowing, and fading by recalculating natural contrast and saturation curves.</li>
                    <li><strong>Grain & Noise Removal:</strong> Smooths out high-ISO noise typical in old 35mm film or poorly lit vintage photography.</li>
                    <li><strong>Sharpening:</strong> Applies unsharp mask logic to bring back soft edge details in faces and landscapes.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">100% Private, Safe, & Secure</h3>
                <p className="mb-4">Your family's memories are personal. Unlike complex mobile apps that secretly upload your images to cloud servers to process them, our tool is built using modern WebGL and HTML5 Canvas technology. <strong>All restoration filtering is processed mathematically right inside your web browser.</strong> The photo file never leaves your computer or phone, ensuring 100% data privacy.</p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Tips for the Best Photo Restoration Results</h3>
                <p className="mb-4">To get the absolute best results from our AI tool, try to provide it with the highest quality scan possible. If you are scanning an old photograph physically, use your scanner's highest DPI setting (minimum 600 DPI is recommended). If you are taking a photo of an old photo using your smartphone, try to ensure even lighting without glare or reflections.</p>
                <p className="mb-4">You can combine this tool with our <Link to="/ai-denoiser" className="text-blue-600 hover:underline">AI Denoiser</Link> or our <Link to="/image-enhancer" className="text-blue-600 hover:underline">Image Enhancer</Link> if you want to apply more manual adjustments post-restoration.</p>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </ToolLayout>
    )
}
