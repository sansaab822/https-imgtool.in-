import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'
import { blogPosts } from '../data/blogData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

// ── Top Featured Workstations ──────────────────────────────────────────────────
const FEATURED_WORKFLOWS = [
    {
        title: 'Batch Watermark Studio',
        slug: 'batch-watermark-images',
        category: 'Image Protection',
        desc: 'Stamp customizable text, copyright presets, or PNG logos across multiple photos simultaneously with diagonal repeat protection.',
        icon: 'fa-stamp',
        badge: 'NEW STUDIO',
        specs: 'Batch ZIP · Text & Logo · Zero Uploads',
        color: 'blue'
    },
    {
        title: 'Govt & Exam Photo Resizer',
        slug: 'government-photo-resizer',
        category: 'Official Portals',
        desc: 'Resize photos, signatures, and thumb impressions to strict portal limits (20KB–50KB, 10KB–20KB) for SSC, UPSC, IBPS, and NEET.',
        icon: 'fa-graduation-cap',
        badge: 'PORTAL READY',
        specs: 'Exact KB Search · Official Presets',
        color: 'indigo'
    },
    {
        title: 'Split & Extract PDF Pages',
        slug: 'split-pdf',
        category: 'PDF Studio',
        desc: 'Visual thumbnail picker to extract custom page ranges, split documents into sheets, or delete unwanted pages in browser memory.',
        icon: 'fa-scissors',
        badge: '100% PRIVATE',
        specs: 'Zero Server Storage · PDF-Lib WASM',
        color: 'red'
    },
    {
        title: 'Signature to Transparent PNG',
        slug: 'signature-to-transparent-png',
        category: 'Biometric Prep',
        desc: 'Extract handwritten ink signatures from smartphone photos, remove paper grayness, and export crisp 140×60px transparent PNGs.',
        icon: 'fa-file-signature',
        badge: 'HIGH DEMAND',
        specs: 'Adaptive Thresholding · 1-Click Crop',
        color: 'teal'
    },
    {
        title: 'Lossless 300/600 DPI Converter',
        slug: 'image-dpi-converter',
        category: 'Print Standards',
        desc: 'Patch JFIF APP0 and PNG pHYs metadata chunks to 300 or 600 DPI for journal publications and passport printing without re-compression.',
        icon: 'fa-print',
        badge: 'LOSSLESS',
        specs: 'Bit-Perfect · Zero Quality Loss',
        color: 'purple'
    },
    {
        title: 'Passport Size Photo Maker',
        slug: 'passport-size-photo',
        category: 'ID Documents',
        desc: 'Format passport and visa photos for India (35×45mm), US (2×2 in), and global specs with automated printable A4 grid layout.',
        icon: 'fa-id-card',
        badge: 'A4 PRINT GRID',
        specs: 'Country Presets · 6/8 Photo Sheets',
        color: 'blue'
    }
]

