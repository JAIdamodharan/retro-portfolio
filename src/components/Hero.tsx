import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { profile } from '../content'
import { useGame } from '../game'
import { sfx } from '../sfx'
import Coin from './Coin'

// Types text one character at a time, with a blinking block caret.
function Typewriter({ text, start, speed = 90, onDone, tick, caretOnDone = false }: {
  text: string; start: number; speed?: number; onDone?: () => void; tick?: boolean; caretOnDone?: boolean
}) {
  const [n, setN] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t0 = setTimeout(() => setOn(true), start * 1000)
    return () => clearTimeout(t0)
  }, [start])
  useEffect(() => {
    if (!on) return
    if (n >= text.length) { onDone?.(); return }
    const t = setTimeout(() => { setN(n + 1); if (tick && text[n] !== ' ') sfx.type() }, speed)
    return () => clearTimeout(t)
  }, [on, n, text, speed, onDone, tick])
  const typing = on && n < text.length
  return (
    <>
      <span aria-hidden>{text.slice(0, n)}</span>
      {(typing || (on && caretOnDone) || !on) && <span className="caret" aria-hidden />}
    </>
  )
}

export default function Hero() {
  const { unlock, addXp } = useGame()
  const [first, last] = profile.name.split(' ')
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 5000); return () => clearTimeout(t) }, []) // never hang on a slow connection
  const [step, setStep] = useState(0) // 0 typing first, 1 typing last, 2 tagline, 3 buttons
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 20 }), sy = useSpring(my, { stiffness: 50, damping: 20 })
  const tx = useTransform(sx, v => v * -18), ty = useTransform(sy, v => v * -12)

  return (
    <section id="hero" className="hero"
      onPointerMove={e => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5) }}>
      <motion.video className="hero-video" src="/hero.mp4" poster="/hero-poster.jpg" autoPlay muted loop playsInline preload="auto"
        onCanPlay={() => setReady(true)} onError={() => setReady(true)}
        style={{ x: tx, y: ty, scale: 1.08 }} aria-hidden />
      <div className="tint" /><div className="fog" aria-hidden /><div className="scan" />
      <Coin style={{ right: '14%', top: '28%' }} /><Coin style={{ right: '30%', top: '58%' }} />

      <AnimatePresence>
        {!ready && (
          <motion.div className="loader" role="status" aria-label="Loading" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <div className="dots" aria-hidden>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.i key={i} animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12, ease: 'easeOut' }} />
              ))}
            </div>
            <span>LOADING</span>
          </motion.div>
        )}
      </AnimatePresence>

      {ready && <div className="hero-copy">
        <motion.p className="press" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1] }} transition={{ delay: 0.4, duration: 1.2, times: [0, .3, .6, 1] }}>
          ▶ PLAYER 1
        </motion.p>
        <h1 aria-label={profile.name}>
          <span className="line"><Typewriter text={first} start={2} onDone={() => setStep(s => Math.max(s, 1))} /></span>
          <span className="line">{step >= 1 && <Typewriter text={last} start={0.25} onDone={() => setStep(s => Math.max(s, 2))} caretOnDone />}</span>
        </h1>
        <p className="tagline" aria-label={profile.tagline}>
          {step >= 2 && <Typewriter text={profile.tagline} start={0.2} speed={28} onDone={() => setStep(s => Math.max(s, 3))} />}
        </p>
        <motion.ul className="facts" initial={{ opacity: 0 }} animate={step >= 3 ? { opacity: 1 } : {}} aria-label="About">
          {profile.facts.map(f => <li key={f}>{f}</li>)}
        </motion.ul>
        <motion.div className="btns" initial={{ opacity: 0, y: 12 }} animate={step >= 3 ? { opacity: 1, y: 0 } : {}}>
          <a className="pbtn" href="#work" onClick={() => { sfx.jump(); unlock('start') }}>SEE MY WORK</a>
          <a className="pbtn ghost" href={profile.resume} target="_blank" rel="noopener" onClick={() => { sfx.blip(); addXp(5) }}>RESUME</a>
        </motion.div>
      </div>}
      <div className="scroll-hint" aria-hidden>▼</div>
    </section>
  )
}
