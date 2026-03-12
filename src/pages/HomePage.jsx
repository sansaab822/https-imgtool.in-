import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

// ── Color helpers (reused from existing codebase) ──────────────────────────
const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-600 group-hover:text-white' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-600 group-hover:text-white' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'group-hover:bg-green-600 group-hover:text-white' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-600 group-hover:text-white' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-600 group-hover:text-white' },
    red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'group-hover:bg-red-600 group-hover:text-white' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'group-hover:bg-pink-600 group-hover:text-white' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-600 group-hover:text-white' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'group-hover:bg-yellow-600 group-hover:text-white' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'group-hover:bg-teal-600 group-hover:text-white' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600', hover: 'group-hover:bg-violet-600 group-hover:text-white' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', hover: 'group-hover:bg-slate-600 group-hover:text-white' },
}

// ── Curated "most popular" tools ──────────────────────────────────────────
const POPULAR_SLUGS = [
    'image-compressor',
    'compress-image-to-30kb',
    'image-resizer',
    'passport-size-photo',
    'bg-remover',
    'compress-image-to-50kb',
    'jpg-to-png',
    'jpg-to-pdf',
]

// ── Curated exam tools for spotlight ──────────────────────────────────────
const EXAM_TOOLS = [
    { name: 'SSC CGL Photo Resizer', slug: 'ssc-cgl-photo-resizer', spec: '275×354px, 20–50KB' },
    { name: 'IBPS PO Photo Resizer', slug: 'ibps-po-photo-resizer', spec: '200×230px, 20–50KB' },
    { name: 'NEET Photo Resizer', slug: 'neet-photo-resizer', spec: '413×531px, 10–200KB' },
    { name: 'SBI PO Photo Resizer', slug: 'sbi-po-photo-resizer', spec: '200×230px, 20–50KB' },
    { name: 'RRB NTPC Photo Resizer', slug: 'rrb-ntpc-photo-resizer', spec: '200×230px, 20–50KB' },
    { name: 'UPSC Photo Resizer', slug: 'upsc-photo-resizer', spec: '300×400px, 20–100KB' },
    { name: 'Army Agniveer Photo', slug: 'army-agniveer-photo-resizer', spec: '200×230px, 20–50KB' },
    { name: 'JEE Main Photo Resizer', slug: 'jee-main-photo-resizer', spec: '200×230px, 10–40KB' },
]

// ── FAQ data ─────────────────────────────────────────────────────────────
const FAQS = [
    {
        q: 'How to compress image online for free?',
        a: 'Open our Compress Image tool, upload your photo (JPG, PNG, or WEBP), choose your target file size in KB, and click compress. Your image downloads instantly. No account needed, completely free.',
    },
    {
        q: 'How to make passport size photo online?',
        a: 'Open our Passport Size Photo Maker, upload a clear photo, select the required dimensions (3.5×4.5cm for India, 2×2 inch for USA, or 35×45mm for international), crop as needed, and download. Free for all sizes.',
    },
    {
        q: 'How to reduce image size in KB without losing quality?',
        a: 'Use our compress-to-exact-KB tools. Upload your image, choose the target tool (e.g. Compress to 30KB, 50KB), and our tool intelligently adjusts JPEG quality to preserve the best possible visual clarity.',
    },
    {
        q: 'How to resize photo for SSC, IBPS, or NEET exam form?',
        a: 'Visit our Exam Photo Tools section. Each exam has a dedicated page with pre-set dimensions and KB limits — SSC CGL (275×354px, 20–50KB), IBPS PO (200×230px, 20–50KB), NEET (3.5×4.5cm). Upload and download in seconds.',
    },
    {
        q: 'Is IMG Tool safe? Are my photos stored?',
        a: 'Your photos are processed entirely in your web browser using the HTML5 Canvas API. Files never leave your device and are never uploaded to any server. We do not store, share, or access your images at any point.',
    },
    {
        q: 'Does IMG Tool work on mobile phones?',
        a: 'Yes, all tools are fully responsive and work on any device — Android, iPhone, iPad, or computer. No app installation is required. Just open imgtool.in in your browser.',
    },
]

// ── Schema markup (homepage) ──────────────────────────────────────────────
const homeSchema = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://imgtool.in/#website',
        url: 'https://imgtool.in/',
        name: 'IMG Tool',
        description: 'Free online image tools to compress, resize, convert and edit photos',
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
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
]

