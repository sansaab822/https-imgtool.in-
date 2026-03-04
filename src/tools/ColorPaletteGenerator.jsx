import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
    let h = 0, s = 0
    if (max !== min) {
        const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break }
        h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function generatePalette(hex, mode) {
    const { r, g, b } = hexToRgb(hex)
    const { h, s, l } = rgbToHsl(r, g, b)
    const hslToRgb = (hh, ss, ll) => {
        hh /= 360; ss /= 100; ll /= 100
        let r1, g1, b1
        if (ss === 0) { r1 = g1 = b1 = ll } else {
            const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss, p = 2 * ll - q
            const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p }
            r1 = hue2rgb(p, q, hh + 1 / 3); g1 = hue2rgb(p, q, hh); b1 = hue2rgb(p, q, hh - 1 / 3)
        }
        return rgbToHex(Math.round(r1 * 255), Math.round(g1 * 255), Math.round(b1 * 255))
    }
    if (mode === 'complementary') return [hex, hslToRgb((h + 180) % 360, s, l)]
    if (mode === 'triadic') return [hex, hslToRgb((h + 120) % 360, s, l), hslToRgb((h + 240) % 360, s, l)]
    if (mode === 'analogous') return [hslToRgb((h - 30 + 360) % 360, s, l), hex, hslToRgb((h + 30) % 360, s, l)]
    if (mode === 'shades') return [hslToRgb(h, s, Math.min(l + 40, 95)), hslToRgb(h, s, Math.min(l + 20, 90)), hex, hslToRgb(h, s, Math.max(l - 20, 10)), hslToRgb(h, s, Math.max(l - 40, 5))]
    if (mode === 'split-complementary') return [hex, hslToRgb((h + 150) % 360, s, l), hslToRgb((h + 210) % 360, s, l)]
    if (mode === 'tetradic') return [hex, hslToRgb((h + 90) % 360, s, l), hslToRgb((h + 180) % 360, s, l), hslToRgb((h + 270) % 360, s, l)]
    return [hex]
}

function extractPaletteFromImage(imgEl, count = 6) {
    const canvas = document.createElement('canvas')
    canvas.width = 100; canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imgEl, 0, 0, 100, 100)
    const data = ctx.getImageData(0, 0, 100, 100).data
    const buckets = {}
    for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 32) * 32, g = Math.round(data[i + 1] / 32) * 32, b = Math.round(data[i + 2] / 32) * 32
        const key = `${r},${g},${b}`
        buckets[key] = (buckets[key] || 0) + 1
    }
    return Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, count).map(([k]) => {
        const [r, g, b] = k.split(',').map(Number)
        return rgbToHex(r, g, b)
    })
}

const MODES = ['complementary', 'triadic', 'analogous', 'shades', 'split-complementary', 'tetradic']

