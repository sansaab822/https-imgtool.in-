import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function EditorialPolicy() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Editorial Policy — How imgtool.in Creates Content',
            'url': 'https://imgtool.in/editorial-policy',
            'description': 'How we research, write, test, and update every article and tool page on imgtool.in. Our standards, sources, and correction policy.',
            'dateModified': '2026-11-07'
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="Editorial Policy — How imgtool.in Creates Content"
                description="How we research, write, test, and update every article and tool page on imgtool.in. Our standards, sources, and correction policy."
                canonical="/editorial-policy"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Editorial Policy</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    Editorial Policy
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last updated: {today}
                    </p>

                    <p>
                        imgtool.in publishes written guides, tutorials, and explanations alongside its tools. This page explains how that content is created, checked, and updated. It's short because there aren't many layers here — it's one person writing, testing, and fact-checking.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Who writes the content
                    </h2>
                    <p>
                        All content on imgtool.in is written by <strong>Sandeep Singh</strong>, the site's founder. There is no ghostwriting, no content agency, and no AI-generated filler. If you see an article on this site, I wrote it after actually using the tool I'm describing.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        How content is created
                    </h2>
                    <p>
                        Every guide follows this process:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>
                            <strong>Identify a real problem</strong> — usually from an email someone has sent me, or a problem I've faced myself.
                        </li>
                        <li>
                            <strong>Use the tool repeatedly</strong> — on different devices, browsers, and file types. Note what works and what breaks.
                        </li>
                        <li>
                            <strong>Research context</strong> — read the official guidelines (e.g., government portal rules, image format specifications) that the article touches on. Link to the source.
                        </li>
                        <li>
                            <strong>Write the first draft</strong> — in plain language. Avoid jargon. Explain things the way I'd explain to a friend.
                        </li>
                        <li>
                            <strong>Second pass</strong> — cut anything that sounds like marketing. If a sentence could appear on any tools website, delete it.
                        </li>
                        <li>
                            <strong>Publish</strong> — with the date shown at the top.
                        </li>
                        <li>
                            <strong>Update</strong> — when a tool changes, the article is updated. Older articles get a review every 6–12 months.
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        What we don't do
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We don't publish AI-generated articles.</li>
                        <li>We don't copy content from other websites.</li>
                        <li>We don't accept paid placements, sponsored reviews, or guest posts.</li>
                        <li>We don't claim a tool can do something it can't.</li>
                        <li>We don't use "AI-powered" as a label unless the tool actually uses a machine learning model (none currently do — all tools use deterministic algorithms).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Sources we trust
                    </h2>
                    <p>
                        Depending on the topic, we cite:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Government portals (India's passport, Aadhaar, visa, exam portals)</li>
                        <li>Official documentation from Google, Mozilla, Apple, Microsoft, Adobe</li>
                        <li>Standards bodies (W3C, ISO for image/PDF formats)</li>
                        <li>Google's own Web.dev guides for performance topics</li>
                    </ul>
                    <p>
                        We link to these sources inside the articles wherever relevant.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Corrections
                    </h2>
                    <p>
                        If you find an error in any article, email <strong>contact@imgtool.in</strong> with:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The URL of the page</li>
                        <li>What's wrong</li>
                        <li>What the correct information is (with a source if possible)</li>
                    </ul>
                    <p>
                        I'll verify and fix within 7 days, and add a note at the bottom of the article: "Updated on [date] to correct [X]." If you want, I'll credit you by first name.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Affiliate and ad policy
                    </h2>
                    <p>
                        imgtool.in is supported by display ads (Google AdSense). We do not use affiliate links, and no article on this site is written in exchange for money, product, or service.
                    </p>
                    <p>
                        Ads do not influence our content. If a tool is genuinely bad, we'll say so — even if it's one of ours.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Contact
                    </h2>
                    <p>
                        Questions about how we create content?
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

