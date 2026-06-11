// Mind Reader: you get a secret goal, you write ONE prompt, and the AI takes you
// painfully literally. Missing requirements get exposed as a gap (rose chips) next
// to what you nailed (lime chips). Revise the same prompt until every requirement
// lands, then the AI finally reads your mind and you bank XP.
// Feature id 30. Fully offline and deterministic. Keyboard operable. Motion gated by CSS.

import { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenFrame from '../components/ui/ScreenFrame';
import NeonButton from '../components/ui/NeonButton';
import { MIND_READER_GOALS } from '../data/mindreader';
import {
  addXp,
  recordPlay,
  recordInterest,
  unlockBadge,
  getProgress,
  type MindReaderGoal,
} from '../engine';

// Synonym-aware matching. The old matcher only counted a requirement when its exact
// literal phrase appeared, so "no meat" failed the "vegetarian" requirement even though
// the player nailed the intent. This map lets equivalent phrasings satisfy a requirement.
// Keep it DETERMINISTIC: a requirement counts if the requirement OR any synonym appears
// in the normalized prompt. Keyed by the requirement string used in src/data/mindreader.ts.
const SYNONYMS: Record<string, string[]> = {
  // gymbro-meals
  '3 day': ['three day', '3 days', 'three days', 'over 3 days', 'over three days'],
  vegetarian: ['no meat', 'veggie', 'plant based', 'meatless', 'meat free', 'no meat at all'],
  'no mushrooms': ['without mushrooms', 'hates mushrooms', 'no mushroom', 'skip the mushrooms', 'no fungi'],
  'high protein': ['protein rich', 'lots of protein', 'high in protein', 'tons of protein', 'protein packed'],
  // cold-email
  'cold email': ['cold outreach', 'outreach email', 'cold message', 'intro email'],
  'under 100 words': ['less than 100 words', 'fewer than 100 words', 'under a hundred words', 'max 100 words', 'no more than 100 words'],
  friendly: ['warm', 'warm tone', 'approachable', 'casual', 'kind tone'],
  'call to action': ['cta', 'clear ask', 'one ask', 'next step', 'one clear ask'],
  // tokyo-trip
  '5 day': ['five day', '5 days', 'five days', 'over 5 days'],
  tokyo: ['in tokyo', 'tokyo japan'],
  budget: ['cheap', 'affordable', 'low cost', 'on a budget', 'budget friendly', 'inexpensive'],
  food: ['food spots', 'places to eat', 'where to eat', 'restaurants', 'eats', 'good eats'],
  'public transit': ['public transport', 'metro', 'subway', 'trains', 'transit', 'getting around by train'],
  // study-plan
  '1 week': ['one week', '7 day', 'seven day', '7 days', 'seven days', 'a week'],
  python: ['the python language', 'python programming'],
  beginner: ['novice', 'newbie', 'just starting', 'brand new', 'no experience', 'starting out'],
  '1 hour': ['one hour', 'an hour', '60 minutes', 'sixty minutes', 'hour a day', 'hour per day'],
  free: ['no cost', 'zero cost', 'no money', 'without paying', 'free resources', 'free only'],
  // kid-bedtime
  'bedtime story': ['bed time story', 'story for bed', 'story before bed', 'goodnight story'],
  '5 year old': ['five year old', '5yo', 'five-year-old', 'age 5', 'aged 5'],
  dinosaur: ['dino', 'dinosaurs', 't rex', 't-rex'],
  'calm ending': ['gentle ending', 'soft ending', 'peaceful ending', 'soothing ending', 'cozy ending', 'calm finish'],
  'not scary': ['no scary', 'nothing scary', 'no scary parts', 'not frightening', 'no frightening', 'not spooky', 'no spooky'],
};

// Normalize for matching: lowercase, collapse hyphens to spaces, and squeeze whitespace.
// This makes "3-day", "3  day" and "3 day" all line up, plus hyphen/space variants.
function normalize(text: string): string {
  return text.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

// A requirement is present if the normalized requirement OR any of its synonyms appears
// in the normalized prompt. Simple singular/plural is covered by listing both variants.
function requirementPresent(haystack: string, req: string): boolean {
  const phrases = [req, ...(SYNONYMS[req] ?? [])];
  return phrases.some((phrase) => haystack.includes(normalize(phrase)));
}

// Deterministic, synonym-aware detection of what is still missing. A teaching signal,
// not a grader.
function detectMissing(prompt: string, requirements: string[]): string[] {
  const hay = normalize(prompt);
  return requirements.filter((req) => !requirementPresent(hay, req));
}

// Gentle nudge toward ONE missing requirement without handing over the keyword.
const HINT_FOR: Record<string, string> = {
  '3 day': 'How long should this run? A number of days would help.',
  'vegetarian': 'What can the eater actually eat? Spell out the diet.',
  'no mushrooms': 'Is there a food they refuse to touch? Name it.',
  'high protein': 'What is the nutrition goal here? Be specific about it.',
  'cold email': 'What kind of message is this, exactly?',
  'under 100 words': 'How long should it be? Give it a hard limit.',
  'friendly': 'What should the tone feel like to the reader?',
  'call to action': 'What do you want them to DO at the end?',
  '5 day': 'How many days are we planning for?',
  'tokyo': 'Where on earth are we going? Name the city.',
  'budget': 'How loose is the wallet? Set the money expectation.',
  'food': 'What do they care about seeing or doing there?',
  'public transit': 'How will they get around town?',
  '1 week': 'Over what stretch of time should this happen?',
  'python': 'What exactly are they learning?',
  'beginner': 'What is their starting skill level?',
  '1 hour': 'How much time per day do they have?',
  'free': 'Any constraint on cost of the resources?',
  'bedtime story': 'What kind of story is this, and for when?',
  '5 year old': 'Who is this for? An age helps a lot.',
  'dinosaur': 'Who or what is the story about?',
  'calm ending': 'How should it land at the very end?',
  'not scary': 'Anything the story must avoid for a young listener?',
};

function hintFor(req: string): string {
  return HINT_FOR[req] ?? `You still have not mentioned: ${req}.`;
}

export default function MindReader() {
  const navigate = useNavigate();
  const textareaId = useId();

  const [goalIndex, setGoalIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  // null = not submitted yet this round. Otherwise holds the evaluated submission.
  const [submission, setSubmission] = useState<{
    missing: string[];
    text: string;
  } | null>(null);

  const goal: MindReaderGoal = MIND_READER_GOALS[goalIndex];
  const winLockRef = useRef<string | null>(null);

  const won = submission !== null && submission.missing.length === 0;
  const firstMissing = submission?.missing[0] ?? null;

  const presentMap = useMemo(() => {
    // For chip rendering after a submission: which requirements were satisfied.
    if (!submission) return null;
    const missingSet = new Set(submission.missing);
    return goal.requirements.map((req) => ({ req, present: !missingSet.has(req) }));
  }, [submission, goal]);

  function handleSubmit() {
    if (!prompt.trim()) return;
    const missing = detectMissing(prompt, goal.requirements);
    setSubmission({ missing, text: prompt });

    if (missing.length === 0 && winLockRef.current !== goal.id) {
      winLockRef.current = goal.id;
      addXp(40);
      recordPlay('mindreader', goal.id);
      recordInterest(goal.tags);
      if (getProgress().badges.length === 0) unlockBadge('first-win');
      unlockBadge('mind-reader');
    }
  }

  function resetRound() {
    setSubmission(null);
  }

  function goToGoal(index: number) {
    setGoalIndex(index);
    setPrompt('');
    setSubmission(null);
    winLockRef.current = null;
  }

  const hasNext = goalIndex < MIND_READER_GOALS.length - 1;

  return (
    <ScreenFrame
      title="Mind Reader"
      subtitle="You get a secret goal. You write one prompt. The AI honors only what you actually said. Close the gap."
      accent="orange"
    >
      {/* Goal switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
          Goal
        </span>
        {MIND_READER_GOALS.map((g, i) => (
          <button
            key={g.id}
            type="button"
            onClick={() => goToGoal(i)}
            aria-pressed={i === goalIndex}
            className={[
              'rounded-md border px-3 py-1 font-mono text-xs transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange',
              i === goalIndex
                ? 'text-orange neon-box text-glow-soft'
                : 'border-edge text-ink-soft hover:text-orange',
            ].join(' ')}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* LEFT: the secret briefing + prompt console */}
        <div className="flex flex-col gap-5">
          {/* Briefing panel */}
          <div className="panel text-orange neon-box p-4">
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden="true">🎯</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                Secret goal
              </span>
            </div>
            <p className="text-glow-soft text-lg leading-snug">{goal.brief}</p>
            <p className="mt-3 text-xs text-ink-soft">
              Write one prompt that makes the AI deliver exactly this. It only knows
              what you type.
            </p>
          </div>

          {/* Prompt console */}
          <div className="panel p-4">
            <label
              htmlFor={textareaId}
              className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint"
            >
              Prompt console
            </label>
            <textarea
              id={textareaId}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              spellCheck={false}
              placeholder="Type your prompt here. Say what you actually mean."
              className={[
                'w-full resize-y rounded-lg border border-edge bg-abyss/60 p-3',
                'font-mono text-sm leading-relaxed text-ink placeholder:text-ink-faint',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange',
              ].join(' ')}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <NeonButton
                variant="orange"
                onClick={handleSubmit}
                disabled={!prompt.trim()}
              >
                {submission ? 'Resubmit' : 'Send to AI'}
              </NeonButton>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                One prompt. Revise as many times as you need.
              </span>
            </div>
          </div>

          {/* Hint nudge: only while there is a gap. Points at the first miss without giving the word. */}
          {submission && !won && firstMissing ? (
            <p className="text-sm text-ink-soft">
              <span className="text-orange text-glow-soft">Hint:</span>{' '}
              {hintFor(firstMissing)}
            </p>
          ) : null}
        </div>

        {/* RIGHT: the AI reply + the gap + win state */}
        <div className="flex flex-col gap-5">
          {/* AI reply panel */}
          <div
            className={[
              'panel flex min-h-[10rem] flex-col p-4',
              submission ? (won ? 'text-lime neon-box anim-pulse' : 'text-rose neon-box') : '',
            ].join(' ')}
          >
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden="true">🤖</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                {submission ? (won ? 'AI reply (it gets you)' : 'AI reply (painfully literal)') : 'AI reply'}
              </span>
            </div>
            <p
              aria-live="polite"
              className={`text-sm leading-relaxed ${
                submission ? 'text-ink' : 'text-ink-faint italic'
              }`}
            >
              {submission
                ? won
                  ? goal.satisfiedReply
                  : goal.literalReply
                : 'Send a prompt and the AI answers here. It will take you at your exact word.'}
            </p>
          </div>

          {/* The gap: requirement chips, only after a submission */}
          {presentMap ? (
            <div>
              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
                The gap (what you asked for vs wanted)
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Requirement coverage">
                {presentMap.map(({ req, present }) => (
                  <li
                    key={req}
                    className={[
                      'rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider',
                      present ? 'text-lime neon-box text-glow-soft' : 'text-rose neon-box',
                    ].join(' ')}
                  >
                    <span aria-hidden="true">{present ? '✓ ' : '✗ '}</span>
                    {req}
                    <span className="sr-only">
                      {present ? ' included' : ' missing'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Lesson copy on a miss */}
          {submission && !won ? (
            <div className="panel p-4">
              <p className="text-sm text-ink-soft">
                <span className="text-orange text-glow-soft">The catch:</span> the AI
                gave you exactly what you asked for. You just did not ask for everything
                you wanted. Add the rose pieces to your prompt and send it again.
              </p>
            </div>
          ) : null}

          {/* Win state */}
          {won ? (
            <div className="panel neon-box text-lime anim-rise p-5 text-center">
              <p className="text-glow text-2xl">Read your mind.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Every piece landed, so the AI finally gave you what you actually meant.
                You banked 40 XP.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {hasNext ? (
                  <NeonButton variant="orange" onClick={() => goToGoal(goalIndex + 1)}>
                    Next goal
                  </NeonButton>
                ) : null}
                <NeonButton variant="cyan" onClick={resetRound}>
                  Try again
                </NeonButton>
                <NeonButton variant="violet" onClick={() => navigate('/')}>
                  Back to grid
                </NeonButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ScreenFrame>
  );
}
