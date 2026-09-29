import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { CtaBand } from '@/components/sections/CtaBand'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { getTeam } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'Highpeak Consultants Ltd is a contemporary architecture and consultancy practice based in Nairobi, Kenya.',
}

const VALUES = [
  {
    title: 'Innovation',
    text: 'We embrace contemporary design thinking while respecting proven architectural principles.',
  },
  {
    title: 'Sustainability',
    text: 'Environmental responsibility is integral to our design approach and project delivery.',
  },
  {
    title: 'Collaboration',
    text: 'We work closely with clients, communities, and stakeholders throughout the project lifecycle.',
  },
]

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <>
      <Hero
        eyebrow="Our practice"
        title="About Highpeak"
        description="A contemporary architecture and consultancy practice based in Nairobi, Kenya."
        image="/images/hero-about.jpg"
        imageAlt="Drafting desk with rulers, notebooks and an orange chair"
      />

      <section className="py-24 md:py-36">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow text-muted lg:col-span-4">Who we are</p>
          <Reveal className="lg:col-span-8">
            <p className="font-serif text-3xl leading-[1.15] md:text-5xl">
              Founded on principles of innovation, sustainability, and cultural sensitivity, we work across residential,
              commercial, institutional, and hospitality sectors.
            </p>
            <p className="mt-10 max-w-2xl text-lg text-muted">
              Our practice is distinguished by a commitment to understanding the unique context of each project—whether
              geographic, cultural, or functional—and translating that understanding into compelling architectural
              solutions.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-dark py-24 text-light md:py-36">
        <Container>
          <p className="eyebrow mb-16 text-light/50">Our values</p>
          <div className="grid gap-16 md:grid-cols-3 md:gap-10">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 120} className="border-t border-light/20 pt-8">
                <p className="eyebrow text-light/50">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-4 text-4xl">{value.title}</h2>
                <p className="mt-4 text-light/70">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-36">
        <Container>
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <p className="eyebrow text-muted lg:col-span-4">How we work</p>
            <Reveal className="lg:col-span-8">
              <h2 className="text-4xl leading-[1.05] md:text-6xl">
                Great architecture emerges from deep engagement with a project&rsquo;s context.
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                We believe the best solutions emerge when technical expertise meets thoughtful design thinking.
              </p>
            </Reveal>
          </div>
          <ProcessSteps />
        </Container>
      </section>

      <section className="border-t border-border py-24 md:py-36">
        <Container>
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <p className="eyebrow text-muted lg:col-span-4">The team</p>
            <h2 className="text-4xl leading-[1.05] md:text-6xl lg:col-span-8">The people behind the work.</h2>
          </div>
          <TeamGrid members={team} />
        </Container>
      </section>

      <CtaBand
        title="Let's work together."
        text="Whether you have a specific project in mind or are exploring possibilities, we'd welcome a conversation."
      />
    </>
  )
}
