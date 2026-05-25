'use client';

import type { ComponentType } from 'react';
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

interface NavContactLinksProps {
  social: SiteConfig['social'];
  variant?: 'desktop' | 'mobile';
  className?: string;
}

const iconLinkClass =
  'inline-flex items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent rounded-md hover:bg-accent/10 transition-colors';

export default function NavContactLinks({
  social,
  variant = 'desktop',
  className,
}: NavContactLinksProps) {
  const entries: {
    key: string;
    label: string;
    href: string;
    external?: boolean;
    icon: ComponentType<{ className?: string }>;
  }[] = [];

  if (social.email) {
    entries.push({
      key: 'email',
      label: 'Email',
      href: `mailto:${social.email}`,
      icon: EnvelopeIcon,
    });
  }

  if (social.github) {
    entries.push({
      key: 'github',
      label: 'GitHub',
      href: social.github,
      external: true,
      icon: Github,
    });
  }

  if (social.linkedin) {
    entries.push({
      key: 'linkedin',
      label: 'LinkedIn',
      href: social.linkedin,
      external: true,
      icon: Linkedin,
    });
  }

  if (social.location && social.location_url) {
    entries.push({
      key: 'location',
      label: social.location,
      href: social.location_url,
      external: true,
      icon: MapPinIcon,
    });
  }

  if (!entries.length) {
    return null;
  }

  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-1 border-t border-neutral-200/60 dark:border-neutral-700/60 pt-3 pb-2 mt-2 px-3',
          className
        )}
        aria-label="Contact links"
      >
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <a
              key={entry.key}
              href={entry.href}
              className={iconLinkClass}
              aria-label={entry.label}
              title={entry.label}
              {...(entry.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <Icon className="h-5 w-5 shrink-0" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 shrink-0 border-l border-neutral-200/70 dark:border-neutral-700/70 pl-2 ml-1',
        className
      )}
      aria-label="Contact links"
    >
      {entries.map((entry) => {
        const Icon = entry.icon;
        return (
          <a
            key={entry.key}
            href={entry.href}
            className={iconLinkClass}
            aria-label={entry.label}
            title={entry.label}
            {...(entry.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
