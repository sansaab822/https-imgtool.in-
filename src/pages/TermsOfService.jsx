import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function TermsOfService() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Terms of Service — imgtool.in',
            'url': 'https://imgtool.in/terms',
            'description': "The rules for using imgtool.in's free image and PDF tools. Plain English, no legal maze.",
            'dateModified': '2026-11-07'
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="Terms of Service — imgtool.in"
                description="The rules for using imgtool.in's free image and PDF tools. Plain English, no legal maze."
                canonical="/terms"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Terms of Service</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    Terms of Service
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p>
                        By using imgtool.in, you agree to these terms. Please read them. They're short and written in plain English.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last updated: {today}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        1. What imgtool.in is
                    </h2>
                    <p>
                        imgtool.in is a free collection of online image and PDF tools. Every tool runs inside your browser. We don't require an account, we don't ask for payment, and we don't store your files.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        2. Who can use this site
                    </h2>
                    <p>
                        You can use imgtool.in if you are at least 13 years old and legally able to enter into these terms. If you're using the site on behalf of an organisation, you're confirming you have authority to agree to these terms on its behalf.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        3. Your responsibilities
                    </h2>
                    <p>
                        You agree NOT to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Use imgtool.in for any illegal purpose</li>
                        <li>Process content that is illegal in your jurisdiction (e.g., child sexual abuse material, stolen documents, malware)</li>
                        <li>Attempt to break, hack, overload, or reverse-engineer the site</li>
                        <li>Use automated scripts or bots to abuse the tools</li>
                        <li>Upload or process files that infringe on someone else's intellectual property</li>
                    </ul>
                    <p>
                        You are solely responsible for the content you process using our tools.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        4. No warranty
                    </h2>
                    <p>
                        The tools on imgtool.in are provided "as is" and "as available", without any warranty of any kind — express or implied. We do not guarantee that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The tools will always work without errors</li>
                        <li>The output will meet your specific requirements</li>
                        <li>The site will be available 24/7</li>
                        <li>Any specific file size, quality, or format will be achieved</li>
                    </ul>
                    <p>
                        We test our tools carefully, but software is imperfect. If something doesn't work, email us — we'll try to fix it.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        5. Limitation of liability
                    </h2>
                    <p>
                        To the maximum extent permitted by law, imgtool.in and Sandeep Singh shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the site — including but not limited to loss of data, loss of profit, or business interruption.
                    </p>
                    <p>
                        You use imgtool.in at your own risk. Please keep a backup of any file you process.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        6. Intellectual property
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The imgtool.in website, its code, design, and written content are owned by Sandeep Singh.</li>
                        <li>You may not copy, reproduce, or redistribute our content without permission.</li>
                        <li>You retain full ownership of any file you process using our tools. We don't claim any rights over your files.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        7. Third-party services
                    </h2>
                    <p>
                        imgtool.in displays ads through Google AdSense and uses Google Analytics. Your interactions with these services are governed by Google's own terms and privacy policies. We are not responsible for third-party services.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        8. Changes to the service
                    </h2>
                    <p>
                        We may add, change, or remove any tool at any time without notice. Some tools may be discontinued if they're rarely used or become difficult to maintain.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        9. Changes to these terms
                    </h2>
                    <p>
                        We may update these terms occasionally. The "Last updated" date at the top will change. Continued use of the site after changes means you accept the new terms.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        10. Governing law
                    </h2>
                    <p>
                        These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in India.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        11. Contact
                    </h2>
                    <p>
                        Questions about these terms?
                    </p>
                    <p className="p-4 rounded-xl bg-slate-50 dark:bg-workstation-900 border border-slate-200 dark:border-workstation-800 space-y-1 text-base">
                        <strong>Email:</strong> <a href="mailto:contact@imgtool.in" className="text-blue-600 dark:text-blue-400 hover:underline">contact@imgtool.in</a><br />
                        <strong>Owner:</strong> Sandeep Singh
                    </p>
                </div>

                {/* Footer Bar: Last updated & Back to tools */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Last updated: {today}
                    </span>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                    >
                        <i className="fas fa-arrow-left text-xs" aria-hidden="true"></i>
                        <span>Back to tools</span>
                    </Link>
                </div>
            </main>
        </article>
    )
}
