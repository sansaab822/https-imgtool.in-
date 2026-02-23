import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
export default function BlogPage() {
    return (
        <>
            <SEO title="Blog - IMG Tool" description="IMG Tool blog — tips, tutorials, and updates about image conversion and editing." canonical="/blog" />
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-lg text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-rss text-3xl text-blue-600"></i>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Blog Coming Soon</h1>
                    <p className="text-slate-500 text-lg mb-8">We're working on tips, tutorials, and guides about image conversion, compression, and more. Check back soon!</p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        <i className="fas fa-home"></i> Back to Tools
                    </Link>
                </div>
            </div>
        </>
    )
}
