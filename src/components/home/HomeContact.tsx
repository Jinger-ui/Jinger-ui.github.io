'use client';

import { useRef, useState, type ComponentType } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

interface HomeContactProps {
  social: SiteConfig['social'];
  className?: string;
}

const linkClass =
  'inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent rounded-lg hover:bg-accent/10 transition-all duration-200 group/link';

export default function HomeContact({ social, className }: HomeContactProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [portalPulse, setPortalPulse] = useState(false);

  const handleLinkHover = () => {
    if (reduceMotion) return;
    setPortalPulse(true);
    window.setTimeout(() => setPortalPulse(false), 600);
  };

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
    <motion.section
      ref={ref}
      id="contact"
      aria-label="Contact"
      className={cn('relative w-full', className)}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
    >
      {/* Decorative portal circle */}
      <svg
        className={cn(
          'pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 -z-10',
          portalPulse && !reduceMotion && 'portal-pulse'
        )}
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="var(--grimoire-gold-muted)"
          strokeWidth="1"
          opacity="0.35"
        />
        <circle
          cx="60"
          cy="60"
          r="38"
          stroke="var(--grimoire-gold)"
          strokeWidth="0.75"
          strokeDasharray="4 6"
          opacity="0.25"
        />
        <circle
          cx="60"
          cy="60"
          r="24"
          fill="var(--grimoire-gold-glow)"
          opacity="0.15"
        />
      </svg>

      <div className="relative flex items-start gap-3">
        {isInView && (
          <motion.svg
            className="pointer-events-none mt-0.5 shrink-0 text-[var(--grimoire-ink)] opacity-50 dark:opacity-40"
            width="20"
            height="16"
            viewBox="0 0 20 16"
            fill="currentColor"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.3 }}
          >
            <path d="M10 0C6 0 2 2 0 6c2 2 4 3 6 3s4-1 6-3c-2-4-6-6-10-6z" />
            <path d="M4 8c1 2 3 4 6 4s5-2 6-4c-1 1-3 2-6 2s-5-1-6-2z" opacity="0.7" />
            <path d="M8 12l2 4 2-4H8z" />
          </motion.svg>
        )}
        <div>
          <h2 className="text-sm font-serif font-bold text-primary tracking-tight mb-4">
            Send a Raven
          </h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {entries.map((entry, i) => {
              const Icon = entry.icon;
              return (
                <motion.a
                  key={entry.key}
                  href={entry.href}
                  className={linkClass}
                  aria-label={entry.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : i * 0.06,
                  }}
                  onMouseEnter={handleLinkHover}
                  onFocus={handleLinkHover}
                  {...(entry.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/link:-translate-y-0.5" />
                  <span className="truncate max-w-[14rem] sm:max-w-none">{entry.label}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
