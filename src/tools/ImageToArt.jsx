import { useState, useRef, useCallback, useEffect } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const ART_STYLES = [
    { id: 'oil', name: 'Oil Painting', emoji: '🖼️', filter: 'contrast(130%) saturate(180%) brightness(95%)', layer: { opacity: 0.15, color: 'rgba(180,80,0,0.15)', blend: 'overlay' } },
    { id: 'watercolor', name: 'Watercolor', emoji: '🎨', filter: 'contrast(90%) saturate(200%) brightness(110%)', layer: { opacity: 0.12, color: 'rgba(100,150,255,0.12)', blend: 'soft-light' } },
    { id: 'pencil', name: 'Pencil Sketch', emoji: '✏️', filter: 'grayscale(100%) contrast(180%)' },
    { id: 'vintage', name: 'Vintage Film', emoji: '📽️', filter: 'sepia(70%) contrast(120%) brightness(90%) saturate(80%)', layer: { opacity: 0.25, color: 'rgba(255,200,100,0.25)', blend: 'overlay' } },
    { id: 'noir', name: 'Film Noir', emoji: '🎬', filter: 'grayscale(100%) contrast(200%) brightness(80%)' },
    { id: 'pop', name: 'Pop Art', emoji: '🎪', filter: 'contrast(200%) saturate(400%) brightness(110%)' },
    { id: 'neon', name: 'Neon Glow', emoji: '💡', filter: 'contrast(150%) saturate(300%) brightness(120%) hue-rotate(20deg)', layer: { opacity: 0.2, color: 'rgba(0,255,200,0.2)', blend: 'screen' } },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖', filter: 'contrast(140%) saturate(250%) hue-rotate(260deg) brightness(95%)', layer: { opacity: 0.18, color: 'rgba(200,0,255,0.18)', blend: 'overlay' } },
    { id: 'dreamy', name: 'Dreamy', emoji: '☁️', filter: 'contrast(80%) saturate(120%) brightness(115%) blur(0.5px)', layer: { opacity: 0.15, color: 'rgba(255,200,230,0.15)', blend: 'soft-light' } },
    { id: 'comic', name: 'Comic Book', emoji: '💥', filter: 'contrast(250%) saturate(200%) brightness(105%)' },
    { id: 'sunset', name: 'Golden Hour', emoji: '🌅', filter: 'contrast(110%) saturate(160%) brightness(105%)', layer: { opacity: 0.3, color: 'rgba(255,150,50,0.3)', blend: 'overlay' } },
    { id: 'frosty', name: 'Ice Cold', emoji: '❄️', filter: 'contrast(110%) saturate(70%) brightness(115%) hue-rotate(190deg)' },
    { id: 'thermal', name: 'Thermal Vision', emoji: '🌡️', filter: 'hue-rotate(40deg) contrast(150%) saturate(500%)' },
    { id: 'invert', name: 'Inverted', emoji: '🔄', filter: 'invert(100%) contrast(110%)' },
    { id: 'duotone', name: 'Duotone', emoji: '🟣', filter: 'grayscale(100%) contrast(130%) sepia(100%) hue-rotate(230deg) saturate(200%)' },
    { id: 'lomo', name: 'Lomo', emoji: '📸', filter: 'contrast(150%) saturate(130%) brightness(90%)', vignette: true },
]

