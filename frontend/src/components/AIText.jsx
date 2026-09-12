import { useEffect } from 'react'

const GLYPHS = '01<>/{}[]'

export function useHeroTextReveal(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const entries = [...section.querySelectorAll('[data-ai-text]')].map(node => ({
      node,
      visual: node.querySelector('.ai-text-visual'),
      text: node.dataset.aiText,
      delay: Number(node.dataset.delay || 0),
      duration: Math.min(1500, 400 + node.dataset.aiText.length * 10),
    }))
    let timer
    let visible = false
    let completed = false
    let elapsed = 0
    let last = 0

    const finish = () => {
      completed = true
      entries.forEach(({ node, visual, text }) => {
        visual.textContent = text
        node.classList.remove('is-decoding')
      })
    }
    const tick = () => {
      const now = performance.now()
      elapsed += last ? Math.min(now - last, 120) : 0
      last = now
      let done = true
      entries.forEach(({ node, visual, text, delay, duration }) => {
        const progress = Math.max(0, Math.min(1, (elapsed - delay) / duration))
        const count = Math.floor(text.length * progress)
        const decoding = progress > 0 && progress < 1
        const noise = decoding ? Array.from({ length: Math.min(2, text.length - count) }, (_, index) => GLYPHS[(Math.floor(elapsed / 90) + index) % GLYPHS.length]).join('') : ''
        visual.textContent = text.slice(0, count) + noise
        node.classList.toggle('is-decoding', decoding)
        if (progress < 1) done = false
      })
      if (done) finish()
      else timer = window.setTimeout(tick, 50)
    }
    const sync = () => {
      window.clearTimeout(timer)
      last = 0
      if (motion.matches) finish()
      else if (visible && !document.hidden && !completed) tick()
    }
    if (!motion.matches) entries.forEach(({ visual }) => { visual.textContent = '' })
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(section)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [sectionRef])
}

export default function AIText({ children, delay = 0 }) {
  return (
    <span className="ai-text" data-ai-text={children} data-delay={delay}>
      <span className="sr-only">{children}</span>
      <span className="ai-text-measure" aria-hidden="true">{children}</span>
      <span className="ai-text-visual" aria-hidden="true">{children}</span>
    </span>
  )
}
