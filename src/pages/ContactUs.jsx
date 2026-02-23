import { useState } from 'react'
import SEO from '../components/SEO'

export default function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        window.location.href = `mailto:contact@imgtool.in?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`
        setSent(true)
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
                        { icon: 'fa-envelope', color: 'text-blue-600', bg: 'bg-blue-50', title: 'Email', info: 'contact@imgtool.in' },
                        { icon: 'fa-telegram-plane fab', color: 'text-sky-500', bg: 'bg-sky-50', title: 'Telegram', info: 'sarkarijobinformation24' },
                        { icon: 'fa-clock', color: 'text-green-600', bg: 'bg-green-50', title: 'Response Time', info: 'Within 24 hours' },
                    ].map(c => (
                        <div key={c.title} className={`${c.bg} rounded-xl p-5 text-center`}>
                            <div className={`${c.color} text-3xl mb-2`}><i className={`fas ${c.icon}`}></i></div>
                            <div className="font-semibold text-slate-800">{c.title}</div>
                            <div className="text-sm text-slate-600 mt-1">{c.info}</div>
                        </div>
                    ))}
                </div>
                {sent ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Message Ready!</h3>
                        <p className="text-green-700">Your email client has been opened with your message. Please send it from there.</p>
                    </div>
                ) : (
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
                            <i className="fas fa-paper-plane"></i> Send Message
                        </button>
                    </form>
                )}
            </div>
        </>
    )
}
