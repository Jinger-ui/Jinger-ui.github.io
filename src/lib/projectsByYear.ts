import type { CardItem } from '@/types/page';

export interface YearProjectGroup {
  year: string;
  items: CardItem[];
}

function extractYear(date?: string): string {
  if (!date) {
    return 'Undated';
  }
  const match = date.match(/\d{4}/);
  return match ? match[0] : date.trim();
}

export function groupProjectsByYear<T extends CardItem>(items: T[]): Array<{ year: string; items: T[] }> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const year = extractYear(item.date);
    const bucket = groups.get(year);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(year, [item]);
    }
  }

  return Array.from(groups.entries())
    .sort(([yearA], [yearB]) => {
      if (yearA === 'Undated') return 1;
      if (yearB === 'Undated') return -1;
      return Number.parseInt(yearB, 10) - Number.parseInt(yearA, 10);
    })
    .map(([year, yearItems]) => ({ year, items: yearItems }));
}
