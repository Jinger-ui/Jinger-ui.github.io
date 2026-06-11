'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { CardPageConfig } from '@/types/page';
import { enrichPortfolioProjects, previewText } from '@/lib/portfolioProjects';
import { cn } from '@/lib/utils';

const markdownComponents = {
  p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
};

const cardSurfaceClass = {
  solid: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm',
  glass:
    'bg-white/55 dark:bg-neutral-900/35 backdrop-blur-xl backdrop-saturate-150 border border-white/50 dark:border-white/10 shadow-sm',
} as const;

const PLACEHOLDER_GRADIENTS = [
  'from-amber-500/40 via-orange-300/25 to-yellow-200/20',
  'from-sky-500/40 via-blue-300/25 to-indigo-200/20',
  'from-emerald-500/40 via-teal-300/25 to-cyan-200/20',
  'from-violet-500/40 via-purple-300/25 to-fuchsia-200/20',
  'from-rose-500/40 via-pink-300/25 to-orange-200/20',
];

function placeholderGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash + title.charCodeAt(i) * (i + 1)) % PLACEHOLDER_GRADIENTS.length;
  }
  return PLACEHOLDER_GRADIENTS[hash];
}

interface ProjectCardGridProps {
  config: CardPageConfig;
  embedded?: boolean;
  hideHeader?: boolean;
  cardStyle?: keyof typeof cardSurfaceClass;
  hintText?: string;
}

export default function ProjectCardGrid({
  config,
  embedded = false,
  hideHeader = false,
  cardStyle = 'glass',
  hintText = 'Open case study',
}: ProjectCardGridProps) {
  const projects = enrichPortfolioProjects(config.items);
  const isGlass = cardStyle === 'glass';
  const coverFrameClass = isGlass
    ? 'border-white/40 dark:border-white/10 bg-white/30 dark:bg-neutral-800/30'
    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50';

  return (
    <div>
      {!hideHeader && (
        <div className={embedded ? 'mb-4' : 'mb-8'}>
          <h1
            className={`${embedded ? 'text-2xl' : 'text-4xl'} mb-4 font-serif font-bold text-primary`}
          >
            {config.title}
          </h1>
          {config.description && (
            <div
              className={`${embedded ? 'text-base' : 'text-lg'} max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-500`}
            >
              <ReactMarkdown components={markdownComponents}>{config.description}</ReactMarkdown>
            </div>
          )}
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Cards open dedicated project pages with cover art, delivery notes, and shareable URLs.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={project.href}
            aria-label={`Open project page for ${project.title}`}
            className={cn(
              cardSurfaceClass[cardStyle],
              'group flex h-full flex-col overflow-hidden rounded-2xl text-left transition-all duration-200',
              'hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              isGlass && 'hover:bg-white/70 dark:hover:bg-neutral-900/50'
            )}
          >
            <div className={cn('relative aspect-[16/10] overflow-hidden border-b', coverFrameClass)}>
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div
                  className={cn(
                    'flex h-full w-full items-end bg-gradient-to-br p-4',
                    placeholderGradient(project.title)
                  )}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600/80 dark:text-neutral-300/80">
                    {project.date || 'Project'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug text-primary sm:text-lg">
                  {project.title}
                </h3>
                {project.date && (
                  <span className="shrink-0 rounded-full border border-neutral-200/80 bg-neutral-100/80 px-2 py-0.5 text-xs tabular-nums text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300">
                    {project.date}
                  </span>
                )}
              </div>

              {project.subtitle && (
                <p className="mb-2 text-xs font-medium text-accent sm:text-sm">{project.subtitle}</p>
              )}

              <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-500">
                {previewText(project)}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-200/80 bg-neutral-50/80 px-2 py-0.5 text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <span className="mt-4 text-xs font-medium text-accent opacity-80 transition group-hover:opacity-100">
                {hintText}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
