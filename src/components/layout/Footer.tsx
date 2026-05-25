'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import Journey, { type JourneyItem } from '@/components/layout/Journey';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
  journeyByLocale?: Record<string, JourneyItem[]>;
  journeyTitle?: string;
}

export default function Footer({
  lastUpdated,
  lastUpdatedByLocale,
  defaultLocale = 'en',
  journeyByLocale,
  journeyTitle = 'Journey',
}: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const journeyItems =
    journeyByLocale?.[locale] ||
    (defaultLocale ? journeyByLocale?.[defaultLocale] : undefined) ||
    [];

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="flex flex-col gap-2 shrink-0 order-2 lg:order-1">
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

          <Journey
            items={journeyItems}
            title={journeyTitle}
            className="order-1 lg:order-2 lg:max-w-[34rem] lg:ml-auto"
          />
        </div>
      </div>
    </footer>
  );
}
