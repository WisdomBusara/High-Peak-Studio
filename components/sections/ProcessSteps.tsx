import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'

// The order of these steps is the order Highpeak works in, so the numbers carry meaning.
const STEPS = [
  {
    title: 'Understand',
    text: 'We start with client aspirations, site conditions, community needs and cultural significance.',
    image: '/images/project-masterplan.jpg',
    alt: 'Aerial view of green tea fields planted in rows',
  },
  {
    title: 'Explore',
    text: 'Sketches, models and options, combining rigorous analysis with creative exploration.',
    image: '/images/service-design.jpg',
    alt: 'Architectural drawings and drafting tools on a desk',
  },
  {
    title: 'Develop',
    text: 'Detailed design and documentation, worked through closely with the project team.',
    image: '/images/hero-about.jpg',
    alt: 'Drafting desk with rulers, notebooks and an orange chair',
  },
  {
    title: 'Deliver',
    text: 'Close collaboration through construction, so the finished work reflects the vision behind it.',
    image: '/images/service-management.jpg',
    alt: 'Steel structure seen from below',
  },
]

export function ProcessSteps() {
  return (
    <ol className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={i * 100}>
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <Image src={step.image} alt={step.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-6 flex items-baseline gap-4">
              <span className="font-serif text-4xl tabular-nums text-laterite">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-serif text-3xl">{step.title}</span>
            </p>
            <p className="mt-3 text-muted">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
