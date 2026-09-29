import Link from 'next/link'
import { ProjectReel } from '@/components/sections/ProjectReel'
import { Ticker, type TickerItem } from '@/components/sections/Ticker'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { SectorPanels } from '@/components/sections/SectorPanels'
import { ServiceRows } from '@/components/sections/ServiceRows'
import { ArticleGrid } from '@/components/sections/ArticleGrid'
import { PressSection } from '@/components/sections/PressSection'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { RichContent } from '@/components/ui/RichContent'
import { getArticles, getFeaturedProjects, getPress, getProjects, getServices } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [featured, projects, services, articles, press] = await Promise.all([
    getFeaturedProjects(),
    getProjects(),
    getServices(),
    getArticles(),
    getPress(),
  ])
  const [lead, ...rest] = projects
  const supporting = rest.slice(0, 2)

  const tickerItems: TickerItem[] = [
    ...press
      .filter((item) => item.showInTicker)
      .map((item) => ({
        label: item.kind === 'award' ? 'Award' : 'Press',
        text: `${item.title}, ${item.source}`,
        sample: item.sample,
      })),
    ...articles.slice(0, 3).map((article) => ({
      label: 'Journal',
      text: article.title,
      href: `/journal/${article.slug}`,
    })),
  ]

  return (
    <>
      <h1 className="sr-only">Highpeak Consultants, architecture and consultancy in Nairobi, Kenya</h1>
      <ProjectReel projects={featured} />
      <Ticker items={tickerItems} />

      {/* Statement */}
      <section className="py-28 md:py-44">
        <Container>
          <p className="eyebrow text-laterite">01 — The practice · Nairobi, 1°17′ S 36°49′ E</p>
          <Reveal>
            <p className="mt-10 max-w-[18ch] font-serif text-[clamp(2.75rem,8vw,8.5rem)] leading-[0.98] tracking-tight">
              We create meaningful spaces that serve communities and celebrate cultural heritage.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-12">
            <p className="text-lg text-muted md:col-span-5 md:col-start-6">
              With expertise across residential, commercial, and institutional projects, we combine innovative design
              thinking with practical expertise to deliver sustainable and impactful solutions.
            </p>
            <div className="md:col-span-2 md:col-start-11 md:justify-self-end">
              <ButtonLink href="/about" variant="outline">
                About us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Recent projects */}
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

      <SectorPanels projects={projects} />

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
          <ServiceRows
            tone="dark"
            linkTo="page"
            rows={services.slice(0, 4).map((service) => ({
              id: service.id,
              slug: service.slug,
              name: service.name,
              image: service.heroImage,
              imageAlt: service.heroImageAlt,
              description: <RichContent value={service.description} />,
            }))}
          />
        </Container>
      </section>

      {/* Journal */}
      <section className="py-24 md:py-36">
        <Container>
          <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
            <div>
              <p className="eyebrow text-muted">04 — Journal</p>
              <h2 className="mt-4 text-4xl md:text-6xl">Insights &amp; perspectives</h2>
            </div>
            <Link href="/journal" className="link-underline hidden shrink-0 text-sm md:inline-block">
              All articles →
            </Link>
          </div>
          <ArticleGrid articles={articles.slice(0, 3)} />
        </Container>
      </section>

      <div className="border-t border-border">
        <PressSection items={press} eyebrow="05 — Recognition" />
      </div>

      <CtaBand />
    </>
  )
}
