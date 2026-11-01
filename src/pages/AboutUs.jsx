import SEO from '../components/SEO'

export default function AboutUs() {
    return (
        <>
            <SEO 
                title="About Us | ImgTool — Privacy-First Client-Side Utilities" 
                description="Learn about ImgTool: our engineering approach, 100% in-browser client-side architecture, and mission to deliver free, private image and PDF utilities." 
                canonical="/about-us" 
            />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                        <i className="fas fa-shield-alt text-emerald-500"></i> Client-Side Engineering & Privacy
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">About ImgTool</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Fast, private, and subscription-free utilities engineered for the modern web.</p>
                </div>

                <div className="space-y-8">
                    {/* Story & Background */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                            <i className="fas fa-layer-group text-blue-600 dark:text-blue-400"></i> Who We Are & Why We Built This
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            ImgTool was founded by Sanjeev, an independent web developer, out of frustration with online utility websites. Most traditional image and PDF tools require uploading personal photos and sensitive government identity cards (such as Aadhaar, PAN cards, or signatures) to unknown remote servers, only to hit users with paywalls, watermarks, or invasive sign-up requirements.
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                            We believe basic document preparation and media formatting should be private, instantaneous, and accessible to everyone. By re-engineering these tools to execute <strong>100% locally inside your web browser</strong>, your documents and photos never leave your device.
                        </p>
                    </div>

                    {/* Core Pillars */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                                icon: 'fa-shield-halved', 
                                color: 'text-indigo-600 dark:text-indigo-400', 
                                bg: 'bg-indigo-50 dark:bg-indigo-950/50', 
                                title: 'Zero Cloud Storage', 
                                desc: 'All transformations execute locally in browser RAM using WebAssembly and HTML5 Canvas. Your files are never uploaded or stored.' 
                            },
                            { 
                                icon: 'fa-bolt', 
                                color: 'text-amber-600 dark:text-amber-400', 
                                bg: 'bg-amber-50 dark:bg-amber-950/50', 
                                title: 'Instant Processing', 
                                desc: 'Eliminate network latency and cloud queues. Operations complete immediately using the multi-core processing power of your device.' 
                            },
                            { 
                                icon: 'fa-circle-check', 
                                color: 'text-emerald-600 dark:text-emerald-400', 
                                bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
                                title: '100% Free & Open', 
                                desc: 'No forced account registrations, no premium paywalls, and no hidden watermarks stamped on your downloaded files.' 
                            },
                        ].map(f => (
                            <div key={f.title} className={`${f.bg} rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800/80`}>
                                <div className={`${f.color} text-4xl mb-3`}><i className={`fas ${f.icon}`}></i></div>
                                <h3 className="font-bold text-slate-800 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Technical Architecture */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                            <i className="fas fa-microchip text-indigo-600 dark:text-indigo-400"></i> Our Engineering Architecture
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Rather than running expensive, privacy-invasive backend server clusters, ImgTool leverages modern browser APIs:
                        </p>
                        <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300 text-sm">
                            <li className="flex items-start gap-3">
                                <i className="fas fa-check-circle text-blue-500 mt-1 flex-shrink-0"></i>
                                <span><strong>Lossless Binary Header Patching:</strong> Our DPI converter and EXIF stripper manipulate raw binary byte arrays (JFIF segments in JPEG and pHYs chunks in PNG) directly via JavaScript <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">Uint8Array</code>, altering metadata in milliseconds without re-encoding image pixels.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fas fa-check-circle text-blue-500 mt-1 flex-shrink-0"></i>
                                <span><strong>High-Performance In-Memory PDF Engine:</strong> PDF splitting, extraction, and merging are performed entirely within browser memory using <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">pdf-lib</code> and <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">jszip</code>, preventing sensitive legal or financial paperwork from touching cloud servers.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fas fa-check-circle text-blue-500 mt-1 flex-shrink-0"></i>
                                <span><strong>Hardware-Accelerated Canvas & 3D:</strong> Image resizing, custom color thresholding for signatures, and 3D mesh extrusion utilize the GPU via HTML5 Canvas 2D and Three.js.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Editorial Standards */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                            <i className="fas fa-book-open text-emerald-600 dark:text-emerald-400"></i> Editorial Standards & Guides
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Alongside our utility suite, our blog publishes original, thoroughly researched technical guides. We verify official examination notifications (such as SSC, UPSC, and IBPS guidelines), conduct compression algorithm benchmarks (MozJPEG vs WebP vs AVIF), and explain technical concepts like DPI vs PPI to help candidates, designers, and developers make informed decisions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
