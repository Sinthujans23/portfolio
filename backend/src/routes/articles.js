import { Router } from 'express'

const router = Router()

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function requireArticleAdmin(req, res, next) {
  const configuredPassword = process.env.ADMIN_PASSWORD
  const providedPassword = req.get('x-admin-password')

  if (!configuredPassword) {
    return res.status(503).json({ error: 'Article admin is not configured.' })
  }

  if (providedPassword !== configuredPassword) {
    return res.status(401).json({ error: 'Invalid admin password.' })
  }

  return next()
}

async function supabaseDelete(table, slug, prefer = '') {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        ...(prefer ? { Prefer: prefer } : {}),
      },
    },
  )

  const body = await response.text()

  if (!response.ok) {
    throw new Error(body || `Supabase ${table} delete failed.`)
  }

  return body ? JSON.parse(body) : []
}

router.delete('/:slug', requireArticleAdmin, async (req, res) => {
  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'paste-your-service-role-key-here') {
    return res.status(503).json({ error: 'Supabase admin credentials are not configured.' })
  }

  const slug = req.params.slug?.trim()
  if (!slug) {
    return res.status(400).json({ error: 'Article slug is required.' })
  }

  try {
    await supabaseDelete('blog_views', slug)
    const deletedArticles = await supabaseDelete('articles', slug, 'return=representation')

    if (!deletedArticles.length) {
      return res.status(404).json({ error: 'Article was not found in the database.' })
    }

    return res.json({ ok: true, slug })
  } catch (err) {
    console.error('Article delete error:', err)
    return res.status(500).json({ error: 'Failed to delete article from the database.' })
  }
})

export default router
