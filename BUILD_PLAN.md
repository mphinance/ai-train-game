# BUILD PLAN — pivot "AI Trainer" game → "The Practical AI Field Guide"

> Orchestrate-ready. Written for an agent team to take non-overlapping pieces.
> Reuses this repo (`mphinance/ai-train-game`) so the live URL + Pages deploy stay put.
> Drafted 2026-06-14.

---

## The pivot in one paragraph
The arcade game framing reads kiddish (XP, badges, "jack in", Tron map). Kill that. Keep the one real
asset, the **offline deterministic rubric engine** (`src/engine/rubric.ts`), and reframe the product
as a **serious, practical, interactive field guide** that fills the gap between "bad at AI / won't read
docs" and "formal Skilljar/Anthropic certification." Still hands-on and engaging, just adult. Content
is authored once as **portable Markdown** and emitted to **two outputs: the interactive web guide AND a
downloadable epub** for Substack readers.

Positioning: the in-between. Casual enough that a smart adult who's behind on AI will actually finish
it; serious enough to be credible. Ends by pointing the committed toward Skilljar / the gathered
`ai-cookbook` library.

## Three layers, one product
1. **Field Guide (spine)** — chapters rendered from Markdown. The teaching.
2. **Prompt Gym (inside)** — rubric-driven practice. Lives inline in chapters AND as a standalone
   `/gym` section. The reps.
3. **Cookbook Browser (go deeper)** — searchable browse over the gathered `../ai-cookbook` library by
   real-life goal, each with a copy-able starter prompt. The discovery/reference appendix.

---

## Keep / Kill / Repurpose

**KEEP (do not rewrite):**
- `src/engine/rubric.ts` + `src/engine/types.ts` — the scorer. Reused by the Gym as-is.
- `src/engine/storage.ts` — repurpose for reading-position/bookmarks (NOT XP).
- Vite 8 / React 19 / TS / Tailwind v4 (token-based theme) / react-router stack.
- `.github/workflows/deploy.yml` — Pages deploy on push to main. Untouched.
- The static-site / offline / no-API-key / works-on-a-plane constraints. Non-negotiable.

**KILL:**
- `src/engine/badges.ts`, `src/engine/progress.ts` (XP/levels/streaks/badges).
- `src/components/hud/Hud.tsx`, `src/components/Onboarding.tsx` (game HUD + "jack in").
- `src/screens/{Hub,GlowUp,MindReader,DeckMode,Badges,IdeaForge}.tsx` (game screens — content
  migrates into chapters/gym/cookbook).
- Arcade "Arcade Paper" theme tokens (reskin to editorial).
- `src/data/{deck,ideas,mindreader,glowup}.ts` (content moves to Markdown + generated cookbook JSON).

**REPURPOSE:**
- `src/engine/taste.ts` — OPTIONAL light "what are you here for" interest weighting to rank the Cookbook
  Browser (no quiz, no XP). If it adds complexity, cut it; not load-bearing.
- `src/components/ui/{NeonButton,ScreenFrame}.tsx` + `fx/PageTransition.tsx` — keep shapes, reskin to
  serious tokens (rename NeonButton → Button).

---

## Architecture: one source, two outputs

```
content/
  chapters/
    00-why-most-people-are-bad-at-ai.md
    01-how-to-talk-to-ai.md
    ...                         # frontmatter + body. SINGLE SOURCE OF TRUTH.
  cookbook.json                 # generated from ../ai-cookbook (by-goal, starter prompts)
scripts/
  build-epub.mjs                # chapters/*.md -> public/downloads/practical-ai.epub (pandoc or epub lib)
  gen-cookbook.mjs              # ../ai-cookbook  -> content/cookbook.json
src/
  content/loader.ts             # import.meta.glob('content/chapters/*.md') -> Chapter[]  (CONTRACT)
  content/types.ts              # Chapter, PracticeSpec, frontmatter schema  (CONTRACT)
  screens/{GuideHome,ChapterReader,Gym,Cookbook}.tsx
  components/PracticeBox.tsx    # rubric-driven; used inline in chapters + in Gym
  components/Markdown.tsx       # renders chapter body (+ embeds <PracticeBox> via a directive)
```

**Chapter Markdown frontmatter (the contract Wave 1 freezes):**
```yaml
---
order: 1
slug: how-to-talk-to-ai
title: How to Actually Talk to AI
summary: The anatomy of a prompt that works.
gym:                     # optional inline practice for this chapter
  brief: "Rewrite this lazy prompt so it earns a Strong score."
  starter: "write something about dogs"
  require: [role, context, format, constraints]   # rubric signals this drill grades on
tags: [prompting, fundamentals]
---
Body in Markdown. A line containing only `::practice::` renders the chapter's PracticeBox inline.
```

epub note: chapters are plain Markdown so `pandoc content/chapters/*.md -o practical-ai.epub` (with a
metadata + cover) "just works." `::practice::` directives and any web-only bits are stripped in the
epub build. Same words, two surfaces.

---

## Wave decomposition (orchestrate)

Cap 3-4 parallel agents/wave. Pre-stage shared files BEFORE fan-out. Explicit file ownership. Verify
+ commit between waves. Model per rule 11 (Haiku/Sonnet for breadth, Opus for foundation/voice/polish).

### Wave 0 — Scaffold & decisions (orchestrator, serial)
- Write `SPEC.md` (replace game spec), reset `feature_list.json` (~28 assertions, see below).
- Pick the name (see options). Add deps to `package.json` (markdown: `marked` or `react-markdown` +
  `gray-matter`; epub: pandoc via CI, or `epub-gen-memory`).
- Create `content/chapters/` + `scripts/` dirs with empty stubs.
- Single commit. **Model: Haiku/Sonnet.**

