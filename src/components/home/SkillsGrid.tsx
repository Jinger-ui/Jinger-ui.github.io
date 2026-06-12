'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkillCategory {
  title: string;
  items: string[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
  className?: string;
}

export default function SkillsGrid({ categories, className }: SkillsGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!categories.length) {
    return null;
  }

  return (
    <section id="skills" aria-label="Skills" className={cn('w-full', className)} ref={ref}>
      <h2 className="text-sm font-serif font-bold text-primary tracking-tight mb-4">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category, catIdx) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: catIdx * 0.07, ease: 'easeOut' }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/55 dark:backdrop-blur-sm px-3.5 py-3 shadow-sm card-hover-glow"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-white mb-2">
              {category.title}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="text-[11px] leading-tight px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-950 dark:text-white dark:border dark:border-neutral-600/70 transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:scale-105 cursor-default"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
