import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { PlaygroundProject } from '@/lib/playgroundProjects';
import { playgroundHref, categoryLabel } from '@/lib/playgroundProjects';
import { cn } from '@/lib/utils';

const PLACEHOLDER_GRADIENTS = [
  'from-amber-500/40 via-orange-300/25 to-yellow-200/20',
  'from-sky-500/40 via-blue-300/25 to-indigo-200/20',
  'from-emerald-500/40 via-teal-300/25 to-cyan-200/20',
  'from-violet-500/40 via-purple-300/25 to-fuchsia-200/20',
  'from-rose-500/40 via-pink-300/25 to-orange-200/20',
];

function placeholderGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash + title.charCodeAt(i) * (i + 1)) % PLACEHOLDER_GRADIENTS.length;
  }
  return PLACEHOLDER_GRADIENTS[hash];
}

const markdownComponents = {
  p: ({ children }: React.ComponentProps<'p'>) => (
    <p className="mb-3 last:mb-0 leading-7">{children}</p>
  ),
  ul: ({ children }: React.ComponentProps<'ul'>) => (
    <ul className="mb-3 list-disc space-y-2 pl-5">{children}</ul>
  ),
  ol: ({ children }: React.ComponentProps<'ol'>) => (
    <ol className="mb-3 list-decimal space-y-2 pl-5">{children}</ol>
  ),
  li: ({ children }: React.ComponentProps<'li'>) => <li>{children}</li>,
  strong: ({ children }: React.ComponentProps<'strong'>) => (
    <strong className="rounded bg-playground-accent/15 px-1 font-semibold text-foreground dark:bg-playground-accent/25 dark:text-white">
      {children}
    </strong>
  ),
};

function extractSignals(content?: string): string[] {
  if (!content) return [];

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim())
    .slice(0, 3);
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.4rem] border border-border bg-card/90 p-5 backdrop-blur dark:bg-neutral-950/75">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/60 dark:text-white/70">{label}</p>
      <p className="mt-2 text-sm leading-6 text-foreground/78 dark:text-white/86">{value}</p>
    </article>
  );
}

function GrimoireDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-16 bg-[var(--grimoire-gold)] opacity-25 sm:w-24" />
      <span className="text-sm leading-none text-[var(--grimoire-gold)] opacity-40">✦</span>
      <span className="h-px w-16 bg-[var(--grimoire-gold)] opacity-25 sm:w-24" />
    </div>
  );
}

function RelatedCard({
  project,
  label,
}: {
  project: PlaygroundProject;
  label?: string;
}) {
  return (
    <Link
      href={playgroundHref(project)}
      className="group block rounded-[1.4rem] border border-border bg-card/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-playground-accent dark:bg-neutral-950/75"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-playground-accent">
        {label || project.date || categoryLabel(project.category)}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
      <p className="mt-2 text-sm leading-6 text-foreground/75 dark:text-white/82">{project.summary}</p>
    </Link>
  );
}

interface PlaygroundDetailPageProps {
  project: PlaygroundProject;
  allProjects: PlaygroundProject[];
}

