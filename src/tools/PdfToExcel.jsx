import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

export default function PdfToExcel() {
    const [file, setFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [tables, setTables] = useState([])
    const [error, setError] = useState('')

    const handleFile = useCallback(async (f) => {
        if (!f || f.type !== 'application/pdf') return
        setFile(f); setTables([]); setError('')
    }, [])

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const extract = async () => {
        if (!file) return
        setProcessing(true); setTables([]); setError('')
        try {
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href

            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            const allTables = []

            for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
                const page = await pdf.getPage(pageNum)
                const textContent = await page.getTextContent()
                const viewport = page.getViewport({ scale: 1 })

                // Group items into rows by Y position
                const items = textContent.items.map(item => ({
                    text: item.str.trim(),
                    x: Math.round(item.transform[4]),
                    y: Math.round(viewport.height - item.transform[5]),
                    width: item.width,
                })).filter(i => i.text)

                // Cluster by Y position (row detection)
                const rowMap = {}
                items.forEach(item => {
                    const yKey = Math.round(item.y / 8) * 8
                    if (!rowMap[yKey]) rowMap[yKey] = []
                    rowMap[yKey].push(item)
                })

                const rows = Object.entries(rowMap)
                    .sort(([a], [b]) => +a - +b)
                    .map(([, cells]) => cells.sort((a, b) => a.x - b.x).map(c => c.text))
                    .filter(r => r.length > 1)

                if (rows.length > 0) allTables.push({ page: pageNum, rows })
            }

            setTables(allTables)
            if (!allTables.length) setError('No tabular data detected in this PDF. Try a PDF with structured table layouts.')
        } catch (err) {
            setError('Failed to extract: ' + err.message)
        }
        setProcessing(false)
    }

    const downloadCSV = (table) => {
        const csv = table.rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `pdf-table-page${table.page}.csv`; a.click()
    }

    const downloadAllCSV = () => {
        const all = tables.map(t => `# Page ${t.page}\n` + t.rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')).join('\n\n')
        const blob = new Blob([all], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'pdf-tables.csv'; a.click()
    }

    const fmtSize = b => `${(b / 1024).toFixed(1)} KB`

    return (
        <>
            <SEO title="PDF to Excel/CSV Converter — Extract Tables from PDF Free" description="Extract tables from PDF and convert to CSV or Excel online. Free, no upload, browser-based PDF to spreadsheet converter. Works with structured PDFs." canonical="/pdf-to-excel" />
            <ToolLayout toolSlug="pdf-to-excel" title="PDF to Excel / CSV" description="Extract tables from PDF files and download as CSV. 100% in-browser, no upload required." breadcrumb="PDF to Excel">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf,application/pdf'; i.onchange = e => handleFile(e.target.files[0]); i.click() }}
                        className={`drop-zone cursor-pointer ${isDragging ? 'active' : ''} ${file ? 'border-red-400 bg-red-50' : ''}`}>
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <i className="fas fa-file-pdf text-4xl text-red-400"></i>
                                <p className="font-semibold text-red-700">{file.name}</p>
                                <p className="text-sm text-slate-500">{fmtSize(file.size)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-table text-red-400 text-2xl"></i>
                                </div>
                                <p className="font-semibold text-slate-700">Drop a PDF to extract its tables</p>
                                <p className="text-sm text-slate-400">Works best with structured, text-based PDFs</p>
                            </div>
                        )}
                    </div>
                </div>

                {file && !processing && !tables.length && (
                    <button onClick={extract} className="btn-primary flex items-center gap-2 mb-6">
                        <i className="fas fa-table"></i> Extract Tables
                    </button>
                )}

                {processing && (
                    <div className="bg-red-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-2xl text-red-500"></i>
                        <div><p className="font-semibold text-red-800">Extracting tables from PDF...</p>
                            <p className="text-sm text-red-600">Reading text and detecting table structure</p></div>
                    </div>
                )}

                {error && <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800"><i className="fas fa-info-circle mr-2"></i>{error}</div>}

                {tables.length > 0 && (
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="font-bold text-slate-800"><i className="fas fa-table text-red-500 mr-2"></i>{tables.length} Table{tables.length > 1 ? 's' : ''} Found</h2>
                            {tables.length > 1 && (
                                <button onClick={downloadAllCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                    <i className="fas fa-download"></i> Download All CSV
                                </button>
                            )}
                        </div>
                        {tables.map((table, ti) => (
                            <div key={ti} className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-700">Page {table.page} — {table.rows.length} rows × {Math.max(...table.rows.map(r => r.length))} columns</h3>
                                    <button onClick={() => downloadCSV(table)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-full hover:bg-red-100 transition-all">
                                        <i className="fas fa-download"></i> CSV
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                        <thead>
                                            <tr>{table.rows[0]?.map((c, i) => <th key={i} className="bg-red-50 px-3 py-2 text-left font-semibold text-red-800 border border-red-100">{c}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {table.rows.slice(1).map((row, ri) => (
                                                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                    {row.map((c, ci) => <td key={ci} className="px-3 py-2 border border-slate-100 text-slate-700">{c}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">PDF to Excel / CSV Converter</h2>
                    <p className="text-slate-600">Extract tables from PDF files and convert them to CSV format that can be opened in Excel, Google Sheets, or any spreadsheet application. Our tool uses pdfjs to read the PDF text and group it into rows and columns based on position, detecting table structure automatically.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Best Results</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Works best with <strong>text-based PDFs</strong> (not scanned images)</li>
                        <li>PDFs with clearly aligned columns and rows give the best output</li>
                        <li>Government reports, financial statements, and data exports work great</li>
                        <li>Scanned PDFs require OCR software for accurate extraction</li>
                    </ul>
                    <p className="text-slate-600 mt-4">Related tools: <a href="/merge-pdf" className="text-blue-600 hover:underline">Merge PDF</a> · <a href="/pdf-crop" className="text-blue-600 hover:underline">PDF Crop</a> · <a href="/html-to-pdf" className="text-blue-600 hover:underline">HTML to PDF</a></p>
                </div>
            </ToolLayout>
        </>
    )
}
