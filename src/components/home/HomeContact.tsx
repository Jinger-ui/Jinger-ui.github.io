'use client';

import type { ComponentType } from 'react';
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

interface HomeContactProps {
  social: SiteConfig['social'];
  className?: string;
}

const linkClass =
  'inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent rounded-lg hover:bg-accent/10 transition-colors';

export default function HomeContact({ social, className }: HomeContactProps) {
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
      label: social.email,
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

  return (
    <section id="contact" aria-label="Contact" className={cn('w-full', className)}>
      <h2 className="text-sm font-serif font-bold text-primary tracking-tight mb-4">Contact</h2>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <a
              key={entry.key}
              href={entry.href}
              className={linkClass}
              aria-label={entry.label}
              {...(entry.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[14rem] sm:max-w-none">{entry.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
