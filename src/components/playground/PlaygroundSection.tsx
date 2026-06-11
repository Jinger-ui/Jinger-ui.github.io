'use client';

import type { CardItem } from '@/types/page';
import PlaygroundCardGrid from '@/components/playground/PlaygroundCardGrid';

interface PlaygroundSectionProps {
  items: CardItem[];
}

export default function PlaygroundSection({ items }: PlaygroundSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="playground"
      className="playground-shell relative scroll-mt-24 overflow-hidden rounded-[2rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-10"
    >
      <div className="playground-shell-glow pointer-events-none absolute inset-x-0 top-0 h-44" />

      <PlaygroundCardGrid
        title="Playground"
        description="Earlier research, individual builds, publications, and exploratory work from undergraduate and industry collaborations."
        items={items}
        embedded
        cardStyle="glass"
        hintText="Open playground page"
      />
    </section>
  );
}
