import { motion } from 'framer-motion'
import { ExternalLink, Clock, Sparkles, PenLine } from 'lucide-react'

const ARTICLES = [
  {
    title: 'Building a Multi-Agent AI System with LangChain',
    excerpt: 'A deep dive into designing orchestration, planning, and execution agents that work in tandem to solve complex multi-step tasks with memory and reasoning.',
    tag: 'AI Agents',
    tagColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25',
    readTime: '8 min read',
    date: 'Dec 2024',
    href: '#',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    title: 'RAG Systems Explained: From Theory to Production',
    excerpt: 'How retrieval-augmented generation works under the hood, the chunking strategies that matter, and lessons learned building a production RAG pipeline.',
    tag: 'LLM',
    tagColor: 'text-purple-300 bg-purple-500/10 border-purple-500/25',
    readTime: '6 min read',
    date: 'Nov 2024',
    href: '#',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Prompt Engineering Patterns I Use Every Day',
    excerpt: 'Chain-of-thought, few-shot, role prompting, self-consistency — practical patterns with real examples that reliably improve LLM output quality.',
    tag: 'Prompt Eng.',
    tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
    readTime: '5 min read',
    date: 'Oct 2024',
    href: '#',
    gradient: 'from-cyan-600 to-blue-600',
  },
]

export default function Blog() {
  return (
    <section id="blog" className="py-28 relative">
      <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-700/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <PenLine size={14} /> Writing
          </p>
          <h2 className="section-title">Blog & Articles</h2>
          <p className="section-subtitle">Thoughts on AI, ML, and building intelligent systems</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {ARTICLES.map(({ title, excerpt, tag, tagColor, readTime, date, href, gradient }, i) => (
            <motion.a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group glass border border-white/[0.07] hover:border-white/15 rounded-3xl overflow-hidden flex flex-col transition-all cursor-pointer"
            >
              {/* Top accent bar */}
              <div className={`h-1 bg-gradient-to-r ${gradient}`} />

              <div className="flex flex-col flex-1 p-6">
                {/* Tag + date */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColor}`}>
                    {tag}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">{date}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:gradient-text transition-all">
                  {title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-5">{excerpt}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock size={11} />
                    {readTime}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-400 transition-colors">
                    Read more <ExternalLink size={11} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-center mt-10"
        >
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white glass border border-white/10 hover:border-indigo-500/40 px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            <PenLine size={15} />
            View all articles
          </a>
        </motion.div>
      </div>
    </section>
  )
}
