import SEO from '../components/SEO'
export default function TermsOfService() {
    return (
        <>
            <SEO title="Terms of Service - IMG Tool" description="IMG Tool terms of service and conditions of use." canonical="/terms-of-service" />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Terms of Service</h1>
                <p className="text-slate-500 mb-10">Last updated: February 2026</p>
                <div className="space-y-6 text-slate-600">
                    {[
                        { title: '1. Acceptance of Terms', content: 'By using IMG Tool (imgtool.in), you agree to these Terms of Service. If you do not agree, please do not use our services.' },
                        { title: '2. Service Description', content: 'IMG Tool provides free, browser-based image and PDF conversion tools. All processing is performed client-side in your browser. We do not guarantee uninterrupted availability of services.' },
                        { title: '3. Acceptable Use', content: 'You agree to use IMG Tool only for lawful purposes. You must not use our tools to process copyrighted material you do not have rights to, illegal content, or for any purpose that violates applicable laws.' },
                        { title: '4. Intellectual Property', content: 'The IMG Tool platform, including its design, code, and content, is owned by IMG Tool. You retain full ownership of all files you process using our tools.' },
                        { title: '5. Disclaimer of Warranties', content: 'IMG Tool is provided "as is" without any warranties. We are not responsible for any loss of data, quality degradation, or other damages arising from the use of our tools.' },
                        { title: '6. Limitation of Liability', content: 'IMG Tool shall not be liable for any indirect, incidental, or consequential damages resulting from your use of our services.' },
                        { title: '7. Changes to Terms', content: 'We may update these Terms from time to time. Continued use of IMG Tool after changes constitutes acceptance of the new terms.' },
                        { title: '8. Contact', content: 'For any questions regarding these Terms, please contact us at contact@imgtool.in.' },
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
