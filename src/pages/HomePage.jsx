import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

// ── Color helpers ────────────────────────────────────────────────────────
const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-600 group-hover:text-white', border: 'border-indigo-200 hover:border-indigo-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-600 group-hover:text-white', border: 'border-blue-200 hover:border-blue-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'group-hover:bg-green-600 group-hover:text-white', border: 'border-green-200 hover:border-green-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-600 group-hover:text-white', border: 'border-orange-200 hover:border-orange-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-600 group-hover:text-white', border: 'border-purple-200 hover:border-purple-500' },
    red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'group-hover:bg-red-600 group-hover:text-white', border: 'border-red-200 hover:border-red-500' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'group-hover:bg-pink-600 group-hover:text-white', border: 'border-pink-200 hover:border-pink-500' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-600 group-hover:text-white', border: 'border-cyan-200 hover:border-cyan-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'group-hover:bg-yellow-600 group-hover:text-white', border: 'border-yellow-200 hover:border-yellow-500' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'group-hover:bg-teal-600 group-hover:text-white', border: 'border-teal-200 hover:border-teal-500' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600', hover: 'group-hover:bg-violet-600 group-hover:text-white', border: 'border-violet-200 hover:border-violet-500' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', hover: 'group-hover:bg-slate-600 group-hover:text-white', border: 'border-slate-200 hover:border-slate-500' },
}

// ── Curated "most popular" tools ──────────────────────────────────────────
const POPULAR_SLUGS = [
    'image-compressor',
    'compress-image-to-30kb',
    'image-resizer',
    'passport-size-photo',
    'bg-remover',
    'jpg-to-pdf',
    'heic-to-jpg',
]

// ── Curated exam tools for spotlight ──────────────────────────────────────
const EXAM_TOOLS = [
    { name: 'SSC CGL Photo', slug: 'ssc-cgl-photo-resizer', spec: '275×354px, 20–50KB' },
    { name: 'IBPS PO Photo', slug: 'ibps-po-photo-resizer', spec: '200×230px, 20–50KB' },
    { name: 'NEET Photo', slug: 'neet-photo-resizer', spec: '413×531px, 10–200KB' },
    { name: 'UPSC Photo', slug: 'upsc-photo-resizer', spec: '300×400px, 20–100KB' },
]

// ── Common Tasks ─────────────────────────────────────────────────────────
const TASKS = [
    { icon: 'fa-compress-arrows-alt', title: 'Reduce File Size', desc: 'Shrink image weight for uploads', link: '/image-compressor', color: 'blue' },
    { icon: 'fa-crop-alt', title: 'Crop & Resize', desc: 'Change dimensions or ratio', link: '/image-resizer', color: 'indigo' },
    { icon: 'fa-id-badge', title: 'Make ID Photo', desc: 'Passport & Visa dimensions', link: '/passport-size-photo', color: 'purple' },
    { icon: 'fa-exchange-alt', title: 'Convert Format', desc: 'HEIC to JPG, WebP to PNG', link: '/heic-to-jpg', color: 'orange' },
    { icon: 'fa-file-pdf', title: 'Create PDF', desc: 'Combine images into a document', link: '/jpg-to-pdf', color: 'red' },
    { icon: 'fa-eraser', title: 'Remove Background', desc: 'Make background transparent', link: '/bg-remover', color: 'pink' },
]

// ── Schema markup ────────────────────────────────────────────────────────
const homeSchema = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://imgtool.in/#website',
        url: 'https://imgtool.in/',
        name: 'IMG Tool',
        description: 'Browser-based utilities to compress, resize, format, and edit images without server uploads.',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://imgtool.in/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://imgtool.in/#organization',
        name: 'IMG Tool',
        url: 'https://imgtool.in/',
        logo: { '@type': 'ImageObject', url: 'https://imgtool.in/logo.png' },
    }
]

function useAccordionData() {
    return useMemo(() => {
        return categories.map(cat => ({
            ...cat,
            tools: tools.filter(t => t.category === cat.id),
        })).filter(c => c.tools.length > 0)
    }, [])
}

