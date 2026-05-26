import { getConfig } from '@/lib/config';
import { getBibtexContent, getPageConfig, getTomlContent } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import HomePageClient, { type HomePageLocaleData } from '@/components/home/HomePageClient';
import { CardPageConfig, PublicationPageConfig } from '@/types/page';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import type { JourneyItem } from '@/components/layout/Journey';
import type { SkillCategory } from '@/components/home/SkillsGrid';

const SELECTED_PROJECT_COUNT = 5;

function splitProjectsConfig(projectsConfig: CardPageConfig): CardPageConfig[] {
  const selectedItems = projectsConfig.items.slice(0, SELECTED_PROJECT_COUNT);
  const playgroundItems = projectsConfig.items.slice(SELECTED_PROJECT_COUNT);

  const sections: CardPageConfig[] = [
    {
      ...projectsConfig,
      title: 'Selected Projects',
      description:
        projectsConfig.description ||
        'Five most recent projects — capstone, NUS-ISS coursework, and team deliveries.',
      items: selectedItems,
    },
  ];

  if (playgroundItems.length > 0) {
    sections.push({
      ...projectsConfig,
      title: 'Playground',
      description:
        'Earlier research, individual builds, publications, and exploratory work from undergraduate and industry collaborations.',
      items: playgroundItems,
    });
  }

  return sections;
}

function loadHomePageData(locale?: string): HomePageLocaleData {
  const localeConfig = getConfig(locale);
  const aboutConfig = getPageConfig<{ profile?: { research_interests?: string[] } }>('about', locale);

  const pagesToShow: HomePageLocaleData['pagesToShow'] = [];

  const projectsConfig = getPageConfig('projects', locale) as CardPageConfig | null;
  if (projectsConfig?.items?.length) {
    const projectSections = splitProjectsConfig(projectsConfig);
    pagesToShow.push({
      type: 'card',
      id: 'selected-projects',
      config: projectSections[0],
    });

    pagesToShow.push({
      type: 'playground',
      id: 'playground',
      items: projectsConfig.items,
    });
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

  const awardsConfig = getPageConfig('awards', locale) as CardPageConfig | null;
  if (awardsConfig?.items?.length) {
    pagesToShow.push({
      type: 'card',
      id: 'awards',
      config: awardsConfig,
    });
  }

  const journeyData = getTomlContent<{ news: JourneyItem[] }>('news.toml', locale);
  const skillsData = getTomlContent<{ skills: SkillCategory[] }>('skills.toml', locale);

  return {
    author: localeConfig.author,
    social: localeConfig.social,
    features: localeConfig.features,
    enableOnePageMode: false,
    researchInterests: aboutConfig?.profile?.research_interests,
    journeyItems: journeyData?.news || [],
    skillCategories: skillsData?.skills || [],
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
