import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'

const BANNER = `
  ███████╗██╗███╗   ██╗████████╗██╗  ██╗██╗   ██╗
  ██╔════╝██║████╗  ██║╚══██╔══╝██║  ██║██║   ██║
  ███████╗██║██╔██╗ ██║   ██║   ███████║██║   ██║
  ╚════██║██║██║╚██╗██║   ██║   ██╔══██║██║   ██║
  ███████║██║██║ ╚████║   ██║   ██║  ██║╚██████╔╝
  ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝

  Welcome to Sinthujan's terminal. Type 'help' to get started.
`.trim()

const COMMANDS = {
  help: () => `Available commands:
  whoami      — About me
  skills      — My tech stack
  projects    — What I've built
  contact     — How to reach me
  secret      — 🤫
  clear       — Clear the terminal
  exit        — Close the terminal`,

  whoami: () => `Sinthujan — AI Developer & ML Enthusiast
  📍 Sri Lanka 🇱🇰
  🎓 AI Undergraduate Student
  💡 Aspiring AI Entrepreneur
  🔭 Currently building AI Agents & LLM applications`,

  skills: () => `Tech Stack:
  Languages  → Python (90%), JavaScript (85%), Java (75%)
  Frontend   → React, Tailwind CSS, HTML/CSS
  AI/ML      → LangChain, OpenAI, TensorFlow, PyTorch
  Backend    → FastAPI, Node.js, Express
  Tools      → Git, Docker, VS Code`,

  projects: () => `Featured Projects:
  1. Multi-Agent AI Assistant  — LangChain · OpenAI · FastAPI
  2. Smart Fitness Planner     — Python · Scikit-learn · React
  3. IoT Smart Water Pump      — Arduino · MQTT · Python
  4. AI Chat Application       — React · OpenAI API · Socket.io

  → Visit the Projects section for live demos`,

  contact: () => `Get in touch:
  📧 sinthujan@email.com
  🐙 github.com/sinthujan
  💼 linkedin.com/in/sinthujan

  Or use the contact form on this page!`,

  secret: () => `🤖 You found the Easter egg!

  "Any sufficiently advanced technology is
   indistinguishable from magic."
        — Arthur C. Clarke

  Keep building cool things. 🚀`,

  clear: () => '__CLEAR__',
  exit: () => '__EXIT__',
}

export default function Terminal({ onClose }) {
  const [lines, setLines] = useState([BANNER])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const run = cmd => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setHistory(h => [trimmed, ...h])
    setHistIdx(-1)

    const fn = COMMANDS[trimmed]
    if (!fn) {
      setLines(l => [...l, `$ ${cmd}`, `Command not found: ${trimmed}. Type 'help' for options.`])
      return
    }

    const result = fn()
    if (result === '__CLEAR__') { setLines([]); return }
    if (result === '__EXIT__')  { onClose(); return }
    setLines(l => [...l, `$ ${cmd}`, result])
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{   opacity: 0, scale: 0.92,  y: 40 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-[180] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a2e] border-b border-white/10 flex-shrink-0">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-gray-500 font-mono">sinthujan — terminal</span>
        </div>

        {/* Output */}
        <div
          className="flex-1 overflow-y-auto p-5 font-mono text-sm bg-[#0d0d1a] text-gray-300 space-y-1"
          style={{ minHeight: '300px', maxHeight: '60vh' }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <pre key={i} className={`whitespace-pre-wrap leading-relaxed ${line.startsWith('$') ? 'text-indigo-400' : ''}`}>
              {line}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-5 py-3 bg-[#0d0d1a] border-t border-white/10 flex-shrink-0">
          <span className="text-indigo-400 font-mono text-sm flex-shrink-0">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-gray-200 font-mono text-sm outline-none caret-indigo-400"
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </motion.div>
  )
}
