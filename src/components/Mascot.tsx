import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { useGame } from '../game'
import { sfx } from '../sfx'
import { BODY } from '../pixel'

type Mood = 'idle' | 'happy' | 'sleep' | 'wow'
const sectionLines: Record<string, string[]> = {
  hero: ['Press start!', 'Nice view, huh?'],
  work: ['Flip the cards!', 'Tap a card to flip it!'],
  arcade: ['Bonus stage! Wanna play?', 'Press G to play!'],
  contact: ['Say hi!', 'Last level!'],
}
const clamp = (n: number) => Math.max(-1, Math.min(1, n))

// Calls cb(prev, next) whenever v changes.
function useChange<T>(v: T, cb: (prev: T, next: T) => void) {
  const prev = useRef(v)
  useEffect(() => { if (prev.current !== v) { const p = prev.current; prev.current = v; cb(p, v) } }) // eslint-disable-line
}

export default function Mascot() {
  const { say, speech, unlock, addXp, coins, level, sound, gameOpen, nudge, setNudge } = useGame()
  const ref = useRef<HTMLDivElement>(null)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [mood, setMood] = useState<Mood>('idle')
  const pokes = useRef(0)
  const idleT = useRef<number | undefined>(undefined)
  const moodT = useRef<number | undefined>(undefined)
  const controls = useAnimationControls()
  const moodRef = useRef<Mood>('idle'); moodRef.current = mood
  const coinsRef = useRef(coins); coinsRef.current = coins

  const feel = (m: Mood, ms = 1300) => {
    setMood(m); clearTimeout(moodT.current)
    moodT.current = window.setTimeout(() => setMood('idle'), ms)
  }
  const hop = (h = 30) => controls.start({ y: [0, -h, 0], scaleY: [1, 1.12, 0.85, 1], transition: { duration: 0.5 } })
  const react = (msg: string, m: Mood = 'happy', ms?: number, jump = true) => { say(msg, ms); feel(m); if (jump) hop() }

  const wake = () => {
    if (moodRef.current === 'sleep') { react("Oh, you're back!"); }
    clearTimeout(idleT.current)
    idleT.current = window.setTimeout(() => { setMood('sleep') }, 12000)
  }

  // cursor tracking (paused while the mascot is pointing at a coin)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      wake()
      if (nudge) return
      const r = ref.current?.getBoundingClientRect(); if (!r) return
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1, k = d < 40 ? 0 : 1
      setLook({ x: (dx / d) * k, y: (dy / d) * k })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('keydown', wake); window.addEventListener('pointerdown', wake)
    wake()
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('keydown', wake); window.removeEventListener('pointerdown', wake); clearTimeout(idleT.current) }
  }, [nudge]) // eslint-disable-line

  // 1) Teach the player: click coins for points. Eyes + hops point at the nearest coin.
  useEffect(() => {
    // Every fresh load starts at Level 1 with 0 coins, so ask right away (after the intro starts typing).
    const a = setTimeout(() => { if (coinsRef.current === 0) { setNudge(true); say('Level 1! Click the coins to collect points!', 5500); hop(24) } }, 3500)
    const b = setTimeout(() => { if (coinsRef.current === 0) { say('Psst! Coins = points. Try one!', 4500); hop(24) } }, 22000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, []) // eslint-disable-line
  useEffect(() => {
    if (!nudge) return
    let n = 0
    const id = setInterval(() => {
      const r = ref.current?.getBoundingClientRect(); if (!r) return
      let best: { dx: number; dy: number; d: number } | null = null
      document.querySelectorAll('.coin').forEach(el => {
        const b = el.getBoundingClientRect()
        if (b.bottom < 0 || b.top > innerHeight) return
        const dx = b.left + b.width / 2 - (r.left + r.width / 2), dy = b.top + b.height / 2 - (r.top + r.height / 2), d = Math.hypot(dx, dy)
        if (!best || d < best.d) best = { dx, dy, d }
      })
      if (best) { const b = best as { dx: number; dy: number; d: number }; setLook({ x: b.dx / b.d, y: b.dy / b.d }) }
      if (++n % 40 === 0) hop(14)
    }, 150)
    return () => clearInterval(id)
  }, [nudge]) // eslint-disable-line

  // 2) React to what the user does
  useChange(coins, (p, n) => {
    if (nudge) setNudge(false)
    const gained = n - p
    if (gained > 1) return react(`+${gained} coins from the game! Nice!`, 'happy', 3000)
    if (n === 1) return react('You got it! Coins give XP too!', 'happy', 3200)
    if (n === 5) return react('5 coins! Coin master!', 'happy', 3000)
    if (n === 10) return react('10 coins! Rich!', 'happy', 3000)
    if (n % 4 === 0) react(['Nice!', 'Ka-ching!', 'Shiny!'][(n / 4) % 3], 'happy', 1800)
    else feel('happy', 700)
  })
  useChange(level, (_p, n) => react(`LEVEL UP! You're Lv${n}!`, 'happy', 3000))
  useChange(sound, (_p, n) => (n ? react('Sound on!', 'happy', 1600, false) : react('Shhh... muted.', 'idle', 1600, false)))
  useChange(gameOpen, (_p, n) => (n ? say('Good luck! Jump with Space!', 2200) : react('GG! Nice run.', 'happy', 2500)))

  useEffect(() => {
    // fast scrolling, tab switching, scroll to the very bottom
    let lastY = scrollY, lastT = performance.now(), lastWow = 0, bottom = false
    const onScroll = () => {
      const now = performance.now(), v = Math.abs(scrollY - lastY) / Math.max(1, now - lastT)
      lastY = scrollY; lastT = now
      if (v > 4 && now - lastWow > 9000) { lastWow = now; react('Whoa, slow down!', 'wow', 2200, false) }
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4
      if (atEnd && !bottom) { bottom = true; feel('happy', 1500) } else if (!atEnd) bottom = false
    }
    const vis = () => { if (!document.hidden) feel('happy', 1200) }
    addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('visibilitychange', vis)
    return () => { removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', vis) }
  }, []) // eslint-disable-line

  // section commentary
  useEffect(() => {
    const said = new Set<string>()
    const io = new IntersectionObserver(es => es.forEach(e => {
      const id = (e.target as HTMLElement).id
      if (e.isIntersecting && !said.has(id) && sectionLines[id] && id !== 'hero') {
        said.add(id)
        // Arriving at Level 1 without any coins yet: point at the coins again.
        if (id === 'work' && coinsRef.current === 0) { setNudge(true); say('Level 1! Click the coins to collect points!', 5000); return }
        say(sectionLines[id][Math.floor(Math.random() * sectionLines[id].length)])
      }
    }), { threshold: 0.5 })
    Object.keys(sectionLines).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [say, setNudge])

  const poke = () => {
    sfx.jump(); wake(); addXp(2); pokes.current++
    if (pokes.current === 5) { unlock('poke'); react('Best friends! ♥', 'happy', 2600) }
    else if (pokes.current === 12) react('Okay okay, that tickles!', 'wow', 2400)
    else (pokes.current % 3 === 0 ? react(['Boing!', 'Hehe!', 'Again!'][(pokes.current / 3) % 3], 'happy', 1500) : (sfx.jump(), feel('happy', 900), hop()))
  }

  const px = (base: number) => base + clamp(look.x) * 0.5
  const py = 4 + clamp(look.y) * 0.5
  return (
    <motion.div className="mascot" drag dragMomentum={false} whileDrag={{ scale: 1.1 }} aria-label="Pixel mascot" ref={ref}
      onHoverStart={() => { if (!speech && mood === 'idle') { feel('happy', 900) } }}>
      {speech && <motion.div className="bubble" key={speech} initial={{ scale: 0 }} animate={{ scale: 1 }}>{speech}</motion.div>}
      {mood === 'sleep' && <div className="zzz">z<span>z</span><span>z</span></div>}
      <motion.svg viewBox="0 0 12 12" width="72" height="72" shapeRendering="crispEdges"
        animate={controls} onTap={poke} style={{ cursor: 'pointer', overflow: 'visible' }}>
        <motion.g animate={mood === 'idle' ? { y: [0, -0.3, 0] } : mood === 'wow' ? { x: [0, -0.3, 0.3, 0] } : {}} transition={{ repeat: Infinity, duration: mood === 'wow' ? 0.2 : 3.4 }}>
          {BODY.map((row, y) => [...row].map((c, x) => c === '█' && <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={y < 3 ? '#c084fc' : '#a855f7'} />))}
          {mood === 'sleep' ? <>
            <rect x="3" y="5" width="2" height=".6" fill="#1a0b2e" /><rect x="7" y="5" width="2" height=".6" fill="#1a0b2e" /></> : <>
            <rect x="3" y="3.5" width="2" height="2.4" fill="#fff" /><rect x="7" y="3.5" width="2" height="2.4" fill="#fff" />
            {mood === 'wow'
              ? <><rect x="3.6" y="4.1" width=".8" height="1.2" fill="#1a0b2e" /><rect x="7.6" y="4.1" width=".8" height="1.2" fill="#1a0b2e" /></>
              : <><rect x={px(3)} y={py} width="1" height="1.4" fill="#1a0b2e" /><rect x={px(7)} y={py} width="1" height="1.4" fill="#1a0b2e" /></>}</>}
          {mood === 'happy' ? <rect x="5" y="7" width="2" height="1" fill="#1a0b2e" />
            : mood === 'wow' ? <rect x="5.2" y="6.8" width="1.6" height="1.8" fill="#1a0b2e" />
            : <rect x="5.5" y="7.4" width="1" height=".6" fill="#1a0b2e" />}
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}
