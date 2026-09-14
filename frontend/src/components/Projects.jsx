import CodeBackground from './CodeBackground'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Github, Cpu } from 'lucide-react'

const PROJECTS = [
  {
    icon: Cpu,
    title: 'Shuttle Thrower – AI-Enabled Smart Badminton Training System',
    description: 'An automated badminton shuttle-feeding system that combines hardware, AI, and wireless communication for real-time player-position-based shuttle control.',
    highlights: [
      'Programmable shuttle direction, motion control, and training levels.',
      'AI-based player position detection using Python, OpenCV, MediaPipe, and real-time camera input.',
      'Arduino-controlled servo feeding, stepper-motor movement, and a keypad/LCD interface.',
      'IoT training-session tracking with ESP8266, Google Sheets, and a Thunkable mobile app.',
    ],
    tech: ['Arduino Mega', 'Python', 'ESP8266', 'IoT', 'OpenCV', 'MediaPipe', 'Google Sheets', 'Thunkable'],
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
    glow: 'rgba(245,158,11,0.3)',
    badge: 'AI & IoT',
  },
  {
    icon: Github,
    title: 'Redef & Focas Director Board',
    description: 'An organization news site where a single admin publishes text, photo, and video updates and manages the organization’s public details. Visitors can view posts, like them, and leave comments without an account.',
    highlights: [
      'Login-protected admin dashboard with exclusive access to create and delete posts.',
      'Editable organization profile with name, tagline, description, logo, contact information, and social links displayed on the public homepage.',
      'Public likes and comments attributed through a lightweight per-browser identity, with no account required.',
      'A notification bell counts new posts since the viewer’s last visit using background polling.',
      'Admin authentication using a JWT stored in an httpOnly cookie and passwords hashed with bcrypt.',
    ],
    tech: ['Next.js App Router', 'TypeScript', 'MongoDB', 'Mongoose', 'Tailwind CSS', 'JWT', 'bcrypt'],
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    glow: 'rgba(6,182,212,0.3)',
    github: 'https://github.com/Sinthujans23/Radef-focas-Project',
    badge: 'Featured',
  },
  {
    icon: Github,
    title: 'AgenticQA Engineer with Self-Healing Test Automation',
    description: 'An AI-powered QA platform that converts natural-language test requests into executable Playwright test plans, generates automated test scripts, validates application flows, and supports self-healing test execution through a VS Code extension and Node.js orchestrator.',
    responsibilities: 'App Knowledge Packs, Retrieval-First Planning, Auditor, Test Script Generator Agent, and Test Planner Agent.',
    highlights: [
      'Implemented the App Knowledge Pack schema and automated loader for credentials, routes, golden flows, assertion aliases, stable elements, and planner guidance with strict integrity rules.',
      'Built a field-weighted BM25F flow retrieval engine with key-coverage tie-breaking, abstention handling, and interaction promotion for accurate multi-step form-flow matching.',
      'Developed deterministic-first and RAG-based planning logic to generate grounded test plans from verified golden flows and page-scoped context.',
      'Implemented plan grounding with wait stabilization, element snapping, role-aware matching, input preservation, and assertion restoration to prevent false-positive passing tests.',
      'Built an automated knowledge-pack generator using static extraction, crawling, route and credential detection, model synthesis, and flow validation before inclusion.',
      'Developed the Playwright test script generator with role-informed locator emission, step identity markers, and accessibility-first locator best practices.',
      'Created a substance auditor to classify generated tests as vacuous, under-tested, off-target, or substantive, helping compare raw pass rates with meaningful test coverage.',
    ],
    tech: ['TypeScript', 'Node.js', 'Playwright', 'VS Code Extension API', 'OpenAI/LLM APIs', 'RAG', 'BM25F Retrieval', 'Zod', 'PostgreSQL/pgvector', 'React', 'Vite'],
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    glow: 'rgba(16,185,129,0.3)',
    github: 'https://github.com/LahiruPramuditha2003/AgenticQA-private-archive',
    badge: 'Featured',
  },
]

function ProjectCard({ project, index }) {
  const [isActive, setIsActive] = useState(false)
  const titleRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const isInView = useInView(titleRef, { once: true, amount: 0.5, margin: '0px 0px -35% 0px' })
  const { title, description, responsibilities, highlights, tech, github } = project

  useEffect(() => {
    if (isInView) setIsActive(true)
  }, [isInView])

  return (
    <article className="border-b border-white/10 last:border-b-0">
      <button
        ref={titleRef}
        type="button"
        onClick={() => setIsActive(true)}
        className={`w-full flex items-center gap-4 py-7 sm:py-9 text-left transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}
        aria-expanded={isActive}
        aria-controls={`project-details-${index}`}
      >
        <span className="text-xs font-mono text-indigo-400">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="flex-1 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          {title}
        </h3>
        <span className={`text-xl transition-transform duration-500 ${isActive ? 'rotate-45 text-indigo-300' : ''}`} aria-hidden="true">+</span>
      </button>
      <motion.div
        id={`project-details-${index}`}
        aria-hidden={!isActive}
        inert={!isActive ? '' : undefined}
        initial={false}
        animate={{
          height: isActive ? 'auto' : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: 'easeOut' }}
        className="max-w-4xl mx-auto overflow-hidden"
      >
        <div className="pb-16 sm:pb-24">
          <p className="text-gray-400 text-base leading-relaxed mb-8">{description}</p>
          {responsibilities && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">My Contribution & Main Responsibilities</h4>
              <p className="text-gray-400 text-base leading-relaxed">{responsibilities}</p>
            </div>
          )}
          {highlights && (
            <ul className="list-disc pl-5 space-y-3 text-gray-400 text-base leading-relaxed mb-5">
              {highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
            </ul>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tech.map(t => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>

          {/* Links */}
          {github && <div className="flex gap-2.5">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white glass border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all hover:scale-105"
            >
              <Github size={14} /> Code
            </a>
          </div>}
        </div>
      </motion.div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 relative isolate overflow-x-clip">
      <CodeBackground section="projects" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-64 bg-purple-900/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            
          </p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Things I've built — from AI agents to IoT solutions</p>
        </motion.div>

        <div className="flex flex-col max-w-5xl mx-auto border-t border-white/10">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* More on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/Sinthujans23"
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
