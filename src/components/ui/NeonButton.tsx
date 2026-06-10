// Reusable neon button. Keyboard-accessible, visible focus, three accent variants.
// Wave 3 screens reuse this as-is. Theme off tokens only, no hardcoded hex.

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type NeonVariant = 'cyan' | 'orange' | 'violet';

const VARIANT_TEXT: Record<NeonVariant, string> = {
  cyan: 'text-cyan',
  orange: 'text-orange',
  violet: 'text-violet',
};

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeonVariant;
  children: ReactNode;
}

export default function NeonButton({
  variant = 'cyan',
  children,
  className = '',
  type = 'button',
  ...rest
}: NeonButtonProps) {
  return (
    <button
      type={type}
      className={[
        VARIANT_TEXT[variant],
        'neon-box rounded-lg px-5 py-2.5 font-display uppercase tracking-widest text-sm',
        'bg-abyss/40 transition-transform duration-150',
        'hover:scale-[1.03] hover:text-glow active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:text-glow',
        'disabled:opacity-40 disabled:pointer-events-none',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
