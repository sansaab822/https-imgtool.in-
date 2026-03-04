import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import SEO from '../components/SEO'

function csvToArray(csv) {
    const lines = csv.trim().split('\n')
    return lines.map(line => {
        const row = []; let cur = '', inQ = false
        for (let i = 0; i < line.length; i++) {
            const c = line[i]
            if (c === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++ } else inQ = !inQ }
            else if (c === ',' && !inQ) { row.push(cur.trim()); cur = '' }
            else cur += c
        }
        row.push(cur.trim()); return row
    })
}

function arrayToCSV(arr) {
    return arr.map(r => r.map(c => c.includes(',') || c.includes('"') || c.includes('\n') ? `"${String(c).replace(/"/g, '""')}"` : String(c)).join(',')).join('\n')
}

function arrayToJSON(arr, hasHeader) {
    if (!hasHeader || arr.length < 2) return JSON.stringify(arr, null, 2)
    const headers = arr[0]
    return JSON.stringify(arr.slice(1).map(row => {
        const obj = {}
        headers.forEach((h, i) => { obj[h || `col${i + 1}`] = row[i] || '' })
        return obj
    }), null, 2)
}

function jsonToArray(jsonStr) {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === 'object' && !Array.isArray(parsed[0])) {
            const keys = Object.keys(parsed[0])
            return [keys, ...parsed.map(obj => keys.map(k => String(obj[k] ?? '')))]
        }
        return parsed.map(row => Array.isArray(row) ? row.map(String) : [String(row)])
    }
    return [[]]
}

function arrayToTSV(arr) {
    return arr.map(r => r.map(c => String(c).replace(/\t/g, ' ')).join('\t')).join('\n')
}

function tsvToArray(tsv) {
    return tsv.trim().split('\n').map(line => line.split('\t').map(c => c.trim()))
}

function arrayToMarkdown(arr, hasHeader) {
    if (!arr.length) return ''
    const widths = arr[0].map((_, ci) => Math.max(...arr.map(r => (r[ci] || '').length), 3))
    const sep = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |'
    const lines = arr.map((r, ri) => '| ' + r.map((c, ci) => (c || '').padEnd(widths[ci])).join(' | ') + ' |')
    if (hasHeader && arr.length > 1) lines.splice(1, 0, sep)
    return lines.join('\n')
}

const IN_FORMATS = ['CSV', 'JSON', 'TSV', 'Markdown Table']
const OUT_FORMATS = ['CSV', 'JSON', 'TSV', 'Markdown Table']

