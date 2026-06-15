// STUB, pre-staged by Wave 1. Agent B (Prompt Gym) owns the real implementation:
// a standalone list of >=6 practice drills, each rendered via <PracticeBox> with its
// own require[] target signals. Drills can be drawn from chapter gym specs + extras.
import PracticeBox from '../components/PracticeBox';
import type { PracticeSpec } from '../content/types';

const DRILLS: PracticeSpec[] = [
  { brief: 'Add a role and an audience to this prompt.', starter: 'explain taxes', require: ['role', 'audience'] },
];

export default function Gym() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl">Prompt Gym</h1>
      <p className="mb-6 text-ink-soft">Short drills. Instant feedback. No account, no scores to chase.</p>
      {DRILLS.map((d, i) => (
        <PracticeBox key={i} spec={d} />
      ))}
    </div>
  );
}
