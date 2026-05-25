'use client';

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
  if (!categories.length) {
    return null;
  }

  return (
    <section id="skills" aria-label="Skills" className={cn('w-full', className)}>
      <h2 className="text-sm font-serif font-bold text-primary tracking-tight mb-4">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <article
            key={category.title}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-3 shadow-sm"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
              {category.title}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="text-[11px] leading-tight px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
