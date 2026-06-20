import { useEffect, useRef } from 'react'

const COLORS = ['#818cf8', '#a78bfa', '#38bdf8', '#34d399', '#f472b6', '#facc15']

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!trigger) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 12,
      vy: -(Math.random() * 14 + 6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 7 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.45,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        if (p.y < canvas.height + 20) alive = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
      }
      if (alive) raf = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[150] pointer-events-none"
    />
  )
}
