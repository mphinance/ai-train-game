// Badges and progression (feature id 32). Reads the live progress hook and
// renders level, an XP readout toward the next level, the day streak, and the
// full BADGES catalog as a grid. Unlocked badges glow. Locked ones dim and
// show their desc as "how to earn it." A clear CTA into the Idea Forge.
// Keyboard operable, visible focus, reduced motion honored by the CSS.

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenFrame from '../components/ui/ScreenFrame';
import NeonButton from '../components/ui/NeonButton';
import { useProgress, BADGES, levelForXp, xpForLevel } from '../engine';

export default function Badges() {
  const navigate = useNavigate();
  const progress = useProgress();

  const unlocked = useMemo(
    () => new Set(progress.badges),
    [progress.badges],
  );

  // XP readout toward the next level. Clamp the bar to 0..100.
  const level = levelForXp(progress.xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = Math.max(1, ceil - floor);
  const into = Math.max(0, progress.xp - floor);
  const toNext = Math.max(0, ceil - progress.xp);
  const pct = Math.max(0, Math.min(100, Math.round((into / span) * 100)));

  const unlockedCount = progress.badges.filter((id) =>
    BADGES.some((b) => b.id === id),
  ).length;

  return (
    <ScreenFrame
      title="Badges"
      subtitle="Your trophy case. Track your level, your streak, and every badge you have earned, plus exactly how to claim the ones you have not."
      accent="violet"
    >
      {/* Stat row: level, XP progress, streak */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            Level
          </p>
          <p className="text-cyan text-glow mt-1 font-display text-4xl">{level}</p>
        </div>

        <div className="panel p-4 sm:col-span-1">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
              XP to level {level + 1}
            </p>
            <p className="font-mono text-xs text-ink-soft">
              <span className="text-violet text-glow-soft">{into}</span>
              <span className="text-ink-faint"> / {span}</span>
            </p>
          </div>
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full border border-edge bg-abyss/60"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`Level ${level} progress, ${pct} percent to level ${level + 1}`}
          >
            <div
              className="h-full rounded-full bg-violet text-glow-soft transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[0.65rem] text-ink-faint">
            {toNext} XP to go. Total banked: {progress.xp}.
          </p>
        </div>

        <div className="panel p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            Day streak
          </p>
          <p className="text-orange text-glow mt-1 font-display text-4xl">
            <span aria-hidden="true">🔥</span> {progress.streak}
          </p>
        </div>
      </div>

      {/* Catalog header */}
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-violet text-glow-soft font-display text-xl uppercase tracking-wider">
          Badge Grid
        </h2>
        <p className="font-mono text-xs text-ink-soft" aria-live="polite">
          <span className="text-lime text-glow-soft">{unlockedCount}</span>
          <span className="text-ink-faint"> / {BADGES.length} unlocked</span>
        </p>
      </div>

      {/* Badge grid */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge) => {
          const isOn = unlocked.has(badge.id);
          return (
            <li
              key={badge.id}
              className={[
                'panel p-4 transition-colors',
                isOn ? 'text-lime neon-box anim-pulse' : 'opacity-60',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-3xl ${isOn ? 'text-glow' : 'grayscale'}`}
                  aria-hidden="true"
                >
                  {badge.icon}
                </span>
                <div className="min-w-0">
                  <p
                    className={[
                      'font-display text-sm uppercase tracking-wider',
                      isOn ? 'text-lime text-glow-soft' : 'text-ink-soft',
                    ].join(' ')}
                  >
                    {badge.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {badge.desc}
                  </p>
                  <p
                    className={[
                      'mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em]',
                      isOn ? 'text-lime' : 'text-ink-faint',
                    ].join(' ')}
                  >
                    {isOn ? 'Unlocked' : 'How to earn it'}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* CTA into the Idea Forge */}
      <div className="panel neon-box text-violet anim-rise mt-8 flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-glow font-display text-lg uppercase tracking-wider">
          Ready for the payoff?
        </p>
        <p className="max-w-md text-sm text-ink-soft">
          The Idea Forge reads what you have been into and hands you AI ideas built
          around you. The more you play, the sharper it gets.
        </p>
        <NeonButton variant="violet" onClick={() => navigate('/idea-forge')}>
          Open the Idea Forge
        </NeonButton>
      </div>
    </ScreenFrame>
  );
}
