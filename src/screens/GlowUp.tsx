// Glow-Up: the full vertical slice. Load a level, add prompt ingredients,
// watch the live prompt rebuild, the score animate, the signal chips light up,
// and the simulated AI output improve. Cross the win score to claim XP.
// All interactions are keyboard-operable. Motion is gated by the CSS, not forced.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenFrame from '../components/ui/ScreenFrame';
import NeonButton from '../components/ui/NeonButton';
import { GLOWUP_LEVELS } from '../data/glowup';
import {
  scorePrompt,
  addXp,
  recordPlay,
  recordInterest,
  unlockBadge,
  getProgress,
  type GlowUpLevel,
  type Tier,
} from '../engine';

const TIER_TEXT: Record<Tier, string> = {
  weak: 'text-rose',
  okay: 'text-orange',
  strong: 'text-cyan',
  elite: 'text-lime',
};

const TIER_LABEL: Record<Tier, string> = {
  weak: 'Weak',
  okay: 'Okay',
  strong: 'Strong',
  elite: 'Elite',
};

// Smoothly counts the displayed score up or down toward the target.
function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const from = value;
    const dur = 380;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

function buildPrompt(level: GlowUpLevel, addedKeys: string[]): string {
  const ordered = level.ingredients.filter((ing) => addedKeys.includes(ing.key));
  if (ordered.length === 0) return level.lazyPrompt;
  return [level.lazyPrompt, ...ordered.map((ing) => ing.text)].join(' ');
}

function buildOutput(level: GlowUpLevel, addedKeys: string[]): string {
  const ordered = level.ingredients.filter((ing) => addedKeys.includes(ing.key));
  if (ordered.length === 0) return level.weakOutput;
  return ordered.map((ing) => ing.improvedOutput).join(' ');
}