// ── Category spotlight config ─────────────────────────────────────────────
const CAT_SPOTLIGHT = [
    { id: 'compress-to-size', emoji: '🗜️', name: 'Compress to Exact KB', count: 9, href: '/all-image-converters' },
    { id: 'editors', emoji: '📐', name: 'Resize & Scale Tools', count: 8, href: '/all-image-converters' },
    { id: 'govt-exam-photos', emoji: '🪪', name: 'Exam & ID Photo Tools', count: 34, href: '/all-image-converters', highlight: true },
    { id: 'image-editing', emoji: '🎨', name: 'Edit & Enhance', count: 11, href: '/all-image-converters' },
    { id: 'converters', emoji: '🔄', name: 'Format Converters', count: 50, href: '/all-image-converters' },
    { id: 'social-media-tools', emoji: '📱', name: 'Social Media Tools', count: 11, href: '/all-image-converters' },
    { id: 'pdf-tools', emoji: '📄', name: 'PDF Tools', count: 11, href: '/all-image-converters' },
    { id: 'ai-tools', emoji: '🤖', name: 'AI Image Tools', count: 2, href: '/all-image-converters', badge: 'NEW' },
]

// ── Accordion data: categories → tools for "All Tools" section ───────────
function useAccordionData() {
    return useMemo(() => {
        return categories.map(cat => ({
            ...cat,
            tools: tools.filter(t => t.category === cat.id),
        })).filter(c => c.tools.length > 0)
    }, [])
}

