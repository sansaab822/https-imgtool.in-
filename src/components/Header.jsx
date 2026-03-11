import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { tools } from '../data/toolsData'

// ── All tools flat list for search ───────────────────────────────────────────
const ALL_TOOLS = tools.map(t => ({ name: t.name, slug: t.slug, icon: t.icon, color: t.color, category: t.category }))

// ── Quick highlight matching text ─────────────────────────────────────────────
function highlight(text, query) {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-blue-100 text-blue-700 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    )
}

// ── Mega menu data ─────────────────────────────────────────────────────────────
const megaMenuItems = {
    editors: [
        { href: '/image-resizer', icon: 'fa-expand', label: 'Resize Image' },
        { href: '/image-compressor', icon: 'fa-compress-alt', label: 'Compress Image' },
        { href: '/crop-image', icon: 'fa-crop-alt', label: 'Crop Image' },
        { href: '/image-to-art', icon: 'fa-palette', label: 'Art Generator' },
    ],
    ai3d: [
        { href: '/bg-remover', icon: 'fa-eraser', label: 'BG Remover' },
        { href: '/image-enhancer', icon: 'fa-magic', label: 'Image Enhancer' },
        { href: '/3d-text-to-stl-generator', icon: 'fa-cube', label: '3D Text to STL' },
        { href: '/passport-size-photo', icon: 'fa-id-card', label: 'Passport Photo' },
        { href: '/pan-card-photo', icon: 'fa-id-card', label: 'PAN Card Photo' },
    ],
    converters: [
        { href: '/heic-to-jpg', icon: 'fa-mobile-alt', label: 'HEIC to JPG' },
        { href: '/webp-to-jpg', icon: 'fa-file-code', label: 'WebP to JPG' },
        { href: '/png-to-jpg', icon: 'fa-image', label: 'PNG to JPG' },
        { href: '/avif-to-jpg', icon: 'fa-bolt', label: 'AVIF to JPG' },
    ],
    pdf: [
        { href: '/pdf-to-jpg', icon: 'fa-file-pdf', label: 'PDF to JPG' },
        { href: '/jpg-to-pdf', icon: 'fa-file-alt', label: 'JPG to PDF' },
        { href: '/pdf-crop', icon: 'fa-crop', label: 'PDF Crop' },
        { href: '/merge-pdf', icon: 'fa-object-group', label: 'Merge PDF' },
        { href: '/pdf-to-excel', icon: 'fa-table', label: 'PDF to Excel' },
        { href: '/html-to-pdf', icon: 'fa-code', label: 'HTML to PDF' },
    ],
    video: [
        { href: '/video-compressor', icon: 'fa-compress-arrows-alt', label: 'Video Compressor' },
        { href: '/video-converter', icon: 'fa-exchange-alt', label: 'Video Converter' },
        { href: '/video-to-audio', icon: 'fa-music', label: 'Video to Audio' },
        { href: '/video-trimmer', icon: 'fa-cut', label: 'Video Trimmer' },
    ],
    utility: [
        { href: '/collage-maker', icon: 'fa-th', label: 'Collage Maker' },
        { href: '/favicon-generator', icon: 'fa-star', label: 'Favicon Generator' },
        { href: '/color-palette-generator', icon: 'fa-palette', label: 'Color Palette' },
        { href: '/qr-code-generator', icon: 'fa-qrcode', label: 'QR Generator' },
    ],
    imageEditing: [
        { href: '/combine-images-side-by-side', icon: 'fa-columns', label: 'Combine Images' },
        { href: '/add-watermark-to-image', icon: 'fa-copyright', label: 'Add Watermark' },
        { href: '/blend-two-photos', icon: 'fa-adjust', label: 'Blend Photos' },
        { href: '/rotate-image-custom-angle', icon: 'fa-sync-alt', label: 'Rotate Image' },
        { href: '/polaroid-photo-effect', icon: 'fa-camera-retro', label: 'Polaroid Effect' },
    ],
    funEffects: [
        { href: '/meme-generator', icon: 'fa-laugh-squint', label: 'Meme Generator' },
        { href: '/gif-maker', icon: 'fa-film', label: 'GIF Maker' },
        { href: '/lego-art-generator', icon: 'fa-th', label: 'Lego Art' },
        { href: '/emoji-mosaic', icon: 'fa-smile-beam', label: 'Emoji Mosaic' },
    ],
    ai: [
        { href: '/ai-denoiser', icon: 'fa-magic', label: 'AI Denoiser' },
        { href: '/ai-colorizer', icon: 'fa-palette', label: 'AI Colorizer' },
    ],
}

