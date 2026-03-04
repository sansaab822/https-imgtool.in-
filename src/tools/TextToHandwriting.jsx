import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

const FONTS = [
    { id: 'caveat', name: 'Caveat', url: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap', style: 'Caveat, cursive' },
    { id: 'dancing', name: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap', style: '"Dancing Script", cursive' },
    { id: 'satisfy', name: 'Satisfy', url: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap', style: 'Satisfy, cursive' },
    { id: 'pacifico', name: 'Pacifico', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', style: 'Pacifico, cursive' },
    { id: 'sacramento', name: 'Sacramento', url: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap', style: 'Sacramento, cursive' },
    { id: 'kalam', name: 'Kalam', url: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap', style: 'Kalam, cursive' },
]

const PAPER_STYLES = [
    { id: 'white', name: 'White Paper', bg: '#ffffff', lines: false },
    { id: 'lined', name: 'Lined Paper', bg: '#fffef0', lines: true },
    { id: 'cream', name: 'Cream Paper', bg: '#fdf8e1', lines: false },
    { id: 'transparent', name: 'Transparent', bg: 'transparent', lines: false },
]

function loadFont(font) {
    const existing = document.getElementById('hwf-' + font.id)
    if (existing) return Promise.resolve()
    return new Promise(res => {
        const link = document.createElement('link')
        link.id = 'hwf-' + font.id
        link.rel = 'stylesheet'
        link.href = font.url
        link.onload = res
        document.head.appendChild(link)
    })
}

export default function TextToHandwriting() {
    const [text, setText] = useState('Write your text here...\nIt will appear in beautiful handwriting.')
    const [font, setFont] = useState(FONTS[0])
    const [fontSize, setFontSize] = useState(36)
    const [inkColor, setInkColor] = useState('#1a1a2e')
    const [paperStyle, setPaperStyle] = useState(PAPER_STYLES[1])
    const [lineSpacing, setLineSpacing] = useState(60)
    const [generated, setGenerated] = useState(null)
    const [generating, setGenerating] = useState(false)
    const canvasRef = useRef(null)

    const generate = async () => {
        setGenerating(true)
        await loadFont(font)
        await new Promise(res => setTimeout(res, 600)) // wait for font to render

        const canvas = canvasRef.current
        const lines = text.split('\n')
        const padding = 40
        const width = 800
        const height = padding * 2 + lines.length * lineSpacing + 20

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Background
        if (paperStyle.bg !== 'transparent') {
            ctx.fillStyle = paperStyle.bg
            ctx.fillRect(0, 0, width, height)
        } else {
            ctx.clearRect(0, 0, width, height)
        }

        // Lined paper effect
        if (paperStyle.lines) {
            ctx.strokeStyle = '#a0c4ff'
            ctx.lineWidth = 1
            ctx.globalAlpha = 0.4
            for (let y = padding + lineSpacing; y < height - padding; y += lineSpacing) {
                ctx.beginPath()
                ctx.moveTo(padding, y)
                ctx.lineTo(width - padding, y)
                ctx.stroke()
            }
            // Red margin line
            ctx.strokeStyle = '#ff6b6b'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(80, 0)
            ctx.lineTo(80, height)
            ctx.stroke()
            ctx.globalAlpha = 1
        }

        // Text
        ctx.fillStyle = inkColor
        ctx.font = `${fontSize}px ${font.style}`
        ctx.textBaseline = 'alphabetic'
        lines.forEach((line, i) => {
            const x = paperStyle.lines ? 100 : padding
            const y = padding + (i + 1) * lineSpacing
            ctx.fillText(line, x, y)
        })

        setGenerated(canvas.toDataURL('image/png'))
        setGenerating(false)
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = generated
        a.download = 'handwriting-imgtool.png'
        a.click()
    }

    return (
        <>
            <SEO
                title="Text to Handwriting Converter — Free Online Tool"
                description="Convert typed text to realistic handwriting style. Choose from 6 script fonts, custom ink color, lined or plain paper. Download as PNG. Free, no signup."
                canonical="/text-to-handwriting"
            />
            <ToolLayout
                toolSlug="text-to-handwriting"
                title="Text to Handwriting"
                description="Convert typed text to beautiful handwriting styles with different fonts and paper backgrounds."
                breadcrumb="Text to Handwriting"
            >
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Input */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <label className="block font-bold text-slate-800 mb-3"><i className="fas fa-keyboard text-indigo-500 mr-2"></i>Type Your Text</label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={8}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="Type or paste your text here..."
                            maxLength={500}
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{text.length}/500 characters</p>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                        <h2 className="font-bold text-slate-800"><i className="fas fa-sliders-h text-indigo-500 mr-2"></i>Settings</h2>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Handwriting Font</label>
                            <div className="grid grid-cols-2 gap-2">
                                {FONTS.map(f => (
                                    <button key={f.id} onClick={() => setFont(f)}
                                        className={`p-2 rounded-lg border text-sm transition-all ${font.id === f.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                                        style={{ fontFamily: f.style }}>
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Paper Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {PAPER_STYLES.map(p => (
                                    <button key={p.id} onClick={() => setPaperStyle(p)}
                                        className={`p-2 rounded-lg border text-xs font-medium transition-all
                    ${paperStyle.id === p.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Font Size: {fontSize}px</label>
                                <input type="range" min="20" max="60" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="slider-range" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Line Spacing: {lineSpacing}px</label>
                                <input type="range" min="40" max="80" value={lineSpacing} onChange={e => setLineSpacing(+e.target.value)} className="slider-range" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Ink Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={inkColor} onChange={e => setInkColor(e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                <div className="flex gap-2">
                                    {['#1a1a2e', '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#000000'].map(c => (
                                        <button key={c} onClick={() => setInkColor(c)}
                                            style={{ backgroundColor: c }}
                                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate */}
                <div className="flex gap-3 mb-6">
                    <button onClick={generate} disabled={!text.trim() || generating}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        {generating ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-pen-fancy"></i> Convert to Handwriting</>}
                    </button>
                    {generated && (
                        <button onClick={download}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                            <i className="fas fa-download"></i> Download PNG
                        </button>
                    )}
                </div>

                {generated && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-eye text-indigo-500 mr-2"></i>Preview</h2>
                        <img src={generated} alt="Handwriting preview" className="w-full rounded-xl shadow-md border border-slate-100" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Text to Handwriting Converter</h2>
                    <p className="text-slate-600">Convert any typed text into beautiful handwriting-style images using free Google Fonts. Perfect for notes, greeting cards, school projects, social media posts, and anywhere you want a personal, handwritten touch.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Available Handwriting Fonts</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>Caveat</strong> — Casual and friendly, like everyday note-taking</li>
                        <li><strong>Dancing Script</strong> — Elegant and flowing, great for invitations</li>
                        <li><strong>Satisfy</strong> — Bold and expressive signature style</li>
                        <li><strong>Pacifico</strong> — Fun and rounded, perfect for headings</li>
                        <li><strong>Sacramento</strong> — Thin and delicate calligraphy style</li>
                        <li><strong>Kalam</strong> — Indian handwriting style, supports Devanagari</li>
                    </ul>
                    <p className="text-slate-600 mt-4">All fonts are loaded from Google Fonts using free open-source licenses. No text is uploaded to any server — all processing happens in your browser.</p>
                    <p className="text-slate-600 mt-2">You can also use our <a href="/image-compressor" className="text-blue-600 hover:underline">Image Compressor</a> to reduce the PNG file size after download.</p>
                </div>
            </ToolLayout>
        </>
    )
}
