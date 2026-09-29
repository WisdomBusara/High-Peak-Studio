import Image from 'next/image'
import Link from 'next/link'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import type { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  aspect?: string
  sizes?: string
}

export function categoryLabel(category: Project['category']) {
  return PROJECT_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export function ProjectCard({ project, aspect = 'aspect-[4/3]', sizes = '(min-width: 768px) 50vw, 100vw' }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className={`relative ${aspect} overflow-hidden bg-surface`}>
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.heroImageAlt ?? project.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-serif text-3xl text-muted">
            {project.title}
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-dark/0 transition-colors duration-500 group-hover:bg-dark/10" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {project.location} · {project.year}
          </p>
        </div>
        <span className="eyebrow mt-2 shrink-0 text-muted">{categoryLabel(project.category)}</span>
      </div>
    </Link>
  )
}
