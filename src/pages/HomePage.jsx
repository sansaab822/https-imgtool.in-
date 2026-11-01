import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'
import { blogPosts } from '../data/blogData'

// ── Color mappings for categories & tools ──────────────────────────────────────
const colorMap = {
    indigo: { bg: 'bg-indigo-50 text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', border: 'hover:border-indigo-500' },
    blue: { bg: 'bg-blue-50 text-blue-600', badge: 'bg-blue-100 text-blue-700', border: 'hover:border-blue-500' },
    green: { bg: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', border: 'hover:border-emerald-500' },
    orange: { bg: 'bg-orange-50 text-orange-600', badge: 'bg-orange-100 text-orange-700', border: 'hover:border-orange-500' },
    purple: { bg: 'bg-purple-50 text-purple-600', badge: 'bg-purple-100 text-purple-700', border: 'hover:border-purple-500' },
    red: { bg: 'bg-rose-50 text-rose-600', badge: 'bg-rose-100 text-rose-700', border: 'hover:border-rose-500' },
    pink: { bg: 'bg-pink-50 text-pink-600', badge: 'bg-pink-100 text-pink-700', border: 'hover:border-pink-500' },
    cyan: { bg: 'bg-cyan-50 text-cyan-600', badge: 'bg-cyan-100 text-cyan-700', border: 'hover:border-cyan-500' },
    yellow: { bg: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700', border: 'hover:border-amber-500' },
    teal: { bg: 'bg-teal-50 text-teal-600', badge: 'bg-teal-100 text-teal-700', border: 'hover:border-teal-500' },
    slate: { bg: 'bg-slate-100 text-slate-600', badge: 'bg-slate-200 text-slate-700', border: 'hover:border-slate-500' },
}

// ── Quick Flagship Workflows ──────────────────────────────────────────────────
const QUICK_WORKFLOWS = [
    { icon: 'fa-compress-arrows-alt', title: 'Compress to Target KB', desc: 'Shrink photos to exact limits (20KB, 50KB, 100KB) with zero server upload', link: '/image-compressor', color: 'orange' },
    { icon: 'fa-file-signature', title: 'Signature to Clean PNG', desc: 'Erase paper shadows, extract ink strokes, and convert to transparent PNG', link: '/signature-to-transparent-png', color: 'teal' },
    { icon: 'fa-id-card', title: 'Passport Photo Maker', desc: 'Format official 35×45mm or 2×2" biometric photos onto printable A4 sheets', link: '/passport-size-photo', color: 'blue' },
    { icon: 'fa-scissors', title: 'Split & Delete PDF Pages', desc: 'Visually select and extract pages or delete unwanted leaves in browser memory', link: '/split-pdf', color: 'red' },
    { icon: 'fa-print', title: '300 DPI Print Converter', desc: 'Losslessly convert images to 300 DPI for journal and official submissions', link: '/image-dpi-converter', color: 'indigo' },
    { icon: 'fa-crop', title: 'Crop & Aspect Ratio', desc: 'Crop photos with standard aspect ratios (1:1, 4:5, 16:9) and Rule of Thirds', link: '/crop-image', color: 'pink' },
]

// ── Protected Document Tools Spotlight ────────────────────────────────────────
const PROTECTED_TOOLS = [
    { name: 'Passport Photo Maker', slug: 'passport-size-photo', icon: 'fa-id-card', spec: '35×45mm, 2×2", A4 Print Sheet', desc: 'Create print-ready biometric passport photos with cutting guidelines' },
    { name: 'PAN Card Photo & Signature', slug: 'pan-card-photo', icon: 'fa-id-badge', spec: '25×35mm (213×213px)', desc: 'Official NSDL & UTI dimension and KB size matching' },
    { name: 'Aadhaar Card A4 Print Layout', slug: 'aadhaar-card-print-setting-a4', icon: 'fa-print', spec: '85.6×54mm (ISO ID-1)', desc: 'Format front and back cards to true physical wallet dimensions' },
    { name: 'PDF Margin Crop', slug: 'pdf-crop', icon: 'fa-crop', spec: 'Custom Point Margins', desc: 'Remove scanner black borders and standardize multi-page reading margins' },
]

export default function HomePage() {
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('all')

    const filteredTools = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) {
            if (activeTab === 'all') return tools
            return tools.filter((t) => t.category === activeTab)
        }
        return tools.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.slug.toLowerCase().includes(q)
        )
    }, [search, activeTab])

    const homeSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'IMG Tool',
        url: 'https://imgtool.in/',
        description: 'Free, private client-side utilities to compress, resize, format, crop, and edit images and PDF documents in your browser.',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://imgtool.in/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <>
            <SEO
                title="IMG Tool — Private Client-Side Image & PDF Utilities"
                description="Fast, 100% private in-browser utilities to compress, resize, crop, and convert photos and PDFs. Zero server uploads, no signups, and no artificial paywalls."
                canonical="/"
                schema={homeSchema}
            />

            {/* ── HERO SECTION ────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800 pt-16 pb-20 md:pt-24 md:pb-28">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 opacity-90" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide mb-6">
                        <i className="fas fa-shield-halved text-emerald-400"></i>
                        <span>100% Client-Side Privacy — Files Never Leave Your Device</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Precision Photo &amp; PDF Tools<br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                            Without Cloud Uploads
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
                        A focused suite of verified web utilities for document applications, print preparation, and web publishing. Executed entirely inside your browser's private memory.
                    </p>

                    {/* Interactive Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <i className="fas fa-magnifying-glass text-base"></i>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700 bg-slate-800/90 backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none shadow-2xl text-base text-white placeholder-slate-400 transition-all"
                            placeholder="Search verified tools (e.g. passport, split pdf, 300 dpi, signature)..."
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                            >
                                <i className="fas fa-circle-xmark"></i>
                            </button>
                        )}
                    </div>

                    {/* Key Trust Signals */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><i className="fas fa-check text-emerald-400"></i> Zero Server File Storage</span>
                        <span className="flex items-center gap-1.5"><i className="fas fa-check text-emerald-400"></i> No Signups or Hidden Paywalls</span>
                        <span className="flex items-center gap-1.5"><i className="fas fa-check text-emerald-400"></i> 100% Free Forever</span>
                    </div>
                </div>
            </section>

            <main className="bg-slate-50 py-12">

                {/* ── QUICK WORKFLOWS ─────────────────────────────────────────── */}
                {!search && (
                    <section className="container mx-auto px-4 mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <i className="fas fa-bolt text-amber-500"></i> Popular Tasks
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Frequently used tools for fast daily image &amp; PDF operations</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {QUICK_WORKFLOWS.map((q) => {
                                const c = colorMap[q.color] || colorMap.blue
                                return (
                                    <Link
                                        key={q.slug || q.title}
                                        to={q.link}
                                        className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all duration-200 group flex items-start gap-4"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${c.bg}`}>
                                            <i className={`fas ${q.icon}`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                                                {q.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {q.desc}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* ── PROTECTED DOCUMENT TOOLS SPOTLIGHT ───────────────────────── */}
                {!search && (
                    <section className="container mx-auto px-4 mb-16">
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                            <div className="max-w-3xl relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-xs font-bold mb-4">
                                    <i className="fas fa-id-card"></i> Official Document Standards
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
                                    Verified Dimensions for Identity Cards &amp; Passports
                                </h2>
                                <p className="text-sm text-slate-300 mb-8 leading-relaxed max-w-2xl">
                                    Avoid application rejections. These specialized utilities format photographs and physical cards to exact biometric specifications (ISO/IEC 7810 ID-1, NSDL/UTI, and Schengen/US standards).
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {PROTECTED_TOOLS.map((t) => (
                                        <Link
                                            key={t.slug}
                                            to={`/${t.slug}`}
                                            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all group flex items-start gap-3.5"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0 text-base group-hover:scale-105 transition-transform">
                                                <i className={`fas ${t.icon}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-bold text-white text-xs group-hover:text-teal-300 transition-colors truncate">
                                                        {t.name}
                                                    </h4>
                                                    <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
                                                        {t.spec}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-300 mt-1 leading-snug">{t.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── ALL CURATED TOOLS BY CATEGORY ────────────────────────────── */}
                <section className="container mx-auto px-4 mb-16">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                <i className="fas fa-layer-group text-blue-600"></i> Verified Tools Directory
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Showing {filteredTools.length} {search ? `results for "${search}"` : 'carefully maintained tools'}
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        {!search && (
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                        activeTab === 'all'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    All Tools ({tools.length})
                                </button>
                                {categories.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setActiveTab(c.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            activeTab === c.id
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredTools.map((t) => {
                            const c = colorMap[t.color] || colorMap.blue
                            return (
                                <Link
                                    key={t.slug}
                                    to={`/${t.slug}`}
                                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${c.bg} group-hover:scale-105 transition-transform`}>
                                                <i className={`fas ${t.icon}`}></i>
                                            </div>
                                            {t.featured && (
                                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors mb-1">
                                            {t.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                            {t.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-600 font-semibold transition-colors">
                                        <span>Open Tool</span>
                                        <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* ── RECENT EDITORIAL ARTICLES ────────────────────────────────── */}
                {!search && (
                    <section className="container mx-auto px-4 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <i className="fas fa-book-open text-indigo-600"></i> Technical Guides &amp; Research
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Authoritative benchmarks and step-by-step guides by our engineering team</p>
                            </div>
                            <Link to="/blog" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View All Articles <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {blogPosts.slice(0, 3).map((post) => (
                                <Link
                                    key={post.slug}
                                    to={`/blog/${post.slug}`}
                                    className="rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
                                >
                                    <div className="p-6">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                                            {post.date} • By {post.author}
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs font-bold text-blue-600 flex items-center justify-between">
                                        <span>Read Complete Guide</span>
                                        <i className="fas fa-chevron-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </>
    )
}
