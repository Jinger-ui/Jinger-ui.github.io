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
      <header className="mb-14">
        <h1
          className="text-[42px] font-bold text-primary mb-4 leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {data.title}
        </h1>
        {data.description && (
          <p className="text-base leading-relaxed text-neutral-500 dark:text-[#8fa0b5] max-w-2xl">
            {data.description}
          </p>
        )}
      </header>

      <div className="space-y-16">
        {yearGroups.map(({ year, items }) => (
          <section key={year} id={`year-${year}`} className="scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-[6rem_minmax(0,1fr)] gap-6 lg:gap-10">
              {/* Year label */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2
                  className="text-[30px] font-bold text-accent tabular-nums tracking-wide"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {year}
                </h2>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5 font-medium">
                  {items.length} project{items.length === 1 ? '' : 's'}
                </p>
              </div>

              {/* Timeline column */}
              <div className="relative space-y-6 lg:border-l-2 lg:border-accent/30 lg:pl-10">
                {/* Timeline dot */}
                <span
                  className="hidden lg:block absolute -left-[7px] top-3 h-3.5 w-3.5 rounded-full border-2 border-accent bg-white dark:bg-neutral-900 shadow-[0_0_6px_rgba(212,165,98,0.3)]"
                  aria-hidden="true"
                />

                {items.map((project, idx) => (
                  <Link
                    key={project.slug}
                    href={project.href}
                    className="group block no-underline"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="scroll-card animate-fade-in-up">
                      {/* Left scroll roll */}
                      <div className="scroll-roll left hidden sm:block" aria-hidden="true" />

                      {/* Parchment body */}
                      <div className="scroll-paper">
                        {/* Magic glyph decoration */}
                        <div className="scroll-glyph" aria-hidden="true" />

                        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            {/* Meta row */}
                            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                              {project.date && (
                                <span className="rounded-full bg-[rgba(120,84,34,0.1)] dark:bg-accent/15 px-2.5 py-1 text-xs font-bold tabular-nums text-[#6e4d23] dark:text-accent border border-[rgba(120,84,34,0.18)] dark:border-accent/25">
                                  {project.date}
                                </span>
                              )}
                              {project.subtitle && (
                                <span className="text-[13px] font-semibold text-[#6f5d49] dark:text-[#9aa8ba]">
                                  {project.subtitle}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3
                              className="text-[21px] font-semibold leading-snug text-[#2d2218] dark:text-[#f8fafc] group-hover:text-accent transition-colors duration-200"
                              style={{ fontFamily: 'var(--font-sans)' }}
                            >
                              {project.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-2.5 max-w-3xl text-[15px] leading-[1.75] text-[#4f4032] dark:text-[#9aa8ba]">
                              {previewText(project)}
                            </p>
                          </div>

                          {/* Arrow button */}
                          <span className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[rgba(92,67,37,0.25)] dark:border-accent/25 bg-[rgba(255,248,230,0.5)] dark:bg-accent/10 text-[#5f4527] dark:text-accent transition-all duration-200 group-hover:bg-accent group-hover:text-white group-hover:border-accent group-hover:shadow-[0_0_12px_rgba(212,165,98,0.3)]">
                            <ArrowUpRightIcon className="h-4 w-4" />
                          </span>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.slice(0, 6).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full px-2.5 py-1 text-xs font-medium text-[#5a4736] dark:text-[#cbd5e1] bg-[rgba(102,73,36,0.07)] dark:bg-[rgba(255,255,255,0.07)] border border-[rgba(102,73,36,0.15)] dark:border-[rgba(255,255,255,0.12)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right scroll roll */}
                      <div className="scroll-roll right hidden sm:block" aria-hidden="true" />
                    </div>
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
