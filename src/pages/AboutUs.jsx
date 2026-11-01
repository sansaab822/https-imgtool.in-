import SEO from '../components/SEO'

export default function AboutUs() {
    return (
        <>
            <SEO 
                title="About Us - IMG Tool" 
                description="Learn about IMG Tool — high-performance, privacy-first image and PDF utilities that process everything locally in your browser." 
                canonical="/about-us" 
            />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">About IMG Tool</h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">Fast, reliable, and strictly private client-side utilities engineered for creators, job seekers, and developers.</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <i className="fas fa-layer-group text-blue-600"></i> Who We Are & Why IMG Tool Exists
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Hi, I am <strong>Sanjeev Kumar</strong>, the developer and editor behind IMG Tool. I created this platform out of frustration with conventional online converters that force users to upload private government IDs, signatures, and personal photos to remote cloud servers, gate essential features behind unexpected paywalls, or bombard users with intrusive popups.
                        </p>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            IMG Tool was engineered around a simple, uncompromising architectural principle: <strong>100% Client-Side In-Browser Execution</strong>. Using modern browser standards—including the HTML5 Canvas API, WebAssembly, <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">pdf-lib</code>, and <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">pdfjs-dist</code>—all file processing, rasterization, DPI patching, and compression occur directly in your device’s memory.
                        </p>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            Your files never cross a network cable to our servers. Because there is zero server transmission, there are no upload queues, no bandwidth lag, and zero risk of your personal documents being cached or compromised.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                                icon: 'fa-shield-halved', 
                                color: 'text-indigo-600', 
                                bg: 'bg-indigo-50 border border-indigo-100', 
                                title: 'Privacy Guaranteed', 
                                desc: 'Zero uploads. Your photos, Aadhaar cards, and signatures never leave your local device.' 
                            },
                            { 
                                icon: 'fa-bolt', 
                                color: 'text-amber-600', 
                                bg: 'bg-amber-50 border border-amber-100', 
                                title: 'Instant Execution', 
                                desc: 'Powered by your hardware. Process multi-megabyte images and documents with zero server latency.' 
                            },
                            { 
                                icon: 'fa-award', 
                                color: 'text-emerald-600', 
                                bg: 'bg-emerald-50 border border-emerald-100', 
                                title: 'Open & Transparent', 
                                desc: 'No subscriptions, no artificial daily file limits, no watermarks, and no deceptive wrappers.' 
                            },
                        ].map(f => (
                            <div key={f.title} className={`${f.bg} rounded-2xl p-6 text-center shadow-xs`}>
                                <div className={`${f.color} text-4xl mb-3`}><i className={`fas ${f.icon}`}></i></div>
                                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Core Focus Areas</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Rather than offering hundreds of superficial clone pages, IMG Tool focuses on high-utility, reliable workflows that solve tangible real-world problems:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                            <li><strong>Official ID & Government Exam Photo Tools:</strong> Precision sizing, 140×60px signature extraction, date-on-photo stamps, and standardized A4 print layouts for documents like Aadhaar and PAN cards.</li>
                            <li><strong>High-Fidelity PDF Utilities:</strong> Fast client-side PDF cropping, merging, visual page splitting, password removal, and image conversion.</li>
                            <li><strong>Advanced Technical Utilities:</strong> Lossless JPEG/PNG DPI header modification (300 DPI print prep), EXIF metadata inspection and one-click sanitization, and 3D STL extrusion.</li>
                            <li><strong>Modern Web Image Optimization:</strong> High-efficiency format conversion between AVIF, WebP, HEIC, PNG, and JPG with fine-grained KB targeting.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">
                            Have feedback or need a specific workflow? Feel free to reach out directly via our <a href="/contact-us" className="text-blue-600 font-semibold hover:underline">Contact page</a> or email us at <a href="mailto:info@imgtool.in" className="text-blue-600 font-semibold hover:underline">info@imgtool.in</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
