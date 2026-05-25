import { getConfig } from '@/lib/config';
import { getBibtexContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import HomePageClient, { type HomePageLocaleData } from '@/components/home/HomePageClient';
import { CardPageConfig, PublicationPageConfig } from '@/types/page';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';

function loadHomePageData(locale?: string): HomePageLocaleData {
  const localeConfig = getConfig(locale);
  const aboutConfig = getPageConfig<{ profile?: { research_interests?: string[] } }>('about', locale);

  const pagesToShow: HomePageLocaleData['pagesToShow'] = [];

  const projectsConfig = getPageConfig('projects', locale) as CardPageConfig | null;
  if (projectsConfig) {
    pagesToShow.push({ type: 'card', id: 'projects', config: projectsConfig });
  }

  const pubConfig = getPageConfig('publications', locale) as PublicationPageConfig | null;
  if (pubConfig) {
    const bibtex = getBibtexContent(pubConfig.source, locale);
    pagesToShow.push({
      type: 'publication',
      id: 'publications',
      config: pubConfig,
      publications: parseBibTeX(bibtex, locale),
    });
  }

  return {
    author: localeConfig.author,
    social: localeConfig.social,
    features: localeConfig.features,
    enableOnePageMode: false,
    researchInterests: aboutConfig?.profile?.research_interests,
    pagesToShow,
  };
}

export default function Home() {
  const baseConfig = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];

  const dataByLocale: Record<string, HomePageLocaleData> = {};

  for (const locale of targetLocales) {
    dataByLocale[locale] = loadHomePageData(locale);
  }

  if (!dataByLocale[runtimeI18n.defaultLocale]) {
    dataByLocale[runtimeI18n.defaultLocale] = loadHomePageData(undefined);
  }

  return <HomePageClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
}
