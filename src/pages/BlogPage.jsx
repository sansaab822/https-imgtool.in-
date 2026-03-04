import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { blogPosts } from '../data/blogData'

export default function BlogPage() {
    return (
        <>
            <SEO title="Blog - IMG Tool" description="IMG Tool blog — tips, tutorials, and guides about image conversion, PDF editing, and optimization." canonical="/blog" />

            <div className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
                            <i className="fas fa-rss"></i>
                            Official Blog
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-6">
                            Tips, Tutorials & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Guides</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed">
                            Discover the best ways to optimize your images, compress files, and manage PDFs securely in your browser.
                        </p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3">
                                        <span className="flex items-center gap-1.5"><i className="far fa-calendar-alt"></i> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><i className="far fa-user"></i> {post.author}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-500 line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700 mt-auto">
                                        Read Article <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}
