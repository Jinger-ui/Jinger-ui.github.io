'use client';

import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import Journey, { type JourneyItem } from '@/components/layout/Journey';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { SectionConfig } from '@/lib/sections';

export interface AboutPageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  researchInterests?: string[];
  sections: SectionConfig[];
  journeyItems: JourneyItem[];
}

interface AboutPageClientProps {
  dataByLocale: Record<string, AboutPageLocaleData>;
  defaultLocale: string;
}

export default function AboutPageClient({ dataByLocale, defaultLocale }: AboutPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <Profile
            author={data.author}
            social={data.social}
            features={data.features}
            researchInterests={data.researchInterests}
            hideContactLinks
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {data.sections.map((section) => {
            if (section.type !== 'markdown') {
              return null;
            }

            return (
              <About
                key={section.id}
                content={section.content || ''}
                title={section.title}
              />
            );
          })}

          {data.journeyItems.length > 0 && (
            <Journey
              items={data.journeyItems}
              title="Journey"
              titleAlign="left"
              variant="compact"
            />
          )}
        </div>
      </div>
    </div>
  );
}
