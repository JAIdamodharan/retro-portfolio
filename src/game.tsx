import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { setMuted, sfx } from './sfx'

export const ACHIEVEMENTS: Record<string, { title: string; icon: string }> = {
  start: { title: 'PLAYER 1 READY', icon: '▶' },
  explorer: { title: 'EXPLORER', icon: '★' },
  coins: { title: 'COIN HUNTER', icon: '●' },
  poke: { title: 'BEST FRIENDS', icon: '♥' },
  cheat: { title: 'CHEAT CODE', icon: '⌘' },
  hello: { title: 'SAID HI', icon: '✉' },
  gamer: { title: 'GAME ON', icon: '♦' },
  runner: { title: 'COIN RUNNER', icon: '$' },
  connect: { title: 'CONNECTED', icon: '☎' },
}

type Toast = { id: number; key: string }
type Ctx = {
  xp: number; level: number; coins: number; sound: boolean; toasts: Toast[]; unlocked: string[]
  addXp: (n: number) => void
  collectCoin: () => void
  unlock: (k: string) => void
  toggleSound: () => void
  say: (msg: string, ms?: number) => void
  nudge: boolean
  setNudge: (b: boolean) => void
  speech: string | null
  rain: number
  addCoins: (n: number) => void
  gameOpen: boolean
  openGame: () => void
  closeGame: () => void
}
const GameCtx = createContext<Ctx>(null!)
export const useGame = () => useContext(GameCtx)
export const XP_PER_LEVEL = 60

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0)
  const [coins, setCoins] = useState(0)
  const [sound, setSound] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [unlocked, setUnlocked] = useState<string[]>([])
  const [speech, setSpeech] = useState<string | null>(null)
  const [rain, setRain] = useState(0)
  const [gameOpen, setGameOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const seen = useRef(new Set<string>())
  const speechT = useRef<number | undefined>(undefined)
  const level = Math.floor(xp / XP_PER_LEVEL) + 1

  const say = useCallback((msg: string, ms = 2600) => {
    setSpeech(msg)
    clearTimeout(speechT.current)
    speechT.current = window.setTimeout(() => setSpeech(null), ms)
  }, [])

  const addXp = useCallback((n: number) => {
    setXp(x => {
      if (Math.floor((x + n) / XP_PER_LEVEL) > Math.floor(x / XP_PER_LEVEL)) {
        sfx.levelUp(); setRain(r => r + 1)
      }
      return x + n
    })
  }, [])

  const unlock = useCallback((k: string) => {
    if (seen.current.has(k)) return
    seen.current.add(k)
    setUnlocked(u => [...u, k])
    setToasts(t => [...t, { id: Date.now() + Math.random(), key: k }])
    sfx.achieve(); addXp(25)
  }, [addXp])

  const collectCoin = useCallback(() => {
    sfx.coin(); addXp(10)
    setCoins(c => { if (c + 1 >= 5) unlock('coins'); return c + 1 })
  }, [addXp, unlock])

  const addCoins = useCallback((n: number) => {
    if (n <= 0) return
    setCoins(c => { if (c + n >= 5) unlock('coins'); return c + n })
    addXp(n * 4)
  }, [addXp, unlock])
  const openGame = useCallback(() => { sfx.levelUp(); setGameOpen(true) }, [])
  const closeGame = useCallback(() => setGameOpen(false), [])

  const toggleSound = useCallback(() => {
    setSound(s => { setMuted(s); return !s })
  }, [])

  useEffect(() => {
    if (!toasts.length) return
    const t = setTimeout(() => setToasts(a => a.slice(1)), 3200)
    return () => clearTimeout(t)
  }, [toasts])

  // press G anywhere to play
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) openGame() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [openGame])

  // Konami code
  useEffect(() => {
    const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
    let i = 0
    const h = (e: KeyboardEvent) => {
      i = e.key === code[i] ? i + 1 : e.key === code[0] ? 1 : 0
      if (i === code.length) { i = 0; unlock('cheat'); addXp(60); say('+60 XP! Nice!') }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [unlock, addXp, say])

  const value = useMemo(() => ({ xp, level, coins, sound, toasts, unlocked, addXp, collectCoin, unlock, toggleSound, say, speech, rain, addCoins, gameOpen, openGame, closeGame, nudge, setNudge }),
    [xp, level, coins, sound, toasts, unlocked, addXp, collectCoin, unlock, toggleSound, say, speech, rain, addCoins, gameOpen, openGame, closeGame, nudge, setNudge])
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}
