import { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

interface TextSectionProps {
  title?: string
  content: ReactNode
  background?: 'background' | 'surface'
  centered?: boolean
}

export function TextSection({
  title,
  content,
  background = 'background',
  centered = false,
}: TextSectionProps) {
  const bgClass = background === 'surface' ? 'bg-surface' : 'bg-background'

  return (
    <section className={`py-16 md:py-24 ${bgClass}`}>
      <Container className={centered ? 'max-w-2xl' : ''}>
        {title && <h2 className="font-serif text-4xl font-bold mb-8">{title}</h2>}
        <div className={`prose prose-lg ${centered ? 'text-center' : ''}`}>
          {typeof content === 'string' ? (
            <p className="text-lg text-muted leading-relaxed whitespace-pre-line">{content}</p>
          ) : (
            content
          )}
        </div>
      </Container>
    </section>
  )
}
