import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { tools } from '../data/toolsData'

function HighlightMatch({ text, query }) {
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

// ── Mega menu data (Curated 2026 Quality Catalog) ─────────────────────────────
const megaMenuItems = {
    editors: [
        { href: '/image-resizer', icon: 'fa-expand', label: 'Resize Image' },
        { href: '/image-compressor', icon: 'fa-compress-arrows-alt', label: 'Compress Image' },
        { href: '/crop-image', icon: 'fa-crop', label: 'Crop Image' },
        { href: '/bg-remover', icon: 'fa-eraser', label: 'Background Remover' },
        { href: '/image-enhancer', icon: 'fa-sliders-h', label: 'Image Enhancer' },
    ],
    documents: [
        { href: '/passport-size-photo', icon: 'fa-id-card', label: 'Passport Photo Maker' },
        { href: '/pan-card-photo', icon: 'fa-id-card', label: 'PAN Card Photo' },
        { href: '/aadhaar-card-print-setting-a4', icon: 'fa-print', label: 'Aadhaar Print A4' },
        { href: '/signature-to-transparent-png', icon: 'fa-file-signature', label: 'Signature to PNG' },
        { href: '/signature-resize-140x60', icon: 'fa-signature', label: 'Signature 140×60' },
        { href: '/government-photo-resizer', icon: 'fa-graduation-cap', label: 'Govt Exam Resizer' },
    ],
    pdf: [
        { href: '/merge-pdf', icon: 'fa-object-group', label: 'Merge PDF' },
        { href: '/split-pdf', icon: 'fa-scissors', label: 'Split & Delete PDF' },
        { href: '/pdf-crop', icon: 'fa-crop', label: 'PDF Crop' },
        { href: '/pdf-to-jpg', icon: 'fa-file-pdf', label: 'PDF to JPG' },
        { href: '/jpg-to-pdf', icon: 'fa-file-alt', label: 'Images to PDF' },
        { href: '/pdf-password-remover', icon: 'fa-unlock', label: 'Unlock PDF' },
    ],
    utilities: [
        { href: '/image-dpi-converter', icon: 'fa-print', label: '300 DPI Converter' },
        { href: '/image-metadata-viewer', icon: 'fa-info-circle', label: 'EXIF & Metadata Stripper' },
        { href: '/favicon-generator', icon: 'fa-star', label: 'Favicon Generator' },
        { href: '/color-palette-generator', icon: 'fa-palette', label: 'Color Palette Extractor' },
        { href: '/qr-code-generator', icon: 'fa-qrcode', label: 'QR Code Generator' },
        { href: '/3d-text-to-stl-generator', icon: 'fa-cube', label: '3D Text to STL' },
    ],
    converters: [
        { href: '/image-converter', icon: 'fa-exchange-alt', label: 'Universal Converter' },
        { href: '/heic-to-jpg', icon: 'fa-mobile-alt', label: 'HEIC to JPG' },
        { href: '/webp-to-jpg', icon: 'fa-file-code', label: 'WebP to JPG' },
        { href: '/png-to-jpg', icon: 'fa-image', label: 'PNG to JPG' },
        { href: '/jpg-to-png', icon: 'fa-image', label: 'JPG to PNG' },
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

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [desktopToolsOpen, setDesktopToolsOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(getInitialDark)
    const [query, setQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const searchRef = useRef(null)
    const megaMenuRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        applyDark(darkMode)
    }, [darkMode])

    // Close on outer click
    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchFocused(false)
            }
            if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
                setDesktopToolsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Filter tools for instant search
    const filteredTools = query.trim()
        ? tools.filter(
            t => t.name.toLowerCase().includes(query.toLowerCase()) ||
                t.description.toLowerCase().includes(query.toLowerCase()) ||
                t.slug.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : []

    const handleSelectTool = (slug) => {
        setQuery('')
        setSearchFocused(false)
        setMobileOpen(false)
        setMobileSearchOpen(false)
        setDesktopToolsOpen(false)
        navigate(`/${slug}`)
    }

    const MegaMenuCol = ({ title, icon, iconColor, items }) => (
        <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <i className={`fas ${icon} ${iconColor} text-sm`}></i>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{title}</span>
            </div>
            <ul className="space-y-1">
                {items.map(item => (
                    <li key={item.href}>
                        <Link
                            to={item.href}
                            onClick={() => setDesktopToolsOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <i className={`fas ${item.icon} text-slate-400 text-[11px] w-4 text-center`}></i>
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

    const MobileMenuSection = ({ title, items }) => (
        <div className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
            {items.map(item => (
                <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                >
                    <i className={`fas ${item.icon} w-4 text-center text-slate-400 text-xs`}></i>
                    <span>{item.label}</span>
                </Link>
            ))}
        </div>
    )

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* ── LEFT: Logo & Privacy Tagline ── */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    imgtool<span className="text-blue-600">.in</span>
                                </span>
                                <span className="hidden sm:block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                                    Private Web Utilities
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* ── CENTER: Quick Instant Search ── */}
                    <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-2">
                        <div className="relative">
                            <i className="fas fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={query}
                                onChange={e => { setQuery(e.target.value); setSearchFocused(true) }}
                                onFocus={() => setSearchFocused(true)}
                                placeholder="Search 35+ tools (e.g. passport, crop, compress, 300 dpi)..."
                                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            )}
                        </div>

                        {/* Search Dropdown Results */}
                        {searchFocused && filteredTools.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 p-2">
                                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matching Tools</p>
                                <div className="space-y-1 max-h-72 overflow-y-auto">
                                    {filteredTools.map(t => (
                                        <button
                                            key={t.slug}
                                            onClick={() => handleSelectTool(t.slug)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                                                <i className={`fas ${t.icon}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                                                    <HighlightMatch text={t.name} query={query} />
                                                </p>
                                                <p className="text-[10px] text-slate-400 truncate">{t.description}</p>
                                            </div>
                                            <i className="fas fa-arrow-right text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Navigation & Actions ── */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Tools Mega-Menu Trigger */}
                        <div ref={megaMenuRef} className="hidden lg:block relative">
                            <button
                                onClick={() => setDesktopToolsOpen(!desktopToolsOpen)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                                    desktopToolsOpen
                                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <i className="fas fa-layer-group text-blue-500"></i>
                                <span>Tools Catalog</span>
                                <i className={`fas fa-chevron-down text-[9px] opacity-60 transition-transform duration-200 ${desktopToolsOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Desktop Mega Menu Panel */}
                            {desktopToolsOpen && (
                                <div className="fixed top-16 left-0 w-full flex justify-center z-50 p-4">
                                    <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 max-h-[80vh] overflow-y-auto animate-fade-in">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                            <MegaMenuCol title="Core Editors" icon="fa-wand-magic-sparkles" iconColor="text-blue-500" items={megaMenuItems.editors} />
                                            <MegaMenuCol title="ID & Documents" icon="fa-id-card" iconColor="text-teal-500" items={megaMenuItems.documents} />
                                            <MegaMenuCol title="PDF Suite" icon="fa-file-pdf" iconColor="text-red-500" items={megaMenuItems.pdf} />
                                            <MegaMenuCol title="Utilities & 3D" icon="fa-tools" iconColor="text-indigo-500" items={megaMenuItems.utilities} />
                                            <MegaMenuCol title="Converters" icon="fa-exchange-alt" iconColor="text-orange-500" items={megaMenuItems.converters} />
                                        </div>

                                        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center gap-4">
                                                <span><i className="fas fa-shield-halved text-emerald-500 mr-1.5"></i>100% In-Browser Memory Processing</span>
                                                <span>•</span>
                                                <span><i className="fas fa-ban text-red-500 mr-1.5"></i>No Cloud Uploads or Logs</span>
                                            </div>
                                            <Link
                                                to="/all-image-converters"
                                                onClick={() => setDesktopToolsOpen(false)}
                                                className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                                            >
                                                <span>Explore All Verified Tools</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top Nav Links */}
                        <NavLink
                            to="/all-image-converters"
                            className={({ isActive }) => `hidden sm:block px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
                            }`}
                        >
                            All Tools
                        </NavLink>

                        <NavLink
                            to="/blog"
                            className={({ isActive }) => `hidden sm:block px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
                            }`}
                        >
                            Articles
                        </NavLink>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label="Toggle theme"
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <i className={`fas ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'}`}></i>
                        </button>

                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            aria-label="Search"
                            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <i className="fas fa-magnifying-glass"></i>
                        </button>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation menu"
                            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <i className={`fas ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>
                    </div>

                </div>

                {/* Mobile Search Input Drawer */}
                {mobileSearchOpen && (
                    <div className="md:hidden pb-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <i className="fas fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search 35+ tools..."
                                autoFocus
                                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl border border-transparent focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {query && filteredTools.length > 0 && (
                            <div className="mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 max-h-60 overflow-y-auto">
                                {filteredTools.map(t => (
                                    <button
                                        key={t.slug}
                                        onClick={() => handleSelectTool(t.slug)}
                                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                                    >
                                        <i className={`fas ${t.icon} text-blue-500 text-xs w-4`}></i>
                                        <span className="truncate">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl max-h-[85vh] overflow-y-auto p-4 space-y-4">
                    {/* Mobile Tools Accordion */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                            className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 font-bold text-xs text-slate-800 dark:text-slate-200"
                        >
                            <span className="flex items-center gap-2"><i className="fas fa-layer-group text-blue-500"></i> All Tools by Category</span>
                            <i className={`fas fa-chevron-down text-[10px] transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`}></i>
                        </button>
                        {mobileToolsOpen && (
                            <div className="p-2 space-y-2">
                                <MobileMenuSection title="Core Editors" items={megaMenuItems.editors} />
                                <MobileMenuSection title="ID & Documents" items={megaMenuItems.documents} />
                                <MobileMenuSection title="PDF Suite" items={megaMenuItems.pdf} />
                                <MobileMenuSection title="Utilities & 3D" items={megaMenuItems.utilities} />
                                <MobileMenuSection title="Converters" items={megaMenuItems.converters} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <Link to="/all-image-converters" onClick={() => setMobileOpen(false)} className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl text-center">
                            All Tools
                        </Link>
                        <Link to="/blog" onClick={() => setMobileOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-center">
                            Editorial Guides
                        </Link>
                        <Link to="/about-us" onClick={() => setMobileOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-center">
                            About Us
                        </Link>
                        <Link to="/contact-us" onClick={() => setMobileOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-center">
                            Contact
                        </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                        100% Client-Side Privacy • Zero Server File Logs
                    </div>
                </div>
            )}
        </header>
    )
}
