// Gym.tsx: standalone Prompt Gym page.
// Six drills, each targeting different rubric signals so they teach different moves.
// Adult, editorial tone. NO EM DASHES. No XP, no badges, no gamification.

import PracticeBox from '../components/PracticeBox';
import type { PracticeSpec } from '../content/types';

const DRILLS: PracticeSpec[] = [
  {
    brief:
      'Most prompts forget who is answering. Give the AI a role and tell it who the answer is for. Watch the Role and Audience chips turn green.',
    starter: 'explain compound interest',
    require: ['role', 'audience'],
  },
  {
    brief:
      'Shape matters as much as substance. Ask for a specific output format and add at least one constraint to keep the answer tight.',
    starter: 'give me ideas for a team offsite',
    require: ['format', 'constraints'],
  },
  {
    brief:
      'Context tells the AI what is actually going on. Add backstory and at least one specific detail so it has something real to work with.',
    starter: 'help me write an email',
    require: ['context', 'specificity'],
  },
  {
    brief:
      'One example does more work than three paragraphs of instruction. Drop in a concrete sample so the AI can match the pattern.',
    starter: 'write a product description',
    require: ['examples'],
  },
  {
    brief:
      'Complex tasks need a plan before an answer. Ask the AI to work step by step instead of jumping to conclusions.',
    starter: 'help me decide whether to change jobs',
    require: ['stepwise'],
  },
  {
    brief:
      'Tone shapes everything a reader feels. Name the voice you want and watch the output shift to match.',
    starter: 'write a birthday message for my colleague',
    require: ['tone'],
  },
  {
    brief:
      'Put it all together. A strong prompt names a role, provides context, sets a format, adds a constraint, and reads at a useful length. Fix whichever signals are still missing.',
    starter: 'write something about social media',
    require: ['role', 'context', 'format', 'constraints', 'lengthFit'],
  },
];

const DRILL_TITLES: string[] = [
  'Drill 1. Role and Audience',
  'Drill 2. Format and Constraints',
  'Drill 3. Context and Specificity',
  'Drill 4. Examples',
  'Drill 5. Stepwise Thinking',
  'Drill 6. Tone',
  'Drill 7. Full-Signal Prompt',
];

export default function Gym() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 anim-route">
      {/* Page header */}
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold text-ink mb-3">Prompt Gym</h1>
        <p className="text-ink-soft text-base leading-relaxed max-w-prose">
          Short drills, instant feedback. Each drill isolates one or two rubric signals
          so you can feel the difference a single change makes. Rewrite the starter prompt
          in the box below it. The score updates as you type.
        </p>
        <p className="mt-3 text-ink-faint text-sm">
          Seven drills. No account. No score to chase. Just the prompt and the feedback.
        </p>
      </header>

      {/* Drills */}
      <div className="flex flex-col gap-10">
        {DRILLS.map((drill, i) => (
          <section key={drill.require.join('-') + i} aria-label={DRILL_TITLES[i]}>
            <h2 className="font-display text-xl font-semibold text-ink mb-1">
              {DRILL_TITLES[i]}
            </h2>
            <PracticeBox spec={drill} />
          </section>
        ))}
      </div>

      {/* Footer note */}
      <footer className="mt-14 border-t border-edge pt-6 text-xs text-ink-faint leading-relaxed">
        Scoring is local and deterministic. Nothing leaves your browser.
        The rubric uses heuristics, not an AI, to detect signal presence.
        It is a teaching aid, not an authority.
      </footer>
    </div>
  );
}
