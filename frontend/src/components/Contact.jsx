import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, Github, Linkedin, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import Confetti from './Confetti'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const EMAIL = 'sinthuu07@gmail.com'

const SOCIALS = [
  { icon: Mail, label: 'Email', href: `mailto:${EMAIL}` },
  { icon: Github, label: 'GitHub', href: 'https://github.com/Sinthujans23' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2' },
]

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
    if (!hasSupabaseConfig) {
      setErrors({ message: 'Contact form is not configured yet. Please email me directly.' })
      return
    }
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

        <div className="contact-layout">
          <div id="contact-star-stage" className="contact-star-stage">
            <canvas className="contact-star-canvas" aria-hidden="true" />
            <div className="contact-star-copy">
              <h3 className="text-white font-bold">Connect</h3>
              <div className="contact-star-socials">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('https:') ? '_blank' : undefined}
                    rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    title={label}
                    className="glass border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-indigo-400 hover:border-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 focus-visible:outline-offset-4 transition-colors"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
              <p className="text-gray-300">Open to AI roles, collaborations, and freelance projects.</p>
            </div>
          </div>
          <div className="contact-panels min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0"
          >
            <div className="glass border border-white/[0.07] rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
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
      </div>
      <Confetti trigger={confetti} />
    </section>
  )
}
