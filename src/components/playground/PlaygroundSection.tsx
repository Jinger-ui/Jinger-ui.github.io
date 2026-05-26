'use client';

import { useMemo, useState } from 'react';
import type { CardItem } from '@/types/page';
import {
  enrichPlaygroundProjects,
  type PlaygroundFilter,
} from '@/lib/playgroundProjects';
import FeaturedDeck from '@/components/playground/FeaturedDeck';
import PlaygroundMasonry from '@/components/playground/PlaygroundMasonry';

interface PlaygroundSectionProps {
  items: CardItem[];
}

export default function PlaygroundSection({ items }: PlaygroundSectionProps) {
  const projects = useMemo(() => enrichPlaygroundProjects(items), [items]);
  const [activeFilter, setActiveFilter] = useState<PlaygroundFilter>('all');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  return (
    <section
      id="playground"
      className="relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-neutral-800/80 bg-neutral-950 px-5 py-12 text-white shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:px-8 sm:py-14 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_70%)]" />

      <header className="relative mb-10 max-w-3xl">
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white/40">
          A living archive of things I built, tested, and learned from.
        </p>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl">
          Playground
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
          Experiments, prototypes, and exploratory builds across design, code, research, and systems.
        </p>
      </header>

      <div className="relative mb-14">
        <FeaturedDeck
          projects={projects}
          onViewProject={(id) => {
            setHighlightedId(id);
            setActiveFilter('all');
          }}
        />
      </div>

      <div className="relative border-t border-white/10 pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Explore by Category</h3>
            <p className="mt-1 text-sm text-white/45">
              Filter the archive wall, then dive into a project card.
            </p>
          </div>
          <p className="hidden text-sm tabular-nums text-white/40 sm:block">
            {projects.length} projects
          </p>
        </div>

        <PlaygroundMasonry
          projects={projects}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          highlightedId={highlightedId}
        />
      </div>
    </section>
  );
}
