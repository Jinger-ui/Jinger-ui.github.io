'use client';

import React, { useEffect, useState } from 'react';

interface LanternGlowProps {
  className?: string;
}

const MOBILE_BREAKPOINT = 640;

export default function LanternGlow({ className }: LanternGlowProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const syncPreferences = () => {
      setReducedMotion(reducedMotionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    syncPreferences();

    reducedMotionQuery.addEventListener('change', syncPreferences);
    mobileQuery.addEventListener('change', syncPreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', syncPreferences);
      mobileQuery.removeEventListener('change', syncPreferences);
    };
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '80px',
        height: '100px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20px -16px -12px -16px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(205, 170, 105, 0.4) 0%, rgba(159, 194, 196, 0.12) 55%, transparent 75%)',
          opacity: reducedMotion ? 0.3 : undefined,
          animation: reducedMotion ? undefined : 'lanternBreathe 6s ease-in-out infinite',
          filter: 'blur(8px)',
        }}
      />

      <svg
        viewBox="0 0 40 60"
        width="40"
        height="60"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          overflow: 'visible',
        }}
      >
        <path
          d="M14 8 C14 4, 26 4, 26 8 L26 12 L14 12 Z"
          fill="none"
          stroke="rgba(205, 170, 105, 0.55)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M20 2 C20 0.5, 22 0.5, 22 2 C24 2, 24 6, 20 8 C16 6, 16 2, 20 2 Z"
          fill="none"
          stroke="rgba(205, 170, 105, 0.45)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M10 14 L30 14 L26 48 L14 48 Z"
          fill="rgba(205, 170, 105, 0.08)"
          stroke="rgba(205, 170, 105, 0.5)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M14 48 L26 48 L24 54 L16 54 Z"
          fill="rgba(159, 194, 196, 0.1)"
          stroke="rgba(205, 170, 105, 0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <ellipse
          cx="20"
          cy="30"
          rx="5"
          ry="8"
          fill="rgba(246, 239, 220, 0.15)"
          stroke="rgba(205, 170, 105, 0.25)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
