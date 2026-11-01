import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white',
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white',
    green: 'bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white',
    orange: 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 hover:bg-orange-600 hover:text-white',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white',
    red: 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white',
    pink: 'bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 hover:bg-pink-600 hover:text-white',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-600 hover:text-white',
    teal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-600 hover:text-white',
}

export default function AllToolsPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')

    const cleanTools = tools.filter(t => t.slug !== 'all-image-converters')

    const filtered = cleanTools.filter(t => {
        const matchesCat = activeCategory === 'all' || t.category === activeCategory
        const q = search.toLowerCase()
        const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
        return matchesCat && matchesSearch
    })

    return (
        <>
            <SEO
                title="Curated Image & PDF Utilities Directory | ImgTool"
                description="Explore our curated suite of browser utilities: image compression, exam photo resizers, transparent signature extraction, DPI conversion, and PDF organizers."
                canonical="/all-image-converters"
            />
            <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-20 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
                        <i className="fas fa-shield-alt text-emerald-400"></i> Zero Cloud Uploads • 100% Client-Side RAM
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Curated Image &amp; PDF Utilities</h1>
                    <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                        Focused, privacy-conscious utilities engineered to solve real document, image formatting, and PDF problems.
                    </p>
                    <div className="max-w-lg mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-indigo-400"></i>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filter by keyword (e.g. compress, signature, pdf, dpi)..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 backdrop-blur text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300'}`}
                    >
                        All Utilities <span className="ml-1 text-xs opacity-75 font-mono">({cleanTools.length})</span>
                    </button>
                    {categories.map(cat => {
                        const count = cleanTools.filter(t => t.category === cat.id).length
                        if (count === 0) return null
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300'}`}
                            >
                                {cat.name} <span className="ml-1 text-xs opacity-75 font-mono">({count})</span>
                            </button>
                        )
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="text-6xl mb-4 opacity-50">🔍</div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No tools match your query. Try a broader search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                        {filtered.map(tool => (
                            <Link key={tool.slug} to={`/${tool.slug}`} className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg transition-all duration-200">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-colors ${colorMap[tool.color] || colorMap.blue}`}>
                                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">{tool.name}</div>
                                    {tool.description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{tool.description}</div>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
