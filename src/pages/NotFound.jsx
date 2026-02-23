import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
export default function NotFound() {
    return (
        <>
            <SEO title="404 Not Found - IMG Tool" noIndex={true} />
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="max-w-lg text-center">
                    <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h1>
                    <p className="text-slate-500 text-lg mb-8">Oops! The page you're looking for doesn't exist or has been moved.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
                            <i className="fas fa-home"></i> Go to Home
                        </Link>
                        <Link to="/all-image-converters" className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-full hover:bg-slate-200 transition-all duration-300 inline-flex items-center justify-center gap-2">
                            <i className="fas fa-th-large"></i> Browse All Tools
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
