import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Programming',
    emoji: '💻',
    gradient: 'from-blue-600 to-cyan-500',
    border: 'hover:border-blue-500/30',
    skills: [
      { name: 'Python',     level: 90 },
      { name: 'Java',       level: 75 },
      { name: 'JavaScript', level: 85 },
      { name: 'C++',        level: 65 },
    ],
  },
  {
    name: 'Frontend',
    emoji: '🎨',
    gradient: 'from-indigo-600 to-blue-500',
    border: 'hover:border-indigo-500/30',
    skills: [
      { name: 'React',        level: 85 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'HTML',         level: 95 },
      { name: 'CSS',          level: 88 },
    ],
  },
  {
    name: 'Backend',
    emoji: '⚙️',
    gradient: 'from-violet-600 to-indigo-500',
    border: 'hover:border-violet-500/30',
    skills: [
      { name: 'Node.js', level: 78 },
      { name: 'Express', level: 75 },
    ],
  },
  {
    name: 'AI & Machine Learning',
    emoji: '🤖',
    gradient: 'from-purple-600 to-violet-500',
    border: 'hover:border-purple-500/30',
    isWide: true,
    skills: [
      { name: 'Machine Learning',  level: 85 },
      { name: 'Deep Learning',     level: 80 },
      { name: 'LLM Applications',  level: 88 },
      { name: 'Prompt Engineering',level: 92 },
      { name: 'AI Agents',         level: 83 },
      { name: 'RAG Systems',       level: 80 },
    ],
  },
  {
    name: 'Tools & DevOps',
    emoji: '🛠️',
    gradient: 'from-pink-600 to-purple-500',
    border: 'hover:border-pink-500/30',
    skills: [
      { name: 'Git',    level: 88 },
      { name: 'GitHub', level: 90 },
      { name: 'VS Code',level: 95 },
      { name: 'Docker', level: 65 },
    ],
  },
]

function SkillBar({ name, level, delay, gradFrom, gradTo }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{name}</span>
        <span className="text-xs text-gray-500 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${gradFrom}, ${gradTo})` }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 relative">
      <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-700/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> My Toolkit
          </p>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with to build intelligent solutions</p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CATEGORIES.map(({ name, emoji, gradient, border, skills, isWide }, catIdx) => {
            const [from, to] = gradient.replace('from-', '').replace(' to-', ' ').split(' ')
            const fromColor = `var(--tw-gradient-from, #6366f1)`
            const toColor   = `var(--tw-gradient-to, #8b5cf6)`

            /* derive actual CSS colors from gradient class */
            const colorMap = {
              'blue-600':   '#2563eb', 'cyan-500':   '#06b6d4',
              'indigo-600': '#4f46e5', 'blue-500':   '#3b82f6',
              'violet-600': '#7c3aed', 'indigo-500': '#6366f1',
              'purple-600': '#9333ea', 'violet-500': '#8b5cf6',
              'pink-600':   '#db2777', 'purple-500': '#a855f7',
            }
            const parts = gradient.split(' ')
            const gFrom = colorMap[parts[0].replace('from-', '')] || '#6366f1'
            const gTo   = colorMap[parts[1].replace('to-', '')]   || '#8b5cf6'

            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: catIdx * 0.08 }}
                className={`glass border border-white/[0.07] ${border} rounded-3xl p-6 transition-all group ${
                  isWide ? 'md:col-span-2 xl:col-span-1' : ''
                }`}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {emoji}
                  </div>
                  <h3 className="text-base font-bold text-white">{name}</h3>
                </div>

                {/* Skill bars */}
                <div className="space-y-4">
                  {skills.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={catIdx * 0.08 + i * 0.06}
                      gradFrom={gFrom}
                      gradTo={gTo}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
