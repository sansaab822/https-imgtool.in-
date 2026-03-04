import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

const SAMPLE_DATA = [
    ['Name', 'Age', 'City', 'Score'],
    ['Alice', '28', 'Mumbai', '95'],
    ['Bob', '34', 'Delhi', '88'],
    ['Priya', '22', 'Bangalore', '91'],
    ['Raj', '45', 'Chennai', '76'],
]

function dataToHtml(rows, hasHeader, borderStyle, theme) {
    const themes = {
        default: { table: 'border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;', th: 'background: #2563eb; color: white; padding: 10px 14px; text-align: left; border: 1px solid #1d4ed8;', td: 'padding: 10px 14px; border: 1px solid #e2e8f0;', tr_even: 'background: #f8fafc;' },
        dark: { table: 'border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; background: #1e293b;', th: 'background: #334155; color: #f1f5f9; padding: 10px 14px; text-align: left; border: 1px solid #475569;', td: 'padding: 10px 14px; border: 1px solid #334155; color: #e2e8f0;', tr_even: 'background: #1a2535;' },
        minimal: { table: 'border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;', th: 'border-bottom: 2px solid #1e293b; padding: 10px 14px; text-align: left; font-weight: bold;', td: 'border-bottom: 1px solid #e2e8f0; padding: 10px 14px;', tr_even: '' },
    }
    const t = themes[theme] || themes.default
    let html = `<table style="${t.table}">\n`
    rows.forEach((row, ri) => {
        if (ri === 0 && hasHeader) {
            html += `  <thead>\n  <tr>\n${row.map(c => `    <th style="${t.th}">${c}</th>`).join('\n')}\n  </tr>\n  </thead>\n  <tbody>\n`
        } else {
            const rowStyle = ri % 2 === 0 ? t.tr_even : ''
            html += `  <tr${rowStyle ? ` style="${rowStyle}"` : ''}>\n${row.map(c => `    <td style="${t.td}">${c}</td>`).join('\n')}\n  </tr>\n`
            if (ri === rows.length - 1) html += '  </tbody>\n'
        }
    })
    html += '</table>'
    return html
}

function dataToMarkdown(rows, hasHeader) {
    const widths = rows[0].map((_, ci) => Math.max(...rows.map(r => (r[ci] || '').length)))
    const pad = (s, w) => (s || '').padEnd(w)
    const headerRow = rows[0]
    const lines = []
    if (hasHeader) {
        lines.push('| ' + headerRow.map((c, i) => pad(c, widths[i])).join(' | ') + ' |')
        lines.push('| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |')
        rows.slice(1).forEach(r => lines.push('| ' + r.map((c, i) => pad(c, widths[i])).join(' | ') + ' |'))
    } else {
        rows.forEach(r => lines.push('| ' + r.map((c, i) => pad(c, widths[i])).join(' | ') + ' |'))
    }
    return lines.join('\n')
}

