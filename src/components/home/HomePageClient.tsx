'use client';

import Profile from '@/components/home/Profile';
import PublicationsList from '@/components/publications/PublicationsList';
import CardPage from '@/components/pages/CardPage';
import Journey, { type JourneyItem } from '@/components/layout/Journey';
import type { SiteConfig } from '@/lib/config';
import { Publication } from '@/types/publication';
import { CardPageConfig, PublicationPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

type PageData =
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'card'; id: string; config: CardPageConfig };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  journeyItems: JourneyItem[];
  pagesToShow: PageData[];
}

interface HomePageClientProps {
  dataByLocale: Record<string, HomePageLocaleData>;
  defaultLocale: string;
}

export default function HomePageClient({ dataByLocale, defaultLocale }: HomePageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12 flex justify-center">
          <div className="w-full max-w-xl">
            <Profile
              author={data.author}
              social={data.social}
              features={data.features}
              researchInterests={data.researchInterests}
              hideContactLinks
            />
          </div>
        </header>

        <div className="space-y-12">
          {data.pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24">
              {page.type === 'card' && (
                <CardPage config={page.config} embedded={true} />
              )}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>

      {data.journeyItems.length > 0 && (
        <section
          id="journey-home"
          className="snap-start snap-always min-h-[100svh] scroll-mt-24 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 mt-24 border-t border-neutral-200/40 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/20"
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col min-h-[calc(100svh-8rem)] justify-center">
            <Journey
              items={data.journeyItems}
              title="Journey"
              titleAlign="left"
              variant="fullscreen"
            />
          </div>
        </section>
      )}
    </div>
  );
}
