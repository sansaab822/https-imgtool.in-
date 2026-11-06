import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function ContactUs() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            'name': 'Contact imgtool.in',
            'url': 'https://imgtool.in/contact',
            'description': 'Questions, bug reports, or tool requests? Email us at contact@imgtool.in. A real person reads every message and replies within 48 hours.',
            'dateModified': '2026-11-07',
            'mainEntity': {
                '@type': 'Organization',
                'name': 'imgtool.in',
                'url': 'https://imgtool.in',
                'contactPoint': {
                    '@type': 'ContactPoint',
                    'email': 'contact@imgtool.in',
                    'contactType': 'customer support',
                    'availableLanguage': ['en', 'hi'],
                    'hoursAvailable': 'Mo-Sa 09:00-18:00'
                }
            }
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="Contact imgtool.in — We Reply Within 48 Hours"
                description="Questions, bug reports, or tool requests? Email us at contact@imgtool.in. A real person reads every message and replies within 48 hours."
                canonical="/contact"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Contact</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    Contact Us
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p>
                        The fastest way to reach us is email. A real person reads every message.
                    </p>

                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-workstation-900 border border-slate-200 dark:border-workstation-800 space-y-3">
                        <p className="font-semibold text-slate-900 dark:text-white">
                            <strong>Email:</strong>{' '}
                            <a
                                href="mailto:contact@imgtool.in"
                                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                            >
                                contact@imgtool.in
                            </a>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                            <strong>Response time:</strong> Within 48 hours, Monday to Saturday. (India Standard Time)
                        </p>
                        <div className="pt-2">
                            <a
                                href="mailto:contact@imgtool.in"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                            >
                                <i className="fas fa-envelope text-xs" aria-hidden="true"></i>
                                <span>Send an email to contact@imgtool.in</span>
                            </a>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        What you can email us about
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Bug reports</strong> — Something not working? Tell us the tool name, your phone or laptop model, and what went wrong. Screenshots help.
                        </li>
                        <li>
                            <strong>Tool requests</strong> — A tool you wish existed? Describe what you'd use it for.
                        </li>
                        <li>
                            <strong>Content corrections</strong> — Spotted an error in one of our guides? We'll fix it and credit you if you'd like.
                        </li>
                        <li>
                            <strong>Business inquiries</strong> — For partnerships or advertising, use the same email with "Business" in the subject line.
                        </li>
                        <li>
                            <strong>Privacy concerns</strong> — If you think a tool is doing something it shouldn't, tell us. We'll investigate.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        What we can't help with
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Recovering files you deleted</li>
                        <li>Legal advice about government forms or document sizes</li>
                        <li>Anything that requires access to your device or account</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Before you email
                    </h2>
                    <p>
                        Please check our FAQs on tool pages first — most "not working" issues are browser cache or file-size related.
                    </p>
                    <p>
                        If you haven't received a reply within 72 hours, check your spam folder, then email again. It's not you — it's probably my inbox filter.
                    </p>
                    <p className="pt-2">
                        — Sandeep
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
