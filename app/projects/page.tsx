'use client'

import { useState, useMemo } from 'react'
import { Hero } from '@/components/sections/Hero'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { Container } from '@/components/ui/Container'
import { mockProjects } from '@/lib/mockData'
import type { Project } from '@/lib/types'

const CATEGORIES = [
  { value: 'all', label: 'All Projects' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'institutional', label: 'Institutional' },
  { value: 'hospitality', label: 'Hospitality' },
]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredProjects: Project[] = useMemo(() => {
    if (activeCategory === 'all') return mockProjects
    return mockProjects.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Projects"
        subtitle="Our Work"
        minHeight="tall"
        description="A selection of projects across various sectors and scales"
      />

      <section className="py-16 md:py-24 bg-background">
        <Container>
          {/* Filters */}
          <div className="mb-12 pb-12 border-b border-border">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat.value
                      ? 'bg-text text-background'
                      : 'border border-border text-text hover:border-text'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted mb-8">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </Container>

        {/* Grid */}
        <ProjectGrid projects={filteredProjects} columns={3} />
      </section>
    </div>
  )
}
