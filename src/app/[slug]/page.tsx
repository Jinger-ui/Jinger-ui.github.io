import { notFound } from 'next/navigation';
import { getPageConfig, getMarkdownContent, getBibtexContent, getTomlContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import { processSections } from '@/lib/sections';
import DynamicPageClient, { type DynamicPageLocaleData } from '@/components/pages/DynamicPageClient';
import AboutPageClient, { type AboutPageLocaleData } from '@/components/pages/AboutPageClient';
import type { JourneyItem } from '@/components/layout/Journey';
import {
  BasePageConfig,
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
} from '@/types/page';

import { Metadata } from 'next';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';

function loadDynamicPageData(slug: string, locale?: string): DynamicPageLocaleData | null {
  const pageConfig = getPageConfig(slug, locale) as BasePageConfig | null;

  if (!pageConfig) {
    return null;
  }

  if (pageConfig.type === 'publication') {
    const pubConfig = pageConfig as PublicationPageConfig;
    const bibtex = getBibtexContent(pubConfig.source, locale);
    return {
      type: 'publication',
      config: pubConfig,
      publications: parseBibTeX(bibtex, locale),
    };
  }

  if (pageConfig.type === 'text') {
    const textConfig = pageConfig as TextPageConfig;
    const content = getMarkdownContent(textConfig.source, locale);
    return {
      type: 'text',
      config: textConfig,
      content,
    };
  }

  if (pageConfig.type === 'card') {
    return {
      type: 'card',
      config: pageConfig as CardPageConfig,
    };
  }

  return null;
}

function loadAboutPageData(locale?: string): AboutPageLocaleData | null {
  const aboutConfig = getPageConfig<{
    profile?: { research_interests?: string[] };
    sections?: Parameters<typeof processSections>[0];
  }>('about', locale);

  if (!aboutConfig?.sections) {
    return null;
  }

  const localeConfig = getConfig(locale);
  const journeyData = getTomlContent<{ news: JourneyItem[] }>('news.toml', locale);

  return {
    author: localeConfig.author,
    social: localeConfig.social,
    features: localeConfig.features,
    researchInterests: aboutConfig.profile?.research_interests,
    sections: processSections(aboutConfig.sections, locale),
    journeyItems: journeyData?.news || [],
  };
}

export function generateStaticParams() {
  const config = getConfig();
  return config.navigation
    .filter((nav) => nav.type === 'page' && nav.href !== '/')
    .map((nav) => ({
      slug: nav.target,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageConfig = getPageConfig(slug) as BasePageConfig | null;

  if (!pageConfig) {
    return {};
  }

  return {
    title: pageConfig.title,
    description: pageConfig.description,
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === 'about') {
    const baseConfig = getConfig();
    const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
    const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];

    const dataByLocale: Record<string, AboutPageLocaleData> = {};

    for (const locale of targetLocales) {
      const localizedData = loadAboutPageData(locale);
      if (localizedData) {
        dataByLocale[locale] = localizedData;
      }
    }

    const defaultData = loadAboutPageData();
    if (defaultData) {
      dataByLocale[runtimeI18n.defaultLocale] = dataByLocale[runtimeI18n.defaultLocale] || defaultData;
    }

    if (Object.keys(dataByLocale).length === 0) {
      notFound();
    }

    return <AboutPageClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
  }

  const baseConfig = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];

  const dataByLocale: Record<string, DynamicPageLocaleData> = {};

  for (const locale of targetLocales) {
    const localizedData = loadDynamicPageData(slug, locale);
    if (localizedData) {
      dataByLocale[locale] = localizedData;
    }
  }

  const defaultData = loadDynamicPageData(slug);
  if (defaultData) {
    dataByLocale[runtimeI18n.defaultLocale] = dataByLocale[runtimeI18n.defaultLocale] || defaultData;
  }

  if (Object.keys(dataByLocale).length === 0) {
    notFound();
  }

  return <DynamicPageClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
}
