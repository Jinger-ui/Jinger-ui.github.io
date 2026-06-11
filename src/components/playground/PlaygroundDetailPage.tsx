import Link from 'next/link';
import type { PlaygroundProject } from '@/lib/playgroundProjects';
import { playgroundHref, categoryLabel } from '@/lib/playgroundProjects';

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
    <article className="rounded-[1.4rem] border border-border bg-card/85 p-5 backdrop-blur">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </article>
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
      className="group block rounded-[1.4rem] border border-border bg-card/85 p-5 shadow-sm transition hover:-translate-y-1 hover:border-playground-accent"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-playground-accent">
        {label || project.date || categoryLabel(project.category)}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p>
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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
            <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            {project.subtitle && <p className="mt-3 text-sm font-medium text-playground-accent">{project.subtitle}</p>}
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{project.summary}</p>

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
                    className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

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
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item}</p>
              </article>
            ))}
          </section>
        )}

        {project.content && (
          <section className="rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-[0_20px_60px_var(--playground-section-shadow)] backdrop-blur">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-playground-accent">
              02 / Delivery
            </p>
            <h2 className="mt-3 inline-flex border-b-2 border-playground-accent pb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
              What this playground note covers
            </h2>
            <div className="mt-5 text-sm leading-7 text-muted-foreground whitespace-pre-line">
              {project.content}
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