// ─────────────────────────────────────────────────────────────────────────────
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
            {/* ── SEO Head ──────────────────────────────────────────────── */}
            <SEO
                title="Free Image Tools Online — Compress, Resize, Crop | ImgTool"
                description="Use 150+ free online image tools to compress, resize, crop, remove backgrounds, and convert formats (JPG, PNG, WEBP, HEIC) instantly in your browser."
                keywords="compress image online, resize image, passport size photo maker, reduce image size in kb, image converter online free, ssc photo resize, ibps photo size"
                canonical="/"
                schema={homeSchema}
            />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative bg-white border-b border-slate-200 pt-16 pb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #e0e7ff 2px, transparent 0)', backgroundSize: '50px 50px' }} aria-hidden="true"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-5">
                        150+ Tools · 100% Free · No Signup · Works on Mobile
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 text-slate-900">
                        Free Online <span className="gradient-text">Image Tools</span><br />
                        <span className="text-3xl sm:text-4xl md:text-5xl">Compress, Resize &amp; Edit Photos</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                        150+ free tools to <strong>compress images</strong>, <strong>resize photos</strong>, make <strong>passport size photos</strong>, convert image formats, remove backgrounds, and edit pictures — no signup, works on any device.
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {[
                            { label: 'Compress Image', href: '/image-compressor', icon: 'fa-compress-arrows-alt', color: 'bg-blue-600 hover:bg-blue-700' },
                            { label: 'Resize Image', href: '/image-resizer', icon: 'fa-expand-arrows-alt', color: 'bg-indigo-600 hover:bg-indigo-700' },
                            { label: 'Passport Photo', href: '/passport-size-photo', icon: 'fa-id-card', color: 'bg-purple-600 hover:bg-purple-700' },
                            { label: 'Remove Background', href: '/bg-remover', icon: 'fa-eraser', color: 'bg-pink-600 hover:bg-pink-700' },
                        ].map(btn => (
                            <Link key={btn.href} to={btn.href}
                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm shadow-lg transition-all ${btn.color}`}>
                                <i className={`fas ${btn.icon}`} aria-hidden="true"></i>
                                {btn.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-slate-400 text-lg" aria-hidden="true"></i>
                        </div>
                        <label htmlFor="hero-search" className="sr-only">Search image tools</label>
                        <input
                            id="hero-search"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none shadow-lg text-base transition-all"
                            placeholder="Search 150+ image tools…"
                            autoComplete="off"
                        />
                    </div>
                    {search && (
                        <p className="text-sm text-slate-500 mt-3">
                            {filtered?.length ?? 0} result{filtered?.length !== 1 ? 's' : ''} for "{search}"
                        </p>
                    )}
                </div>
            </section>

            <main>
                {/* ── SEARCH RESULTS (conditional) ──────────────────────── */}
                {filtered !== null && (
                    <section className="container mx-auto px-4 py-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Search Results</h2>
                        {filtered.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4">🔍</div>
                                <p className="text-slate-500 text-lg">No tools found for "<strong>{search}</strong>"</p>
                                <p className="text-slate-400 mt-2">Try searching for "compress", "resize", "IBPS", or "instagram".</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        )}
                    </section>
                )}

                {/* ── NORMAL HOMEPAGE (hidden when searching) ───────────── */}
                {filtered === null && (
                    <>
                        {/* AdSense Placement 1 — Below Hero */}
                        <div className="container mx-auto px-4 py-4 text-center" aria-label="Advertisement">
                            {/* ADSENSE PLACEMENT 1 — Paste responsive ad code below */}
                            {/* <ins className="adsbygoogle" ... /> */}
                        </div>

                        {/* ── MOST POPULAR TOOLS ──────────────────────────── */}
                        <section className="container mx-auto px-4 py-12" aria-labelledby="popular-heading">
                            <div className="flex items-center justify-between mb-6">
                                <h2 id="popular-heading" className="text-2xl sm:text-3xl font-bold text-slate-800">
                                    🔥 Most Popular Image Tools
                                </h2>
                                <Link to="/all-image-converters" className="text-sm text-indigo-600 hover:underline font-medium">
                                    View all →
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {popularTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        </section>

                        {/* ── BROWSE BY CATEGORY ──────────────────────────── */}
                        <section className="bg-slate-50 border-y border-slate-200 py-12" aria-labelledby="categories-heading">
                            <div className="container mx-auto px-4">
                                <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8 text-center">
                                    Browse Tools by Category
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {CAT_SPOTLIGHT.map(cat => (
                                        <Link key={cat.id} to={cat.href}
                                            className={`group relative bg-white rounded-xl border-2 p-5 flex flex-col items-center text-center gap-2 hover:shadow-md transition-all ${cat.highlight ? 'border-orange-400 bg-orange-50' : 'border-slate-200 hover:border-indigo-400'}`}>
                                            {cat.badge && (
                                                <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cat.badge}</span>
                                            )}
                                            <span className="text-3xl" aria-hidden="true">{cat.emoji}</span>
                                            <h3 className="font-bold text-sm text-slate-800 leading-tight">{cat.name}</h3>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.highlight ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {cat.count} tools
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ── EXAM PHOTO SPOTLIGHT ─────────────────────────── */}
                        <section className="container mx-auto px-4 py-12" aria-labelledby="exam-heading">
                            <div className="grid lg:grid-cols-2 gap-8 items-start">
                                {/* Left: text */}
                                <div>
                                    <span className="inline-block text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full mb-3">
                                        🎓 Govt Exam Photo Tools
                                    </span>
                                    <h2 id="exam-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                                        Free Exam Photo Resizer — SSC, IBPS, NEET &amp; More
                                    </h2>
                                    <p className="text-slate-600 mb-5 leading-relaxed">
                                        Preparing for a government exam? Every exam has strict photo requirements. Our dedicated <strong>exam photo resizer tools</strong> are pre-configured with exact pixel dimensions and file size limits — no guesswork. Upload, resize, and download the perfect photo for your application form instantly.
                                    </p>
                                    <ul className="space-y-2 mb-6">
                                        {EXAM_TOOLS.slice(0, 6).map(t => (
                                            <li key={t.slug}>
                                                <Link to={`/${t.slug}`} className="flex items-center justify-between group hover:bg-slate-50 rounded-lg px-3 py-2 -mx-3 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-graduation-cap text-indigo-400 w-4" aria-hidden="true"></i>
                                                        <span className="font-medium text-slate-700 group-hover:text-indigo-600 text-sm">{t.name}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{t.spec}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/all-image-converters"
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                                        <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                                        View all 25 exam tools →
                                    </Link>
                                </div>
                                {/* Right: mini cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    {EXAM_TOOLS.map(t => (
                                        <Link key={t.slug} to={`/${t.slug}`}
                                            className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-4 transition-all hover:shadow-sm">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                                                <i className="fas fa-graduation-cap text-sm" aria-hidden="true"></i>
                                            </div>
                                            <h3 className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 leading-tight mb-1">{t.name}</h3>
                                            <p className="text-[10px] text-slate-400">{t.spec}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* AdSense Placement 2 */}
                        <div className="container mx-auto px-4 pb-4 text-center" aria-label="Advertisement">
                            {/* ADSENSE PLACEMENT 2 — Paste responsive ad code below */}
                        </div>

                        {/* ── TRUST STATS BAR ──────────────────────────────── */}
                        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-10" aria-label="Trust statistics">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
                                    {[
                                        { icon: 'fa-bolt', stat: '150+', label: 'Free Online Tools' },
                                        { icon: 'fa-lock', stat: '100% Private', label: 'Browser-Based Processing' },
                                        { icon: 'fa-mobile-alt', stat: 'Any Device', label: 'Mobile, Tablet & Desktop' },
                                        { icon: 'fa-clock', stat: 'Instant', label: 'No Waiting, No Upload' },
                                    ].map(s => (
                                        <div key={s.label} className="flex flex-col items-center gap-1">
                                            <i className={`fas ${s.icon} text-2xl text-white/80`} aria-hidden="true"></i>
                                            <span className="text-xl font-extrabold">{s.stat}</span>
                                            <span className="text-sm text-white/70">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ── ALL TOOLS ACCORDION ──────────────────────────── */}
                        <section className="container mx-auto px-4 py-12" aria-labelledby="all-tools-heading">
                            <h2 id="all-tools-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                                All {tools.length}+ Free Image Tools
                            </h2>
                            <p className="text-slate-500 mb-8">Browse every tool by category. Click a category to expand and see all tools.</p>

                            <div className="space-y-3">
                                {accordionData.map((cat, idx) => (
                                    <>
                                        {/* AdSense Placement 3 — between items 5 and 6 */}
                                        {idx === 5 && (
                                            <div key="adsense-3" className="py-4 text-center" aria-label="Advertisement">
                                                {/* ADSENSE PLACEMENT 3 — Paste responsive ad code below */}
                                            </div>
                                        )}
                                        <details key={cat.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden" open={idx === 0}>
                                            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-slate-50 transition-colors list-none">
                                                <div className="flex items-center gap-3">
                                                    <i className={`fas ${cat.icon || 'fa-tools'} text-indigo-500 w-5`} aria-hidden="true"></i>
                                                    <span className="font-bold text-slate-800">{cat.name}</span>
                                                    <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">{cat.tools.length} tools</span>
                                                </div>
                                                <i className="fas fa-chevron-down text-slate-400 text-sm group-open:rotate-180 transition-transform" aria-hidden="true"></i>
                                            </summary>
                                            <div className="border-t border-slate-100 px-5 py-4">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                                    {cat.tools.map(tool => (
                                                        <li key={tool.slug}>
                                                            <Link to={`/${tool.slug}`}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                                                <i className={`fas ${tool.icon || 'fa-tools'} text-xs w-3 opacity-60`} aria-hidden="true"></i>
                                                                {tool.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </details>
                                    </>
                                ))}
                            </div>
                        </section>

                        {/* ── HOW IT WORKS ─────────────────────────────────── */}
                        <section className="bg-slate-50 border-y border-slate-200 py-12" aria-labelledby="how-heading">
                            <div className="container mx-auto px-4">
                                <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 text-center">
                                    How to Use IMG Tool — 3 Simple Steps
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                    {[
                                        {
                                            step: '1', icon: 'fa-upload', color: 'bg-blue-100 text-blue-600',
                                            title: 'Upload Your Image',
                                            desc: 'Click to upload or drag & drop your JPG, PNG, WEBP, HEIC, BMP, or GIF file directly into the tool. All common formats are supported.',
                                        },
                                        {
                                            step: '2', icon: 'fa-sliders-h', color: 'bg-indigo-100 text-indigo-600',
                                            title: 'Choose Tool & Settings',
                                            desc: 'Select your desired output — target KB size, pixel dimensions, output format, or quality level. Each tool shows exactly what settings apply.',
                                        },
                                        {
                                            step: '3', icon: 'fa-download', color: 'bg-green-100 text-green-600',
                                            title: 'Download Instantly',
                                            desc: 'Your processed image downloads immediately in your browser. No email required. The tool runs entirely on your device — nothing is ever uploaded.',
                                        },
                                    ].map(s => (
                                        <div key={s.step} className="bg-white rounded-xl border border-slate-200 p-6 relative">
                                            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                                                <i className={`fas ${s.icon} text-xl`} aria-hidden="true"></i>
                                            </div>
                                            <span className="absolute top-4 right-4 text-5xl font-black text-slate-100 select-none" aria-hidden="true">{s.step}</span>
                                            <h3 className="font-bold text-lg text-slate-800 mb-2">{s.title}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ── FAQ SECTION ──────────────────────────────────── */}
                        <section className="container mx-auto px-4 py-12 max-w-3xl" aria-labelledby="faq-heading">
                            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8 text-center">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {FAQS.map((faq, i) => (
                                    <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                                        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-slate-50 transition-colors list-none gap-4">
                                            <h3 className="font-semibold text-slate-800 text-sm leading-snug pr-2">{faq.q}</h3>
                                            <i className="fas fa-plus text-slate-400 text-sm flex-shrink-0 group-open:hidden" aria-hidden="true"></i>
                                            <i className="fas fa-minus text-indigo-500 text-sm flex-shrink-0 hidden group-open:block" aria-hidden="true"></i>
                                        </summary>
                                        <div className="border-t border-slate-100 px-5 py-4">
                                            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    )
}

// ── Tool Card Component ────────────────────────────────────────────────────
function ToolCard({ tool }) {
    const c = colorMap[tool.color] || colorMap.blue
    return (
        <Link to={`/${tool.slug}`} className="tool-card bg-white p-5 rounded-xl border border-slate-200 block group hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-center mb-3 gap-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center text-lg flex-shrink-0 transition-colors duration-200 ${c.hover}`} aria-hidden="true">
                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                </div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{tool.name}</h3>
            </div>
            {tool.description && (
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{tool.description}</p>
            )}
        </Link>
    )
}
