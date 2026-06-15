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

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { EPub as Epub } from 'epub-gen-memory';

const CHAPTERS_URL = new URL('../content/chapters/', import.meta.url);
const OUT_DIR_URL = new URL('../public/downloads/', import.meta.url);
const OUT_FILE = fileURLToPath(new URL('practical-ai.epub', OUT_DIR_URL));

function stripFrontmatter(raw) {
  // Remove YAML frontmatter block delimited by ---
  const match = raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*/);
  if (match) {
    return raw.slice(match[0].length);
  }
  return raw;
}

function stripPracticeDirectives(text) {
  // Remove any line that is exactly "::practice::" (trimmed)
  return text
    .split('\n')
    .filter((line) => line.trim() !== '::practice::')
    .join('\n');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (!match) return {};
  const block = match[1];
  const result = {};
  for (const line of block.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      const key = kv[1].trim();
      const val = kv[2].trim();
      result[key] = val;
    }
  }
  return result;
}

function readChaptersInOrder() {
  const chaptersDir = fileURLToPath(CHAPTERS_URL);
  const files = readdirSync(chaptersDir).filter((f) => f.endsWith('.md'));
  return files
    .map((f) => {
      const raw = readFileSync(new URL(f, CHAPTERS_URL), 'utf8');
      const fm = parseFrontmatter(raw);
      const order = Number(fm.order ?? 999);
      const title = (fm.title ?? f).replace(/^['"]|['"]$/g, '').trim();
      const bodyWithFm = stripFrontmatter(raw);
      const body = stripPracticeDirectives(bodyWithFm);
      return { file: f, order, title, body };
    })
    .sort((a, b) => a.order - b.order);
}

async function main() {
  mkdirSync(fileURLToPath(OUT_DIR_URL), { recursive: true });

  const chapters = readChaptersInOrder();
  console.log(`build-epub: found ${chapters.length} chapters.`);
  chapters.forEach((c) => console.log(`  [${c.order}] ${c.title}`));

  // Verify no ::practice:: leaked through
  for (const c of chapters) {
    const hasPractice = c.body.split('\n').some((l) => l.trim() === '::practice::');
    if (hasPractice) {
      throw new Error(`::practice:: not stripped from chapter: ${c.file}`);
    }
  }

  // Build epub content array: one section per chapter
  // epub-gen-memory expects { title, content } per chapter (content = HTML string)
  const content = chapters.map((c) => {
    // marked() converts markdown to HTML
    const html = marked.parse(c.body, { async: false });
    return {
      title: c.title,
      content: `<h1>${c.title}</h1>\n${html}`,
    };
  });

  const options = {
    title: 'Practical AI',
    author: 'Michael Hanko',
    publisher: 'Mphinance',
    lang: 'en',
    tocTitle: 'Contents',
    appendChapterTitles: false, // we already prepend h1 in data
  };

  console.log('build-epub: generating epub...');
  // EPub(options, content) -> instance; call .genEpub() to get a Buffer
  const epub = new Epub(options, content);
  const epubBuffer = await epub.genEpub();

  writeFileSync(OUT_FILE, epubBuffer);
  const size = epubBuffer.length;
  console.log(`build-epub: wrote ${OUT_FILE}`);
  console.log(`build-epub: epub size = ${size} bytes (${(size / 1024).toFixed(1)} KB)`);

  if (size < 5000) {
    throw new Error(`epub suspiciously small (${size} bytes) -- build likely failed.`);
  }

  console.log('build-epub: done.');
}

main().catch((err) => {
  console.error('build-epub ERROR:', err);
  process.exit(1);
});
