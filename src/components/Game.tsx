import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CRT from './CRT'
import { useGame } from '../game'
import { sfx } from '../sfx'
import { BODY } from '../pixel'

const W = 640, H = 260, G = 212, PW = 36, PH = 36, PX = 70
type Ob = { k: 'pipe' | 'goomba' | 'coin' | 'block'; x: number; y: number; w: number; h: number; vx?: number; dead?: boolean; used?: boolean }
type Pop = { x: number; y: number; t: number }
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

const fresh = () => ({
  phase: 'ready' as 'ready' | 'intro' | 'play' | 'over', px: PX, introT: 0, y: G - PH, vy: 0, ground: true, speed: 3.2, dist: 0, coins: 0, t: 0, gap: 380,
  obs: [] as Ob[], pops: [] as Pop[], overAt: 0, credited: false, goSound: false,
})

function Stage({ onClose }: { onClose: () => void }) {
  const { addCoins, unlock } = useGame()
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = cv.current!, g = c.getContext('2d')!
    const s = fresh()
    let best = 0
    try { best = Number(localStorage.getItem('jd-best')) || 0 } catch { /* storage blocked */ }
    const score = () => s.coins * 10 + Math.floor(s.dist / 10)
    const credit = () => {
      if (s.credited) return
      s.credited = true
      addCoins(s.coins)
      if (s.coins >= 10) unlock('runner')
      if (score() > best) { best = score(); try { localStorage.setItem('jd-best', String(best)) } catch { /* ignore */ } }
    }
    const die = () => { s.phase = 'over'; s.overAt = performance.now(); sfx.over(); credit() }
    const pop = (x: number, y: number) => s.pops.push({ x, y, t: 0 })

    // Starting (or retrying) plays a short intro: the slime walks in, READY? ... GO!
    const startIntro = () => { Object.assign(s, fresh(), { phase: 'intro', px: -46 }); sfx.blip() }
    const press = () => {
      if (s.phase === 'ready') { startIntro(); unlock('gamer'); return }
      if (s.phase === 'over') { if (performance.now() - s.overAt >= 450) startIntro(); return }
      if (s.phase === 'intro') return
      if (s.ground) { s.vy = -11; s.ground = false; sfx.jump() }
    }
    const release = () => { if (s.vy < -4) s.vy = -4 }

    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); if (!e.repeat) press() }
    }
    const keyUp = (e: KeyboardEvent) => { if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) release() }
    window.addEventListener('keydown', key); window.addEventListener('keyup', keyUp)
    c.addEventListener('pointerdown', press); c.addEventListener('pointerup', release)

    const spawn = () => {
      const x = W + 40, r = Math.random()
      if (r < 0.3) {
        const h = Math.random() < 0.5 ? 34 : 48
        s.obs.push({ k: 'pipe', x, y: G - h, w: 38, h })
        if (Math.random() < 0.7) for (let i = 0; i < 3; i++) s.obs.push({ k: 'coin', x: x - 24 + i * 30, y: G - h - 62 - (i === 1 ? 18 : 0), w: 16, h: 16 })
        s.gap = rnd(300, 480)
      } else if (r < 0.52) {
        s.obs.push({ k: 'goomba', x, y: G - 24, w: 28, h: 24, vx: 1.1 }); s.gap = rnd(280, 440)
      } else if (r < 0.78) {
        for (let i = 0; i < 5; i++) s.obs.push({ k: 'coin', x: x + i * 34, y: G - 58 - Math.sin((i / 4) * Math.PI) * 72, w: 16, h: 16 })
        s.gap = rnd(330, 460)
      } else {
        s.obs.push({ k: 'block', x, y: G - 112, w: 34, h: 32 }); s.gap = rnd(260, 380)
      }
    }

    const rect = (x: number, y: number, w: number, h: number, col: string) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
    const hill = (cx: number, w: number, h: number, col: string) => {
      const rows = Math.floor(h / 6)
      for (let i = 0; i < rows; i++) { const ww = w * (1 - i / rows); rect(cx - ww / 2, G - 6 * (i + 1), ww, 6, col) }
    }
    const text = (t: string, x: number, y: number, col = '#fff', align: CanvasTextAlign = 'left', size = 10) => {
      g.font = `${size}px 'Press Start 2P', monospace`; g.textAlign = align
      g.fillStyle = '#000'; g.fillText(t, x + 2, y + 2); g.fillStyle = col; g.fillText(t, x, y)
    }

    const draw = () => {
      const d = s.dist
      const sky = g.createLinearGradient(0, 0, 0, G); sky.addColorStop(0, '#12061f'); sky.addColorStop(1, '#6d28d9')
      g.fillStyle = sky; g.fillRect(0, 0, W, H)
      for (let i = 0; i < 22; i++) rect(((i * 97 - d * 0.05) % W + W) % W, (i * 53) % 110, 2, 2, i % 3 ? '#e9d5ff' : '#facc15')
      const off = (k: number, sp: number, span: number) => ((k - d * sp) % span + span) % span - 100
      hill(off(100, 0.18, 760), 260, 90, '#3b0f6b'); hill(off(500, 0.18, 760), 200, 70, '#3b0f6b')
      hill(off(300, 0.3, 700), 160, 60, '#4c1d95'); hill(off(620, 0.3, 700), 220, 78, '#4c1d95')
      for (let i = 0; i < 3; i++) { const cx = off(i * 260 + 60, 0.12, 800), cy = 34 + i * 22; rect(cx, cy, 70, 12, '#c4b5fd'); rect(cx + 12, cy - 8, 40, 8, '#c4b5fd') }
      rect(0, G, W, H - G, '#2a1050'); rect(0, G, W, 6, '#a855f7')
      const bo = (d % 32)
      for (let x = -bo; x < W; x += 32) { rect(x, G + 6, 2, 20, '#1a0b2e'); rect(x + 16, G + 26, 2, 20, '#1a0b2e') }
      rect(0, G + 26, W, 2, '#1a0b2e')

      for (const o of s.obs) {
        if (o.dead) continue
        if (o.k === 'pipe') { rect(o.x, o.y, o.w, o.h, '#22c55e'); rect(o.x - 4, o.y, o.w + 8, 14, '#4ade80'); rect(o.x + 6, o.y + 14, 5, o.h - 14, '#86efac'); rect(o.x + o.w - 8, o.y + 14, 8, o.h - 14, '#166534'); rect(o.x + o.w + 2, o.y, 2, 14, '#166534') }
        else if (o.k === 'goomba') { const f = Math.floor(s.t / 8) % 2; rect(o.x, o.y, o.w, 16, '#a16207'); rect(o.x + 4, o.y - 4, o.w - 8, 4, '#a16207'); rect(o.x + 6, o.y + 5, 6, 6, '#fff'); rect(o.x + 16, o.y + 5, 6, 6, '#fff'); rect(o.x + 8, o.y + 7, 3, 4, '#000'); rect(o.x + 18, o.y + 7, 3, 4, '#000'); rect(o.x + (f ? 0 : 4), o.y + 16, 12, 8, '#451a03'); rect(o.x + (f ? 16 : 12), o.y + 16, 12, 8, '#451a03') }
        else if (o.k === 'block') { rect(o.x, o.y, o.w, o.h, o.used ? '#78350f' : '#facc15'); rect(o.x, o.y, o.w, 3, o.used ? '#92400e' : '#fde68a'); rect(o.x, o.y + o.h - 3, o.w, 3, '#b45309'); if (!o.used) text('?', o.x + o.w / 2, o.y + 24, '#7c2d12', 'center', 14) }
        else { const w = 4 + Math.abs(Math.sin((s.t + o.x) / 9)) * 10; rect(o.x + 8 - w / 2, o.y, w, 16, '#000'); rect(o.x + 8 - w / 2 + 1, o.y + 1, Math.max(1, w - 2), 14, '#facc15') }
      }

      // mascot
      const run = (s.phase === 'play' && s.ground) || s.phase === 'intro', step = Math.floor(s.t / 6) % 2
      const bob = s.phase === 'ready' ? Math.sin(performance.now() / 180) * 2 : 0
      const sq = s.phase === 'over' ? 0.6 : 1
      BODY.forEach((row, ry) => {
        let r = row
        if (ry === 10) r = run ? (step ? '██.██.██.██.' : '.██.██.██.██') : '.██.██.██.██'
        ;[...r].forEach((ch, rx) => { if (ch === '█') rect(s.px + rx * 3, s.y + bob + (ry * 3) * sq + (PH - PH * sq), 3.1, 3.1 * sq + (sq < 1 ? 0.5 : 0), ry < 3 ? '#c084fc' : '#a855f7') })
      })
      if (s.phase !== 'over') { rect(s.px + 9, s.y + bob + 10, 6, 7, '#fff'); rect(s.px + 21, s.y + bob + 10, 6, 7, '#fff'); rect(s.px + 12, s.y + bob + 12, 3, 4, '#1a0b2e'); rect(s.px + 24, s.y + bob + 12, 3, 4, '#1a0b2e') }
      else { text('x', s.px + 12, s.y + 34, '#1a0b2e', 'center', 10); text('x', s.px + 24, s.y + 34, '#1a0b2e', 'center', 10) }

      for (const p of s.pops) { g.globalAlpha = 1 - p.t / 40; text('+1', p.x, p.y - p.t, '#facc15', 'center', 9); g.globalAlpha = 1 }

      text(`● ×${s.coins}`, 14, 24, '#facc15')
      text(`${String(Math.floor(d / 10)).padStart(4, '0')}m`, W - 14, 24, '#fff', 'right')
      text(`BEST ${best}`, W / 2, 24, '#c084fc', 'center', 8)
      if (s.phase === 'intro') {
        const go = s.introT > 1100
        const k = go ? Math.min(1, (s.introT - 1100) / 120) : 1
        text(go ? 'GO!' : 'READY?', W / 2, 108, go ? '#4ade80' : '#fff', 'center', Math.round(16 + (go ? 14 * k : 0)))
      } else if (s.phase === 'ready') {
        text('PRESS SPACE / TAP', W / 2, 100, '#fff', 'center', 14)
        if (Math.floor(performance.now() / 500) % 2) text('TO START', W / 2, 126, '#facc15', 'center', 12)
      } else if (s.phase === 'over') {
        rect(W / 2 - 170, 62, 340, 100, '#000a')
        text('GAME OVER', W / 2, 96, '#f87171', 'center', 18)
        text(`+${s.coins} COINS`, W / 2, 126, '#facc15', 'center', 12)
        text('SPACE = RETRY', W / 2, 150, '#fff', 'center', 9)
      }
    }

    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.667); last = now
      if (s.phase === 'play') {
        s.speed = Math.min(7.5, 2.8 + s.dist / 1800)
        const dx = s.speed * dt
        s.dist += dx; s.t += dt
        s.vy += 0.55 * dt; s.y += s.vy * dt
        if (s.y >= G - PH) { s.y = G - PH; s.vy = 0; s.ground = true }
        if (s.phase === 'play') {
          s.gap -= dx; if (s.gap <= 0) spawn()
          for (const o of s.obs) o.x -= dx + (o.vx || 0) * dt
          s.obs = s.obs.filter(o => o.x > -80 && !o.dead)
          const px = s.px + 6, py = s.y + 4, pw = PW - 12, ph = PH - 4
          for (const o of s.obs) {
            if (!(px < o.x + o.w && px + pw > o.x && py < o.y + o.h && py + ph > o.y)) continue
            if (o.k === 'coin') { o.dead = true; s.coins++; pop(o.x + 8, o.y); sfx.coin() }
            else if (o.k === 'block') { if (!o.used && s.vy < 0 && py > o.y + o.h - 16) { o.used = true; s.vy = 1.5; s.coins++; pop(o.x + 17, o.y); sfx.bump(); sfx.coin() } }
            else if (o.k === 'goomba') {
              if (s.vy > 0 && py + ph - s.vy * dt <= o.y + 10) { o.dead = true; s.vy = -7; s.ground = false; s.coins++; pop(o.x + 14, o.y); sfx.stomp() } else die()
            } else die()
          }
        }
      } else if (s.phase === 'intro') {
        // world eases into motion while the slime walks in from the left
        s.introT += dt * 16.667
        const k = Math.min(1, s.introT / 1000), e = 1 - Math.pow(1 - k, 3)
        s.px = -46 + (PX + 46) * e
        s.dist += (0.6 + 2.2 * e) * dt; s.t += dt * (0.4 + 0.8 * e)
        if (!s.goSound && s.introT > 1100) { s.goSound = true; sfx.coin() }
        if (s.introT > 1500) { s.phase = 'play'; s.px = PX }
      } else if (s.phase === 'ready') s.t += dt * 0.5
      s.pops.forEach(p => (p.t += dt)); s.pops = s.pops.filter(p => p.t < 40)
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', key); window.removeEventListener('keyup', keyUp)
      c.removeEventListener('pointerdown', press); c.removeEventListener('pointerup', release)
      credit() // bank coins even if the player quits mid-run
    }
  }, [addCoins, unlock, onClose])

  return <canvas ref={cv} width={W} height={H} className="game-canvas" aria-label="Runner game: press space to jump" />
}

export default function Game() {
  const { gameOpen, closeGame } = useGame()
  useEffect(() => {
    document.body.style.overflow = gameOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [gameOpen])
  return (
    <AnimatePresence>
      {gameOpen && (
        <motion.div className="modal" role="dialog" aria-modal="true" aria-label="Mini game"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeGame}>
          <motion.div className="modal-box" onClick={e => e.stopPropagation()}
            initial={{ scale: 0.4, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
            <CRT title="SLIME-RUN.EXE"><Stage onClose={closeGame} /></CRT>
            <p className="hint">SPACE / TAP JUMP · STOMP ENEMIES · BUMP ? BLOCKS · ESC EXIT</p>
            <button className="pbtn tiny modal-x" onClick={closeGame} aria-label="Close game">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
