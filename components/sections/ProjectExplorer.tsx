'use client'

import { useMemo, useState } from 'react'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { categoryLabel } from '@/components/sections/ProjectCard'
import type { Project } from '@/lib/types'

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>('all')

  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))), [projects])
  const visible = active === 'all' ? projects : projects.filter((p) => p.category === active)

  const filters = [{ value: 'all', label: 'All' }, ...categories.map((c) => ({ value: c, label: categoryLabel(c) }))]

  return (
    <>
      <div className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border pb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={`min-h-11 text-sm tracking-wide transition-colors ${
              active === f.value ? 'text-text underline underline-offset-8' : 'text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      <ProjectGrid projects={visible} />
    </>
  )
}
