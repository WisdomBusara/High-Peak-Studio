import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

interface CtaBandProps {
  title?: string
  text?: string
  image?: string
}

export function CtaBand({
  title = 'Have a project in mind?',
  text = "Let's collaborate on creating spaces that matter. Reach out to discuss your project requirements.",
  image = '/images/cta-dark-tower.jpg',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-dark text-light">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-50" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
      <Container className="relative py-28 md:py-40">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-light/60">Start a project</p>
          <h2 className="mt-6 text-5xl leading-[1.02] md:text-7xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg text-light/75">{text}</p>
          <ButtonLink href="/contact" variant="light" className="mt-10">
            Start a conversation
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  )
}