export default function GlowUp() {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [added, setAdded] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const winLockRef = useRef(false);

  const level = GLOWUP_LEVELS[levelIndex];
  const requireKeys = useMemo(
    () => level.ingredients.map((i) => i.key),
    [level],
  );

  const livePrompt = useMemo(
    () => buildPrompt(level, added),
    [level, added],
  );
  const liveOutput = useMemo(
    () => buildOutput(level, added),
    [level, added],
  );

  const rubric = useMemo(
    () => scorePrompt(livePrompt, { require: requireKeys }),
    [livePrompt, requireKeys],
  );

  const shownScore = useAnimatedNumber(rubric.score);

  // Only the signals this level grades on, in rubric order.
  const shownSignals = useMemo(
    () => rubric.signals.filter((s) => requireKeys.includes(s.key as never)),
    [rubric.signals, requireKeys],
  );

  // The single signal worth explaining inline: the heaviest still-missing one,
  // or once everything is lit, the heaviest present one (so the line never empties).
  const focusSignal = useMemo(() => {
    const missing = shownSignals.filter((s) => !s.present);
    const pool = missing.length > 0 ? missing : shownSignals;
    if (pool.length === 0) return null;
    return pool.reduce((a, b) => (b.weight > a.weight ? b : a));
  }, [shownSignals]);

  // Fire the win exactly once per level, when the score crosses the threshold.
  useEffect(() => {
    if (rubric.score >= level.winScore && !winLockRef.current) {
      winLockRef.current = true;
      setWon(true);

      const firstWinEver = getProgress().badges.length === 0;
      addXp(40);
      recordPlay('glowup', level.id);
      recordInterest(level.tags);
      if (firstWinEver) unlockBadge('first-win');
      if (rubric.tier === 'elite') unlockBadge('elite-prompt');
      if (getProgress().level >= 5) unlockBadge('level-5');
    }
  }, [rubric.score, rubric.tier, level]);

  function reset() {
    winLockRef.current = false;
    setWon(false);
    setAdded([]);
  }

  function toggle(key: string) {
    setAdded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function goToLevel(index: number) {
    setLevelIndex(index);
    reset();
  }

  const hasNext = levelIndex < GLOWUP_LEVELS.length - 1;

  return (
    <ScreenFrame
      title="Glow-Up"
      subtitle="Drop in the missing pieces and watch a sad prompt glow up. Cross the win line to bank XP."
      accent="cyan"
    >
      {/* Level switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
          Level
        </span>
        {GLOWUP_LEVELS.map((lvl, i) => (
          <button
            key={lvl.id}
            type="button"
            onClick={() => goToLevel(i)}
            aria-pressed={i === levelIndex}
            className={[
              'rounded-md border px-3 py-1 font-mono text-xs transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan',
              i === levelIndex
                ? 'text-cyan neon-box text-glow-soft'
                : 'border-edge text-ink-soft hover:text-cyan',
            ].join(' ')}
          >
            {i + 1}. {lvl.topic}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* LEFT: prompt console + score + ingredients */}
        <div className="flex flex-col gap-5">
          {/* Prompt console */}
          <div className="panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                Your prompt
              </span>
              <ScorePill score={shownScore} tier={rubric.tier} />
            </div>
            <p className="font-mono text-sm leading-relaxed text-ink">
              {livePrompt}
            </p>
          </div>

          {/* Signal chips. Each carries its evidence as a title tooltip and an
              accessible label, so the player can see WHY a signal lit or what to add. */}
          <div className="flex flex-wrap gap-2" aria-label="Prompt signals">
            {shownSignals.map((sig) => (
              <span
                key={sig.key}
                title={sig.evidence}
                aria-label={`${sig.label}: ${sig.present ? 'lit' : 'missing'}. ${sig.evidence ?? ''}`}
                className={[
                  'rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider transition-colors',
                  sig.present
                    ? 'text-lime neon-box text-glow-soft'
                    : 'border-edge text-ink-faint',
                ].join(' ')}
              >
                {sig.present ? '● ' : '○ '}
                {sig.label}
              </span>
            ))}
          </div>

          {/* Why line: visible, on-theme evidence for the single most relevant
              signal (the top missing one, or the heaviest lit one once clean).
              Keeps the rubric transparent without cluttering the chip row. */}
          {focusSignal ? (
            <p className="font-mono text-xs text-ink-faint">
              <span className={focusSignal.present ? 'text-lime' : 'text-orange'}>
                {focusSignal.present ? '● ' : '○ '}
                {focusSignal.label}:
              </span>{' '}
              {focusSignal.evidence}
            </p>
          ) : null}

          {/* Hint from topFix */}
          {!won && rubric.topFix ? (
            <p className="text-sm text-ink-soft">
              <span className="text-orange text-glow-soft">Hint:</span> {rubric.topFix}
            </p>
          ) : null}

          {/* Ingredient chips, click or keyboard to add/remove */}
          <div>
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
              Ingredients (click to add or remove)
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {level.ingredients.map((ing) => {
                const isOn = added.includes(ing.key);
                return (
                  <li key={ing.key}>
                    <button
                      type="button"
                      onClick={() => toggle(ing.key)}
                      aria-pressed={isOn}
                      className={[
                        'w-full rounded-lg border p-3 text-left transition-transform duration-150',
                        'hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan',
                        isOn
                          ? 'text-cyan neon-box'
                          : 'border-edge text-ink-soft hover:text-cyan',
                      ].join(' ')}
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-display text-sm uppercase tracking-wider text-glow-soft">
                          {ing.label}
                        </span>
                        <span className="font-mono text-xs" aria-hidden="true">
                          {isOn ? '✓ added' : '+ add'}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-ink-soft">{ing.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* RIGHT: simulated AI output + win state */}
        <div className="flex flex-col gap-5">
          <div
            className={[
              'panel flex min-h-[12rem] flex-col p-4',
              won ? 'text-lime neon-box anim-pulse' : '',
            ].join(' ')}
          >
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden="true">🤖</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                AI output {added.length === 0 ? '(before)' : '(reacting live)'}
              </span>
            </div>
            <p
              aria-live="polite"
              className={`text-sm leading-relaxed ${
                added.length === 0 ? 'text-ink-faint italic' : 'text-ink'
              }`}
            >
              {liveOutput}
            </p>
          </div>

          {won ? (
            <div className="panel neon-box text-lime anim-rise p-5 text-center">
              <p className="text-glow text-2xl">Nailed it.</p>
              <p className="mt-2 text-sm text-ink-soft">
                The AI actually knew what you wanted that time. You banked 40 XP.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {hasNext ? (
                  <NeonButton variant="cyan" onClick={() => goToLevel(levelIndex + 1)}>
                    Next level
                  </NeonButton>
                ) : null}
                <NeonButton variant="orange" onClick={reset}>
                  Replay
                </NeonButton>
                <NeonButton variant="violet" onClick={() => navigate('/')}>
                  Back to grid
                </NeonButton>
              </div>
            </div>
          ) : (
            <div className="panel p-4">
              <p className="text-sm text-ink-soft">
                Get the score to{' '}
                <span className="text-cyan text-glow-soft">{level.winScore}</span> to win.
                Each ingredient teaches the AI something the lazy version left out.
              </p>
            </div>
          )}
        </div>
      </div>
    </ScreenFrame>
  );
}

function ScorePill({ score, tier }: { score: number; tier: Tier }) {
  return (
    <span
      className={`${TIER_TEXT[tier]} neon-box text-glow-soft rounded-md px-2.5 py-1 font-mono text-sm`}
      aria-label={`Score ${score} out of 100, ${TIER_LABEL[tier]}`}
    >
      {score}
      <span className="text-ink-faint">/100</span>{' '}
      <span className="text-[0.65rem] uppercase">{TIER_LABEL[tier]}</span>
    </span>
  );
}
