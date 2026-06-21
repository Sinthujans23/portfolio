import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, PenLine, Clock, Eye, Search, Lock, Trash2, AlertTriangle } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { STATIC_ARTICLES, TAG_COLORS } from '../data/articles'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function fromDb(a) {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || '',
    tag: a.tag || 'General',
    readTime: a.read_time || '5 min read',
    date: formatDate(a.created_at),
    gradient: a.gradient || 'from-indigo-600 to-purple-600',
    content: a.content,
    fromDb: true,
  }
}

export default function AllArticles() {
  const navigate = useNavigate()
  const [dbArticles, setDbArticles] = useState([])
  const [views, setViews] = useState({})
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('admin_auth') === 'true')

  // Password modal
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState('write') // 'write' | 'admin'
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)

  // Delete confirm
  const [deletingSlug, setDeletingSlug] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!hasSupabaseConfig) return
    supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setDbArticles(data.map(fromDb)) })

    supabase
      .from('blog_views')
      .select('slug')
      .then(({ data }) => {
        if (!data) return
        const counts = {}
        data.forEach(r => { counts[r.slug] = (counts[r.slug] || 0) + 1 })
        setViews(counts)
      })
  }, [])

  const all = [...dbArticles, ...STATIC_ARTICLES]
  const tags = ['All', ...new Set(all.map(a => a.tag))]

  const filtered = all.filter(a => {
    const tagOk = activeTag === 'All' || a.tag === activeTag
    const q = search.toLowerCase()
    const searchOk = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    return tagOk && searchOk
  })

  const openModal = (action) => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      if (action === 'write') navigate('/articles/write')
      else setIsAdmin(true)
    } else {
      setModalAction(action)
      setShowModal(true)
    }
  }

  const submitPassword = e => {
    e.preventDefault()
    const correct = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === correct) {
      sessionStorage.setItem('admin_auth', 'true')
      setIsAdmin(true)
      setShowModal(false)
      setPassword('')
      if (modalAction === 'write') navigate('/articles/write')
    } else {
      setPwError(true)
      setPassword('')
    }
  }

  const handleDelete = async () => {
    if (!deletingSlug) return
    setDeleting(true)
    setDeleteError('')

    const apiBase = import.meta.env.VITE_API_URL || ''
    const response = await fetch(`${apiBase}/api/articles/${encodeURIComponent(deletingSlug)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
      },
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      setDeleteError(result.error || 'Failed to delete article from the database.')
      setDeleting(false)
      return
    }

    setDbArticles(prev => prev.filter(a => a.slug !== deletingSlug))
    setViews(prev => {
      const next = { ...prev }
      delete next[deletingSlug]
      return next
    })
    setDeletingSlug(null)
    setDeleting(false)
  }

  return (
    <div className="min-h-screen bg-mesh text-white">
      <div className="container py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors glass border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl text-sm"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">All Articles</h1>
              <p className="text-gray-600 text-sm">{filtered.length} articles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button
                onClick={() => openModal('admin')}
                className="flex items-center gap-2 px-4 py-2.5 glass border border-white/10 hover:border-white/20 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
              >
                <Lock size={14} /> Admin
              </button>
            )}
            <button
              onClick={() => openModal('write')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
            >
              <PenLine size={15} /> Write Article
            </button>
          </div>
        </div>

        {/* Search + Tags */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTag === t
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 text-gray-600"
            >
              <PenLine size={40} className="mx-auto mb-4 opacity-30" />
              <p>No articles found.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.25 } }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative group/card"
              >
                <Link
                  to={`/articles/${article.slug}`}
                  className="group glass border border-white/[0.07] hover:border-white/15 rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 block"
                >
                  <div className={`h-1 bg-gradient-to-r ${article.gradient}`} />
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[article.tag] || 'text-gray-300 bg-white/5 border-white/10'}`}>
                        {article.tag}
                      </span>
                      <span className="text-xs text-gray-600 font-mono">{article.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:gradient-text transition-all line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-5 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
                        {views[article.slug] > 0 && (
                          <span className="flex items-center gap-1"><Eye size={11} /> {views[article.slug]}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors">Read →</span>
                    </div>
                  </div>
                </Link>

                {/* Delete button — only for DB articles when admin */}
                {isAdmin && article.fromDb && (
                  <button
                    onClick={() => { setDeletingSlug(article.slug); setDeleteError('') }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 opacity-0 group-hover/card:opacity-100 hover:bg-red-500/25 hover:border-red-500/40 transition-all"
                    title="Delete article"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Admin Access</h3>
            </div>
            <form onSubmit={submitPassword}>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwError(false) }}
                placeholder="Enter admin password"
                autoFocus
                className={`w-full bg-white/5 border ${pwError ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 mb-2`}
              />
              {pwError && <p className="text-xs text-red-400 mb-2">Incorrect password</p>}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setPassword(''); setPwError(false) }}
                  className="flex-1 py-2.5 glass border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                >
                  Enter
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass border border-red-500/20 rounded-3xl p-8 w-full max-w-sm mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Article?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2 leading-relaxed">
              This will permanently remove the article. This action cannot be undone.
            </p>
            <p className="text-gray-600 text-xs font-mono mb-6 truncate">{deletingSlug}</p>
            {deleteError && (
              <p className="text-xs text-red-400 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setDeletingSlug(null); setDeleteError('') }}
                disabled={deleting}
                className="flex-1 py-2.5 glass border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-red-500/20"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
