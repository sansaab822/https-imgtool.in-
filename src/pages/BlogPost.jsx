import { useParams, Link, Navigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { getPostBySlug, blogPosts } from '../data/blogData'
import { useEffect } from 'react'

export default function BlogPost() {
    const { slug } = useParams()
    const post = getPostBySlug(slug)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    if (!post) {
        return <Navigate to="/404" replace />
    }

    const { title, date, author, content, seoDescription } = post

    // Structured data for Google
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: seoDescription,
        author: {
            '@type': 'Person',
            name: author
        },
        datePublished: date,
        publisher: {
            '@type': 'Organization',
            name: 'IMG Tool',
            logo: {
                '@type': 'ImageObject',
                url: 'https://imgtool.in/favicon.svg'
            }
        }
    }

    // Get suggestions (other latest posts excluding current)
    const suggestions = blogPosts.filter(p => p.id !== post.id).slice(0, 3)

    return (
        <div className="bg-slate-50 min-h-screen">
            <SEO
                title={title}
                description={seoDescription}
                canonical={`/blog/${slug}`}
                schema={schema}
            />

            {/* Post Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mb-6 transition-colors">
                        <i className="fas fa-arrow-left"></i> Back to Blog
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-6 tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-2">
                            <i className="far fa-calendar-alt text-blue-500"></i> {date}
                        </span>
                        <span className="flex items-center gap-2">
                            <i className="far fa-user text-blue-500"></i> {author}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
                    <article
                        className="prose prose-lg prose-blue max-w-none text-slate-600 prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>

                {/* Author Card (Bottom) */}
                <div className="mt-12 bg-white rounded-2xl border border-blue-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                        <i className="fas fa-layer-group"></i>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{author}</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            The IMG Tool team builds 100% free, private, browser-based tools to help you convert, optimize, and manage your images and PDFs without relying on sketchy cloud uploads.
                        </p>
                    </div>
                </div>
            </div>

            {/* Read More Section */}
            {suggestions.length > 0 && (
                <div className="border-t border-slate-200 bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center sm:text-left flex items-center justify-center sm:justify-start gap-3">
                            <i className="fas fa-book-open text-blue-600"></i> Keep Reading
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {suggestions.map((p) => (
                                <Link to={`/blog/${p.slug}`} key={p.id} className="group flex flex-col bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <div className="text-xs font-semibold text-blue-600 mb-3">{p.date}</div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 line-clamp-2">{p.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 flex-1">{p.excerpt}</p>
                                    <div className="mt-4 text-sm font-semibold text-blue-600 flex items-center mt-auto">
                                        Read <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
