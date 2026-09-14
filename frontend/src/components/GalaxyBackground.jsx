import { useEffect, useRef } from 'react'
import { createStarSprites, paintStar } from '../lib/starRendering'
import { useTheme } from '../context/ThemeContext'
import useStarScroll from '../lib/useStarScroll'
import useContactStars from '../lib/useContactStars'

const createStar = (contactOnly = false) => {
  const depth = Math.random()
  // A dense core with progressively fewer, dimmer stars around its outer edge.
  const halo = contactOnly && Math.random() < 0.55
    ? Math.min(-Math.log(1 - Math.random() * 0.985) * 0.2, 0.6)
    : 0
  const u = Math.random()
  const band = 0.18 + u * 0.62 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.22
  return {
  u,
  v: Math.random() < 0.35 ? ((band % 1) + 1) % 1 : Math.random(),
  size: depth > 0.97 ? 1.1 + Math.random() * 0.65 : 0.2 + depth * 0.65,
  color: Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 3),
  bright: depth > 0.9,
  flare: depth > 0.995,
  alpha: (0.16 + depth * 0.6) * Math.exp(-halo * 1.5),
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.4 + 0.3,
  drift: 3 + depth * 9,
  ringRadius: halo > 0 ? 1 + halo : 1 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.13,
  offsetX: 0,
  offsetY: 0,
  velocityX: 0,
  velocityY: 0,
}}

export default function GalaxyBackground() {
  const canvasRef = useRef(null)
  const scrollProgress = useStarScroll()
  const contactTarget = useContactStars()
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  const repaintRef = useRef(null)
  useEffect(() => { themeRef.current = theme; repaintRef.current?.() }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const contactCanvas = document.querySelector('.contact-star-canvas')
    const contactCtx = contactCanvas?.getContext('2d')
    // Extra space keeps glows and pointer reactions clear of the canvas edges.
    const contactPadding = 64
    let contactWidth = 0
    let contactHeight = 0
    const sprites = createStarSprites()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0, active: false }
    let stars = []
    let contactStars = []
    let width = 0
    let height = 0
    let raf = null
    let previousTime = 0
    let elapsed = 0
    let dispersal = 0
    let gathering = 0

    const render = (now) => {
      raf = null
      if (document.hidden) return
      if (!reducedMotion.matches && previousTime && now - previousTime < 1000 / 30) {
        raf = requestAnimationFrame(render)
        return
      }

      const seconds = previousTime ? Math.min((now - previousTime) / 1000, 0.15) : 1 / 60
      const step = Math.min(seconds * 60, 2)
      previousTime = now
      if (!reducedMotion.matches) elapsed += seconds
      if (reducedMotion.matches) dispersal = 0
      else dispersal += (scrollProgress.current - dispersal) * (1 - Math.exp(-10 * seconds))
      const spread = dispersal * dispersal * (3 - 2 * dispersal)
      const contact = contactTarget.current
      if (reducedMotion.matches) gathering = contact.progress >= 1 ? 1 : 0
      else gathering += (contact.progress - gathering) * (1 - Math.exp(-7 * seconds))
      const reunion = gathering * gathering * (3 - 2 * gathering)
      // Once assembled, draw in the text's container so browser scrolling moves
      // the ring and its contents together, even between animation frames.
      const anchored = Boolean(contactCtx && reunion > 0.999)
      if (contactCtx) {
        const localWidth = contact.width + contactPadding * 2
        const localHeight = contact.height + contactPadding * 2
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
        if (contactWidth !== localWidth || contactHeight !== localHeight || contactCanvas.width !== Math.round(localWidth * pixelRatio)) {
          contactWidth = localWidth
          contactHeight = localHeight
          contactCanvas.width = Math.round(localWidth * pixelRatio)
          contactCanvas.height = Math.round(localHeight * pixelRatio)
          contactCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        }
        contactCtx.clearRect(0, 0, contactWidth, contactHeight)
      }
      const radius = Math.min(150, width * 0.25)
      const exposure = themeRef.current === 'dark' ? 1.65 : 1
      ctx.clearRect(0, 0, width, height)

      // Match the hero's density only while the contact constellation is visible.
      const extraCount = reunion > 0.001 ? contactStars.length : 0
      for (let index = 0; index < stars.length + extraCount; index++) {
        const extra = index >= stars.length
        const star = extra ? contactStars[index - stars.length] : stars[index]
        const driftX = Math.sin(elapsed * 0.13 + star.phase) * star.drift
        const driftY = Math.cos(elapsed * 0.1 + star.phase) * star.drift * 0.65
        const sideX = star.u < 0.5 ? width * (-0.08 + star.u * 0.25) : width * (1.08 - (1 - star.u) * 0.25)
        const scatteredX = star.u * width + (sideX - star.u * width) * spread + driftX
        const scatteredY = star.v * height + driftY + Math.sin(star.phase) * spread * height * 0.14
        const angle = star.phase + elapsed * 0.025
        const orbit = contact.radius * star.ringRadius
        const circleX = contact.x + Math.cos(angle) * orbit
        const circleY = contact.y + Math.sin(angle) * orbit
        const baseX = scatteredX + (circleX - scatteredX) * reunion
        const baseY = scatteredY + (circleY - scatteredY) * reunion
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

        const x = anchored ? contactWidth / 2 + Math.cos(angle) * orbit + star.offsetX : baseX + star.offsetX
        const y = anchored ? contactHeight / 2 + Math.sin(angle) * orbit + star.offsetY : baseY + star.offsetY
        const twinkle = reducedMotion.matches ? 0 : Math.sin(elapsed * star.speed + star.phase) * 0.07
        const size = star.size + influence * 0.9

        const fade = extra ? reunion * reunion : 1
        const edge = anchored ? Math.max(0, Math.min(1, x / 24, (contactWidth - x) / 24, y / 24, (contactHeight - y) / 24)) : 1
        paintStar(anchored ? contactCtx : ctx, sprites, star, x, y, size, ((star.alpha + twinkle) * exposure + influence * 0.6) * (1 - spread * 0.4 * (1 - reunion)) * fade * edge, influence * fade * edge)
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      if (contactCtx) contactCtx.globalAlpha = 1
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
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.min(1200, Math.max(350, Math.floor((width * height) / 900)))
      if (stars.length > count) stars.length = count
      while (stars.length < count) stars.push(createStar())
      const contactCount = width < 768 ? 1400 : 2600
      const extraCount = contactCount - count
      if (contactStars.length > extraCount) contactStars.length = extraCount
      while (contactStars.length < extraCount) contactStars.push(createStar(true))
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
    const onScroll = () => {
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
    window.addEventListener('scroll', onScroll, { passive: true })
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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('pointercancel', clearPointer)
      window.removeEventListener('blur', clearPointer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotion.removeEventListener('change', restart)
      contactCtx?.clearRect(0, 0, contactWidth, contactHeight)
    }
  }, [scrollProgress, contactTarget])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-[15%] left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-indigo-600/[0.06] via-purple-600/[0.04] to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-[55%] -right-[15%] w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/[0.05] to-transparent rounded-full blur-[130px]" />
      <canvas ref={canvasRef} className="galaxy-background-canvas w-full h-full" />
    </div>
  )
}
