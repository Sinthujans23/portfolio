import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, Github, Linkedin, MapPin, CheckCircle, Loader2, Sparkles, Copy, Check } from 'lucide-react'
import Confetti from './Confetti'
import { supabase } from '../lib/supabase'

const EMAIL = 'sinthuu07@gmail.com'

const INFO = [
  { icon: Mail,     label: 'Email',    value: EMAIL,                          href: `mailto:${EMAIL}`, copyable: true },
  { icon: MapPin,   label: 'Location', value: 'Sri Lanka 🇱🇰',               href: null },
  { icon: Github,   label: 'GitHub',   value: 'github.com/Sinthujans23',                              href: 'https://github.com/Sinthujans23' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/sivarajan-sinthujan', href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2' },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      title="Copy email"
      className="ml-1.5 p-1 rounded-lg text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  )
}

const INITIAL = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm]           = useState(INITIAL)
  const [loading, setLoading]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [errors, setErrors]       = useState({})
  const [confetti, setConfetti]   = useState(0)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = ({ target: { name, value } }) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({ name: form.name, email: form.email, message: form.message })
      if (error) throw new Error(error.message)
      setSent(true)
      setForm(INITIAL)
      setConfetti(n => n + 1)
    } catch (err) {
      setErrors({ message: err.message || 'Something went wrong. Please try again or email me directly.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-28 relative">
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-700/8 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-700/6 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Let's Talk
          </p>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have a project in mind? Let's build something intelligent together.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass border border-white/[0.07] rounded-3xl p-7">
              <h3 className="text-xl font-bold text-white mb-2">Let's Connect</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                I'm always open to new opportunities, AI project collaborations, or just a great
                conversation about technology and the future of intelligence.
              </p>

              <div className="space-y-5">
                {INFO.map(({ icon: Icon, label, value, href, copyable }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-0.5">{label}</p>
                      <div className="flex items-center">
                        {href ? (
                          <a
                            href={href}
                            className="text-sm text-gray-300 hover:text-indigo-300 transition-colors font-medium"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-300 font-medium">{value}</p>
                        )}
                        {copyable && <CopyButton text={value} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability card */}
            <div className="glass border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
              <span className="relative flex w-3 h-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm text-gray-300">
                Currently <strong className="text-emerald-300">available</strong> for AI project collaborations and internship opportunities.
              </p>
            </div>
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass border border-white/[0.07] rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{   opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                    >
                      <CheckCircle size={64} className="text-emerald-400 mb-5" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 mb-6 max-w-xs">
                      Thanks for reaching out! I'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{   opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Your Name <span className="text-indigo-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`form-input ${errors.name ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20' : ''}`}
                      />
                      {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address <span className="text-indigo-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`form-input ${errors.email ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20' : ''}`}
                      />
                      {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Message <span className="text-indigo-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell me about your project, idea, or just say hi..."
                        className={`form-input resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20' : ''}`}
                      />
                      {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <Confetti trigger={confetti} />
    </section>
  )
}
