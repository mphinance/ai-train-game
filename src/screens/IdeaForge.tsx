// The Idea Forge (feature id 33). The personalization payoff.
// On mount and on every forge it pulls the latest taste profile (taste is
// pull-based and does not broadcast), reads the top interests, and assembles a
// tailored set of AI-use ideas from IDEA_BANK by tag overlap. A short lead-in
// NAMES the inferred interests. Regenerate rotates the ranked pool via a counter
// so there is variety with zero randomness. Cold start shows starter ideas
// spanning common tags and never asks a quiz question. Fully offline.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenFrame from '../components/ui/ScreenFrame';
import NeonButton from '../components/ui/NeonButton';
import { IDEA_BANK } from '../data/ideas';
import {
  useTaste,
  recordPlay,
  unlockBadge,
  type IdeaCard,
  type InterestTag,
} from '../engine';

const SHOW_COUNT = 5; // how many ideas to surface per forge (4..6 per spec)

// Human-friendly tag labels for the lead-in copy. No em dashes anywhere.
const TAG_LABEL: Record<InterestTag, string> = {
  cooking: 'cooking',
  writing: 'writing',
  coding: 'coding',
  parenting: 'parenting',
  fitness: 'fitness',
  business: 'business',
  travel: 'travel',
  study: 'studying',
  creative: 'creative work',
  money: 'money',
};

// Join a list of phrases warmly: "a", "a and b", "a, b and c".
function joinWarm(parts: string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

// Rank the whole bank by how many of the player's top interests a card hits.
// Higher overlap first. Deterministic tie-break by original bank order so the
// output is stable and never relies on Math.random.
function rankByTaste(top: InterestTag[]): IdeaCard[] {
  const topSet = new Set(top);
  return IDEA_BANK.map((card, index) => {
    const overlap = card.tags.reduce(
      (sum, tag) => sum + (topSet.has(tag) ? 1 : 0),
      0,
    );
    return { card, index, overlap };
  })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return a.index - b.index;
    })
    .map((entry) => entry.card);
}

// A sensible cold-start spread across common tags, deterministic by bank order.
function starterSet(): IdeaCard[] {
  const wantTags: InterestTag[] = [
    'writing', 'cooking', 'coding', 'study', 'money',
  ];
  const picks: IdeaCard[] = [];
  const used = new Set<string>();
  for (const tag of wantTags) {
    const found = IDEA_BANK.find(
      (c) => c.tags.includes(tag) && !used.has(c.id),
    );
    if (found) {
      used.add(found.id);
      picks.push(found);
    }
  }
  return picks.slice(0, SHOW_COUNT);
}

export default function IdeaForge() {
  const navigate = useNavigate();
  const { top, refresh, profile } = useTaste();

  // A rotation counter gives variety on regenerate without any randomness.
  const [rotation, setRotation] = useState(0);
  // Bumped on each forge so the displayed set recomputes from a fresh pull.
  const [forgeTick, setForgeTick] = useState(0);
  const firstForgeLock = useRef(false);

  // Pull taste on mount so we reflect what the player did in other modes.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Read the player's top interests. Recomputed when a forge happens.
  const topTags = useMemo(
    () => top(3),
    // forgeTick drives a re-pull after refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [top, forgeTick],
  );

  // Cold start when there is no signal: every top tag carries zero weight, which
  // top() still returns in vocabulary order. We detect "no signal" by checking
  // that ranking produces no overlap at all.
  const ranked = useMemo(() => rankByTaste(topTags), [topTags]);
  const topSet = useMemo(() => new Set(topTags), [topTags]);
  // On a fresh, all-zero profile top() still returns tags in vocabulary order,
  // so "no signal" cannot be read from the tag list alone. Instead we read the
  // weighted profile directly: any positive weight means the player has engaged.
  const hasSignal = useMemo(
    () => topTags.some((t) => (profile[t] ?? 0) > 0),
    [topTags, profile],
  );

  // The ideas we actually show. With signal: rotate through the ranked pool so
  // regenerate surfaces fresh cards while keeping the best ones near the front.
  const ideas = useMemo<IdeaCard[]>(() => {
    if (!hasSignal) return starterSet();
    if (ranked.length === 0) return [];
    const offset = (rotation * SHOW_COUNT) % ranked.length;
    const out: IdeaCard[] = [];
    for (let i = 0; i < Math.min(SHOW_COUNT, ranked.length); i += 1) {
      out.push(ranked[(offset + i) % ranked.length]);
    }
    return out;
  }, [hasSignal, ranked, rotation]);

  // The named interests for the lead-in. Only name tags that the player actually
  // engaged (real signal), capped at the strongest two for readable copy.
  const namedTags = useMemo(() => {
    if (!hasSignal) return [];
    return topTags
      .filter((t) => (profile[t] ?? 0) > 0)
      .slice(0, 2);
  }, [hasSignal, topTags, profile]);

  function forge() {
    // Re-pull taste so we reflect anything done since the screen mounted.
    refresh();
    setRotation((r) => r + 1);
    setForgeTick((t) => t + 1);

    // On the first forge of all time, bank a session and light the badge.
    if (!firstForgeLock.current) {
      firstForgeLock.current = true;
      recordPlay('ideaforge', 'session');
      unlockBadge('first-forge');
    }
  }

  const leadIn = hasSignal
    ? `You keep reaching for ${joinWarm(namedTags.map((t) => TAG_LABEL[t]))}. Here is what that unlocks.`
    : 'Play a few cards and I will tailor these to you. For now, here are some starters worth a spin.';

  return (
    <ScreenFrame
      title="Idea Forge"
      subtitle="AI ideas built around what you actually care about. The more you play, the sharper this gets."
      accent="violet"
    >
      {/* Personalized lead-in */}
      <div className="panel neon-box text-violet anim-rise mb-6 p-5">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-2xl text-glow">💡</span>
          <div>
            <p className="text-glow-soft font-display text-sm uppercase tracking-wider">
              {hasSignal ? 'Read on you' : 'Cold start'}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink" aria-live="polite">
              {leadIn}
            </p>
          </div>
        </div>
      </div>

      {/* Forge / Regenerate control */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <NeonButton variant="violet" onClick={forge}>
          {forgeTick === 0 ? 'Forge ideas' : 'Regenerate'}
        </NeonButton>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
          {ideas.length} ideas {hasSignal ? 'tuned to you' : 'to get you moving'}
        </p>
      </div>

      {/* Idea cards */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ideas.map((idea) => (
          <li key={idea.id} className="panel anim-rise flex flex-col p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {idea.tags.map((tag) => {
                const lit = topSet.has(tag) && hasSignal;
                return (
                  <span
                    key={tag}
                    className={[
                      'rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider',
                      lit
                        ? 'text-violet neon-box text-glow-soft'
                        : 'border-edge text-ink-faint',
                    ].join(' ')}
                  >
                    {TAG_LABEL[tag]}
                  </span>
                );
              })}
            </div>
            <h3 className="text-cyan text-glow-soft font-display text-base leading-snug">
              {idea.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {idea.body}
            </p>
          </li>
        ))}
      </ul>

      {/* Footer nav */}
      <div className="mt-8 flex flex-wrap gap-3">
        <NeonButton variant="cyan" onClick={() => navigate('/badges')}>
          See your badges
        </NeonButton>
        <NeonButton variant="orange" onClick={() => navigate('/')}>
          Back to grid
        </NeonButton>
      </div>
    </ScreenFrame>
  );
}
