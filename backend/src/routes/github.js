import { Router } from 'express'

const router = Router()
const USERNAME = process.env.GITHUB_USERNAME || 'Sinthujans23'

let cache = null
let cacheAt = 0
const TTL = 30 * 60 * 1000 // 30 minutes

router.get('/', async (_req, res) => {
  if (cache && Date.now() - cacheAt < TTL) {
    return res.json(cache)
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sinthujan-portfolio',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers }),
    ])

    if (!profileRes.ok) throw new Error(`GitHub API ${profileRes.status}`)

    const profile = await profileRes.json()
    const repos   = reposRes.ok ? await reposRes.json() : []

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      : 0

    const topLanguages = Array.isArray(repos)
      ? Object.entries(
          repos.reduce((acc, r) => {
            if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
            return acc
          }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([lang]) => lang)
      : []

    cache = {
      username:    profile.login,
      name:        profile.name,
      avatar:      profile.avatar_url,
      bio:         profile.bio,
      repos:       profile.public_repos,
      followers:   profile.followers,
      following:   profile.following,
      stars:       totalStars,
      topLanguages,
      profileUrl:  profile.html_url,
    }
    cacheAt = Date.now()

    return res.json(cache)
  } catch (err) {
    console.error('GitHub API error:', err)
    return res.status(502).json({ error: 'Failed to fetch GitHub data.' })
  }
})

export default router
