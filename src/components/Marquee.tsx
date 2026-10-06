import { profile } from '../content'

// Slow "who am I" ticker. Pauses on hover; shows as a static wrapped list for reduced-motion users.
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="m-row" aria-hidden={hidden || undefined}>
      {profile.ticker.map((t, i) => (
        <li key={t}>{t}<b>★</b></li>
      ))}
    </ul>
  )
  return (
    <div className="marquee" role="region" aria-label={`About: ${profile.ticker.join(', ')}`}>
      <div className="m-track">{row(false)}{row(true)}</div>
    </div>
  )
}