export default function WorksheetConverter() {
    const [inputFormat, setInputFormat] = useState('CSV')
    const [outputFormat, setOutputFormat] = useState('JSON')
    const [inputText, setInputText] = useState(`Name,Age,City,Score\nAlice,28,Mumbai,95\nBob,34,Delhi,88\nPriya,22,Bangalore,91`)
    const [outputText, setOutputText] = useState('')
    const [hasHeader, setHasHeader] = useState(true)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileDrop = useCallback((e) => {
        e.preventDefault(); setIsDragging(false)
        const file = e.dataTransfer?.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setInputText(ev.target.result)
            if (file.name.endsWith('.csv')) setInputFormat('CSV')
            else if (file.name.endsWith('.json')) setInputFormat('JSON')
            else if (file.name.endsWith('.tsv')) setInputFormat('TSV')
        }
        reader.readAsText(file)
    }, [])

    const convert = () => {
        setError('')
        try {
            let arr
            if (inputFormat === 'CSV') arr = csvToArray(inputText)
            else if (inputFormat === 'JSON') arr = jsonToArray(inputText)
            else if (inputFormat === 'TSV') arr = tsvToArray(inputText)
            else if (inputFormat === 'Markdown Table') {
                arr = inputText.trim().split('\n')
                    .filter(l => !l.match(/^[\|\s\-:]+$/))
                    .map(l => l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim()))
            }
            let result
            if (outputFormat === 'CSV') result = arrayToCSV(arr)
            else if (outputFormat === 'JSON') result = arrayToJSON(arr, hasHeader)
            else if (outputFormat === 'TSV') result = arrayToTSV(arr)
            else if (outputFormat === 'Markdown Table') result = arrayToMarkdown(arr, hasHeader)
            setOutputText(result)
        } catch (err) {
            setError('Conversion failed: ' + err.message + '. Please check your input format.')
        }
    }

    const copy = () => { navigator.clipboard.writeText(outputText); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    const download = () => {
        const ext = { CSV: 'csv', JSON: 'json', TSV: 'tsv', 'Markdown Table': 'md' }[outputFormat]
        const mime = { CSV: 'text/csv', JSON: 'application/json', TSV: 'text/tab-separated-values', 'Markdown Table': 'text/markdown' }[outputFormat]
        const blob = new Blob([outputText], { type: mime })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `converted.${ext}`; a.click()
    }

    return (
        <>
            <SEO
                title="Worksheet Converter — Convert CSV, JSON, TSV, Markdown Free"
                description="Convert between CSV, JSON, TSV, and Markdown table formats instantly. Free online worksheet converter. Paste data or upload a file and convert in one click."
                canonical="/worksheet-converter"
            />
            <ToolLayout
                toolSlug="worksheet-converter"
                title="Worksheet Converter"
                description="Convert between CSV, JSON, TSV, and Markdown table formats instantly. No software needed."
                breadcrumb="Worksheet Converter"
            >
                {/* Format Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-bold text-slate-800 mb-4"><i className="fas fa-exchange-alt text-green-500 mr-2"></i>Select Formats</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">From (Input)</label>
                            <div className="flex flex-wrap gap-2">
                                {IN_FORMATS.map(f => (
                                    <button key={f} onClick={() => setInputFormat(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${inputFormat === f ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 text-slate-600 hover:border-green-300'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-2xl text-slate-300 pt-4"><i className="fas fa-arrow-right"></i></div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">To (Output)</label>
                            <div className="flex flex-wrap gap-2">
                                {OUT_FORMATS.map(f => (
                                    <button key={f} onClick={() => setOutputFormat(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${outputFormat === f ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 text-slate-600 hover:border-green-300'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="rounded text-green-600" />
                                First row is header
                            </label>
                        </div>
                    </div>
                </div>

                {/* Input / Output */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="font-bold text-slate-800"><i className="fas fa-file-import text-green-500 mr-2"></i>Input <span className="text-green-600">{inputFormat}</span></label>
                        </div>
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleFileDrop}
                            className={`border-2 border-dashed rounded-xl p-2 mb-3 transition-all ${isDragging ? 'border-green-400 bg-green-50' : 'border-slate-200'}`}>
                            <p className="text-xs text-center text-slate-400 py-1">Drop .csv, .json, or .tsv file here</p>
                        </div>
                        <textarea value={inputText} onChange={e => { setInputText(e.target.value); setError('') }}
                            rows={12} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono resize-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                            placeholder={`Paste your ${inputFormat} data here...`} />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="font-bold text-slate-800"><i className="fas fa-file-export text-green-500 mr-2"></i>Output <span className="text-green-600">{outputFormat}</span></label>
                            {outputText && (
                                <div className="flex gap-2">
                                    <button onClick={copy} className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg hover:bg-green-100 transition-all">
                                        <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-1`}></i>{copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button onClick={download} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-all">
                                        <i className="fas fa-download mr-1"></i>Download
                                    </button>
                                </div>
                            )}
                        </div>
                        <textarea value={outputText} readOnly rows={12}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono resize-none bg-slate-50 focus:border-slate-300 outline-none"
                            placeholder={`Converted ${outputFormat} will appear here...`} />
                        {error && <p className="text-xs text-red-500 mt-2"><i className="fas fa-exclamation-triangle mr-1"></i>{error}</p>}
                    </div>
                </div>

                <div className="flex gap-3 mb-6">
                    <button onClick={convert} className="btn-primary flex items-center gap-2">
                        <i className="fas fa-exchange-alt"></i> Convert {inputFormat} → {outputFormat}
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-4 prose max-w-none">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Worksheet Format Converter</h2>
                    <p className="text-slate-600">Convert data between CSV, JSON, TSV, and Markdown table formats instantly in your browser. No file upload needed — your data stays private. Perfect for developers, data analysts, and anyone working with spreadsheet data.</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Supported Conversions</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><strong>CSV to JSON</strong> — Convert spreadsheet exports to JSON API format</li>
                        <li><strong>JSON to CSV</strong> — Convert API data to spreadsheet-compatible CSV</li>
                        <li><strong>CSV to Markdown</strong> — Generate Markdown tables for GitHub README files</li>
                        <li><strong>Markdown to CSV</strong> — Extract data from Markdown table format</li>
                        <li><strong>CSV to TSV</strong> — Tab-separated format for some database imports</li>
                        <li><strong>JSON to TSV</strong> — Convert nested JSON to flat tabular format</li>
                    </ul>
                    <p className="text-slate-600 mt-4">You can also try our <a href="/html-table-generator" className="text-blue-600 hover:underline">HTML Table Generator</a> to visually create and style tables for websites.</p>
                </div>
            </ToolLayout>
        </>
    )
}
