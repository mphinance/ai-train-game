// SKELETON, pre-staged by Wave 1. Agent C owns the real implementation.
//
// Contract:
//   INPUT : ../ai-cookbook (the gathered library; read PROVIDERS.md + the distilled
//           catalogs: apps.md, capabilities.md, gemini.md, tips-and-tricks.md, and the
//           "use it when (Anyone)" examples). Source of real-life AI uses + prompts.
//   OUTPUT: content/cookbook.json — an array of:
//           { goal: string, title: string, prompt: string, source: string }
//           where `goal` is a real-life bucket (writing, cooking, business, parenting,
//           learning, money, coding, travel, fitness, creative), `prompt` is a copy-able
//           starter prompt, and `source` cites which cookbook/provider it came from.
//
// Must be deterministic and offline. Run via: npm run gen-cookbook
// Target: at least 30 entries spread across goals.

import { writeFileSync } from 'node:fs';

const OUT = new URL('../content/cookbook.json', import.meta.url);

function build() {
  // TODO (Agent C): read ../ai-cookbook and assemble entries.
  return [];
}

const entries = build();
if (entries.length > 0) {
  writeFileSync(OUT, JSON.stringify(entries, null, 2) + '\n');
  console.log(`wrote ${entries.length} entries to content/cookbook.json`);
} else {
  console.log('skeleton: no entries generated yet (Agent C to implement); leaving cookbook.json as-is');
}
