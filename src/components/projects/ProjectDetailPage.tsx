import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { type PortfolioProject } from '@/lib/portfolioProjects';
import { cn } from '@/lib/utils';

const markdownComponents = {
  p: ({ children }: React.ComponentProps<'p'>) => (
    <p className="mb-3 last:mb-0 leading-relaxed text-neutral-700 dark:text-white">{children}</p>
  ),
  ul: ({ children }: React.ComponentProps<'ul'>) => (
    <ul className="mb-3 list-disc space-y-2 pl-5 text-neutral-700 dark:text-white">{children}</ul>
  ),
  ol: ({ children }: React.ComponentProps<'ol'>) => (
    <ol className="mb-3 list-decimal space-y-2 pl-5 text-neutral-700 dark:text-white">{children}</ol>
  ),
  li: ({ children }: React.ComponentProps<'li'>) => (
    <li className="text-neutral-700 dark:text-white">{children}</li>
  ),
  a: ({ ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent transition hover:underline"
    />
  ),
  strong: ({ children }: React.ComponentProps<'strong'>) => (
    <strong className="rounded bg-accent/15 px-1 font-semibold text-primary dark:bg-accent/25 dark:text-white">
      {children}
    </strong>
  ),
  code: ({ children }: React.ComponentProps<'code'>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[0.92em]">{children}</code>
  ),
};

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

function extractSignals(markdown?: string): string[] {
  if (!markdown) return [];

  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim())
    .slice(0, 3);
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">{label}</span>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white">{value}</p>
    </article>
  );
}

function RelatedCard({
  project,
  label,
}: {
  project: PortfolioProject;
  label?: string;
}) {
  return (
    <Link
      href={project.href}
      className="group block rounded-2xl border border-neutral-200/80 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-accent dark:border-neutral-800 dark:bg-neutral-900/70"
    >
      <span className="text-xs font-semibold tabular-nums text-neutral-500 dark:text-white">
        {label || project.date}
      </span>
      <h3 className="mt-2 text-base font-semibold leading-snug text-primary group-hover:text-accent">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-white">
        {project.summary}
      </p>
    </Link>
  );
}

interface ProjectDetailPageProps {
  project: PortfolioProject;
  allProjects: PortfolioProject[];
}

export default function ProjectDetailPage({ project, allProjects }: ProjectDetailPageProps) {
  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const prevProject =
    index >= 0 ? allProjects[(index - 1 + allProjects.length) % allProjects.length] : null;
  const nextProject = index >= 0 ? allProjects[(index + 1) % allProjects.length] : null;
  const related = allProjects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const roleLabel = project.subtitle?.split('·')[0]?.trim() || project.subtitle || 'Project delivery';
  const signals = extractSignals(project.content);

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white/78 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/88">
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(212,165,98,0.16),transparent)]" />
          <div className="relative">
            <Link
              href="/#selected-projects"
              className="inline-flex text-sm font-medium text-accent transition hover:underline"
            >
              ← Back to all projects
            </Link>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-accent">
              Project case study / {project.date}
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-3 text-sm font-medium text-accent sm:text-base">{project.subtitle}</p>
                )}
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-white">
                  {project.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-neutral-200 bg-accent/10 px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-white">
                    {roleLabel}
                  </span>
                  {project.date && (
                    <span className="rounded-full border border-neutral-200 bg-accent/10 px-4 py-2 text-sm font-semibold tabular-nums text-neutral-700 dark:border-neutral-700 dark:text-white">
                      {project.date}
                    </span>
                  )}
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-8">
                  <Link
                    href="/#selected-projects"
                    className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:border-neutral-700 dark:bg-white dark:text-neutral-950"
                  >
                    Back to archive
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.3rem] border border-neutral-200/80 bg-neutral-50 shadow-lg dark:border-white/10 dark:bg-neutral-900/90">
                {project.image ? (
                  <div className="aspect-[16/10]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex aspect-[16/10] items-end bg-gradient-to-br p-5',
                      placeholderGradient(project.title)
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600/80 dark:text-white">
                      {project.date || 'Project'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.6rem] border border-neutral-200/70 bg-white/55 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/75 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">01 / Snapshot</p>
          <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
            Project snapshot
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MetaCard label="Role" value={project.subtitle || '—'} />
            <MetaCard label="Year" value={project.date || '—'} />
            <article className="rounded-2xl border border-neutral-200/80 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Focus</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(project.tags || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {signals.length > 0 && (
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            {signals.map((signal, signalIndex) => (
              <article
                key={signal}
                className="rounded-2xl border border-neutral-200/80 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Key signal {signalIndex + 1}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white">
                  {signal}
                </p>
              </article>
            ))}
          </section>
        )}

        {project.summary && (
          <section className="mt-8 rounded-[1.6rem] border border-neutral-200/70 bg-white/55 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/75 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">01b / Overview</p>
            <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
              Project overview
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-700 dark:text-white sm:text-lg">
              {project.summary}
            </p>
          </section>
        )}

        {project.content && (
          <section className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">02 / Delivery</p>
            <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
              What this project delivered
            </h2>
          <div className="mt-6 rounded-[1.3rem] border border-neutral-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-neutral-950/82">
              <div className="text-sm text-neutral-700 dark:text-white sm:text-base">
                <ReactMarkdown components={markdownComponents}>{project.content}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {project.detailImages && project.detailImages.length > 0 && (
          <section className="mt-8 rounded-[1.6rem] border border-neutral-200/70 bg-white/55 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/75 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">02b / Gallery</p>
            <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
              Project visuals
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.detailImages.map((src, index) => (
                <figure
                  key={src}
                  className="overflow-hidden rounded-[1.1rem] border border-neutral-200/80 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900/90"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {project.tags && project.tags.length > 0 && (
          <section className="mt-8 rounded-[1.6rem] border border-neutral-200/70 bg-white/55 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/75 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">03 / Tooling</p>
            <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
              Technology stack
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">04 / Continue</p>
          <h2 className="mt-2 inline-block border-b-2 border-accent pb-1 font-serif text-2xl text-primary">
            More projects to explore
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <RelatedCard key={item.slug} project={item} />
            ))}
          </div>
          {(prevProject || nextProject) && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {prevProject && <RelatedCard project={prevProject} label="Previous project" />}
              {nextProject && <RelatedCard project={nextProject} label="Next project" />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
