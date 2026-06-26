'use client';

import { motion, useReducedMotion } from 'framer-motion';
import MagicCircle from '@/components/grimoire/MagicCircle';
import ScrollIndicator from '@/components/grimoire/ScrollIndicator';

const TECH_BADGES = [
  'RAG',
  'Computer Vision',
  'Privacy ML',
  'Full-stack Systems',
  'MLOps',
] as const;

interface GrimoireHeroProps {
  children: React.ReactNode;
  className?: string;
}

export default function GrimoireHero({ children, className = '' }: GrimoireHeroProps) {
  const reduceMotion = useReducedMotion();

  const fadeIn = reduceMotion
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
      };

  const titleReveal = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0, filter: 'blur(0px)' } }
    : {
        initial: { opacity: 0, y: 8, filter: 'blur(8px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        transition: { duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
      };

  const subtitleReveal = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.35, ease: 'easeOut' as const },
      };

  const badgeReveal = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.5, ease: 'easeOut' as const },
      };

  return (
    <section className={`relative ${className}`}>
      <motion.div
        {...fadeIn}
        className="grimoire-parchment pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        style={{
          background: `linear-gradient(165deg, var(--grimoire-parchment) 0%, transparent 72%)`,
          opacity: 0.55,
        }}
      />

      <div className="relative mb-6 text-center lg:text-left">
        <motion.h2
          {...titleReveal}
          className="font-grimoire-display mb-2 text-4xl sm:text-5xl"
          style={{ color: 'var(--grimoire-gold)', opacity: 0.85 }}
        >
          Jingjia&apos;s Grimoire
        </motion.h2>

        <motion.p
          {...subtitleReveal}
          className="font-grimoire-heading mx-auto max-w-md text-base sm:text-lg lg:mx-0"
          style={{ color: 'var(--grimoire-ink)', opacity: 0.72 }}
        >
          AI systems, research spells, and engineering journeys collected along the way.
        </motion.p>

        <motion.div
          {...badgeReveal}
          className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start"
        >
          {TECH_BADGES.map((badge) => (
            <span
              key={badge}
              className="pointer-events-none rounded-full border px-3 py-1 text-xs font-medium tracking-wide"
              style={{
                borderColor: 'var(--grimoire-gold-muted)',
                color: 'var(--grimoire-ink)',
                backgroundColor: 'var(--grimoire-dust-cream)',
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <MagicCircle className="-right-8 top-1/2 hidden -translate-y-1/2 opacity-90 lg:block" />
        <MagicCircle className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 opacity-80 lg:hidden" />

        <div className="relative z-10">{children}</div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
