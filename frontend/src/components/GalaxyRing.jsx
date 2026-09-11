import { useEffect, useRef } from 'react'
import { createStarMotion, stepStar } from '../lib/galaxyPhysics'

const TAU = Math.PI * 2
const TILT = 0.105
const COS = Math.cos(TILT)
const SIN = Math.sin(TILT)
const COLORS = ['255,247,229', '255,223,187', '230,167,118', '184,119,84', '192,211,230']

function seededRandom(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

function makeGlow(color) {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 40
  const ctx = sprite.getContext('2d')
  const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20)
  gradient.addColorStop(0, `rgba(${color},0.9)`)
  gradient.addColorStop(0.09, `rgba(${color},0.55)`)
  gradient.addColorStop(0.3, `rgba(${color},0.12)`)
  gradient.addColorStop(1, `rgba(${color},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 40, 40)
  return sprite
}

// Paint fine gas filaments once per resize; individual moving stars sit above.
function paintAccretion(canvas, width, height, dpr, radius, span, thickness) {
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')
  const random = seededRandom(72831)
  ctx.setTransform(dpr, 0, 0, dpr, width * dpr / 2, height * dpr * 0.5)
  ctx.rotate(TILT)

  const haze = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 2.3)
  haze.addColorStop(0, 'rgba(237,205,166,0)')
  haze.addColorStop(0.1, 'rgba(255,232,202,0.08)')
  haze.addColorStop(0.23, 'rgba(243,190,143,0.13)')
  haze.addColorStop(0.45, 'rgba(167,106,74,0.065)')
  haze.addColorStop(1, 'rgba(126,83,64,0)')
  ctx.fillStyle = haze
  ctx.fillRect(-width, -height, width * 2, height * 2)

  // Gravitational lensing makes the far side rise around the event horizon.
  for (let index = 0; index < 260; index++) {
    const band = index / 260
    const orbit = radius * (1.025 + band * 0.96)
    const hot = Math.exp(-(((band - 0.18) / 0.16) ** 2))
    const alpha = (0.012 + hot * 0.22) * (0.45 + random() * 0.55)
    const color = band < 0.38 ? COLORS[0] : band < 0.63 ? COLORS[1] : COLORS[2]
    ctx.strokeStyle = `rgba(${color},${alpha})`
    ctx.lineWidth = 0.35 + random() * 0.75
    ctx.beginPath()
    for (let step = 0; step <= 150; step++) {
      const angle = -Math.PI + step / 150 * TAU
      const ripple = Math.sin(angle * 13 + band * 42) * 0.6 + Math.sin(angle * 29 - band * 71) * 0.3
      const x = Math.cos(angle) * (orbit + ripple)
      const y = Math.sin(angle) * (orbit + ripple) * (Math.sin(angle) > 0 ? 0.88 : 1)
      if (!step) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Long glowing streams join the upper arch to the outer disk.
  for (let index = 0; index < 72; index++) {
    const band = index / 72
    const orbit = radius * (1.08 + band * 0.48)
    const reach = span * (0.79 + random() * 0.15)
    ctx.lineWidth = 0.45 + random() * 0.65
    ctx.strokeStyle = `rgba(${band < 0.5 ? COLORS[0] : COLORS[2]},${0.012 + Math.sin(band * Math.PI) * 0.055})`
    ctx.beginPath()
    ctx.moveTo(-reach, -thickness * (0.1 + band * 0.2))
    ctx.bezierCurveTo(-orbit * 1.08, -thickness * 0.85, -orbit * 1.15, -orbit * 0.86, 0, -orbit)
    ctx.bezierCurveTo(orbit * 1.15, -orbit * 0.86, orbit * 1.08, -thickness * 0.85, reach, -thickness * (0.1 + band * 0.2))
    ctx.stroke()
  }

  // An opaque circular horizon gives the filaments a crisp inner edge.
  const core = ctx.createRadialGradient(-radius * 0.15, -radius * 0.32, 0, 0, 0, radius)
  core.addColorStop(0, '#08080b')
  core.addColorStop(1, '#030407')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,241,220,0.52)'
  ctx.lineWidth = Math.max(0.55, radius * 0.005)
  ctx.beginPath()
  ctx.arc(0, 0, radius * 1.006, Math.PI, TAU)
  ctx.stroke()

  ctx.save()
  ctx.scale(span, thickness * 4.8)
  const diskGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  diskGlow.addColorStop(0, 'rgba(246,175,117,0.08)')
  diskGlow.addColorStop(0.45, 'rgba(215,137,89,0.055)')
  diskGlow.addColorStop(1, 'rgba(184,109,76,0)')
  ctx.fillStyle = diskGlow
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()

  // The near side passes in front of the core in a long, thin copper plane.
  ctx.fillStyle = 'rgba(12,9,10,0.91)'
  ctx.beginPath()
  ctx.ellipse(0, thickness * 0.18, span * 0.94, thickness * 1.08, 0, 0, TAU)
  ctx.fill()

  for (let index = 0; index < 360; index++) {
    const band = index / 360
    const offset = (band * 2 - 1) * thickness
    const reach = span * (0.82 + random() * 0.18) * Math.sqrt(1 - (band * 2 - 1) ** 2 * 0.52)
    const hot = Math.exp(-(((band - 0.27) / 0.19) ** 2))
    const alpha = (0.022 + hot * 0.28) * (0.4 + random() * 0.6)
    const gradient = ctx.createLinearGradient(-reach, 0, reach, 0)
    gradient.addColorStop(0, `rgba(${COLORS[2]},0)`)
    gradient.addColorStop(0.12, `rgba(${COLORS[2]},${alpha * 0.55})`)
    gradient.addColorStop(0.35, `rgba(${hot > 0.4 ? COLORS[0] : COLORS[2]},${alpha})`)
    gradient.addColorStop(0.55, `rgba(${hot > 0.7 ? COLORS[1] : COLORS[3]},${alpha * 0.85})`)
    gradient.addColorStop(0.83, `rgba(${COLORS[2]},${alpha * 0.55})`)
    gradient.addColorStop(1, `rgba(${COLORS[2]},0)`)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 0.3 + random() * 0.8
    const phase = random() * TAU
    ctx.beginPath()
    for (let step = 0; step <= 120; step++) {
      const u = step / 120 * 2 - 1
      const x = u * reach
      const envelope = Math.sqrt(Math.max(0, 1 - u * u))
      const ripple = (Math.sin(u * 28 + phase) + Math.sin(u * 61 - phase) * 0.4) * thickness * 0.045
      const y = offset * envelope + thickness * 0.2 + ripple * envelope
      if (!step) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

export default function GalaxyRing() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const texture = document.createElement('canvas')
    const sprites = COLORS.map(makeGlow)
    const pointer = { x: 0, y: 0, active: false }
    const client = { x: 0, y: 0, active: false }
    const random = seededRandom(29321)
    const count = window.matchMedia('(max-width: 767px)').matches ? 2400 : 4600
    const particles = Array.from({ length: count }, (_, index) => {
      const kind = index < count * 0.12 ? 'field' : index < count * 0.51 ? 'halo' : 'disk'
      return {
        ...createStarMotion(),
        kind,
        angle: random() * TAU,
        radius: random(),
        spread: (random() + random() + random() - 1.5) / 1.5,
        phase: random() * TAU,
        size: 0.2 + random() ** 4 * (kind === 'field' ? 1.1 : 0.8),
        alpha: 0.18 + random() * 0.72,
        speed: (0.009 + random() * 0.022) * (kind === 'field' ? 0.03 : 1),
        color: kind === 'field' ? (random() > 0.65 ? 4 : 0) : Math.floor(random() * 4),
      }
    })
    let width = 0, height = 0, radius = 0, span = 0, thickness = 0
    let frame = 0, time = 0, last = 0, visible = false, bounds = null

    const updatePointer = () => {
      if (!bounds) return
      pointer.x = client.x - bounds.left
      pointer.y = client.y - bounds.top
      pointer.active = client.active && !preference.matches && pointer.x >= 0 && pointer.y >= 0 && pointer.x <= width && pointer.y <= height
    }

    const draw = (dt = 0) => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(texture, 0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      const scale = Math.max(0.58, Math.min(1.35, width / 1000))
      for (const star of particles) {
        const angle = star.angle + time * star.speed
        let x, y, alpha = star.alpha
        if (star.kind === 'field') {
          x = Math.cos(star.angle) * width * (0.16 + star.radius * 0.34)
          y = Math.sin(star.angle) * height * (0.18 + star.radius * 0.3)
          if (Math.hypot(x, y) < radius * 1.06) continue
          alpha *= 0.55
        } else if (star.kind === 'halo') {
          const orbit = radius * (1.045 + star.radius ** 1.9 * 0.86)
          x = Math.cos(angle) * orbit
          y = Math.sin(angle) * orbit * (Math.sin(angle) > 0 ? 0.88 : 1)
          // The near-side disk occludes the middle of the halo.
          if (Math.abs(y) < thickness * 1.14) continue
          alpha *= 0.44 + (1 - star.radius) * 0.42
          if (y > 0) alpha *= 0.62
        } else {
          // Project elliptical orbits into a flattened accretion plane.
          const orbit = radius * 1.12 + star.radius ** 0.64 * (span - radius * 1.12)
          x = Math.cos(angle) * orbit
          y = Math.sin(angle) * thickness * (0.3 + star.radius * 0.6) + star.spread * thickness * 0.55
          y += thickness * 0.1 + Math.sin(angle * 6 + star.phase) * thickness * 0.065
          alpha *= 0.45 + (1 - Math.abs(x) / span) * 0.5
        }
        const targetX = width / 2 + x * COS - y * SIN
        const targetY = height * 0.5 + x * SIN + y * COS
        if (dt) stepStar(star, targetX, targetY, pointer, Math.max(58, Math.min(105, width * 0.12)), dt)
        const px = targetX + star.offsetX
        const py = targetY + star.offsetY
        alpha *= 0.78 + Math.sin(star.phase + time * 0.5) * 0.22
        alpha = Math.min(1, alpha + star.glow * 0.75)
        const dot = star.size * scale * (1 + star.glow * 1.8)
        if (star.size > 0.83 || star.glow > 0.1) {
          const glowSize = (star.size * 10 + star.glow * 21) * scale
          ctx.globalAlpha = Math.min(0.8, alpha * 0.42 + star.glow * 0.48)
          ctx.drawImage(sprites[star.color], px - glowSize / 2, py - glowSize / 2, glowSize, glowSize)
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${COLORS[star.color]})`
        ctx.fillRect(px, py, dot, dot)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

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
      if (preference.matches) {
        pointer.active = false
        particles.forEach(star => Object.assign(star, createStarMotion()))
      }
      if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(tick)
      else draw()
    }
    const measure = () => {
      bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      if (!width || !height) return
      radius = Math.min(height * 0.215, width * 0.13)
      span = width * 0.49
      thickness = Math.max(6, radius * 0.2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintAccretion(texture, width, height, dpr, radius, span, thickness)
      updatePointer()
      draw()
    }
    const refreshBounds = () => { bounds = canvas.getBoundingClientRect(); updatePointer() }
    const move = event => {
      client.x = event.clientX
      client.y = event.clientY
      client.active = true
      updatePointer()
    }
    const leave = () => { client.active = false; pointer.active = false }
    const release = event => { if (event.pointerType !== 'mouse') leave() }
    const resize = new ResizeObserver(measure)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    resize.observe(canvas)
    observer.observe(canvas)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', leave)
    window.addEventListener('blur', leave)
    window.addEventListener('scroll', refreshBounds, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', sync)
    preference.addEventListener('change', sync)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      observer.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', leave)
      window.removeEventListener('blur', leave)
      window.removeEventListener('scroll', refreshBounds)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', sync)
      preference.removeEventListener('change', sync)
    }
  }, [])

  return <canvas ref={ref} className="cosmic-ring" aria-hidden="true" />
}
