import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './SectionCursor.css'

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'blog', 'contact']
const NATIVE_CURSOR_TARGETS = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], iframe, [data-native-cursor]'
const INTERACTIVE_TARGETS = 'a, button, summary, label, [role="button"], [data-cursor="pointer"]'

function routeMode(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/articles/write') return 'write'
  if (path === '/articles') return 'articles'
  if (path.startsWith('/articles/')) return 'article'
  return 'home'
}

export default function SectionCursor() {
  const { pathname } = useLocation()
  const cursorRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const cursor = cursorRef.current
    const root = document.documentElement
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const pointer = pointerRef.current
    let frame = 0
    let pressed = false
    let selecting = false
    let modeDirty = true

    const updateMode = () => {
      let mode = routeMode(pathname)
      if (mode === 'home') {
        const focusY = window.innerHeight * 0.42
        // The section occupying the reading area sets the cursor, even when
        // the pointer rests over the fixed navigation while scrolling.
        for (const id of SECTION_IDS) {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= focusY) mode = id
        }
      }
      cursor.dataset.mode = mode
      modeDirty = false
    }

    const update = () => {
      frame = 0
      if (modeDirty) updateMode()
      const target = document.elementFromPoint(pointer.x, pointer.y)
      const nativeTarget = target?.closest(NATIVE_CURSOR_TARGETS)
      const selection = window.getSelection()
      const hasSelection = selection && !selection.isCollapsed
      const visible = finePointer.matches && pointer.active && !nativeTarget && !selecting && !hasSelection && !document.hidden
      root.classList.toggle('section-cursor-active', Boolean(visible))
      cursor.dataset.visible = String(Boolean(visible))
      cursor.dataset.pressed = String(pressed)
      cursor.dataset.interactive = String(Boolean(target?.closest(INTERACTIVE_TARGETS) && !target.closest(':disabled, [aria-disabled="true"]')))
      cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const hide = () => {
      pointer.active = false
      pressed = false
      selecting = false
      root.classList.remove('section-cursor-active')
      cursor.dataset.visible = 'false'
      schedule()
    }

    const onMove = (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches) {
        hide()
        return
      }
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      // This also discovers sections mounted after the opening splash.
      modeDirty = true
      schedule()
    }

    const onDown = (event) => {
      if (event.pointerType !== 'mouse') {
        hide()
        return
      }
      pressed = true
      schedule()
    }

    const onUp = () => {
      pressed = false
      selecting = false
      schedule()
    }

    const onSelectStart = () => {
      selecting = true
      root.classList.remove('section-cursor-active')
      cursor.dataset.visible = 'false'
      schedule()
    }

    const onScroll = () => {
      modeDirty = true
      schedule()
    }

    const onPointerOut = (event) => {
      if (!event.relatedTarget) hide()
    }

    const onMediaChange = () => {
      if (!finePointer.matches) hide()
      else schedule()
    }

    const onVisibilityChange = () => {
      if (document.hidden) hide()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', hide)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('selectstart', onSelectStart)
    document.addEventListener('selectionchange', schedule)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('keydown', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll, { passive: true })
    finePointer.addEventListener('change', onMediaChange)
    schedule()

    return () => {
      window.cancelAnimationFrame(frame)
      root.classList.remove('section-cursor-active')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', hide)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('selectstart', onSelectStart)
      document.removeEventListener('selectionchange', schedule)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('keydown', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
      finePointer.removeEventListener('change', onMediaChange)
    }
  }, [pathname])

  return (
    <div ref={cursorRef} className="section-cursor" data-mode={routeMode(pathname)} data-visible="false" aria-hidden="true">
      <span className="section-cursor__mark">
        <span className="section-cursor__shape" />
        <span className="section-cursor__accent" />
        <span className="section-cursor__point" />
      </span>
    </div>
  )
}
