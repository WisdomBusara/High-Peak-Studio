import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Service } from '@/lib/types'

interface ServiceGridProps {
  services: Service[]
}

export function ServiceGrid({ services }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <p className="text-center text-muted">No services available yet.</p>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group space-y-4 hover:opacity-75 transition-opacity"
            >
              {service.heroImage && (
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <img
                    src={service.heroImage}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold group-hover:underline">{service.name}</h3>
                <p className="text-muted leading-relaxed line-clamp-3">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
