import { CSSProperties, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../game'

// A glowing coin that bobs gently and spins around its vertical axis.
export default function Coin({ style }: { style: CSSProperties }) {
  const { collectCoin, nudge } = useGame()
  const [got, setGot] = useState(false)
  return (
    <AnimatePresence>
      {!got && (
        <motion.button className={`coin${nudge ? ' nudge' : ''}`} style={style} aria-label="Collect coin"
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          whileHover={{ scale: 1.25 }} exit={{ y: -80, opacity: 0, scale: 1.6 }}
          onClick={() => { setGot(true); collectCoin() }}>
          <motion.i className="disc" style={{ transformPerspective: 300 }}
            animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 3.6, ease: 'linear' }} />
          <span>+10</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
