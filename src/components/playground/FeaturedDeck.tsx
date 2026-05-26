'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import {
  categoryLabel,
  pickFeaturedProjects,
  shuffleIds,
  type PlaygroundProject,
} from '@/lib/playgroundProjects';
import { cn } from '@/lib/utils';

interface FeaturedDeckProps {
  projects: PlaygroundProject[];
  onViewProject: (id: string) => void;
}

function DeckCardFace({
  project,
  interactive,
  lifted,
}: {
  project: PlaygroundProject;
  interactive?: boolean;
  lifted?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card/90 text-card-foreground shadow-lg backdrop-blur-md transition-shadow duration-300',
        interactive && 'group',
        lifted && 'shadow-[0_24px_60px_var(--playground-section-shadow)]'
      )}
    >
      <div className={cn('absolute inset-0', project.accent)} />
      <div className="pg-card-sheen absolute inset-0" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="pg-media-frame mb-4 aspect-[16/10] overflow-hidden rounded-xl">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-end p-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {categoryLabel(project.category)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-border bg-muted/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-card-foreground">
              {categoryLabel(project.category)}
            </span>
            {project.date && (
              <span className="text-xs tabular-nums text-muted-foreground">{project.date}</span>
            )}
          </div>

          <h3 className="text-lg font-semibold leading-snug text-card-foreground sm:text-xl">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-surface/70 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium text-playground-accent transition-all duration-300',
              interactive && 'group-hover:gap-2'
            )}
          >
            View Project
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedDeck({ projects, onViewProject }: FeaturedDeckProps) {
  const featured = useMemo(() => pickFeaturedProjects(projects), [projects]);
  const [deckOrder, setDeckOrder] = useState(() => featured.map((p) => p.id));
  const [drawing, setDrawing] = useState(false);
  const [drawnId, setDrawnId] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const orderedProjects = useMemo(
    () =>
      deckOrder
        .map((id) => featured.find((p) => p.id === id))
        .filter((p): p is PlaygroundProject => Boolean(p)),
    [deckOrder, featured]
  );

  const drawProject = useCallback(() => {
    if (drawing || orderedProjects.length <= 1) return;
    const topId = deckOrder[0];
    setDrawing(true);
    setDrawnId(topId);
    window.setTimeout(() => {
      setDeckOrder((prev) => {
        const [top, ...rest] = prev;
        return [...rest, top];
      });
      setDrawnId(null);
      setDrawing(false);
    }, 520);
  }, [deckOrder, drawing, orderedProjects.length]);

  const shuffleDeck = useCallback(() => {
    setDeckOrder((prev) => shuffleIds(prev));
    setMobileIndex(0);
  }, []);

  const topProject = orderedProjects[0];
  const stackProjects = orderedProjects.slice(0, 5);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="order-2 lg:order-1">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={drawProject}
            className="rounded-full border border-border bg-playground-accent px-5 py-2.5 text-sm font-medium text-playground-accent-foreground transition hover:brightness-110"
          >
            Draw a Project
          </button>
          <button
            type="button"
            onClick={shuffleDeck}
            className="rounded-full border border-border bg-muted/70 px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            Shuffle
          </button>
        </div>

        {topProject && (
          <div className="mt-6 hidden max-w-md space-y-3 lg:block">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Now showing</p>
            <h3 className="text-2xl font-serif font-bold text-foreground">{topProject.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{topProject.summary}</p>
            <button
              type="button"
              onClick={() => onViewProject(topProject.id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-playground-accent transition hover:gap-3"
            >
              View Project
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative order-1 mx-auto hidden h-[420px] w-full max-w-md lg:order-2 lg:block">
        <AnimatePresence mode="popLayout">
          {stackProjects.map((project, index) => {
            const isTop = index === 0;
            const rotation = index === 0 ? -2 : index === 1 ? 3 : index === 2 ? -4 : index === 3 ? 5 : -6;
            const offsetY = index * 10;
            const offsetX = index * 6;
            const scale = 1 - index * 0.035;

            return (
              <motion.button
                key={project.id}
                type="button"
                layout
                initial={false}
                animate={{
                  opacity: drawnId === project.id && isTop ? 0 : 1 - index * 0.08,
                  rotate: drawnId === project.id && isTop ? 14 : rotation,
                  y: drawnId === project.id && isTop ? -20 : offsetY,
                  x: drawnId === project.id && isTop ? 240 : offsetX,
                  scale: drawnId === project.id && isTop ? 0.96 : scale,
                  zIndex: stackProjects.length - index,
                }}
                whileHover={isTop && !drawing ? { y: -8, rotate: 0, scale: 1.02 } : undefined}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                onClick={() => (isTop ? onViewProject(project.id) : undefined)}
                className={cn(
                  'absolute inset-0 h-full w-full text-left',
                  isTop ? 'cursor-pointer' : 'pointer-events-none'
                )}
                aria-label={isTop ? `View ${project.title}` : undefined}
              >
                <DeckCardFace project={project} interactive={isTop} lifted={isTop} />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="order-1 lg:order-2 lg:hidden">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4">
            {orderedProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setMobileIndex(index);
                  onViewProject(project.id);
                }}
                className={cn(
                  'snap-center shrink-0 w-[85vw] max-w-sm text-left transition',
                  index === mobileIndex ? 'opacity-100' : 'opacity-80'
                )}
              >
                <div className="h-[380px]">
                  <DeckCardFace project={project} interactive lifted={index === mobileIndex} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
