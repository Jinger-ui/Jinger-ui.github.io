'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import {
  categoryLabel,
  PLAYGROUND_CATEGORIES,
  type PlaygroundFilter,
  type PlaygroundProject,
} from '@/lib/playgroundProjects';
import { cn } from '@/lib/utils';

interface PlaygroundMasonryProps {
  projects: PlaygroundProject[];
  activeFilter: PlaygroundFilter;
  onFilterChange: (filter: PlaygroundFilter) => void;
  highlightedId?: string | null;
}

const heightPattern = ['md', 'lg', 'sm', 'md', 'sm', 'lg', 'md', 'sm'] as const;

function cardHeightClass(pattern: (typeof heightPattern)[number]): string {
  switch (pattern) {
    case 'lg':
      return 'min-h-[320px]';
    case 'sm':
      return 'min-h-[240px]';
    default:
      return 'min-h-[280px]';
  }
}

export default function PlaygroundMasonry({
  projects,
  activeFilter,
  onFilterChange,
  highlightedId,
}: PlaygroundMasonryProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!highlightedId) return;
    const node = document.getElementById(`playground-card-${highlightedId}`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setExpandedId(highlightedId);
    const timer = window.setTimeout(() => setExpandedId(null), 1800);
    return () => window.clearTimeout(timer);
  }, [highlightedId]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLAYGROUND_CATEGORIES.map((category) => {
          const active = activeFilter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onFilterChange(category.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                active
                  ? 'border-white/25 bg-white text-neutral-950'
                  : 'border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:text-white'
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <motion.div layout className="columns-1 gap-4 md:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            const heightKey = heightPattern[index % heightPattern.length];
            const isExpanded = expandedId === project.id;

            return (
              <motion.article
                key={project.id}
                layout
                initial={mounted ? { opacity: 0, y: 18 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: mounted ? index * 0.03 : 0 }}
                id={`playground-card-${project.id}`}
                className={cn(
                  'mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300',
                  cardHeightClass(heightKey),
                  isExpanded && 'ring-2 ring-white/30'
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId((prev) => (prev === project.id ? null : project.id))}
                  className="group relative block h-full w-full text-left"
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', project.accent)} />
                  <div className="absolute inset-0 bg-neutral-950/20 transition duration-500 group-hover:bg-neutral-950/45 md:group-hover:bg-neutral-950/55" />

                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
                          {categoryLabel(project.category)}
                        </span>
                        {project.date && (
                          <span className="text-xs tabular-nums text-white/45">{project.date}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold leading-snug text-white">{project.title}</h3>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div
                        className={cn(
                          'space-y-2 transition-all duration-300',
                          'max-h-0 overflow-hidden opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100',
                          expandedId === project.id && 'max-h-40 opacity-100'
                        )}
                      >
                        <p className="text-sm leading-relaxed text-white/70">{project.summary}</p>
                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-white/55"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition group-hover:scale-105 group-hover:bg-white group-hover:text-neutral-950">
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
