import { GameProvider } from './game'
import Hud from './components/Hud'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Work from './components/Work'
import Arcade from './components/Arcade'
import Contact from './components/Contact'
import Mascot from './components/Mascot'
import Game from './components/Game'

export default function App() {
  return (
    <GameProvider>
      <Hud />
      <main><Hero /><Marquee /><Work /><Arcade /><Contact /></main>
      <footer className="foot">© 2026 JAISHREE DAMODHARAN<br />THANKS FOR PLAYING · PRESS <b>G</b> TO PLAY AGAIN</footer>
      <Mascot />
      <Game />
    </GameProvider>
  )
}
