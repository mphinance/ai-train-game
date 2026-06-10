// Badge catalog. Playful copy, no em dashes. icon is a single emoji or short string.

import type { Badge } from './types';

export const BADGES: Badge[] = [
  {
    id: 'first-win',
    label: 'First Light',
    desc: 'You scored your first prompt. The grid lights up.',
    icon: '✨',
  },
  {
    id: 'elite-prompt',
    label: 'Mind Meld',
    desc: 'You wrote an elite prompt. The AI basically read your mind.',
    icon: '🧠',
  },
  {
    id: 'all-modes',
    label: 'Grid Runner',
    desc: 'You tried all four modes. Full map unlocked.',
    icon: '🗺️',
  },
  {
    id: 'streak-3',
    label: 'On A Roll',
    desc: 'Three days in a row. The streak is real.',
    icon: '🔥',
  },
  {
    id: 'deck-10',
    label: 'Deck Diver',
    desc: 'You worked through ten Did-You-Know cards.',
    icon: '🃏',
  },
  {
    id: 'first-forge',
    label: 'Idea Spark',
    desc: 'You fired up the Idea Forge for the first time.',
    icon: '💡',
  },
  {
    id: 'mind-reader',
    label: 'Say What You Mean',
    desc: 'You closed the gap in Mind Reader and nailed the goal.',
    icon: '🎯',
  },
  {
    id: 'level-5',
    label: 'Ascendant',
    desc: 'You reached level five. The program respects you now.',
    icon: '⚡',
  },
];

const BY_ID = new Map<string, Badge>(BADGES.map((b) => [b.id, b]));

export function badgeById(id: string): Badge | undefined {
  return BY_ID.get(id);
}
