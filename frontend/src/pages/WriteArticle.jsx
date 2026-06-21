import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Eye, EyeOff } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { GRADIENTS, TAGS, READ_TIMES, TAG_COLORS } from '../data/articles'

function slugify(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const INITIAL = { title: '', tag: 'AI Agents', readTime: '5 min read', excerpt: '', content: '', gradient: GRADIENTS[0] }

export default function WriteArticle() {
  const navigate = useNavigate()
  const [isAdmin] = useState(() => sessionStorage.getItem('admin_auth') === 'true')
  const [form, setForm] = useState(INITIAL)
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isAdmin) navigate('/articles')
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  const handleChange = ({ target: { name, value } }) =>
    setForm(prev => ({ ...prev, [name]: value }))

  const handlePublish = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setErrorMsg('Title and content are required.')
      return
    }
    if (!hasSupabaseConfig) {
      setErrorMsg('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_KEY to your environment.')
      return
    }
    setStatus('saving')
    setErrorMsg('')
    const slug = slugify(form.title) + '-' + Date.now().toString(36)
    const { error } = await supabase.from('articles').insert({
      slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tag: form.tag,
      gradient: form.gradient,
      read_time: form.readTime,
      published: true,
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('done')
      setTimeout(() => navigate(`/articles/${slug}`), 600)
    }
  }

  return (
    <div className="min-h-screen bg-mesh text-white">
      <div className="container py-12 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors glass border border-white/10 px-4 py-2 rounded-xl text-sm"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="text-xl font-bold text-white">Write Article</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(p => !p)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white glass border border-white/10 px-4 py-2 rounded-xl transition-all"
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handlePublish}
              disabled={status === 'saving' || status === 'done'}
              className="flex items-center gap-1.5 text-sm text-white px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/20"
            >
              <Send size={14} />
              {status === 'saving' ? 'Publishing…' : status === 'done' ? 'Published!' : 'Publish'}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border border-white/[0.07] rounded-3xl overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${form.gradient}`} />
            <div className="p-8">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[form.tag] || 'text-gray-300 bg-white/5 border-white/10'}`}>
                {form.tag}
              </span>
              <h1 className="text-3xl font-bold text-white mt-5 mb-3 leading-tight">{form.title || 'Untitled'}</h1>
              {form.excerpt && <p className="text-gray-400 text-base mb-8 leading-relaxed border-b border-white/5 pb-8">{form.excerpt}</p>}
              <div className="space-y-4">
                {form.content.split('\n').map((p, i) =>
                  p.trim()
                    ? <p key={i} className="text-gray-300 leading-relaxed">{p}</p>
                    : <div key={i} className="h-2" />
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Title <span className="text-indigo-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Article title..."
                className="form-input text-lg font-medium"
              />
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tag</label>
                <select
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                <select
                  name="readTime"
                  value={form.readTime}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {READ_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Color Theme</label>
                <select
                  name="gradient"
                  value={form.gradient}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {GRADIENTS.map((g, i) => <option key={g} value={g}>Theme {i + 1}</option>)}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Excerpt
                <span className="text-gray-600 font-normal ml-2">({form.excerpt.length}/200 chars)</span>
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                maxLength={200}
                rows={2}
                placeholder="Brief summary shown on the article card..."
                className="form-input resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Content <span className="text-indigo-400">*</span>
                <span className="text-gray-600 font-normal ml-2">— use blank lines to separate paragraphs</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={22}
                placeholder="Write your article here..."
                className="form-input resize-y font-mono text-sm leading-relaxed"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
