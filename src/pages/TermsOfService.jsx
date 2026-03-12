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
                        { title: '1. Acceptance of Terms', content: 'By accessing and using IMG Tool (https://imgtool.in), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.' },
                        { title: '2. Scope of Service', content: 'IMG Tool provides a suite of free, browser-based tools for image and PDF manipulation, including compression, resizing, format conversion, cropping, and more. All file processing is performed "client-side" locally within your web browser. While we strive for 100% uptime, we do not guarantee uninterrupted access to the website.' },
                        { title: '3. User Responsibilities & Image Copyright Disclaimer', content: 'You are solely responsible for the files you upload and process using IMG Tool. You explicitly agree that you own the necessary copyright, permissions, and rights to any image or document you process on our platform. You must not use our tools to manipulate, watermark, or convert copyrighted material that you do not have legal authorization to use. IMG Tool accepts no liability for copyright infringement or misuse of files by its users.' },
                        { title: '4. Acceptable Use Policy', content: 'You agree to use imgtool.in only for lawful purposes. You are strictly prohibited from using the platform to process illegal, abusive, sexually explicit, or malicious content, or from attempting to disrupt the website\'s functionality, servers, or networks.' },
                        { title: '5. Intellectual Property', content: 'All original content, features, layout, code, and functionality on imgtool.in are owned by IMG Tool and are protected by international copyright, trademark, and other intellectual property laws. You may not copy or reproduce our site design or tools.' },
                        { title: '6. Disclaimer of Warranties', content: 'The materials and tools on IMG Tool are provided on an \'as is\' basis. IMG Tool makes no warranties, expressed or implied, and hereby disclaims all warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property. We do not warrant the absolute accuracy of the output (e.g., exact compression size or color accuracy).' },
                        { title: '7. Limitation of Liability', content: 'In no event shall IMG Tool or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on IMG Tool\'s website.' },
                        { title: '8. Governing Law', content: 'Any claim relating to IMG Tool\'s website shall be governed by the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.' },
                        { title: '9. Contact Information', content: 'If you have any questions about these Terms, please contact us at info@imgtool.in.' },
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
