'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import NavContactLinks from '@/components/layout/NavContactLinks';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  social: SiteConfig['social'];
  enableOnePageMode?: boolean;
  i18n: I18nRuntimeConfig;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale?: Record<string, string>;
  socialByLocale?: Record<string, SiteConfig['social']>;
}

type NavItem = SiteConfig['navigation'][number];

function isHomeSectionItem(item: NavItem): boolean {
  return item.type === 'section';
}

function getNavItemHref(item: NavItem, enableOnePageMode?: boolean): string {
  if (isHomeSectionItem(item)) {
    return item.href || `/#${item.target}`;
  }
  if (enableOnePageMode) {
    return item.href === '/' ? '/' : `/#${item.target}`;
  }
  return item.href;
}

function hashForNavItem(item: NavItem): string {
  if (item.href?.includes('#')) {
    return item.href.slice(item.href.indexOf('#'));
  }
  return `#${item.target}`;
}

export default function Navigation({
  items,
  siteTitle,
  social,
  enableOnePageMode,
  i18n,
  itemsByLocale,
  siteTitleByLocale,
  socialByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHash, setActiveHash] = useState('');
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const messages = useMessages();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    top: number;
    height: number;
  } | null>(null);
  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(() => {
    return itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items;
  }, [i18n.defaultLocale, items, itemsByLocale, resolvedLocale]);

  const effectiveSiteTitle = useMemo(() => {
    return siteTitleByLocale?.[resolvedLocale] || siteTitleByLocale?.[i18n.defaultLocale] || siteTitle;
  }, [i18n.defaultLocale, resolvedLocale, siteTitle, siteTitleByLocale]);

  const effectiveSocial = useMemo(() => {
    return socialByLocale?.[resolvedLocale] || socialByLocale?.[i18n.defaultLocale] || social;
  }, [i18n.defaultLocale, resolvedLocale, social, socialByLocale]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const homeSectionItems = useMemo(
    () => effectiveItems.filter(isHomeSectionItem),
    [effectiveItems]
  );

  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    const usesSectionObserver = enableOnePageMode || homeSectionItems.length > 0;
    if (!usesSectionObserver) {
      return;
    }

    visibleSections.current.clear();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.current.add(entry.target.id);
        } else {
          visibleSections.current.delete(entry.target.id);
        }
      });

      const observedItems = enableOnePageMode
        ? effectiveItems.filter((item) => item.type === 'page')
        : homeSectionItems;

      const firstVisible = observedItems.find((item) => visibleSections.current.has(item.target));
      if (firstVisible) {
        const nextHash = hashForNavItem(firstVisible);
        setActiveHash(firstVisible.type === 'page' && firstVisible.target === 'about' ? '' : nextHash);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const targets = enableOnePageMode
      ? effectiveItems.filter((item) => item.type === 'page').map((item) => item.target)
      : homeSectionItems.map((item) => item.target);

    targets.forEach((target) => {
      const element = document.getElementById(target);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [enableOnePageMode, effectiveItems, homeSectionItems]);

  const isDesktopItemActive = (item: NavItem) => {
    if (isHomeSectionItem(item)) {
      return pathname === '/' && activeHash === hashForNavItem(item);
    }

    if (enableOnePageMode) {
      return activeHash === `#${item.target}` || (!activeHash && item.target === 'about');
    }

    return item.href === '/'
      ? pathname === '/' && !activeHash
      : pathname.startsWith(item.href);
  };

  const getDesktopItemHref = (item: NavItem) => getNavItemHref(item, enableOnePageMode);

  const activeItem = effectiveItems.find((item) => isDesktopItemActive(item)) ?? null;
  const activeHref = activeItem ? getDesktopItemHref(activeItem) : null;
  const indicatorHref = hoveredHref ?? activeHref;

  const measureIndicator = useCallback(() => {
    const container = navContainerRef.current;
    if (!container || !indicatorHref) {
      setIndicatorStyle(null);
      return;
    }
    const el = container.querySelector<HTMLElement>(
      `[data-nav-href="${CSS.escape(indicatorHref)}"]`
    );
    if (!el) {
      setIndicatorStyle(null);
      return;
    }
    setIndicatorStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      top: el.offsetTop,
      height: el.offsetHeight,
    });
  }, [indicatorHref]);

  useEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <div
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${scrollProgress})` }}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'transition-all duration-300 ease-out',
              scrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-lg'
                : 'bg-transparent'
            )}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 lg:h-20">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0"
                >
                  <Link
                    href="/"
                    className="text-xl lg:text-2xl font-serif font-semibold text-primary hover:text-accent transition-colors duration-200"
                  >
                    {effectiveSiteTitle}
                  </Link>
                </motion.div>

                <div className="hidden lg:flex items-center min-w-0 flex-1 justify-end ml-6">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      ref={navContainerRef}
                      className="relative flex items-baseline space-x-1 shrink-0"
                      onMouseLeave={() => setHoveredHref(null)}
                    >
                      {indicatorStyle && (
                        <motion.div
                          className={cn(
                            'absolute rounded-lg pointer-events-none',
                            hoveredHref && hoveredHref !== activeHref
                              ? 'bg-accent/[0.07]'
                              : 'bg-accent/10'
                          )}
                          initial={false}
                          animate={{
                            left: indicatorStyle.left,
                            width: indicatorStyle.width,
                            top: indicatorStyle.top,
                            height: indicatorStyle.height,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 28,
                          }}
                        />
                      )}
                      {effectiveItems.map((item) => {
                        const isActive = isDesktopItemActive(item);
                        const href = getDesktopItemHref(item);

                        return (
                          <Link
                            key={item.target}
                            href={href}
                            data-nav-href={href}
                            prefetch={true}
                            onClick={() => {
                              if (enableOnePageMode || isHomeSectionItem(item)) {
                                setActiveHash(hashForNavItem(item));
                              }
                            }}
                            onMouseEnter={() => setHoveredHref(href)}
                            className={cn(
                              'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                              isActive
                                ? 'text-primary'
                                : hoveredHref === href
                                  ? 'text-primary'
                                  : 'text-neutral-600'
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                    <NavContactLinks social={effectiveSocial} variant="desktop" />
                    <LanguageToggle i18n={i18n} />
                    <ThemeToggle />
                  </div>
                </div>

                <div className="lg:hidden flex items-center space-x-2">
                  <LanguageToggle i18n={i18n} />
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors duration-200">
                    <span className="sr-only">{messages.navigation.openMainMenu}</span>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </motion.div>
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-neutral-200/50 shadow-lg"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {effectiveItems.map((item, index) => {
                      const isActive = isHomeSectionItem(item)
                        ? pathname === '/' && activeHash === hashForNavItem(item)
                        : enableOnePageMode
                          ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                          : (item.href === '/'
                            ? pathname === '/' && !activeHash
                            : pathname.startsWith(item.href));

                      const href = getNavItemHref(item, enableOnePageMode);

                      return (
                        <motion.div
                          key={item.target}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Disclosure.Button
                            as={Link}
                            href={href}
                            prefetch={true}
                            onClick={() => {
                              if (enableOnePageMode || isHomeSectionItem(item)) {
                                setActiveHash(item.href === '/' ? '' : hashForNavItem(item));
                              }
                            }}
                            className={cn(
                              'block px-3 py-2 rounded-md text-base font-medium transition-all duration-200',
                              isActive
                                ? 'text-primary bg-accent/10 border-l-4 border-accent'
                                : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                            )}
                          >
                            {item.title}
                          </Disclosure.Button>
                        </motion.div>
                      );
                    })}
                    <NavContactLinks social={effectiveSocial} variant="mobile" />
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