// ── Quick Workflow Action Pills ────────────────────────────────────────────────
const QUICK_PILLS = [
    { label: 'Batch Watermark', slug: 'batch-watermark-images', icon: 'fa-stamp' },
    { label: '20KB–50KB Exam Photo', slug: 'government-photo-resizer', icon: 'fa-graduation-cap' },
    { label: 'Transparent Signature', slug: 'signature-to-transparent-png', icon: 'fa-file-signature' },
    { label: 'Split PDF Pages', slug: 'split-pdf', icon: 'fa-scissors' },
    { label: '300 DPI Converter', slug: 'image-dpi-converter', icon: 'fa-print' },
    { label: 'Aadhaar A4 Print', slug: 'aadhaar-card-print-setting-a4', icon: 'fa-print' },
    { label: 'EXIF GPS Stripper', slug: 'image-metadata-viewer', icon: 'fa-shield-halved' },
]

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    // Filter tools for live search
    const filteredTools = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return null
        return tools.filter(t =>
            t.slug !== 'all-image-converters' && (
                t.name.toLowerCase().includes(q) ||
                (t.description || '').toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
            )
        )
    }, [searchQuery])

    return (
        <>
            <SEO
                title="Browser-Based Image & PDF Workstation | ImgTool Studio"
                description="Your Files. Your Workflow. Your Control. Fast, private in-browser utilities to batch watermark photos, resize exam photos to exact KB, convert DPI, and split PDFs without server uploads."
                keywords="batch watermark photos, compress image to 50kb, government exam photo resizer, signature transparent png, split pdf, image dpi converter"
                canonical="/"
            />

            {/* ── HERO WORKSTATION ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-900 dark:bg-workstation-950 text-white border-b border-slate-800 dark:border-workstation-800 pt-16 pb-20 sm:pt-24 sm:pb-28 transition-colors">
                {/* Background glow layers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl opacity-70"></div>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    
                    {/* Privacy Pill Header */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Client-Side RAM Architecture — Zero Server Uploads</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.15]">
                        Your Files. Your Workflow.<br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
                            Your Absolute Control.
                        </span>
                    </h1>

                    {/* Supporting Description */}
                    <p className="text-sm sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                        Practical image, document, and PDF utilities engineered for speed and uncompromising privacy. Every byte executes locally on your device's processor.
                    </p>

                    {/* Interactive Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative group">
                            <i className="fas fa-search absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-base sm:text-lg group-focus-within:text-blue-400 transition-colors"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by task (e.g. watermark photos, 50kb photo, split pdf, 300 dpi)..."
                                className="w-full pl-12 sm:pl-14 pr-12 py-4 sm:py-4.5 rounded-2xl bg-slate-800/80 dark:bg-workstation-900/90 border border-slate-700/80 dark:border-workstation-750 text-white placeholder-slate-400 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-2xl transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Action Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">
                            Quick Workflows:
                        </span>
                        {QUICK_PILLS.map((pill) => (
                            <Link
                                key={pill.slug}
                                to={`/${pill.slug}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 dark:bg-workstation-850 hover:bg-blue-600/20 hover:border-blue-500/40 text-xs font-semibold text-slate-200 border border-slate-700/60 dark:border-workstation-800 transition-all duration-200"
                            >
                                <i className={`fas ${pill.icon} text-blue-400 text-[11px]`}></i>
                                <span>{pill.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                
                {/* ── SEARCH RESULTS (IF SEARCHING) ────────────────────────── */}
                {filteredTools !== null && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Search Results for "{searchQuery}" ({filteredTools.length})
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>

                        {filteredTools.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-8">
                                <i className="fas fa-search text-3xl text-slate-400 mb-3 block"></i>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                                    No tools found matching "{searchQuery}"
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                                    Try searching by action (e.g. "compress", "watermark", "split", "convert") or file format.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTools.map((t) => (
                                    <Link
                                        key={t.slug}
                                        to={`/${t.slug}`}
                                        className="p-5 rounded-2xl bg-white dark:bg-workstation-900 border border-slate-200 dark:border-workstation-750 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <i className={`fas ${t.icon || 'fa-wrench'}`}></i>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                {t.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                                {t.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* ── POPULAR WORKFLOWS GRID ───────────────────────────────── */}
                {filteredTools === null && (
                    <>
                        <section className="mb-20" aria-labelledby="featured-heading">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                        <i className="fas fa-fire text-amber-500"></i>
                                        High-Impact Utilities
                                    </div>
                                    <h2 id="featured-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        Popular Digital Workstations
                                    </h2>
                                </div>
                                <Link
                                    to="/all-image-converters"
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    Explore all 30+ tools <i className="fas fa-arrow-right text-[10px]"></i>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {FEATURED_WORKFLOWS.map((wf) => (
                                    <Link
                                        key={wf.slug}
                                        to={`/${wf.slug}`}
                                        className="workstation-card p-6 flex flex-col justify-between group relative overflow-hidden"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                                                    <i className={`fas ${wf.icon}`}></i>
                                                </div>
                                                <Badge variant="primary" size="sm">
                                                    {wf.badge}
                                                </Badge>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                {wf.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                                {wf.desc}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 dark:border-workstation-800 flex items-center justify-between text-xs">
                                            <span className="font-mono text-slate-400 text-[11px] truncate">
                                                {wf.specs}
                                            </span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                Open Studio <i className="fas fa-arrow-right text-[10px]"></i>
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* ── SPOTLIGHT: BATCH IMAGE WATERMARK STUDIO ──────────── */}
                        <section className="mb-20 bg-gradient-to-br from-blue-900/10 via-slate-900 to-indigo-950/30 text-white rounded-3xl border border-slate-800 dark:border-workstation-750 p-8 sm:p-12 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                <div className="lg:col-span-7 space-y-5">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                                        <i className="fas fa-stamp"></i> FEATURED WORKSTATION
                                    </div>
                                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                        Batch Image Watermark Studio
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                        Stamp custom copyright text, date overlays, or high-res PNG logos across 50+ photos simultaneously. With live drag-positioning, diagonal repeat patterns, and 1-click ZIP export, protecting your photography portfolio has never been faster.
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                                            <span className="font-bold text-white block mb-0.5">Diagonal Repeat</span>
                                            <span className="text-slate-400 text-[11px]">Anti-crop protection</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                                            <span className="font-bold text-white block mb-0.5">PNG Logo Stamp</span>
                                            <span className="text-slate-400 text-[11px]">Transparency preserved</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                                            <span className="font-bold text-white block mb-0.5">Instant ZIP</span>
                                            <span className="text-slate-400 text-[11px]">Batch archive export</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-4 flex-wrap">
                                        <Link to="/batch-watermark-images">
                                            <Button variant="primary" size="lg" icon="fa-arrow-right" iconPosition="right">
                                                Launch Batch Watermark Studio
                                            </Button>
                                        </Link>
                                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <i className="fas fa-shield-halved text-emerald-400"></i> Zero server uploads
                                        </span>
                                    </div>
                                </div>

                                {/* Visual Studio Mockup Graphic */}
                                <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-700/80 p-4 shadow-2xl space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                                        <span className="font-mono text-[11px]">batch_watermark_workbench.jsx</span>
                                        <span className="text-emerald-400 font-bold text-[10px]">LOCAL RAM</span>
                                    </div>
                                    <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                                        <i className="fas fa-image text-4xl text-slate-800"></i>
                                        <div className="absolute inset-0 flex items-center justify-center -rotate-12 pointer-events-none">
                                            <span className="text-xs font-mono font-bold tracking-widest text-white/30 border border-white/20 px-4 py-1.5 rounded-lg">
                                                © IMGTOOL CLIENT PROOF
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                        <span>Queue: 12 photos loaded</span>
                                        <span className="text-blue-400 font-mono font-bold">100% Client-Side</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── ARCHITECTURAL PRIVACY BREAKDOWN ─────────────────── */}
                        <section className="mb-20" aria-labelledby="privacy-heading">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <Badge variant="emerald" icon="fa-shield-halved" size="sm" className="mb-2">
                                    Privacy By Architecture
                                </Badge>
                                <h2 id="privacy-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Why Zero-Upload Processing Matters
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    When you process sensitive documents, exam photos, or contracts on SaaS websites, files sit on remote cloud storage buckets. Here is how imgtool.in is built differently:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-white dark:bg-workstation-900 border border-slate-200 dark:border-workstation-750 shadow-sm space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                                        <i className="fas fa-microchip"></i>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        Local CPU & WebAssembly
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        All transformations (JPEG quantization, PDF cross-reference patching, and canvas rendering) run inside your device's browser memory via WebAssembly.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-white dark:bg-workstation-900 border border-slate-200 dark:border-workstation-750 shadow-sm space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                                        <i className="fas fa-network-wired"></i>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        Zero Network Outflow
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Inspect your browser's Developer Tools Network tab during any operation. No file data, images, or document bytes are transmitted to any remote server.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-white dark:bg-workstation-900 border border-slate-200 dark:border-workstation-750 shadow-sm space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-bold">
                                        <i className="fas fa-wifi"></i>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        True Offline Execution
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Once the web application loads, you can completely disconnect your internet connection. Our watermark, PDF, and image tools will continue to function seamlessly.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ── TECHNICAL GUIDES & ARTICLES ───────────────────── */}
                        <section className="mb-20" aria-labelledby="guides-heading">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 id="guides-heading" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <i className="fas fa-book-open text-blue-500 text-lg"></i>
                                        Engineering Guides & Standards
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Authoritative deep dives into image compression algorithms, print DPI standards, and document security.
                                    </p>
                                </div>
                                <Link to="/blog" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    All Guides →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogPosts.slice(0, 3).map((post) => (
                                    <Link
                                        key={post.slug}
                                        to={`/blog/${post.slug}`}
                                        className="workstation-card p-6 flex flex-col justify-between group"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                                                <span>{post.category}</span>
                                                <span>•</span>
                                                <span className="text-slate-400">{post.readTime}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 dark:border-workstation-800 flex items-center justify-between text-xs text-slate-400">
                                            <span>{post.date}</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                Read guide →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    )
}
