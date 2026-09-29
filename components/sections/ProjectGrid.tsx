import { Reveal } from '@/components/ui/Reveal'
import { ProjectCard } from '@/components/sections/ProjectCard'
import type { Project } from '@/lib/types'

// Two columns with every third project spanning the full width, for an editorial rhythm.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="py-24 text-center text-muted">No projects in this category yet.</p>
  }

  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
      {projects.map((project, i) => {
        const wide = i % 3 === 0
        return (
          <Reveal key={project.id} className={wide ? 'md:col-span-2' : ''}>
            <ProjectCard
              project={project}
              aspect={wide ? 'aspect-[4/3] md:aspect-[21/9]' : 'aspect-[4/3]'}
              sizes={wide ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
            />
          </Reveal>
        )
      })}
    </div>
  )
}
