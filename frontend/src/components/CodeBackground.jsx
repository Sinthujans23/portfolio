import { useEffect, useRef } from 'react'

// Curated, public UI snippets only; these are decorative text, never executed.
const SNIPPETS = {
  about: [
    'function useGitHubStats() {\n  const [stats, setStats] = useState(null);\n  fetch("/api/github")\n    .then(response => response.json())\n    .then(setStats);\n  return stats;\n}',
    'const developer = {\n  name: "Sinthujan S.",\n  focus: ["AI", "ML", "Software"],\n  location: "Sri Lanka",\n};\nexport default developer;',
  ],
  skills: [
    'const skills = [\n  { name: "Python", level: 90 },\n  { name: "React", level: 85 },\n  { name: "Tailwind CSS", level: 90 },\n];',
    'skills.map(skill => (\n  <motion.div\n    key={skill.name}\n    animate={{ width: `${skill.level}%` }}\n  />\n));',
  ],
  projects: [
    'const project = {\n  name: "Redef & Focas Director Board",\n  github: "https://github.com/Sinthujans23/Radef-focas-Project",\n};',
    'const exploreProject = () => {\n  window.open(project.github, "_blank", "noopener,noreferrer");\n};',
  ],
  experience: [
    'const timeline = [\n  "AI Student",\n  "AI Project Developer",\n];\nconst focus = ["LangChain", "RAG", "FastAPI"];',
    '<motion.article\n  initial={{ opacity: 0, y: 30 }}\n  whileInView={{ opacity: 1, y: 0 }}\n  viewport={{ once: true }}\n/>',
  ],
  blog: [
    'const slugs = STATIC_ARTICLES\n  .map(article => article.slug);\nconst [views, setViews] = useState({});',
    'const counts = {};\ndata.forEach(row => {\n  counts[row.slug] =\n    (counts[row.slug] || 0) + 1;\n});\nsetViews(counts);',
  ],
}

export default function CodeBackground({ section }) {
  const rootRef = useRef(null)
  const snippets = SNIPPETS[section]

  useEffect(() => {
    const root = rootRef.current
    if (!root || !snippets) return
    const nodes = root.querySelectorAll('code')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let timer
    let cursor = 32
    const cycleLength = Math.max(...snippets.map(code => code.length)) + 70

    const tick = () => {
      cursor = (cursor + 2) % cycleLength
      nodes.forEach((node, index) => {
        const position = (cursor + index * 48) % cycleLength
        node.textContent = snippets[index].slice(0, position)
      })
      timer = window.setTimeout(tick, 80)
    }
    const sync = () => {
      window.clearTimeout(timer)
      const running = visible && !document.hidden && !motion.matches
      root.dataset.running = String(running)
      if (motion.matches) nodes.forEach((node, index) => { node.textContent = snippets[index] })
      else if (running) timer = window.setTimeout(tick, 80)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    sync()
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', sync)
    }
  }, [snippets])

  if (!snippets) return null
  return (
    <div ref={rootRef} className="section-code-background" aria-hidden="true" data-running="false">
      {snippets.map((snippet, index) => (
        <pre className={`section-code-fragment section-code-fragment-${index}`} key={index}>
          <code>{snippet.slice(0, 32 + index * 48)}</code>
        </pre>
      ))}
    </div>
  )
}
