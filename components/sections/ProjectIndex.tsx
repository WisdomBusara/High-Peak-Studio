'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { categoryLabel } from '@/components/sections/ProjectCard'
import { HoverPreview } from '@/components/ui/HoverPreview'
import { Pictogram, pictogramFor } from '@/components/ui/Pictogram'
import type { Project } from '@/lib/types'

type View = 'grid' | 'list'
const VIEW_KEY = 'highpeak-project-view'
const pad = (n: number) => String(n).padStart(2, '0')

function ProjectList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null)

  if (projects.length === 0) {
    return <p className="py-24 text-center text-muted">No projects in this sector yet.</p>
  }

  return (
    <div onMouseLeave={() => setActive(null)}>
      <ol className="border-t border-text">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[2.5rem_2.75rem_1fr] items-center gap-4 border-b border-border py-5 transition-colors duration-300 hover:text-laterite md:grid-cols-[3rem_3.5rem_minmax(0,5fr)_minmax(0,3fr)_4rem_minmax(0,2fr)] md:gap-6 md:py-6"
            >
              <span className="text-sm tabular-nums text-muted">{pad(i + 1)}</span>
              <Pictogram kind={pictogramFor(project)} className="h-10 w-10 text-muted transition-colors group-hover:text-laterite md:h-12 md:w-12" />
              <span className="font-serif text-2xl leading-tight md:text-4xl">{project.title}</span>
              <span className="hidden text-sm text-muted md:block">{project.location}</span>
              <span className="hidden text-sm tabular-nums text-muted md:block">{project.year}</span>
              <span className="eyebrow hidden text-right text-muted md:block">{categoryLabel(project.category)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <HoverPreview images={projects.map((p) => p.heroImage)} active={active} />
    </div>
  )
}

export function ProjectIndex({ projects, initialSector }: { projects: Project[]; initialSector?: string }) {
  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))), [projects])
  const [sector, setSector] = useState<string>(
    initialSector && categories.includes(initialSector as Project['category']) ? initialSector : 'all',
  )
  const [view, setView] = useState<View>('grid')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY)
      if (saved === 'grid' || saved === 'list') setView(saved)
    } catch {}
  }, [])

  const chooseView = (next: View) => {
    setView(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {}
  }

  const visible = sector === 'all' ? projects : projects.filter((p) => p.category === sector)
  const filters = [{ value: 'all', label: 'All' }, ...categories.map((c) => ({ value: c, label: categoryLabel(c) }))]

  return (
    <>
      <div className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border pb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSector(f.value)}
            aria-pressed={sector === f.value}
            className={`min-h-11 text-sm tracking-wide transition-colors ${
              sector === f.value ? 'text-laterite underline decoration-laterite underline-offset-8' : 'text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-6">
          <span className="text-sm tabular-nums text-muted">
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </span>
          <div className="flex border border-border" role="group" aria-label="View">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => chooseView(v)}
                aria-pressed={view === v}
                className={`min-h-11 px-4 text-sm capitalize transition-colors ${view === v ? 'bg-dark text-light' : 'text-muted hover:text-text'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      {view === 'grid' ? <ProjectGrid projects={visible} /> : <ProjectList projects={visible} />}
    </>
  )
}
