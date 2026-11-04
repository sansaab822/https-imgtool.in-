import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { tools } from '../data/toolsData'

// ── Search Keyword Index ───────────────────────────────────────────────────────
// Maps user keywords to exact existing tool routes
const SEARCH_ENTRIES = [
    ...tools.map(t => ({
        name: t.name,
        slug: t.slug,
        icon: t.icon,
        category: t.category,
        keywords: `${t.name} ${t.slug} ${t.description || ''}`
    })),
    // Task synonyms mapping directly to verified tools
    { name: 'Batch Watermark Photos', slug: 'batch-watermark-images', icon: 'fa-stamp', category: 'editors', keywords: 'watermark batch copyright logo text photos protect' },
    { name: 'Compress Image to 20KB–50KB', slug: 'government-photo-resizer', icon: 'fa-graduation-cap', category: 'document-id-tools', keywords: '50kb 20kb exam ssc upsc photo signature resize compress' },
    { name: 'Extract Transparent Signature', slug: 'signature-to-transparent-png', icon: 'fa-file-signature', category: 'document-id-tools', keywords: 'signature transparent png paper ink remove white background' },
    { name: 'Split & Extract PDF Pages', slug: 'split-pdf', icon: 'fa-scissors', category: 'pdf-tools', keywords: 'split pdf delete page extract page separate' },
    { name: 'Convert to 300 DPI Lossless', slug: 'image-dpi-converter', icon: 'fa-print', category: 'utility', keywords: '300 dpi 600 dpi resolution print photo patch' },
    { name: 'Aadhaar Card A4 Print Setting', slug: 'aadhaar-card-print-setting-a4', icon: 'fa-print', category: 'document-id-tools', keywords: 'aadhaar print a4 card id front back' },
    { name: 'PAN Card Photo & Signature 213x213', slug: 'pan-card-photo', icon: 'fa-id-card', category: 'document-id-tools', keywords: 'pan card nsdl utiitsl 213 213 photo signature' },
    { name: 'Passport Size Photo Maker', slug: 'passport-size-photo', icon: 'fa-id-card', category: 'document-id-tools', keywords: 'passport photo visa 35x45 2x2 a4 print sheet' },
    { name: 'Crop PDF Margins', slug: 'pdf-crop', icon: 'fa-crop', category: 'pdf-tools', keywords: 'pdf crop margin trim white border' },
    { name: 'Strip EXIF & GPS Metadata', slug: 'image-metadata-viewer', icon: 'fa-shield-halved', category: 'utility', keywords: 'exif metadata gps remove camera privacy' },
]

