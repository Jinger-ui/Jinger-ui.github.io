'use client';

export interface JourneyItem {
  date: string;
  end_date?: string;
  content: string;
  kind?: 'education' | 'internship' | 'research';
}

interface JourneyProps {
  items: JourneyItem[];
  title?: string;
  className?: string;
  titleAlign?: 'left' | 'right';
  variant?: 'compact' | 'fullscreen';
  panelClassName?: string;
  /** Stretch panel to fill parent height (e.g. align with Profile column on Home). */
  fillHeight?: boolean;
  /** Split into Internship (left) and Academic / Research (right) columns. */
  layout?: 'single' | 'split';
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

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatYearMonth(value: string): string {
  const [year, month] = value.split('-');
  if (!year || !month) {
    return value;
  }
  const monthIndex = Number.parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return value;
  }
  return `${MONTH_LABELS[monthIndex]} ${year}`;
}

function formatJourneyPeriod(item: JourneyItem): string {
  const kind = resolveKind(item.kind);
  const start = formatYearMonth(item.date);

  if (kind !== 'internship') {
    return start;
  }

  if (item.end_date) {
    return `${start} – ${formatYearMonth(item.end_date)}`;
  }

  return start;
}

function isAcademicKind(kind?: string): boolean {
  const resolved = resolveKind(kind);
  return resolved === 'education' || resolved === 'research';
}

interface TimelineListProps {
  items: JourneyItem[];
  isFullscreen: boolean;
  ariaLabel: string;
}

function TimelineList({ items, isFullscreen, ariaLabel }: TimelineListProps) {
  if (!items.length) {
    return (
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic px-1 py-2">
        No entries yet.
      </p>
    );
  }

  return (
    <ol
      className="relative ml-2 border-l-2 border-accent/35 dark:border-accent/25"
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const kind = resolveKind(item.kind);
        const isLast = index === items.length - 1;

        return (
          <li
            key={`${item.date}-${index}-${kind}`}
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
                      {formatJourneyPeriod(item)}
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
  );
}

interface TimelinePanelProps {
  items: JourneyItem[];
  isFullscreen: boolean;
  ariaLabel: string;
  className?: string;
}

function TimelinePanel({ items, isFullscreen, ariaLabel, className = '' }: TimelinePanelProps) {
  return (
    <div className={`relative flex flex-col min-h-0 min-w-0 ${className}`}>
      <div
        tabIndex={0}
        className="journey-scroll flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-4 py-3 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-[inherit]"
      >
        <TimelineList items={items} isFullscreen={isFullscreen} ariaLabel={ariaLabel} />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-neutral-900 dark:via-neutral-900/85"
        aria-hidden="true"
      />
    </div>
  );
}

export default function Journey({
  items,
  title = 'Journey',
  className = '',
  titleAlign = 'right',
  variant = 'compact',
  panelClassName,
  fillHeight = false,
  layout = 'single',
}: JourneyProps) {
  const isFullscreen = variant === 'fullscreen';
  const isSplit = layout === 'split';

  if (!items.length) {
    return null;
  }

  const internshipItems = items.filter((item) => resolveKind(item.kind) === 'internship');
  const academicItems = items.filter((item) => isAcademicKind(item.kind));

  const panelBaseClass =
    'relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm';

  const panelSizeClass = panelClassName
    ? panelClassName
    : fillHeight
      ? 'h-72 lg:h-auto lg:flex-1 lg:min-h-0'
      : isFullscreen
        ? 'flex-1 min-h-[min(72vh,calc(100svh-11rem))] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md'
        : 'h-72';

  const panelRoundedClass =
    panelClassName || fillHeight || !isFullscreen
      ? panelBaseClass
      : 'relative flex-1 min-h-[min(72vh,calc(100svh-11rem))] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md';

  const panelClass =
    isFullscreen && !panelClassName && !fillHeight
      ? panelRoundedClass
      : `${panelBaseClass} ${panelSizeClass}`;

  return (
    <section
      id="journey"
      aria-label={title}
      className={`w-full min-w-0 ${fillHeight ? 'flex flex-col lg:flex-1 lg:min-h-0 lg:h-full' : ''} ${className}`}
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

      {isSplit ? (
        <div className={`${panelClass} flex flex-col min-h-0`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 flex-1 min-h-0 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80 dark:divide-neutral-800/80">
            <div className="flex flex-col min-h-0 min-w-0">
              <h3 className="shrink-0 px-4 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-800/60">
                Internship
              </h3>
              <TimelinePanel
                items={internshipItems}
                isFullscreen={isFullscreen}
                ariaLabel="Internship timeline"
                className="flex-1"
              />
            </div>
            <div className="flex flex-col min-h-0 min-w-0">
              <h3 className="shrink-0 px-4 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-800/60">
                Academic
              </h3>
              <TimelinePanel
                items={academicItems}
                isFullscreen={isFullscreen}
                ariaLabel="Academic timeline"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={panelClass}>
          <div
            tabIndex={0}
            className="journey-scroll h-full overflow-y-auto overscroll-y-contain touch-pan-y px-5 py-4 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-[inherit]"
            role="list"
            aria-label={`${title} timeline`}
          >
            <TimelineList items={items} isFullscreen={isFullscreen} ariaLabel={`${title} timeline`} />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-[inherit] bg-gradient-to-t from-white via-white/85 to-transparent dark:from-neutral-900 dark:via-neutral-900/85"
            aria-hidden="true"
          />
        </div>
      )}
    </section>
  );
}
