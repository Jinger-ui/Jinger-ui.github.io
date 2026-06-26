'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CardItem } from '@/types/page';
import FeaturedDeck from '@/components/playground/FeaturedDeck';
import PlaygroundMasonry from '@/components/playground/PlaygroundMasonry';
import {
  enrichPlaygroundProjects,
  playgroundHref,
  type PlaygroundFilter,
} from '@/lib/playgroundProjects';

interface PlaygroundSectionProps {
  items: CardItem[];
}

export default function PlaygroundSection({ items }: PlaygroundSectionProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<PlaygroundFilter>('all');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const projects = useMemo(() => enrichPlaygroundProjects(items), [items]);

  if (items.length === 0) {
    return null;
  }

  const viewProject = (id: string) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    setHighlightedId(id);
    router.push(playgroundHref(project));
  };

  return (
    <section
      id="playground"
      className="playground-shell relative scroll-mt-24 overflow-hidden rounded-[2rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-10"
    >
      <div className="playground-shell-glow pointer-events-none absolute inset-x-0 top-0 h-44" />

      <div className="relative space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-playground-accent">
            Spell Workshop
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Draw a spell, shuffle the deck, or filter by school of magic.
          </h2>
          <p className="mt-4 text-sm leading-7 text-foreground/75 dark:text-white/78 sm:text-base">
            Research incantations, solo builds, published findings, and exploratory work from
            undergraduate and industry collaborations. Each card is a spell in the grimoire — draw
            one, then open its deeper build note on a shareable subpage.
          </p>
        </div>

        <FeaturedDeck projects={projects} onViewProject={viewProject} />
        <PlaygroundMasonry
          projects={projects}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          highlightedId={highlightedId}
          onViewProject={viewProject}
        />
      </div>
    </section>
  );
}
