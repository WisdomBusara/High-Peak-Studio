import Link from 'next/link'
import { Hero } from '@/components/sections/Hero'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { ArticleGrid } from '@/components/sections/ArticleGrid'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { getArticles, getProjects, getServices } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, services, articles] = await Promise.all([getProjects(), getServices(), getArticles()])
  const [lead, ...rest] = projects
  const supporting = rest.slice(0, 2)

  return (
    <>
      <Hero
        size="full"
        eyebrow="Architecture & Consultancy · Nairobi"
        title="Spaces that serve communities and celebrate heritage."
        image="/images/hero-home.jpg"
        imageAlt="Sculpted metal facade curving overhead"
      >
        <ButtonLink href="/projects" variant="light">
          View our work
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline-light">
          Start a project
        </ButtonLink>
      </Hero>

      {/* Practice */}
      <section className="py-24 md:py-36">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow text-muted lg:col-span-4">01 — The practice</p>
          <Reveal className="lg:col-span-8">
            <p className="font-serif text-3xl leading-[1.15] md:text-5xl">
              Highpeak Consultants is a contemporary architecture and consultancy practice creating meaningful spaces
              that serve communities and celebrate cultural heritage.
            </p>
            <div className="mt-10 grid gap-8 text-muted md:grid-cols-2">
              <p>
                With expertise across residential, commercial, and institutional projects, we combine innovative design
                thinking with practical expertise to deliver sustainable and impactful solutions.
              </p>
              <p>
                Our approach prioritizes collaboration, environmental responsibility, and a deep understanding of local
                context.
              </p>
            </div>
            <ButtonLink href="/about" variant="outline" className="mt-12">
              About the practice
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* Selected work */}
      {lead && (
        <section className="pb-24 md:pb-36">
          <Container>
            <div className="mb-12 flex items-end justify-between gap-6 border-t border-border pt-10 md:mb-16">
              <div>
                <p className="eyebrow text-muted">02 — Selected work</p>
                <h2 className="mt-4 text-4xl md:text-6xl">Recent projects</h2>
              </div>
              <Link href="/projects" className="link-underline hidden shrink-0 text-sm md:inline-block">
                All projects →
              </Link>
            </div>

            <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <ProjectCard project={lead} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 58vw, 100vw" />
              </Reveal>
              <div className="flex flex-col gap-16 lg:col-span-5 lg:pt-40">
                {supporting.map((project, i) => (
                  <Reveal key={project.id} delay={i * 120}>
                    <ProjectCard project={project} sizes="(min-width: 1024px) 42vw, 100vw" />
                  </Reveal>
                ))}
              </div>
            </div>

            <ButtonLink href="/projects" variant="outline" className="mt-16 md:hidden">
              All projects
            </ButtonLink>
          </Container>
        </section>
      )}

      {/* Services */}
      <section className="bg-dark py-24 text-light md:py-36">
        <Container>
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <p className="eyebrow text-light/50 lg:col-span-4">03 — Services</p>
            <Reveal className="lg:col-span-8">
              <h2 className="text-4xl leading-[1.05] md:text-6xl">From first sketch to finished building.</h2>
              <p className="mt-6 max-w-2xl text-lg text-light/70">
                We provide comprehensive architecture and consultancy services tailored to our clients&rsquo; unique
                needs.
              </p>
            </Reveal>
          </div>
          <ServiceGrid services={services.slice(0, 4)} />
        </Container>
      </section>

      {/* Journal */}
      <section className="py-24 md:py-36">
        <Container>
          <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
            <div>
              <p className="eyebrow text-muted">04 — Journal</p>
              <h2 className="mt-4 text-4xl md:text-6xl">Insights & perspectives</h2>
            </div>
            <Link href="/journal" className="link-underline hidden shrink-0 text-sm md:inline-block">
              All articles →
            </Link>
          </div>
          <ArticleGrid articles={articles.slice(0, 3)} />
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
