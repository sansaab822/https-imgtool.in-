import SEO from '../components/SEO'

export default function AboutUs() {
    return (
        <>
            <SEO title="About Us - IMG Tool" description="Learn about IMG Tool — your free, privacy-first online image conversion platform." canonical="/about-us" />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4">About IMG Tool</h1>
                    <p className="text-slate-500 text-lg">Free, fast, and private image tools — built for everyone.</p>
                </div>
                <div className="prose prose-slate max-w-none space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                            <i className="fas fa-layer-group text-blue-600"></i> Who We Are
                        </h2>
                        <p className="text-slate-600 leading-relaxed">IMG Tool is a free online platform that provides powerful image and PDF conversion tools. We believe that professional-grade image editing tools should be accessible to everyone — without subscriptions, logins, or complicated software.</p>
                        <p className="text-slate-600 leading-relaxed mt-4">Our tools process everything <strong>locally in your browser</strong>. This means your files never leave your device — ensuring 100% privacy and security.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: 'fa-shield-alt', color: 'text-indigo-600', bg: 'bg-indigo-50', title: 'Privacy First', desc: 'All processing happens on your device. We never see your files.' },
                            { icon: 'fa-bolt', color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Lightning Fast', desc: 'No server round-trips. Instantaneous results powered by your hardware.' },
                            { icon: 'fa-heart', color: 'text-red-500', bg: 'bg-red-50', title: 'Free Forever', desc: 'No subscriptions, no watermarks, no limits. Always 100% free.' },
                        ].map(f => (
                            <div key={f.title} className={`${f.bg} rounded-2xl p-6 text-center`}>
                                <div className={`${f.color} text-4xl mb-3`}><i className={`fas ${f.icon}`}></i></div>
                                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-slate-600 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">We built IMG Tool to solve a simple problem: the best image conversion tools online either cost money, require sign-ups, or upload your private files to external servers. We believe in a better way — one that respects your privacy and your time.</p>
                        <p className="text-slate-600 leading-relaxed mt-4">Our platform supports 70+ conversion formats and editing tools, all running directly in your browser using modern Web APIs like Canvas, WebAssembly, and File APIs.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
