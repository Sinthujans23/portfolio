import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'home',           label: 'Home'         },
  { id: 'about',          label: 'About'        },
  { id: 'skills',         label: 'Skills'       },
  { id: 'projects',       label: 'Projects'     },
  { id: 'experience',     label: 'Experience'   },
  { id: 'certifications', label: 'Certs'         },
  { id: 'testimonials',   label: 'Testimonials'  },
  { id: 'blog',           label: 'Blog'          },
  { id: 'contact',        label: 'Contact'       },
]

export default function SectionDots() {
  const [active, setActive] = useState('home')
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const ids = [...SECTIONS].reverse().map(s => s.id)
    const onScroll = () => {
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 160) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id
        return (
          <div
            key={id}
            className="relative flex items-center justify-end gap-2 group"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip label */}
            <motion.span
              initial={false}
              animate={{ opacity: hovered === id ? 1 : 0, x: hovered === id ? 0 : 6 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-medium text-gray-400 bg-[#0d0d1a] border border-white/10 px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap"
            >
              {label}
            </motion.span>

            {/* Dot */}
            <button
              onClick={() => go(id)}
              aria-label={`Go to ${label}`}
              className="relative flex items-center justify-center w-5 h-5"
            >
              <motion.span
                animate={{
                  width:  isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  backgroundColor: isActive ? '#818cf8' : 'rgba(255,255,255,0.2)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="rounded-full block"
              />
              {isActive && (
                <motion.span
                  layoutId="dot-ring"
                  className="absolute inset-0 rounded-full border border-indigo-400/50"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
