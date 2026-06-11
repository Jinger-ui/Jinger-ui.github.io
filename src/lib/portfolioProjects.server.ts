import { getPageConfig } from '@/lib/content';
import {
  enrichPortfolioProjects,
  findProjectBySlug,
  type PortfolioProject,
} from '@/lib/portfolioProjects';
import type { CardPageConfig } from '@/types/page';

export function loadPortfolioProjects(locale?: string): PortfolioProject[] {
  const config = getPageConfig('projects', locale) as CardPageConfig | null;
  return enrichPortfolioProjects(config?.items ?? []);
}

export function loadProjectDetail(slug: string, locale?: string) {
  const projects = loadPortfolioProjects(locale);
  const project = findProjectBySlug(projects, slug);
  return { project, projects };
}
