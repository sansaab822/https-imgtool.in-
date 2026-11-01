import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'
import { blogPosts } from '../data/blogData'

// ── Color helpers ────────────────────────────────────────────────────────
const colorMap = {
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400', hover: 'group-hover:bg-indigo-600 group-hover:text-white', border: 'border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-500' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-400', hover: 'group-hover:bg-blue-600 group-hover:text-white', border: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-500' },
    green: { bg: 'bg-green-100 dark:bg-green-950/60', text: 'text-green-600 dark:text-green-400', hover: 'group-hover:bg-green-600 group-hover:text-white', border: 'border-green-200 dark:border-green-900/50 hover:border-green-500' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400', hover: 'group-hover:bg-emerald-600 group-hover:text-white', border: 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-600 dark:text-orange-400', hover: 'group-hover:bg-orange-600 group-hover:text-white', border: 'border-orange-200 dark:border-orange-900/50 hover:border-orange-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400', hover: 'group-hover:bg-purple-600 group-hover:text-white', border: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-500' },
    red: { bg: 'bg-red-100 dark:bg-red-950/60', text: 'text-red-600 dark:text-red-400', hover: 'group-hover:bg-red-600 group-hover:text-white', border: 'border-red-200 dark:border-red-900/50 hover:border-red-500' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-950/60', text: 'text-pink-600 dark:text-pink-400', hover: 'group-hover:bg-pink-600 group-hover:text-white', border: 'border-pink-200 dark:border-pink-900/50 hover:border-pink-500' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400', hover: 'group-hover:bg-cyan-600 group-hover:text-white', border: 'border-cyan-200 dark:border-cyan-900/50 hover:border-cyan-500' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-950/60', text: 'text-yellow-600 dark:text-yellow-400', hover: 'group-hover:bg-yellow-600 group-hover:text-white', border: 'border-yellow-200 dark:border-yellow-900/50 hover:border-yellow-500' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-950/60', text: 'text-teal-600 dark:text-teal-400', hover: 'group-hover:bg-teal-600 group-hover:text-white', border: 'border-teal-200 dark:border-teal-900/50 hover:border-teal-500' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', hover: 'group-hover:bg-slate-600 group-hover:text-white', border: 'border-slate-200 dark:border-slate-700 hover:border-slate-500' },
}

// ── Curated "most popular" tools ──────────────────────────────────────────
const POPULAR_SLUGS = [
    'image-compressor',
    'image-resizer',
    'bg-remover',
    'signature-to-transparent-png',
    'split-pdf',
    'passport-size-photo',
    'image-dpi-converter',
    'pan-card-photo',
]

// ── Curated document & ID tools for spotlight ─────────────────────────────
const DOCUMENT_SPOTLIGHT = [
    { name: 'Government & Exam Resizer', slug: 'government-photo-resizer', spec: 'SSC, IBPS, UPSC, NEET Presets', icon: 'fa-graduation-cap', color: 'indigo' },
    { name: 'Passport Size Photo Maker', slug: 'passport-size-photo', spec: 'Standard 2×2, 35×45mm, Printable A4', icon: 'fa-id-card', color: 'blue' },
    { name: 'Signature to Transparent PNG', slug: 'signature-to-transparent-png', spec: 'Auto-Crop, Transparent, 140×60px', icon: 'fa-file-signature', color: 'teal' },
    { name: 'Aadhaar Card A4 Print Setting', slug: 'aadhaar-card-print-setting-a4', spec: 'Exact ISO ID-1 Front/Back Alignment', icon: 'fa-print', color: 'blue' },
]

// ── Common Tasks ─────────────────────────────────────────────────────────
const TASKS = [
    { icon: 'fa-compress-arrows-alt', title: 'Target Exact KB Size', desc: 'Compress photos under 20KB, 50KB, or 100KB with binary search precision', link: '/image-compressor', color: 'orange' },
    { icon: 'fa-crop-alt', title: 'Crop & Resize Dimensions', desc: 'Crop by aspect ratio or resize to exact millimeter and pixel dimensions', link: '/image-resizer', color: 'blue' },
    { icon: 'fa-file-signature', title: 'Extract Clean Signature', desc: 'Turn phone photos of pen signatures into transparent PNGs for portals', link: '/signature-to-transparent-png', color: 'teal' },
    { icon: 'fa-scissors', title: 'Split & Extract PDF Pages', desc: 'Visual thumbnail picker to extract page ranges or delete unwanted pages', link: '/split-pdf', color: 'red' },
    { icon: 'fa-print', title: 'Lossless 300/600 DPI', desc: 'Patch JFIF and pHYs headers to 300 DPI without re-encoding quality loss', link: '/image-dpi-converter', color: 'indigo' },
    { icon: 'fa-eraser', title: 'Remove Photo Background', desc: 'Isolate subjects and export transparent graphics without cloud uploads', link: '/bg-remover', color: 'purple' },
]

// ── Schema markup ────────────────────────────────────────────────────────
const homeSchema = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://imgtool.in/#website',
        url: 'https://imgtool.in/',
        name: 'IMG Tool',
        description: 'Browser-based utilities to compress, resize, format, and edit images and PDFs without server uploads.',
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
            tools: tools.filter(t => t.category === cat.id && t.slug !== 'all-image-converters'),
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
            t.slug !== 'all-image-converters' && (
                t.name.toLowerCase().includes(q) ||
                (t.description || '').toLowerCase().includes(q)
            )
        )
    }, [search])

    const popularTools = useMemo(() =>
        POPULAR_SLUGS.map(s => tools.find(t => t.slug === s)).filter(Boolean)
        , [])

    return (
        <>
            <SEO
                title="Browser-Based Image & PDF Utilities | ImgTool"
                description="Fast, private, in-browser utilities to compress, resize, format ID photos, convert DPI, and split PDFs. Zero server uploads, 100% client-side privacy."
                keywords="compress image to kb, image resizer, passport photo maker, signature transparent png, split pdf, image dpi converter"
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
                    <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide">
                        <i className="fas fa-shield-alt text-emerald-400"></i>
                        100% Client-Side Privacy — Zero Server Uploads
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Fast, Private In-Browser<br className="hidden sm:block" /> Image & PDF Utilities
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Resize photos for official exam portals, compress images to exact KB limits, convert DPI losslessly, and manage PDFs entirely in your browser memory.
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
                            className="w-full pl-14 pr-16 py-5 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-2xl text-lg text-white placeholder-slate-500 transition-all"
                            placeholder="Search tools (e.g. compress to 50kb, signature png, split pdf, 300 dpi)..."
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                                <kbd className="font-mono">Ctrl</kbd>+<kbd className="font-mono">K</kbd>
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

            <main className="bg-slate-50 dark:bg-slate-950 transition-colors">
                {/* ── SEARCH RESULTS ──────────────────────────────────────── */}
                {filtered !== null && (
                    <section className="container mx-auto px-4 py-10 min-h-[50vh]">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
                                <div className="text-5xl mb-4 opacity-50">🔍</div>
                                <h3 className="text-slate-800 dark:text-slate-200 text-xl font-bold mb-2">No tools found for "{search}"</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try searching by file format or a broader task name.</p>
                                <button
                                    onClick={() => setSearch('')}
                                    className="mt-6 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h2 id="tasks-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                                    <i className="fas fa-bolt text-amber-500"></i> What Do You Need To Do?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">Select a workflow to start instant, private processing directly on your machine.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {TASKS.map(task => {
                                    const c = colorMap[task.color]
                                    return (
                                        <Link key={task.title} to={task.link} className={`flex items-start gap-5 p-6 rounded-2xl border ${c.border} bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
                                            <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${c.bg} ${c.text} ${c.hover} transition-colors duration-300`}>
                                                <i className={`fas ${task.icon} text-2xl`} aria-hidden="true"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-lg leading-tight mb-1.5">{task.title}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{task.desc}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>

                        {/* ── OFFICIAL ID & APPLICATION PREP SPOTLIGHT ────────── */}
                        <section className="container mx-auto px-4 py-8" aria-labelledby="workflow-heading">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                <div className="grid lg:grid-cols-5">
                                    <div className="p-8 lg:p-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold mb-6 w-max">
                                            <i className="fas fa-file-signature" aria-hidden="true"></i>
                                            Document & ID Formats
                                        </div>
                                        <h2 id="workflow-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                                            Exact Dimensions for Recruitment & Government Forms
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 text-base sm:text-lg leading-relaxed max-w-xl">
                                            Avoid rejection on application portals. Our specialized tools automatically enforce exact millimeter dimensions, white background requirements, and target file weights (such as 20KB–50KB).
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                            {DOCUMENT_SPOTLIGHT.map(t => (
                                                <Link key={t.slug} to={`/${t.slug}`} className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:shadow-sm transition-all group">
                                                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1 flex items-center gap-2">
                                                        <i className={`fas ${t.icon} text-sm text-indigo-500`}></i> {t.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-max">{t.spec}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div>
                                            <Link to="/government-photo-resizer" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                                                Explore unified exam portal presets <i className="fas fa-arrow-right text-sm"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-12 lg:col-span-2 bg-slate-900 text-white flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                                            <i className="fas fa-shield-alt text-emerald-400" aria-hidden="true"></i>
                                            Private By Architecture
                                        </h3>
                                        <p className="text-slate-300 text-base leading-relaxed mb-8 relative z-10">
                                            Your ID documents and sensitive photos never leave your device. All image transformations execute locally inside your browser's WebAssembly and HTML5 Canvas pipeline.
                                        </p>
                                        <ul className="space-y-4 text-slate-300 text-sm relative z-10">
                                            <li className="flex gap-3 items-start">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span>Zero server uploads — files stay in your browser RAM</span>
                                            </li>
                                            <li className="flex gap-3 items-start">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span>Instant processing with zero cloud queue delays</span>
                                            </li>
                                            <li className="flex gap-3 items-start">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <span>Safe for PAN cards, Aadhaar, passports, and signatures</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── FREQUENTLY USED TOOLS ────────────────────────── */}
                        <section className="container mx-auto px-4 py-16" aria-labelledby="popular-heading">
                            <div className="flex items-center justify-between mb-8">
                                <h2 id="popular-heading" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <i className="fas fa-star text-amber-500"></i> Featured Tools
                                </h2>
                                <Link to="/all-image-converters" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    View all 30+ tools →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {popularTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        </section>

                        {/* ── TECHNICAL GUIDES & ARTICLES ───────────────────── */}
                        <section className="container mx-auto px-4 py-12" aria-labelledby="guides-heading">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 id="guides-heading" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <i className="fas fa-book-open text-blue-500"></i> Expert Guides & Technical Benchmarks
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Deep dives into compression algorithms, DPI vs PPI standards, and portal specifications.</p>
                                </div>
                                <Link to="/blog" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    Read all articles →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogPosts.slice(0, 3).map(post => (
                                    <Link key={post.slug} to={`/blog/${post.slug}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                                            <span>{post.category}</span>
                                            <span>•</span>
                                            <span className="text-slate-400">{post.readTime}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mt-auto">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                            <span>{post.date}</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">Read guide →</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* ── COMPLETE DIRECTORY ACCORDION ─────────────────── */}
                        <section className="container mx-auto px-4 py-16" aria-labelledby="all-tools-heading">
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-10">
                                    <h2 id="all-tools-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                        Curated Tool Directory
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">Browse our collection of 30+ browser utilities organized by discipline.</p>
                                </div>

                                <div className="space-y-3">
                                    {accordionData.map((cat, idx) => (
                                        <details key={cat.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden" open={idx === 0}>
                                            <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors list-none">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl bg-${cat.color}-100 dark:bg-${cat.color}-950/60 text-${cat.color}-600 dark:text-${cat.color}-400 flex items-center justify-center`}>
                                                        <i className={`fas ${cat.icon || 'fa-tools'} text-lg`} aria-hidden="true"></i>
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{cat.tools.length} tools</span>
                                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                                        <i className="fas fa-chevron-down text-sm" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </summary>
                                            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-6 bg-slate-50 dark:bg-slate-950/40">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                                                    {cat.tools.map(tool => (
                                                        <li key={tool.slug}>
                                                            <Link to={`/${tool.slug}`} className="flex items-center gap-2 py-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group/link">
                                                                <i className="fas fa-angle-right text-slate-300 dark:text-slate-600 group-hover/link:text-indigo-400 group-hover/link:translate-x-1 transition-transform text-sm"></i>
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
        <Link to={`/${tool.slug}`} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${c.border} flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
            <div className="flex items-center mb-4 gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-xl flex-shrink-0 transition-colors duration-300 ${c.hover}`} aria-hidden="true">
                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight text-lg">{tool.name}</h3>
            </div>
            {tool.description && (
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-auto">{tool.description}</p>
            )}
        </Link>
    )
}
