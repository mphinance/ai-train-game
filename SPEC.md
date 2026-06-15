# SPEC — Practical AI

> The canonical spec. Every subagent reads this. Companion: `BUILD_PLAN.md` (waves + file ownership).

## Product
**Practical AI** — a serious, hands-on, interactive guide that teaches a smart adult to actually use
AI well. It fills the gap between "bad at AI / won't read docs" and formal Skilljar/Anthropic
certification. Engaging but adult: no game, no XP, no badges, no mascot.

This is a **pivot of the existing `ai-train-game` repo** (live at
https://mphinance.github.io/ai-train-game/). Reuse the repo so the URL and Pages deploy stay put. The
repo folder name stays `ai-train-game`; only the product name/title/epub become "Practical AI".

## Three layers, one product
1. **Field Guide (spine)** — chapters rendered from Markdown. Routes `/` (home/TOC) + `/guide/:slug`.
2. **Prompt Gym (inside)** — rubric-driven practice. Inline in chapters via a `::practice::` directive
   AND a standalone `/gym`. Reuses `src/engine/rubric.ts` untouched.
3. **Cookbook Browser (go deeper)** — searchable browse over the gathered `../ai-cookbook` library by
   real-life goal, each with a copy-able starter prompt. Routes `/cookbook`.

## Dual output (CRITICAL)
Chapters are authored ONCE as portable Markdown in `content/chapters/*.md` and emitted to TWO surfaces:
(1) the interactive web guide, and (2) a downloadable **epub** at `public/downloads/practical-ai.epub`
for Substack readers. Same words, two outputs. Web-only directives (`::practice::`) are stripped in the
epub build.

## Stack (unchanged)
Vite 8 · React 19 · TypeScript · Tailwind v4 (token theme) · react-router (HashRouter). 100%
client-side, offline, zero API keys, zero runtime network calls. Deploys static to GitHub Pages.

## Voice & style rules (enforce in all copy + chapters)
- **NO EM DASHES anywhere.** Use periods, commas, or "and". Non-negotiable (Michael's voice).
- No markdown tables in chapter prose meant for the epub (they render poorly); use lists or prose.
- Adult, confident, practical, lightly warm. Like a good O'Reilly book that happens to be interactive.
  Never kiddish. If a line feels like a game or a textbook, rewrite it.

## Keep / Kill
- **KEEP:** `src/engine/rubric.ts`, `src/engine/types.ts`, `src/engine/storage.ts` (repurpose for
  reading position, NOT XP). Vite/React/TS/Tailwind. `.github/workflows/deploy.yml`. `vite.config.ts`
  (`base: './'`).
- **KILL:** `src/engine/{badges,progress}.ts`; `src/components/hud/Hud.tsx`;
  `src/components/Onboarding.tsx`; `src/screens/{Hub,GlowUp,MindReader,DeckMode,Badges,IdeaForge}.tsx`;
  `src/data/{deck,ideas,mindreader,glowup}.ts`; arcade theme token VALUES (reskin to editorial).

## Wave-1 contracts (frozen; later waves depend on these)
- **Content schema** `src/content/types.ts`: `Chapter { order, slug, title, summary, tags, gym?, body }`
  and `PracticeSpec { brief, starter, require: SignalKey[] }` (SignalKey from `engine/types.ts`).
- **Loader** `src/content/loader.ts`: `loadChapters(): Chapter[]` via
  `import.meta.glob('/content/chapters/*.md', { query: '?raw', import: 'default', eager: true })`,
  parse YAML-ish frontmatter, sort by `order`. Deterministic, offline.
- **Practice directive:** a line containing only `::practice::` in a chapter body renders that chapter's
  `<PracticeBox spec={chapter.gym}/>` inline. The Markdown renderer splits on it.
- **Rubric API (already exists):** `scorePrompt(prompt: string, { require?: SignalKey[] }): RubricResult`.
- **Route table** `src/App.tsx`: `/` GuideHome, `/guide/:slug` ChapterReader, `/gym` Gym, `/cookbook`
  Cookbook, `*` → GuideHome. Orchestrator pre-stages App.tsx with stub imports so Wave-3 agents never
  touch it.
- **Theme** `src/index.css`: KEEP all `--color-*`/`--font-*` token NAMES; swap VALUES to an editorial
  palette + serious fonts. Components must not need changes.

## Acceptance (see feature_list.json for the full list)
Builds clean, all rubric tests pass, every route renders, chapters load from Markdown, `::practice::`
yields a working live-scored PracticeBox, Gym has practice drills, Cookbook filters by goal with
copy-prompt, the epub downloads and opens with all chapters, NO game artifacts remain, no em dashes in
shipped copy, responsive to 375px, zero runtime network calls.

## Out of scope
No backend, no accounts, no analytics, no LLM API calls, no payment. Translations out of scope. The
`../ai-cookbook/sources/` clones are NOT bundled; the Cookbook Browser uses a small generated JSON index.
</content>
