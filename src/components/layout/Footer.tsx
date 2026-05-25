'use client';

import { usePathname } from 'next/navigation';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import Journey, { type JourneyItem } from '@/components/layout/Journey';
import ProfileCompact from '@/components/home/ProfileCompact';
import type { SiteConfig } from '@/lib/config';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
  journeyByLocale?: Record<string, JourneyItem[]>;
  journeyTitle?: string;
  author: SiteConfig['author'];
  authorByLocale?: Record<string, SiteConfig['author']>;
  researchInterests?: string[];
  researchInterestsByLocale?: Record<string, string[] | undefined>;
}

export default function Footer({
  lastUpdated,
  lastUpdatedByLocale,
  defaultLocale = 'en',
  journeyByLocale,
  journeyTitle = 'Journey',
  author,
  authorByLocale,
  researchInterests,
  researchInterestsByLocale,
}: FooterProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();
  const isHome = pathname === '/';

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const journeyItems =
    journeyByLocale?.[locale] ||
    (defaultLocale ? journeyByLocale?.[defaultLocale] : undefined) ||
    [];

  const resolvedAuthor =
    authorByLocale?.[locale] ||
    (defaultLocale ? authorByLocale?.[defaultLocale] : undefined) ||
    author;

  const resolvedInterests =
    researchInterestsByLocale?.[locale] ||
    (defaultLocale ? researchInterestsByLocale?.[defaultLocale] : undefined) ||
    researchInterests;

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isHome && journeyItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 items-stretch">
            <ProfileCompact
              author={resolvedAuthor}
              researchInterests={resolvedInterests}
            />
            <Journey
              items={journeyItems}
              title={journeyTitle}
              titleAlign="left"
              className="min-w-0"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-neutral-500">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <p className="text-xs text-neutral-500 flex items-center">
            <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer">
              {messages.footer.builtWithPrism}
            </a>
            <span className="ml-2">🚀</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
