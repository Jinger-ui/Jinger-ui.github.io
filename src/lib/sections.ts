import { getMarkdownContent, getBibtexContent, getTomlContent } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import { Publication } from '@/types/publication';

export interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: { date: string; content: string }[];
}

export function processSections(sections: SectionConfig[], locale?: string): SectionConfig[] {
  return sections.map((section: SectionConfig) => {
    switch (section.type) {
      case 'markdown':
        return {
          ...section,
          content: section.source ? getMarkdownContent(section.source, locale) : '',
        };
      case 'publications': {
        const bibtex = getBibtexContent('publications.bib', locale);
        const allPubs = parseBibTeX(bibtex, locale);
        const filteredPubs = section.filter === 'selected'
          ? allPubs.filter((p) => p.selected)
          : allPubs;
        return {
          ...section,
          publications: filteredPubs.slice(0, section.limit || 5),
        };
      }
      case 'list': {
        const newsData = section.source
          ? getTomlContent<{ news: { date: string; content: string }[] }>(section.source, locale)
          : null;
        return {
          ...section,
          items: newsData?.news || [],
        };
      }
      default:
        return section;
    }
  });
}
