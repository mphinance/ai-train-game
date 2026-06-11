// Did-You-Know Deck: a grid of flippable cards, each an unexpected AI use.
// Flip a card to reveal the trick, then run its 30s micro-challenge: write a
// prompt, submit, and get instant rubric feedback. Engaging a card feeds the
// silent Taste Engine. Completing one banks XP and marks the card discovered.
// Everything is keyboard-operable and motion is gated by the CSS, not forced.

import { useEffect, useMemo, useRef, useState } from 'react';
import ScreenFrame from '../components/ui/ScreenFrame';
import NeonButton from '../components/ui/NeonButton';
import { DECK_CARDS } from '../data/deck';
import {
  scorePrompt,
  recordInterest,
  recordPlay,
  addXp,
  unlockBadge,
  getProgress,
  useProgress,
  type DeckCard,
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

const CHALLENGE_SECONDS = 30;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

// Smoothly counts a displayed number toward its target. Reduced motion snaps.
function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
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

export default function DeckMode() {
  const progress = useProgress();
  const completed = useMemo(
    () => new Set(progress.completed['deck'] ?? []),
    [progress.completed],
  );
  const discovered = DECK_CARDS.filter((c) => completed.has(c.id)).length;

  // Which card is flipped face-up, and which one has its challenge open.
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  // Remember which cards already fed the Taste Engine on flip, so a flip-flop
  // does not spam the profiler.
  const tastedRef = useRef<Set<string>>(new Set());

  const activeCard = DECK_CARDS.find((c) => c.id === activeId) ?? null;

  function engageCard(card: DeckCard) {
    if (!tastedRef.current.has(card.id)) {
      tastedRef.current.add(card.id);
      recordInterest(card.tags);
    }
  }

  function toggleFlip(card: DeckCard) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) {
        next.delete(card.id);
      } else {
        next.add(card.id);
        engageCard(card);
      }
      return next;
    });
  }

  return (
    <ScreenFrame
      title="Did-You-Know Deck"
      subtitle="Flip a card for an AI trick you never thought to try, then take its 30 second challenge. The deck quietly learns what you love."
      accent="lime"
    >
      {/* Progress meter */}
      <div className="panel mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            Discovered
          </p>
          <p className="text-lime text-glow-soft font-display text-xl">
            {discovered} / {DECK_CARDS.length}
          </p>
        </div>
        <div
          className="h-2 flex-1 basis-40 overflow-hidden rounded-full border border-edge"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={DECK_CARDS.length}
          aria-valuenow={discovered}
          aria-label="Cards discovered"
        >
          <div
            className="h-full bg-lime transition-[width] duration-500"
            style={{ width: `${(discovered / DECK_CARDS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card grid */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DECK_CARDS.map((card) => (
          <li key={card.id}>
            <FlipCard
              card={card}
              isFlipped={flipped.has(card.id)}
              isDone={completed.has(card.id)}
              onFlip={() => toggleFlip(card)}
              onTry={() => {
                engageCard(card);
                setActiveId(card.id);
              }}
            />
          </li>
        ))}
      </ul>

      {activeCard ? (
        <ChallengeModal
          card={activeCard}
          alreadyDone={completed.has(activeCard.id)}
          onClose={() => setActiveId(null)}
        />
      ) : null}
    </ScreenFrame>
  );
}

interface FlipCardProps {
  card: DeckCard;
  isFlipped: boolean;
  isDone: boolean;
  onFlip: () => void;
  onTry: () => void;
}

function FlipCard({ card, isFlipped, isDone, onFlip, onTry }: FlipCardProps) {
  const reduce = prefersReducedMotion();

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  }

  return (
    <div className="[perspective:1200px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? `${card.title}, showing the trick. Press to flip back.`
            : `${card.title}. Press to flip and reveal an AI trick.`
        }
        onClick={onFlip}
        onKeyDown={onKeyDown}
        className={[
          'group relative block min-h-[15rem] w-full cursor-pointer rounded-xl text-left',
          'transition-transform duration-500 [transform-style:preserve-3d]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-lime',
          reduce ? '' : isFlipped ? '[transform:rotateY(180deg)]' : '',
        ].join(' ')}
      >
        {/* FRONT face */}
        <div
          aria-hidden={isFlipped && !reduce}
          className={[
            'panel flex min-h-[15rem] flex-col p-4 [backface-visibility:hidden]',
            reduce && isFlipped ? 'hidden' : '',
            isDone ? 'text-lime neon-box' : 'text-cyan',
            !reduce ? 'absolute inset-0' : '',
          ].join(' ')}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
              {card.tags.join(' / ')}
            </span>
            {isDone ? (
              <span
                className="text-lime text-glow-soft font-mono text-xs"
                aria-label="Discovered"
              >
                ✓ done
              </span>
            ) : (
              <span aria-hidden="true" className="font-mono text-xs text-ink-faint">
                tap to flip
              </span>
            )}
          </div>
          <h2 className="text-glow-soft mt-3 font-display text-lg">{card.title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{card.front}</p>
          <span aria-hidden="true" className="mt-auto pt-4 text-2xl opacity-60">
            🃏
          </span>
        </div>

        {/* BACK face */}
        <div
          aria-hidden={!isFlipped}
          className={[
            'panel neon-box flex min-h-[15rem] flex-col p-4 text-lime',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            reduce ? (isFlipped ? 'block' : 'hidden') : 'absolute inset-0',
            reduce ? '[transform:none]' : '',
          ].join(' ')}
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
            The trick
          </span>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink">{card.reveal}</p>
          <div className="mt-3 flex items-center gap-2">
            <NeonButton
              variant="cyan"
              onClick={(e) => {
                e.stopPropagation();
                onTry();
              }}
            >
              {isDone ? 'Try again' : 'Try it'}
            </NeonButton>
            <span aria-hidden="true" className="font-mono text-xs text-ink-faint">
              flip back ↩
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChallengeModalProps {
  card: DeckCard;
  alreadyDone: boolean;
  onClose: () => void;
}

function ChallengeModal({ card, alreadyDone, onClose }: ChallengeModalProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReturnType<typeof scorePrompt> | null>(null);
  const [seconds, setSeconds] = useState(CHALLENGE_SECONDS);
  const [timeUp, setTimeUp] = useState(false);
  const submittedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const shownScore = useAnimatedNumber(result?.score ?? 0);

  // Focus the textarea on open and close on Escape.
  useEffect(() => {
    textareaRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Light flavor timer. It never hard-fails. Once result is in, it stops.
  useEffect(() => {
    if (result) return;
    if (seconds <= 0) {
      setTimeUp(true);
      return;
    }
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds, result]);

  function submit() {
    const scored = scorePrompt(text);
    setResult(scored);

    // Engaging a challenge feeds the Taste Engine again, a touch heavier.
    recordInterest(card.tags, 2);

    // Mark the card discovered and reward, but only the first completion.
    if (!submittedRef.current) {
      submittedRef.current = true;
      if (!alreadyDone) {
        recordPlay('deck', card.id);
        addXp(20);

        // Milestone badges. Both ids exist in the BADGES catalog.
        const after = getProgress();
        const deckDone = (after.completed['deck'] ?? []).length;
        if (deckDone >= 10) unlockBadge('deck-10');
        if (after.level >= 5) unlockBadge('level-5');
      }
    }
  }

  const canSubmit = text.trim().length > 0 && !result;
  const titleId = `challenge-${card.id}`;

  return (
    <div
      className="scrim fixed inset-0 z-50 flex items-center justify-center p-4 anim-rise"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="panel neon-box text-lime w-full max-w-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
              Micro-challenge
            </p>
            <h2 id={titleId} className="text-glow-soft mt-1 font-display text-lg">
              {card.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close challenge"
            className="rounded font-mono text-sm text-ink-soft transition-colors hover:text-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink">{card.challenge}</p>

        {/* Timer flavor. Honest about being optional. */}
        {!result ? (
          <p
            className={`mt-3 font-mono text-xs ${
              timeUp ? 'text-orange' : 'text-ink-faint'
            }`}
            aria-live="polite"
          >
            {timeUp
              ? 'Time is up, but no pressure. Submit whenever you are ready.'
              : `${seconds}s on the clock. Just for fun, not a fail.`}
          </p>
        ) : null}

        <label className="sr-only" htmlFor={`prompt-${card.id}`}>
          Write your prompt
        </label>
        <textarea
          id={`prompt-${card.id}`}
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!!result}
          rows={4}
          placeholder="Write your prompt here..."
          className="mt-3 w-full resize-y rounded-lg border border-edge bg-abyss/60 p-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-60"
        />

        {result ? (
          <div className="mt-4 anim-rise">
            <div className="flex items-center gap-3">
              <span
                className={`${TIER_TEXT[result.tier]} neon-box text-glow-soft rounded-md px-3 py-1.5 font-mono text-sm`}
                aria-label={`Score ${result.score} out of 100, ${TIER_LABEL[result.tier]}`}
              >
                {shownScore}
                <span className="text-ink-faint">/100</span>{' '}
                <span className="text-[0.65rem] uppercase">{TIER_LABEL[result.tier]}</span>
              </span>
              <p className="text-sm text-ink-soft">
                {result.tier === 'elite'
                  ? 'Clean prompt. The AI had everything it needed.'
                  : result.tier === 'strong'
                    ? 'Strong. The AI knew what you wanted.'
                    : 'Good start. One tweak makes it sharper.'}
              </p>
            </div>

            {result.topFix ? (
              <p className="mt-3 text-sm text-ink-soft">
                <span className="text-orange text-glow-soft">Next time:</span>{' '}
                {result.topFix}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <NeonButton
                variant="cyan"
                onClick={() => {
                  setResult(null);
                  setText('');
                  setSeconds(CHALLENGE_SECONDS);
                  setTimeUp(false);
                  textareaRef.current?.focus();
                }}
              >
                Rewrite
              </NeonButton>
              <NeonButton variant="violet" onClick={onClose}>
                Done
              </NeonButton>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <NeonButton variant="cyan" onClick={submit} disabled={!canSubmit}>
              Submit prompt
            </NeonButton>
            <NeonButton variant="orange" onClick={onClose}>
              Cancel
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  );
}
