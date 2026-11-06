import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function AboutUs() {
    const today = 'November 7, 2026'

    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            'name': 'About imgtool.in',
            'url': 'https://imgtool.in/about',
            'description': 'imgtool.in is a free image and PDF toolkit built by Sandeep Singh. Every tool runs in your browser — your files never leave your device. Learn our story.',
            'dateModified': '2026-11-07',
            'mainEntity': {
                '@type': 'Person',
                'name': 'Sandeep Singh',
                'jobTitle': 'Founder & Developer',
                'worksFor': {
                    '@type': 'Organization',
                    'name': 'imgtool.in',
                    'url': 'https://imgtool.in'
                }
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': 'Sandeep Singh',
            'url': 'https://imgtool.in/about',
            'jobTitle': 'Founder & Developer',
            'nationality': 'Indian'
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-workstation-950 transition-colors">
            <SEO
                title="About imgtool.in — Built by Sandeep Singh in India"
                description="imgtool.in is a free image and PDF toolkit built by Sandeep Singh. Every tool runs in your browser — your files never leave your device. Learn our story."
                canonical="/about"
                schema={schema}
            />

            <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 md:py-16 text-[17px] md:text-[18px] text-slate-800 dark:text-slate-200 leading-[1.7]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">About</span>
                </nav>

                {/* H1 Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                    About imgtool.in
                </h1>

                {/* Body Content */}
                <div className="space-y-6">
                    <p>
                        Hi, I'm Sandeep Singh. I built imgtool.in.
                    </p>
                    <p>
                        I didn't start this website because I wanted to become a "tech entrepreneur". I started it because I got frustrated. In 2024, I was helping my father submit an online application for a government scheme. The form needed a photograph smaller than 50KB. Simple, right?
                    </p>
                    <p>
                        I spent the next forty minutes trying different "free online image compressors." Most of them asked me to upload the photo to their servers first — a photo of my father's ID document, sent to a company I'd never heard of. Some hit me with four pop-ups before letting me click anything. One asked for my phone number before letting me download the file. And at the end, not a single one got the file size right on the first try.
                    </p>
                    <p>
                        That evening, I opened my laptop and started building what would eventually become imgtool.in.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        What we do
                    </h2>
                    <p>
                        imgtool.in is a collection of free image and PDF tools — compressors, resizers, converters, croppers, and a few niche tools you won't find on other sites. Every tool runs entirely inside your browser. There is no "server" that receives your files. There is no database storing your images. There is no queue where your PDFs sit waiting to be deleted "within 24 hours."
                    </p>
                    <p>
                        Here's a test you can do yourself. Open imgtool.in in Chrome. Press F12 to open Developer Tools. Click the "Network" tab. Now use the Image Compressor. You'll see the page loading, but you will not see your image being uploaded anywhere. That's not a marketing claim — it's just what's happening under the hood.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Why we reduced our tools from 100+ to 32
                    </h2>
                    <p>
                        You might notice that imgtool.in doesn't have a hundred tools like some sites. That was a deliberate choice. In the early months, I built over a hundred tools, most of them because the keyword data said "high volume". What I learned was that half of those tools were barely usable, half were duplicates, and almost none were tested properly.
                    </p>
                    <p>
                        So I deleted them. I kept the thirty-two that real people actually use, tested each one on a slow phone with a bad connection, and rewrote the pages so a first-time visitor can figure them out without help.
                    </p>
                    <p>
                        Quality over quantity isn't a slogan here. It's the only reason anyone returns.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Why privacy matters to us
                    </h2>
                    <p>
                        Most "free online tools" websites make money by serving you ads. Some of them also collect your files, scan them, and use them for other purposes. I'm not accusing anyone — I'm just saying that most people don't know where their photos and PDFs go after clicking "Upload."
                    </p>
                    <p>
                        At imgtool.in, the answer is simple: nowhere. Your files stay on your device. That's the whole architecture. This is not a "feature" I turned on — it's the only way the site could work.
                    </p>
                    <p>
                        We do earn from ads. We do use analytics to understand which tools people actually use. But we never touch your files. You can verify this yourself by watching the Network tab in your browser as I described above.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        Who's behind this
                    </h2>
                    <p>
                        This is a one-person project. I'm Sandeep Singh, based in India. I handle the development, testing, writing, and support. There's no team, no company behind this, no funding. Just me, my laptop, and a lot of coffee.
                    </p>
                    <p>
                        I reply to emails myself. If you write to me at contact@imgtool.in, I'll read it and respond — usually within 48 hours. If you're reporting a bug, tell me which tool and what device you're on, and I'll try to fix it.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">
                        What's next
                    </h2>
                    <p>
                        Over the next year, I'm focusing on three things:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>
                            <strong>Depth over breadth</strong> — every existing tool page will get a proper guide (how to use it, when to use it, when not to). No more "Choose File" pages with two lines of text.
                        </li>
                        <li>
                            <strong>Real content</strong> — articles that solve actual problems people have with images and PDFs, written by me after testing, not pulled from Google.
                        </li>
                        <li>
                            <strong>Speed</strong> — everything should load in under 2 seconds on 4G.
                        </li>
                    </ol>
                    <p>
                        If you've used imgtool.in before and something didn't work, I want to know. If you have a tool you wish existed, I want to know that too.
                    </p>
                    <p>
                        Thanks for reading this far. Now go use the tools.
                    </p>
                    <p className="pt-2">
                        — Sandeep Singh<br />
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Founder, imgtool.in</span>
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
