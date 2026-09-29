import Link from 'next/link'
import { Pictogram, pictogramForCategory } from '@/components/ui/Pictogram'
import { categoryLabel } from '@/components/sections/ProjectCard'
import type { Project } from '@/lib/types'

const TONES = [
  'bg-laterite text-light',
  'bg-surface text-text',
  'bg-dark text-light',
  'bg-laterite-light text-laterite-deep',
]

// One panel per sector that has projects, each linking to the filtered project index.
export function SectorPanels({ projects }: { projects: Project[] }) {
  const counts = new Map<Project['category'], number>()
  for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  const sectors = Array.from(counts.entries()).slice(0, 4)
  if (sectors.length === 0) return null

  const columns = ['', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2 lg:grid-cols-4'][sectors.length - 1]

  return (
    <section aria-label="Sectors" className={`grid ${columns}`}>
      {sectors.map(([category, count], i) => (
        <Link
          key={category}
          href={`/projects?sector=${category}`}
          className={`group flex min-h-[320px] flex-col justify-between p-8 transition-[filter] duration-300 hover:brightness-110 md:min-h-[400px] lg:p-10 ${TONES[i % TONES.length]}`}
        >
          <p className="eyebrow opacity-70">Sector</p>
          <Pictogram
            kind={pictogramForCategory(category)}
            className="h-24 w-24 transition-transform duration-500 group-hover:-translate-y-1 md:h-28 md:w-28"
          />
          <div>
            <h3 className="text-4xl md:text-5xl">{categoryLabel(category)}</h3>
            <p className="mt-2 text-sm opacity-75">
              {count} {count === 1 ? 'project' : 'projects'} <span aria-hidden>→</span>
            </p>
          </div>
        </Link>
      ))}
    </section>
  )
}
