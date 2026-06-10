// Persistent HUD. Reads useProgress() so it live-updates the moment XP changes.
// Shows level, an animated XP bar toward the next level, and a streak flame.

import { Link } from 'react-router-dom';
import { useProgress, xpForLevel } from '../../engine';

export default function Hud() {
  const { xp, level, streak } = useProgress();

  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = Math.max(1, ceil - floor);
  const into = Math.max(0, Math.min(span, xp - floor));
  const pct = Math.round((into / span) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 sm:gap-5 sm:px-6">
        <Link
          to="/"
          className="font-display text-cyan text-glow-soft text-sm tracking-[0.2em] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
        >
          AI&nbsp;TRAINER
        </Link>

        {/* Level chip */}
        <div className="text-cyan neon-box rounded-md px-2.5 py-1 font-mono text-xs">
          <span className="text-ink-faint">LV</span>{' '}
          <span className="text-glow-soft">{level}</span>
        </div>

        {/* XP bar toward next level */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full border border-edge bg-abyss"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Experience toward level ${level + 1}`}
          >
            <div
              className="h-full rounded-full bg-cyan text-cyan text-glow-soft transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="hidden shrink-0 font-mono text-[0.65rem] text-ink-soft sm:inline">
            {into}/{span} XP
          </span>
        </div>

        {/* Streak flame */}
        <div
          className={`text-orange flex shrink-0 items-center gap-1 font-mono text-xs ${
            streak > 0 ? 'anim-pulse' : 'opacity-50'
          }`}
          aria-label={`Streak: ${streak} day${streak === 1 ? '' : 's'}`}
          title={`${streak} day streak`}
        >
          <span aria-hidden="true">🔥</span>
          <span className="text-glow-soft">{streak}</span>
        </div>
      </div>
    </header>
  );
}
