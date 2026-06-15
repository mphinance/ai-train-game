// Loads content/cookbook.json via Vite's raw glob so we avoid resolveJsonModule and
// keep the TS program rooted in src. Deterministic, offline. Wave 1 owns this loader;
// Agent C owns the data file (content/cookbook.json) and its generator.

import type { CookbookEntry } from './types';

const RAW = import.meta.glob('/content/cookbook.json', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadCookbook(): CookbookEntry[] {
  const raw = Object.values(RAW)[0] ?? '[]';
  try {
    return JSON.parse(raw) as CookbookEntry[];
  } catch {
    return [];
  }
}

export function cookbookGoals(): string[] {
  return Array.from(new Set(loadCookbook().map((e) => e.goal))).sort();
}
