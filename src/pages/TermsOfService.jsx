import SEO from '../components/SEO'

export default function TermsOfService() {
    return (
        <>
            <SEO 
                title="Terms of Service | ImgTool" 
                description="ImgTool terms of service, acceptable use policy, and conditions of use." 
                canonical="/terms-of-service" 
            />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: February 2026</p>
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                    {[
                        { 
                            title: '1. Acceptance of Terms', 
                            content: 'By accessing and utilizing ImgTool (https://imgtool.in), you acknowledge and agree to be bound by the terms and provisions of this agreement. If you do not agree with any of these terms, you are prohibited from using or accessing this site.' 
                        },
                        { 
                            title: '2. Scope and Nature of Service', 
                            content: 'ImgTool provides a curated collection of free, client-side browser utilities for image processing, document preparation, and PDF handling. All file modifications are executed locally on the user\'s client device without uploading source files to remote servers. We endeavor to ensure high availability, but do not warrant uninterrupted operation.' 
                        },
                        { 
                            title: '3. User Ownership and Copyright Responsibility', 
                            content: 'You retain sole ownership and copyright over all files you load into ImgTool. You represent and warrant that you own or possess the necessary rights, licenses, and permissions to process and manipulate any image or document on the platform. You must not use our tools to infringe upon third-party intellectual property or remove valid legal copyright watermarks.' 
                        },
                        { 
                            title: '4. Acceptable Use Policy', 
                            content: 'You agree to use imgtool.in exclusively for lawful purposes. You are strictly prohibited from utilizing the platform to process unlawful, defamatory, or harmful materials, or attempting to reverse-engineer or disrupt site functionality.' 
                        },
                        { 
                            title: '5. Accuracy and Portal Disclaimers', 
                            content: 'While our presets are aligned with published government, recruitment (SSC, UPSC, IBPS), and photo requirements, candidate guidelines are subject to change by issuing authorities. Users should verify output dimensions and file sizes against the official recruitment notification prior to final form submission.' 
                        },
                        { 
                            title: '6. Disclaimer of Warranties & Limitation of Liability', 
                            content: 'All tools and documentation on ImgTool are provided "as is" without warranty of any kind, express or implied. In no event shall ImgTool or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the site.' 
                        },
                        { 
                            title: '7. Governing Law', 
                            content: 'Any legal claim or dispute relating to ImgTool shall be governed by the laws of India, without regard to conflict of law provisions. Inquiries regarding terms should be directed to info@imgtool.in.' 
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
