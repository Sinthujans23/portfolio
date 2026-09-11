import { useEffect, useRef } from 'react'
import { createStarSprites, paintStar } from '../lib/starRendering'
import { useTheme } from '../context/ThemeContext'

const createStar = () => {
  const depth = Math.random()
  const u = Math.random()
  const band = 0.18 + u * 0.62 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.22
  return {
  u,
  v: Math.random() < 0.35 ? ((band % 1) + 1) % 1 : Math.random(),
  size: depth > 0.97 ? 1.1 + Math.random() * 0.65 : 0.2 + depth * 0.65,
  color: Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 3),
  bright: depth > 0.9,
  flare: depth > 0.995,
  alpha: 0.16 + depth * 0.6,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.4 + 0.3,
  drift: 3 + depth * 9,
  offsetX: 0,
  offsetY: 0,
  velocityX: 0,
  velocityY: 0,
}}

export default function GalaxyBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  const repaintRef = useRef(null)
  useEffect(() => { themeRef.current = theme; repaintRef.current?.() }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const sprites = createStarSprites()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0, active: false }
    let stars = []
    let width = 0
    let height = 0
    let raf = null
    let previousTime = 0
    let elapsed = 0

    const render = (now) => {
      raf = null
      if (document.hidden) return

      const step = previousTime ? Math.min((now - previousTime) / 16.667, 2) : 1
      previousTime = now
      if (!reducedMotion.matches) elapsed += step / 60
      const radius = Math.min(150, width * 0.25)
      const exposure = themeRef.current === 'dark' ? 1.65 : 1
      ctx.clearRect(0, 0, width, height)

      for (const star of stars) {
        const driftX = Math.sin(elapsed * 0.13 + star.phase) * star.drift
        const driftY = Math.cos(elapsed * 0.1 + star.phase) * star.drift * 0.65
        const baseX = star.u * width + driftX
        const baseY = star.v * height + driftY
        const dx = baseX - pointer.x
        const dy = baseY - pointer.y
        const distance = Math.hypot(dx, dy)
        const proximity = pointer.active ? Math.max(0, 1 - distance / radius) : 0
        const influence = proximity * proximity
        const directionX = distance > 0.01 ? dx / distance : Math.cos(star.phase)
        const directionY = distance > 0.01 ? dy / distance : Math.sin(star.phase)

        if (reducedMotion.matches) {
          star.offsetX = star.offsetY = star.velocityX = star.velocityY = 0
        } else {
          // Each star has its own spring: nearby stars move away and settle home.
          const targetX = directionX * influence * 32
          const targetY = directionY * influence * 32
          const damping = Math.pow(0.82, step)
          star.velocityX = (star.velocityX + (targetX - star.offsetX) * 0.07 * step) * damping
          star.velocityY = (star.velocityY + (targetY - star.offsetY) * 0.07 * step) * damping
          star.offsetX += star.velocityX * step
          star.offsetY += star.velocityY * step
        }

        const x = baseX + star.offsetX
        const y = baseY + star.offsetY
        const twinkle = reducedMotion.matches ? 0 : Math.sin(elapsed * star.speed + star.phase) * 0.07
        const size = star.size + influence * 0.9

        paintStar(ctx, sprites, star, x, y, size, (star.alpha + twinkle) * exposure + influence * 0.6, influence)
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      if (!reducedMotion.matches) raf = requestAnimationFrame(render)
    }

    const restart = () => {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null
      previousTime = 0
      render(performance.now())
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.min(2500, Math.max(900, Math.floor((width * height) / 425)))
      if (stars.length > count) stars.length = count
      while (stars.length < count) stars.push(createStar())
      restart()
    }

    repaintRef.current = () => { if (reducedMotion.matches) restart() }

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      // Reduced motion keeps the stars still, with only a local brightness response.
      if (reducedMotion.matches) restart()
    }

    const clearPointer = () => {
      pointer.active = false
      if (reducedMotion.matches) restart()
    }

    const onPointerOut = (event) => {
      if (!event.relatedTarget) clearPointer()
    }

    const onVisibilityChange = () => {
      if (document.hidden) pointer.active = false
      restart()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut)
    window.addEventListener('pointercancel', clearPointer)
    window.addEventListener('blur', clearPointer)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotion.addEventListener('change', restart)

    return () => {
      repaintRef.current = null
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('pointercancel', clearPointer)
      window.removeEventListener('blur', clearPointer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotion.removeEventListener('change', restart)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-[15%] left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-indigo-600/[0.06] via-purple-600/[0.04] to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-[55%] -right-[15%] w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/[0.05] to-transparent rounded-full blur-[130px]" />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
