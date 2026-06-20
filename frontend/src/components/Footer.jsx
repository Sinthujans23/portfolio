import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp, Heart, Zap, Terminal } from 'lucide-react'

const LINKS = [
  { label: 'Home',       href: '#home'           },
  { label: 'About',      href: '#about'          },
  { label: 'Skills',     href: '#skills'         },
  { label: 'Projects',   href: '#projects'       },
  { label: 'Experience', href: '#experience'     },
  { label: 'Blog',       href: '#blog'           },
  { label: 'Contact',    href: '#contact'        },
]

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/Sinthujans23',                                    label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:sinthuu07@gmail.com', label: 'Email'    },
]

export default function Footer() {
  const go = href => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-white/[0.05] pt-12 pb-8 z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="container relative">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-black text-lg gradient-text">Sinthujan</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
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
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Bottom row */}
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

          {/* Back to top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white glass border border-white/10 hover:border-indigo-500/40 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowUp size={14} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
