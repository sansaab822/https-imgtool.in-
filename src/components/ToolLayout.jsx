import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tools } from '../data/toolsData'
import { lightweightContentData } from '../data/lightweightContentData'
import Badge from './ui/Badge'

// Slugs that carry their own inline rich editorial content block
const CUSTOM_CONTENT_SLUGS = [
    'batch-watermark-images',
    'image-resizer',
    'image-compressor',
    'crop-image',
    'bg-remover',
    'image-enhancer',
    'signature-to-transparent-png',
    'split-pdf',
    'government-photo-resizer',
    'image-dpi-converter',
    'image-metadata-viewer',
    'passport-size-photo',
    'pan-card-photo',
    'aadhaar-card-print-setting-a4',
    'pdf-crop'
]

export default function ToolLayout({ children, toolSlug, title, description, breadcrumb }) {
    const [faqOpen, setFaqOpen] = useState(null)
    const tool = toolSlug ? tools.find(t => t.slug === toolSlug) : null
    
    // Find related tools within the same category
    const relatedTools = tool
        ? tools.filter(t => t.slug !== toolSlug && (t.category === tool.category)).slice(0, 6)
        : []

    const fallbackContent = toolSlug && lightweightContentData[toolSlug] && !CUSTOM_CONTENT_SLUGS.includes(toolSlug)
        ? lightweightContentData[toolSlug]
        : null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-workstation-950 transition-colors">
            {/* ── COMPACT WORKSTATION SUB-HEADER ───────────────────────────── */}
            <div className="border-b border-slate-200/80 dark:border-workstation-750 bg-white dark:bg-workstation-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Breadcrumbs & Title summary */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-workstation-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-colors text-xs"
                                aria-label="Return to Homepage"
                                title="Back to Home"
                            >
                                <i className="fas fa-chevron-left" aria-hidden="true"></i>
                            </Link>

                            {tool && (
                                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm flex-shrink-0 border border-blue-100 dark:border-blue-900/30">
                                    <i className={`fas ${tool.icon || 'fa-wrench'}`}></i>
                                </div>
                            )}

                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-2">
                                    {title}
                                    <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="Operational"></span>
                                </h1>
                                {description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xl">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Privacy & Engine Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="emerald" icon="fa-shield-halved" size="sm">
                                100% In-Browser RAM
                            </Badge>
                            <Badge variant="primary" icon="fa-bolt" size="sm">
                                Instant Client-Side
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN WORKSTATION WORKSPACE ─────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Tool interactive area (Canvas, Dropzone, Controls) */}
                <div className="mb-12">
                    {children}
                </div>

                {/* ── AUTO-INJECTED FALLBACK CONTENT FOR SIMPLE CONVERTERS ──── */}
                {fallbackContent && (
                    <div className="mt-12 bg-white dark:bg-workstation-900 rounded-2xl border border-slate-200 dark:border-workstation-750 p-6 sm:p-8 shadow-sm">
                        <div className="max-w-4xl mx-auto space-y-6 text-slate-600 dark:text-slate-300">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {fallbackContent.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {fallbackContent.whatItDoes}
                                </p>
                            </div>

                            {fallbackContent.whenToUse && (
                                <div className="border-t border-slate-100 dark:border-workstation-800 pt-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                                        When to Use This Tool
                                    </h3>
                                    <p className="text-sm leading-relaxed">
                                        {fallbackContent.whenToUse}
                                    </p>
                                </div>
                            )}

                            {fallbackContent.howToUse && (
                                <div className="border-t border-slate-100 dark:border-workstation-800 pt-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                                        Step-by-Step Instructions
                                    </h3>
                                    <p className="text-sm leading-relaxed">
                                        {fallbackContent.howToUse}
                                    </p>
                                </div>
                            )}

                            {fallbackContent.tips && (
                                <div className="border-t border-slate-100 dark:border-workstation-800 pt-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                                        Practical Tips
                                    </h3>
                                    <p className="text-sm leading-relaxed">
                                        {fallbackContent.tips}
                                    </p>
                                </div>
                            )}

                            {fallbackContent.limitations && (
                                <div className="border-t border-slate-100 dark:border-workstation-800 pt-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                                        Limitations & Considerations
                                    </h3>
                                    <p className="text-sm leading-relaxed">
                                        {fallbackContent.limitations}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── RELATED WORKSTATIONS / TOOLS ─────────────────────────── */}
                {relatedTools.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-slate-200/80 dark:border-workstation-800" aria-labelledby="related-tools-title">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 id="related-tools-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <i className="fas fa-layer-group text-blue-500 text-sm"></i>
                                    Related Workstation Utilities
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Complementary client-side tools in the same category.
                                </p>
                            </div>
                            <Link
                                to="/all-image-converters"
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                All 30+ Tools →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedTools.map((t) => (
                                <Link
                                    key={t.slug}
                                    to={`/${t.slug}`}
                                    className="p-4 rounded-xl border border-slate-200 dark:border-workstation-800 bg-white dark:bg-workstation-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 group flex items-start gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <i className={`fas ${t.icon || 'fa-wrench'}`}></i>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {t.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                            {t.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}
