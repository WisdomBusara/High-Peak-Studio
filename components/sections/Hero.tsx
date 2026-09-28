import { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  children?: ReactNode
  minHeight?: 'screen' | 'tall'
}

export function Hero({
  title,
  subtitle,
  description,
  image,
  children,
  minHeight = 'screen',
}: HeroProps) {
  const minHeightClass = minHeight === 'screen' ? 'min-h-screen' : 'min-h-96'

  return (
    <section
      className={`relative ${minHeightClass} flex items-center justify-center overflow-hidden bg-background`}
      style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {image && <div className="absolute inset-0 bg-black/40" />}
      <Container className="relative z-10 text-center space-y-6 max-w-3xl py-20">
        {subtitle && <p className="text-muted uppercase tracking-wider text-sm">{subtitle}</p>}
        <h1 className="text-5xl md:text-7xl font-serif font-bold">{title}</h1>
        {description && <p className="text-xl md:text-2xl text-muted leading-relaxed">{description}</p>}
        {children}
      </Container>
    </section>
  )
}
