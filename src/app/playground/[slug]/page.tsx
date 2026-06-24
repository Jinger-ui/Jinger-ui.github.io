import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlaygroundDetailPage from '@/components/playground/PlaygroundDetailPage';
import { loadPlaygroundDetail, loadPlaygroundProjects } from '@/lib/playgroundProjects.server';

export function generateStaticParams() {
  return loadPlaygroundProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = loadPlaygroundDetail(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | Playground`,
    description: project.summary,
  };
}

export default async function PlaygroundDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, projects } = loadPlaygroundDetail(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="-mt-16 min-h-screen lg:-mt-20">
      <PlaygroundDetailPage project={project} allProjects={projects} />
    </div>
  );
}
