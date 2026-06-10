# AI TRAINER — SPEC

> Learn to talk to AI by **playing**, not by reading the manual.

## The one-sentence goal
A browser game that teaches people to (1) write sharper prompts, (2) discover AI uses
they'd never have guessed, and (3) say what they actually mean — and that quietly learns
what *they* care about while they play, so it can hand them ideas tailored to them.

## Why this exists (design north star)
Everything out there for "learning AI" is documentation. Documentation is boring, so people
don't read it, so they stay bad at prompting. This turns the *reading* into *playing*. Every
screen should feel like a game first and a lesson second. If a feature feels like a textbook,
it's wrong.

## The player's journey
1. Boot screen → "Jack in" → a **Hub** (a Tron-style map of unlocked modes).
2. Play any of the modes below to earn **XP**, **streaks**, and **badges**.
3. As they play, the **Taste Engine** silently profiles their interests (no questions asked).
4. The **Idea Forge** uses that profile to generate AI-use ideas tailored to them.

## The modes (the meat)

### 1. Glow-Up  *(teaches: better prompts)*
Player is handed a lazy prompt (e.g. `"write something about dogs"`) and its sad AI output.
They drag in **prompt ingredients** — Role, Context, Constraints, Format, Examples, Audience,
Tone — and watch a *simulated* better output assemble in real time. Score rises as the prompt
gains the signals the rubric rewards. Goal: feel the cause→effect of a good prompt.

### 2. Mind Reader  *(teaches: saying what you mean)*
Player is given a **secret goal** (e.g. "get a 3-day vegetarian meal plan for a gym bro who
hates mushrooms"). They write ONE prompt. The game produces a deliberately literal "AI" reply
that honors *only what the prompt actually specified* — exposing the gap between what they meant
and what they said. They revise. This is the "lol how to say what you want" mode.

### 3. Did-You-Know Deck  *(teaches: uses they hadn't thought of)*
A deck of flippable cards, each an unexpected AI use (rubber-duck debugging, "explain like I'm
8", turn a photo of your fridge into recipes, role-play a tough conversation, etc.). Each card
has a 30-second micro-challenge. Cards the player engages with feed the Taste Engine.

### 4. Idea Forge  *(teaches: idea generation + personalization payoff)*
Reads the Taste Engine profile and **generates a tailored set of AI-use ideas** for this player
("You keep reaching for cooking + writing prompts — here are 3 ways AI can help a home cook who
writes."). Offline + deterministic: ideas are assembled from a tagged idea bank filtered/ranked
by the player's inferred interest tags. Never asks a quiz question.

## The systems (shared, built in Wave 1)

### Rubric Engine (the scorer)  — `src/engine/rubric.ts`
Pure, deterministic, **offline**. Given a prompt string (and optional level spec), it detects
prompt-quality **signals** and returns a score + per-signal feedback. Signals include:
`role`, `context`, `audience`, `format`, `constraints`, `examples`, `tone`, `specificity`,
`stepwise`, `length-fit`. No network, no LLM. This is what makes the game shippable as a static
site and what makes feedback instant. Detection is heuristic (keyword/structure/length), and
**that's fine** — it's a teaching signal, not a grading authority.

### Taste Engine (the silent profiler)  — `src/engine/taste.ts`
Watches in-game choices (topics picked, cards engaged, time spent) and maintains a weighted
**interest tag** profile in `localStorage`. Never asks the player anything. Tags come from a
fixed vocabulary (e.g. `cooking`, `writing`, `coding`, `parenting`, `fitness`, `business`,
`travel`, `study`, `creative`). Exposes `record(event)` and `topInterests(n)`.

### Progression  — `src/engine/progress.ts`
XP, level, streak, badges, per-mode completion. Persisted to `localStorage`. Single source of
truth for the HUD.

## Tech stack (locked)
- **Vite 8 + React 19 + TypeScript** (strict). `npm run dev` / `npm run build`.
- **Tailwind v4** via `@tailwindcss/vite`. Theme tokens live in `src/index.css` under `@theme`
  (CSS-first config — there is NO `tailwind.config.js`). Use token utilities like
  `text-cyan`, `bg-abyss`, `border-edge`, plus the custom utility classes `.panel`, `.neon-box`,
  `.text-glow`, `.trail`, `.anim-rise`. **Do not hardcode hex colors** — theme off the tokens.
- **react-router-dom v7** for screens.
- **No backend. No API keys. No network calls at runtime.** Static deploy to GitHub Pages.
- State persistence: `localStorage` only.

## Aesthetic — TRON
Dark void background, glowing cyan grid floor (already in `index.css`), neon circuitry, geometric
light-trails. Palette: **cyan** = the player/program, **orange** = opponent/danger/accent,
**violet** = rare/special (Idea Forge), **lime** = success, **rose** = error. Type: Orbitron
(display), Rajdhani (body), JetBrains Mono (code/prompts). Motion: snappy, glowing, restrained.
Respect `prefers-reduced-motion` (already wired).

## Voice & copy rules (enforce in all UI text)
- **NO EM DASHES anywhere.** Use periods, commas, or "and". Non-negotiable.
- Second person, warm, a little playful. Never condescending. The player is smart, just new.
- No markdown tables in any rendered content.
- Keep microcopy short and game-y ("Nice. The AI actually knew what you wanted that time.").

## Acceptance criteria (what "done" means)
- `npm run build` passes clean (no TS errors) and `npm run dev` boots to the Hub.
- All four modes are playable end-to-end with the offline engines.
- Rubric gives instant, specific feedback that visibly changes with prompt quality.
- Taste Engine demonstrably shifts Idea Forge output based on what the player did.
- XP/streak/badges persist across reload.
- Works with no network after first load. Deployable to GitHub Pages.
- Fully keyboard-navigable; passes a basic a11y pass; honors reduced motion.
- Zero em dashes in shipped copy.

## Out of scope (v1)
- Real LLM grading / "Live Mode" (designed-for later, not built now).
- Accounts, multiplayer, leaderboards beyond local.
- Mobile-native; we target responsive web (must be usable on a phone browser, not perfect).
- Sound is nice-to-have (Wave 4), not required for "done".

## File ownership map (prevents collisions across waves)
- Orchestrator owns: `SPEC.md`, `feature_list.json`, `vite.config.ts`, `src/index.css`,
  `src/main.tsx`, the router mount in `src/App.tsx`, `STATUS.md`.
- `src/engine/*` — Wave 1 (serial).
- `src/components/hud/*`, `src/screens/Hub.tsx`, `src/screens/GlowUp.tsx` — Wave 2 (serial).
- `src/screens/MindReader.tsx`, `src/screens/DeckMode.tsx`, `src/screens/Badges.tsx` — Wave 3 (parallel, one file each).
- `src/data/*.json` content + `src/components/fx/*` juice — Wave 4 (parallel).
Each wave's agent prompt restates exactly which files it may and may not touch.
