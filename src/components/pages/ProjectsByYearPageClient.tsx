'use client';

import CardPage from '@/components/pages/CardPage';
import { groupProjectsByYear } from '@/lib/projectsByYear';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { CardItem } from '@/types/page';

export interface ProjectsByYearPageLocaleData {
  title: string;
  description?: string;
  items: CardItem[];
}

interface ProjectsByYearPageClientProps {
  dataByLocale: Record<string, ProjectsByYearPageLocaleData>;
  defaultLocale: string;
}

export default function ProjectsByYearPageClient({
  dataByLocale,
  defaultLocale,
}: ProjectsByYearPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  const yearGroups = groupProjectsByYear(data.items);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">{data.title}</h1>
        {data.description && (
          <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed">
            {data.description}
          </p>
        )}
      </header>

      <div className="space-y-14">
        {yearGroups.map(({ year, items }) => (
          <section key={year} id={`year-${year}`} className="scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-[5rem_minmax(0,1fr)] gap-6 lg:gap-10">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 className="text-3xl font-serif font-bold text-accent tabular-nums">{year}</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {items.length} project{items.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="relative lg:border-l-2 lg:border-accent/25 lg:pl-10">
                <span
                  className="hidden lg:block absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-background"
                  aria-hidden="true"
                />
                <CardPage
                  config={{ type: 'card', title: '', items }}
                  embedded
                  hideHeader
                />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
