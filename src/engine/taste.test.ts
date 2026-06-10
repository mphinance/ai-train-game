import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordInterest,
  topInterests,
  getTasteProfile,
  resetTaste,
  INTEREST_TAGS,
} from './taste';
import type { InterestTag } from './types';
import { loadJSON } from './storage';

beforeEach(() => {
  resetTaste();
});

describe('taste: fresh profile', () => {
  it('starts every tag at zero', () => {
    const profile = getTasteProfile();
    for (const tag of INTEREST_TAGS) expect(profile[tag]).toBe(0);
  });

  it('topInterests on a fresh profile returns sensible defaults in vocabulary order', () => {
    expect(topInterests(3)).toEqual(['cooking', 'writing', 'coding']);
  });
});

describe('taste: recording events', () => {
  it('records an interest and increases its weight', () => {
    recordInterest(['cooking']);
    expect(getTasteProfile().cooking).toBe(1);
    recordInterest(['cooking']);
    expect(getTasteProfile().cooking).toBe(2);
  });

  it('topInterests returns the most-recorded tag first', () => {
    recordInterest(['cooking']);
    recordInterest(['cooking']);
    recordInterest(['writing']);
    expect(topInterests(1)).toEqual(['cooking']);
    expect(topInterests(2)).toEqual(['cooking', 'writing']);
  });

  it('respects a custom weight', () => {
    recordInterest(['fitness'], 5);
    expect(getTasteProfile().fitness).toBe(5);
  });

  it('records multiple tags in one call', () => {
    recordInterest(['coding', 'business']);
    expect(getTasteProfile().coding).toBe(1);
    expect(getTasteProfile().business).toBe(1);
  });
});

describe('taste: persistence', () => {
  it('persists to storage and a re-read restores the profile', () => {
    recordInterest(['travel']);
    recordInterest(['travel']);
    // Simulate a reload by reading the raw stored value via storage directly.
    const stored = loadJSON<Record<string, number>>('taste', {});
    expect(stored.travel).toBe(2);
    // And the public getter restores the same shape.
    expect(getTasteProfile().travel).toBe(2);
  });
});

describe('taste: safety', () => {
  it('ignores unknown tags safely', () => {
    recordInterest(['nonsense' as unknown as InterestTag, 'cooking']);
    const profile = getTasteProfile();
    expect(profile.cooking).toBe(1);
    expect((profile as Record<string, number>).nonsense).toBeUndefined();
  });

  it('topInterests respects n and never returns more than the vocabulary', () => {
    expect(topInterests(0)).toEqual([]);
    expect(topInterests(3)).toHaveLength(3);
    expect(topInterests(999)).toHaveLength(INTEREST_TAGS.length);
  });

  it('ties break deterministically by vocabulary order', () => {
    recordInterest(['money']);
    recordInterest(['cooking']);
    // Both weight 1. cooking precedes money in the vocabulary, so it comes first.
    expect(topInterests(2)).toEqual(['cooking', 'money']);
  });
});
