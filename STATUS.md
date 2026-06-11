# AI Trainer, build status

**Done. Shipped. 26 of 26 features passing.** A bright, arcade-styled browser game that teaches
people to talk to AI by playing instead of reading the manual. Fully offline, static-deployable,
zero API keys, works on a plane.

## What got built

Four modes, all playable end to end:

- **Glow-Up** (6 levels). Hand the player a lazy prompt and its sad output, let them drag in
  ingredients (role, context, constraints, format, audience, tone), and the AI answer rebuilds
  live as the score climbs. Cross the win line, bank XP. Topics span cooking, writing, study,
  fitness, travel, money.
- **Mind Reader** (5 goals). A secret goal, one prompt, and an AI that answers only what you
  literally asked for. The gap between what you meant and what you said gets shown back to you in
  red. This is the "lol how to say what you want" lesson, and it lands.
- **Did-You-Know Deck** (12 cards). Flip cards of AI uses people never think of (rubber-duck
  debugging, explain like I am 8, fridge-to-recipes, rehearse a hard talk, decode a contract),
  each with a 30-second micro-challenge that gets scored.
- **Idea Forge** (26-card idea bank). The payoff. It quietly watches what you play and hands you
  AI-use ideas tuned to you, with copy-pasteable starter prompts. No quiz, ever.

## The clever bits

- **Offline rubric engine.** A pure, deterministic scorer detects ten prompt-quality signals
  (role, context, audience, format, constraints, examples, tone, specificity, stepwise, length).
  Instant feedback, no network, which is what makes the whole thing a free static site.
- **Taste Engine.** Silent preference learning. Every card you flip and topic you pick nudges a
  weighted interest profile in localStorage. Play cooking levels, the Idea Forge starts talking
  about cooking. Verified live end to end during the build.
- **Progression.** XP, levels, a day streak, and eight badges, all persisted and live-updating in
  the HUD through a tiny pub/sub.

## Stack and shape

Vite 8, React 19, TypeScript strict, Tailwind v4 (CSS-first theme, no config file),
react-router v7 on a HashRouter so refreshes never 404 on Pages. State is localStorage only.
The Arcade Paper look (bright paper, jewel-tone accents, soft rounded shadows, friendly rounded
display font) lives entirely in theme tokens, so there is not a hardcoded hex anywhere in the
components. It started as a dark Tron theme and got re-skinned to light by swapping tokens alone,
which is exactly why that token discipline paid off.

## Verified

- `npm run build` clean, no TypeScript errors. `npm run test` 42 of 42 green.
- All four modes smoke-tested through the real UI, including a full Glow-Up win and the
  Mind Reader gap reveal.
- Taste to Idea Forge personalization confirmed live (cooking signal carried through).
- Persistence survives a hard reload. Zero runtime network calls (grep-confirmed), so it runs
  offline after first load.
- Responsive down to 375px with no horizontal scroll (fixed a route-trail overflow that bit
  mobile). Keyboard navigable, visible focus rings, reduced motion honored.
- Zero em dashes anywhere, per house style.

## How it was built

Orchestrated in waves with verification and a commit between each one:

| Wave | What | How |
|---|---|---|
| 0 | Scaffold, theme, SPEC, feature list | orchestrator |
| 1 | Engine (rubric, taste, progress, types, hooks, tests) | 1 serial agent |
| 2 | Shell, router, HUD, Hub, Glow-Up vertical, stubs | 1 serial agent |
| 3 | Mind Reader, Deck, Badges, Idea Forge | 3 parallel agents |
| 4 | Route transitions, more Glow-Up content | 1 serial agent |
| 5 | Mobile fix, em-dash scrub, a11y, deploy, this doc | orchestrator |

## Run it

```bash
npm install
npm run dev      # play locally
npm run build    # static build into dist/
npm run test     # 42 engine tests
```

A GitHub Pages workflow (`.github/workflows/deploy.yml`) publishes `dist/` on every push to
`main`. Push it up, enable Pages (source: GitHub Actions), and it is live.

## Known small stuff (not blocking)

- The rubric is heuristic on purpose. It is a teaching signal, not a grader, so a few phrasings
  (e.g. an implied audience) can score lower than a human would. Easy to tune later if you want.
- "Live Mode" (real Claude grading via a pasted key) was scoped out of v1 on purpose. The engine
  is structured so it can slot in behind the same `scorePrompt` seam later.

## Next, if you want to take it further

- A short onboarding "jack in" animation on first load.
- Sound (the synthwave-adjacent kind), gated behind a toggle.
- Share-a-score card export for the Substack crowd.
- Wire the optional Live Mode for people who want a real model grading their prompts.
