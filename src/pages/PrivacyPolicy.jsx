import SEO from '../components/SEO'

export default function PrivacyPolicy() {
    return (
        <>
            <SEO 
                title="Privacy Policy | ImgTool — Zero Cloud Upload Guarantee" 
                description="ImgTool privacy policy: all file processing executes 100% locally in your web browser. Zero server uploads, zero cloud file retention, and GDPR/IT Act compliance." 
                canonical="/privacy-policy" 
            />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: February 2026</p>

                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8 flex gap-4">
                    <i className="fas fa-shield-alt text-emerald-600 dark:text-emerald-400 text-2xl mt-1 flex-shrink-0"></i>
                    <div>
                        <h3 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">Summary: Your Files Never Leave Your Device</h3>
                        <p className="text-emerald-800 dark:text-emerald-300 text-sm leading-relaxed">
                            All image, PDF, and document transformations happen entirely in your local browser memory using JavaScript and WebAssembly. We do not store, view, or transmit any files you process on ImgTool.
                        </p>
                    </div>
                </div>

                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                    {[
                        { 
                            title: '1. Information We Collect (Zero File Retention)', 
                            content: 'ImgTool operates on a strict zero-knowledge, client-side model. When you use any tool on imgtool.in to compress, convert, crop, or resize images and PDFs, all processing occurs locally in your device\'s browser RAM. We do NOT upload, collect, store, or transmit your files or personal documents to our servers. Any data handled is processed temporarily in your browser\'s memory and immediately cleared when you close the tab or reload the page.' 
                        },
                        { 
                            title: '2. Analytics and Advertising (Google Analytics & Google AdSense)', 
                            content: 'We use Google Analytics to monitor aggregated website traffic and Google AdSense to serve relevant advertisements. These third-party services may use cookies, web beacons, or unique device identifiers to collect non-personally identifiable data about your visit (such as pages visited, general geographic region, and device/browser type). Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet. You can opt out of personalized advertising at any time by visiting Google Ads Settings (https://adssettings.google.com).' 
                        },
                        { 
                            title: '3. Use of Cookies and Local Storage', 
                            content: 'ImgTool uses local browser storage solely to preserve user interface preferences (such as light or dark theme mode). We do not store tracking cookies of our own. Third-party vendors, including Google, use cookies to serve ads based on prior visits. You can manage or disable cookies at any time through your browser privacy settings.' 
                        },
                        { 
                            title: '4. Compliance with Indian IT Act (2000) & International Standards', 
                            content: 'In compliance with the Information Technology Act, 2000 (India), the General Data Protection Regulation (GDPR - EU), and the California Consumer Privacy Act (CCPA), we are committed to transparent user privacy. Because our utilities never transmit or store your personal files or Personally Identifiable Information (PII), you retain complete sovereignty over your data.' 
                        },
                        { 
                            title: '5. External Links', 
                            content: 'Our website may contain links to external sites (such as official government examination portals for candidate reference). We have no control over the content, privacy practices, or security of external websites and accept no liability for them.' 
                        },
                        { 
                            title: '6. Policy Updates', 
                            content: 'We may update this Privacy Policy periodically to reflect technological or regulatory advancements. Any modifications will be posted here with an updated "Last updated" date.' 
                        },
                        { 
                            title: '7. Contact & Data Inquiries', 
                            content: 'If you have questions regarding this Privacy Policy or our client-side processing architecture, contact our team at info@imgtool.in.' 
                        },
                    ].map(s => (
                        <div key={s.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{s.title}</h2>
                            <p className="leading-relaxed text-sm sm:text-base">{s.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
