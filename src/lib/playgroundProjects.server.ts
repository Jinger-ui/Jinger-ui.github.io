import { getPageConfig } from '@/lib/content';
import {
  enrichPlaygroundProjects,
  findPlaygroundProjectBySlug,
  type PlaygroundProject,
} from '@/lib/playgroundProjects';
import type { CardPageConfig } from '@/types/page';

const SELECTED_PROJECT_COUNT = 5;

export function loadPlaygroundProjects(locale?: string): PlaygroundProject[] {
  const config = getPageConfig('projects', locale) as CardPageConfig | null;
  const items = config?.items?.slice(SELECTED_PROJECT_COUNT) ?? [];
  return enrichPlaygroundProjects(items);
}

export function loadPlaygroundDetail(slug: string, locale?: string) {
  const projects = loadPlaygroundProjects(locale);
  const project = findPlaygroundProjectBySlug(projects, slug);
  return { project, projects };
}
