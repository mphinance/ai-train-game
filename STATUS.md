# Practical AI, build status

**Done. 28 of 28 features passing.** Practical AI is a serious, hands-on, interactive guide that
teaches a smart adult to actually use AI well. It fills the gap between "bad at AI and won't read
docs" and formal Skilljar/Anthropic certification. Built by pivoting the old arcade game in place, so
the live URL and Pages deploy are unchanged.

This was built on a feature branch (`feat/practical-ai-pivot`). Nothing is deployed until that branch
merges to `main`, which protects the currently-live site.

## What got built

- **Field Guide.** Eight chapters authored as portable Markdown in `content/chapters/`, rendered as a
  clean reader with a table of contents, prev/next navigation, and a remembered reading position.
  Chapters: why most people are bad at AI, how to talk to AI, say what you mean, output you can trust,
  what AI is good at, the moves pros use, putting it to work, and where to go next.
- **Prompt Gym.** The old game's one real asset, the offline deterministic rubric engine, kept intact
  and given a serious live-feedback UI. Practice boxes appear inline inside chapters at a `::practice::`
  marker and standalone at `/gym` with seven drills, each grading on its own target signals as you type.
- **Cookbook Browser.** A searchable, goal-filtered browser of 36 real AI uses across ten goals
  (writing, cooking, business, parenting, learning, money, coding, travel, fitness, creative), each with
  a copy-able starter prompt. Generated from the gathered `../ai-cookbook` library.
- **Ebook.** The same chapters compile to a real downloadable epub at
  `public/downloads/practical-ai.epub` (the `::practice::` drills are stripped for print), offered from
  the guide home. One source, two outputs.
- **Editorial reskin.** The arcade theme was swapped token-for-token to a serious editorial look: deep
  indigo on warm paper, Newsreader serif headings, Inter body. No XP, no badges, no mascot.
- **Cleanup.** Every game artifact removed: XP/badges/progress/taste engine, six game screens, the HUD,
  the onboarding overlay, the arcade UI components, and the old data files.

## Verified

- `npm run build` is clean (no TS errors). `npm test` is green (rubric engine, 18 tests).
- A real headless-chromium smoke passed 10 of 10 checks: TOC renders, the ebook link is present, the
  practice box live-scores as you type, the reading bookmark persists, the gym shows seven drills, the
  cookbook lists entries, the copy button confirms, and there is no horizontal scroll at 375px.
- Zero em dashes across source and chapters. Zero runtime network calls (offline after first load).

## Stack and shape

Vite 8, React 19, TypeScript, Tailwind v4 (token theme), react-router with HashRouter. 100%
client-side, no backend, no API keys. Deploys static to GitHub Pages. Chapters are plain Markdown loaded
via `import.meta.glob`; the rubric engine and the epub build are pure and deterministic.

## Waves

| Wave | What | Who |
|---|---|---|
| 0 | Spec, build plan, reset feature list | orchestrator |
| 1 | Foundation: content loader, route table, stubs, script contracts | orchestrator (Opus) |
| 2 | Editorial reskin + shell | 1 agent (Sonnet) |
| 3 | Guide reader, Prompt Gym, Cookbook Browser, all 8 chapters | 4 agents (3 Sonnet, 1 Opus) |
| 4 | Epub pipeline + dead-game cleanup | 1 agent + orchestrator |
| 5 | Browser smoke, final verify, this doc | orchestrator |

## Known follow-ups (not blocking)

- `public/og.png` is still the old arcade social card. The OG/Twitter text is updated to Practical AI,
  but the image should be regenerated to match.
- Optional: add a CI step to run `npm run epub` before build so the ebook always reflects the latest
  chapters (right now the epub is committed and regenerated on demand via `npm run epub`).

## Run it

```bash
npm install
npm run dev        # play locally
npm run epub       # regenerate public/downloads/practical-ai.epub from the chapters
npm run build      # static build into dist/ (Pages-deployable)
```
