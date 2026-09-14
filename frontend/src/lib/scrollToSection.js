let cancelTransition = () => {}

export function scrollToSection(href) {
  const id = href.replace(/^#/, '')
  const section = document.getElementById(id)
  if (!section) return

  cancelTransition()
  // Recalculate the destination as project details expand during navigation.
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const destination = () => id === 'home' ? 0 : Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: destination(), behavior: 'instant' })
    return
  }

  const start = window.scrollY
  const started = performance.now()
  const duration = 900
  let frame
  const cancel = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
    window.removeEventListener('keydown', onKeyDown)
    cancelTransition = () => {}
  }
  const onKeyDown = event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(event.key)) cancel()
  }
  const tick = now => {
    const progress = Math.min(1, (now - started) / duration)
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
    window.scrollTo({ top: start + (destination() - start) * eased, behavior: 'instant' })
    if (progress < 1) frame = requestAnimationFrame(tick)
    else cancel()
  }
  cancelTransition = cancel
  window.addEventListener('wheel', cancel, { passive: true })
  window.addEventListener('touchstart', cancel, { passive: true })
  window.addEventListener('keydown', onKeyDown)
  frame = requestAnimationFrame(tick)
}
