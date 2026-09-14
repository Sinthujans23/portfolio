import ArticleBody from '../components/ArticleBody'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Eye, EyeOff } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { GRADIENTS, TAGS, TAG_COLORS } from '../data/articles'

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
  const [form, setForm] = useState(() => {
    try { return { ...INITIAL, ...JSON.parse(localStorage.getItem('article-draft') || '{}') } } catch { return INITIAL }
  })
  const contentRef = useRef(null)
  const [draftStatus, setDraftStatus] = useState('Draft')
  const words = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`

  const [status, setStatus] = useState('idle')
  useEffect(() => {
    if (!isAdmin || status === 'done') return
    const timer = setTimeout(() => {
      try { localStorage.setItem('article-draft', JSON.stringify(form)); setDraftStatus('Draft saved on this device') }
      catch { setDraftStatus('Draft could not be saved on this device') }
    }, 600)
    return () => clearTimeout(timer)
  }, [form, isAdmin, status])
  const [preview, setPreview] = useState(false)
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
      setErrorMsg('Publishing is currently unavailable. Your draft is kept on this device.')
      return
    }
    setStatus('saving')
    setErrorMsg('')
    const slug = slugify(form.title) + '-' + Date.now().toString(36)
    try {
    const { error } = await supabase.from('articles').insert({
      slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tag: form.tag,
      gradient: form.gradient,
      read_time: readTime,
      published: true,
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      try { localStorage.removeItem('article-draft') } catch {}
      setStatus('done')
      setTimeout(() => navigate(`/articles/${slug}`), 600)
    }
    } catch { setStatus('error'); setErrorMsg('Publishing failed. Please try again; your draft is still here.') }
  }

  const insertFormat = (before, after = '') => {
    const input = contentRef.current
    if (!input) return
    const start = input.selectionStart
    const end = input.selectionEnd
    setForm(previous => ({ ...previous, content: previous.content.slice(0, start) + before + previous.content.slice(start, end) + after + previous.content.slice(end) }))
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start + before.length, end + before.length) })
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="container py-12 max-w-4xl">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors glass border border-white/10 px-4 py-2 rounded-xl text-sm"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="text-xl font-bold text-white">New story</h1>
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

        <p className="text-xs text-gray-400 mb-6" role="status">{draftStatus} ? {words} words ? {readTime}</p>

        {errorMsg && (
          <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
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
              <ArticleBody content={form.content} />
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                Title <span className="text-indigo-400">*</span>
              </label>
              <input
                id="title" name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Give your story a clear, compelling title"
                className="form-input text-2xl sm:text-3xl font-bold"
              />
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  id="tag" name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="gradient" className="block text-sm font-medium text-gray-400 mb-2">Accent color</label>
                <select
                  id="gradient" name="gradient"
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
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-400 mb-2">
                Summary
                <span className="text-gray-600 font-normal ml-2">({form.excerpt.length}/200 chars)</span>
              </label>
              <textarea
                id="excerpt" name="excerpt"
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
                Story <span className="text-indigo-400">*</span>
                <span className="text-gray-600 font-normal ml-2">— use blank lines to separate paragraphs</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3" role="toolbar" aria-label="Text formatting">
                {[['Heading', '## ', ''], ['Bold', '**', '**'], ['List', '- ', ''], ['Quote', '> ', ''], ['Code', '\n```\n', '\n```\n']].map(([label, before, after]) => (
                  <button key={label} type="button" onClick={() => insertFormat(before, after)} className="px-3 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/10">{label}</button>
                ))}
              </div>
              <textarea
                ref={contentRef}
                aria-label="Story content"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={22}
                placeholder="Start with an idea. Explain the problem, share what you learned, and give your reader something useful to take away."
                className="form-input resize-y font-mono text-sm leading-relaxed"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
