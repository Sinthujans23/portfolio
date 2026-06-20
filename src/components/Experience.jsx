import { motion } from 'framer-motion'
import { GraduationCap, Code2, Brain, Rocket, Sparkles } from 'lucide-react'

const TIMELINE = [
  {
    icon: GraduationCap,
    title: 'AI Student',
    org: 'University — Undergraduate Program',
    period: '2022 — Present',
    status: 'ongoing',
    gradient: 'from-indigo-600 to-purple-600',
    glow: 'rgba(99,102,241,0.4)',
    description:
      'Pursuing an undergraduate degree in Artificial Intelligence, building strong foundations in machine learning, deep learning, neural networks, data structures, and software engineering principles.',
    skills: ['Machine Learning', 'Deep Learning', 'Data Science', 'Algorithms', 'Statistics'],
  },
  {
    icon: Code2,
    title: 'AI Project Developer',
    org: 'Personal & Freelance Projects',
    period: '2023 — Present',
    status: 'ongoing',
    gradient: 'from-purple-600 to-pink-600',
    glow: 'rgba(139,92,246,0.4)',
    description:
      'Designed and shipped multiple AI-powered applications including multi-agent systems, RAG-based knowledge assistants, conversational chatbots, and intelligent recommendation engines.',
    skills: ['LangChain', 'OpenAI API', 'RAG Systems', 'FastAPI', 'React', 'Python'],
  },
  {
    icon: Brain,
    title: 'Machine Learning Learner',
    org: 'Self-Directed & Online Learning',
    period: '2022 — Present',
    status: 'ongoing',
    gradient: 'from-violet-600 to-indigo-600',
    glow: 'rgba(124,58,237,0.4)',
    description:
      'Continuously expanding ML knowledge through structured courses, research papers, and hands-on experiments. Completed specializations from Stanford, DeepLearning.AI, and Coursera.',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'Transformers'],
  },
  {
    icon: Rocket,
    title: 'Future AI Entrepreneur',
    org: 'Vision & Ambition',
    period: '2026 — Future',
    status: 'future',
    gradient: 'from-pink-600 to-orange-500',
    glow: 'rgba(236,72,153,0.4)',
    description:
      'Aspiring to co-found an AI startup that harnesses the power of large language models, agents, and automation to build transformative products that drive a new wave of intelligent software.',
    skills: ['Leadership', 'Product Strategy', 'AI Venture Building', 'Innovation', 'Team Building'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-28 relative">
      <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-700/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Journey
          </p>
          <h2 className="section-title">Experience & Timeline</h2>
          <p className="section-subtitle">My path in AI development and learning</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-7 top-2 bottom-2 w-px">
            <div className="h-full bg-gradient-to-b from-indigo-600/70 via-purple-600/50 to-transparent" />
          </div>

          {TIMELINE.map(({ icon: Icon, title, org, period, status, gradient, glow, description, skills }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.13 }}
              className="relative pl-16 md:pl-24 mb-10 last:mb-0"
            >
              {/* Icon dot */}
              <div
                className={`absolute left-0 md:left-1 w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl z-10`}
                style={{ boxShadow: `0 0 20px ${glow}` }}
              >
                <Icon size={18} className="text-white" />
              </div>

              {/* Card */}
              <motion.div
                whileHover={{ x: 4 }}
                className="glass border border-white/[0.07] hover:border-white/15 rounded-2xl p-6 transition-all group"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:gradient-text transition-all">
                      {title}
                    </h3>
                    <p className="text-indigo-400 text-sm font-medium mt-0.5">{org}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {status === 'ongoing' && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    )}
                    {status === 'future' && (
                      <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                        🎯 Goal
                      </span>
                    )}
                    <span className="text-xs text-gray-500 glass border border-white/10 px-3 py-1 rounded-full font-mono">
                      {period}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s} className="tech-tag-purple">{s}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
