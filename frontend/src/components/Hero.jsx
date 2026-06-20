import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Mail, Download, MessageSquare, ChevronDown, MapPin } from 'lucide-react'
import MagneticButton from './MagneticButton'

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/Sinthujans23',                                    label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:sinthuu07@gmail.com', label: 'Email' },
]

const ROLES = ['AI Developer', 'ML Enthusiast', 'Software Engineer', 'LLM Engineer']

const ROLE_COLORS = [
  'from-indigo-400 to-purple-400',
  'from-purple-400 to-pink-400',
  'from-cyan-400 to-blue-400',
  'from-emerald-400 to-teal-400',
]

function TypewriterRole() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = ROLES[index]
    let timeout

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 70)
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex(i => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, index])

  return (
    <span className={`bg-gradient-to-r ${ROLE_COLORS[index]} bg-clip-text text-transparent`}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* ── Left content ── */}
          <div className="text-center lg:text-left max-w-xl">

            {/* Available badge */}
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2.5 glass border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm text-gray-300 font-medium">Available for opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-4">
              Hi, I'm{' '}
              <span className="gradient-text">Sinthujan</span>
            </motion.h1>

            {/* Typewriter role */}
            <motion.div {...fadeUp(0.3)} className="flex items-center gap-2 justify-center lg:justify-start mb-6 min-h-[2rem]">
              <span className="text-gray-400 text-base font-medium">I'm a </span>
              <span className="text-base font-bold"><TypewriterRole /></span>
            </motion.div>

            {/* Tagline */}
            <motion.p {...fadeUp(0.4)} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-4">
              Building Intelligent Systems That Solve Real-World Problems.
              Passionate about AI, Machine Learning, and creating solutions that make a difference.
            </motion.p>

            {/* Location */}
            <motion.div {...fadeUp(0.45)} className="flex items-center gap-1.5 justify-center lg:justify-start text-gray-500 text-sm mb-6">
              <MapPin size={14} className="text-indigo-400" />
              <span>Sri Lanka 🇱🇰</span>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.48)} className="grid grid-cols-3 gap-3 mb-8">
              {[
                { num: '10+', label: 'Projects Built'  },
                { num: '5+',  label: 'Certifications'  },
                { num: '2+',  label: 'Years Learning'  },
              ].map(({ num, label }) => (
                <div key={label} className="glass border border-white/[0.07] rounded-2xl p-3 text-center">
                  <p className="text-2xl font-black gradient-text">{num}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <MagneticButton>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Download size={17} />
                  Download CV
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contact"
                  onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="flex items-center gap-2.5 px-7 py-3.5 glass border border-white/10 rounded-xl font-semibold text-white hover:border-indigo-500/50 active:scale-95 transition-all"
                >
                  <MessageSquare size={17} />
                  Contact Me
                </a>
              </MagneticButton>
            </motion.div>

            {/* Social links */}
            <motion.div {...fadeUp(0.6)} className="flex gap-3 justify-center lg:justify-start mb-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 glass border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:scale-110 hover:-translate-y-0.5 transition-all"
                >
                  <Icon size={19} />
                </a>
              ))}
            </motion.div>

            {/* Tech badges */}
            <motion.div {...fadeUp(0.7)} className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {['Python', 'React', 'LangChain', 'OpenAI', 'FastAPI', 'PyTorch'].map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Profile ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1,   x: 0  }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0 relative"
          >
            {/* Spinning gradient ring */}
            <div className="absolute -inset-6 rounded-full">
              <div className="w-full h-full rounded-full border-2 border-dashed border-indigo-500/20 animate-spin-slow" />
            </div>
            <div className="absolute -inset-3 rounded-full border border-purple-500/15" />

            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-3xl scale-125" />

            {/* Avatar circle */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-indigo-500/50 glow-indigo"
            >
              <img
                src="/profile.jpg"
                alt="Sinthujan — AI Developer"
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
              {/* Subtle gradient overlay at bottom for depth */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-950/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating badge – AI */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-2 -right-2 glass border border-indigo-500/30 rounded-2xl px-3.5 py-2 shadow-xl"
            >
              <p className="text-xs font-bold text-indigo-300">🤖 AI Developer</p>
            </motion.div>

            {/* Floating badge – ML */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -left-2 glass border border-purple-500/30 rounded-2xl px-3.5 py-2 shadow-xl"
            >
              <p className="text-xs font-bold text-purple-300">🚀 ML Engineer</p>
            </motion.div>

            {/* Floating badge – LLM */}
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute top-1/2 -right-14 -translate-y-1/2 glass border border-cyan-500/30 rounded-2xl px-3.5 py-2 shadow-xl"
            >
              <p className="text-xs font-bold text-cyan-300">⚡ LLM Expert</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="text-gray-600" />
      </motion.div>
    </section>
  )
}
