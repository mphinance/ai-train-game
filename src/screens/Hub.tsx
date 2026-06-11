// The Hub: a grid map. Each mode is a node that navigates on
// click or Enter. Landing route. All modes unlocked in v1.

import { useNavigate } from 'react-router-dom';
import type { FrameAccent } from '../components/ui/ScreenFrame';

interface ModeNode {
  to: string;
  icon: string;
  title: string;
  teaser: string;
  accent: FrameAccent;
}

const NODES: ModeNode[] = [
  {
    to: '/glow-up',
    icon: '✨',
    title: 'Glow-Up',
    teaser: 'Turn a lazy prompt into a sharp one and watch the AI level up.',
    accent: 'cyan',
  },
  {
    to: '/mind-reader',
    icon: '🎯',
    title: 'Mind Reader',
    teaser: 'Say exactly what you mean. The AI takes you literally.',
    accent: 'orange',
  },
  {
    to: '/deck',
    icon: '🃏',
    title: 'Did-You-Know Deck',
    teaser: 'Flip cards for AI tricks you never thought to try.',
    accent: 'lime',
  },
  {
    to: '/idea-forge',
    icon: '💡',
    title: 'Idea Forge',
    teaser: 'Get AI ideas built around what you actually care about.',
    accent: 'violet',
  },
  {
    to: '/badges',
    icon: '🏅',
    title: 'Badges',
    teaser: 'Track your XP, streak, and everything you have unlocked.',
    accent: 'cyan',
  },
];

const ACCENT_TEXT: Record<FrameAccent, string> = {
  cyan: 'text-cyan',
  orange: 'text-orange',
  violet: 'text-violet',
  lime: 'text-lime',
};

export default function Hub() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 anim-rise sm:px-6">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-ink-soft">
          Jack in. Pick your grid.
        </p>
        <h1 className="text-cyan text-glow mt-2 text-4xl sm:text-5xl">THE&nbsp;GRID</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Every node is a way to get better at talking to AI. Start anywhere.
          Glow-Up is a great first stop.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NODES.map((node) => (
          <li key={node.to}>
            <button
              type="button"
              onClick={() => navigate(node.to)}
              className={[
                ACCENT_TEXT[node.accent],
                'panel neon-box trail group h-full w-full text-left',
                'flex flex-col gap-2 rounded-xl p-5',
                'transition-transform duration-150 hover:scale-[1.02]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
              ].join(' ')}
              aria-label={`${node.title}. ${node.teaser}`}
            >
              <span
                className="text-3xl transition-transform duration-150 group-hover:scale-110"
                aria-hidden="true"
              >
                {node.icon}
              </span>
              <h2 className="text-glow-soft text-xl">{node.title}</h2>
              <p className="text-sm text-ink-soft">{node.teaser}</p>
              <span className="mt-auto pt-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint group-hover:text-glow-soft">
                Enter &rarr;
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
