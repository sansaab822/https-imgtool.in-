import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function PdfPasswordRemover() {
    const [file, setFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [password, setPassword] = useState('')
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const handleFile = useCallback((f) => {
        if (!f || f.type !== 'application/pdf') return
        setFile(f); setResult(null); setError('')
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const remove = async () => {
        if (!file) return
        setProcessing(true); setError('')
        try {
            const { PDFDocument } = await import('pdf-lib')
            const arrayBuffer = await file.arrayBuffer()
            let pdfDoc
            try {
                pdfDoc = await PDFDocument.load(arrayBuffer, {
                    password: password || undefined,
                    ignoreEncryption: !password,
                })
            } catch {
                setError('Incorrect password or the PDF uses an unsupported encryption method. Please enter the correct owner/user password.')
                setProcessing(false); return
            }

            // Re-save without encryption
            const cleanBytes = await pdfDoc.save({ useObjectStreams: false })
            const blob = new Blob([cleanBytes], { type: 'application/pdf' })
            setResult(URL.createObjectURL(blob))
        } catch (err) {
            setError('Failed to remove password: ' + err.message)
        }
        setProcessing(false)
    }

    const download = () => {
        const a = document.createElement('a')
        a.href = result
        a.download = file.name.replace('.pdf', '-unlocked.pdf')
        a.click()
    }

    const fmtSize = b => `${(b / 1024).toFixed(1)} KB`

    return (
        <>
            <SEO
                title="PDF Password Remover — Remove PDF Password Free Online"
                description="Remove password protection from PDF files online. Enter the PDF password to unlock and download an unprotected version. Free, private, browser-based."
                canonical="/pdf-password-remover"
            />
            <ToolLayout toolSlug="pdf-password-remover" title="PDF Password Remover" description="Remove password protection from PDFs you own. Enter the password to unlock and re-save without encryption." breadcrumb="PDF Password Remover">

                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
                    <i className="fas fa-shield-alt mr-2"></i>
                    <strong>Legal Notice:</strong> Only use this tool on PDF files you own or have permission to unlock. This tool requires you to know the existing password — it does not crack or bypass encryption.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${file ? 'border-red-400 bg-red-50' : ''}`}>
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <i className="fas fa-lock text-4xl text-red-400"></i>
                                <p className="font-semibold text-red-700">{file.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(file.size)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-unlock text-red-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop your password-protected PDF</p>
                                <p className="text-sm text-slate-400">You must know the PDF password to unlock it</p>
                            </div>
                        )}
                    </div>
                </div>

                {file && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-key text-red-500 mr-2"></i>Enter PDF Password</h2>
                        <div className="flex gap-3">
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter the PDF password..."
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                                onKeyDown={e => e.key === 'Enter' && remove()}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Leave empty if the PDF is not password-protected but has restrictions (like no printing/copying).
                        </p>
                        {error && (
                            <div className="mt-3 p-3 bg-red-50 rounded-xl text-sm text-red-700">
                                <i className="fas fa-exclamation-triangle mr-2"></i>{error}
                            </div>
                        )}
                    </div>
                )}

                {file && !processing && !result && (
                    <button onClick={remove} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-unlock"></i> Remove Password Protection
                    </button>
                )}

                {processing && (
                    <div className="bg-red-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-2xl text-red-500"></i>
                        <p className="font-semibold text-red-800">Removing password protection...</p>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-bold text-slate-800 mb-4">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            Password Removed Successfully!
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">Your PDF has been saved without password protection. Anyone can now open, print, and copy content from this file.</p>
                        <div className="flex gap-3">
                            <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className="fas fa-download"></i> Download Unlocked PDF
                            </button>
                            <a href={result} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-full hover:bg-blue-100 transition-all">
                                <i className="fas fa-eye"></i> Preview
                            </a>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">PDF Password Remover</h2>
                    <p className="text-slate-600">Remove password protection from PDF files you own. This tool uses the pdf-lib library to decrypt the PDF using the password you provide and re-save it without any encryption. Your file never leaves your device — all processing is done in your browser.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Types of PDF Protection</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>User password (Open password)</strong> — Requires password to open the file</li>
                        <li><strong>Owner password (Permissions password)</strong> — Allows opening but restricts printing, copying, editing</li>
                        <li><strong>No password, just restrictions</strong> — Leave password field empty and try removing</li>
                    </ul>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Privacy Guaranteed</h3>
                    <p className="text-slate-600">Your PDF and password are never sent to any server. The decryption happens entirely in your browser using JavaScript. After you close the tab, no trace of your file remains.</p>
                    <p className="text-slate-600 mt-4">Related tools: <a href="/remove-pdf-watermark" className="text-blue-600 hover:underline">Remove PDF Watermark</a> · <a href="/merge-pdf" className="text-blue-600 hover:underline">Merge PDF</a> · <a href="/pdf-crop" className="text-blue-600 hover:underline">PDF Crop</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
