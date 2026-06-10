// Shared engine types. Wave 1 owns this file. Later waves import these names.
// NO EM DASHES anywhere in this codebase. Use periods, commas, or "and".

export type SignalKey =
  | 'role' | 'context' | 'audience' | 'format' | 'constraints'
  | 'examples' | 'tone' | 'specificity' | 'stepwise' | 'lengthFit';

export interface SignalResult {
  key: SignalKey;
  label: string;        // human label, e.g. "Role"
  present: boolean;
  weight: number;       // contribution to score, 0..1 summing roughly to 1 across signals
  tip: string;          // short, playful, NO EM DASHES. e.g. "Tell it who to be."
}

export type Tier = 'weak' | 'okay' | 'strong' | 'elite';

export interface RubricResult {
  score: number;            // 0..100, deterministic
  tier: Tier;
  signals: SignalResult[];
  topFix: string | null;    // single highest-impact missing signal's tip, or null if elite
}

export type InterestTag =
  | 'cooking' | 'writing' | 'coding' | 'parenting' | 'fitness'
  | 'business' | 'travel' | 'study' | 'creative' | 'money';

export type TasteProfile = Record<InterestTag, number>;

export interface Badge { id: string; label: string; desc: string; icon: string }

export interface ProgressState {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDay: string | null;   // 'YYYY-MM-DD'
  badges: string[];               // unlocked badge ids
  completed: Record<string, string[]>; // modeId -> itemIds completed
}

// Content schema types (used by later waves; define them now so screens can import)
export type IngredientKey =
  | 'role' | 'context' | 'audience' | 'format' | 'constraints' | 'examples' | 'tone';

export interface GlowUpLevel {
  id: string; topic: string; tags: InterestTag[];
  lazyPrompt: string; weakOutput: string;
  ingredients: { key: IngredientKey; label: string; text: string; improvedOutput: string }[];
  winScore: number;
}

export interface MindReaderGoal {
  id: string; tags: InterestTag[];
  brief: string;                 // the secret goal shown to player
  requirements: string[];        // specifics the prompt must mention (lowercase keywords/phrases)
  literalReply: string;          // the deliberately-too-literal reply when reqs are missing
  satisfiedReply: string;        // the good reply when all reqs are present
}

export interface DeckCard {
  id: string; title: string; tags: InterestTag[];
  front: string;                 // teaser
  reveal: string;                // the unexpected use explained
  challenge: string;             // the 30s micro-challenge prompt-writing task
}

export interface IdeaCard { id: string; tags: InterestTag[]; title: string; body: string }
