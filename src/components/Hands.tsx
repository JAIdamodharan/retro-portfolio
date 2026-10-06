import { MotionValue, motion, useTransform } from 'framer-motion'
import type { ReactElement } from "react"

// Pixel hand pointing right. S=sleeve, H=skin, D=shadow.
const HAND = [
  '............HHHHHH............',
  'SSSS......HHHHHHHHHH..........',
  'SSSSSHHHHHHHHHHHHHHHHH........',
  'SSSSSHHHHHHHHHHHHHHHHHHHHHHHHH',
  'SSSSSHHHHHHHHHHHHHHHHHHHHHHHHH',
  'SSSSSHHHHHHHHHHHHHHHHH........',
  'SSSSSHHDDDHHDDDHHDDDHH........',
  'SSSSSHHHHHHHHHHHHHHHHH........',
  'SSSSS.HHHHHHHHHHHHHHH.........',
  'SSSS...HHHHHHHHHHHH...........',
  '........HHHHHHHH..............',
]
const COLS = HAND[0].length

function Hand({ sleeve }: { sleeve: string }) {
  const fill: Record<string, string> = { H: '#f6c19b', D: '#d38b5d', S: sleeve }
  const rects: ReactElement[] = []
  HAND.forEach((row, y) => {
    let x = 0
    while (x < COLS) {
      const ch = row[x]
      if (!ch || ch === '.') { x++; continue }
      let e = x; while (row[e + 1] === ch) e++
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={e - x + 1.04} height="1.04" fill={fill[ch]} />)
      x = e + 1
    }
  })
  return <svg viewBox={`0 0 ${COLS} ${HAND.length}`} shapeRendering="crispEdges" className="hand-svg">{rects}</svg>
}

export default function Hands({ progress, connected }: { progress: MotionValue<number>; connected: boolean }) {
  const lx = useTransform(progress, [0, 1], ['-62vw', '0vw'])
  const rx = useTransform(progress, [0, 1], ['62vw', '0vw'])
  const lr = useTransform(progress, [0, 1], [-14, 0])
  const rr = useTransform(progress, [0, 1], [14, 0])
  return (
    <div className="hands" aria-hidden>
      <motion.div className="hand left" style={{ x: lx, rotate: lr }} animate={connected ? { x: [0, 6, 0] } : {}} transition={{ duration: 0.35 }}>
        <Hand sleeve="#a855f7" />
      </motion.div>
      <motion.div className="hand right" style={{ x: rx, rotate: rr }}>
        <div className="flip"><Hand sleeve="#facc15" /></div>
      </motion.div>
      {connected && (
        <div className="spark">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.i key={i} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos((i / 8) * 6.283) * 54, y: Math.sin((i / 8) * 6.283) * 54, opacity: 0, scale: 0.4 }} transition={{ duration: 0.6 }} />
          ))}
          <motion.b initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ duration: 0.4 }}>✦</motion.b>
        </div>
      )}
    </div>
  )
}
