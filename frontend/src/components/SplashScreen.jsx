import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const CODE = 'const developer = {\n  name: "Sinthujan S.",\n  focus: ["AI", "ML", "Software"],\n};\n\nexport default developer;'
const DURATION = 2700

function CodeLine({ text }) {
  return text.split(/("[^"]*"|\bconst\b|\bexport\b|\bdefault\b)/g).map((token, index) => (
    <span key={index} className={token.startsWith('"') ? 'splash-string' : /^(const|export|default)$/.test(token) ? 'splash-keyword' : undefined}>
      {token}
    </span>
  ))
}

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [characters, setCharacters] = useState(0)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()
  const onDoneRef = useRef(onDone)

  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  useEffect(() => {
    const duration = reducedMotion ? 700 : DURATION
    const started = performance.now()
    let frame
    const tick = now => {
      const elapsed = now - started
      setProgress(Math.min(100, Math.floor(elapsed / duration * 100)))
      setCharacters(reducedMotion ? CODE.length : Math.min(CODE.length, Math.floor(Math.max(0, elapsed - 250) / 19)))
      if (elapsed >= duration) setVisible(false)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  const lines = CODE.slice(0, reducedMotion ? CODE.length : characters).split('\n')

  return (
    <AnimatePresence onExitComplete={() => onDoneRef.current()}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.4 }}
          className="splash-screen"
        >
          <p className="sr-only" role="status">Loading Sinthujan S.'s portfolio.</p>
          <div className="splash-stars" aria-hidden="true">
            {Array.from({ length: 28 }, (_, index) => (
              <i key={index} style={{ left: `${(index * 37 + 7) % 100}%`, top: `${(index * 23 + 11) % 100}%`, animationDelay: `${index % 5 * -0.7}s` }} />
            ))}
          </div>
          <p className="splash-identity">PORTFOLIO <span>/ SINTHUJAN S.</span></p>
          <div className="splash-content">
            <div className="splash-emblem" aria-hidden="true">
              <span className="splash-orbit splash-orbit-outer" />
              <span className="splash-orbit splash-orbit-inner" />
              <span className="splash-monogram">S<span>.</span></span>
            </div>
            <div className="splash-introduction">
              <p className="splash-eyebrow">IDEAS. INTELLIGENCE. IMPACT.</p>
              <h1>Sinthujan S<span>.</span></h1>
              <p className="splash-tagline">Turning curiosity into intelligent experiences.</p>
            </div>
            <div className="splash-editor" aria-hidden="true">
              <div className="splash-editor-header">
                <span className="splash-window-dots"><i /><i /><i /></span>
                <span>developer.js</span>
                <span className="splash-editor-status">{characters >= CODE.length || reducedMotion ? 'Ready' : 'Writing code…'}</span>
              </div>
              <div className="splash-code">
                {lines.map((line, index) => (
                  <div className="splash-code-line" key={index}>
                    <span className="splash-line-number">{index + 1}</span>
                    <code><CodeLine text={line} />{index === lines.length - 1 && !reducedMotion && <span className="splash-caret" />}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="splash-loading-label" aria-hidden="true">
              <span>{progress >= 100 ? 'Ready to explore' : 'Opening portfolio'}</span>
              <span>{String(progress).padStart(2, '0')}%</span>
            </div>
            <div className="splash-progress" aria-hidden="true">
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reducedMotion ? 0 : DURATION / 1000, ease: 'linear' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
