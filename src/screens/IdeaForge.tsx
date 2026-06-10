// STUB. Wave 3 replaces this with the full Idea Forge (feature id 33).
// Reuses ScreenFrame as-is so the router stays complete.

import ScreenFrame from '../components/ui/ScreenFrame';

export default function IdeaForge() {
  return (
    <ScreenFrame
      title="Idea Forge"
      subtitle="Get AI ideas built around what you actually care about."
      accent="violet"
    >
      <div className="panel neon-box text-violet anim-pulse p-8 text-center">
        <p aria-hidden="true" className="text-4xl">💡</p>
        <p className="text-glow mt-3 text-xl">Mode coming online</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          The forge is warming up. The more you play, the more it learns what you
          like, then it hands you AI ideas tailored to you.
        </p>
      </div>
    </ScreenFrame>
  );
}
