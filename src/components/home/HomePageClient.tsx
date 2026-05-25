'use client';

import Profile from '@/components/home/Profile';
import PublicationsList from '@/components/publications/PublicationsList';
import CardPage from '@/components/pages/CardPage';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
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
  );
}
