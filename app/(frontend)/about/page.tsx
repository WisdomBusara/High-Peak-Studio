import type { Metadata } from 'next'
import Image from 'next/image'
import { Hero } from '@/components/sections/Hero'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

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

export default function AboutPage() {
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
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-surface lg:col-span-5">
            <Image
              src="/images/service-design.jpg"
              alt="Architectural drawings and drafting tools on a desk"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-muted">Our approach</p>
            <h2 className="mt-4 text-4xl leading-[1.05] md:text-6xl">
              Great architecture emerges from deep engagement with a project&rsquo;s context.
            </h2>
            <div className="mt-8 space-y-5 text-lg text-muted">
              <p>
                We invest time in understanding client aspirations, site conditions, community needs, and cultural
                significance.
              </p>
              <p>
                This foundation informs our design process, which combines rigorous analysis with creative exploration.
                We believe that the best solutions emerge when technical expertise meets thoughtful design thinking.
              </p>
              <p>
                From concept through completion, we maintain close collaboration with our clients and project teams to
                ensure that the finished work reflects the vision and values that inspired it.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Let's work together."
        text="Whether you have a specific project in mind or are exploring possibilities, we'd welcome a conversation."
      />
    </>
  )
}
