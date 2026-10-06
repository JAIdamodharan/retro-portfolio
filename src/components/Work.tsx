import { ReactNode, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { inventory, projects, soon } from '../content'
import { useGame } from '../game'
import { sfx } from '../sfx'
import Coin from './Coin'
import Terminal from './Terminal'
import CaseStudy from './CaseStudy'
import { Art, MiniMonitor, NeuralArt } from './Art'

// A flashcard: tilts toward the cursor, flips on click/Enter, front + back faces.
function FlipCard({ index, front, back, label, onFlip, wide = false }: {
  index: number; front: (hover: boolean) => ReactNode; back: (n: number) => ReactNode; label: string; onFlip: (first: boolean) => void; wide?: boolean
}) {
  const [flips, setFlips] = useState(0)
  const [hover, setHover] = useState(false)
  const flipped = flips % 2 === 1
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 90, damping: 22 })
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 90, damping: 22 })
  const tilt = [-1.2, 0.9, -0.7, 1.2, 0][index % 5]
  const flip = () => { sfx.jump(); setFlips(f => f + 1); onFlip(flips === 0) }

  return (
    <motion.div className={`card-wrap ${wide ? 'wide' : ''}`} initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }} whileHover={{ rotate: 0, y: -6, zIndex: 5, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.08 }}>
      <motion.div className="card" role="button" tabIndex={0} aria-pressed={flipped} aria-label={`${label}. Press to flip card`}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height) }}
        onPointerLeave={() => { mx.set(0.5); my.set(0.5); setHover(false) }}
        onPointerEnter={() => setHover(true)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} whileTap={{ scale: 0.98 }}
        onClick={flip} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flip())}>
        <motion.div className="card-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 1.1, ease: [0.45, 0, 0.2, 1] }}>
          <div className="face front" aria-hidden={flipped}>{front(hover)}</div>
          <div className="face back" aria-hidden={!flipped}>{flipped && back(flips)}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const FlipHint = ({ back = false }: { back?: boolean }) => <span className="flip-hint">{back ? '↻ FLIP BACK' : '↻ TAP TO FLIP'}</span>

export default function Work() {
  const { addXp, say, unlock } = useGame()
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [study, setStudy] = useState<number | null>(null)

  const onFlip = (i: number, first: boolean) => {
    if (!first) return
    addXp(15); sfx.coin()
    say(i < projects.length ? 'Quest card unlocked! +15' : 'Ooh, what comes next?')
    setSeen(s => {
      const n = new Set(s).add(i)
      if (n.size >= projects.length) unlock('explorer')
      return n
    })
  }

  return (
    <section id="work" className="work">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span>LEVEL 1</span> SELECTED WORK
      </motion.h2>
      <div className="cards">
        {projects.map((p, i) => (
          <FlipCard key={p.title} index={i} label={`${p.title}: ${p.stat} ${p.label}`} onFlip={f => onFlip(i, f)}
            front={hover => <>
              <div className="art"><div className="art-screen"><Art kind={p.art} play={hover} /><span className="no">0{i + 1}</span></div></div>
              <div className="title-row"><MiniMonitor kind={p.art} /><h3>{p.title}</h3></div>
              <p>{p.line}</p>
              <div className="stat"><strong>{p.stat}</strong><small>{p.label}</small></div>
              <FlipHint />
            </>}
            back={n => <>
              <div className="back-bar"><i /><i /><i /><span>QUEST_0{i + 1}.EXE</span></div>
              <Terminal key={n} lines={p.log} />
              {p.study && <button className="repo study-btn" onClick={e => { e.stopPropagation(); sfx.jump(); setStudy(i) }}>READ CASE STUDY ▸</button>}
              {p.repo && <a className="repo" href={p.repo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>VIEW CODE ↗</a>}
              <FlipHint back />
            </>} />
        ))}
        <FlipCard index={4} wide label={`${soon.title}: ${soon.line}`} onFlip={f => onFlip(4, f)}
          front={hover => <>
            <div className="art"><div className="art-screen"><NeuralArt play={hover} /><span className="no">?</span></div></div>
            <div className="title-row"><MiniMonitor kind="ai" /><h3>{soon.title}</h3></div>
            <p>{soon.line}</p>
            <div className="loadbar" aria-hidden><motion.i initial={{ width: '6%' }} whileInView={{ width: '62%' }} viewport={{ once: true }} transition={{ duration: 3, ease: 'easeOut' }} /></div>
            <div className="stat"><strong className="teaser">{soon.teaser}</strong></div>
            <FlipHint />
          </>}
          back={n => <>
            <div className="back-bar"><i /><i /><i /><span>NEXT_QUEST.EXE</span></div>
            <Terminal key={n} lines={soon.log} />
            <FlipHint back />
          </>} />
      </div>
      <div className="inventory">
        <h4>INVENTORY</h4>
        <ul className="chips">{inventory.skills.map(s => <li key={s}>{s}</li>)}</ul>
        <ul className="badges">{inventory.badges.map(b => <li key={b}>★ {b}</li>)}</ul>
      </div>
      <CaseStudy project={study === null ? null : projects[study]} onClose={() => setStudy(null)} />
      <Coin style={{ right: '6%', top: '12%' }} />
      <Coin style={{ left: '4%', bottom: '8%' }} />
      <Coin style={{ right: '40%', bottom: '3%' }} />
    </section>
  )
}
