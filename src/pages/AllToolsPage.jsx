import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { tools, categories } from '../data/toolsData'

const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    green: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
    red: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
    pink: 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white',
    cyan: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white',
    yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white',
    violet: 'bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white',
    slate: 'bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white',
}

export default function AllToolsPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = tools.filter(t => {
        const matchesCat = activeCategory === 'all' || t.category === activeCategory
        const q = search.toLowerCase()
        const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
        return matchesCat && matchesSearch
    })

    return (
        <>
            <SEO
                title="All Image & PDF Tools - IMG Tool"
                description="Browse all 70+ free online image and PDF tools. Convert, compress, resize, crop, and edit images in your browser."
                canonical="/all-image-converters"
            />
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">All Image &amp; PDF Tools</h1>
                    <p className="text-blue-200 text-lg mb-8">70+ free tools, all processing happens in your browser</p>
                    <div className="max-w-lg mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-slate-400"></i>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search tools..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-600 bg-white/10 backdrop-blur text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
                    >
                        All Tools <span className="ml-1 text-xs opacity-70">({tools.length})</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
                        >
                            {cat.name} <span className="ml-1 text-xs opacity-70">({tools.filter(t => t.category === cat.id).length})</span>
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-slate-500 text-lg">No tools found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(tool => (
                            <Link key={tool.slug} to={`/${tool.slug}`} className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-colors ${colorMap[tool.color] || colorMap.blue}`}>
                                    <i className={`fas ${tool.icon || 'fa-tools'}`}></i>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{tool.name}</div>
                                    {tool.description && <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tool.description}</div>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
