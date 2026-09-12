import { useEffect, useRef } from 'react'

// Canvas loops read this directly; scrolling does not re-render React components.
export default function useStarScroll() {
  const progress = useRef(0)

  useEffect(() => {
    const hero = document.getElementById('home')
    if (!hero) return
    const update = () => {
      const bounds = hero.getBoundingClientRect()
      const distance = Math.max(window.innerHeight * 0.55, bounds.height * 0.75)
      progress.current = Math.max(0, Math.min(1, -bounds.top / distance))
    }
    const resize = new ResizeObserver(update)
    resize.observe(hero)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      resize.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}