export default function HomePage() {
    const [search, setSearch] = useState('')
    const accordionData = useAccordionData()

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) return null
        return tools.filter(t =>
            t.name.toLowerCase().includes(q) ||
            (t.description || '').toLowerCase().includes(q)
        )
    }, [search])

    const popularTools = useMemo(() =>
        POPULAR_SLUGS.map(s => tools.find(t => t.slug === s)).filter(Boolean)
        , [])

    return (
        <>
            <SEO
                title="Browser-Based Image Utilities | ImgTool"
                description="Process, resize, and compress images directly in your browser. Fast, private utilities for preparing web graphics, document uploads, and application forms."
                keywords="compress image, image resizer, passport photo maker, browser image tools"
                canonical="/"
                schema={homeSchema}
            />

            {/* ── HERO / TASK SEARCH ──────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800 pt-20 pb-24 md:pt-28 md:pb-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-purple-900/40" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                </div>
                
                <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
                    <div className="inline-block mb-4 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide">
                        Private, browser-based utilities
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        What do you need to do<br className="hidden sm:block" /> with your image?
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light">
                        Over 100 specific tools to prepare photos for forms, web uploads, and documents—without uploading your files to a server.
                    </p>

                    <div className="relative max-w-2xl mx-auto transform transition-all focus-within:scale-[1.02]">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <i className="fas fa-search text-indigo-400 text-lg" aria-hidden="true"></i>
                        </div>
                        <label htmlFor="hero-search" className="sr-only">Search tasks or tools</label>
                        <input
                            id="hero-search"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-14 pr-4 py-5 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-2xl text-lg text-white placeholder-slate-500 transition-all"
                            placeholder="e.g., compress to 50kb, resize photo, pdf to jpg..."
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                           <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                             <kbd>⌘</kbd> <kbd>K</kbd>
                           </div>
                        </div>
                    </div>
                    {search && (
                        <p className="text-sm text-indigo-300 mt-4 animate-fadeIn">
                            {filtered?.length ?? 0} result{filtered?.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>
            </section>

            <main className="bg-slate-50">
                {/* ── SEARCH RESULTS ──────────────────────────────────────── */}
                {filtered !== null && (
                    <section className="container mx-auto px-4 py-10 min-h-[50vh]">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                                <div className="text-5xl mb-4 opacity-50">🔍</div>
                                <h3 className="text-slate-800 text-xl font-bold mb-2">No tools found for "{search}"</h3>
                                <p className="text-slate-500">Try searching by file format or a broader task name.</p>
                                <button 
                                    onClick={() => setSearch('')}
                                    className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 rounded-full font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        )}
                    </section>
                )}

                {/* ── NORMAL HOMEPAGE ───────────── */}
                {filtered === null && (
                    <div className="pb-20">
                        {/* ── COMMON TASKS ─────────────────────────────────── */}
                        <section className="container mx-auto px-4 py-16" aria-labelledby="tasks-heading">
                            <h2 id="tasks-heading" className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <i className="fas fa-bolt text-amber-500"></i> Quick Tasks
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {TASKS.map(task => {
                                    const c = colorMap[task.color]
                                    return (
                                        <Link key={task.title} to={task.link} className={`flex items-center gap-5 p-5 rounded-2xl border ${c.border} bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                                            <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${c.bg} ${c.text} ${c.hover} transition-colors duration-300`}>
                                                <i className={`fas ${task.icon} text-2xl`} aria-hidden="true"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg leading-tight mb-1">{task.title}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-2">{task.desc}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>

                        {/* ── SPECIFIC WORKFLOWS ────────── */}
                        <section className="container mx-auto px-4 py-8" aria-labelledby="workflow-heading">
                            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                <div className="grid lg:grid-cols-5">
                                    <div className="p-8 lg:p-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-6 w-max">
                                            <i className="fas fa-file-signature" aria-hidden="true"></i>
                                            Document Preparation
                                        </div>
                                        <h2 id="workflow-heading" className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                            Exact dimensions for official forms
                                        </h2>
                                        <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-xl">
                                            Avoid application rejections. Our document tools automatically resize and compress photos to meet strict government and exam portal specifications.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                            {EXAM_TOOLS.map(t => (
                                                <Link key={t.slug} to={`/${t.slug}`} className="flex flex-col p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm transition-all group">
                                                    <span className="font-bold text-slate-900 group-hover:text-indigo-700 mb-1">{t.name}</span>
                                                    <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded w-max">{t.spec}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div>
                                            <Link to="/all-image-converters" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                                Browse all document tools <i className="fas fa-arrow-right text-sm"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-12 lg:col-span-2 bg-slate-900 text-white flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                        
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                                            <i className="fas fa-lock text-indigo-400" aria-hidden="true"></i>
                                            Private by Design
                                        </h3>
                                        <p className="text-slate-300 text-lg leading-relaxed mb-8 relative z-10">
                                            Your files not leave your device. Processing happens directly in your browser.
                                        </p>
                                        <ul className="space-y-5 text-slate-300 relative z-10">
                                            <li className="flex gap-4 items-start">
                                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                                                    <i className="fas fa-check text-xs"></i>
                                                </div>
                                                <span>Zero server uploads or cloud storage</span>
                                            </li>
                                            <li className="flex gap-4 items-start">
                                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                                                    <i className="fas fa-check text-xs"></i>
                                                </div>
                                                <span>Works offline after the page loads</span>
                                            </li>
                                            <li className="flex gap-4 items-start">
                                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                                                    <i className="fas fa-check text-xs"></i>
                                                </div>
                                                <span>Safe for sensitive ID documents</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── FREQUENTLY USED TOOLS ────────────────────────── */}
                        <section className="container mx-auto px-4 py-16" aria-labelledby="popular-heading">
                            <div className="flex items-center justify-between mb-8">
                                <h2 id="popular-heading" className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <i className="fas fa-star text-indigo-500"></i> Popular Utilities
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {popularTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        </section>

                        {/* ── COMPLETE DIRECTORY ACCORDION ─────────────────── */}
                        <section className="container mx-auto px-4 py-16" aria-labelledby="all-tools-heading">
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-10">
                                    <h2 id="all-tools-heading" className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                        Complete Tool Directory
                                    </h2>
                                    <p className="text-slate-600 text-lg">Browse {tools.length} specific utilities categorized by function.</p>
                                </div>

                                <div className="space-y-3">
                                    {accordionData.map((cat, idx) => (
                                        <details key={cat.id} className="group bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" open={idx === 0}>
                                            <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none hover:bg-slate-50 transition-colors list-none">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl bg-${cat.color}-100 text-${cat.color}-600 flex items-center justify-center`}>
                                                        <i className={`fas ${cat.icon || 'fa-tools'} text-lg`} aria-hidden="true"></i>
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-lg">{cat.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{cat.tools.length} items</span>
                                                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                                        <i className="fas fa-chevron-down text-sm" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </summary>
                                            <div className="border-t border-slate-100 px-6 py-6 bg-slate-50">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                                                    {cat.tools.map(tool => (
                                                        <li key={tool.slug}>
                                                            <Link to={`/${tool.slug}`} className="flex items-center gap-2 py-1 text-slate-600 hover:text-indigo-600 transition-colors group/link">
                                                                <i className="fas fa-angle-right text-slate-300 group-hover/link:text-indigo-400 group-hover/link:translate-x-1 transition-transform text-sm"></i>
                                                                <span className="font-medium text-sm">{tool.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </>
    )
}

function ToolCard({ tool }) {
    const c = colorMap[tool.color] || colorMap.blue
    return (
        <Link to={`/${tool.slug}`} className={`bg-white p-6 rounded-2xl border ${c.border} flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
            <div className="flex items-center mb-4 gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-xl flex-shrink-0 transition-colors duration-300 ${c.hover}`} aria-hidden="true">
                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight text-lg">{tool.name}</h3>
            </div>
            {tool.description && (
                <p className="text-slate-500 text-sm leading-relaxed mt-auto">{tool.description}</p>
            )}
        </Link>
    )
}