// ── Dark mode helpers ─────────────────────────────────────────────────────────
function getInitialDark() {
    try {
        const stored = localStorage.getItem('imgtool-theme')
        if (stored) return stored === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch { return false }
}
function applyDark(dark) {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('imgtool-theme', dark ? 'dark' : 'light') } catch { }
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(getInitialDark)

    // Search state
    const [query, setQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)

    const searchRef = useRef(null)
    const inputRef = useRef(null)
    const mobileInputRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    // Close everything on route change
    useEffect(() => {
        setMobileOpen(false)
        setMobileToolsOpen(false)
        setMobileSearchOpen(false)
        setQuery('')
        setSearchOpen(false)
    }, [location])

    // Dark mode on mount + change
    useEffect(() => { applyDark(darkMode) }, [darkMode])

    // Ctrl+K / Cmd+K shortcut
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
                setSearchOpen(true)
            }
            if (e.key === 'Escape') {
                setSearchOpen(false)
                setQuery('')
                inputRef.current?.blur()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    // Close search dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Filter results
    const results = query.trim().length > 0
        ? ALL_TOOLS.filter(t => t.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : []

    // Navigate to selected result
    const handleSelect = useCallback((slug) => {
        navigate('/' + slug)
        setQuery('')
        setSearchOpen(false)
        inputRef.current?.blur()
    }, [navigate])

    // Keyboard navigation in dropdown
    const handleKeyDown = (e) => {
        if (!results.length) return
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
        if (e.key === 'Enter' && results[activeIdx]) handleSelect(results[activeIdx].slug)
    }

    useEffect(() => { setActiveIdx(0) }, [query])

    return (
        <>
            {/* ── NAVBAR ─────────────────────────────────────────────────── */}
            <nav
                className="fixed w-full z-[1000] top-0 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-700/70"
                style={{ height: 60, boxShadow: '0 1px 12px 0 rgba(0,0,0,0.07)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-3">

                    {/* ── LEFT: Logo ─────────────────────────────────────── */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="IMG Tool Home">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect width="32" height="32" rx="8" fill="url(#lg1)" />
                            <rect x="6" y="6" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
                            <rect x="18" y="6" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                            <rect x="6" y="18" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
                            <rect x="18" y="18" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
                            <defs>
                                <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#2563EB" />
                                    <stop offset="1" stopColor="#7C3AED" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-[17px] font-black text-slate-800 dark:text-white tracking-tight leading-none">
                            IMG <span className="text-blue-600">Tool</span>
                        </span>
                    </Link>

                    {/* ── CENTER: Search Bar (desktop) ───────────────────── */}
                    <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative mx-2">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-slate-400">
                                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                            </div>
                            <input
                                ref={inputRef}
                                id="navbar-search"
                                type="text"
                                value={query}
                                onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
                                onFocus={() => setSearchOpen(true)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search 150+ image tools..."
                                aria-label="Search tools"
                                autoComplete="off"
                                className="w-full h-9 pl-9 pr-20 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                            />
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 pointer-events-none select-none">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>

                        {/* Search Dropdown */}
                        {searchOpen && results.length > 0 && (
                            <div
                                className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[2000]"
                                style={{ maxHeight: 340 }}
                            >
                                <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {results.length} result{results.length !== 1 ? 's' : ''}
                                </div>
                                <ul role="listbox">
                                    {results.map((tool, i) => (
                                        <li key={tool.slug} role="option" aria-selected={i === activeIdx}>
                                            <button
                                                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i === activeIdx ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                                onMouseDown={() => handleSelect(tool.slug)}
                                                onMouseEnter={() => setActiveIdx(i)}
                                            >
                                                <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0 bg-${tool.color || 'blue'}-50 text-${tool.color || 'blue'}-600`}>
                                                    <i className={`fas ${tool.icon || 'fa-image'}`}></i>
                                                </span>
                                                <span className="flex-1 font-medium truncate">{highlight(tool.name, query)}</span>
                                                <span className="text-[10px] text-slate-400 capitalize hidden sm:block">{tool.category?.replace(/-/g, ' ')}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400">↑↓ navigate · Enter select · Esc close</span>
                                    <Link
                                        to="/all-image-converters"
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                        View all tools →
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* No results */}
                        {searchOpen && query.trim().length > 1 && results.length === 0 && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 px-5 py-4 text-sm text-slate-500 text-center z-[2000]">
                                No tools found for "<strong>{query}</strong>"
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Desktop nav ─────────────────────────────── */}
                    <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                        {/* Tools mega-menu trigger */}
                        <div className="group relative px-3 py-1">
                            <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                                Tools <i className="fas fa-chevron-down text-[9px] opacity-50 group-hover:rotate-180 transition-transform duration-300"></i>
                            </button>
                            {/* Mega menu */}
                            <div className="fixed top-[60px] left-0 w-full opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-250 ease-out pointer-events-none group-hover:pointer-events-auto flex justify-center z-[999]">
                                <div className="mt-1 w-full max-w-5xl px-4">
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden ring-1 ring-black/5 p-7 max-h-[75vh] overflow-y-auto">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                            <MegaMenuCol title="Editors" icon="fa-crop-simple" iconColor="text-blue-500" items={megaMenuItems.editors} hoverColor="blue" />
                                            <MegaMenuCol title="Image Editing" icon="fa-images" iconColor="text-cyan-500" items={megaMenuItems.imageEditing} hoverColor="cyan" />
                                            <MegaMenuCol title="Fun Effects" icon="fa-masks-theater" iconColor="text-fuchsia-500" items={megaMenuItems.funEffects} hoverColor="fuchsia" />
                                            <MegaMenuCol title="AI Tools" icon="fa-brain" iconColor="text-rose-500" items={megaMenuItems.ai} hoverColor="rose" />
                                            <MegaMenuCol title="AI & 3D" icon="fa-wand-magic-sparkles" iconColor="text-purple-500" items={megaMenuItems.ai3d} hoverColor="purple" />
                                            <MegaMenuCol title="Converters" icon="fa-exchange-alt" iconColor="text-green-500" items={megaMenuItems.converters} hoverColor="green" />
                                            <MegaMenuCol title="PDF Tools" icon="fa-file-pdf" iconColor="text-red-500" items={megaMenuItems.pdf} hoverColor="red" />
                                            <MegaMenuCol title="Video Tools" icon="fa-video" iconColor="text-violet-500" items={megaMenuItems.video} hoverColor="violet" />
                                            <MegaMenuCol title="Utility Tools" icon="fa-tools" iconColor="text-teal-500" items={megaMenuItems.utility} hoverColor="teal" />
                                        </div>
                                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <span className="text-xs text-slate-400"><i className="fas fa-check-circle text-green-500 mr-1"></i>Free Forever</span>
                                            <Link to="/all-image-converters" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                View All 150+ Tools <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <NavLink to="/all-image-converters" className={({ isActive }) => `px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            All Tools
                        </NavLink>
                        <NavLink to="/blog" className={({ isActive }) => `px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            Blog
                        </NavLink>

                        {/* Dark mode toggle */}
                        <button
                            onClick={() => setDarkMode(d => !d)}
                            aria-label="Toggle dark mode"
                            className="ml-1 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            }
                        </button>
                    </div>

                    {/* ── RIGHT: Mobile icons ─────────────────────────────── */}
                    <div className="flex lg:hidden items-center gap-1 ml-auto flex-shrink-0">
                        {/* Mobile search icon */}
                        <button
                            onClick={() => { setMobileSearchOpen(s => !s); setTimeout(() => mobileInputRef.current?.focus(), 80) }}
                            aria-label="Open search"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>

                        {/* Dark mode (mobile) */}
                        <button
                            onClick={() => setDarkMode(d => !d)}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {darkMode
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            }
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Mobile expanding search bar ───────────────────────── */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-slate-400">
                                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                            </div>
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && results[0]) handleSelect(results[0].slug)
                                    if (e.key === 'Escape') { setMobileSearchOpen(false); setQuery('') }
                                }}
                                placeholder="Search 150+ image tools..."
                                className="w-full h-9 pl-9 pr-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                autoComplete="off"
                            />
                        </div>
                        {results.length > 0 && (
                            <ul className="mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-lg max-h-56 overflow-y-auto">
                                {results.map((tool, i) => (
                                    <li key={tool.slug}>
                                        <button
                                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                                            onMouseDown={() => { handleSelect(tool.slug); setMobileSearchOpen(false) }}
                                        >
                                            <span className={`w-6 h-6 rounded flex items-center justify-center text-[11px] bg-${tool.color || 'blue'}-50 text-${tool.color || 'blue'}-600`}>
                                                <i className={`fas ${tool.icon || 'fa-image'}`}></i>
                                            </span>
                                            <span className="font-medium">{highlight(tool.name, query)}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </nav>

            {/* ── MOBILE SIDEBAR ───────────────────────────────────────────── */}
            <div className={`fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-[1001] lg:hidden flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <span className="font-bold text-lg text-slate-800 dark:text-white">Menu</span>
                    <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1.5 pb-24">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors">
                        <i className="fas fa-home w-5 text-center text-slate-400"></i> Home
                    </Link>
                    {/* Mobile Tools Accordion */}
                    <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
                        <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3"><i className="fas fa-layer-group w-5 text-center text-blue-500"></i> Tools</div>
                            <i className={`fas fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${mobileToolsOpen ? 'rotate-180' : ''}`}></i>
                        </button>
                        {mobileToolsOpen && (
                            <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 py-1">
                                <MobileMenuSection title="Editors" items={megaMenuItems.editors} />
                                <MobileMenuSection title="Image Editing" items={megaMenuItems.imageEditing} />
                                <MobileMenuSection title="Fun Effects" items={megaMenuItems.funEffects} />
                                <MobileMenuSection title="AI Tools" items={megaMenuItems.ai} />
                                <MobileMenuSection title="AI & 3D" items={megaMenuItems.ai3d} />
                                <MobileMenuSection title="Converters" items={megaMenuItems.converters} />
                                <MobileMenuSection title="PDF Tools" items={megaMenuItems.pdf} />
                                <MobileMenuSection title="Video & Utility" items={[...megaMenuItems.video, ...megaMenuItems.utility]} />
                            </div>
                        )}
                    </div>
                    <Link to="/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors">
                        <i className="fas fa-rss w-5 text-center text-slate-400"></i> Blog
                    </Link>
                    <Link to="/about-us" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors">
                        <i className="fas fa-info-circle w-5 text-center text-slate-400"></i> About
                    </Link>
                    <Link to="/contact-us" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors">
                        <i className="fas fa-envelope w-5 text-center text-slate-400"></i> Contact
                    </Link>
                    <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-700">
                        <Link to="/all-image-converters" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
                            View All Tools <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {mobileOpen && (
                <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] lg:hidden" />
            )}

            {/* Spacer (60px to match navbar height) */}
            <div className="h-[60px]"></div>
        </>
    )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function MegaMenuCol({ title, icon, iconColor, items, hoverColor }) {
    return (
        <div className="space-y-3">
            <h4 className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2`}>
                <i className={`fas ${icon} ${iconColor}`}></i> {title}
            </h4>
            <ul className="space-y-0.5">
                {items.map(item => (
                    <li key={item.href}>
                        <Link to={item.href} className={`flex items-center gap-2.5 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/link`}>
                            <div className={`w-6 h-6 rounded-md bg-${hoverColor}-50 text-${hoverColor}-600 flex items-center justify-center text-[11px] group-hover/link:bg-${hoverColor}-600 group-hover/link:text-white transition-all flex-shrink-0`}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <span className={`text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover/link:text-${hoverColor}-600 leading-tight`}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function MobileMenuSection({ title, items }) {
    return (
        <>
            <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 mt-1">{title}</div>
            {items.map(item => (
                <Link key={item.href} to={item.href} className="block px-7 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                    {item.label}
                </Link>
            ))}
        </>
    )
}
