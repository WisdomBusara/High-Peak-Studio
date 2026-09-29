import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { ProjectIndex } from '@/components/sections/ProjectIndex'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { getProjects } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Residential, commercial, institutional and hospitality projects by Highpeak Consultants.',
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ sector?: string }> }) {
  const [projects, { sector }] = await Promise.all([getProjects(), searchParams])

  return (
    <>
      <Hero
        eyebrow="Our work"
        title="Projects"
        description="A selection of projects across various sectors and scales."
        image="/images/hero-projects.jpg"
        imageAlt="Glass and steel canopy seen from below"
      />
      <section className="py-20 md:py-28">
        <Container>
          <ProjectIndex projects={projects} initialSector={sector} />
        </Container>
      </section>
      <CtaBand />
    </>
  )
}
