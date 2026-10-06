import { motion, type TargetAndTransition } from 'framer-motion'
import type { ArtKey } from '../content'

// Gentle looping animation that only runs while `play` is true; otherwise eases back to rest.
const L = (play: boolean, rest: TargetAndTransition, anim: TargetAndTransition, dur: number, delay = 0) => ({
  animate: play ? anim : rest,
  transition: play ? { repeat: Infinity, duration: dur, delay, ease: 'easeInOut' as const } : { duration: 1, ease: 'easeOut' as const },
})

const R = (x: number, y: number, w: number, h: number, f: string, o = 1) => <rect x={x} y={y} width={w} height={h} fill={f} opacity={o} />

// Original pixel illustrations, one per project (viewBox 64x40).
function Deepfake({ play }: { play: boolean }) {
  return <>
    {R(20, 4, 24, 6, '#3b1d0f')}{R(20, 4, 4, 18, '#3b1d0f')}{R(40, 4, 4, 18, '#3b1d0f')}
    {R(22, 8, 20, 24, '#f6c19b')}{R(28, 32, 8, 4, '#d38b5d')}
    {R(26, 15, 4, 3, '#1a0b2e')}{R(34, 15, 4, 3, '#1a0b2e')}{R(28, 24, 8, 2, '#b45309')}
    <motion.g {...L(play, { x: 0, opacity: 0.2 }, { x: [0, 2, -1, 0], opacity: [0.2, 0.45, 0.3, 0.2] }, 3.2)}>
      {R(32, 6, 12, 26, '#22d3ee')}{R(22, 20, 20, 2, '#f0abfc')}
    </motion.g>
    {R(14, 2, 6, 2, '#facc15')}{R(14, 2, 2, 6, '#facc15')}{R(44, 2, 6, 2, '#facc15')}{R(48, 2, 2, 6, '#facc15')}
    {R(14, 36, 6, 2, '#facc15')}{R(14, 32, 2, 6, '#facc15')}{R(44, 36, 6, 2, '#facc15')}{R(48, 32, 2, 6, '#facc15')}
    <motion.rect x="16" width="32" height="1.5" fill="#4ade80" initial={{ y: 19 }} {...L(play, { y: 19 }, { y: [4, 34, 4] }, 5)} />
  </>
}
function Reviews({ play }: { play: boolean }) {
  const bars = [[6, 8], [14, 14], [22, 20], [30, 28]]
  return <>
    {bars.map(([x, h], i) => (
      <motion.rect key={x} x={x} y={36 - h} width="6" height={h} fill={i % 2 ? '#c084fc' : '#a855f7'} style={{ transformOrigin: `${x}px 36px` }}
        {...L(play, { scaleY: 1 }, { scaleY: [0.55, 1, 0.55] }, 4, i * 0.4)} />
    ))}
    {R(4, 36, 34, 1.5, '#e9d5ff')}
    {[40, 46, 52, 58].map((x, i) => (
      <motion.g key={x} {...L(play, { opacity: 1 }, { opacity: [0.5, 1, 0.5] }, 3.2, i * 0.4)}>
        {R(x + 1, 6, 2, 6, '#facc15')}{R(x - 1, 8, 6, 2, '#facc15')}
      </motion.g>
    ))}
    {R(40, 17, 22, 14, '#fff')}{R(42, 31, 4, 3, '#fff')}
    {R(46, 21, 3, 3, '#1a0b2e')}{R(54, 21, 3, 3, '#1a0b2e')}{R(46, 26, 11, 2, '#1a0b2e')}
  </>
}
function Finance({ play }: { play: boolean }) {
  return <>
    <motion.g {...L(play, { y: 0 }, { y: [0, -1.5, 0] }, 3.6)}>
      {R(26, 6, 4, 14, '#c084fc')}{R(34, 6, 4, 14, '#c084fc')}{R(26, 6, 12, 4, '#c084fc')}
      {R(20, 18, 24, 18, '#facc15')}{R(20, 18, 24, 3, '#fde68a')}{R(20, 33, 24, 3, '#b45309')}
      {R(30, 24, 4, 4, '#7c2d12')}{R(31, 28, 2, 5, '#7c2d12')}
    </motion.g>
    {R(48, 32, 12, 3, '#facc15')}{R(48, 28, 12, 3, '#fde68a')}{R(48, 24, 12, 3, '#facc15')}
    {R(4, 28, 4, 8, '#4ade80')}{R(10, 22, 4, 14, '#4ade80')}{R(4, 36, 14, 1.5, '#e9d5ff')}
    <motion.g {...L(play, { opacity: 0.8 }, { opacity: [0.3, 1, 0.3] }, 3.6)}>{R(50, 10, 2, 6, '#fff')}{R(48, 12, 6, 2, '#fff')}</motion.g>
  </>
}
function Pods({ play }: { play: boolean }) {
  return <>
    {R(53, 0, 2, 3, '#fde68a')}{R(53, 13, 2, 3, '#fde68a')}{R(46, 7, 3, 2, '#fde68a')}{R(59, 7, 3, 2, '#fde68a')}
    {R(50, 4, 8, 8, '#facc15')}
    {R(6, 10, 24, 14, '#2563eb')}{R(6, 16, 24, 1, '#93c5fd')}{R(14, 10, 1, 14, '#93c5fd')}{R(22, 10, 1, 14, '#93c5fd')}{R(17, 24, 2, 8, '#94a3b8')}
    {R(36, 28, 18, 9, '#92400e')}{R(36, 28, 18, 2, '#b45309')}
    {R(44, 18, 2, 10, '#22c55e')}{R(38, 16, 7, 4, '#4ade80')}{R(46, 13, 7, 4, '#4ade80')}
    <motion.g {...L(play, { y: 0, opacity: 1 }, { y: [0, 10], opacity: [1, 0] }, 2.8)}>{R(41, 6, 3, 4, '#22d3ee')}{R(40, 9, 5, 2, '#22d3ee')}</motion.g>
  </>
}

