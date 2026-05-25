'use client';

export interface JourneyItem {
  date: string;
  content: string;
  kind?: 'education' | 'internship' | 'research';
}

interface JourneyProps {
  items: JourneyItem[];
  title?: string;
  className?: string;
  titleAlign?: 'left' | 'right';
  variant?: 'compact' | 'fullscreen';
}

const kindStyles: Record<'education' | 'internship' | 'research', string> = {
  education: 'bg-accent/15 text-accent border-accent/25',
  internship: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  research: 'bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-300 dark:border-sky-500/30',
};

const kindLabels: Record<'education' | 'internship' | 'research', string> = {
  education: 'Education',
  internship: 'Internship',
  research: 'Research',
};

function resolveKind(kind?: string): 'education' | 'internship' | 'research' {
  if (kind === 'education' || kind === 'internship' || kind === 'research') {
    return kind;
  }
  return 'internship';
}

export default function Journey({
  items,
  title = 'Journey',
  className = '',
  titleAlign = 'right',
  variant = 'compact',
}: JourneyProps) {
  const isFullscreen = variant === 'fullscreen';

  if (!items.length) {
    return null;
  }

  return (
    <section
      id="journey"
      aria-label={title}
      className={`w-full min-w-0 ${className}`}
    >
      <div
        className={`flex items-center gap-2 mb-3 ${titleAlign === 'left' ? 'justify-start' : 'justify-end'}`}
      >
        <h2
          className={
            isFullscreen
              ? 'text-2xl font-serif font-bold text-primary tracking-tight'
              : 'text-sm font-serif font-bold text-primary tracking-tight'
          }
        >
          {title}
        </h2>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 select-none" aria-hidden="true">
          wheel ↓
        </span>
      </div>

      <div
        className={
          isFullscreen
            ? 'relative flex-1 min-h-[min(72vh,calc(100svh-11rem))] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md'
            : 'relative h-72 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm'
        }
      >
        <div
          tabIndex={0}
          className="journey-scroll h-full overflow-y-auto overscroll-y-contain touch-pan-y px-5 py-4 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-[inherit]"
          role="list"
          aria-label={`${title} timeline`}
        >
          <ol className="relative ml-2 border-l-2 border-accent/35 dark:border-accent/25">
            {items.map((item, index) => {
              const kind = resolveKind(item.kind);
              const isLast = index === items.length - 1;

              return (
                <li
                  key={`${item.date}-${index}`}
                  role="listitem"
                  className={`relative pl-5 ${isLast ? 'pb-1' : isFullscreen ? 'pb-6' : 'pb-5'}`}
                >
                  <span
                    className="absolute -left-[6px] top-1.5 z-10 h-2.5 w-2.5 rounded-full border-2 border-accent bg-white dark:bg-neutral-900 shadow-sm"
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <time
                      className={
                        isFullscreen
                          ? 'text-sm font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums'
                          : 'text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums'
                      }
                    >
                      {item.date}
                    </time>
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${kindStyles[kind]}`}
                    >
                      {kindLabels[kind]}
                    </span>
                  </div>

                  <p
                    className={
                      isFullscreen
                        ? 'text-sm leading-relaxed text-neutral-700 dark:text-neutral-400'
                        : 'text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-400'
                    }
                  >
                    {item.content}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-[inherit] bg-gradient-to-t from-white via-white/85 to-transparent dark:from-neutral-900 dark:via-neutral-900/85"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
