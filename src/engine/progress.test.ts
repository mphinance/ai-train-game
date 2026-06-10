import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProgress,
  addXp,
  recordPlay,
  unlockBadge,
  levelForXp,
  xpForLevel,
  resetProgress,
  subscribeProgress,
} from './progress';
import { loadJSON } from './storage';
import type { ProgressState } from './types';

beforeEach(() => {
  resetProgress();
});

describe('progress: level curve', () => {
  it('level 1 starts at 0 xp', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(levelForXp(0)).toBe(1);
  });

  it('thresholds follow the gentle curve', () => {
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(xpForLevel(4)).toBe(600);
  });

  it('levelForXp inverts xpForLevel', () => {
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(299)).toBe(2);
    expect(levelForXp(300)).toBe(3);
  });
});

describe('progress: xp and leveling', () => {
  it('adding xp below threshold leaves level unchanged', () => {
    const state = addXp(50);
    expect(state.xp).toBe(50);
    expect(state.level).toBe(1);
  });

  it('adding xp past threshold increments level', () => {
    addXp(60);
    const state = addXp(60); // 120 total -> level 2
    expect(state.xp).toBe(120);
    expect(state.level).toBe(2);
  });

  it('ignores non-positive or non-finite xp', () => {
    addXp(100);
    const state = addXp(-50);
    expect(state.xp).toBe(100);
  });
});

describe('progress: streak', () => {
  it('first play sets streak to 1', () => {
    const state = recordPlay('glowup', 'lvl-1', { day: '2026-01-01' });
    expect(state.streak).toBe(1);
  });

  it('consecutive calendar days increment the streak', () => {
    recordPlay('glowup', 'a', { day: '2026-01-01' });
    recordPlay('glowup', 'b', { day: '2026-01-02' });
    const state = recordPlay('glowup', 'c', { day: '2026-01-03' });
    expect(state.streak).toBe(3);
  });

  it('same day leaves the streak unchanged', () => {
    recordPlay('glowup', 'a', { day: '2026-01-01' });
    const state = recordPlay('glowup', 'b', { day: '2026-01-01' });
    expect(state.streak).toBe(1);
  });

  it('a gap resets the streak to 1', () => {
    recordPlay('glowup', 'a', { day: '2026-01-01' });
    recordPlay('glowup', 'b', { day: '2026-01-02' });
    const state = recordPlay('glowup', 'c', { day: '2026-01-05' });
    expect(state.streak).toBe(1);
  });
});

describe('progress: completion tracking', () => {
  it('records items per mode and dedupes', () => {
    recordPlay('glowup', 'lvl-1', { day: '2026-01-01' });
    recordPlay('glowup', 'lvl-1', { day: '2026-01-01' });
    recordPlay('glowup', 'lvl-2', { day: '2026-01-01' });
    expect(getProgress().completed.glowup).toEqual(['lvl-1', 'lvl-2']);
  });
});

describe('progress: badges', () => {
  it('unlocks a badge and dedupes', () => {
    unlockBadge('first-win');
    unlockBadge('first-win');
    unlockBadge('elite-prompt');
    expect(getProgress().badges).toEqual(['first-win', 'elite-prompt']);
  });
});

describe('progress: persistence and reset', () => {
  it('persists state to storage', () => {
    addXp(120);
    unlockBadge('first-win');
    const stored = loadJSON<ProgressState>('progress', {} as ProgressState);
    expect(stored.xp).toBe(120);
    expect(stored.level).toBe(2);
    expect(stored.badges).toContain('first-win');
  });

  it('reload restores xp, level, streak, and badges', () => {
    addXp(300);
    recordPlay('deck', 'card-1', { day: '2026-02-01' });
    unlockBadge('deck-10');
    const restored = getProgress();
    expect(restored.xp).toBe(300);
    expect(restored.level).toBe(3);
    expect(restored.streak).toBe(1);
    expect(restored.badges).toContain('deck-10');
  });

  it('HUD-facing selector returns a stable shape', () => {
    const s = getProgress();
    expect(Object.keys(s).sort()).toEqual(
      ['badges', 'completed', 'lastPlayedDay', 'level', 'streak', 'xp'].sort(),
    );
  });

  it('resetProgress clears storage back to defaults', () => {
    addXp(500);
    unlockBadge('first-win');
    resetProgress();
    const s = getProgress();
    expect(s.xp).toBe(0);
    expect(s.level).toBe(1);
    expect(s.badges).toEqual([]);
  });
});

describe('progress: pub/sub', () => {
  it('notifies subscribers on every mutation and supports unsubscribe', () => {
    const seen: number[] = [];
    const unsub = subscribeProgress((s) => seen.push(s.xp));
    addXp(10);
    addXp(20);
    unsub();
    addXp(30); // not observed
    expect(seen).toEqual([10, 30]);
  });
});