export function Art({ kind, play = false }: { kind: ArtKey; play?: boolean }) {
  return (
    <svg viewBox="0 0 64 40" shapeRendering="crispEdges" className="art-svg" aria-hidden>
      {kind === 'deepfake' ? <Deepfake play={play} /> : kind === 'reviews' ? <Reviews play={play} /> : kind === 'finance' ? <Finance play={play} /> : <Pods play={play} />}
    </svg>
  )
}

// Neural-net doodle for the "learning AI/ML" card.
export function NeuralArt({ play = false }: { play?: boolean }) {
  const layers = [[10, 20, 30], [8, 16, 24, 32], [14, 26]]
  const xs = [14, 32, 50]
  return (
    <svg viewBox="0 0 64 40" shapeRendering="crispEdges" className="art-svg" aria-hidden>
      {layers.flatMap((ys, li) => li < 2 ? ys.flatMap(y => layers[li + 1].map(y2 =>
        <line key={`${li}-${y}-${y2}`} x1={xs[li] + 2} y1={y + 2} x2={xs[li + 1] + 2} y2={y2 + 2} stroke="#c084fc" strokeOpacity="0.35" strokeWidth="0.6" />)) : [])}
      {layers.map((ys, li) => ys.map((y, i) => (
        <motion.rect key={`${li}-${i}`} x={xs[li]} y={y} width="4" height="4" fill={li === 2 ? '#facc15' : '#e9d5ff'}
          {...L(play, { opacity: 0.85 }, { opacity: [0.4, 1, 0.4] }, 3.6, li * 0.6 + i * 0.2)} />
      )))}
    </svg>
  )
}

const ICONS: Record<ArtKey, string[]> = {
  deepfake: ['XX......XX', 'X........X', '...XXXX...', '..X.XX.X..', '..XXXXXX..', '..X.XX.X..', '...XXXX...', 'X........X', 'XX......XX'],
  reviews: ['..........', '.......XX.', '.......XX.', '...XX..XX.', '...XX..XX.', '.XXXX..XX.', '.XXXX..XX.', '.XXXXXXXX.', '..........'],
  finance: ['...XXXX...', '..X....X..', '..X....X..', '.XXXXXXXX.', '.XXXXXXXX.', '.XXX..XXX.', '.XXX..XXX.', '.XXXXXXXX.', '..........'],
  pods: ['......XX..', '.....XXXX.', '..XX.XXXX.', '.XXXX.XX..', '.XXXX.X...', '..XX..X...', '......X...', '....XXXXX.', '..........'],
}
export function PixelIcon({ kind, size = 22 }: { kind: ArtKey | 'ai'; size?: number }) {
  const map = kind === 'ai' ? ['..X...X...', '.XXX.XXX..', '..X...X...', '....XX....', 'XXXXXXXXXX', '....XX....', '..X...X...', '.XXX.XXX..', '..X...X...'] : ICONS[kind]
  return (
    <svg viewBox="0 0 10 9" width={size} height={size * 0.9} shapeRendering="crispEdges" fill="currentColor" aria-hidden>
      {map.flatMap((row, y) => [...row].map((c, x) => c === 'X' && <rect key={`${x}${y}`} x={x} y={y} width="1.05" height="1.05" />))}
    </svg>
  )
}

// Tiny 80s computer: beige case, black glass, phosphor-green glyph.
export function MiniMonitor({ kind, size = 46 }: { kind: ArtKey | 'ai'; size?: number }) {
  const map = kind === 'ai' ? ['..X...X...', '.XXX.XXX..', '..X...X...', '....XX....', 'XXXXXXXXXX', '....XX....', '..X...X...', '.XXX.XXX..', '..X...X...'] : ICONS[kind]
  return (
    <svg viewBox="0 0 16 15" width={size} height={size * 0.94} shapeRendering="crispEdges" aria-hidden className="mini-crt">
      <rect x="0" y="0" width="16" height="12" fill="#d8cfbd" /><rect x="0" y="10" width="16" height="2" fill="#b5ab94" />
      <rect x="1.5" y="1.5" width="13" height="8" fill="#06120a" />
      <g fill="#4ade80">{map.flatMap((row, y) => [...row].map((c, x) => c === 'X' && <rect key={`${x}${y}`} x={3 + x * 0.9} y={1.9 + y * 0.8} width="0.95" height="0.85" />))}</g>
      <rect x="12.5" y="10.6" width="1.4" height="0.9" fill="#4ade80" />
      <rect x="6" y="12" width="4" height="1.5" fill="#b5ab94" /><rect x="3.5" y="13.5" width="9" height="1.5" fill="#d8cfbd" />
    </svg>
  )
}
