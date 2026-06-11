// First-run onboarding hook. Shows ONLY on a player's first visit, then never again.
// People arrive cold from a Substack link, so this makes the point in three short
// panels and points them at a strong first mode. Persisted under aitrainer:onboarded.
// Accessible: role="dialog", aria-modal, focus-trapped, Escape to dismiss, visible
// focus, reduced-motion safe (animations are gated by CSS in index.css).

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadJSON, saveJSON } from '../engine';
import NeonButton from './ui/NeonButton';

const ONBOARDED_KEY = 'onboarded';

// Three short panels. A stepper, not a wall of text.
const PANELS: { eyebrow: string; title: string; body: string }[] = [
  {
    eyebrow: 'Why this exists',
    title: 'AI training, but a game.',
    body: 'Everything out there for getting good at AI is documentation. This is a game instead. You learn prompting by playing, not by reading the manual.',
  },
  {
    eyebrow: 'The four modes',
    title: 'Four quick ways to level up.',
    body: 'Glow-Up rewrites a weak prompt into a strong one. Mind Reader makes you spell out what you actually want. Deck Mode drills patterns fast. Idea Forge turns a spark into a real plan.',
  },
  {
    eyebrow: 'Ready',
    title: 'Pick a lane and go.',
    body: 'Start with Glow-Up for the fastest aha moment, or just poke around the grid. You can always come back to any mode.',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const titleId = useId();
  const bodyId = useId();

  // First-visit detection: open only when the flag has never been set.
  const [open, setOpen] = useState<boolean>(() => loadJSON<boolean>(ONBOARDED_KEY, false) !== true);
  const [step, setStep] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    saveJSON(ONBOARDED_KEY, true);
    setOpen(false);
  }, []);

  const startGlowUp = useCallback(() => {
    dismiss();
    navigate('/glow-up');
  }, [dismiss, navigate]);

  // Move focus to the primary action on open / step change, and restore it on close.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstButton = dialogRef.current?.querySelector<HTMLButtonElement>('button');
    firstButton?.focus();
    return () => previouslyFocused?.focus?.();
  }, [open, step]);

  // Escape to dismiss + a simple focus trap kept inside the dialog.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dismiss]);

  if (!open) return null;

  const panel = PANELS[step];
  const isLast = step === PANELS.length - 1;

  return (
    <div
      className="scrim fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // Backdrop click dismisses, but only when the backdrop itself is the target.
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="panel anim-rise w-full max-w-md p-6 sm:p-7"
      >
        {/* Step dots */}
        <div className="mb-4 flex items-center gap-2" aria-hidden="true">
          {PANELS.map((_, i) => (
            <span
              key={i}
              className={[
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-6 bg-cyan' : 'w-2 bg-edge',
              ].join(' ')}
            />
          ))}
        </div>

        <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ink-faint">
          {panel.eyebrow}
        </p>
        <h2 id={titleId} className="text-cyan text-glow font-display text-2xl leading-snug">
          {panel.title}
        </h2>
        <p id={bodyId} className="mt-3 text-sm leading-relaxed text-ink-soft">
          {panel.body}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!isLast ? (
            <>
              <NeonButton variant="cyan" onClick={() => setStep((s) => s + 1)}>
                Next
              </NeonButton>
              <button
                type="button"
                onClick={dismiss}
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
              >
                Skip
              </button>
            </>
          ) : (
            <>
              <NeonButton variant="cyan" onClick={startGlowUp}>
                Start with Glow-Up
              </NeonButton>
              <button
                type="button"
                onClick={dismiss}
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
              >
                Just let me explore
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
