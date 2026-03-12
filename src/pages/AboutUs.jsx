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
                        <p className="text-slate-600 leading-relaxed">Hi, I am Sanjeev, the solo developer behind IMG Tool. I built this platform because I was tired of "free" image converters that hit you with hidden paywalls, flooded your screen with intrusive popups, or forced you to upload private ID documents to unknown cloud servers just to shrink a photo by a few kilobytes. IMG Tool started as a small personal project to resize my own exam photos, and it has now grown into a comprehensive suite of 150+ dedicated image and PDF utilities.</p>
                        <p className="text-slate-600 leading-relaxed mt-4">Every tool on this website—from image compressors to format converters—operates <strong>100% locally in your browser</strong> using HTML5 Canvas and WebAssembly. Your files never leave your device, guaranteeing absolute privacy and zero upload wait times.</p>
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
                        <p className="text-slate-600 leading-relaxed">Our mission is straightforward: to provide the fastest, most reliable, and secure online image utilities completely free of charge. Whether you are a student resizing a signature for a government form, a photographer converting RAW files to JPG, or a web developer optimizing WebP assets, IMG Tool provides a streamlined, no-nonsense interface to get the job done instantly.</p>
                        <p className="text-slate-600 leading-relaxed mt-4">Currently featuring over 150+ distinct tools, we remain committed to a subscription-free model. Enjoy seamless compression and editing, entirely private and lightning fast.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
