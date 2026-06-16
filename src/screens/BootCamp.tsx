// BootCamp.tsx: standalone Boot Camp page, the intermediate track.
// Where the Gym drills single-prompt craft, Boot Camp drills composition: splitting
// work across roles, routing effort, and having the model check its own work. Same
// offline rubric engine, two extra signals (decomposition, verification) that only
// count here. Adult, editorial tone. NO EM DASHES. No XP, no badges, no gamification.

import PracticeBox from '../components/PracticeBox';
import type { PracticeSpec } from '../content/types';

const DRILLS: PracticeSpec[] = [
  {
    brief:
      'Big goals fail as one giant ask. Break this into named parts the model works through in turn, like a researcher who gathers, a writer who drafts, and a checker who cleans up.',
    starter: 'write me a business plan',
    require: ['decomposition'],
  },
  {
    brief:
      'The first answer is a draft, even the model\'s. Add a step that makes it check its own work: verify the claims, find the weak spots, and fix them before it shows you anything.',
    starter: 'summarize this article for me',
    require: ['verification'],
  },
  {
    brief:
      'Not every part of a job needs the same effort. Split the task and say which piece is quick and which needs careful reasoning, naming the concrete parts so nothing is vague.',
    starter: 'help me plan a product launch',
    require: ['decomposition', 'specificity'],
  },
  {
    brief:
      'Set a finish line the model can measure itself against. Define what "done" looks like, ask it to work step by step, and have it keep refining until the answer clears the bar.',
    starter: 'write ad copy for my app',
    require: ['verification', 'constraints', 'stepwise'],
  },
  {
    brief:
      'Put it together. Give it a role, break the work into parts, set the guardrails, and make it check itself at the end. This is what directing AI to build something actually looks like.',
    starter: 'make me a weekly meal planner',
    require: ['role', 'decomposition', 'constraints', 'verification', 'lengthFit'],
  },
];

const DRILL_TITLES: string[] = [
  'Drill 1. Split the Work',
  'Drill 2. The Critic',
  'Drill 3. Route the Effort',
  'Drill 4. Loop Until Done',
  'Drill 5. Spec a Build',
];

export default function BootCamp() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 anim-route">
      {/* Page header */}
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-cyan uppercase tracking-widest">
          Intermediate
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-3">Boot Camp</h1>
        <p className="text-ink-soft text-base leading-relaxed max-w-prose">
          The Gym taught you to write one strong prompt. Boot Camp teaches you to compose
          prompts into something that builds. Split a job across roles, route effort to where
          it is needed, and have the model check its own work before you ever see it.
        </p>
        <p className="mt-3 text-ink-faint text-sm">
          Five drills. Two new signals, Decomposition and Verification, light up here. Same
          local scoring, same instant feedback. Nothing leaves your browser.
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
        Scoring is local and deterministic. Nothing leaves your browser. The rubric uses
        heuristics, not an AI, to detect signal presence. It is a teaching aid, not an authority.
      </footer>
    </div>
  );
}
