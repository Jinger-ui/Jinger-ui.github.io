export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'projects-by-year';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    slug?: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    detailImages?: string[];
    category?: PlaygroundCategory;
    summary?: string;
}

export type PlaygroundCategory = 'built' | 'designed' | 'researched' | 'explored';

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
