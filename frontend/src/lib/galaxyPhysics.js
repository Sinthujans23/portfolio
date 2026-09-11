// Offsets live separately from the orbit, so a disturbed star can find its way home.
export function createStarMotion() {
  return { offsetX: 0, offsetY: 0, velocityX: 0, velocityY: 0, glow: 0 }
}

export function stepStar(star, x, y, pointer, radius, elapsed) {
  const dt = Math.max(0, Math.min(elapsed, 1 / 30))
  let forceX = 0, forceY = 0, proximity = 0
  if (pointer.active) {
    const dx = x + star.offsetX - pointer.x
    const dy = y + star.offsetY - pointer.y
    const distance = Math.hypot(dx, dy)
    if (distance < radius) {
      proximity = 1 - distance / radius
      // A small tangential force makes the local disturbance curl like stardust.
      const nx = distance > 0.001 ? dx / distance : 1
      const ny = distance > 0.001 ? dy / distance : 0
      const strength = proximity * proximity * 1900
      forceX = (nx - ny * 0.32) * strength
      forceY = (ny + nx * 0.32) * strength
    }
  }
  const damping = Math.exp(-8 * dt)
  star.velocityX = (star.velocityX + (forceX - star.offsetX * 32) * dt) * damping
  star.velocityY = (star.velocityY + (forceY - star.offsetY * 32) * dt) * damping
  star.offsetX += star.velocityX * dt
  star.offsetY += star.velocityY * dt
  star.glow += (proximity - star.glow) * (1 - Math.exp(-10 * dt))
}
