'use client';

import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { enrichPortfolioProjects, previewText } from '@/lib/portfolioProjects';
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

  const yearGroups = groupProjectsByYear(enrichPortfolioProjects(data.items));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">{data.title}</h1>
        {data.description && (
          <p className="text-lg text-neutral-600 dark:text-neutral-200 max-w-2xl leading-relaxed">
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

              <div className="relative space-y-4 lg:border-l-2 lg:border-accent/25 lg:pl-10">
                <span
                  className="hidden lg:block absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-white dark:bg-neutral-900"
                  aria-hidden="true"
                />
                {items.map((project) => (
                  <Link
                    key={project.slug}
                    href={project.href}
                    className="group block rounded-[1.35rem] border border-white/50 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-accent/60 hover:bg-white/80 hover:shadow-lg dark:border-white/10 dark:bg-neutral-950/60 dark:hover:bg-neutral-900/85"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {project.date && (
                            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold tabular-nums text-accent">
                              {project.date}
                            </span>
                          )}
                          {project.subtitle && (
                            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                              {project.subtitle}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold leading-snug text-primary group-hover:text-accent">
                          {project.title}
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral-700 dark:text-neutral-100">
                          {previewText(project)}
                        </p>
                      </div>
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 transition group-hover:border-accent group-hover:bg-accent group-hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-white">
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-neutral-200/80 bg-neutral-50/80 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:border-white/10 dark:bg-white/10 dark:text-neutral-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
