import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { ProjectCard, categoryLabel } from '@/components/sections/ProjectCard'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { RichContent } from '@/components/ui/RichContent'
import { PROJECT_STATUSES } from '@/lib/constants'
import { getProjects } from '@/lib/content'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = (await getProjects()).find((p) => p.slug === slug)
  return project ? { title: project.title } : {}
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const others = projects.filter((p) => p.id !== project.id && p.id !== next.id)
  const related = [
    ...others.filter((p) => p.category === project.category),
    ...others.filter((p) => p.category !== project.category),
  ].slice(0, 2)

  const facts = [
    { label: 'Location', value: project.location },
    { label: 'Year', value: String(project.year) },
    { label: 'Sector', value: categoryLabel(project.category) },
    { label: 'Status', value: PROJECT_STATUSES.find((s) => s.value === project.status)?.label ?? project.status },
  ]

  return (
    <>
      <Hero
        size="full"
        eyebrow={`${categoryLabel(project.category)} · ${project.location}`}
        title={project.title}
        image={project.heroImage}
        imageAlt={project.heroImageAlt}
      />

      <section className="border-b border-border">
        <Container>
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="border-border py-8 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0">
                <dt className="eyebrow text-muted">{fact.label}</dt>
                <dd className="mt-3 font-serif text-2xl md:text-3xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow text-muted lg:col-span-4">Overview</p>
          <Reveal className="lg:col-span-8">
            <RichContent value={project.description} className="font-serif text-2xl leading-snug md:text-4xl" />
            <ButtonLink href="/contact" className="mt-12">
              Discuss a similar project
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-24 md:pb-32">
          <Container className="grid gap-8 md:grid-cols-2">
            {project.gallery.map((picture, i) => (
              <Reveal key={picture.src} className={i % 3 === 0 ? 'md:col-span-2' : ''}>
                <div className={`relative overflow-hidden bg-surface ${i % 3 === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                  <Image src={picture.src} alt={picture.alt} fill sizes={i % 3 === 0 ? '100vw' : '50vw'} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-surface py-24 md:py-32">
          <Container>
            <h2 className="mb-12 text-4xl md:text-5xl">More projects</h2>
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {related.map((p) => (
                <Reveal key={p.id}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {next && next.id !== project.id && (
        <Link href={`/projects/${next.slug}`} className="group relative block overflow-hidden bg-dark text-light">
          {next.heroImage && (
            <Image
              src={next.heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-50 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-60"
            />
          )}
          <Container className="relative py-28 md:py-40">
            <p className="eyebrow text-light/60">Next project</p>
            <p className="mt-6 font-serif text-5xl leading-[1.02] md:text-8xl">
              {next.title} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-3">→</span>
            </p>
          </Container>
        </Link>
      )}
    </>
  )
}
