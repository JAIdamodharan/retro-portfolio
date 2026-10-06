let ctx: AudioContext | null = null
export let muted = false
export const setMuted = (m: boolean) => { muted = m }

function tone(freq: number, dur: number, type: OscillatorType = 'square', delay = 0, vol = 0.05) {
  if (muted) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    const t = ctx.currentTime + delay
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t); o.stop(t + dur)
  } catch { /* audio unavailable */ }
}

export const sfx = {
  type: () => { const f = 150 + Math.random() * 40; tone(f, 0.05, 'triangle', 0, 0.07); tone(f * 2.2, 0.02, 'square', 0, 0.015) },
  blip: () => tone(660, 0.06),
  coin: () => { tone(988, 0.07); tone(1319, 0.18, 'square', 0.07) },
  jump: () => { tone(300, 0.08); tone(500, 0.12, 'square', 0.06) },
  levelUp: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', i * 0.09)),
  stomp: () => { tone(220, 0.08, 'square'); tone(440, 0.1, 'square', 0.05) },
  bump: () => tone(160, 0.1, 'triangle', 0, 0.08),
  over: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.16, 'square', i * 0.13)),
  connect: () => { [440, 660, 880].forEach((f, i) => tone(f, 0.1, 'triangle', i * 0.07, 0.07)); tone(1320, 0.4, 'square', 0.25) },
  achieve: () => [784, 988, 1175].forEach((f, i) => tone(f, 0.1, 'triangle', i * 0.08, 0.07)),
}