// ── MegaMenu Workstation Categories ───────────────────────────────────────────
const MEGA_WORKSTATIONS = [
    {
        id: 'official-id',
        title: 'Official Forms & ID',
        icon: 'fa-id-badge',
        color: 'text-indigo-500',
        tools: [
            { slug: 'passport-size-photo', label: 'Passport Size Photo Maker', icon: 'fa-id-card' },
            { slug: 'aadhaar-card-print-setting-a4', label: 'Aadhaar Card A4 Print Setting', icon: 'fa-print' },
            { slug: 'pan-card-photo', label: 'PAN Card Photo Resizer', icon: 'fa-id-card' },
            { slug: 'signature-to-transparent-png', label: 'Signature to Transparent PNG', icon: 'fa-file-signature' },
            { slug: 'government-photo-resizer', label: 'Govt & Exam Photo Resizer', icon: 'fa-graduation-cap' },
            { slug: 'ssc-photo-date-adder', label: 'SSC Photo & Date Adder', icon: 'fa-calendar-alt' },
        ]
    },
    {
        id: 'pdf-studio',
        title: 'PDF Studio',
        icon: 'fa-file-pdf',
        color: 'text-red-500',
        tools: [
            { slug: 'split-pdf', label: 'Split PDF & Extract Pages', icon: 'fa-scissors' },
            { slug: 'merge-pdf', label: 'Merge Multiple PDFs', icon: 'fa-object-group' },
            { slug: 'pdf-crop', label: 'Crop PDF Margins', icon: 'fa-crop' },
            { slug: 'pdf-to-jpg', label: 'PDF to High-Res JPG', icon: 'fa-file-image' },
            { slug: 'jpg-to-pdf', label: 'Images to Printable PDF', icon: 'fa-file-pdf' },
            { slug: 'pdf-password-remover', label: 'PDF Password Remover', icon: 'fa-unlock' },
        ]
    },
    {
        id: 'image-lab',
        title: 'Image Processing Lab',
        icon: 'fa-wand-magic-sparkles',
        color: 'text-blue-500',
        tools: [
            { slug: 'batch-watermark-images', label: 'Batch Watermark Studio', icon: 'fa-stamp', badge: 'NEW' },
            { slug: 'image-compressor', label: 'Image Compressor (Target KB)', icon: 'fa-compress-arrows-alt' },
            { slug: 'image-resizer', label: 'Image Resizer & Dimensions', icon: 'fa-expand' },
            { slug: 'crop-image', label: 'Crop Image & Composition', icon: 'fa-crop' },
            { slug: 'bg-remover', label: 'Background Remover', icon: 'fa-eraser' },
            { slug: 'image-enhancer', label: 'Clarity & Contrast Enhancer', icon: 'fa-sliders-h' },
        ]
    },
    {
        id: 'developer-privacy',
        title: 'Developer & Privacy',
        icon: 'fa-shield-halved',
        color: 'text-teal-500',
        tools: [
            { slug: 'image-dpi-converter', label: 'Lossless 300/600 DPI Converter', icon: 'fa-print' },
            { slug: 'image-metadata-viewer', label: 'EXIF Viewer & Privacy Stripper', icon: 'fa-info-circle' },
            { slug: 'favicon-generator', label: 'Favicon & PWA Icon Generator', icon: 'fa-star' },
            { slug: 'qr-code-generator', label: 'High-Res QR Code Generator', icon: 'fa-qrcode' },
            { slug: '3d-text-to-stl-generator', label: '3D Text to STL (3D Printing)', icon: 'fa-cube' },
            { slug: 'image-converter', label: 'Universal Format Converter', icon: 'fa-exchange-alt' },
        ]
    }
]

// ── Theme State Helper ────────────────────────────────────────────────────────
function getInitialTheme() {
    try {
        const stored = localStorage.getItem('imgtool-theme')
        if (stored) return stored === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
        return false
    }
}

