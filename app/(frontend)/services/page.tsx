import type { Metadata } from 'next'
import Image from 'next/image'
import { Hero } from '@/components/sections/Hero'
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

      <section className="py-24 md:py-36">
        <Container className="space-y-24 md:space-y-36">
          {services.map((service, i) => (
            <Reveal key={service.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden bg-surface lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                {service.heroImage && (
                  <Image
                    src={service.heroImage}
                    alt={service.heroImageAlt ?? service.name}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="lg:col-span-5">
                <p className="eyebrow text-muted">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-4 text-4xl md:text-6xl">{service.name}</h2>
                <RichContent value={service.description} className="mt-6 text-lg text-muted" />
                {service.capabilities && service.capabilities.length > 0 && (
                  <ul className="mt-8 divide-y divide-border border-y border-border">
                    {service.capabilities.map((capability) => (
                      <li key={capability} className="py-3">
                        {capability}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
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
