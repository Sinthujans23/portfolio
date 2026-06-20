import { motion } from 'framer-motion'
import { Quote, Sparkles } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Arun Krishnan',
    role: 'AI Research Peer · University',
    initials: 'AK',
    gradient: 'from-indigo-500 to-purple-500',
    text: "Sinthujan has an exceptional ability to break down complex AI concepts and turn them into working systems. His multi-agent project blew us away — the kind of thinking that belongs in a startup.",
  },
  {
    name: 'Priya Navaratnam',
    role: 'Full-Stack Developer · Peer',
    initials: 'PN',
    gradient: 'from-purple-500 to-pink-500',
    text: "Collaborating with Sinthujan on the IoT project was a great experience. He brings deep technical knowledge and a real drive to make things work end-to-end. Truly a full-stack AI developer.",
  },
  {
    name: 'Dr. Ramesh Selvan',
    role: 'Lecturer · AI Department',
    initials: 'RS',
    gradient: 'from-cyan-500 to-blue-500',
    text: "One of the most self-motivated students I've taught. Sinthujan consistently goes beyond the curriculum — exploring LLMs, agents, and RAG systems independently. His future is very bright.",
  },
  {
    name: 'Kavitha Jeganathan',
    role: 'Project Collaborator',
    initials: 'KJ',
    gradient: 'from-emerald-500 to-teal-500',
    text: "What sets Sinthujan apart is his product mindset. He doesn't just build features — he thinks about the user experience and real-world impact. A rare combination of AI skill and entrepreneurial vision.",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-64 bg-indigo-900/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Kind Words
          </p>
          <h2 className="section-title">Testimonials</h2>
          <p className="section-subtitle">What peers, collaborators and mentors say</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map(({ name, role, initials, gradient, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass border border-white/[0.07] hover:border-indigo-500/25 rounded-3xl p-7 flex flex-col gap-5 transition-all group"
            >
              {/* Quote icon */}
              <Quote size={28} className="text-indigo-500/40 group-hover:text-indigo-500/60 transition-colors flex-shrink-0" />

              {/* Text */}
              <p className="text-gray-400 text-sm leading-relaxed flex-1 italic">"{text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
