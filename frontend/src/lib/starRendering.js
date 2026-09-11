// Small cached light textures keep dense star fields inexpensive to animate.
export const STAR_PALETTE = ['#f2f4ff', '#c7dcff', '#fff0d5', '#c8c3ec']

export function createStarSprites() {
  return STAR_PALETTE.map(color => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 48
    const ctx = canvas.getContext('2d')
    const glow = ctx.createRadialGradient(24, 24, 0, 24, 24, 24)
    glow.addColorStop(0, `${color}dd`)
    glow.addColorStop(0.08, `${color}88`)
    glow.addColorStop(0.25, `${color}25`)
    glow.addColorStop(1, `${color}00`)
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 48, 48)
    return canvas
  })
}

export function paintStar(ctx, sprites, star, x, y, radius, alpha, glow = 0) {
  ctx.fillStyle = STAR_PALETTE[star.color]
  if (star.bright || glow > 0.08) {
    const reach = radius * 12 + glow * 13
    ctx.globalAlpha = Math.min(0.8, alpha * 0.7 + glow * 0.3)
    ctx.drawImage(sprites[star.color], x - reach / 2, y - reach / 2, reach, reach)
  }
  ctx.globalAlpha = Math.min(1, alpha)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  if (star.flare) {
    ctx.globalAlpha = alpha * 0.2
    ctx.fillRect(x - radius * 4, y - 0.3, radius * 8, 0.6)
    ctx.fillRect(x - 0.3, y - radius * 4, 0.6, radius * 8)
  }
}
