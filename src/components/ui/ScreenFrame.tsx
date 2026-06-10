// Reusable screen shell: a back-to-hub link, a glowing title, an optional
// subtitle, and a consistent padded frame. Wave 3 screens reuse this as-is.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type FrameAccent = 'cyan' | 'orange' | 'violet' | 'lime';

const ACCENT_TEXT: Record<FrameAccent, string> = {
  cyan: 'text-cyan',
  orange: 'text-orange',
  violet: 'text-violet',
  lime: 'text-lime',
};

interface ScreenFrameProps {
  title: string;
  subtitle?: string;
  accent?: FrameAccent;
  children: ReactNode;
}

export default function ScreenFrame({
  title,
  subtitle,
  accent = 'cyan',
  children,
}: ScreenFrameProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 anim-rise sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft transition-colors hover:text-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
      >
        <span aria-hidden="true">&larr;</span> Back to grid
      </Link>

      <header className="mt-4 mb-6">
        <h1 className={`${ACCENT_TEXT[accent]} text-glow text-3xl sm:text-4xl`}>{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-ink-soft">{subtitle}</p>
        ) : null}
      </header>

      {children}
    </section>
  );
}
