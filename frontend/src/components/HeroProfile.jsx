import { Github, Linkedin, Mail, ArrowUpRight, ArrowDown, MapPin } from 'lucide-react'
import ProfileOrbit from './ProfileOrbit'
import { useRef } from 'react'
import AIText, { useHeroTextReveal } from './AIText'

const socials = [
  { icon: Github, href: 'https://github.com/Sinthujans23', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:sinthuu07@gmail.com', label: 'Email' },
]

export default function HeroProfile() {
  const sectionRef = useRef(null)
  useHeroTextReveal(sectionRef)
  return (
    <section ref={sectionRef} id="home" className="cosmic-hero" aria-labelledby="hero-name">
      <div className="cosmic-hero-grid">
        <div className="cosmic-topline">
          <span className="cosmic-eyebrow"><span className="cosmic-status-dot" /> <AIText>Available for opportunities</AIText></span>
          <span className="cosmic-coordinate"><AIText delay={150}>AI / MACHINE LEARNING / SOFTWARE</AIText></span>
        </div>
        <div className="cosmic-intro-layout">
        <div className="cosmic-copy">
          <p className="cosmic-introduction"><AIText delay={100}>Hello, I'm</AIText></p>
          <h1 id="hero-name">Sinthujan S<span>.</span></h1>
          <p className="cosmic-role"><AIText delay={300}>AI Developer</AIText><span className="cosmic-role-separator">/</span><AIText delay={450}>ML Enthusiast</AIText></p>
          <p className="cosmic-description"><AIText delay={450}>I build intelligent AI agents, LLM applications, and thoughtful digital experiences.</AIText></p>
          <div className="cosmic-actions">
            <a href="#projects" className="cosmic-primary"><AIText delay={700}>Explore my work</AIText> <ArrowUpRight size={18} /></a>
            <a href="#contact" className="cosmic-secondary"><AIText delay={800}>Let's talk</AIText> <ArrowUpRight size={18} /></a>
          </div>
          <div className="cosmic-links">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon size={18} /></a>
            ))}
            <span className="cosmic-location"><MapPin size={13} /> <AIText delay={900}>Sri Lanka</AIText></span>
          </div>
        </div>
        <ProfileOrbit />
        </div>
      </div>
      <div className="cosmic-footer"><span><AIText delay={700}>IDEAS. INTELLIGENCE. IMPACT.</AIText></span><a href="#about"><AIText delay={900}>Scroll to discover</AIText> <ArrowDown size={14} /></a><span><AIText delay={850}>PORTFOLIO / 2026</AIText></span></div>
    </section>
  )
}
