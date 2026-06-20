import { motion } from 'framer-motion'
import { Brain, Code2, Rocket, Target, Sparkles } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Brain,    title: 'AI & ML Focus',     desc: 'Deep expertise in building intelligent systems with cutting-edge ML frameworks and architectures.' },
  { icon: Code2,    title: 'Full-Stack Dev',     desc: 'End-to-end development—from beautiful UIs to backend APIs and AI model integration.' },
  { icon: Rocket,   title: 'Startup Mindset',   desc: 'Entrepreneurial approach: shipping fast, iterating, and solving real problems with technology.' },
  { icon: Target,   title: 'Vision Driven',     desc: 'Aspiring AI Entrepreneur & CEO—building products that leverage AI for lasting impact.' },
]

const STATS = [
  { value: '10+', label: 'Projects Built'    },
  { value: '20+', label: 'Technologies'      },
  { value: '5+',  label: 'AI Models Trained' },
  { value: '8+',  label: 'Certifications'    },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 30 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay },
})

export default function About() {
  return (
    <section id="about" className="py-28 relative">
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-700/8 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        {/* Heading */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Who I Am
          </p>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know the person behind the code</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start mb-12">
          {/* Bio card */}
          <motion.div
            {...fadeUp(0.15)}
            className="lg:col-span-3 glass border border-white/[0.07] rounded-3xl p-8 md:p-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-snug">
              Passionate AI Developer from{' '}
              <span className="gradient-text">Sri Lanka</span> 🇱🇰
            </h3>

            <div className="space-y-4 text-gray-400 leading-relaxed text-[0.95rem]">
              <p>
                I'm an <strong className="text-gray-200">AI undergraduate student</strong> with a deep passion
                for Artificial Intelligence, Machine Learning, and Software Development. My journey in tech
                started with curiosity about how machines can learn and autonomously solve complex problems.
              </p>
              <p>
                I specialize in building AI-powered applications—from intelligent chatbots and multi-agent
                orchestration systems to IoT solutions and RAG-powered knowledge bases. I love taking an
                idea from concept to a working product that delivers real value.
              </p>
              <p>
                My ultimate goal is to become an{' '}
                <strong className="text-indigo-300">AI Entrepreneur and CEO</strong>, founding a company
                that uses artificial intelligence to solve industry-wide problems and creates products
                that genuinely improve people's lives.
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                ['🎓', 'AI Undergraduate Student'],
                ['🌍', 'Based in Sri Lanka'],
                ['💡', 'AI Entrepreneur Aspirant'],
                ['🔭', 'Currently building AI Agents'],
              ].map(([emoji, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-lg">{emoji}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Highlight cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(0.2 + i * 0.08)}
                whileHover={{ y: -3, scale: 1.01 }}
                className="glass border border-white/[0.07] hover:border-indigo-500/25 rounded-2xl p-5 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                  <Icon size={19} className="text-white" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              {...fadeUp(0.3 + i * 0.07)}
              whileHover={{ scale: 1.04 }}
              className="glass border border-white/[0.07] hover:border-indigo-500/25 rounded-2xl p-6 text-center transition-all group"
            >
              <p className="text-4xl font-black gradient-text mb-1 group-hover:scale-105 transition-transform inline-block">
                {value}
              </p>
              <p className="text-xs text-gray-500 font-medium tracking-wide">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
