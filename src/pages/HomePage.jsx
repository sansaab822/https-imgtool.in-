import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

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

const catIconMap = {
    'modern-formats': 'fa-bolt',
    'converters': 'fa-exchange-alt',
    'pdf-tools': 'fa-file-pdf',
    'editors': 'fa-wand-magic-sparkles',
    'special': 'fa-star',
}
const catColorMap = { 'modern-formats': 'text-yellow-500', 'converters': 'text-indigo-500', 'pdf-tools': 'text-red-500', 'editors': 'text-purple-500', 'special': 'text-orange-500' }

export default function HomePage() {
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) return null
        return tools.filter(t =>
            t.name.toLowerCase().includes(q) ||
            (t.description || '').toLowerCase().includes(q) ||
            (t.from || '').includes(q) ||
            (t.to || '').includes(q)
        )
    }, [search])

    return (
        <>
            <SEO
                title="IMG Tool - Free Online Image & PDF Tools (100% Secure)"
                description="All-in-one online image tools. Convert AVIF, HEIC, WebP, PNG, JPG, PDF and more. Resize, Crop, Compress, and Edit images in your browser. No upload needed."
                canonical="/"
            />

            {/* Hero */}
            <section className="relative bg-white border-b border-slate-200 pt-20 pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #e0e7ff 2px, transparent 0)', backgroundSize: '50px 50px' }}></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                        100% Free &amp; Secure • Client-Side Processing
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Your All-in-One <br /><span className="gradient-text">Image Toolkit</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                        Convert, Resize, Compress, and Edit images instantly. <br className="hidden md:block" />
                        We support AVIF, HEIC, WebP, PDF, and 50+ other formats.
                    </p>
                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-slate-400 text-lg"></i>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none shadow-lg text-lg transition-all"
                            placeholder="Search tools (e.g. 'avif to jpg' or 'resize')..."
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

            {/* Tools Grid */}
            <main className="container mx-auto px-4 py-16">
                {filtered !== null ? (
                    // Search Results
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Search Results</h2>
                        {filtered.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-slate-500 text-lg">No tools found for "<strong>{search}</strong>"</p>
                                <p className="text-slate-400 mt-2">Try searching for a format like "jpg" or a feature like "compress".</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                            </div>
                        )}
                    </div>
                ) : (
                    // Category View
                    categories.map(cat => {
                        const catTools = tools.filter(t => t.category === cat.id)
                        if (!catTools.length) return null
                        return (
                            <div key={cat.id} className="mb-16">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                    <i className={`fas ${catIconMap[cat.id] || 'fa-tools'} ${catColorMap[cat.id] || 'text-blue-500'} mr-3`}></i>
                                    {cat.name}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                                </div>
                            </div>
                        )
                    })
                )}
            </main>

            {/* Why Choose Section */}
            <section className="bg-white border-t border-slate-200 py-16">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-10">Why Choose IMG Tool?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { icon: 'fa-shield-alt', color: 'text-indigo-600', title: 'Privacy First', desc: 'We process images in your browser. Your files are never uploaded to our servers.' },
                            { icon: 'fa-bolt', color: 'text-yellow-500', title: 'Lightning Fast', desc: 'No waiting for uploads or downloads. Instant conversion powered by your device.' },
                            { icon: 'fa-check-circle', color: 'text-green-500', title: 'High Quality', desc: 'We use advanced algorithms to ensure the best balance between file size and quality.' },
                        ].map(f => (
                            <div key={f.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className={`${f.color} text-3xl mb-3`}><i className={`fas ${f.icon}`}></i></div>
                                <h4 className="font-bold text-lg mb-2">{f.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function ToolCard({ tool }) {
    const c = colorMap[tool.color] || colorMap.blue
    return (
        <Link to={`/${tool.slug}`} className="tool-card bg-white p-5 rounded-xl border border-slate-200 block group">
            <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center text-lg mr-4 transition-colors duration-200 ${c.hover}`}>
                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                </div>
                <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
            </div>
            {tool.description && (
                <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
            )}
        </Link>
    )
}
