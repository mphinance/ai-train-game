// STUB. Wave 3 replaces this with the full Mind Reader mode (feature id 30).
// Reuses ScreenFrame as-is so the router stays complete.

import ScreenFrame from '../components/ui/ScreenFrame';

export default function MindReader() {
  return (
    <ScreenFrame
      title="Mind Reader"
      subtitle="Say exactly what you mean. The AI takes you literally."
      accent="orange"
    >
      <div className="panel neon-box text-orange anim-pulse p-8 text-center">
        <p aria-hidden="true" className="text-4xl">🎯</p>
        <p className="text-glow mt-3 text-xl">Mode coming online</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          This grid is still booting. Soon you will get a secret goal, write one
          prompt, and watch the AI honor only what you actually said.
        </p>
      </div>
    </ScreenFrame>
  );
}
