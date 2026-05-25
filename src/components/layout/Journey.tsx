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
      <div className="flex items-center justify-end gap-2 mb-2.5">
        <h2 className="text-sm font-serif font-bold text-primary tracking-tight">{title}</h2>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 select-none" aria-hidden="true">
          scroll ↓
        </span>
      </div>

      <div
        className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-sm overflow-hidden"
        style={{ maxHeight: '15.5rem' }}
      >
        <div
          className="overflow-y-auto overscroll-y-contain scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] px-4 py-3.5"
          style={{ maxHeight: '15.5rem' }}
          role="list"
          aria-label={`${title} timeline`}
        >
          <ol className="relative ml-2 border-l-2 border-neutral-200 dark:border-neutral-700">
            {items.map((item, index) => {
              const kind = item.kind === 'education' || item.kind === 'internship' ? item.kind : 'internship';
              const isLast = index === items.length - 1;

              return (
                <li
                  key={`${item.date}-${index}`}
                  role="listitem"
                  className={`relative pl-5 ${isLast ? 'pb-0' : 'pb-5'}`}
                >
                  <span
                    className="absolute -left-[5px] top-1.5 z-10 h-2 w-2 rounded-full border-2 border-accent bg-background dark:bg-neutral-900"
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <time className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
                      {item.date}
                    </time>
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${kindStyles[kind]}`}
                    >
                      {kindLabels[kind]}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-400">
                    {item.content}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/95 to-transparent dark:from-neutral-900/95"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
