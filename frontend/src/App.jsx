import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import CursorGlow from './components/CursorGlow'
import SplashScreen from './components/SplashScreen'
import Terminal from './components/Terminal'
import SectionDots from './components/SectionDots'
import Grain from './components/Grain'
import Blog from './components/Blog'
import AllArticles from './pages/AllArticles'
import WriteArticle from './pages/WriteArticle'
import ArticleView from './pages/ArticleView'

function PortfolioApp() {
  const [ready, setReady] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setTerminalOpen(o => !o)
      }
      if (e.key === 'Escape') setTerminalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div>
      <SplashScreen onDone={() => setReady(true)} />

      {ready && (
        <div className="relative min-h-screen bg-mesh text-white overflow-x-hidden">
          <a href="#main-content" className="skip-link">Skip to content</a>

          <ScrollProgress />
          <CursorGlow />
          <Grain />
          <ParticleBackground />
          <Navbar />

          <main id="main-content" className="relative z-10">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Certifications />
            <Blog />
            <Contact />
          </main>

          <Footer />
          <BackToTop />
          <SectionDots />

          <AnimatePresence>
            {terminalOpen && (
              <Terminal key="terminal" onClose={() => setTerminalOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioApp />} />
          <Route path="/articles" element={<AllArticles />} />
          <Route path="/articles/write" element={<WriteArticle />} />
          <Route path="/articles/:slug" element={<ArticleView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
