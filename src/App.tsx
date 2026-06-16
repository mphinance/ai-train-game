// App shell for Practical AI. HashRouter avoids 404s on refresh under a static subpath.
// Wave 1 owns this route table. Wave 2 owns the Nav/shell chrome. Wave 3 agents own the
// individual screens but MUST NOT edit this file.

import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import GuideHome from './screens/GuideHome';
import ChapterReader from './screens/ChapterReader';
import Gym from './screens/Gym';
import Cookbook from './screens/Cookbook';

// Minimal nav, pre-staged by Wave 1. Wave 2 reskins this into the real top bar.
function Nav() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 ${isActive ? 'text-cyan' : 'text-ink-soft'} hover:text-cyan`;
  return (
    <nav className="flex items-center gap-2 border-b border-edge px-4 py-3">
      <NavLink to="/" className="mr-auto font-display text-lg">Practical AI</NavLink>
      <NavLink to="/" end className={cls}>Guide</NavLink>
      <NavLink to="/gym" className={cls}>Gym</NavLink>
      <NavLink to="/cookbook" className={cls}>Cookbook</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<GuideHome />} />
            <Route path="/guide/:slug" element={<ChapterReader />} />
            <Route path="/gym" element={<Gym />} />
            <Route path="/cookbook" element={<Cookbook />} />
            <Route path="*" element={<GuideHome />} />
          </Routes>
        </main>
        <footer className="border-t border-edge px-4 py-6 text-center">
          <p className="font-mono text-xs text-ink-faint">
            Built by{' '}
            <a
              href="https://mphinance.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft underline-offset-2 hover:text-cyan hover:underline"
            >
              Michael Hanko
            </a>
          </p>
        </footer>
      </div>
    </HashRouter>
  );
}
