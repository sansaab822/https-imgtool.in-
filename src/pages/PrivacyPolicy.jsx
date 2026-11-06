import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function PrivacyPolicy() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Privacy Policy — imgtool.in',
            'url': 'https://imgtool.in/privacy-policy',
            'description': "How imgtool.in handles your data. We don't upload your files. We use analytics and Google AdSense. Read the full policy here.",
            'dateModified': '2026-11-07'
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="Privacy Policy — imgtool.in"
                description="How imgtool.in handles your data. We don't upload your files. We use analytics and Google AdSense. Read the full policy here."
                canonical="/privacy-policy"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Privacy Policy</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    Privacy Policy
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p>
                        This Privacy Policy explains how imgtool.in ("we", "us", "our") handles information when you visit our website at https://imgtool.in. It was last updated on {today}.
                    </p>
                    <p>
                        We've written this in plain language wherever possible. If anything is unclear, email <a href="mailto:contact@imgtool.in" className="text-blue-600 dark:text-blue-400 hover:underline">contact@imgtool.in</a> and ask.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        1. The most important thing: your files
                    </h2>
                    <p>
                        Every image, PDF, or other file you use with our tools is processed <strong>entirely inside your browser</strong>. Your files are not uploaded to our servers. We do not have access to them. We cannot see them, store them, or share them.
                    </p>
                    <p>
                        If you'd like to verify this, open the Developer Tools in your browser (press F12), switch to the "Network" tab, and use any tool on our site. You will not see your file being sent anywhere.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        2. Information we do collect
                    </h2>
                    <p>
                        When you visit imgtool.in, we collect some standard technical information automatically. This is true of almost every website on the internet:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Usage data</strong> — pages you visit, time spent, buttons you click, referring website
                        </li>
                        <li>
                            <strong>Device data</strong> — browser type and version, operating system, screen size, language
                        </li>
                        <li>
                            <strong>Approximate location</strong> — country and city level only, derived from your IP address (we do not store your full IP address)
                        </li>
                    </ul>
                    <p>
                        We do not collect your name, email address, phone number, or any other personally identifiable information unless you choose to email us directly.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        3. Cookies and advertising
                    </h2>
                    <p>
                        imgtool.in uses cookies. A cookie is a small text file placed on your device. We use them for three purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Essential cookies</strong> — to make the site work (e.g., remembering dark mode preference)
                        </li>
                        <li>
                            <strong>Analytics cookies</strong> — to understand which pages are popular and how people find us (Google Analytics)
                        </li>
                        <li>
                            <strong>Advertising cookies</strong> — to show relevant ads (Google AdSense, once our site is approved)
                        </li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3">
                        Google AdSense and third-party vendors
                    </h3>
                    <p>
                        We use Google AdSense to display advertisements on some pages. Google and its partners may use cookies (including the DoubleClick DART cookie) to serve ads based on your prior visits to this site or other sites on the internet.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.
                        </li>
                        <li>
                            You may opt out of personalised advertising by visiting{' '}
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Google's Ads Settings
                            </a>.
                        </li>
                        <li>
                            You can also opt out of a third-party vendor's use of cookies for personalised advertising by visiting{' '}
                            <a
                                href="https://www.aboutads.info/choices/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                www.aboutads.info
                            </a>.
                        </li>
                    </ul>
                    <p>
                        If you are in the European Economic Area, United Kingdom, or Switzerland, you will be shown a consent banner asking for your permission before any non-essential cookie is set. You can change your mind at any time.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        4. Analytics
                    </h2>
                    <p>
                        We use Google Analytics 4 to understand traffic patterns. Google Analytics collects information such as how often you visit, what pages you view, and what other websites referred you to us. It does not collect personally identifiable information. You can opt out using the{' '}
                        <a
                            href="https://tools.google.com/dlpage/gaoptout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Google Analytics Opt-out Browser Add-on
                        </a>.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        5. Children's privacy
                    </h2>
                    <p>
                        imgtool.in is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has provided us information, email us and we'll delete it.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        6. Your rights
                    </h2>
                    <p>
                        Depending on where you live, you may have rights regarding your personal data:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Right to access</strong> — ask what data we hold about you</li>
                        <li><strong>Right to deletion</strong> — ask us to delete your data</li>
                        <li><strong>Right to object</strong> — object to certain processing</li>
                        <li><strong>Right to portability</strong> — receive your data in a common format</li>
                        <li><strong>Right to complain</strong> — to your local data protection authority</li>
                    </ul>
                    <p>
                        To exercise any of these rights, email <a href="mailto:contact@imgtool.in" className="text-blue-600 dark:text-blue-400 hover:underline">contact@imgtool.in</a>. We'll respond within 30 days.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        7. Data retention
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Analytics data: retained for 26 months (default Google Analytics retention)</li>
                        <li>Email correspondence: retained for as long as needed to resolve your issue, then deleted within 12 months</li>
                        <li>Files you process with our tools: never stored, therefore never retained</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        8. Third-party links
                    </h2>
                    <p>
                        Our site may contain links to third-party websites. We are not responsible for their privacy practices. Please read their policies separately.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        9. Changes to this policy
                    </h2>
                    <p>
                        If we update this policy, we'll change the "Last updated" date at the top. For significant changes, we may also add a notice on the homepage.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        10. Contact
                    </h2>
                    <p>
                        Questions about this policy?
                    </p>
                    <p className="p-4 rounded-xl bg-slate-50 dark:bg-workstation-900 border border-slate-200 dark:border-workstation-800 space-y-1 text-base">
                        <strong>Email:</strong> <a href="mailto:contact@imgtool.in" className="text-blue-600 dark:text-blue-400 hover:underline">contact@imgtool.in</a><br />
                        <strong>Owner:</strong> Sandeep Singh<br />
                        <strong>Website:</strong> https://imgtool.in
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
