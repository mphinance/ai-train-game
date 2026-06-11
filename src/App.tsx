// App shell: HashRouter + a persistent layout that keeps the HUD visible across
// every route. Hash routing avoids 404s on refresh under a static subpath.

import { HashRouter, Routes, Route } from 'react-router-dom';
import Hud from './components/hud/Hud';
import Onboarding from './components/Onboarding';
import PageTransition from './components/fx/PageTransition';
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
        <main className="flex-1">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Hub />} />
              <Route path="/glow-up" element={<GlowUp />} />
              <Route path="/mind-reader" element={<MindReader />} />
              <Route path="/deck" element={<DeckMode />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/idea-forge" element={<IdeaForge />} />
              <Route path="*" element={<Hub />} />
            </Routes>
          </PageTransition>
        </main>
        <footer className="px-4 py-6 text-center">
          <p className="font-mono text-xs text-ink-faint">
            Built by{' '}
            <a
              href="https://mphinance.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft underline-offset-2 transition-colors hover:text-cyan hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
            >
              Michael Hanko
            </a>
          </p>
        </footer>
        {/* First-run onboarding overlay. Self-gates to first visit and dismisses cleanly. */}
        <Onboarding />
      </div>
    </HashRouter>
  );
}
