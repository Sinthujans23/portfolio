import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRoute from './routes/contact.js'
import githubRoute from './routes/github.js'
import articlesRoute from './routes/articles.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://sinthujan.dev',
    /\.vercel\.app$/,
  ],
}))
app.use(express.json())

app.use('/api/contact', contactRoute)
app.use('/api/github',  githubRoute)
app.use('/api/articles', articlesRoute)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
