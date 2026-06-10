// STUB. Wave 3 replaces this with the full Badges and progression screen
// (feature id 32). Reuses ScreenFrame as-is so the router stays complete.

import ScreenFrame from '../components/ui/ScreenFrame';

export default function Badges() {
  return (
    <ScreenFrame
      title="Badges"
      subtitle="Track your XP, streak, and everything you have unlocked."
      accent="cyan"
    >
      <div className="panel neon-box text-cyan anim-pulse p-8 text-center">
        <p aria-hidden="true" className="text-4xl">🏅</p>
        <p className="text-glow mt-3 text-xl">Mode coming online</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Your trophy case is being wired up. Soon it will show every badge you
          have earned and exactly how to claim the ones you have not.
        </p>
      </div>
    </ScreenFrame>
  );
}
