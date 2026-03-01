import { useState, useRef, useCallback } from 'react'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const DATE_FORMATS = [
    { label: 'DD/MM/YYYY', fn: (d) => d.toLocaleDateString('en-IN') },
    { label: 'DD-MM-YYYY', fn: (d) => d.toLocaleDateString('en-IN').replace(/\//g, '-') },
    { label: 'YYYY-MM-DD', fn: (d) => d.toISOString().split('T')[0] },
    { label: 'DD.MM.YYYY', fn: (d) => d.toLocaleDateString('en-IN').replace(/\//g, '.') },
]

const FONT_FAMILIES = [
    { id: 'Arial', label: 'Arial' },
    { id: 'Times New Roman', label: 'Times NR' },
    { id: 'Calibri', label: 'Calibri' },
    { id: 'Verdana', label: 'Verdana' },
    { id: 'Georgia', label: 'Georgia' },
]

export default function SscPhoto() {
    const [photo, setPhoto] = useState(null)
    const [dateText, setDateText] = useState(() => new Date().toLocaleDateString('en-IN'))
    const [nameText, setNameText] = useState('')
    const [datePos, setDatePos] = useState({ x: 50, y: 90 })
    const [fontSize, setFontSize] = useState(14)
    const [fontColor, setFontColor] = useState('#000000')
    const [fontFamily, setFontFamily] = useState('Arial')
    const [isBold, setIsBold] = useState(true)
    const [isItalic, setIsItalic] = useState(false)
    const [bgOpacity, setBgOpacity] = useState(70)
    const [outputFmt, setOutputFmt] = useState('jpg')
    const [result, setResult] = useState(null)
    const [dragging, setDragging] = useState(false)
    const imgRef = useRef()
    const inputRef = useRef()

    const loadPhoto = useCallback((file) => {
        if (!file) return
        setPhoto({ url: URL.createObjectURL(file), file })
        setResult(null)
    }, [])

    const applyDateFormat = (fmt) => {
        setDateText(fmt.fn(new Date()))
    }

    const generatePhoto = () => {
        if (!imgRef.current) return
        const img = imgRef.current
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const x = (datePos.x / 100) * canvas.width
        const y = (datePos.y / 100) * canvas.height
        const scaledFontSize = Math.round(fontSize * canvas.width / 200)
        const weight = isBold ? 'bold' : 'normal'
        const style = isItalic ? 'italic' : 'normal'
        ctx.font = `${style} ${weight} ${scaledFontSize}px ${fontFamily}`
        ctx.textAlign = 'center'

        // Build text lines
        const lines = [dateText]
        if (nameText.trim()) lines.push(nameText.trim())

        // Calculate background size
        let maxWidth = 0
        for (const line of lines) {
            const m = ctx.measureText(line)
            if (m.width > maxWidth) maxWidth = m.width
        }
        const lineHeight = scaledFontSize * 1.3
        const totalH = lines.length * lineHeight
        const pad = scaledFontSize * 0.4

        // Background
        ctx.fillStyle = `rgba(255,255,255,${bgOpacity / 100})`
        ctx.fillRect(x - maxWidth / 2 - pad, y - scaledFontSize - pad, maxWidth + pad * 2, totalH + pad * 2)

        // Text
        ctx.fillStyle = fontColor
        lines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * lineHeight)
        })

        const mime = outputFmt === 'png' ? 'image/png' : 'image/jpeg'
        canvas.toBlob(blob => {
            setResult({
                url: URL.createObjectURL(blob),
                name: `ssc_photo_${dateText.replace(/\//g, '-')}.${outputFmt}`,
            })
        }, mime, 0.97)
    }

    return (
        <>
            <SEO title="SSC Photo & Date Adder - Add Date to Passport Photo" description="Add date and name to SSC exam passport photos. Multiple fonts, colors, positions, and formats. Free & private." canonical="/ssc-photo-date-adder" />
            <ToolLayout toolSlug="ssc-photo-date-adder" title="SSC Photo & Date Adder" description="Add date signature to passport photos for SSC, UPSC, Railway, and other government exams." breadcrumb="SSC Photo Date">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* ── Left Panel ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {!photo ? (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadPhoto(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => loadPhoto(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-calendar-alt text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Upload passport photo or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">35×45mm passport photo recommended</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">
                                        <i className="fas fa-camera text-blue-400 mr-1"></i>Photo Preview
                                    </span>
                                    <button onClick={() => { setPhoto(null); setResult(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center min-h-[250px]">
                                    <div className="relative inline-block">
                                        <img ref={imgRef} src={photo.url} alt="Photo Preview" className="max-h-72 mx-auto block object-contain rounded-lg" crossOrigin="anonymous" />
                                        {/* Live text overlay preview */}
                                        <div className="absolute px-2 py-0.5 rounded text-center pointer-events-none" style={{
                                            left: `${datePos.x}%`, top: `${datePos.y}%`, transform: 'translate(-50%, -100%)',
                                            backgroundColor: `rgba(255,255,255,${bgOpacity / 100})`,
                                            color: fontColor,
                                            fontSize: `${fontSize * 0.7}px`,
                                            fontFamily,
                                            fontWeight: isBold ? 'bold' : 'normal',
                                            fontStyle: isItalic ? 'italic' : 'normal',
                                        }}>
                                            <div>{dateText}</div>
                                            {nameText && <div>{nameText}</div>}
                                        </div>
                                    </div>
                                </div>

                                {result && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-circle-check text-green-500"></i>
                                            <span className="text-sm font-bold text-green-800">Photo Ready!</span>
                                        </div>
                                        <a href={result.url} download={result.name} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                                            <i className="fas fa-download"></i> Download
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-calendar-alt text-blue-500"></i> Text Settings
                            </h3>

                            {/* Date Text */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Date Text</label>
                                <input type="text" value={dateText} onChange={e => setDateText(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                    {DATE_FORMATS.map(f => (
                                        <button key={f.label} onClick={() => applyDateFormat(f)}
                                            className="px-2 py-1 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-[10px] font-medium rounded transition-all">
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name (optional) */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Name (optional)</label>
                                <input type="text" value={nameText} onChange={e => setNameText(e.target.value)} placeholder="Add name below date"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Font</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {FONT_FAMILIES.map(f => (
                                        <button key={f.id} onClick={() => setFontFamily(f.id)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${fontFamily === f.id ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}
                                            style={{ fontFamily: f.id }}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bold/Italic */}
                            <div className="flex gap-2">
                                <button onClick={() => setIsBold(!isBold)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${isBold ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                    <b>B</b> Bold
                                </button>
                                <button onClick={() => setIsItalic(!isItalic)}
                                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${isItalic ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                    <i>I</i> Italic
                                </button>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Font Size</span><span className="font-bold text-blue-600">{fontSize}px</span>
                                </label>
                                <input type="range" min="8" max="40" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Font Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Font Color</label>
                                <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)}
                                    className="w-full h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer" />
                            </div>

                            {/* Background Opacity */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Background Opacity</span><span className="font-bold text-blue-600">{bgOpacity}%</span>
                                </label>
                                <input type="range" min="0" max="100" value={bgOpacity} onChange={e => setBgOpacity(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Position */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                        <span>X Position</span><span>{datePos.x}%</span>
                                    </label>
                                    <input type="range" min="5" max="95" value={datePos.x} onChange={e => setDatePos(p => ({ ...p, x: +e.target.value }))} className="slider-range w-full" />
                                </div>
                                <div>
                                    <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                        <span>Y Position</span><span>{datePos.y}%</span>
                                    </label>
                                    <input type="range" min="5" max="95" value={datePos.y} onChange={e => setDatePos(p => ({ ...p, y: +e.target.value }))} className="slider-range w-full" />
                                </div>
                            </div>

                            {/* Output Format */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Output Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['jpg', 'png'].map(f => (
                                        <button key={f} onClick={() => setOutputFmt(f)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${outputFmt === f ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate */}
                            <button onClick={generatePhoto} disabled={!photo}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                <i className="fas fa-calendar-alt"></i> Add Date to Photo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">Add Dates and Names to Exam Photos Instantly</h2>
                        <p>
                            Applying for government examinations or competitive job postings often involves navigating a maze of strict documentation requirements. One of the most common—and most frequently mishandled—requirements is submitting a passport-size photograph with the current date, and sometimes your full name, printed visibly at the bottom. Historically, candidates would have to physically go to a photo studio to request this specific format, or attempt to clumsily edit the text onto the image using basic, hard-to-use paint software. Our specialized SSC Photo & Date Adder eliminates this hassle entirely, allowing you to digitally stamp your application photos with precision in seconds.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Crucial for SSC, UPSC, and Railway Apps</h3>
                        <p>
                            Commissions like the Staff Selection Commission (SSC) and the Union Public Service Commission (UPSC) in India are notoriously strict about application formats. A photograph that does not clearly display the date it was taken (usually required to be within the last three months) is one of the leading causes for immediate application rejection. This tool is purpose-built to help candidates comply with these exact standards. You can easily insert the current date, or a custom past date, ensuring your application moves through the screening process without a hitch.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Complete Typographical Control</h3>
                        <p>
                            Different examination boards may have varying preferences for how the text should look. We provide a full suite of typographical controls directly in your browser. You can choose from standard, highly readable fonts like Arial or Times New Roman, adjust the font size to ensure it is legible without obscuring your face, and toggle bold or italic styling. Crucially, we also feature a background opacity slider. This allows you to place a semi-transparent white box behind the text, guaranteeing that your name and date stand out perfectly clear, regardless of what color shirt you are wearing or what the background of the original photo looks like.
                        </p>
                        <p>
                            If you realize your uploaded photo hasn't been cropped to the correct dimensions (usually 35x45mm) before adding the date, we highly recommend running it through our <a href="/passport-size-photo" className="text-blue-600 hover:underline">Passport Size Photo Maker</a> first. Once you have the perfect crop, bring it back here to add your required text overlay.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Local Processing for Total Privacy</h3>
                        <p>
                            As an applicant, you are dealing with sensitive, personally identifiable information—your face and your full legal name. The vast majority of online photo editors upload your image to their corporate servers to process the text overlay, which poses a significant privacy risk. Our architecture is different. The image manipulation canvas runs entirely within the local memory of your web browser. Your photograph and your inputted data never leave your device, ensuring total security and privacy during your application process.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">How to Use the Date Adder</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Upload Your Base Image:</strong> Drag and drop your pre-cropped, passport-sized photograph into the upload zone.</li>
                            <li><strong>Configure the Text:</strong> Use the input fields to type out the specific date and your name as required by your application guidelines.</li>
                            <li><strong>Adjust Positioning:</strong> Use the X and Y sliders to move the text block so it sits comfortably at the bottom of the frame, ensuring it does not cover your chin or neck.</li>
                            <li><strong>Style for Legibility:</strong> Tweak the text size, color, and background opacity until the information is perfectly readable.</li>
                            <li><strong>Generate and Download:</strong> Select your preferred output format (JPG is usually required for digital applications) and download the finalized, stamped image.</li>
                        </ol>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Common Questions Answered</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">Will this lower the resolution of my application photo?</h4>
                                <p className="mt-1">No. The HTML5 canvas technology we use maps the text onto the image at the native resolution of the file you upload. Assuming you upload a clear, high-quality image, the resulting stamped photo will maintain that exact same quality.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">What format should the date be in?</h4>
                                <p className="mt-1">This depends entirely on the specific exam notification. However, the most universally accepted formats are DD-MM-YYYY or DD/MM/YYYY. Our tool includes quick-select buttons for the most common formats, but you can also manually type whatever specific format is requested.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I use this on a mobile phone?</h4>
                                <p className="mt-1">Absolutely. The interface is fully responsive, meaning you can easily upload a selfie you just took, crop it, add the date, and download it right from your smartphone browser, ready to be uploaded to the official exam portal.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">The text is hard to read against my dark shirt. How do I fix this?</h4>
                                <p className="mt-1">This is why we included the Background Opacity slider. Simply change the font color to black, and increase the background opacity to around 70-100%. This will draw a solid white box behind the text, completely isolating it from your shirt color for maximum legibility.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is this tool affiliated with the SSC or UPSC?</h4>
                                <p className="mt-1">No, this is an independent, free utility designed to help candidates format their application materials correctly. You must always refer to the official exam notification for the exact, up-to-date photograph requirements.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}
