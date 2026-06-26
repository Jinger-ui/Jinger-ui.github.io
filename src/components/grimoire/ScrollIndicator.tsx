'use client';

import { useReducedMotion } from 'framer-motion';

export default function ScrollIndicator() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      className="pointer-events-none mt-6 flex justify-center"
      aria-hidden="true"
    >
      <div
        className="flex flex-col items-center gap-1"
        style={{ animation: 'scrollIndicatorFloat 2.8s ease-in-out infinite' }}
      >
        <svg
          viewBox="0 0 24 40"
          className="h-10 w-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8 2 5 5 5 9v18c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z"
            stroke="var(--grimoire-gold)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.45}
          />
          <path
            d="M12 2v8M9 6h6"
            stroke="var(--grimoire-gold-muted)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.5}
          />
          <path
            d="M8 14c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5"
            stroke="var(--grimoire-gold)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.35}
          />
          <path
            d="M6 32 Q12 36 18 32"
            stroke="var(--grimoire-gold)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity={0.3}
          />
        </svg>
        <span
          className="font-grimoire-heading text-[10px] uppercase tracking-[0.25em]"
          style={{ color: 'var(--grimoire-gold)', opacity: 0.45 }}
        >
          scroll
        </span>
      </div>
    </div>
  );
}
