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
      className="playground-shell relative scroll-mt-24 overflow-hidden rounded-[2rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-10"
    >
      <div className="playground-shell-glow pointer-events-none absolute inset-x-0 top-0 h-44" />

      <header className="relative mb-10 max-w-3xl">
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          A living archive of things I built, tested, and learned from.
        </p>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
          Playground
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
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

      <div className="relative border-t border-border pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground">Explore by Category</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Filter the archive wall, then dive into a project card.
            </p>
          </div>
          <p className="hidden text-sm tabular-nums text-muted-foreground sm:block">
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
