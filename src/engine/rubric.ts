// The Rubric Engine. Pure, deterministic, offline. No storage, no network,
// no Date, no randomness. Same input always produces the same output.
// Detection is heuristic (keywords + structure + length). It is a teaching
// signal, not a grading authority.

import type { SignalKey, SignalResult, RubricResult, Tier } from './types';

// A detector returns whether the signal is present and, when present, the
// short matched phrase or reason that lit it. The absent-case evidence is a
// crisp one-liner stored separately on the def, so the player always sees WHY
// a chip is on or WHAT to add to turn it on.
interface DetectResult {
  present: boolean;
  hit?: string; // the matched phrase or short reason when present
}

interface SignalDef {
  key: SignalKey;
  label: string;
  weight: number;
  tip: string;
  missing: string; // evidence shown when the signal is absent
  detect: (prompt: string, lower: string) => DetectResult;
}

// Pull the first regex match out of the text so we can show the player the
// exact phrase that lit a signal. Returns a trimmed, length-capped snippet.
function firstMatch(text: string, re: RegExp): string | undefined {
  const m = re.exec(text);
  if (!m) return undefined;
  const phrase = (m[0] ?? '').trim();
  if (!phrase) return undefined;
  return phrase.length > 48 ? `${phrase.slice(0, 45)}...` : phrase;
}

// Helper for the common keyword case: present if the regex matches, with the
// matched phrase as evidence. Matching is done against the lowercased text so
// detection stays case-insensitive and deterministic.
function keyword(re: RegExp) {
  return (_p: string, lower: string): DetectResult => {
    const hit = firstMatch(lower, re);
    return { present: !!hit, hit };
  };
}

