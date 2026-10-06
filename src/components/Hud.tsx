import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ACHIEVEMENTS, XP_PER_LEVEL, useGame } from '../game'
import { sfx } from '../sfx'
import { CoinIcon, StarIcon } from './HudIcons'

export default function Hud() {
  const { xp, level, coins, sound, toggleSound, toasts, unlocked, openGame } = useGame()
  const { scrollYProgress } = useScroll()
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })
  const pct = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
  return (
    <>
      <header className="hud">
        <span className="hud-lv">LV{String(level).padStart(2, '0')}</span>
        <div className="xp" role="progressbar" aria-label="XP" aria-valuenow={Math.round(pct)}>
          <motion.i animate={{ width: `${pct}%` }} />
        </div>
        <span className="hud-coins"><CoinIcon /><motion.b key={coins} initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>×{coins}</motion.b></span>
        <span className="hud-trophy" title="Achievements"><StarIcon /><b>{unlocked.length}/{Object.keys(ACHIEVEMENTS).length}</b></span>
        <button className="pbtn tiny play" onClick={openGame}>▶ GAME</button>
        <button className="pbtn tiny" onClick={() => { toggleSound(); sfx.blip() }} aria-pressed={sound}>{sound ? 'SND ON' : 'SND OFF'}</button>
        <motion.div className="scrollbar" style={{ scaleX: prog }} />
      </header>
      <div className="toasts" aria-live="polite">
        <AnimatePresence>
          {toasts.slice(0, 1).map(t => (
            <motion.div key={t.id} className="toast" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}>
              <b>{ACHIEVEMENTS[t.key].icon}</b> ACHIEVEMENT<br />{ACHIEVEMENTS[t.key].title}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