export default function ImageToArt() {
    const [image, setImage] = useState(null)
    const [selectedStyle, setSelectedStyle] = useState('oil')
    const [intensity, setIntensity] = useState(100)
    const [vignette, setVignette] = useState(false)
    const [compareX, setCompareX] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [processing, setProcessing] = useState(false)
    const inputRef = useRef()
    const previewRef = useRef()
    const compareRef = useRef()

    const loadFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return
        setImage({ url: URL.createObjectURL(file), file })
        setResult(null)
    }, [])

    const style = ART_STYLES.find(s => s.id === selectedStyle) || ART_STYLES[0]

    // Live CSS preview filter (scaled by intensity)
    const getPreviewFilter = () => {
        const pct = intensity / 100
        // Parse and scale filter values
        return style.filter.replace(/(\d+)(%|deg)/g, (_, num, unit) => {
            const base = unit === 'deg' ? parseInt(num) : parseInt(num)
            // For percentage values, interpolate from 100% (neutral) toward target
            if (unit === '%') {
                const target = base
                const neutral = 100
                const scaled = neutral + (target - neutral) * pct
                return `${Math.round(scaled)}${unit}`
            }
            // For degrees, just scale
            return `${Math.round(base * pct)}${unit}`
        }).replace(/blur\([\d.]+px\)/g, (match) => {
            const val = parseFloat(match.match(/[\d.]+/)[0])
            return `blur(${(val * pct).toFixed(1)}px)`
        })
    }

    const applyArt = async () => {
        if (!image) return
        setProcessing(true)
        await new Promise(r => setTimeout(r, 50))

        const img = new Image()
        img.src = image.url
        await new Promise(r => { img.onload = r })

        const W = img.naturalWidth, H = img.naturalHeight
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')

        // Apply filter with intensity
        ctx.filter = getPreviewFilter()
        ctx.drawImage(img, 0, 0)
        ctx.filter = 'none'

        // Apply color layer if style has one
        if (style.layer) {
            const layerOpacity = style.layer.opacity * (intensity / 100)
            ctx.globalCompositeOperation = style.layer.blend || 'overlay'
            ctx.fillStyle = style.layer.color.replace(/[\d.]+\)$/, `${layerOpacity})`)
            ctx.fillRect(0, 0, W, H)
            ctx.globalCompositeOperation = 'source-over'
        }

        // Vignette effect
        if (vignette || style.vignette) {
            const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7)
            grad.addColorStop(0, 'rgba(0,0,0,0)')
            grad.addColorStop(1, 'rgba(0,0,0,0.6)')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, W, H)
        }

        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.95))
        const baseName = image.file.name.replace(/\.[^.]+$/, '')
        setResult({
            url: URL.createObjectURL(blob),
            name: `${baseName}_${style.id}.jpg`,
            size: blob.size,
        })
        setProcessing(false)
    }

    // Compare slider handlers
    const onCompareMove = useCallback((e) => {
        if (!isDragging || !compareRef.current) return
        const rect = compareRef.current.getBoundingClientRect()
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        setCompareX(Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)))
    }, [isDragging])

    return (
        <>
            <SEO title="Image to Art Converter - Transform Photos to Art Free" description="Transform photos into artistic masterpieces. 16 art styles: Oil Painting, Watercolor, Pencil Sketch, Pop Art, Neon, Cyberpunk and more. Free & private." canonical="/image-to-art" />
            <ToolLayout toolSlug="image-to-art" title="Image to Art" description="Transform your photos into stunning artistic styles with real-time preview and intensity control." breadcrumb="Image to Art">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {!image ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-palette text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop your photo or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">Transform any photo into art · 16 styles available</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Live preview */}
                                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600">
                                            <i className="fas fa-eye text-purple-400 mr-1"></i>Live Preview — {style.emoji} {style.name}
                                        </span>
                                        <button onClick={() => { setImage(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                            <i className="fas fa-xmark mr-1"></i>Remove
                                        </button>
                                    </div>
                                    <div className="bg-slate-100 rounded-xl p-2 flex items-center justify-center min-h-[250px] overflow-hidden">
                                        <img
                                            ref={previewRef}
                                            src={image.url}
                                            alt="Preview"
                                            className="max-h-[400px] max-w-full object-contain rounded-lg transition-all"
                                            style={{ filter: getPreviewFilter() }}
                                        />
                                    </div>
                                </div>

                                {/* Compare View (after apply) */}
                                {result && (
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                                            <span className="text-xs font-bold text-slate-600">← Original / Art → (drag to compare)</span>
                                            <a href={result.url} download={result.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                                <i className="fas fa-download"></i> Download
                                            </a>
                                        </div>
                                        <div
                                            ref={compareRef}
                                            className="relative select-none overflow-hidden bg-slate-100"
                                            style={{ minHeight: 300, cursor: 'col-resize' }}
                                            onMouseDown={() => setIsDragging(true)}
                                            onTouchStart={() => setIsDragging(true)}
                                            onMouseMove={onCompareMove}
                                            onTouchMove={onCompareMove}
                                            onMouseUp={() => setIsDragging(false)}
                                            onTouchEnd={() => setIsDragging(false)}
                                            onMouseLeave={() => setIsDragging(false)}
                                        >
                                            <img src={image.url} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath: `inset(0 ${100 - compareX}% 0 0)` }}>
                                                <div className="absolute inset-0 bg-slate-100" />
                                                <img src={result.url} alt="Art" className="absolute inset-0 w-full h-full object-contain" />
                                            </div>
                                            <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareX}%` }}>
                                                <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-lg" />
                                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-purple-100">
                                                    <i className="fas fa-arrows-left-right text-purple-500 text-xs"></i>
                                                </div>
                                            </div>
                                            <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">ORIGINAL</div>
                                            <div className="absolute top-3 right-3 z-10 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">{style.name.toUpperCase()}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        {/* Style Grid */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-palette text-purple-500"></i> Art Style
                            </h3>
                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                                {ART_STYLES.map(s => (
                                    <button key={s.id} onClick={() => setSelectedStyle(s.id)}
                                        className={`py-2.5 px-2 rounded-lg text-center transition-all ${selectedStyle === s.id ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30' : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600'}`}>
                                        <span className="text-lg block">{s.emoji}</span>
                                        <span className="text-[10px] font-bold block mt-0.5">{s.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-sliders text-purple-500"></i> Adjustments
                            </h3>

                            {/* Intensity */}
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                                    <span>Intensity</span><span className="font-bold text-purple-600">{intensity}%</span>
                                </label>
                                <input type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(+e.target.value)} className="slider-range w-full" />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>Subtle</span><span>Maximum</span>
                                </div>
                            </div>

                            {/* Vignette */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={vignette} onChange={e => setVignette(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-purple-500 focus:ring-purple-500" />
                                <span className="text-xs font-medium text-slate-600">Add Vignette effect</span>
                            </label>

                            {/* Apply Button */}
                            <button onClick={applyArt} disabled={!image || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                                ) : (
                                    <><i className="fas fa-wand-magic-sparkles"></i> Apply {style.name}</>
                                )}
                            </button>

                            <button onClick={() => { setImage(null); setResult(null) }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                Upload New Image
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Turn Any Photo into a Work of Art — Free Online AI Art Filter</h2>
                        <p>
                            Art has always been about transformation — taking a moment, a face, a landscape, and reinterpreting it through a new creative lens. Historically, achieving that transformation required years of training, expensive software, or access to a professional artist. Today, you can do it in seconds. Our Image to Art converter applies sophisticated filter pipelines inspired by real artistic techniques to transform your ordinary photographs into visually stunning artworks across 16 distinct styles.
                        </p>
                        <p>
                            Whether you want to see your portrait rendered in the rich, impasto texture of an oil painting, the flowing washes of a watercolor, the clean lines of a comic book panel, or the vibrant glow of a neon city — this tool handles the transformation instantly inside your browser. Nothing is uploaded. Everything stays private. And you can download high-quality results to use anywhere you want.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Exploring the 16 Art Styles</h3>
                        <p>Each style is engineered to evoke a specific visual tradition. Here is what each one does to your photo:</p>
                        <div className="grid sm:grid-cols-2 gap-3 mt-3">
                            {[
                                ['🖼️ Oil Painting', 'Rich contrast and deep saturated colors that mimic the layered brushwork of classical canvas paintings.'],
                                ['🎨 Watercolor', 'Soft, slightly desaturated tones with a dreamy, paper-like transparency typical of watercolor illustration.'],
                                ['✏️ Pencil Sketch', 'A full grayscale conversion with boosted contrast that replicates the look of hand-drawn graphite sketches.'],
                                ['📽️ Vintage Film', 'Warm sepia tones and muted saturation that evoke analog film photography from the mid-20th century.'],
                                ['🎬 Film Noir', 'Extreme high-contrast black and white with dramatic shadows reminiscent of classic detective cinema.'],
                                ['🎪 Pop Art', "Ultra-saturated, almost posterized colors inspired by Andy Warhol and Lichtenstein's graphic art movement."],
                                ['💡 Neon Glow', 'Vivid, electrically charged colors with a screen-blended cyan overlay for a nightclub or synthwave aesthetic.'],
                                ['🤖 Cyberpunk', 'Purple-shifted hues with high contrast that suggests a dystopian sci-fi visual world.'],
                            ].map(([name, desc]) => (
                                <div key={name} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <p className="font-bold text-slate-700 text-xs">{name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Best Use Cases for Each Art Category</h3>
                        <p>
                            <strong>For portraits and headshots:</strong> Oil Painting and Watercolor styles work exceptionally well because they add a timeless, painterly quality to faces. The soft focus and tonal richness of these filters makes even casual smartphone selfies look gallery-worthy. These outputs are popular for social media profile photos, creative LinkedIn headers, and custom gifts like canvas prints.
                        </p>
                        <p>
                            <strong>For landscapes and travel photos:</strong> Golden Hour, Dreamy, and Vintage Film styles pair beautifully with natural scenery. They warm the color palette, reduce harsh highlights, and add a nostalgic, editorial feel that makes travel photos look professionally edited without touching a single slider manually.
                        </p>
                        <p>
                            <strong>For graphic design and brand content:</strong> Pop Art, Comic Book, Neon Glow, and Cyberpunk styles generate images with strong, bold visual energy that cuts through crowded social media feeds. Brands in music, gaming, streetwear, and creative industries frequently use these aesthetics for promotional materials, thumbnails, and event posters.
                        </p>
                        <p>
                            <strong>For editorial and documentary work:</strong> Pencil Sketch, Film Noir, and Thermal Vision create dramatic, documentary-style visuals that work well for editorial illustrations, editorial photography, book covers, and conceptual projects.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Using Intensity and Vignette for Fine Control</h3>
                        <p>
                            Every artistic effect has an intensity slider ranging from 10% to 100%. At lower values, the style acts as a subtle enhancement — slightly warming or desaturating the image without overpowering the original. At maximum intensity, the full effect is applied. The sweet spot for most portrait styles is between 60-80%, which applies enough artistic character to be visually interesting while still keeping faces recognizable and natural.
                        </p>
                        <p>
                            The vignette option adds a graduated dark shadow around the border of the image, drawing the viewer's eye toward the center. This technique has been used by photographers and painters for centuries to create focus and depth. It is particularly effective with Oil Painting, Vintage, and Film Noir styles. For Neon and Cyberpunk, vignette adds a moody, cinematic framing.
                        </p>
                        <p>
                            After applying your chosen style, the before/after comparison slider lets you drag across the image to instantly compare the original and transformed versions side by side. This makes it easy to judge the effect before committing to a download.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">Is this tool using actual AI to generate the art?</h4>
                                <p className="mt-1">The styles use advanced CSS filter pipelines and canvas compositing — a form of client-side image processing rather than generative AI. This means results are instant, completely private, and don't require an internet connection once the page loads. Generative AI art creates entirely new images; this tool artistically transforms your existing photo.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I use the output images commercially?</h4>
                                <p className="mt-1">Yes. You own both the original photo and the artistic output. There are no watermarks, no licensing fees, and no usage restrictions on images you create with this tool. They are yours to use freely in commercial projects, social media, print media, or anywhere else.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What resolution is the output file?</h4>
                                <p className="mt-1">The output file matches the exact pixel dimensions of your original uploaded photo. No resolution is lost during the processing. If you upload a 4000×3000 pixel photo, you get a 4000×3000 pixel artwork back at 95% JPEG quality.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Which photos work best with the art filters?</h4>
                                <p className="mt-1">Photos with a clear subject, good lighting, and reasonable contrast tend to produce the most dramatic results. Overexposed or extremely dark photos may not show as much artistic character. For portraits, ensure the face is well-lit. For landscapes, golden hour photos with warm natural light respond especially beautifully to the available styles.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I apply multiple styles to the same image?</h4>
                                <p className="mt-1">Yes. Simply select a different style, adjust the intensity, and click Apply again. Each time you apply, the effect is rendered from the original uploaded image — not stacked on top of a previous effect — so you can freely experiment with every style option without degradation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
