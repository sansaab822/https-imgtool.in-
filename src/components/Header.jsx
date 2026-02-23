import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const megaMenuItems = {
    editors: [
        { href: '/image-resizer', icon: 'fa-expand', label: 'Resize Image', color: 'blue' },
        { href: '/image-compressor', icon: 'fa-compress-alt', label: 'Compress Image', color: 'blue' },
        { href: '/crop-image', icon: 'fa-crop-alt', label: 'Crop Image', color: 'blue' },
        { href: '/image-to-art', icon: 'fa-palette', label: 'Art Generator', color: 'blue' },
    ],
    ai3d: [
        { href: '/bg-remover', icon: 'fa-eraser', label: 'BG Remover', color: 'purple' },
        { href: '/image-enhancer', icon: 'fa-magic', label: 'Image Enhancer', color: 'purple' },
        { href: '/3d-text-to-stl-generator', icon: 'fa-cube', label: '3D Text to STL', color: 'purple' },
        { href: '/passport-size-photo', icon: 'fa-id-card', label: 'Passport Photo', color: 'purple' },
    ],
    converters: [
        { href: '/heic-to-jpg', icon: 'fa-mobile-alt', label: 'HEIC to JPG', color: 'green' },
        { href: '/webp-to-jpg', icon: 'fa-file-code', label: 'WebP to JPG', color: 'green' },
        { href: '/png-to-jpg', icon: 'fa-image', label: 'PNG to JPG', color: 'green' },
        { href: '/avif-to-jpg', icon: 'fa-bolt', label: 'AVIF to JPG', color: 'green' },
    ],
    pdf: [
        { href: '/pdf-to-jpg', icon: 'fa-file-pdf', label: 'PDF to JPG', color: 'red' },
        { href: '/jpg-to-pdf', icon: 'fa-file-alt', label: 'JPG to PDF', color: 'red' },
        { href: '/pdf-crop', icon: 'fa-crop', label: 'PDF Crop', color: 'red' },
        { href: '/merge-pdf', icon: 'fa-object-group', label: 'Merge PDF', color: 'red' },
    ],
}

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setMobileOpen(false)
        setMobileToolsOpen(false)
    }, [location])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    return (
        <>
            <nav className={`fixed w-full z-[999] top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group relative z-50">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <i className="fas fa-layer-group"></i>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                IMG <span className="text-blue-600">Tool</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {/* Mega Menu */}
                            <div className="group px-3 py-2">
                                <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                                    Tools <i className="fas fa-chevron-down text-[10px] opacity-50 group-hover:rotate-180 transition-transform duration-300"></i>
                                </button>
                                <div className="fixed top-20 left-0 w-full opacity-0 invisible translate-y-2.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-[998] flex justify-center pointer-events-none group-hover:pointer-events-auto">
                                    <div className="mt-2 w-full max-w-5xl px-4 sm:px-6">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5 p-8 max-h-[80vh] overflow-y-auto">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                {/* Editors */}
                                                <MegaMenuCol title="Editors" icon="fa-crop-simple" iconColor="text-blue-500" items={megaMenuItems.editors} hoverColor="blue" />
                                                {/* AI & 3D */}
                                                <MegaMenuCol title="AI & 3D" icon="fa-wand-magic-sparkles" iconColor="text-purple-500" items={megaMenuItems.ai3d} hoverColor="purple" />
                                                {/* Converters */}
                                                <MegaMenuCol title="Converters" icon="fa-exchange-alt" iconColor="text-green-500" items={megaMenuItems.converters} hoverColor="green" />
                                                {/* PDF */}
                                                <MegaMenuCol title="PDF & Photo" icon="fa-file-pdf" iconColor="text-red-500" items={megaMenuItems.pdf} hoverColor="red" />
                                            </div>
                                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-8 -mb-8 p-4 px-8">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <i className="fas fa-check-circle text-green-500"></i> Free Forever
                                                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                                                    <i className="fas fa-shield-alt text-blue-500"></i> Secure Processing
                                                </div>
                                                <Link to="/all-image-converters" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/all">
                                                    View All 70+ Tools <i className="fas fa-arrow-right group-hover/all:translate-x-1 transition-transform"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <NavLink to="/blog" className={({ isActive }) => `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>Blog</NavLink>
                            <NavLink to="/about-us" className={({ isActive }) => `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>About</NavLink>
                            <NavLink to="/contact-us" className={({ isActive }) => `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>Contact</NavLink>
                        </div>

                        {/* CTA + Mobile Button */}
                        <div className="flex items-center gap-4">
                            <Link to="/all-image-converters" className="hidden lg:flex group relative px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                <span className="relative flex items-center gap-2">View All Tools <i className="fas fa-th-large text-xs"></i></span>
                            </Link>
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden relative z-50 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <i className="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[1000] lg:hidden flex flex-col h-full ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <span className="font-bold text-xl text-slate-800">Menu</span>
                    <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide pb-24">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors">
                        <i className="fas fa-home w-5 text-center"></i> Home
                    </Link>
                    {/* Mobile Tools Dropdown */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 text-slate-800 font-semibold hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3"><i className="fas fa-layer-group w-5 text-center text-blue-500"></i> Tools</div>
                            <i className={`fas fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${mobileToolsOpen ? 'rotate-180' : ''}`}></i>
                        </button>
                        {mobileToolsOpen && (
                            <div className="bg-white border-t border-slate-100 py-2">
                                <MobileMenuSection title="Editors" items={megaMenuItems.editors} />
                                <MobileMenuSection title="AI & 3D" items={megaMenuItems.ai3d} />
                                <MobileMenuSection title="Converters" items={megaMenuItems.converters} />
                                <MobileMenuSection title="PDF & Photo" items={megaMenuItems.pdf} />
                            </div>
                        )}
                    </div>
                    <Link to="/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors">
                        <i className="fas fa-rss w-5 text-center text-slate-400"></i> Blog
                    </Link>
                    <Link to="/about-us" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors">
                        <i className="fas fa-info-circle w-5 text-center text-slate-400"></i> About
                    </Link>
                    <Link to="/contact-us" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors">
                        <i className="fas fa-envelope w-5 text-center text-slate-400"></i> Contact
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <Link to="/all-image-converters" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
                            View All Tools <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {mobileOpen && (
                <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[998] lg:hidden" />
            )}

            {/* Spacer */}
            <div className="h-20"></div>
        </>
    )
}

function MegaMenuCol({ title, icon, iconColor, items, hoverColor }) {
    const hoverBg = `group-hover/link:bg-${hoverColor}-600`
    const hoverTxt = `group-hover/link:text-white`
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <i className={`fas ${icon} ${iconColor}`}></i> {title}
            </h4>
            <ul className="space-y-1">
                {items.map(item => (
                    <li key={item.href}>
                        <Link to={item.href} className={`group/link flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors`}>
                            <div className={`w-7 h-7 rounded-md bg-${hoverColor}-50 text-${hoverColor}-600 flex items-center justify-center text-xs ${hoverBg} ${hoverTxt} transition-all`}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <span className={`text-sm font-medium text-slate-600 group-hover/link:text-${hoverColor}-600`}>{item.label}</span>
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
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase bg-slate-50 mt-2">{title}</div>
            {items.map(item => (
                <Link key={item.href} to={item.href} className="block px-8 py-2 text-sm text-slate-600 hover:text-blue-600">
                    {item.label}
                </Link>
            ))}
        </>
    )
}
