import { Link } from 'react-router-dom'
import { tools } from '../data/toolsData'

const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    red: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
    pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    yellow: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white',
    teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white',
}

export default function ToolLayout({ children, toolSlug, title, description, breadcrumb }) {
    const tool = toolSlug ? tools.find(t => t.slug === toolSlug) : null
    const relatedTools = tool
        ? tools.filter(t => t.slug !== toolSlug && (t.from === tool.from || t.to === tool.to || t.category === tool.category)).slice(0, 8)
        : []

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <i className="fas fa-home text-xs"></i> Home
                        </Link>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <Link to="/all-image-converters" className="hover:text-blue-600 transition-colors">Tools</Link>
                        {breadcrumb && (
                            <>
                                <i className="fas fa-chevron-right text-xs"></i>
                                <span className="text-slate-700 font-medium">{breadcrumb}</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Tool Header */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    {tool && (
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colorMap[tool.color] || colorMap.blue} text-2xl mb-4 transition-colors`}>
                            <i className={`fas ${tool.icon}`}></i>
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">{title}</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">{description}</p>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                            <i className="fas fa-shield-alt"></i> No Upload — 100% Private
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                            <i className="fas fa-bolt"></i> Instant Processing
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full">
                            <i className="fas fa-check-circle"></i> Free Forever
                        </span>
                    </div>
                </div>
            </div>

            {/* Tool Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {children}
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
                <div className="bg-white border-t border-slate-200 py-12 mt-4">
                    <div className="max-w-5xl mx-auto px-4">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <i className="fas fa-th-large text-blue-500"></i> Related Tools
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedTools.map(t => (
                                <Link key={t.slug} to={`/${t.slug}`} className="group flex items-center gap-3 p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-colors ${colorMap[t.color] || colorMap.blue}`}>
                                        <i className={`fas ${t.icon}`}></i>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors leading-tight">{t.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
