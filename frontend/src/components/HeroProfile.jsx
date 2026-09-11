import { Github, Linkedin, Mail, ArrowUpRight, ArrowDown, MapPin } from 'lucide-react'
import ProfileOrbit from './ProfileOrbit'

const socials = [
  { icon: Github, href: 'https://github.com/Sinthujans23', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sivarajan-sinthujan-71a93b2a2', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:sinthuu07@gmail.com', label: 'Email' },
]

export default function HeroProfile() {
  return (
    <section id="home" className="cosmic-hero" aria-labelledby="hero-name">
      <div className="cosmic-hero-grid">
        <div className="cosmic-topline">
          <span className="cosmic-eyebrow"><span /> Available for opportunities</span>
          <span className="cosmic-coordinate">AI / MACHINE LEARNING / SOFTWARE</span>
        </div>
        <div className="cosmic-intro-layout">
        <div className="cosmic-copy">
          <p className="cosmic-introduction">Hello, I'm Sivarajan</p>
          <h1 id="hero-name">Sinthujan<span>.</span></h1>
          <p className="cosmic-role">AI Developer <span>/</span> Software Engineer <span>/</span> ML Enthusiast</p>
          <p className="cosmic-description">I build intelligent AI agents, LLM applications, and thoughtful digital experiences. <br />Turning curiosity into software that solves real-world problems.</p>
          <div className="cosmic-actions">
            <a href="#projects" className="cosmic-primary">Explore my work <ArrowUpRight size={18} /></a>
            <a href="#contact" className="cosmic-secondary">Let's talk <ArrowUpRight size={18} /></a>
          </div>
          <div className="cosmic-links">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon size={18} /></a>
            ))}
            <span className="cosmic-location"><MapPin size={13} /> Sri Lanka</span>
          </div>
        </div>
        <ProfileOrbit />
        </div>
      </div>
      <div className="cosmic-footer"><span>IDEAS. INTELLIGENCE. IMPACT.</span><a href="#about">Scroll to discover <ArrowDown size={14} /></a><span>PORTFOLIO / 2026</span></div>
    </section>
  )
}
