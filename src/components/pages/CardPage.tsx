'use client';

import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-200">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => (
        <strong className="rounded bg-accent/15 px-1 font-semibold text-primary dark:bg-accent/25 dark:text-white">
            {children}
        </strong>
    ),
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

/**
 * Project / award cards render as static markup (no staggered motion).
 * Framer Motion SSR for static export emitted `opacity:0` on cards; if JS is slow or blocked,
 * only the first batches could appear visible — all items must show without client animation.
 */
const cardSurfaceClass = {
    solid: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm',
    glass:
        'bg-white/55 dark:bg-neutral-900/35 backdrop-blur-xl backdrop-saturate-150 border border-white/50 dark:border-white/10 shadow-sm',
} as const;

export default function CardPage({
    config,
    embedded = false,
    hideHeader = false,
    cardStyle = 'solid',
}: {
    config: CardPageConfig;
    embedded?: boolean;
    hideHeader?: boolean;
    cardStyle?: keyof typeof cardSurfaceClass;
}) {
    const isGlass = cardStyle === 'glass';
    const dateBadgeClass = isGlass
        ? 'text-sm text-neutral-600 dark:text-neutral-300 font-medium bg-white/45 dark:bg-neutral-800/45 backdrop-blur-sm px-2 py-1 rounded border border-white/40 dark:border-white/10'
        : 'text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded';
    const tagClass = isGlass
        ? 'text-xs text-neutral-600 dark:text-neutral-100 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-sm px-2 py-1 rounded border border-white/35 dark:border-white/10'
        : 'text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800';
    const coverFrameClass = isGlass
        ? 'border-white/40 dark:border-white/10 bg-white/30 dark:bg-neutral-800/30'
        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50';

    return (
        <div>
            {!hideHeader && (
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-200 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
            )}

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <div
                        key={index}
                        className={`${cardSurfaceClass[cardStyle]} ${embedded ? "p-4" : "p-6"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.01] card-hover-glow animate-fade-in-up ${isGlass ? 'hover:bg-white/70 dark:hover:bg-neutral-900/50' : ''}`}
                        style={{ animationDelay: `${index * 70}ms` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                            {item.date && (
                                <span className={dateBadgeClass}>
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                        )}
                        {item.image && (
                            <div
                                className={`mb-4 aspect-[16/10] overflow-hidden rounded-xl border ${coverFrameClass}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-100 leading-relaxed`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className={tagClass}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
