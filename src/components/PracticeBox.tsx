// PracticeBox: live-feedback prompt editor. Scores the prompt on every keystroke
// using the rubric engine and shows signal chips, a score, and the top fix.
// Prop signature is frozen. ChapterReader and Gym both render this component.
// NO EM DASHES anywhere in this file.

import { useState } from 'react';
import type { PracticeSpec } from '../content/types';
import type { SignalResult } from '../engine/types';
import { scorePrompt } from '../engine/rubric';

// Tier label copy, calm and instructive, not gamified.
const TIER_LABELS: Record<string, string> = {
  weak:   'Weak',
  okay:   'Getting there',
  strong: 'Strong',
  elite:  'Elite',
};

// Tier color classes using theme tokens only.
const TIER_COLORS: Record<string, string> = {
  weak:   'text-rose',
  okay:   'text-orange',
  strong: 'text-lime',
  elite:  'text-cyan',
};

function SignalChip({
  sig,
  emphasized,
}: {
  sig: SignalResult;
  emphasized: boolean;
}) {
  const base =
    'inline-flex flex-col gap-0.5 rounded-md border px-2.5 py-1.5 text-xs leading-tight transition-colors duration-150';

  const present = sig.present;
  const chip = present
    ? emphasized
      ? `${base} border-lime bg-lime/10 text-lime`
      : `${base} border-lime/60 bg-lime/5 text-lime`
    : emphasized
    ? `${base} border-edge bg-void text-ink font-medium`
    : `${base} border-edge/40 bg-void text-ink-faint`;

  return (
    <li className={chip} role="status" aria-label={`${sig.label}: ${present ? 'present' : 'missing'}`}>
      <span className="flex items-center gap-1">
        {present ? (
          <span aria-hidden="true" className="text-lime font-bold">&#10003;</span>
        ) : (
          <span aria-hidden="true" className="text-ink-faint">&#9675;</span>
        )}
        <span className={present ? 'font-medium' : ''}>{sig.label}</span>
        {emphasized && !present && (
          <span className="ml-0.5 text-orange font-bold" aria-label="required for this drill">*</span>
        )}
      </span>
      {sig.evidence && (
        <span className="mt-0.5 text-[10px] opacity-70 leading-snug max-w-[160px]">
          {sig.evidence}
        </span>
      )}
    </li>
  );
}

export default function PracticeBox({ spec }: { spec?: PracticeSpec }) {
  const [prompt, setPrompt] = useState(spec?.starter ?? '');

  const result = scorePrompt(
    prompt,
    spec?.require?.length ? { require: spec.require } : undefined,
  );

  const requireSet = new Set(spec?.require ?? []);
  const hasRequire = requireSet.size > 0;

  const tierLabel = TIER_LABELS[result.tier] ?? result.tier;
  const tierColor = TIER_COLORS[result.tier] ?? 'text-ink-soft';

  return (
    <div className="panel my-6 p-5 flex flex-col gap-4">
      {/* Brief */}
      {spec?.brief && (
        <p className="text-sm text-ink-soft leading-relaxed">{spec.brief}</p>
      )}

      {/* Textarea */}
      <textarea
        className="w-full rounded-lg border border-edge bg-void p-3 font-mono text-sm text-ink leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        aria-label={spec?.brief ? `Practice prompt: ${spec.brief}` : 'Practice prompt'}
        placeholder="Type your prompt here..."
        spellCheck={false}
      />

      {/* Score row */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className={`font-display text-4xl font-bold tabular-nums ${tierColor}`}
          aria-label={`Score: ${result.score} out of 100`}
        >
          {result.score}
        </span>
        <span className={`font-display text-lg font-semibold ${tierColor}`}>{tierLabel}</span>
        <span className="text-xs text-ink-faint self-center">/ 100</span>
        {result.topFix && (
          <span className="ml-auto text-sm text-ink-soft italic">
            Next: {result.topFix}
          </span>
        )}
      </div>

      {/* Signal chips */}
      <div>
        {hasRequire && (
          <p className="mb-2 text-xs text-ink-faint">
            Signals marked <span className="text-orange font-bold">*</span> are required for this drill.
          </p>
        )}
        <ul
          className="flex flex-wrap gap-2 list-none p-0 m-0"
          aria-label="Rubric signals"
        >
          {result.signals.map((sig) => (
            <SignalChip
              key={sig.key}
              sig={sig}
              emphasized={hasRequire ? requireSet.has(sig.key) : true}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