function dataToCSV(rows) {
    return rows.map(r => r.map(c => c.includes(',') || c.includes('"') ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n')
}

export default function HtmlTableGenerator() {
    const [rows, setRows] = useState(SAMPLE_DATA)
    const [hasHeader, setHasHeader] = useState(true)
    const [outputFormat, setOutputFormat] = useState('html')
    const [theme, setTheme] = useState('default')
    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)
    const [csvInput, setCsvInput] = useState('')

    const updateCell = (ri, ci, val) => {
        setRows(prev => prev.map((r, i) => i === ri ? r.map((c, j) => j === ci ? val : c) : r))
    }

    const addRow = () => setRows(prev => [...prev, Array(prev[0].length).fill('')])
    const addCol = () => setRows(prev => prev.map(r => [...r, '']))
    const removeRow = (ri) => rows.length > 1 && setRows(prev => prev.filter((_, i) => i !== ri))
    const removeCol = (ci) => rows[0].length > 1 && setRows(prev => prev.map(r => r.filter((_, j) => j !== ci)))

    const generate = () => {
        let result = ''
        if (outputFormat === 'html') result = dataToHtml(rows, hasHeader, 'solid', theme)
        else if (outputFormat === 'markdown') result = dataToMarkdown(rows, hasHeader)
        else if (outputFormat === 'csv') result = dataToCSV(rows)
        setOutput(result)
    }

    const parseCSV = () => {
        const parsed = csvInput.split('\n').filter(Boolean).map(line =>
            line.split(',').map(c => c.replace(/^"|"$/g, '').trim())
        )
        if (parsed.length > 0 && parsed[0].length > 0) setRows(parsed)
    }

    const copy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    const downloadHtml = () => {
        const fullHtml = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>Table</title></head>\n<body>\n${output}\n</body>\n</html>`
        const blob = new Blob([fullHtml], { type: 'text/html' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'table.html'; a.click()
    }

    return (
        <>
            <SEO
                title="HTML Table Generator — Create HTML & Markdown Tables Free"
                description="Generate HTML or Markdown tables from your data online. Enter data in a spreadsheet-like editor, choose a theme, and export as HTML, Markdown, or CSV. Free tool."
                canonical="/html-table-generator"
            />
            <ToolLayout
                toolSlug="html-table-generator"
                title="HTML Table Generator"
                description="Create beautiful HTML, Markdown, and CSV tables from your data with live preview. No coding needed."
                breadcrumb="HTML Table Generator"
            >
                {/* CSV Import */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-3"><i className="fas fa-file-import text-teal-500 mr-2"></i>Import from CSV (optional)</h2>
                    <div className="flex gap-3">
                        <textarea value={csvInput} onChange={e => setCsvInput(e.target.value)} rows={3} placeholder="name,age,city&#10;Alice,28,Mumbai&#10;Bob,34,Delhi"
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none" />
                        <button onClick={parseCSV} className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-all self-start">
                            Import
                        </button>
                    </div>
                </div>

                {/* Data Editor */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 overflow-x-auto">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <h2 className="font-bold text-slate-800"><i className="fas fa-border-all text-teal-500 mr-2"></i>Data Editor</h2>
                        <div className="flex gap-2">
                            <button onClick={addRow} className="px-3 py-1.5 bg-teal-50 text-teal-600 text-xs font-bold rounded-lg hover:bg-teal-100 transition-all">
                                <i className="fas fa-plus mr-1"></i>Row
                            </button>
                            <button onClick={addCol} className="px-3 py-1.5 bg-teal-50 text-teal-600 text-xs font-bold rounded-lg hover:bg-teal-100 transition-all">
                                <i className="fas fa-plus mr-1"></i>Column
                            </button>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="rounded text-teal-600" />
                                First row is header
                            </label>
                        </div>
                    </div>

                    <table className="min-w-full">
                        <tbody>
                            {rows.map((row, ri) => (
                                <tr key={ri} className={ri === 0 && hasHeader ? 'bg-teal-50' : ''}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} className="p-1">
                                            <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)}
                                                className={`w-full min-w-24 px-2 py-1.5 text-sm border rounded-lg outline-none focus:border-teal-400 transition-all
                        ${ri === 0 && hasHeader ? 'font-bold bg-teal-50 border-teal-200' : 'bg-white border-slate-200'}`} />
                                        </td>
                                    ))}
                                    <td className="p-1 w-8">
                                        <button onClick={() => removeRow(ri)} className="w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-all text-xs flex items-center justify-center">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                {rows[0].map((_, ci) => (
                                    <td key={ci} className="p-1 text-center">
                                        <button onClick={() => removeCol(ci)} className="w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-all text-xs">×</button>
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Options */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-sliders-h text-teal-500 mr-2"></i>Output Options</h2>
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Format</label>
                            <div className="flex gap-2">
                                {['html', 'markdown', 'csv'].map(f => (
                                    <button key={f} onClick={() => setOutputFormat(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all uppercase
                    ${outputFormat === f ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {outputFormat === 'html' && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Theme</label>
                                <div className="flex gap-2">
                                    {['default', 'dark', 'minimal'].map(t => (
                                        <button key={t} onClick={() => setTheme(t)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium border capitalize transition-all
                      ${theme === t ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Generate */}
                <div className="flex gap-3 mb-6">
                    <button onClick={generate} className="btn-primary flex items-center gap-2">
                        <i className="fas fa-code"></i> Generate Table
                    </button>
                    {output && (
                        <>
                            <button onClick={copy}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all">
                                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i> {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                            {outputFormat === 'html' && (
                                <button onClick={downloadHtml}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all">
                                    <i className="fas fa-download"></i> Download HTML
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Output */}
                {output && (
                    <div className="space-y-4 mb-6">
                        {outputFormat === 'html' && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-eye text-teal-500 mr-2"></i>Preview</h2>
                                <div dangerouslySetInnerHTML={{ __html: output }} className="overflow-x-auto" />
                            </div>
                        )}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="font-bold text-slate-800 mb-3"><i className="fas fa-code text-teal-500 mr-2"></i>Generated Code</h2>
                            <pre className="bg-slate-50 rounded-xl p-4 text-xs overflow-x-auto text-slate-700 whitespace-pre-wrap">{output}</pre>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">HTML Table Generator</h2>
                    <p className="text-slate-600">Create professional HTML tables, Markdown tables, and CSV files instantly without writing any code. Our visual table editor lets you add rows and columns, import CSV data, and export in multiple formats ready to use in websites, documentation, or spreadsheets.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Use Cases</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li>Generate HTML tables for websites and email templates</li>
                        <li>Create Markdown tables for GitHub README files and documentation</li>
                        <li>Convert data to CSV for spreadsheet import</li>
                        <li>Build pricing comparison tables</li>
                        <li>Create data tables for blog posts and reports</li>
                    </ul>
                    <p className="text-slate-600 mt-4">You can also use our <a href="/worksheet-converter" className="text-blue-600 hover:underline">Worksheet Converter</a> to convert between CSV, JSON, and Excel formats.</p>
                </div>
            </ToolLayout>
        </>
    )
}
