import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let frame = null
    const update = () => {
      frame = null
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0})`
    }
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/5">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-none"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />
    </div>
  )
}
