// Chapter loader. Pure, deterministic, offline. Reads all Markdown chapters at build
// time via Vite's import.meta.glob, parses a small, fixed frontmatter schema, and
// returns chapters sorted by `order`. No network, no Date, no randomness.

import type { Chapter, PracticeSpec } from './types';
import type { SignalKey } from '../engine/types';

// Eagerly inline every chapter's raw text. Vite resolves this glob at build time.
const RAW = import.meta.glob('/content/chapters/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Parse an inline array like "[a, b, c]" into trimmed string parts.
function parseInlineArray(value: string): string[] {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!inner.trim()) return [];
  return inner
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

// Purpose-built parser for our fixed frontmatter schema. Supports top-level scalars,
// inline arrays (tags, require), and a single nested `gym:` block with brief/starter/
// require. Deterministic and dependency-free, which keeps the site shippable offline.
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const [, fm, body] = match;
  const data: Record<string, unknown> = {};
  const lines = fm.split(/\r?\n/);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    // Nested gym block: "gym:" followed by indented keys.
    if (/^gym:\s*$/.test(line)) {
      const gym: Record<string, unknown> = {};
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        const sub = lines[i].trim();
        const idx = sub.indexOf(':');
        if (idx > -1) {
          const k = sub.slice(0, idx).trim();
          const v = sub.slice(idx + 1).trim();
          gym[k] = v.startsWith('[') ? parseInlineArray(v) : stripQuotes(v);
        }
        i++;
      }
      data.gym = gym;
      continue;
    }
    const idx = line.indexOf(':');
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (value.startsWith('[')) data[key] = parseInlineArray(value);
      else if (/^\d+$/.test(value)) data[key] = Number(value);
      else data[key] = stripQuotes(value);
    }
    i++;
  }
  return { data, body: body ?? '' };
}

function toChapter(path: string, raw: string): Chapter {
  const { data, body } = parseFrontmatter(raw);
  const slugFromPath = path.split('/').pop()!.replace(/\.md$/, '').replace(/^\d+-/, '');
  const gymData = data.gym as Record<string, unknown> | undefined;
  const gym: PracticeSpec | undefined = gymData
    ? {
        brief: String(gymData.brief ?? ''),
        starter: String(gymData.starter ?? ''),
        require: ((gymData.require as string[]) ?? []) as SignalKey[],
      }
    : undefined;

  return {
    order: typeof data.order === 'number' ? data.order : 999,
    slug: String(data.slug ?? slugFromPath),
    title: String(data.title ?? slugFromPath),
    summary: String(data.summary ?? ''),
    tags: (data.tags as string[]) ?? [],
    gym,
    body: body.trim(),
  };
}

let cache: Chapter[] | null = null;

export function loadChapters(): Chapter[] {
  if (cache) return cache;
  cache = Object.entries(RAW)
    .map(([path, raw]) => toChapter(path, raw))
    .sort((a, b) => a.order - b.order);
  return cache;
}

export function getChapter(slug: string): Chapter | undefined {
  return loadChapters().find((c) => c.slug === slug);
}
