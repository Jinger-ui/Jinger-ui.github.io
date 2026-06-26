'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ClockRippleProps {
  className?: string;
}

interface Ripple {
  id: number;
  duration: number;
  opacity: number;
}

const MAX_RIPPLES = 4;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInterval(): number {
  return randomBetween(6000, 10000);
}

export default function ClockRipple({ className }: ClockRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const nextIdRef = useRef(0);
  const staticRingCountRef = useRef(Math.floor(randomBetween(1, 3)));
  const scheduleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removalTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMotionQuery.matches);

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const spawnRipple = () => {
      const id = nextIdRef.current++;
      const duration = randomBetween(4000, 6000);
      const opacity = randomBetween(0.1, 0.2);

      setRipples((current) => {
        const next = [...current, { id, duration, opacity }];
        return next.length > MAX_RIPPLES ? next.slice(next.length - MAX_RIPPLES) : next;
      });

      const removalTimeout = setTimeout(() => {
        setRipples((current) => current.filter((ripple) => ripple.id !== id));
        removalTimeoutsRef.current.delete(id);
      }, duration + 100);

      removalTimeoutsRef.current.set(id, removalTimeout);
    };

    const scheduleNext = () => {
      scheduleTimeoutRef.current = setTimeout(() => {
        spawnRipple();
        scheduleNext();
      }, randomInterval());
    };

    spawnRipple();
    scheduleNext();

    return () => {
      if (scheduleTimeoutRef.current) {
        clearTimeout(scheduleTimeoutRef.current);
      }
      removalTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      removalTimeoutsRef.current.clear();
    };
  }, [reducedMotion]);

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '45%',
        height: '35%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {reducedMotion ? (
        <>
          {Array.from({ length: staticRingCountRef.current }, (_, index) => (
            <span
              key={`static-ring-${index}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${60 + index * 28}%`,
                height: `${60 + index * 28}%`,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '1px solid rgba(205, 170, 105, 0.12)',
                opacity: 0.12 - index * 0.02,
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      ) : (
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              maxWidth: 'min(100%, 420px)',
              maxHeight: 'min(100%, 420px)',
              aspectRatio: '1',
              transform: 'translate(-50%, -50%) scale(0.3)',
              borderRadius: '50%',
              border: `1px solid rgba(205, 170, 105, ${ripple.opacity})`,
              opacity: 0.25,
              animation: `rippleExpand ${ripple.duration}ms ease-out forwards`,
              pointerEvents: 'none',
            }}
          />
        ))
      )}
    </div>
  );
}
