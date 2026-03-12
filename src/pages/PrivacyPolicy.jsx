import SEO from '../components/SEO'

export default function PrivacyPolicy() {
    return (
        <>
            <SEO title="Privacy Policy - IMG Tool" description="IMG Tool privacy policy — we never upload your images to our servers." canonical="/privacy-policy" />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Privacy Policy</h1>
                <p className="text-slate-500 mb-10">Last updated: February 2026</p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex gap-4">
                    <i className="fas fa-shield-alt text-blue-600 text-2xl mt-1 flex-shrink-0"></i>
                    <div>
                        <h3 className="font-bold text-blue-800 mb-1">TL;DR — Your Files Never Leave Your Device</h3>
                        <p className="text-blue-700 text-sm">All image processing happens entirely in your browser using JavaScript. We do not store, transmit, or have access to any files you process on IMG Tool.</p>
                    </div>
                </div>
                <div className="space-y-8 text-slate-600">
                    {[
                        { title: '1. Information We Collect', content: 'IMG Tool operates on a strict privacy-first model. When you use any tool on imgtool.in to compress, convert, or resize images, all image processing occurs locally within your device\'s web browser. We do NOT upload, collect, store, or transmit your files or personal media to our servers. Any data handled is processed temporarily in your browser\'s memory and cleared upon closing the page.' },
                        { title: '2. Analytics and Third-Party Services (Google Analytics & AdSense)', content: 'We use Google Analytics to understand traffic patterns and Google AdSense to display relevant advertisements. These third-party services may use cookies, web beacons, or similar technologies to collect anonymized data about your browsing behavior (such as IP address, browser type, and pages visited). Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet. You may opt out of personalized advertising by visiting Google\'s Ads Settings.' },
                        { title: '3. Use of Cookies', content: 'IMG Tool uses minimal cookies solely for operational and analytical purposes (e.g., maintaining preferences, Google Analytics, and AdSense tracking). By continuing to use our website, you consent to our use of these cookies. You can manage or disable cookies at any time through your browser settings.' },
                        { title: '4. User Rights & Data Protection (IT Act 2000)', content: 'In compliance with the Information Technology Act, 2000 (India) and applicable global data protection regulations, we are committed to safeguarding your privacy. Since we do not collect personal identifiable information (PII) or store uploaded files, you remain in complete control of your data. If you have inquiries regarding privacy practices, you have the right to contact us for clarification.' },
                        { title: '5. External Links', content: 'Our website may contain links to external sites that are not operated by us. We have no control over the content, privacy policies, or practices of any third-party sites or services and accept no responsibility for them.' },
                        { title: '6. Changes to This Policy', content: 'We may update our Privacy Policy periodically. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically for any changes.' },
                        { title: '7. Contact Information', content: 'If you have any questions or concerns about this Privacy Policy, your data rights, or our practices, please contact us at info@imgtool.in.' },
                    ].map(s => (
                        <div key={s.title} className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h2>
                            <p className="leading-relaxed">{s.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
