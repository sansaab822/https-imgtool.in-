import { useState } from 'react'
import SEO from '../components/SEO'

export default function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [copied, setCopied] = useState(false)

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('info@imgtool.in')
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const mailtoSubject = encodeURIComponent(form.subject || 'Contact from ImgTool')
        const mailtoBody = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
        )
        window.location.href = `mailto:info@imgtool.in?subject=${mailtoSubject}&body=${mailtoBody}`
    }

    return (
        <>
            <SEO 
                title="Contact Us | ImgTool" 
                description="Get in touch with the ImgTool engineering and editorial team for technical support, feature suggestions, or feedback." 
                canonical="/contact-us" 
            />
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Contact Us</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Have a bug report, new tool suggestion, or feedback? We reply directly to every inquiry.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                        { 
                            icon: 'fa-envelope', 
                            color: 'text-blue-600 dark:text-blue-400', 
                            bg: 'bg-blue-50 dark:bg-blue-950/50', 
                            title: 'Email Us', 
                            info: 'info@imgtool.in', 
                            action: handleCopyEmail,
                            actionLabel: copied ? 'Copied!' : 'Copy Address'
                        },
                        { 
                            icon: 'fa-telegram-plane fab', 
                            color: 'text-sky-500', 
                            bg: 'bg-sky-50 dark:bg-sky-950/50', 
                            title: 'Community Telegram', 
                            info: '@sarkarijobinformation24', 
                            href: 'https://t.me/sarkarijobinformation24' 
                        },
                        { 
                            icon: 'fa-clock', 
                            color: 'text-emerald-600 dark:text-emerald-400', 
                            bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
                            title: 'Response Time', 
                            info: 'Typically within 24 hours' 
                        },
                    ].map(c => (
                        <div key={c.title} className={`${c.bg} rounded-2xl p-5 text-center border border-slate-100 dark:border-slate-800`}>
                            <div className={`${c.color} text-3xl mb-2`}><i className={`fas ${c.icon}`}></i></div>
                            <div className="font-semibold text-slate-800 dark:text-white text-sm">{c.title}</div>
                            {c.href ? (
                                <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block font-mono">
                                    {c.info}
                                </a>
                            ) : c.action ? (
                                <button onClick={c.action} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block font-mono mx-auto">
                                    {c.info} <span className="text-[10px] bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-200 ml-1">{c.actionLabel}</span>
                                </button>
                            ) : (
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{c.info}</div>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Send Us a Direct Message</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                            <input 
                                required 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" 
                                placeholder="e.g. Rahul Sharma" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input 
                                required 
                                type="email" 
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })} 
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" 
                                placeholder="you@example.com" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                        <input 
                            required 
                            value={form.subject} 
                            onChange={e => setForm({ ...form, subject: e.target.value })} 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" 
                            placeholder="e.g., Tool suggestion / Bug report / Inquiry" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                        <textarea 
                            required 
                            rows={5} 
                            value={form.message} 
                            onChange={e => setForm({ ...form, message: e.target.value })} 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-sm" 
                            placeholder="Please provide details about the tool or issue..."
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
                        <i className="fas fa-paper-plane"></i> Send Message (via Email)
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                        This form pre-fills your email client with your message for immediate delivery to <code className="text-blue-500">info@imgtool.in</code>.
                    </p>
                </form>
            </div>
        </>
    )
}