export default function Header() {
    const [isDark, setIsDark] = useState(getInitialTheme)
    const [megaOpen, setMegaOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeResultIdx, setActiveResultIdx] = useState(0)
    const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

    const searchRef = useRef(null)
    const megaRef = useRef(null)
    const inputRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    // Apply dark class
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
        try {
            localStorage.setItem('imgtool-theme', isDark ? 'dark' : 'light')
        } catch {}
    }, [isDark])

    // Close on navigation
    useEffect(() => {
        setMegaOpen(false)
        setMobileOpen(false)
        setSearchOpen(false)
        setSearchQuery('')
    }, [location.pathname])

    // Ctrl+K / Cmd+K listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
                setSearchOpen(true)
            }
            if (e.key === 'Escape') {
                setSearchOpen(false)
                setMegaOpen(false)
                setPrivacyModalOpen(false)
                setSearchQuery('')
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Click outside listeners
    useEffect(() => {
        const handleOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false)
            }
            if (megaRef.current && !megaRef.current.contains(e.target)) {
                setMegaOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => document.removeEventListener('mousedown', handleOutside)
    }, [])

    // Filter results
    const filteredResults = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return []
        const seen = new Set()
        const matches = []
        for (const item of SEARCH_ENTRIES) {
            if (item.keywords.toLowerCase().includes(q) && !seen.has(item.slug)) {
                seen.add(item.slug)
                matches.push(item)
                if (matches.length >= 8) break
            }
        }
        return matches
    }, [searchQuery])

    const handleSelectResult = useCallback((slug) => {
        navigate(`/${slug}`)
        setSearchOpen(false)
        setSearchQuery('')
    }, [navigate])

    const handleSearchKeyDown = (e) => {
        if (!filteredResults.length) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveResultIdx((i) => Math.min(i + 1, filteredResults.length - 1))
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveResultIdx((i) => Math.max(i - 1, 0))
        }
        if (e.key === 'Enter' && filteredResults[activeResultIdx]) {
            e.preventDefault()
            handleSelectResult(filteredResults[activeResultIdx].slug)
        }
    }

    return (
        <>
            {/* ── TOP WORKSTATION NAVBAR ────────────────────────────────────── */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white/90 dark:bg-workstation-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-workstation-750 transition-colors">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
                    
                    {/* Brand Mark & Logo */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group select-none" aria-label="imgtool.in home">
                            {/* Layered Workstation Mark */}
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center text-sm shadow-md shadow-blue-600/20 group-hover:shadow-blue-600/30 group-hover:scale-105 transition-all duration-200">
                                <i className="fas fa-layer-group text-xs" aria-hidden="true"></i>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        img<span className="text-blue-600 dark:text-blue-400">tool</span>
                                    </span>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50">
                                        STUDIO
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Workstations Dropdown */}
                        <div ref={megaRef} className="hidden lg:block relative">
                            <button
                                type="button"
                                onClick={() => setMegaOpen(!megaOpen)}
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                    megaOpen
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-workstation-800'
                                }`}
                                aria-expanded={megaOpen}
                            >
                                <i className="fas fa-grid-2 text-xs opacity-70"></i>
                                <span>Workstations</span>
                                <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Workstation Mega Menu */}
                            {megaOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[780px] bg-white dark:bg-workstation-900 rounded-2xl shadow-workstation-lg border border-slate-200 dark:border-workstation-750 p-6 z-50 animate-fadeIn">
                                    <div className="grid grid-cols-2 gap-6">
                                        {MEGA_WORKSTATIONS.map((ws) => (
                                            <div key={ws.id} className="space-y-3">
                                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-workstation-800">
                                                    <i className={`fas ${ws.icon} ${ws.color} text-xs`}></i>
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                                        {ws.title}
                                                    </h3>
                                                </div>
                                                <ul className="space-y-1">
                                                    {ws.tools.map((t) => (
                                                        <li key={t.slug}>
                                                            <Link
                                                                to={`/${t.slug}`}
                                                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-workstation-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                                            >
                                                                <span className="flex items-center gap-2 truncate">
                                                                    <i className={`fas ${t.icon} text-slate-400 group-hover:text-blue-500 text-[11px] w-4 text-center`}></i>
                                                                    <span className="truncate">{t.label}</span>
                                                                </span>
                                                                {t.badge && (
                                                                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                                                        {t.badge}
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-workstation-800 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                            <i className="fas fa-shield-halved"></i>
                                            <span>Zero Server Uploads · 100% In-Browser Execution</span>
                                        </div>
                                        <Link to="/all-image-converters" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                            Explore all 30+ tools →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Universal Task Search Bar */}
                    <div ref={searchRef} className="flex-1 max-w-md relative mx-2">
                        <div className="relative">
                            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setSearchOpen(true)
                                }}
                                onFocus={() => setSearchOpen(true)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search tasks (e.g. watermark, 50kb photo, split pdf)..."
                                className="w-full h-9 pl-9 pr-14 text-xs rounded-xl bg-slate-100/80 dark:bg-workstation-850 border border-slate-200/80 dark:border-workstation-750 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-workstation-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                autoComplete="off"
                            />
                            <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-workstation-800 border border-slate-200 dark:border-workstation-700 rounded select-none">
                                ⌘K
                            </kbd>
                        </div>

                        {/* Search Dropdown */}
                        {searchOpen && filteredResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-workstation-900 rounded-xl border border-slate-200 dark:border-workstation-750 shadow-xl overflow-hidden z-50 animate-fadeIn">
                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-workstation-800">
                                    Tools & Matching Tasks
                                </div>
                                <ul className="max-h-64 overflow-y-auto py-1">
                                    {filteredResults.map((item, idx) => (
                                        <li key={`${item.slug}-${idx}`}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectResult(item.slug)}
                                                onMouseEnter={() => setActiveResultIdx(idx)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors text-left ${
                                                    idx === activeResultIdx
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-workstation-850'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <i className={`fas ${item.icon || 'fa-wrench'} text-slate-400 text-xs w-4 text-center`}></i>
                                                    <span className="font-semibold">{item.name}</span>
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">/{item.slug}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Action Icons & Privacy Pill */}
                    <div className="flex items-center gap-2">
                        {/* Verified Privacy Pill */}
                        <button
                            type="button"
                            onClick={() => setPrivacyModalOpen(true)}
                            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 transition-colors select-none"
                            title="Click to view local privacy details"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Zero Server Uploads</span>
                        </button>

                        {/* Navigation Links */}
                        <NavLink
                            to="/all-image-converters"
                            className={({ isActive }) => `hidden sm:inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            All Tools
                        </NavLink>

                        <NavLink
                            to="/blog"
                            className={({ isActive }) => `hidden sm:inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Guides
                        </NavLink>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsDark(!isDark)}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-workstation-800 transition-colors"
                        >
                            {isDark ? (
                                <i className="fas fa-sun text-xs text-amber-400"></i>
                            ) : (
                                <i className="fas fa-moon text-xs"></i>
                            )}
                        </button>

                        {/* Mobile Menu Hamburger */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open mobile menu"
                            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-workstation-800"
                        >
                            <i className="fas fa-bars text-sm"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Spacer for 56px fixed navbar */}
            <div className="h-14"></div>

            {/* ── MOBILE WORKSTATION DRAWER ─────────────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                    />
                    <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-workstation-900 shadow-2xl border-l border-slate-200 dark:border-workstation-750 flex flex-col p-5 overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-workstation-800">
                            <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i className="fas fa-layer-group text-blue-500"></i>
                                Workstation Menu
                            </span>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                aria-label="Close menu"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Mobile Quick Links */}
                        <div className="py-4 space-y-1">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-workstation-850"
                            >
                                <i className="fas fa-house text-slate-400 w-4 text-center"></i> Home
                            </Link>
                            <Link
                                to="/batch-watermark-images"
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40"
                            >
                                <span className="flex items-center gap-3">
                                    <i className="fas fa-stamp w-4 text-center"></i> Batch Watermark
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">NEW</span>
                            </Link>
                            <Link
                                to="/all-image-converters"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-workstation-850"
                            >
                                <i className="fas fa-grid-2 text-slate-400 w-4 text-center"></i> All Tools Directory
                            </Link>
                            <Link
                                to="/blog"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-workstation-850"
                            >
                                <i className="fas fa-book-open text-slate-400 w-4 text-center"></i> Guides & Benchmarks
                            </Link>
                        </div>

                        {/* Workstation Sections */}
                        <div className="pt-2 border-t border-slate-100 dark:border-workstation-800 space-y-4">
                            {MEGA_WORKSTATIONS.map((ws) => (
                                <div key={ws.id} className="space-y-1.5">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                                        {ws.title}
                                    </h4>
                                    <div className="space-y-0.5">
                                        {ws.tools.slice(0, 3).map((t) => (
                                            <Link
                                                key={t.slug}
                                                to={`/${t.slug}`}
                                                className="block px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                                            >
                                                {t.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust & Privacy Card */}
                        <div className="mt-auto pt-6">
                            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-xs">
                                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                                    <i className="fas fa-shield-halved"></i>
                                    100% Client-Side Privacy
                                </div>
                                <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed">
                                    Your files never touch a remote server. All conversions happen entirely in your local browser RAM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRIVACY VERIFICATION MODAL ─────────────────────────────────── */}
            {privacyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setPrivacyModalOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-lg bg-white dark:bg-workstation-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-workstation-750 p-6 z-10 animate-fadeIn">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
                                    <i className="fas fa-shield-check"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                        Client-Side Architectural Privacy
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        How imgtool.in safeguards your sensitive documents
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPrivacyModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            <p>
                                Unlike typical SaaS conversion platforms, <strong>imgtool.in executes 100% of image, PDF, and watermark processing inside your device's browser memory</strong> using HTML5 Canvas 2D and WebAssembly.
                            </p>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-workstation-850 border border-slate-200 dark:border-workstation-800 space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                    <i className="fas fa-check text-emerald-500"></i>
                                    Zero cloud file uploads or disk storage
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                    <i className="fas fa-check text-emerald-500"></i>
                                    Works offline once the page assets load
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                    <i className="fas fa-check text-emerald-500"></i>
                                    Inspect via DevTools Network tab — 0 file POST requests
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setPrivacyModalOpen(false)}
                                className="btn-primary text-xs px-4 py-2"
                            >
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
