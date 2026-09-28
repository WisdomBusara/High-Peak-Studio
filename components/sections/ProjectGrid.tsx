import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Project } from '@/lib/types'

interface ProjectGridProps {
  projects: Project[]
  columns?: 2 | 3
}

export function ProjectGrid({ projects, columns = 3 }: ProjectGridProps) {
  const gridClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  if (projects.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <p className="text-center text-muted">No projects available yet.</p>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group overflow-hidden transition-transform hover:scale-95"
            >
              <div className="space-y-4">
                {project.heroImage && (
                  <div className="relative aspect-square overflow-hidden bg-surface">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold group-hover:underline">{project.title}</h3>
                  <div className="flex gap-2 text-sm text-muted">
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                  <p className="text-muted text-sm">{project.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
