'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';

export interface JourneyItem {
  date: string;
  content: string;
  kind?: 'education' | 'internship';
}

interface JourneyProps {
  items: JourneyItem[];
  title?: string;
  className?: string;
}

const kindStyles: Record<'education' | 'internship', string> = {
  education: 'bg-accent/15 text-accent border-accent/25',
  internship: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
};

const kindLabels: Record<'education' | 'internship', string> = {
  education: 'Education',
  internship: 'Internship',
};

export default function Journey({ items, title = 'Journey', className = '' }: JourneyProps) {
  useLocaleStore((state) => state.locale);

  if (!items.length) {
    return null;
  }

  return (
    <section
      id="journey"
      aria-label={title}
      className={`w-full ${className}`}
    >
      <div className="flex items-center justify-end gap-2 mb-3">
        <h2 className="text-sm font-serif font-bold text-primary tracking-tight">{title}</h2>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 select-none" aria-hidden="true">
          scroll →
        </span>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] justify-start lg:justify-end"
        role="list"
      >
        {items.map((item, index) => {
          const kind = item.kind === 'education' || item.kind === 'internship' ? item.kind : 'internship';

          return (
            <article
              key={`${item.date}-${index}`}
              role="listitem"
              className="snap-start shrink-0 w-[min(17.5rem,calc(100vw-3rem))] text-left rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3.5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${kindStyles[kind]}`}
                >
                  {kindLabels[kind]}
                </span>
                <time className="text-xs font-medium text-neutral-500 tabular-nums">{item.date}</time>
              </div>
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-400">{item.content}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
