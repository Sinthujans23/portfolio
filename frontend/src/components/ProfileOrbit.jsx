import { useEffect, useRef } from 'react'
import { createStarMotion, stepStar } from '../lib/galaxyPhysics'
import { createStarSprites, paintStar } from '../lib/starRendering'
import { useTheme } from '../context/ThemeContext'
import useStarScroll from '../lib/useStarScroll'

export default function ProfileOrbit() {
  const canvasRef = useRef(null)
  const scrollProgress = useStarScroll()
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  const repaintRef = useRef(null)
  useEffect(() => { themeRef.current = theme; repaintRef.current?.() }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const sprites = createStarSprites()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0, active: false }
    const count = window.matchMedia('(max-width: 767px)').matches ? 1400 : 2600
    const stars = Array.from({ length: count }, () => {
      const depth = Math.random()
      const outer = Math.random() < 0.52
      // Exponentially fewer stars at larger distances, with no hard ring edge.
      const distance = outer ? -Math.log(1 - Math.random() * 0.985) * 0.52 : 0
      return {
      ...createStarMotion(),
      angle: Math.random() * Math.PI * 2,
      radius: outer ? 0.44 + distance : 0.45 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.05,
      towardName: outer && Math.random() < 0.6,
      spread: (Math.random() + Math.random() - 1) * 1.25,
      size: depth > 0.975 ? 1 + Math.random() * 0.8 : 0.2 + depth * 0.75,
      alpha: (0.18 + depth * 0.72) * Math.exp(-distance * 0.7),
      speed: (0.025 + Math.random() * 0.035) / (1 + distance * 2),
      phase: Math.random() * Math.PI * 2,
      scatterDelay: Math.random() * 0.16,
      scatterSpeed: 0.32 + Math.random() * 0.38,
      bright: depth > 0.9,
      flare: depth > 0.996,
      color: Math.random() < 0.5 ? 0 : 1 + Math.floor(Math.random() * 3),
    }})
    let size = 0, width = 0, height = 0, centerX = 0, centerY = 0, nameAngle = Math.PI
    let frame = 0, time = 0, last = 0, visible = false
    let dispersal = 0

    const draw = (dt = 0) => {
      ctx.clearRect(0, 0, width, height)
      const exposure = themeRef.current === 'dark' ? 1.35 : 1
      if (motion.matches) dispersal = 0
      else if (dt) dispersal += (scrollProgress.current - dispersal) * (1 - Math.exp(-10 * dt))
      for (const star of stars) {
        const angle = star.towardName
          ? nameAngle + star.spread + Math.sin(time * 0.18 + star.phase) * 0.1
          : star.angle + time * star.speed
        const radius = star.radius
          + Math.sin(angle * 3 + star.radius * 35 - time * 0.3) * 0.012
          + Math.sin(time * 0.4 + star.phase) * 0.009
        const amount = Math.max(0, (dispersal - star.scatterDelay) / (1 - star.scatterDelay))
        const spread = amount * amount * (3 - 2 * amount)
        const direction = Math.cos(angle) < 0 ? -1 : 1
        const x = centerX + size * Math.cos(angle) * radius + direction * spread * width * star.scatterSpeed
        const y = centerY + size * Math.sin(angle) * radius + Math.sin(star.phase) * spread * height * 0.22
        const edge = Math.max(0, Math.min(1, x / 70, (width - x) / 70, y / 70, (height - y) / 70))
        if (!edge) continue
        if (dt) stepStar(star, x, y, pointer, 75, dt)
        const twinkle = 0.84 + Math.sin(time * 0.55 + star.phase) * 0.16
        paintStar(ctx, sprites, star, x + star.offsetX, y + star.offsetY,
          star.size * Math.max(0.65, size / 480) * (1 + star.glow),
          (star.alpha * twinkle * exposure + star.glow * 0.6) * edge * (1 - spread * 0.45), star.glow * edge)
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }
    repaintRef.current = () => { if (motion.matches) draw() }
    const tick = stamp => {
      const dt = last ? Math.min((stamp - last) / 1000, 1 / 30) : 1 / 60
      last = stamp
      time += dt
      draw(dt)
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      last = 0
      if (motion.matches) stars.forEach(star => Object.assign(star, createStarMotion()))
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick)
      else draw()
    }
    const resize = new ResizeObserver(() => {
      const bounds = canvas.getBoundingClientRect()
      const orbit = canvas.parentElement.getBoundingClientRect()
      const name = document.getElementById('hero-name')?.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      size = orbit.width
      centerX = orbit.left + orbit.width / 2 - bounds.left
      centerY = orbit.top + orbit.height / 2 - bounds.top
      if (name) nameAngle = Math.atan2(name.top + name.height / 2 - bounds.top - centerY, name.left + name.width / 2 - bounds.left - centerX)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pointer.active = false
      draw()
    })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    const move = event => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = !motion.matches && pointer.x >= 0 && pointer.y >= 0 && pointer.x <= width && pointer.y <= height
    }
    const leave = () => { pointer.active = false }
    const release = event => { if (event.pointerType !== 'mouse') leave() }
    resize.observe(canvas)
    resize.observe(canvas.parentElement)
    observer.observe(canvas)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', leave)
    window.addEventListener('blur', leave)
    window.addEventListener('scroll', leave, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    return () => {
      repaintRef.current = null
      cancelAnimationFrame(frame)
      resize.disconnect()
      observer.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', leave)
      window.removeEventListener('blur', leave)
      window.removeEventListener('scroll', leave)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', sync)
    }
  }, [scrollProgress])

  return (
    <div className="cosmic-profile-orbit">
      <canvas ref={canvasRef} className="cosmic-profile-stars" aria-hidden="true" />
      <div className="cosmic-profile-photo">
        <img src="/profile.jpg" alt="Sinthujan S." fetchPriority="high" draggable={false} />
      </div>
    </div>
  )
}
