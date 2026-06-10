// STUB. Wave 3 replaces this with the full Did-You-Know Deck (feature id 31).
// Reuses ScreenFrame as-is so the router stays complete.

import ScreenFrame from '../components/ui/ScreenFrame';

export default function DeckMode() {
  return (
    <ScreenFrame
      title="Did-You-Know Deck"
      subtitle="Flip cards for AI tricks you never thought to try."
      accent="lime"
    >
      <div className="panel neon-box text-lime anim-pulse p-8 text-center">
        <p aria-hidden="true" className="text-4xl">🃏</p>
        <p className="text-glow mt-3 text-xl">Mode coming online</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          A deck of flippable cards is being shuffled. Each one is an unexpected
          AI use with a quick challenge to try it yourself.
        </p>
      </div>
    </ScreenFrame>
  );
}