// Weights sum to 1.0 exactly across the ten signals.
const SIGNAL_DEFS: SignalDef[] = [
  {
    key: 'role',
    label: 'Role',
    weight: 0.14,
    tip: 'Tell it who to be.',
    missing: 'No role yet. Try "you are a..." or "act as a...".',
    detect: keyword(
      /\b(you(?:'?re| are)|act (?:as|like)|as an? \w|pretend (?:to be|you)|imagine you(?:'?re| are)|play the role|in the role of|channel your inner|speak as|respond as)\b/,
    ),
  },
  {
    key: 'context',
    label: 'Context',
    weight: 0.13,
    tip: 'Give it the backstory it needs.',
    missing: 'No backstory. Add why you need it or what you are working on.',
    detect: (p, lower) => {
      const re =
        /\b(because|since|so that|in order to|for (?:my|our|the|a|an)|we(?:'?re| are)?|our|i(?:'?m| am) (?:working|trying|building|planning|making)|the goal is|trying to|i need (?:this|it|to)|background|context|the situation is|right now|currently)\b/;
      const hit = firstMatch(lower, re);
      if (hit) return { present: true, hit };
      // Long prompts almost always carry implicit context.
      if (p.length > 160) return { present: true, hit: 'rich detail (long prompt)' };
      return { present: false };
    },
  },
  {
    key: 'audience',
    label: 'Audience',
    weight: 0.11,
    tip: 'Say who it is for.',
    missing: 'No audience. Say who it is for, like "for my boss" or "a beginner".',
    detect: (_p, lower) => {
      // Natural phrasings: "for me", "for my <noun>", "for a beginner",
      // "my boss/team/kid", role nouns, and group words like "kids/the team".
      const re =
        /\b(for (?:me|us|you|myself|a|an|my|our|the|kids?|children|teens?|teenagers?|beginners?|seniors?|grandma)|aimed at|geared (?:to|toward)|targeted at|so (?:a|an|my|the)\b.*\b(?:can|understand|get it)|my (?:boss|team|mom|mum|dad|kid|kids|son|daughter|wife|husband|client|clients|manager|students?|class|grandma|partner|coworkers?)|the (?:team|class|audience|reader|readers|client|customer|customers|user|users)|audience|readers?|beginners?|novices?|experts?|customers?|clients?|kids?|children|teens?|teenagers?|students?|users?|non-?technical|laypers|five[ -]year[ -]old|5[ -]year[ -]old|explain (?:it )?to)\b/;
      const hit = firstMatch(lower, re);
      return { present: !!hit, hit };
    },
  },
  {
    key: 'format',
    label: 'Format',
    weight: 0.11,
    tip: 'Ask for a shape: list, table, steps.',
    missing: 'No shape requested. Ask for a list, a table, or numbered steps.',
    detect: keyword(
      /\b(bullets?|bullet points?|numbered|in steps?|as a (?:list|table|chart|email|essay|poem|tweet|script)|in a table|table|lists?|steps?|json|markdown|csv|paragraphs?|\d+ (?:words?|sentences?|bullets?|paragraphs?|lines?|items?)|words?|sentences?|format(?:ted)? as|outline|headlines?|subject line|tl;?dr|columns?|sections?|in the form of)\b/,
    ),
  },
  {
    key: 'constraints',
    label: 'Constraints',
    weight: 0.11,
    tip: 'Set the guardrails: limits and do-nots.',
    missing: 'No guardrails. Add a limit ("under 200 words") or a "do not".',
    detect: (p, lower) => {
      const re =
        /(don'?t|do not|avoid|only|must(?: not)?|no more than|under \d|over \d|fewer than|less than|within|at most|at least|limit|keep it (?:short|under|to)|exclude|without|no [a-z]+ing|no \w+|max(?:imum)?|min(?:imum)?|budget|deadline|skip the)/;
      const hit = firstMatch(lower, re);
      if (hit) return { present: true, hit };
      // Numbers paired with units (a hard constraint) e.g. "200 words", "20 min".
      const unit = firstMatch(
        p,
        /\b\d+\s?(?:words?|min(?:ute)?s?|hours?|days?|sentences?|pages?|chars?|characters?|dollars?|\$|%)\b/i,
      );
      if (unit) return { present: true, hit: unit };
      return { present: false };
    },
  },
  {
    key: 'examples',
    label: 'Examples',
    weight: 0.09,
    tip: 'Show it one example of what you mean.',
    missing: 'No example. Show one with "for example" or a quoted sample.',
    detect: (p, lower) => {
      const kw = firstMatch(
        lower,
        /\b(for example|for instance|e\.g\.|i\.e\.|such as|like this|similar to|in the style of|here(?:'?s| is) (?:an? )?example|sample|template)\b/,
      );
      if (kw) return { present: true, hit: kw };
      // A quoted snippet of real length reads as a worked example.
      const quoted = firstMatch(p, /["“”'].{3,}?["“”']/);
      if (quoted) return { present: true, hit: `quoted sample ${quoted}` };
      return { present: false };
    },
  },
  {
    key: 'tone',
    label: 'Tone',
    weight: 0.08,
    tip: 'Name the vibe you want.',
    missing: 'No vibe set. Name a tone like friendly, formal, or punchy.',
    detect: keyword(
      /\b(tone|friendly|formal|casual|funny|humorous|playful|professional|warm|concise|punchy|serious|witty|upbeat|cheerful|dry|snarky|enthusiastic|empathetic|encouraging|confident|calm|voice|style|vibe|sound (?:like|more)|feel)\b/,
    ),
  },
  {
    key: 'specificity',
    label: 'Specificity',
    weight: 0.09,
    tip: 'Add real numbers and names.',
    missing: 'Too generic. Drop in a real number, name, or concrete detail.',
    detect: (p) => {
      const num = firstMatch(p, /\b\d[\d,.]*\b/);
      if (num) return { present: true, hit: `number ${num}` };
      // A proper noun (a Capitalized word past the first character) reads as a
      // concrete name. Slice(1) so a normally-capitalized first word does not count.
      const name = firstMatch(p.slice(1), /\b[A-Z][a-z]{2,}\b/);
      if (name) return { present: true, hit: `name "${name}"` };
      return { present: false };
    },
  },
  {
    key: 'stepwise',
    label: 'Stepwise',
    weight: 0.07,
    tip: 'Ask it to work through it step by step.',
    missing: 'Not stepwise. Ask it to "go step by step" or "first... then...".',
    detect: keyword(
      /\b(step by step|step-by-step|one step at a time|first(?:,| )|then |next,|after that|finally|walk me through|talk me through|break (?:it|this) down|in order|sequence|one at a time|think (?:it )?through)\b/,
    ),
  },
  {
    key: 'lengthFit',
    label: 'Length fit',
    weight: 0.07,
    tip: 'Aim for a useful middle length, not a fragment or a wall.',
    missing: 'Length is off. Aim past a fragment but under a wall of text.',
    detect: (p) => {
      const len = p.trim().length;
      if (len >= 25 && len <= 1200) {
        return { present: true, hit: `${len} characters, a workable length` };
      }
      return { present: false };
    },
  },
];

// Advanced signals power the Boot Camp (intermediate) drills. They are kept out
// of SIGNAL_DEFS on purpose: the default score is still the ten core signals, so
// the beginner Gym and the existing tests are untouched. An advanced signal only
// counts when a drill lists it in require[]. Same offline, heuristic philosophy.
const ADVANCED_SIGNAL_DEFS: SignalDef[] = [
  {
    key: 'decomposition',
    label: 'Decomposition',
    weight: 0.12,
    tip: 'Split the job into parts or roles.',
    missing: 'One big ask. Break it into parts, roles, or stages the model handles in turn.',
    detect: (_p, lower) => {
      // Explicit "break this up / hand it to roles / do it in stages" language.
      const kw = firstMatch(
        lower,
        /\b(break (?:it|this|the \w+) (?:down|into)|split (?:it|this|the)\b|divide (?:it|this|the)\b|in (?:stages|phases|passes|steps)|step 1\b|stage 1\b|phase (?:1|one)\b|sub-?tasks?|subtasks?|sub-?agents?|team of|specialists?|a (?:researcher|writer|editor|critic|reviewer|planner|checker|fact-?checker|drafter|analyst)\b|act as (?:three|several|multiple|a team)|one (?:agent|model|pass|step)\b[\s\S]{0,60}\b(?:another|second|next|then)\b|first\b[\s\S]{0,60}\bthen\b[\s\S]{0,60}\b(?:then|finally)\b|hand (?:it|this) off|delegate|assign (?:each|the|a|every)|pipeline)\b/,
      );
      if (kw) return { present: true, hit: kw };
      // An enumerated plan of three or more numbered parts reads as decomposition.
      const nums = lower.match(/(?:^|\n|\s)[1-9][.)]\s/g);
      if (nums && nums.length >= 3) {
        return { present: true, hit: `${nums.length} enumerated parts` };
      }
      return { present: false };
    },
  },
  {
    key: 'verification',
    label: 'Verification',
    weight: 0.12,
    tip: 'Make it check its own work.',
    missing: 'Nothing checks the answer. Ask it to verify, critique, or find its own mistakes.',
    detect: keyword(
      /\b(double[ -]?check|check (?:your|its|the) (?:work|answer|reasoning|facts)|verify|critique|review (?:your|its|the)\b[\s\S]{0,30}\b(?:work|answer|reasoning|draft|criteria)|self[ -]?(?:check|review|critique|grade)|fact[ -]?check|find (?:the |any )?(?:flaws?|errors?|mistakes?|holes?|weak\w*|gaps?)|what(?:'?s| is) wrong with (?:this|it|your)|where (?:could|might) (?:this|it|you|your)\b[\s\S]{0,20}\bwrong|cite (?:your )?sources?|second (?:pass|opinion|set of eyes|model|reviewer)|grade (?:your|its|the|it)\b|sanity[ -]?check|cross[ -]?check|proofread|red[ -]?team|poke holes|stress[ -]?test|catch (?:any |the )?(?:mistakes?|errors?)|rate your confidence|how confident are you|confidence (?:level|score))\b/,
    ),
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

  // The reported signal set is the ten core signals, plus any advanced signal a
  // drill explicitly requires. With no require, advanced signals never appear, so
  // the default score and the rendered chips are exactly the beginner behavior.
  const activeAdvanced = requireSet
    ? ADVANCED_SIGNAL_DEFS.filter((d) => requireSet.has(d.key))
    : [];
  const defs = activeAdvanced.length ? [...SIGNAL_DEFS, ...activeAdvanced] : SIGNAL_DEFS;

  const scored = requireSet ? defs.filter((d) => requireSet.has(d.key)) : SIGNAL_DEFS;
  const normBase = scored.reduce((sum, d) => sum + d.weight, 0) || TOTAL_WEIGHT;

  const signals: SignalResult[] = [];
  let scoreFraction = 0;

  for (const def of defs) {
    const result = blank ? { present: false } : def.detect(text, lower);
    const present = result.present;
    const counts = requireSet ? requireSet.has(def.key) : true;
    const normWeight = counts ? def.weight / normBase : 0;
    if (present && counts) scoreFraction += normWeight;
    // Evidence: for a present signal, the matched phrase or reason. For an
    // absent one, the crisp "what to add" line. Never empty.
    const evidence = present
      ? result.hit
        ? `Matched: ${result.hit}`
        : 'Detected in your prompt.'
      : def.missing;
    signals.push({
      key: def.key,
      label: def.label,
      present,
      weight: counts ? normWeight : 0,
      tip: def.tip,
      evidence,
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
