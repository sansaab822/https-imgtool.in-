import React from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const popularTools = [
    { href: '/batch-watermark-images', label: 'Batch Image Watermark Studio' },
    { href: '/government-photo-resizer', label: 'Govt & Exam Photo Resizer (20–50KB)' },
    { href: '/signature-to-transparent-png', label: 'Signature to Transparent PNG' },
    { href: '/passport-size-photo', label: 'Passport Size Photo Maker (A4 Print)' },
    { href: '/pan-card-photo', label: 'PAN Card Photo & Sign (213×213px)' },
    { href: '/split-pdf', label: 'Split PDF & Extract Pages' },
    { href: '/pdf-crop', label: 'PDF Margin Cropper' },
    { href: '/image-dpi-converter', label: 'Lossless 300/600 DPI Converter' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-slate-900 dark:bg-workstation-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 dark:border-workstation-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 group select-none" aria-label="imgtool.in home">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                                <i className="fas fa-layer-group text-xs" aria-hidden="true"></i>
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-white">
                                img<span className="text-blue-500">tool</span>
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            A privacy-engineered digital workstation for images, documents, and PDFs. All processing runs 100% locally in your browser RAM with zero server uploads and zero cloud disk retention.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 dark:bg-workstation-900 border border-slate-700/60 dark:border-workstation-750 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Client-Side Engine Active</span>
                        </div>
                    </div>

                    {/* Popular Tools */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                            <i className="fas fa-fire text-amber-500 text-xs"></i>
                            Popular Workstations
                        </h4>
                        <ul className="space-y-2 text-xs">
                            {popularTools.map(({ href, label }) => (
                                <li key={href}>
                                    <Link to={href} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                        <span className="truncate">{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Technical Guides */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                            <i className="fas fa-book-open text-blue-500 text-xs"></i>
                            Technical Guides
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link to="/blog/how-to-watermark-multiple-images" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>Batch Watermarking Without Uploads</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/lossless-vs-lossy-compression-guide-2026" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>Lossless vs Lossy Compression Guide</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/image-dpi-vs-ppi-print-resolution-guide" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>Image DPI vs PPI Print Density</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/government-exam-photo-signature-specifications" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>Exam Photo & Signature Checklist</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/how-to-remove-exif-metadata-and-protect-privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>How to Strip EXIF GPS Metadata</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/split-and-extract-pdf-pages-guide" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <i className="fas fa-angle-right text-[10px] text-slate-600"></i>
                                    <span>Client-Side PDF Split Architecture</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                            <i className="fas fa-building text-blue-500 text-xs"></i>
                            Company
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
                            <li><Link to="/editorial-policy" className="hover:text-blue-400 transition-colors">Editorial Policy</Link></li>
                            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 dark:border-workstation-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>&copy; 2025 imgtool.in — Made in India by Sandeep Singh</p>
                    <div className="flex items-center gap-6">
                        <span className="text-slate-500">Fast · Private · Free</span>
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </footer>
    )
}
