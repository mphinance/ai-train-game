// SHARED COMPONENT, pre-staged by Wave 1. Agent B (Prompt Gym) owns the real
// implementation. Keep this prop signature stable: ChapterReader (Agent A) renders
// <PracticeBox spec={chapter.gym} /> inline, and Gym (Agent B) renders it standalone.
//
// Contract: spec?.require narrows the rubric via scorePrompt(prompt, { require }).
// This stub renders a minimal working scorer so the app compiles and smoke-tests pass
// before Wave 3. Agent B replaces the body with the full live-feedback UI.

import { useState } from 'react';
import type { PracticeSpec } from '../content/types';
import { scorePrompt } from '../engine/rubric';

export default function PracticeBox({ spec }: { spec?: PracticeSpec }) {
  const [prompt, setPrompt] = useState(spec?.starter ?? '');
  const result = scorePrompt(prompt, spec?.require?.length ? { require: spec.require } : undefined);

  return (
    <div className="panel my-6 p-4">
      {spec?.brief && <p className="mb-2 text-ink-soft">{spec.brief}</p>}
      <textarea
        className="w-full rounded-lg border border-edge bg-abyss p-3 font-mono text-sm"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        aria-label="Practice prompt"
      />
      <div className="mt-2 flex items-center gap-3">
        <span className="font-display text-2xl">{result.score}</span>
        <span className="text-ink-soft">{result.tier}</span>
        {result.topFix && <span className="text-ink-faint">Next: {result.topFix}</span>}
      </div>
    </div>
  );
}
