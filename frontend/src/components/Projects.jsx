import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Bot, Dumbbell, Droplets, MessageSquare, Sparkles } from 'lucide-react'

const PROJECTS = [
  {
    icon: Bot,
    title: 'Multi-Agent AI Assistant',
    description:
      'An AI system consisting of specialized orchestration, planning, and execution agents working in tandem to solve complex, multi-step tasks with advanced reasoning and memory.',
    tech: ['Python', 'LangChain', 'OpenAI', 'FastAPI', 'React'],
    gradient: 'from-indigo-600 via-purple-600 to-violet-700',
    glow: 'rgba(99,102,241,0.3)',
    github: '#',
    demo: '#',
    badge: 'Featured',
  },
  {
    icon: Dumbbell,
    title: 'Smart Fitness Planner',
    description:
      'AI-powered fitness recommendation system that creates personalized workout and nutrition plans based on individual goals, fitness level, preferences, and progress tracking.',
    tech: ['Python', 'Scikit-learn', 'React', 'Node.js', 'MongoDB'],
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    glow: 'rgba(139,92,246,0.3)',
    github: '#',
    demo: '#',
    badge: 'ML',
  },
  {
    icon: Droplets,
    title: 'IoT Smart Water Pump',
    description:
      'IoT-enabled water management solution with real-time sensor monitoring, automated control, intelligent scheduling, and a live dashboard to optimize water consumption.',
    tech: ['Arduino', 'Python', 'MQTT', 'React', 'MongoDB'],
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    glow: 'rgba(6,182,212,0.3)',
    github: '#',
    demo: '#',
    badge: 'IoT',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Application',
    description:
      'Modern conversational AI platform with context-aware multi-turn conversations, streaming responses, and seamless integration with various large language models.',
    tech: ['React', 'Node.js', 'OpenAI API', 'Socket.io', 'Tailwind'],
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    glow: 'rgba(16,185,129,0.3)',
    github: '#',
    demo: '#',
    badge: 'LLM',
  },
]

function ProjectCard({ project, index }) {
  const { icon: Icon, title, description, tech, gradient, glow, github, demo, badge } = project
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  const onMouseMove = e => {
    if (isTouch) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rotateY = ((e.clientX - cx) / (rect.width / 2)) * 8
    const rotateX = -((e.clientY - cy) / (rect.height / 2)) * 8
    setTilt({ x: rotateX, y: rotateY })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
      }}
      className="group glass border border-white/[0.07] hover:border-white/15 rounded-3xl overflow-hidden flex flex-col"
    >
      {/* Project banner */}
      <div
        className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
        style={{ boxShadow: `inset 0 -40px 60px rgba(0,0,0,0.4)` }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Large faded icon bg */}
        <Icon
          size={120}
          className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-all duration-500"
        />

        {/* Center icon */}
        <motion.div
          whileHover={{ scale: 1.12, rotate: 6 }}
          className="relative w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ boxShadow: `0 8px 32px ${glow}` }}
        >
          <Icon size={38} className="text-white" />
        </motion.div>

        {/* Badge */}
        <span className="absolute top-4 right-4 text-xs font-bold text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
          {badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tech.map(t => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-2.5">
          <a
            href={github}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white glass border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all hover:scale-105"
          >
            <Github size={14} /> Code
          </a>
          <a
            href={demo}
            className="flex items-center gap-1.5 text-sm text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
          >
            <ExternalLink size={14} /> Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  )
}

const FILTERS = ['All', 'Featured', 'ML', 'IoT', 'LLM']

export default function Projects() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.badge === active)

  return (
    <section id="projects" className="py-28 relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-purple-900/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> My Work
          </p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Things I've built — from AI agents to IoT solutions</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                active === f
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white glass border border-white/10 hover:border-white/20'
              }`}
            >
              {active === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* More on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-gray-400 hover:text-white glass border border-white/10 hover:border-indigo-500/40 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
          >
            <Github size={16} />
            View More on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
