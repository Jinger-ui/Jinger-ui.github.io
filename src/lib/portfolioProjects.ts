import type { CardItem } from '@/types/page';
import { generateSlug } from '@/lib/utils';

export interface PortfolioProject extends CardItem {
  id: string;
  slug: string;
  href: string;
  summary: string;
}

/** Align with static resume slugs in js/project-data.js */
const SLUG_BY_TITLE: Record<string, string> = {
  'EcoGo — Sustainability Capstone': 'ecogo',
  'Codex Code Book Web Platform': 'codex-code-book-platform',
  'Flip Card Memory Game': 'flip-card-memory-game',
  'GetFreshFood Application': 'getfreshfood-application',
  'CI/CD Workflow Automation': 'ci-cd-workflow-automation',
  'Fruit Image Classification (Deep Learning)': 'fruit-image-classification',
  'Machine Learning Model Evaluation': 'machine-learning-model-evaluation',
  'Classroom Behavior Analytics Platform': 'classroom-behavior-analytics-platform',
  'Multimodal Attention Analysis System': 'multimodal-attention-analysis-system',
  'Deep Learning-Based Defect Detection — Power Transmission': 'defect-detection-for-power-transmission',
  'Parallelism for High-Performance Processors': 'parallelism-for-high-performance-processors',
  'Privacy-Preserving Financial Computing': 'privacy-preserving-financial-computing',
  'Credit Card Fraud & Illegal Trading Analysis': 'credit-card-fraud-and-illegal-trading-analysis',
  'BERT — Car Reviews (Topic & Sentiment)': 'bert-car-reviews-topic-and-sentiment',
  'Campus Digital Twin — Navigation Platform': 'campus-digital-twin-and-navigation',
  'ROP Attack Mitigation (OS + Hardware-Assisted)': 'rop-mitigation-framework',
};

function firstContentLine(content?: string): string {
  if (!content) return '';
  const line = content
    .split('\n')
    .map((part) => part.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim())
    .find(Boolean);
  return line ? line.slice(0, 140) : '';
}

function normalizeSlug(item: CardItem, index: number): string {
  if (item.slug) return item.slug;
  if (SLUG_BY_TITLE[item.title]) return SLUG_BY_TITLE[item.title];
  return generateSlug(item.title) || `project-${index + 1}`;
}

function normalizeSummary(item: CardItem): string {
  return item.summary || firstContentLine(item.content) || item.subtitle || item.title;
}

export function projectHref(project: Pick<PortfolioProject, 'slug'>): string {
  return `/projects/${project.slug}/`;
}

export function enrichPortfolioProjects(items: CardItem[]): PortfolioProject[] {
  return items.map((item, index) => {
    const slug = normalizeSlug(item, index);
    return {
      ...item,
      id: slug,
      slug,
      href: projectHref({ slug }),
      summary: normalizeSummary(item),
    };
  });
}

export function findProjectBySlug(
  projects: PortfolioProject[],
  slug: string
): PortfolioProject | null {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function previewText(item: Pick<CardItem, 'summary' | 'content' | 'subtitle'>): string {
  if (item.summary) return item.summary;
  if (!item.content) return item.subtitle || '';
  return firstContentLine(item.content);
}
