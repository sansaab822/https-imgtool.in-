import { useState } from 'react'
import SEO from '../components/SEO'

export default function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Open the user's email client with pre-filled fields
        const mailtoSubject = encodeURIComponent(form.subject || 'Contact from IMG Tool')
        const mailtoBody = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        )
        window.location.href = `mailto:info@imgtool.in?subject=${mailtoSubject}&body=${mailtoBody}`
    }

    return (
        <>
            <SEO title="Contact Us - IMG Tool" description="Get in touch with IMG Tool team. We'd love to hear from you." canonical="/contact-us" />
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Contact Us</h1>
                    <p className="text-slate-500 text-lg">Have a question or suggestion? We'd love to hear from you.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: 'fa-envelope', color: 'text-blue-600', bg: 'bg-blue-50', title: 'Email', info: 'info@imgtool.in', href: 'mailto:info@imgtool.in' },
                        { icon: 'fa-telegram-plane fab', color: 'text-sky-500', bg: 'bg-sky-50', title: 'Telegram', info: 'sarkarijobinformation24', href: 'https://t.me/sarkarijobinformation24' },
                        { icon: 'fa-clock', color: 'text-green-600', bg: 'bg-green-50', title: 'Response Time', info: 'Within 24 hours' },
                    ].map(c => (
                        <div key={c.title} className={`${c.bg} rounded-xl p-5 text-center`}>
                            <div className={`${c.color} text-3xl mb-2`}><i className={`fas ${c.icon}`}></i></div>
                            <div className="font-semibold text-slate-800">{c.title}</div>
                            {c.href ? (
                                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-sm text-blue-600 hover:underline mt-1 block">{c.info}</a>
                            ) : (
                                <div className="text-sm text-slate-600 mt-1">{c.info}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Direct contact note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-center">
                    <p className="text-sm text-slate-700">
                        <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                        <strong>Preferred method:</strong> Email us directly at{' '}
                        <a href="mailto:info@imgtool.in" className="text-blue-600 font-semibold hover:underline">info@imgtool.in</a>{' '}
                        or use the form below which will open your email client.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Send a Message</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Tool suggestion / Bug report" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" placeholder="Describe your issue or suggestion..."></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                        <i className="fas fa-paper-plane"></i> Send via Email
                    </button>
                    <p className="text-xs text-slate-400 text-center">
                        Clicking "Send via Email" will open your default email application with the message pre-filled.
                    </p>
                </form>
            </div>
        </>
    )
}