### Wave 1 — Foundation (serial, ONE agent) — the contract everything depends on
- `src/content/types.ts` + `src/content/loader.ts` (glob-load + parse frontmatter → `Chapter[]`).
- New `src/App.tsx` route table mounting STUB screens: `/` GuideHome, `/guide/:slug` ChapterReader,
  `/gym` Gym, `/cookbook` Cookbook. (Orchestrator pre-stages App.tsx here so Wave 3 agents never touch it.)
- Freeze the `PracticeSpec` shape + the `scorePrompt(prompt, {require})` usage contract.
- `scripts/build-epub.mjs` + `scripts/gen-cookbook.mjs` skeletons (I/O contract only).
- Commit. **Model: Opus** (downstream depends on this).

### Wave 2 — Reskin + shell (serial)
- `src/index.css` — swap arcade tokens → editorial palette (serious, book-like; clean serif/sans,
  restrained color). Token-only per existing theme discipline.
- App shell: simple top nav (Guide / Gym / Cookbook) + footer with Substack CTA. Delete `Hud`,
  `Onboarding`. Reskin `Button`/`ScreenFrame`.
- Commit. **Model: Sonnet** (Opus if taste matters on the palette).

### Wave 3 — Parallel fan-out (4 agents, non-overlapping)
- **Agent A — Guide reader** (Sonnet). Owns: `src/screens/GuideHome.tsx` (TOC from loader),
  `src/screens/ChapterReader.tsx` (render body, prev/next, reading-position via storage.ts),
  `src/components/Markdown.tsx`. MAY NOT touch: App.tsx, engine, other screens.
- **Agent B — Prompt Gym** (Sonnet). Owns: `src/components/PracticeBox.tsx` (input → live rubric
  feedback, reused inline + standalone), `src/screens/Gym.tsx` (drill list). Reads `rubric.ts`
  (read-only). MAY NOT touch: App.tsx, rubric.ts, other screens.
- **Agent C — Cookbook Browser** (Sonnet). Owns: `src/screens/Cookbook.tsx`, `scripts/gen-cookbook.mjs`,
  `content/cookbook.json`. Builds the by-goal index from `../ai-cookbook` (use PROVIDERS.md + the
  distilled "use it when (Anyone)" entries + tips-and-tricks). MAY NOT touch: App.tsx, other screens.
- **Agent D — Chapter content** (Opus, voice). Owns: `content/chapters/*.md` ONLY. Authors all chapters
  as dual web+epub Markdown in Michael's voice (NO em dashes, no markdown tables, adult tone). Split
  into D1/D2 by chapter range if large. MAY NOT touch any code.
- All depend only on Wave 1 contracts. Commit per agent (explicit paths). Verify after.

### Wave 4 — epub pipeline + polish (1-2 agents)
- **epub** (Sonnet): finish `scripts/build-epub.mjs` → `public/downloads/practical-ai.epub` (cover +
  metadata, strip web-only directives). Wire a "Download the ebook" CTA on GuideHome. Add an `npm run
  epub` script and a CI step so the epub regenerates on deploy.
- **polish** (Opus): copy pass, a11y (focus rings, reduced motion already honored), mobile ≤375px,
  refresh OG/social cards + `<title>` for the new product, delete all KILL-list dead files.

### Wave 5 — Verify & ship (orchestrator)
- `npm run build`, `npm test` (rubric tests pass), smoke every route, generate + open the epub.
- Push → Pages auto-redeploys to https://mphinance.github.io/ai-train-game/.
- Update repo description + `STATUS.md`. Done.

---

## Chapter outline (the dual-purpose content)
Serious, practical, adult. Each "practice" chapter ships a `::practice::` box.

0. **Why most people are bad at AI (and the 20% that fixes it)** — short, honest framing intro.
1. **How to actually talk to AI** — anatomy of a prompt: role, context, audience, format, constraints. *practice*
2. **Say what you mean** — the gap between what you meant and what you typed. *practice*
3. **Getting output you can trust** — specificity, structure, asking for the right shape, verifying. *practice*
4. **What AI is genuinely good at (and what it isn't)** — the honest map; bridges into the Cookbook Browser.
5. **The moves that separate the pros** — give it tools, give it examples, let it think, have it check
   its own work. (Distilled from `../ai-cookbook/tips-and-tricks.md`.)
6. **Putting it to work in your life** — by goal (writing, business, cooking, parenting, learning),
   each with starter prompts that deep-link to the Cookbook Browser.
7. **Where to go next** — for the committed: Skilljar / Anthropic courses / the gathered library.
   Positions this guide as the on-ramp, not the destination.

## feature_list.json seed (≈28 assertions, Wave 0)
Examples: "chapters load from Markdown frontmatter"; "TOC lists chapters in order"; "ChapterReader
renders body + prev/next"; "::practice:: renders a working PracticeBox"; "PracticeBox shows live rubric
score + top fix"; "Gym lists ≥6 drills, each scored"; "Cookbook browser filters by goal"; "copy-prompt
button works"; "epub downloads and opens with all chapters"; "no XP/badges/HUD anywhere"; "zero network
calls at runtime"; "responsive to 375px"; "no em dashes in shipped copy"; "Pages deploy succeeds".

## Open decision (non-blocking — orchestrator picks if no answer)
**Name.** Options: *Practical AI* · *Talk to AI* · *The Practical AI Field Guide* · *AI, Actually*.
Repo stays `ai-train-game` (URL stability); only the site title + epub title change.

## Model tiering summary (rule 11)
Wave 0 Haiku/Sonnet · Wave 1 **Opus** · Wave 2 Sonnet · Wave 3 A/B/C Sonnet, **D Opus** (voice) ·
Wave 4 epub Sonnet, polish Opus · Wave 5 orchestrator (you).
</content>
