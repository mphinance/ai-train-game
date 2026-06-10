// The Taste Engine. A silent profiler. It never asks the player anything.
// It watches in-game choices (topics picked, cards engaged) and maintains a
// weighted interest-tag profile in storage.

import type { InterestTag, TasteProfile } from './types';
import { loadJSON, saveJSON, removeKey } from './storage';

const TASTE_KEY = 'taste';

// The fixed tag vocabulary. Order here is the deterministic tie-break order.
export const INTEREST_TAGS: InterestTag[] = [
  'cooking', 'writing', 'coding', 'parenting', 'fitness',
  'business', 'travel', 'study', 'creative', 'money',
];

const TAG_SET = new Set<InterestTag>(INTEREST_TAGS);

function freshProfile(): TasteProfile {
  const profile = {} as TasteProfile;
  for (const tag of INTEREST_TAGS) profile[tag] = 0;
  return profile;
}

function normalize(raw: Partial<TasteProfile> | null | undefined): TasteProfile {
  const profile = freshProfile();
  if (raw) {
    for (const tag of INTEREST_TAGS) {
      const value = raw[tag];
      if (typeof value === 'number' && Number.isFinite(value)) profile[tag] = value;
    }
  }
  return profile;
}

export function getTasteProfile(): TasteProfile {
  return normalize(loadJSON<Partial<TasteProfile>>(TASTE_KEY, freshProfile()));
}

export function recordInterest(tags: InterestTag[], weight = 1): TasteProfile {
  const profile = getTasteProfile();
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      // Unknown tags (not in the vocabulary) are ignored safely.
      if (TAG_SET.has(tag)) profile[tag] += weight;
    }
  }
  saveJSON(TASTE_KEY, profile);
  return profile;
}

export function topInterests(n = 3): InterestTag[] {
  const profile = getTasteProfile();
  // Highest weight first. Deterministic tie-break by tag vocabulary order.
  const ranked = [...INTEREST_TAGS].sort((a, b) => {
    const diff = profile[b] - profile[a];
    if (diff !== 0) return diff;
    return INTEREST_TAGS.indexOf(a) - INTEREST_TAGS.indexOf(b);
  });
  const count = Math.max(0, Math.min(n, ranked.length));
  return ranked.slice(0, count);
}

export function resetTaste(): void {
  removeKey(TASTE_KEY);
}
