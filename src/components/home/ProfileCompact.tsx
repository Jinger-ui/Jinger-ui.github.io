'use client';

import Image from 'next/image';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

interface ProfileCompactProps {
  author: SiteConfig['author'];
  researchInterests?: string[];
  className?: string;
}

export default function ProfileCompact({
  author,
  researchInterests,
  className = '',
}: ProfileCompactProps) {
  const messages = useMessages();

  return (
    <section
      aria-label={author.name}
      className={`h-72 min-w-0 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col overflow-hidden ${className}`}
    >
      <div className="flex gap-4 p-4 shrink-0">
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
          <Image
            src={author.avatar}
            alt={author.name}
            width={80}
            height={80}
            className="w-full h-full object-cover object-[32%_center]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-serif font-bold text-primary leading-tight truncate">
            {author.name}
          </h2>
          <p className="text-sm text-accent font-medium mt-1 line-clamp-2">
            {author.title}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
            {author.institution}
          </p>
        </div>
      </div>

      {researchInterests && researchInterests.length > 0 && (
        <div className="flex-1 min-h-0 overflow-y-auto journey-scroll px-4 pb-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            {messages.profile.researchInterests}
          </h3>
          <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-400 leading-relaxed">
            {researchInterests.map((interest, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-accent shrink-0">·</span>
                <span>{interest}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
