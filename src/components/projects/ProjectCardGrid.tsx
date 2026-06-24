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
              className={`${embedded ? 'text-base' : 'text-lg'} max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-200`}
            >
              <ReactMarkdown components={markdownComponents}>{config.description}</ReactMarkdown>
            </div>
          )}
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-300">
            Flip a card, then open a dedicated project page with cover art, delivery notes, and a shareable URL.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={project.href}
            aria-label={`Open project page for ${project.title}`}
            className={cn(
              'group block h-[360px] rounded-[1.6rem] outline-none [perspective:1300px] animate-fade-in-up',
              'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <article
              className={cn(
                'relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]',
                'group-hover:-translate-y-1 group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]'
              )}
            >
              <div
                className={cn(
                  cardSurfaceClass[cardStyle],
                  'absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] text-left [backface-visibility:hidden]',
                  'shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:shadow-[0_24px_70px_rgba(15,23,42,0.15),0_0_0_1px_rgba(212,165,98,0.15)]',
                  isGlass && 'dark:bg-neutral-950/60'
                )}
              >
                <div className={cn('relative aspect-[16/10] overflow-hidden border-b', coverFrameClass)}>
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-contain object-center transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={cn(
                        'flex h-full w-full items-end bg-gradient-to-br p-4 animate-gradient-shift',
                        placeholderGradient(project.title)
                      )}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600/80 dark:text-neutral-100/85">
                        {project.date || 'Project'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950/45 to-transparent" />
                  {project.date && (
                    <span className="absolute right-3 top-3 rounded-full border border-white/50 bg-white/80 px-2.5 py-1 text-xs font-semibold tabular-nums text-neutral-700 backdrop-blur dark:border-white/15 dark:bg-neutral-950/70 dark:text-white">
                      {project.date}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    Selected case study
                  </span>
                  <h3 className="text-lg font-semibold leading-snug text-primary sm:text-xl">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-2 text-xs font-medium text-accent sm:text-sm">{project.subtitle}</p>
                  )}
                  <p className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-200">
                    Hover / tap to flip
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  cardSurfaceClass[cardStyle],
                  'absolute inset-0 flex flex-col rounded-[1.6rem] p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]',
                  'bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.13)] dark:bg-neutral-950/88'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                    Back of card
                  </span>
                  {project.date && (
                    <span className="text-xs font-semibold tabular-nums text-neutral-600 dark:text-neutral-100">
                      {project.date}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-serif font-bold leading-tight text-primary">
                  {project.title}
                </h3>
                <p className="mt-3 line-clamp-5 text-sm leading-7 text-neutral-700 dark:text-neutral-100">
                  {previewText(project)}
                </p>

                {project.tags && project.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
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

                <span className="mt-auto inline-flex w-fit rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-accent dark:bg-white dark:text-neutral-950">
                  {hintText}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
