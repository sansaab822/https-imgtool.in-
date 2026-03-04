import { useState, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function QRCodeGenerator() {
    const [url, setUrl] = useState('https://imgtool.in')
    const [logo, setLogo] = useState(null)
    const [logoSize, setLogoSize] = useState(25) // percentage of QR size
    const [colorDark, setColorDark] = useState('#000000')
    const [colorLight, setColorLight] = useState('#ffffff')
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const canvasRef = useRef(null)

    const loadLogo = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = e => {
            const img = new Image()
            img.onload = () => { setLogo(img); setTimeout(generate, 100) }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    const generate = async () => {
        if (!url.trim()) return
        setError('')
        try {
            if (!window.QRCode) {
                await new Promise((res, rej) => {
                    const s = document.createElement('script')
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
                    s.onload = res; s.onerror = rej
                    document.head.appendChild(s)
                })
            }

            const tmpDiv = document.createElement('div')
            new window.QRCode(tmpDiv, {
                text: url,
                width: 1024,
                height: 1024,
                colorDark,
                colorLight,
                correctLevel: window.QRCode.CorrectLevel.H // High error correction needed for logo
            })

            // give it 50ms to render the canvas
            setTimeout(() => {
                const qrCanvas = tmpDiv.querySelector('canvas')
                if (!qrCanvas) { setError('Failed to generate QR'); return }

                const canvas = canvasRef.current
                canvas.width = 1024; canvas.height = 1024
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = colorLight
                ctx.fillRect(0, 0, 1024, 1024)
                ctx.drawImage(qrCanvas, 0, 0)

                if (logo) {
                    const s = (logoSize / 100) * 1024
                    const x = (1024 - s) / 2
                    const y = (1024 - s) / 2

                    // Draw white background for logo
                    ctx.fillStyle = colorLight
                    ctx.fillRect(x - 10, y - 10, s + 20, s + 20)

                    // Draw logo
                    ctx.drawImage(logo, x, y, s, s)
                }

                setResult(canvas.toDataURL('image/png'))
            }, 50)

        } catch (e) {
            setError('Failed to load QR library: ' + e.message)
        }
    }

    useEffect(() => {
        const t = setTimeout(generate, 500)
        return () => clearTimeout(t)
    }, [url, colorDark, colorLight, logoSize])

    return (
        <>
            <SEO title="Create QR Code with Logo Inside Online Free" description="Generate high-resolution QR codes with a custom logo embedded in the center. Customize colors. Free, instant browser-based QR generator." canonical="/qr-code-generator" />
            <ToolLayout toolSlug="qr-code-generator" title="QR Code Generator with Logo" description="Create custom QR codes with an embedded logo and custom colors. Download as high-res PNG." breadcrumb="QR Code Generator">

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                        <h2 className="font-bold text-slate-800"><i className="fas fa-link text-blue-500 mr-2"></i>QR Code Data</h2>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">URL or Text</label>
                            <textarea value={url} onChange={e => setUrl(e.target.value)} rows="3" placeholder="https://..."
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" />
                        </div>

                        <h2 className="font-bold text-slate-800 border-t border-slate-100 pt-6"><i className="fas fa-paint-brush text-blue-500 mr-2"></i>Design</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Foreground</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={colorDark} onChange={e => setColorDark(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                                    {['#000000', '#1e3a8a', '#b91c1c'].map(c => (
                                        <button key={c} onClick={() => setColorDark(c)} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full border-2 border-slate-300 hover:scale-110" />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Background</label>
                                <input type="color" value={colorLight} onChange={e => setColorLight(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                            </div>
                        </div>

                        <h2 className="font-bold text-slate-800 border-t border-slate-100 pt-6"><i className="fas fa-image text-blue-500 mr-2"></i>Center Logo (Optional)</h2>
                        <div onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => loadLogo(e.target.files[0]); i.click() }}
                            className={`drop-zone py-4 cursor-pointer ${logo ? 'border-blue-400 bg-blue-50' : ''}`}>
                            {logo ? (
                                <div className="flex flex-col items-center gap-2">
                                    <img src={logo.src} alt="" className="h-12 w-12 object-contain" />
                                    <p className="text-xs text-blue-700 font-medium cursor-pointer underline" onClick={e => { e.stopPropagation(); setLogo(null); setTimeout(generate, 50) }}>Remove Logo</p>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-slate-600"><i className="fas fa-upload mr-2"></i>Upload Logo Image</p>
                            )}
                        </div>

                        {logo && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Logo Size: {logoSize}%</label>
                                <input type="range" min="10" max="35" value={logoSize} onChange={e => setLogoSize(+e.target.value)} className="slider-range w-full" />
                                <p className="text-[10px] text-slate-400 mt-1">Keep under 30% to ensure QR code stays scannable.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {result ? (
                            <>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6">
                                    <img src={result} alt="QR Code" className="w-64 h-64 object-contain mx-auto mix-blend-multiply" />
                                </div>
                                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'qrcode.png'; a.click() }}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30">
                                    <i className="fas fa-download"></i>Download High-Res PNG
                                </button>
                            </>
                        ) : (
                            <div className="w-64 h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                                Generating preview...
                            </div>
                        )}
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Custom QR Code with Logo</h2>
                    <p className="text-slate-600">Generate high-resolution (1024x1024) QR codes instantly. By using High (H-level) error correction, this tool allows you to safely embed your company logo or icon directly in the center of the QR code without breaking scannability. Customize the foreground and background colors to match your brand identity.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Best Scannability Practices</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Ensure high contrast between foreground and background (dark on light is best)</li>
                        <li>Keep the logo size under 30% to prevent covering too many data modules</li>
                        <li>Always test-scan the downloaded code with your phone camera before printing</li>
                        <li>Use simple URLs if possible (fewer characters = less dense dots = easier to scan)</li>
                    </ul>
                </div>
            </ToolLayout>
        </>
    )
}
