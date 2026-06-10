// PageTransition: a subtle Tron snap-fade-up applied to route content on every
// navigation. We re-run the animation by keying a wrapper on the current
// pathname, so React remounts it and the CSS keyframe fires fresh each route.
// Reduced motion is fully honored: when the user prefers reduced motion we skip
// the animation class entirely and render content with no transform/opacity.

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [reduce, setReduce] = useState(prefersReducedMotion);

  // Keep in sync if the user flips the OS setting mid-session.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // No key when reduced: avoids needless remounts and any flash of motion.
  if (reduce) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="anim-route relative">
      {children}
    </div>
  );
}
