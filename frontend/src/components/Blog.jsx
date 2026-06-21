import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Clock, PenLine, Eye, Sparkles } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { STATIC_ARTICLES, TAG_COLORS } from '../data/articles'

function useBlogViews() {
  const [views, setViews] = useState({})
  useEffect(() => {
    if (!hasSupabaseConfig) return
    const slugs = STATIC_ARTICLES.map(a => a.slug)
    supabase
      .from('blog_views')
      .select('slug')
      .in('slug', slugs)
      .then(({ data }) => {
        if (!data) return
        const counts = {}
        data.forEach(r => { counts[r.slug] = (counts[r.slug] || 0) + 1 })
        setViews(counts)
      })
  }, [])
  return [views, setViews]
}

async function trackView(slug) {
  if (!hasSupabaseConfig) return
  await supabase.from('blog_views').insert({ slug })
}

export default function Blog() {
  const navigate = useNavigate()
  const [views, setViews] = useBlogViews()

  const handleClick = async (slug) => {
    await trackView(slug)
    setViews(prev => ({ ...prev, [slug]: (prev[slug] || 0) + 1 }))
  }

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
          {STATIC_ARTICLES.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/articles/${article.slug}`}
                onClick={() => handleClick(article.slug)}
                className="group glass border border-white/[0.07] hover:border-white/15 rounded-3xl overflow-hidden flex flex-col transition-all cursor-pointer"
              >
                <div className={`h-1 bg-gradient-to-r ${article.gradient}`} />

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[article.tag] || 'text-gray-300 bg-white/5 border-white/10'}`}>
                      {article.tag}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">{article.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:gradient-text transition-all">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-5">{article.excerpt}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                      {views[article.slug] > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {views[article.slug]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-400 transition-colors">
                      Read more →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate('/articles')}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white glass border border-white/10 hover:border-indigo-500/40 px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            <Sparkles size={15} />
            View all articles
          </button>
        </motion.div>
      </div>
    </section>
  )
}
