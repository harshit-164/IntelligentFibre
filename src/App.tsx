import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronRight, Hexagon } from 'lucide-react'

const PORTRAIT_URL = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85'

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [framesReady, setFramesReady] = useState(false)
  const framesRef = useRef<HTMLImageElement[]>([])
  const targetRef = useRef(0)
  const smoothRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let raf = 0
    let disposed = false
    const frameCount = 300
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    const draw = (source: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height
      const sw = source.naturalWidth
      const sh = source.naturalHeight
      if (!sw || !sh) return
      const scale = Math.max(cw / sw, ch / sh)
      const w = sw * scale, h = sh * scale
      context.clearRect(0, 0, cw, ch)
      context.drawImage(source, (cw - w) / 2, (ch - h) / 2, w, h)
    }
    const images = Array.from({ length: frameCount }, (_, i) => {
      const image = new Image()
      image.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
      return image
    })
    framesRef.current = images
    let loaded = 0
    const onImageLoad = () => {
      loaded += 1
      if (loaded === 1) draw(images[0])
      if (loaded === frameCount && !disposed) setFramesReady(true)
    }
    images.forEach((image) => { image.addEventListener('load', onImageLoad) })
    const onScroll = () => { targetRef.current = Math.max(0, Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))) }
    const frame = () => {
      smoothRef.current += (targetRef.current - smoothRef.current) * 0.12
      const index = Math.min(frameCount - 1, Math.floor(smoothRef.current * (frameCount - 1)))
      const image = framesRef.current[index]
      if (image?.complete) draw(image)
      raf = requestAnimationFrame(frame)
    }
    resize(); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', resize); raf = requestAnimationFrame(frame)
    return () => { disposed = true; cancelAnimationFrame(raf); images.forEach((image) => image.removeEventListener('load', onImageLoad)); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize) }
  }, [])
  return <div className="video-layer" aria-hidden="true">
    <img className={`video-poster ${framesReady ? 'fade-out' : ''}`} src="/frames/ezgif-frame-001.jpg" alt="" />
    <canvas ref={canvasRef} className={framesReady ? 'canvas-ready' : ''} />
    <div className="video-shade" />
  </div>
}

const services = ['AI AUTOMATION', 'AI INTEGRATION', 'AI AGENT DEVELOPMENT']
const capabilities = [
  ['01', 'Real-time vision', 'Reads context as it happens and surfaces what matters before you ask.'],
  ['02', 'Layered insight', 'Moves from rough outline to sharp output without losing the thread.'],
  ['03', 'Adaptive speed', 'Learns your cadence and tightens every pass as you work.'],
]

function ActionButton({ children, secondary = false }: { children: ReactNode; secondary?: boolean }) {
  return <button className={secondary ? 'button secondary' : 'button'}>{children}<ChevronRight size={14} /></button>
}

export default function App() {
  return <div className="page"><ScrollVideo /><div className="content">
    <header className="navbar">
      <Reveal className="brand"><Hexagon size={24} strokeWidth={1.5} /><span>novaai</span></Reveal>
      <nav>{['Projects', 'About', 'Blog', 'Contact'].map((item, i) => <Reveal key={item} delay={100 + i * 100}><a href="#">{item}{item === 'Projects' && <sup>6</sup>}</a></Reveal>)}</nav>
      <Reveal delay={500}><a className="consultation" href="#contact">Get Free Consultation</a></Reveal>
    </header>
    <main>
      <section className="hero section-shell">
        <div className="top-row"><div className="service-list">{services.map((service, i) => <Reveal key={service} delay={150 + i * 120}><span>/</span> {service}</Reveal>)}</div><Reveal delay={300} className="intro">We design automation that brings clarity, precision, and efficiency to the way your company operates.</Reveal></div>
        <div className="bottom-row"><div><Reveal delay={150}><div className="badge">We Automate 100+ Businesses</div></Reveal><Reveal delay={280}><h1>Clear. Precise.<br />Automated.</h1></Reveal></div><Reveal delay={420}><div className="contact-card" id="contact"><img src={PORTRAIT_URL} alt="Mitha, co-founder of NovaAI" /><div className="contact-copy"><p>Talk with Mitha</p><span>Co-founder of NovaAI</span><button>Book 15-mins call <ChevronRight size={14} /></button></div></div></Reveal></div>
      </section>
      <div className="spacer" aria-hidden="true" />
      <section className="capability section-shell">
        <div className="top-row"><Reveal delay={120}><div className="badge">Insight On Demand</div></Reveal><Reveal delay={220} className="intro">Our AI doesn't just respond — it interprets, sharpens, and delivers the signal you need.</Reveal></div>
        <div className="capability-bottom"><div className="copy-column"><Reveal delay={180}><h2>Learn to see<br />brilliantly.</h2></Reveal><Reveal delay={320}><p>From the first sketch to the final render, Nova turns raw intent into decisions your team can act on — quietly, precisely, at speed.</p></Reveal><Reveal delay={420}><div className="actions"><ActionButton>Run the demo</ActionButton><ActionButton secondary>Free consultation</ActionButton></div></Reveal></div><div className="capability-panel">{capabilities.map(([index, title, body], i) => <Reveal key={index} delay={300 + i * 110}><div className={`capability-row ${i < 2 ? 'divider' : ''}`}><span className="index">{index}</span><div><div className="cap-title"><span>{title}</span><ChevronRight size={16} /></div><p>{body}</p></div></div></Reveal>)}</div></div>
      </section>
    </main>
  </div></div>
}
