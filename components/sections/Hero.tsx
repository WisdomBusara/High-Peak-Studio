import Image from 'next/image'
import { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

interface HeroProps {
  title: string
  eyebrow?: string
  description?: string
  image?: string
  imageAlt?: string
  size?: 'full' | 'tall' | 'short'
  children?: ReactNode
}

const heights = {
  full: 'min-h-[100svh]',
  tall: 'min-h-[75svh]',
  short: 'min-h-[50svh]',
}

export function Hero({ title, eyebrow, description, image, imageAlt = '', size = 'tall', children }: HeroProps) {
  return (
    <section className={`relative flex ${heights[size]} items-end overflow-hidden bg-dark text-light`}>
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="hero-settle object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
        </>
      )}
      <Container className="relative pb-14 pt-36 md:pb-20">
        {eyebrow && <p className="eyebrow mb-6 text-light/70">{eyebrow}</p>}
        <h1 className="max-w-5xl text-5xl leading-[1.02] md:text-7xl lg:text-8xl">{title}</h1>
        {description && <p className="mt-6 max-w-2xl text-lg text-light/80 md:text-xl">{description}</p>}
        {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
      </Container>
    </section>
  )
}
