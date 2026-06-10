// App shell: HashRouter + a persistent layout that keeps the HUD visible across
// every route. Hash routing avoids 404s on refresh under a static subpath.

import { HashRouter, Routes, Route } from 'react-router-dom';
import Hud from './components/hud/Hud';
import Hub from './screens/Hub';
import GlowUp from './screens/GlowUp';
import MindReader from './screens/MindReader';
import DeckMode from './screens/DeckMode';
import Badges from './screens/Badges';
import IdeaForge from './screens/IdeaForge';

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <Hud />
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/glow-up" element={<GlowUp />} />
            <Route path="/mind-reader" element={<MindReader />} />
            <Route path="/deck" element={<DeckMode />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/idea-forge" element={<IdeaForge />} />
            <Route path="*" element={<Hub />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
