import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { mockProjects } from '@/lib/mockData'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return mockProjects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = mockProjects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = mockProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3)

  const projectIndex = mockProjects.findIndex((p) => p.slug === slug)
  const nextProject = projectIndex < mockProjects.length - 1 ? mockProjects[projectIndex + 1] : null

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title={project.title}
        subtitle={project.category}
        minHeight="tall"
      />

      {/* Project Details */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Overview</h2>
                <p className="text-lg text-muted leading-relaxed">{project.description}</p>
              </div>

              <div className="aspect-video bg-surface">
                {project.heroImage && (
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="border-l-2 border-border pl-6 space-y-4">
                <div>
                  <p className="text-sm text-muted uppercase tracking-wider mb-1">Location</p>
                  <p className="font-serif text-lg">{project.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted uppercase tracking-wider mb-1">Year</p>
                  <p className="font-serif text-lg">{project.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted uppercase tracking-wider mb-1">Category</p>
                  <p className="font-serif text-lg capitalize">{project.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted uppercase tracking-wider mb-1">Status</p>
                  <p className="font-serif text-lg capitalize">{project.status.replace('-', ' ')}</p>
                </div>
              </div>

              <Link href="/contact">
                <Button className="w-full">Inquire About Project</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <Container>
            <h2 className="font-serif text-3xl font-bold mb-12">Related Projects</h2>
          </Container>
          <ProjectGrid projects={relatedProjects} columns={3} />
        </section>
      )}

      {/* Next Project CTA */}
      {nextProject && (
        <section className="py-16 md:py-24 bg-background">
          <Container>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted uppercase tracking-wider mb-2">Next Project</p>
                <h3 className="font-serif text-3xl font-bold">{nextProject.title}</h3>
              </div>
              <Link href={`/projects/${nextProject.slug}`}>
                <Button>View Project →</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}
    </div>
  )
}
