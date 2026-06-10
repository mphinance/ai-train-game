# AI Trainer

**Learn to talk to AI by playing, not by reading the manual.**

Everything out there for "getting good at AI" is documentation. Documentation is boring, so
nobody reads it, so people stay bad at prompting. AI Trainer turns the reading into a game.

A Tron-styled browser game with four modes:

- **Glow-Up** — take a lazy prompt and level it up with drag-in ingredients (role, context,
  constraints, format). Watch the AI's answer get better in real time. *Teaches: better prompts.*
- **Mind Reader** — you get a secret goal, you write one prompt, and the "AI" answers only as
  well as your prompt allowed. See the gap between what you meant and what you said.
  *Teaches: saying what you actually mean.*
- **Did-You-Know Deck** — flip cards of unexpected AI uses, each with a 30-second challenge.
  *Teaches: uses you hadn't thought of.*
- **Idea Forge** — quietly learns what you care about while you play (no quiz, ever) and hands
  you AI-use ideas tailored to you. *Teaches: idea generation and the payoff of personalization.*

## How it works
100% client-side. A deterministic **rubric engine** scores your prompts offline, so the whole
thing ships as a static site, costs nothing, needs no API key, and works on a plane.

## Run it
```bash
npm install
npm run dev      # play locally
npm run build    # static build into dist/ (deployable to GitHub Pages)
```

## Stack
Vite 8 · React 19 · TypeScript · Tailwind v4 (CSS-first theme) · react-router. No backend.

See [SPEC.md](SPEC.md) for the full design and [feature_list.json](feature_list.json) for the
acceptance checklist.
