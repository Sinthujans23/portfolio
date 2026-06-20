import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Certs',        href: '#certifications'  },
  { label: 'Blog',         href: '#blog'            },
  { label: 'Contact',      href: '#contact'         },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [open, setOpen]           = useState(false)
  const [active, setActive]       = useState('home')
  const { theme, toggle }         = useTheme()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const ids = LINKS.map(l => l.href.slice(1)).reverse()
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = href => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/[0.06] shadow-xl shadow-black/20 py-3'
          : 'py-5'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => go('#home')}
          className="flex items-center gap-2 group"
          aria-label="Go to home"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-black text-lg gradient-text tracking-tight">Sinthujan</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {LINKS.map(({ label, href }) => {
            const id = href.slice(1)
            const isActive = active === id
            return (
              <button
                key={label}
                onClick={() => go(href)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Theme toggle + CTA */}
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
            className="w-9 h-9 glass border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <a
            href="#contact"
            onClick={e => { e.preventDefault(); go('#contact') }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 glass border border-white/10 rounded-xl flex items-center justify-center hover:border-indigo-500/40 transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate:  90,  opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{   height: 0,      opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden glass-strong border-t border-white/[0.06]"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => go(href)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => go('#contact')}
                className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white"
              >
                Hire Me
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
