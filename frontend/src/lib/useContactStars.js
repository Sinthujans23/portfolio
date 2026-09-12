import { useEffect, useRef } from 'react'

export default function useContactStars() {
  const target = useRef({ progress: 0, x: 0, y: 0, radius: 0, width: 0, height: 0 })

  useEffect(() => {
    const stage = document.getElementById('contact-star-stage')
    if (!stage) return
    const update = () => {
      const rect = stage.getBoundingClientRect()
      const height = window.innerHeight
      target.current = {
        progress: Math.max(0, Math.min(1, (height - rect.top) / (height * 0.5))),
        x: rect.left + rect.width / 2,
        // Follow the sticky stage beside the contact details and message form.
        y: rect.top + rect.height / 2,
        radius: Math.min(rect.width * 0.32, rect.height * 0.42, height * 0.24),
        width: rect.width,
        height: rect.height,
      }
    }
    const resize = new ResizeObserver(update)
    resize.observe(document.getElementById('main-content') || stage)
    resize.observe(stage)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      resize.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return target
}
