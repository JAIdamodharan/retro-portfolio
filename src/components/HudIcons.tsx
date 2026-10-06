// Pixel-art coin and star for the HUD.
const COIN = ['..DDDDD..', '.DYYYYYD.', 'DYYLLYYYD', 'DYLLYYYYD', 'DYLYYYYYD', 'DYYYYYYYD', 'DYYYYYYDD', '.DYYYYDD.', '..DDDDD..']
const STAR = ['....X....', '....X....', '...XXX...', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '..XXXXX..', '.XXX.XXX.', '.XX...XX.']
const fill: Record<string, string> = { Y: '#facc15', D: '#b45309', L: '#fff7c2', X: '#facc15' }

function Pixels({ map, size }: { map: string[]; size: number }) {
  return (
    <svg viewBox="0 0 9 9" width={size} height={size} shapeRendering="crispEdges" aria-hidden className="hud-ico">
      {map.flatMap((row, y) => [...row].map((c, x) => fill[c] && <rect key={`${x}${y}`} x={x} y={y} width="1.05" height="1.05" fill={fill[c]} />))}
    </svg>
  )
}
export const CoinIcon = ({ size = 26 }: { size?: number }) => <Pixels map={COIN} size={size} />
export const StarIcon = ({ size = 26 }: { size?: number }) => <Pixels map={STAR} size={size} />
