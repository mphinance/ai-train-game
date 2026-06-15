// SKELETON, pre-staged by Wave 1. Agent D/epub-agent (Wave 4) owns the real implementation.
//
// Contract:
//   INPUT : content/chapters/*.md, sorted by frontmatter `order`.
//   OUTPUT: public/downloads/practical-ai.epub  (a valid epub of all chapters in order).
//   RULES : strip web-only directives (lines equal to "::practice::"); strip frontmatter;
//           use the chapter `title` as the section heading; include book metadata
//           (title "Practical AI", author "Michael Hanko") and a simple cover.
//           NO em dashes introduced in any generated text.
//
// Implementation options (Agent to choose):
//   A) pure Node: marked (md -> html) + a small epub writer (e.g. epub-gen-memory or jszip).
//   B) pandoc in CI: the GitHub Action installs pandoc and runs it; npm run epub shells out.
// Deterministic where possible. Run via: npm run epub

import { readdirSync, readFileSync, mkdirSync } from 'node:fs';

const CHAPTERS = new URL('../content/chapters/', import.meta.url);
const OUT_DIR = new URL('../public/downloads/', import.meta.url);

function readChaptersInOrder() {
  const files = readdirSync(CHAPTERS).filter((f) => f.endsWith('.md'));
  return files
    .map((f) => {
      const raw = readFileSync(new URL(f, CHAPTERS), 'utf8');
      const order = Number(/^order:\s*(\d+)/m.exec(raw)?.[1] ?? 999);
      const title = (/^title:\s*(.+)$/m.exec(raw)?.[1] ?? f).trim();
      return { file: f, order, title, raw };
    })
    .sort((a, b) => a.order - b.order);
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const chapters = readChaptersInOrder();
  console.log(`build-epub skeleton: found ${chapters.length} chapters.`);
  console.log('TODO (Wave 4): convert to public/downloads/practical-ai.epub.');
  // Agent: implement md -> epub here per the contract above.
}

main();
