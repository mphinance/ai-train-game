// Public engine surface. Screens import from '../engine'.

// Types
export type {
  SignalKey,
  SignalResult,
  Tier,
  RubricResult,
  InterestTag,
  TasteProfile,
  Badge,
  ProgressState,
  IngredientKey,
  GlowUpLevel,
  MindReaderGoal,
  DeckCard,
  IdeaCard,
} from './types';

// Storage
export { loadJSON, saveJSON, removeKey } from './storage';

// Rubric
export { scorePrompt } from './rubric';

// Taste
export {
  recordInterest,
  topInterests,
  getTasteProfile,
  resetTaste,
  INTEREST_TAGS,
} from './taste';

// Progress
export {
  getProgress,
  addXp,
  recordPlay,
  unlockBadge,
  levelForXp,
  xpForLevel,
  resetProgress,
  subscribeProgress,
} from './progress';

// Badges
export { BADGES, badgeById } from './badges';

// Hooks
export { useProgress, useTaste } from './hooks';
