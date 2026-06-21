import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Eye, Calendar } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { STATIC_ARTICLES, TAG_COLORS } from '../data/articles'

export default function ArticleView() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [views, setViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const staticMatch = STATIC_ARTICLES.find(a => a.slug === slug)

    if (hasSupabaseConfig) {
      supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()
        .then(({ data }) => {
          if (data) {
            setArticle({
              ...data,
              readTime: data.read_time,
              date: new Date(data.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              }),
            })
          } else if (staticMatch) {
            setArticle(staticMatch)
          }
          setLoading(false)
        })

      supabase.from('blog_views').insert({ slug })

      supabase
        .from('blog_views')
        .select('slug', { count: 'exact' })
        .eq('slug', slug)
        .then(({ count }) => { if (count) setViews(count) })
    } else {
      setArticle(staticMatch || null)
      setLoading(false)
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-400 text-lg">Article not found.</p>
        <button
          onClick={() => navigate('/articles')}
          className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
        >
          ← Back to articles
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh text-white">
      <div className="container py-12 max-w-3xl">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm glass border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={15} /> All Articles
        </motion.button>

        {/* Banner line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className={`h-1 bg-gradient-to-r ${article.gradient || 'from-indigo-600 to-purple-600'} rounded-full mb-8 origin-left`}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[article.tag] || 'text-gray-300 bg-white/5 border-white/10'}`}>
            {article.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-5 mb-4 leading-tight">{article.title}</h1>
          {article.excerpt && (
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{article.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-8 border-b border-white/[0.07]">
            {article.date && (
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {article.date}</span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1.5"><Clock size={13} /> {article.readTime}</span>
            )}
            {views > 0 && (
              <span className="flex items-center gap-1.5"><Eye size={13} /> {views} views</span>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {article.content ? (
            <div className="space-y-4">
              {article.content.split('\n').map((para, i) =>
                para.trim()
                  ? <p key={i} className="text-gray-300 leading-relaxed text-base">{para}</p>
                  : <div key={i} className="h-3" />
              )}
            </div>
          ) : (
            <div className="glass border border-white/[0.07] rounded-2xl p-10 text-center">
              <p className="text-gray-500 mb-2 text-base">Full article coming soon.</p>
              <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">{article.excerpt}</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
