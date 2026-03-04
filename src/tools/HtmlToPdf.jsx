import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function HtmlToPdf() {
    const [inputMode, setInputMode] = useState('html')
    const [htmlInput, setHtmlInput] = useState(`<h1>My Report</h1>
<p>This is a <strong>sample PDF</strong> generated from HTML.</p>
<h2>Key Points</h2>
<ul>
  <li>Point one with details</li>
  <li>Point two with details</li>
  <li>Point three with details</li>
</ul>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
  <tr><th>Name</th><th>Value</th></tr>
  <tr><td>Item A</td><td>100</td></tr>
  <tr><td>Item B</td><td>200</td></tr>
</table>`)
    const [markdownInput, setMarkdownInput] = useState(`# My Document\n\nThis text will be **converted** to PDF.\n\n## Section 1\n\n- Item one\n- Item two\n- Item three\n\n## Section 2\n\nMore content here...`)
    const [pageSize, setPageSize] = useState('A4')
    const [processing, setProcessing] = useState(false)
    const iframeRef = useRef(null)

    function markdownToHtml(md) {
        return md
            .replace(/^#{3} (.+)$/gm, '<h3>$1</h3>')
            .replace(/^#{2} (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            .replace(/\n\n+/g, '</p><p>')
            .replace(/^(?!<[h|u|o|l|t|p])/gm, '')
            .trim()
    }

    const generate = async () => {
        setProcessing(true)
        const content = inputMode === 'markdown' ? markdownToHtml(markdownInput) : htmlInput
        const pageDims = pageSize === 'A4' ? { width: '210mm', height: '297mm' } : { width: '8.5in', height: '11in' }
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { size: ${pageSize}; margin: 20mm; }
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #222; }
  h1 { font-size: 24pt; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; }
  h2 { font-size: 18pt; color: #1e40af; margin-top: 24px; }
  h3 { font-size: 14pt; color: #1d4ed8; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  th { background: #1e3a8a; color: white; padding: 8px 12px; text-align: left; }
  td { padding: 8px 12px; border: 1px solid #e2e8f0; }
  tr:nth-child(even) { background: #f8fafc; }
  ul, ol { padding-left: 24px; }
  li { margin: 4px 0; }
  img { max-width: 100%; }
</style>
</head>
<body>${content}</body>
</html>`

        // Use print dialog to save as PDF
        const win = window.open('', '_blank')
        win.document.write(fullHtml)
        win.document.close()
        setTimeout(() => { win.focus(); win.print(); setProcessing(false) }, 500)
    }

    const preview = inputMode === 'markdown' ? markdownToHtml(markdownInput) : htmlInput

    return (
        <>
            <SEO title="HTML to PDF Converter — Convert HTML & Markdown to PDF Free" description="Convert HTML or Markdown text to PDF online. Free browser-based tool. Style your PDF with headers, tables, and formatting. No upload required." canonical="/html-to-pdf" />
            <ToolLayout toolSlug="html-to-pdf" title="HTML / Markdown to PDF" description="Convert HTML or Markdown content to styled PDF. Opens in print dialog for saving as PDF." breadcrumb="HTML to PDF">
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6 text-sm text-blue-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    Click <strong>"Generate PDF"</strong> to open the browser print dialog. Select <strong>"Save as PDF"</strong> as the destination printer to download your PDF file.
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
                    {['html', 'markdown'].map(m => (
                        <button key={m} onClick={() => setInputMode(m)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all ${inputMode === m ? 'bg-white shadow text-red-700' : 'text-slate-500 hover:text-slate-700'}`}>
                            {m}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Input */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <label className="block font-bold text-slate-800 mb-3">
                            <i className="fas fa-code text-red-500 mr-2"></i>
                            {inputMode === 'html' ? 'HTML Input' : 'Markdown Input'}
                        </label>
                        <textarea
                            value={inputMode === 'html' ? htmlInput : markdownInput}
                            onChange={e => inputMode === 'html' ? setHtmlInput(e.target.value) : setMarkdownInput(e.target.value)}
                            rows={16}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono resize-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                        />
                        <div className="mt-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Page Size</label>
                            <div className="flex gap-2">
                                {['A4', 'Letter'].map(s => (
                                    <button key={s} onClick={() => setPageSize(s)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all
                    ${pageSize === s ? 'border-red-500 bg-red-500 text-white' : 'border-slate-200 text-slate-600 hover:border-red-300'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden">
                        <p className="font-bold text-slate-800 mb-3"><i className="fas fa-eye text-red-500 mr-2"></i>Live Preview</p>
                        <div className="border border-slate-100 rounded-xl p-4 overflow-y-auto max-h-80 bg-white text-sm"
                            dangerouslySetInnerHTML={{ __html: preview }} />
                    </div>
                </div>

                <button onClick={generate} disabled={processing}
                    className="btn-primary flex items-center gap-2 mb-6 disabled:opacity-50">
                    {processing ? <><i className="fas fa-spinner fa-spin"></i> Opening Print Dialog...</> : <><i className="fas fa-file-pdf"></i> Generate PDF</>}
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">HTML & Markdown to PDF Converter</h2>
                    <p className="text-slate-600">Convert HTML or Markdown content to beautifully styled PDF files using your browser's built-in print engine. This tool generates professional-looking PDFs with proper typography, tables, lists, and headings — no external libraries required.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How to Save as PDF</h3>
                    <ol className="list-decimal list-inside text-slate-600 space-y-2">
                        <li>Write or paste your HTML or Markdown content in the editor</li>
                        <li>See the live preview on the right to check formatting</li>
                        <li>Select page size (A4 for India/Europe, Letter for USA)</li>
                        <li>Click Generate PDF — a print dialog will open</li>
                        <li>In the printer list, select "Save as PDF" and click Save</li>
                    </ol>
                    <p className="text-slate-600 mt-4">Related: <a href="/merge-pdf" className="text-blue-600 hover:underline">Merge PDF</a> · <a href="/pdf-to-excel" className="text-blue-600 hover:underline">PDF to Excel</a> · <a href="/pdf-password-remover" className="text-blue-600 hover:underline">PDF Password Remover</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
