import type { CardItem, PlaygroundCategory } from '@/types/page';

export interface PlaygroundProject extends CardItem {
  id: string;
  category: PlaygroundCategory;
  summary: string;
  accent: string;
}

export type PlaygroundFilter = 'all' | PlaygroundCategory;

export const PLAYGROUND_CATEGORIES: { id: PlaygroundFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'built', label: 'Built' },
  { id: 'designed', label: 'Designed' },
  { id: 'researched', label: 'Researched' },
  { id: 'explored', label: 'Explored' },
];

const CATEGORY_BY_TITLE: Record<string, PlaygroundCategory> = {
  'EcoGo — Sustainability Capstone': 'built',
  'Codex Code Book Web Platform': 'built',
  'Flip Card Memory Game': 'built',
  'GetFreshFood Application': 'designed',
  'CI/CD Workflow Automation': 'built',
  'Fruit Image Classification (Deep Learning)': 'built',
  'Machine Learning Model Evaluation': 'explored',
  'Classroom Behavior Analytics Platform': 'built',
  'Multimodal Attention Analysis System': 'built',
  'Deep Learning-Based Defect Detection — Power Transmission': 'researched',
  'Parallelism for High-Performance Processors': 'explored',
  'Privacy-Preserving Financial Computing': 'researched',
  'Credit Card Fraud & Illegal Trading Analysis': 'researched',
  'BERT — Car Reviews (Topic & Sentiment)': 'researched',
  'Campus Digital Twin — Navigation Platform': 'designed',
  'ROP Attack Mitigation (OS + Hardware-Assisted)': 'researched',
};

const SUMMARY_BY_TITLE: Record<string, string> = {
  'EcoGo — Sustainability Capstone': 'Capstone platform for low-carbon routing, RAG assistants, and mobility analytics.',
  'Codex Code Book Web Platform': 'Full-stack reference library with Spring Security and React workflows.',
  'Flip Card Memory Game': 'Android memory game with animation, audio feedback, and polished UX loops.',
  'GetFreshFood Application': 'Figma-led product design with SRS, UML, and normalized data modeling.',
  'CI/CD Workflow Automation': 'End-to-end GitHub Actions pipelines for build, test, and release automation.',
  'Fruit Image Classification (Deep Learning)': 'CNN benchmarking across MobileNet, ResNet, and custom models (~98% accuracy).',
  'Machine Learning Model Evaluation': 'Comparative ML study with preprocessing pipelines and metric visualization.',
  'Classroom Behavior Analytics Platform': 'YOLOv8 + ByteTrack pipeline for multi-student classroom behavior analytics.',
  'Multimodal Attention Analysis System': 'Real-time gaze and object fusion for focus tracking in study environments.',
  'Deep Learning-Based Defect Detection — Power Transmission': 'CSG-YOLO field deployment for power-grid visual inspection.',
  'Parallelism for High-Performance Processors': 'Architecture survey across M1, H100, and parallel scheduling experiments.',
  'Privacy-Preserving Financial Computing': 'SecretFlow / SPU federated learning portal for encrypted financial ML.',
  'Credit Card Fraud & Illegal Trading Analysis': 'Regional fraud analytics with engineered risk features and ML scoring.',
  'BERT — Car Reviews (Topic & Sentiment)': 'Published BERT attention research for automotive review NLP (SPIE 2023).',
  'Campus Digital Twin — Navigation Platform': 'Award-winning Unity campus twin with digital-human guided navigation.',
  'ROP Attack Mitigation (OS + Hardware-Assisted)': 'IEEE-published study combining OS hardening and hardware-assisted ROP defense.',
};

const ACCENT_BY_CATEGORY: Record<PlaygroundCategory, string> = {
  built: 'from-sky-500/40 via-cyan-500/20 to-neutral-900',
  designed: 'from-violet-500/40 via-fuchsia-500/20 to-neutral-900',
  researched: 'from-amber-500/35 via-orange-500/15 to-neutral-900',
  explored: 'from-emerald-500/35 via-teal-500/15 to-neutral-900',
};

export const DEFAULT_FEATURED_TITLES = [
  'Classroom Behavior Analytics Platform',
  'Campus Digital Twin — Navigation Platform',
  'Privacy-Preserving Financial Computing',
  'BERT — Car Reviews (Topic & Sentiment)',
  'Multimodal Attention Analysis System',
  'GetFreshFood Application',
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function firstContentLine(content?: string): string {
  if (!content) return '';
  const line = content
    .split('\n')
    .map((part) => part.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim())
    .find(Boolean);
  return line ? line.slice(0, 120) : '';
}

function inferCategory(item: CardItem): PlaygroundCategory {
  if (item.category) return item.category;
  if (CATEGORY_BY_TITLE[item.title]) return CATEGORY_BY_TITLE[item.title];

  const haystack = `${item.title} ${item.subtitle ?? ''} ${item.tags?.join(' ') ?? ''}`.toLowerCase();
  if (haystack.includes('figma') || haystack.includes('ux') || haystack.includes('unity')) return 'designed';
  if (haystack.includes('publication') || haystack.includes('research') || haystack.includes('ieee')) {
    return 'researched';
  }
  if (haystack.includes('evaluation') || haystack.includes('survey')) return 'explored';
  return 'built';
}

export function enrichPlaygroundProject(item: CardItem, index: number): PlaygroundProject {
  const category = inferCategory(item);
  return {
    ...item,
    id: slugify(item.title) || `project-${index}`,
    category,
    summary: item.summary || SUMMARY_BY_TITLE[item.title] || firstContentLine(item.content) || item.subtitle || '',
    accent: ACCENT_BY_CATEGORY[category],
  };
}

export function enrichPlaygroundProjects(items: CardItem[]): PlaygroundProject[] {
  return items.map(enrichPlaygroundProject);
}

export function pickFeaturedProjects(
  projects: PlaygroundProject[],
  preferredTitles: string[] = DEFAULT_FEATURED_TITLES
): PlaygroundProject[] {
  const picked: PlaygroundProject[] = [];
  for (const title of preferredTitles) {
    const match = projects.find((p) => p.title === title);
    if (match && !picked.some((p) => p.id === match.id)) {
      picked.push(match);
    }
  }
  for (const project of projects) {
    if (picked.length >= 6) break;
    if (!picked.some((p) => p.id === project.id)) {
      picked.push(project);
    }
  }
  return picked.slice(0, 6);
}

export function shuffleIds(ids: string[]): string[] {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function categoryLabel(category: PlaygroundCategory): string {
  return PLAYGROUND_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}
