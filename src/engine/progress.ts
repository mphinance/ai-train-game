// Progression: XP, level, streak, badges, per-mode completion. Persisted to
// storage. Single source of truth for the HUD. Includes a pub/sub so the HUD
// can live-update without a reload.

import type { ProgressState } from './types';
import { loadJSON, saveJSON, removeKey } from './storage';

const PROGRESS_KEY = 'progress';

function freshState(): ProgressState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayedDay: null,
    badges: [],
    completed: {},
  };
}

function normalize(raw: Partial<ProgressState> | null | undefined): ProgressState {
  const base = freshState();
  if (!raw) return base;
  const xp = typeof raw.xp === 'number' && Number.isFinite(raw.xp) && raw.xp > 0 ? raw.xp : 0;
  return {
    xp,
    level: levelForXp(xp),
    streak: typeof raw.streak === 'number' && raw.streak >= 0 ? raw.streak : 0,
    lastPlayedDay: typeof raw.lastPlayedDay === 'string' ? raw.lastPlayedDay : null,
    badges: Array.isArray(raw.badges) ? raw.badges.filter((b) => typeof b === 'string') : [],
    completed:
      raw.completed && typeof raw.completed === 'object'
        ? sanitizeCompleted(raw.completed)
        : {},
  };
}

function sanitizeCompleted(raw: Record<string, unknown>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const modeId of Object.keys(raw)) {
    const list = raw[modeId];
    if (Array.isArray(list)) out[modeId] = list.filter((x) => typeof x === 'string');
  }
  return out;
}

// ----- level curve -----
// Cumulative XP needed to reach a level. Level 1 starts at 0 xp. The step from
// level n to n+1 costs 100*n, so cumulative for level L is 100 * (L-1) * L / 2.
export function xpForLevel(level: number): number {
  const lvl = Math.max(1, Math.floor(level));
  return (100 * (lvl - 1) * lvl) / 2;
}

export function levelForXp(xp: number): number {
  const safeXp = Number.isFinite(xp) && xp > 0 ? xp : 0;
  let level = 1;
  while (xpForLevel(level + 1) <= safeXp) level += 1;
  return level;
}

// ----- pub/sub -----
type Listener = (state: ProgressState) => void;
const listeners = new Set<Listener>();

export function subscribeProgress(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function persistAndNotify(state: ProgressState): ProgressState {
  saveJSON(PROGRESS_KEY, state);
  for (const fn of listeners) {
    try {
      fn(state);
    } catch {
      // A misbehaving subscriber must not break the engine.
    }
  }
  return state;
}

// ----- public API -----
export function getProgress(): ProgressState {
  return normalize(loadJSON<Partial<ProgressState>>(PROGRESS_KEY, freshState()));
}

export function addXp(amount: number): ProgressState {
  const state = getProgress();
  const add = Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  state.xp += add;
  state.level = levelForXp(state.xp);
  return persistAndNotify(state);
}

function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dayDiff(from: string, to: string): number | null {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86400000);
}

export function recordPlay(
  modeId: string,
  itemId: string,
  opts?: { day?: string },
): ProgressState {
  const state = getProgress();
  const day = opts?.day ?? todayLocal();

  // Track completion, deduped per mode.
  if (!state.completed[modeId]) state.completed[modeId] = [];
  if (!state.completed[modeId].includes(itemId)) state.completed[modeId].push(itemId);

  // Streak logic against the last played day.
  if (state.lastPlayedDay == null) {
    state.streak = 1;
  } else {
    const diff = dayDiff(state.lastPlayedDay, day);
    if (diff === 0) {
      // Same day. Streak unchanged. Keep at least 1.
      if (state.streak < 1) state.streak = 1;
    } else if (diff === 1) {
      state.streak += 1;
    } else {
      // A gap (or a backwards/invalid day). Reset to a fresh streak of 1.
      state.streak = 1;
    }
  }
  state.lastPlayedDay = day;

  return persistAndNotify(state);
}

export function unlockBadge(id: string): ProgressState {
  const state = getProgress();
  if (typeof id === 'string' && id.length > 0 && !state.badges.includes(id)) {
    state.badges.push(id);
  }
  return persistAndNotify(state);
}

export function resetProgress(): void {
  removeKey(PROGRESS_KEY);
  const fresh = freshState();
  for (const fn of listeners) {
    try {
      fn(fresh);
    } catch {
      // ignore
    }
  }
}
