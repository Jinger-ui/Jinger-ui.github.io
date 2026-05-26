'use client';

import Profile from '@/components/home/Profile';
import SkillsGrid, { type SkillCategory } from '@/components/home/SkillsGrid';
import HomeContact from '@/components/home/HomeContact';
import PublicationsList from '@/components/publications/PublicationsList';
import CardPage from '@/components/pages/CardPage';
import PlaygroundSection from '@/components/playground/PlaygroundSection';
import Journey, { type JourneyItem } from '@/components/layout/Journey';
import type { SiteConfig } from '@/lib/config';
import { Publication } from '@/types/publication';
import { CardPageConfig, PublicationPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

type PageData =
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'card'; id: string; config: CardPageConfig }
  | { type: 'playground'; id: 'playground'; items: CardPageConfig['items'] };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  journeyItems: JourneyItem[];
  skillCategories: SkillCategory[];
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
    <div className="bg-transparent dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section id="home-intro" className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start lg:items-stretch">
            <div className="lg:col-span-1">
              <Profile
                author={data.author}
                social={data.social}
                features={data.features}
                researchInterests={data.researchInterests}
                hideContactLinks
              />
            </div>

            {data.journeyItems.length > 0 && (
              <div className="lg:col-span-2 lg:col-start-2 flex flex-col min-h-0 h-full w-full">
                <Journey
                  items={data.journeyItems}
                  title="Journey"
                  titleImage="/journey-light.png"
                  titleImageDark="/black.png"
                  titleAlign="left"
                  variant="compact"
                  fillHeight
                  layout="split"
                />
              </div>
            )}
          </div>

          {data.skillCategories.length > 0 && (
            <SkillsGrid categories={data.skillCategories} className="mt-10" />
          )}

          <HomeContact
            social={data.social}
            className="mt-10 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60"
          />
        </section>

        <div className="space-y-12">
          {data.pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24">
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                  cardStyle={page.id === 'awards' ? 'solid' : 'glass'}
                />
              )}
              {page.type === 'playground' && <PlaygroundSection items={page.items} />}
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
    </div>
  );
}
