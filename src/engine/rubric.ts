// The Rubric Engine. Pure, deterministic, offline. No storage, no network,
// no Date, no randomness. Same input always produces the same output.
// Detection is heuristic (keywords + structure + length). It is a teaching
// signal, not a grading authority.

import type { SignalKey, SignalResult, RubricResult, Tier } from './types';

interface SignalDef {
  key: SignalKey;
  label: string;
  weight: number;
  tip: string;
  detect: (prompt: string, lower: string) => boolean;
}

// Weights sum to 1.0 exactly across the ten signals.
const SIGNAL_DEFS: SignalDef[] = [
  {
    key: 'role',
    label: 'Role',
    weight: 0.14,
    tip: 'Tell it who to be.',
    detect: (_p, lower) => /\b(you are|act as|act like|as an? |pretend you|imagine you are)\b/.test(lower),
  },
  {
    key: 'context',
    label: 'Context',
    weight: 0.13,
    tip: 'Give it the backstory it needs.',
    detect: (p, lower) =>
      /\b(because|since|for (my|our|the)|we|our|i'?m working on|the goal is|background|context)\b/.test(lower) ||
      p.length > 160,
  },
  {
    key: 'audience',
    label: 'Audience',
    weight: 0.11,
    tip: 'Say who it is for.',
    detect: (_p, lower) =>
      /\b(for (a|an|my|our)|audience|readers?|beginners?|customers?|clients?|kids?|children|students?|users?|my (team|boss|mom|kid))\b/.test(lower),
  },
  {
    key: 'format',
    label: 'Format',
    weight: 0.11,
    tip: 'Ask for a shape: list, table, steps.',
    detect: (_p, lower) =>
      /\b(bullet|bullets|list|table|steps?|numbered|json|markdown|paragraphs?|words?|sentences?|format|outline|headline|email|essay)\b/.test(lower),
  },
  {
    key: 'constraints',
    label: 'Constraints',
    weight: 0.11,
    tip: 'Set the guardrails: limits and do-nots.',
    detect: (_p, lower) =>
      /(don'?t|do not|avoid|only|must|no more than|under|within|at most|at least|limit|keep it|exclude|without|no [a-z])/.test(lower),
  },
  {
    key: 'examples',
    label: 'Examples',
    weight: 0.09,
    tip: 'Show it one example of what you mean.',
    detect: (p, lower) =>
      /\b(for example|e\.g\.|i\.e\.|like this|such as|for instance|example)\b/.test(lower) ||
      /["“”'].{3,}["“”']/.test(p),
  },
  {
    key: 'tone',
    label: 'Tone',
    weight: 0.08,
    tip: 'Name the vibe you want.',
    detect: (_p, lower) =>
      /\b(tone|friendly|formal|casual|funny|playful|professional|warm|concise|punchy|serious|witty|upbeat|voice|style)\b/.test(lower),
  },
  {
    key: 'specificity',
    label: 'Specificity',
    weight: 0.09,
    tip: 'Add real numbers and names.',
    detect: (p) => /\d/.test(p) || /\b[A-Z][a-z]{2,}\b/.test(p.slice(1)),
  },
  {
    key: 'stepwise',
    label: 'Stepwise',
    weight: 0.07,
    tip: 'Ask it to work through it step by step.',
    detect: (_p, lower) =>
      /\b(step by step|step-by-step|first|then|next|finally|walk me through|one at a time|break it down)\b/.test(lower),
  },
  {
    key: 'lengthFit',
    label: 'Length fit',
    weight: 0.07,
    tip: 'Aim for a useful middle length, not a fragment or a wall.',
    detect: (p) => {
      const len = p.trim().length;
      return len >= 25 && len <= 1200;
    },
  },
];

const TOTAL_WEIGHT = SIGNAL_DEFS.reduce((sum, d) => sum + d.weight, 0);

function tierForScore(score: number): Tier {
  if (score < 35) return 'weak';
  if (score < 65) return 'okay';
  if (score < 85) return 'strong';
  return 'elite';
}

export function scorePrompt(prompt: string, opts?: { require?: SignalKey[] }): RubricResult {
  const text = typeof prompt === 'string' ? prompt : '';
  const lower = text.toLowerCase();
  const blank = text.trim().length === 0;

  // Which signals count toward the score. If require is passed, only those, with
  // weights re-normalized across the required set so a level grades on its target.
  const requireSet = opts?.require && opts.require.length > 0 ? new Set(opts.require) : null;
  const scored = requireSet ? SIGNAL_DEFS.filter((d) => requireSet.has(d.key)) : SIGNAL_DEFS;
  const normBase = scored.reduce((sum, d) => sum + d.weight, 0) || TOTAL_WEIGHT;

  const signals: SignalResult[] = [];
  let scoreFraction = 0;

  for (const def of SIGNAL_DEFS) {
    const present = blank ? false : def.detect(text, lower);
    const counts = requireSet ? requireSet.has(def.key) : true;
    const normWeight = counts ? def.weight / normBase : 0;
    if (present && counts) scoreFraction += normWeight;
    signals.push({
      key: def.key,
      label: def.label,
      present,
      weight: counts ? normWeight : 0,
      tip: def.tip,
    });
  }

  const score = blank ? 0 : Math.round(100 * scoreFraction);
  const tier = tierForScore(score);

  // topFix: tip of the missing, counted signal with the highest weight.
  let topFix: string | null = null;
  let topWeight = -1;
  for (const sig of signals) {
    const counts = requireSet ? requireSet.has(sig.key) : true;
    if (counts && !sig.present && sig.weight > topWeight) {
      topWeight = sig.weight;
      topFix = sig.tip;
    }
  }

  return { score, tier, signals, topFix };
}
