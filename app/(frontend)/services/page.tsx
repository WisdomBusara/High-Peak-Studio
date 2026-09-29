import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { ServiceRows } from '@/components/sections/ServiceRows'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { RichContent } from '@/components/ui/RichContent'
import { getServices } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Architecture and consultancy services by Highpeak Consultants.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <Hero
        eyebrow="What we offer"
        title="Services"
        description="Comprehensive architecture and consultancy services."
        image="/images/hero-services.jpg"
        imageAlt="Glass tower rising into a pale sky"
      />

      <section className="py-20 md:py-32">
        <Container>
          <ServiceRows
            rows={services.map((service) => ({
              id: service.id,
              slug: service.slug,
              name: service.name,
              image: service.heroImage,
              imageAlt: service.heroImageAlt,
              description: <RichContent value={service.description} className="text-lg" />,
              capabilities: service.capabilities,
            }))}
          />
        </Container>
      </section>

      <section className="bg-dark py-24 text-light md:py-36">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow text-light/50 lg:col-span-4">Our approach</p>
          <Reveal className="lg:col-span-8">
            <p className="font-serif text-3xl leading-[1.15] md:text-5xl">
              Great architecture stems from a thorough understanding of client needs, site context, and cultural
              significance.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-light/70">
              Our services are tailored to each project, combining technical expertise with creative vision. From initial
              concept through project completion, we work collaboratively with clients and stakeholders to ensure that
              the built outcome reflects the aspirations and values that inspired it.
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
