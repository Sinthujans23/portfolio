import { useState } from 'react'
import { Github, Linkedin, Mail, Heart, Zap, Terminal, Send, CheckCircle } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const LINKS = [
  { label: 'Home',       href: '#home'       },
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog',       href: '#blog'       },
  { label: 'Contact',    href: '#contact'    },
]

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/Sinthujans23',                              label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2',    label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:sinthuu07@gmail.com',                                   label: 'Email'    },
]

function NewsletterForm() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | duplicate | error

  const submit = async e => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) return
    if (!hasSupabaseConfig) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('subscribers').insert({ email })
    if (!error) {
      setStatus('done')
    } else if (error.code === '23505') {
      setStatus('duplicate')
    } else {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle size={16} /> You're subscribed!
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mt-3">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus('idle') }}
        placeholder="your@email.com"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all min-w-0"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-60 flex-shrink-0"
      >
        <Send size={13} />
        {status === 'loading' ? '…' : 'Subscribe'}
      </button>
      {(status === 'duplicate') && (
        <p className="absolute mt-10 text-xs text-yellow-400">Already subscribed!</p>
      )}
      {(status === 'error') && (
        <p className="absolute mt-10 text-xs text-red-400">Something went wrong.</p>
      )}
    </form>
  )
}

export default function Footer() {
  const go = href => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="relative border-t border-white/[0.05] pt-12 pb-8 z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="container relative">
        <div className="grid md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-black text-lg gradient-text">Sinthujan</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI Developer building intelligent systems that solve real-world problems.
              Based in Sri Lanka 🇱🇰
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => go(href)}
                  className="text-left text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 glass border border-white/10 hover:border-indigo-500/40 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:scale-110 hover:-translate-y-0.5 transition-all"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Open to AI roles, collaborations, and freelance projects.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-gray-600 mb-1">Get notified when I publish new articles.</p>
            <div className="relative">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs text-gray-600 flex items-center gap-1.5">
              © {new Date().getFullYear()} Sinthujan. Made with{' '}
              <Heart size={12} className="text-red-500 fill-red-500" /> &{' '}
              <span className="text-indigo-400">AI</span>. All rights reserved.
            </p>
            <span
              title="Press Ctrl+` to open terminal"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-700 hover:text-indigo-400 transition-colors cursor-default"
            >
              <Terminal size={11} /> Ctrl+`
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}
