import { Link } from 'react-router-dom'

const popularTools = [
    { href: '/avif-to-jpg', label: 'AVIF to JPG' },
    { href: '/heic-to-jpg', label: 'HEIC to JPG' },
    { href: '/bg-remover', label: 'Background Remover' },
    { href: '/image-compressor', label: 'Image Compressor' },
    { href: '/image-resizer', label: 'Image Resizer' },
    { href: '/pdf-to-jpg', label: 'PDF to JPG' },
]

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-indigo-900/20">
                                <i className="fas fa-layer-group" aria-hidden="true"></i>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                IMG <span className="text-indigo-400">Tool</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            IMG Tool is a free online tools platform designed to help users convert, compress, crop, and optimize images and PDFs easily — no software needed.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://t.me/sarkarijobinformation24" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0088cc] flex items-center justify-center text-white transition-all duration-300" aria-label="Telegram">
                                <i className="fab fa-telegram-plane"></i>
                            </a>
                            <a href="https://www.whatsapp.com/channel/0029Val8zQqAInPpcE5vrY2b" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#25D366] flex items-center justify-center text-white transition-all duration-300" aria-label="WhatsApp">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Popular Tools */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Popular Tools
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {popularTools.map(({ href, label }) => (
                                <li key={href}>
                                    <Link to={href} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                                        <i className="fas fa-chevron-right text-xs text-slate-600"></i> {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Resources
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/blog" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><i className="fas fa-book text-xs text-slate-600"></i> Latest Blog Posts</Link></li>
                            <li><Link to="/all-image-converters" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><i className="fas fa-th text-xs text-slate-600"></i> All Tools List</Link></li>
                            <li><a href="/sitemap.xml" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><i className="fas fa-sitemap text-xs text-slate-600"></i> Sitemap</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Company
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about-us" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact-us" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-800 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
                        <p>&copy; {year} imgtool.in. All rights reserved.</p>
                        <p className="flex items-center gap-2">
                            Made with <i className="fas fa-heart text-red-500 animate-pulse" aria-hidden="true"></i> for Creators
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
