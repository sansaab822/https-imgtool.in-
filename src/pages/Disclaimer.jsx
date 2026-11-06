import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Disclaimer() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Disclaimer — imgtool.in',
            'url': 'https://imgtool.in/disclaimer',
            'description': "Important notes about imgtool.in's tools, accuracy, and limitations. Read before using our tools for official documents.",
            'dateModified': '2026-11-07'
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="Disclaimer — imgtool.in"
                description="Important notes about imgtool.in's tools, accuracy, and limitations. Read before using our tools for official documents."
                canonical="/disclaimer"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Disclaimer</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    Disclaimer
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last updated: {today}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        General information
                    </h2>
                    <p>
                        The tools and content on imgtool.in are provided for general informational and practical use. While we test each tool carefully, we make no representations or warranties about the completeness, accuracy, or reliability of any tool's output.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Not professional advice
                    </h2>
                    <p>
                        Nothing on imgtool.in constitutes legal, financial, medical, or professional advice. If you're processing a document for an official application (passport, visa, government form, etc.), always verify the requirements with the official authority. Requirements change — sometimes without warning — and our tool cannot guarantee compliance with any specific format, size, or standard.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Government and official documents
                    </h2>
                    <p>
                        Our tools can help you resize, compress, or convert files. But <strong>we are not connected to any government body, embassy, or official authority</strong>. If your application gets rejected because a photo doesn't meet requirements, we cannot be held responsible. Always check the official guidelines.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        No guarantee of results
                    </h2>
                    <p>
                        We cannot guarantee that any file processed through imgtool.in will:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Meet the requirements of a specific application or portal</li>
                        <li>Preserve quality exactly as it was originally</li>
                        <li>Work on every browser or device</li>
                        <li>Be free of all errors in every edge case</li>
                    </ul>
                    <p>
                        Please keep a backup of your original file before processing.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        External links
                    </h2>
                    <p>
                        imgtool.in may link to external websites (like Google's privacy tools, Mozilla's documentation, or government portals). We don't control those sites and are not responsible for their content or accuracy.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Advertising
                    </h2>
                    <p>
                        imgtool.in displays advertisements through Google AdSense. The presence of an ad does not constitute an endorsement of the advertised product or service. We do not personally verify the ads shown.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Privacy
                    </h2>
                    <p>
                        Please refer to our <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> for details on how we handle data. To be clear: your files stay on your device. We never see them.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Contact
                    </h2>
                    <p>
                        If you spot anything incorrect or misleading on this site, please let us know.
                    </p>
                    <p className="p-4 rounded-xl bg-slate-50 dark:bg-workstation-900 border border-slate-200 dark:border-workstation-800 space-y-1 text-base">
                        <strong>Email:</strong> <a href="mailto:contact@imgtool.in" className="text-blue-600 dark:text-blue-400 hover:underline">contact@imgtool.in</a>
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
