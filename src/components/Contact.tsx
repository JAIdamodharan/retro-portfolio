import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { profile } from '../content'
import { useGame } from '../game'
import { sfx } from '../sfx'
import Hands from './Hands'
import Socials from './Icons'

export default function Contact() {
  const { unlock, addXp, say } = useGame()
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState(0)
  const [connected, setConnected] = useState(false)

  // Hands are driven by scroll: arriving at Contact brings them together.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'center center'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 18, mass: 0.6 })
  useMotionValueEvent(progress, 'change', v => {
    if (v > 0.985 && !connected) { setConnected(true); sfx.connect(); unlock('connect'); say('Connecting people!') }
    else if (v < 0.9 && connected) setConnected(false)
  })

  const copy = async () => {
    sfx.levelUp(); setBurst(b => b + 1); unlock('hello'); addXp(20)
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); say('Email copied!') } catch { location.href = `mailto:${profile.email}` }
  }
  const confetti = (n: number) => Array.from({ length: 24 }, (_, i) => ({ i, a: (i / 24) * Math.PI * 2, d: 90 + (i % 5) * 30, n }))

  return (
    <section id="contact" className="contact" ref={ref}>
      <p className="press">{profile.location}</p>
      <motion.h2 className="big" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 160, damping: 12 }} whileHover={{ rotate: -2 }}
        animate={connected ? { y: [0, -10, 0] } : {}}>
        Let's talk.
      </motion.h2>
      <Hands progress={progress} connected={connected} />
      <div className="mail-wrap">
        <button className="pbtn big-btn" onClick={copy}>{profile.email}</button>
        <AnimatePresence>
          {burst > 0 && confetti(burst).map(p => (
            <motion.i key={`${p.n}-${p.i}`} className="conf" style={{ background: ['#a855f7', '#e9d5ff', '#facc15', '#22d3ee'][p.i % 4] }}
              initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(p.a) * p.d, y: Math.sin(p.a) * p.d + 40, opacity: 0, rotate: 270 }}
              transition={{ duration: 0.9, ease: 'easeOut' }} />
          ))}
        </AnimatePresence>
      </div>
      <p className="hint">{copied ? '✔ COPIED — 1UP!' : 'CLICK TO COPY'}</p>
      <Socials />
    </section>
  )
}