export default function ColorPaletteGenerator() {
    const [color, setColor] = useState('#4f46e5')
    const [mode, setMode] = useState('triadic')
    const [palette, setPalette] = useState([])
    const [imagePalette, setImagePalette] = useState([])
    const [copied, setCopied] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [activeTab, setActiveTab] = useState('picker')

    const generate = () => setPalette(generatePalette(color, mode))

    const handleImageDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
        if (!file?.type.startsWith('image/')) return
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => setImagePalette(extractPaletteFromImage(img))
        img.src = url
    }

    const copyHex = (hex) => {
        navigator.clipboard.writeText(hex)
        setCopied(hex); setTimeout(() => setCopied(''), 2000)
    }

    const ColorCard = ({ hex }) => {
        const { r, g, b } = hexToRgb(hex)
        const { h, s, l } = rgbToHsl(r, g, b)
        const isLight = l > 60
        return (
            <div className="rounded-xl overflow-hidden shadow-md group cursor-pointer" onClick={() => copyHex(hex)}>
                <div style={{ backgroundColor: hex }} className="h-24 flex items-center justify-center">
                    <span className={`text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        {copied === hex ? '✓ Copied!' : 'Click to copy'}
                    </span>
                </div>
                <div className="bg-white p-3">
                    <p className="font-bold text-sm text-slate-800">{hex.toUpperCase()}</p>
                    <p className="text-xs text-slate-500">rgb({r},{g},{b})</p>
                    <p className="text-xs text-slate-400">hsl({h}°,{s}%,{l}%)</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <SEO
                title="Color Palette Generator — Pick Colors & Create Palettes Free"
                description="Generate beautiful color palettes from a hex color or extract colors from any image. Create triadic, complementary, analogous, and shades palettes. Free online tool."
                canonical="/color-palette-generator"
            />
            <ToolLayout
                toolSlug="color-palette-generator"
                title="Color Palette Generator"
                description="Generate harmonious color palettes or extract colors from images. Copy hex, RGB, and HSL values instantly."
                breadcrumb="Color Palette Generator"
            >
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
                    {[{ id: 'picker', label: 'Color Picker' }, { id: 'image', label: 'Extract from Image' }].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'picker' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-palette text-purple-500 mr-2"></i>Choose Base Color</h2>
                        <div className="flex flex-wrap items-end gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Base Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={color} onChange={e => setColor(e.target.value)}
                                        className="w-16 h-12 rounded-xl border border-slate-200 cursor-pointer" />
                                    <input type="text" value={color} onChange={e => e.target.value.match(/^#[0-9a-f]{6}$/i) && setColor(e.target.value)}
                                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono w-28" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Palette Mode</label>
                                <div className="flex flex-wrap gap-2">
                                    {MODES.map(m => (
                                        <button key={m} onClick={() => setMode(m)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize
                      ${mode === m ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-200 text-slate-600 hover:border-purple-300'}`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={generate}
                                className="btn-primary flex items-center gap-2">
                                <i className="fas fa-magic"></i> Generate
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'image' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleImageDrop}
                            onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = handleImageDrop; i.click() }}
                            className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''}`}>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-image text-purple-400 text-xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop an image to extract its color palette</p>
                                <p className="text-sm text-slate-400">Top 6 dominant colors will be extracted</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Palette Display */}
                {(palette.length > 0 || imagePalette.length > 0) && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-swatchbook text-purple-500 mr-2"></i>
                            {activeTab === 'image' ? 'Extracted Palette' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Palette`}
                            <span className="text-sm font-normal text-slate-400 ml-2">(click any color to copy hex)</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {(activeTab === 'image' ? imagePalette : palette).map((hex, i) => <ColorCard key={i} hex={hex} />)}
                        </div>
                    </div>
                )}

                {/* SEO Content */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Color Palette Generator</h2>
                    <p className="text-slate-600">Create beautiful, harmonious color palettes for your design projects. Our tool supports 6 color harmony modes based on color theory, helping you create professional color schemes for websites, apps, logos, and print materials.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Color Harmony Modes Explained</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>Complementary</strong> — Two colors opposite on the color wheel. High contrast, vibrant.</li>
                        <li><strong>Triadic</strong> — Three colors evenly spaced. Balanced and visually interesting.</li>
                        <li><strong>Analogous</strong> — Three adjacent colors. Natural, harmonious look.</li>
                        <li><strong>Shades</strong> — Five tints and shades of the same hue. Perfect for UI gradients.</li>
                        <li><strong>Split-complementary</strong> — One base color plus two adjacent to its complement.</li>
                        <li><strong>Tetradic</strong> — Four colors in two complementary pairs. Rich and complex.</li>
                    </ul>
                    <p className="text-slate-600 mt-4">After selecting your palette, you can use our <a href="/image-to-art" className="text-blue-600 hover:underline">Image to Art tool</a> to apply artistic effects to your photos.</p>
                </div>
            </ToolLayout>
        </>
    )
}
