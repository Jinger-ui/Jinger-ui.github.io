'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkillCategory {
  title: string;
  items: string[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
  className?: string;
}

interface ConstellationLine {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface SkillCategoryCardProps {
  category: SkillCategory;
  catIdx: number;
  isInView: boolean;
}

function SkillCategoryCard({ category, catIdx, isInView }: SkillCategoryCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [lines, setLines] = useState<ConstellationLine[]>([]);
  const [isLg, setIsLg] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const computeLines = useCallback(
    (itemKey: string | null) => {
      if (!itemKey || !containerRef.current || !isLg) {
        setLines([]);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const activeEl = itemRefs.current.get(itemKey);
      if (!activeEl) return;

      const activeRect = activeEl.getBoundingClientRect();
      const x1 = activeRect.left + activeRect.width / 2 - containerRect.left;
      const y1 = activeRect.top + activeRect.height / 2 - containerRect.top;

      const nextLines = category.items
        .filter((item) => item !== itemKey)
        .map((item) => {
          const el = itemRefs.current.get(item);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            key: `${itemKey}-${item}`,
            x1,
            y1,
            x2: rect.left + rect.width / 2 - containerRect.left,
            y2: rect.top + rect.height / 2 - containerRect.top,
          };
        })
        .filter((line): line is ConstellationLine => line !== null);

      setLines(nextLines);
    },
    [category.items, isLg]
  );

  useEffect(() => {
    if (!activeItem || !isLg) return;

    const handleResize = () => computeLines(activeItem);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeItem, computeLines, isLg]);

  const handleActivate = (item: string) => {
    setActiveItem(item);
    computeLines(item);
  };

  const handleDeactivate = (relatedTarget: EventTarget | null) => {
    if (relatedTarget instanceof Node && containerRef.current?.contains(relatedTarget)) {
      return;
    }
    setActiveItem(null);
    setLines([]);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: catIdx * 0.07, ease: 'easeOut' }}
      className="relative rounded-xl border border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/55 dark:backdrop-blur-sm px-3.5 py-3 shadow-sm card-hover-glow grimoire-parchment overflow-hidden"
    >
      <h3 className="relative z-10 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-white mb-2">
        {category.title}
      </h3>
      <div ref={containerRef} className="relative z-10">
        {isLg && activeItem && lines.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {lines.map((line) => (
              <motion.line
                key={line.key}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--grimoire-gold)"
                strokeOpacity={0.2}
                strokeWidth={1}
                initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  ease: 'easeOut',
                }}
              />
            ))}
          </svg>
        )}
        <ul className="relative z-10 flex flex-wrap gap-1.5">
          {category.items.map((item) => (
            <li key={item}>
              <button
                type="button"
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(item, el);
                  } else {
                    itemRefs.current.delete(item);
                  }
                }}
                onMouseEnter={() => handleActivate(item)}
                onMouseLeave={() => {
                  setActiveItem(null);
                  setLines([]);
                }}
                onFocus={() => handleActivate(item)}
                onBlur={(event) => handleDeactivate(event.relatedTarget)}
                className={cn(
                  'text-[11px] leading-tight px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700',
                  'dark:bg-neutral-950 dark:text-white dark:border dark:border-neutral-600/70',
                  'transition-all duration-200 cursor-default',
                  'hover:bg-accent/10 hover:text-accent',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1',
                  'hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0'
                )}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default function SkillsGrid({ categories, className }: SkillsGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!categories.length) {
    return null;
  }

  return (
    <section id="skills" aria-label="Skills" className={cn('w-full', className)} ref={ref}>
      <h2 className="font-grimoire-heading text-xl sm:text-2xl font-semibold text-primary tracking-tight mb-4">
        Spell Schools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category, catIdx) => (
          <SkillCategoryCard
            key={category.title}
            category={category}
            catIdx={catIdx}
            isInView={isInView}
          />
        ))}
      </div>
    </section>
  );
}
