'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const LOW_CORE_THRESHOLD = 4;
const LOW_MEMORY_THRESHOLD_GB = 4;

function detectLowPowerMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const lowCoreCount =
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency <= LOW_CORE_THRESHOLD;

  const navWithMemory = navigator as Navigator & { deviceMemory?: number };
  const lowMemory =
    typeof navWithMemory.deviceMemory === 'number' &&
    navWithMemory.deviceMemory > 0 &&
    navWithMemory.deviceMemory <= LOW_MEMORY_THRESHOLD_GB;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return isMobile || lowCoreCount || lowMemory || reducedMotion;
}

export function usePerformanceMode(): boolean {
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      setLowPowerMode(detectLowPowerMode());
    };

    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    window.addEventListener('resize', updateMode);

    return () => {
      mediaQuery.removeEventListener('change', updateMode);
      window.removeEventListener('resize', updateMode);
    };
  }, []);

  return lowPowerMode;
}
