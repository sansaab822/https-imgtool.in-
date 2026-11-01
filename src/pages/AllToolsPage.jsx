import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    green: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
    red: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
    pink: 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white',
    cyan: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white',
    yellow: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white',
    slate: 'bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white',
}

export default function AllToolsPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = tools.filter((t) => {
        const matchesCat = activeCategory === 'all' || t.category === activeCategory
        const q = search.toLowerCase().trim()
        const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
        return matchesCat && matchesSearch
    })

    return (
        <>
            <SEO
                title="All Verified Tools - IMG Tool Directory"
                description={`Browse our curated collection of ${tools.length} verified in-browser image and PDF tools. Fast, private processing with zero cloud uploads.`}
                canonical="/all-image-converters"
            />
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16 md:py-20 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold mb-4">
                        <i className="fas fa-shield-halved text-emerald-400"></i>
                        <span>Curated &amp; Verified Browser Utilities</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Complete Tools Directory</h1>
                    <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
                        {tools.length} focused utilities to crop, compress, format, and edit documents without uploading your files to a server.
                    </p>
                    <div className="max-w-lg mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <i className="fas fa-search"></i>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter tools by task or format..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 backdrop-blur text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'all'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                        }`}
                    >
                        All Tools <span className="ml-1 opacity-75">({tools.length})</span>
                    </button>
                    {categories.map((cat) => {
                        const count = tools.filter((t) => t.category === cat.id).length
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                {cat.name} <span className="ml-1 opacity-75">({count})</span>
                            </button>
                        )
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
                        <div className="text-4xl mb-3 text-slate-400">🔍</div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">No tools matched "{search}"</h3>
                        <p className="text-xs text-slate-500 mb-4">Try searching with a broader keyword or browse all categories.</p>
                        <button
                            onClick={() => setSearch('')}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm"
                        >
                            Reset Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((tool) => (
                            <Link
                                key={tool.slug}
                                to={`/${tool.slug}`}
                                className="group flex items-start gap-3.5 p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-colors ${colorMap[tool.color] || colorMap.blue}`}>
                                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                        {tool.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {tool.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
