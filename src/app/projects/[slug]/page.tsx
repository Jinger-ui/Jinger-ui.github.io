import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailPage from '@/components/projects/ProjectDetailPage';
import { loadPortfolioProjects, loadProjectDetail } from '@/lib/portfolioProjects.server';

export function generateStaticParams() {
  return loadPortfolioProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = loadProjectDetail(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, projects } = loadProjectDetail(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPage project={project} allProjects={projects} />;
}
