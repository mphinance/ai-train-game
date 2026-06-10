// Placeholder boot screen. Wave 2 replaces this with the real app shell,
// router, and HUD. Kept minimal so it never collides with later waves.
function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="font-mono text-cyan text-sm tracking-[0.3em] anim-flicker">
        BOOTING&nbsp;PROGRAM…
      </p>
      <h1 className="text-cyan text-glow text-5xl md:text-7xl">AI&nbsp;TRAINER</h1>
      <p className="text-ink-soft max-w-md">
        Learn to talk to AI by playing, not by reading the manual.
      </p>
      <div className="mt-6 panel neon-box text-cyan px-5 py-3 font-mono text-xs text-ink-soft">
        scaffold online · waiting for shell (wave 2)
      </div>
    </div>
  )
}

export default App
