import { motion } from 'framer-motion'
import { Award, Bot, Box, ExternalLink, Sparkles } from 'lucide-react'

const CERTS = [
  {
    Icon: Bot,
    name: 'LangChain & LLM Applications',
    issuer: 'DeepLearning.AI',
    date: '2024',
    gradient: 'from-green-600 to-cyan-600',
    link: '#',
  },
  {
    Icon: Box,
    name: 'Docker & Containerization',
    issuer: 'Udemy',
    date: '2023',
    gradient: 'from-sky-600 to-blue-600',
    link: '#',
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-28 relative">
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-700/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Credentials
          </p>
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Verified skills and continuous learning achievements</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTS.map(({ Icon, name, issuer, date, gradient, link }, i) => (
            <motion.a
              key={name}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group glass border border-white/[0.07] hover:border-white/15 rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} className="text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:gradient-text transition-all">
                  {name}
                </h3>
                <p className="text-xs text-indigo-400 font-medium leading-tight">{issuer}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-gray-600 font-mono">{date}</span>
                <div className="flex items-center gap-1 text-gray-600 group-hover:text-indigo-400 transition-colors">
                  <Award size={12} />
                  <ExternalLink size={11} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
