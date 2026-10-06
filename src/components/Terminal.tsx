import { useEffect, useState } from 'react'

// Types lines out one character at a time, like a boot log.
export default function Terminal({ lines }: { lines: string[] }) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const [pos, setPos] = useState({ l: reduced ? lines.length : 0, n: 0 })
  useEffect(() => {
    if (pos.l >= lines.length) return
    const t = setTimeout(() => {
      const done = pos.n >= lines[pos.l].length
      setPos(done ? { l: pos.l + 1, n: 0 } : { l: pos.l, n: pos.n + 1 })
    }, pos.n >= lines[pos.l].length ? 260 : 18)
    return () => clearTimeout(t)
  }, [pos, lines])
  const shown = lines.slice(0, pos.l).concat(pos.l < lines.length ? [lines[pos.l].slice(0, pos.n)] : [])
  return (
    <pre className="term" aria-label={lines.join('. ')}>
      {shown.map((ln, i) => <div key={i} aria-hidden><b>{ln.slice(0, 1)}</b>{ln.slice(1)}</div>)}
      <span className="caret sm" aria-hidden />
    </pre>
  )
}