export default function PlaygroundDetailPage({
  project,
  allProjects,
}: PlaygroundDetailPageProps) {
  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previousProject =
    index >= 0 ? allProjects[(index - 1 + allProjects.length) % allProjects.length] : null;
  const nextProject = index >= 0 ? allProjects[(index + 1) % allProjects.length] : null;
  const relatedProjects = allProjects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const signals = extractSignals(project.content);

  return (
    <div className="apple-site -mt-16 min-h-screen lg:-mt-20">
      <div className="grimoire-parchment mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="playground-shell relative overflow-hidden rounded-[2.2rem] border px-8 py-10 shadow-[0_28px_80px_var(--playground-section-shadow)]">
          <div className="playground-shell-glow pointer-events-none absolute inset-x-0 top-0 h-44" />
          <div className="relative">
            <Link
              href="/#playground"
              className="inline-flex items-center text-sm font-semibold text-playground-accent transition hover:opacity-80"
            >
              ← Back to playground
            </Link>

            <p className="mt-6 text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-playground-accent">
              Playground study / {project.date}
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div>
                <h1 className="font-grimoire-heading font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-3 text-sm font-medium text-playground-accent">{project.subtitle}</p>
                )}
                <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/75 dark:text-white/86">
                  {project.summary}
                </p>

                <div className="mt-7 flex flex-wrap gap-3 text-sm">
                  {project.subtitle && (
                    <span className="rounded-full border border-border bg-muted/70 px-4 py-2 font-semibold">
                      {project.subtitle.split('·')[0]?.trim() || project.subtitle}
                    </span>
                  )}
                  {project.date && (
                    <span className="rounded-full border border-border bg-muted/70 px-4 py-2 font-semibold">
                      {project.date}
                    </span>
                  )}
                  <span className="rounded-full border border-border bg-muted/70 px-4 py-2 font-semibold">
                    {categoryLabel(project.category)}
                  </span>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-foreground/75 dark:text-white/86"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-[1.4rem] border border-border bg-muted/40 shadow-lg">
                {project.image ? (
                  <div className="aspect-[16/10]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex aspect-[16/10] items-end bg-gradient-to-br p-5',
                      placeholderGradient(project.title)
                    )}
                  >
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/60 dark:text-white/70">
                      {project.date || 'Playground'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <GrimoireDivider />

        <section className="rounded-[1.85rem] border border-border bg-card/80 p-6 shadow-[0_18px_50px_var(--playground-section-shadow)] backdrop-blur">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-playground-accent">
            01 / Snapshot
          </p>
          <h2 className="mt-3 inline-flex border-b-2 border-playground-accent pb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
            Project snapshot
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetaCard label="Role" value={project.subtitle || 'Exploration'} />
            <MetaCard label="Year" value={project.date || '—'} />
            <MetaCard
              label="Focus"
              value={(project.tags || []).slice(0, 3).join(' · ') || categoryLabel(project.category)}
            />
          </div>
        </section>

        {signals.length > 0 && (
          <section className="grid gap-4 md:grid-cols-3">
            {signals.map((item, indexValue) => (
              <article
                key={item}
                className="rounded-[1.4rem] border border-border bg-card/85 p-5 backdrop-blur"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-playground-accent">
                  Key signal {indexValue + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/75 dark:text-white/86">{item}</p>
              </article>
            ))}
          </section>
        )}

        {project.content && (
          <>
            <GrimoireDivider />
            <section className="rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-[0_20px_60px_var(--playground-section-shadow)] backdrop-blur">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-playground-accent">
              02 / Delivery
            </p>
            <h2 className="mt-3 inline-flex border-b-2 border-playground-accent pb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
              What this playground note covers
            </h2>
            <div className="grimoire-tome mt-5 pl-4 text-sm leading-7 text-foreground/80 dark:text-white/88 sm:text-base">
              <ReactMarkdown components={markdownComponents}>{project.content}</ReactMarkdown>
            </div>
          </section>
          </>
        )}

        {project.detailImages && project.detailImages.length > 0 && (
          <section className="rounded-[1.85rem] border border-border bg-card/80 p-6 shadow-[0_18px_50px_var(--playground-section-shadow)] backdrop-blur">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-playground-accent">
              02b / Gallery
            </p>
            <h2 className="mt-3 inline-flex border-b-2 border-playground-accent pb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
              Project visuals
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.detailImages.map((src, index) => (
                <figure
                  key={src}
                  className="overflow-hidden rounded-[1.2rem] border border-border bg-muted/40 shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="h-full w-full object-contain object-center bg-muted/30"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-[1.85rem] border border-border bg-card/80 p-6 shadow-[0_18px_50px_var(--playground-section-shadow)] backdrop-blur">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-playground-accent">
            03 / Continue
          </p>
          <h2 className="mt-3 inline-flex border-b-2 border-playground-accent pb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
            More explorations
          </h2>

          {relatedProjects.length > 0 && (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {relatedProjects.map((item) => (
                <RelatedCard key={item.slug} project={item} />
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {previousProject && <RelatedCard project={previousProject} label="Previous study" />}
            {nextProject && <RelatedCard project={nextProject} label="Next study" />}
          </div>
        </section>
      </div>
    </div>
  );
}
