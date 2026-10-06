import { useState } from 'react'
import { motion } from 'framer-motion'
import { BODY } from '../pixel'
import { useGame } from '../game'
import CRT from './CRT'

// Attract-mode loop: the slime keeps hopping a pipe until you press play.
function Attract({ play }: { play: boolean }) {
  return (
    <div className="attract" aria-hidden>
      <motion.svg className="a-slime" viewBox="0 0 12 12" width="48" height="48" shapeRendering="crispEdges"
        animate={play ? { y: [0, 0, -52, 0, 0] } : { y: 0 }} transition={play ? { repeat: Infinity, duration: 3.4, times: [0, 0.38, 0.52, 0.66, 1], ease: 'easeOut' } : { duration: 0.8 }}>
        {BODY.map((row, y) => [...row].map((c, x) => c === '█' && <rect key={`${x}${y}`} x={x} y={y} width="1.02" height="1.02" fill={y < 3 ? '#c084fc' : '#a855f7'} />))}
        <rect x="3" y="3.5" width="2" height="2.4" fill="#fff" /><rect x="7" y="3.5" width="2" height="2.4" fill="#fff" />
        <rect x="4" y="4" width="1" height="1.4" fill="#1a0b2e" /><rect x="8" y="4" width="1" height="1.4" fill="#1a0b2e" />
      </motion.svg>
      <motion.div className="a-pipe" animate={play ? { x: ['0%', '-110%'] } : { x: '0%' }} transition={play ? { repeat: Infinity, duration: 3.4, ease: 'linear' } : { duration: 0 }} />
      <div className="a-ground" />
    </div>
  )
}

export default function Arcade() {
  const { openGame } = useGame()
  const [play, setPlay] = useState(false)
  return (
    <section id="arcade" className="arcade">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span>LEVEL 2</span> BONUS STAGE
      </motion.h2>
      <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }} whileHover={{ y: -4, transition: { duration: 0.6 } }}>
        <CRT title="SLIME-RUN.EXE">
          <button className="cabinet" onClick={openGame} aria-label="Play the mini game"
            onPointerEnter={() => setPlay(true)} onPointerLeave={() => setPlay(false)} onFocus={() => setPlay(true)} onBlur={() => setPlay(false)}>
            <Attract play={play} />
            <span className="insert">INSERT COIN</span>
            <span className="pbtn">▶ PLAY</span>
          </button>
        </CRT>
      </motion.div>
    </section>
  )
}
