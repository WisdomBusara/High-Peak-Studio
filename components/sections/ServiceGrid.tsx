import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { RichContent } from '@/components/ui/RichContent'
import type { Service } from '@/lib/types'

// Designed for the dark band on the home page.
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service, i) => (
        <Reveal key={service.id} delay={i * 100}>
          <Link href="/services" className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-light/5 sm:aspect-[3/4]">
              {service.heroImage && (
                <Image
                  src={service.heroImage}
                  alt={service.heroImageAlt ?? service.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-80 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
              )}
            </div>
            <p className="eyebrow mt-6 text-light/50">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-3 text-3xl">{service.name}</h3>
            <RichContent value={service.description} className="mt-3 text-light/70" />
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
