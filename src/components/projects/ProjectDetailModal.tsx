'use client';

import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CardItem } from '@/types/page';
import { cn } from '@/lib/utils';

const markdownComponents = {
  p: ({ children }: React.ComponentProps<'p'>) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: React.ComponentProps<'ul'>) => (
    <ul className="mb-3 list-disc space-y-2 pl-5">{children}</ul>
  ),
  ol: ({ children }: React.ComponentProps<'ol'>) => (
    <ol className="mb-3 list-decimal space-y-2 pl-5">{children}</ol>
  ),
  li: ({ children }: React.ComponentProps<'li'>) => <li>{children}</li>,
  a: ({ ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent transition hover:underline"
    />
  ),
  strong: ({ children }: React.ComponentProps<'strong'>) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }: React.ComponentProps<'code'>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[0.92em]">{children}</code>
  ),
};

const PLACEHOLDER_GRADIENTS = [
  'from-amber-500/35 via-orange-400/20 to-rose-400/25',
  'from-sky-500/35 via-blue-400/20 to-indigo-400/25',
  'from-emerald-500/35 via-teal-400/20 to-cyan-400/25',
  'from-violet-500/35 via-purple-400/20 to-fuchsia-400/25',
  'from-rose-500/35 via-pink-400/20 to-orange-400/25',
  'from-lime-500/30 via-green-400/20 to-emerald-400/25',
];

function placeholderGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash + title.charCodeAt(i) * (i + 1)) % PLACEHOLDER_GRADIENTS.length;
  }
  return PLACEHOLDER_GRADIENTS[hash];
}

interface ProjectDetailModalProps {
  project: CardItem | null;
  onClose: () => void;
  accentClass?: string;
}

export default function ProjectDetailModal({
  project,
  onClose,
  accentClass,
}: ProjectDetailModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close project details"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl sm:rounded-3xl"
          >
            <div className="relative shrink-0">
              {project.image ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex aspect-[16/9] w-full items-end bg-gradient-to-br p-6',
                    accentClass || placeholderGradient(project.title)
                  )}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Project Preview
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-md backdrop-blur-md transition hover:bg-muted"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2
                    id="project-modal-title"
                    className="font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl"
                  >
                    {project.title}
                  </h2>
                  {project.subtitle && (
                    <p className="mt-2 text-sm font-medium text-accent sm:text-base">
                      {project.subtitle}
                    </p>
                  )}
                </div>
                {project.date && (
                  <span className="shrink-0 rounded-full border border-border bg-muted/80 px-3 py-1 text-sm font-medium tabular-nums text-muted-foreground">
                    {project.date}
                  </span>
                )}
              </div>

              {project.content && (
                <div className="text-sm text-muted-foreground sm:text-base">
                  <ReactMarkdown components={markdownComponents}>
                    {project.content}
                  </ReactMarkdown>
                </div>
              )}

              {project.tags && project.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-muted/70 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex text-sm font-medium text-accent hover:underline"
                >
                  Open project link
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
