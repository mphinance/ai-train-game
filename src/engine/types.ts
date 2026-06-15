// Shared engine types. NO EM DASHES anywhere in this codebase.
// Use periods, commas, or "and".

export type SignalKey =
  | 'role' | 'context' | 'audience' | 'format' | 'constraints'
  | 'examples' | 'tone' | 'specificity' | 'stepwise' | 'lengthFit';

export interface SignalResult {
  key: SignalKey;
  label: string;        // human label, e.g. "Role"
  present: boolean;
  weight: number;       // contribution to score, 0..1 summing roughly to 1 across signals
  tip: string;          // short, NO EM DASHES. e.g. "Tell it who to be."
  evidence?: string;    // optional transparency: why a signal lit, or what to add. NO EM DASHES.
}

export type Tier = 'weak' | 'okay' | 'strong' | 'elite';

export interface RubricResult {
  score: number;            // 0..100, deterministic
  tier: Tier;
  signals: SignalResult[];
  topFix: string | null;    // single highest-impact missing signal's tip, or null if elite
}
