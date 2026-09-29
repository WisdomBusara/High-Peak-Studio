import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SampleTag } from '@/components/ui/SampleTag'
import type { PressItem } from '@/lib/types'

function formatMonth(date: Date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function Column({ title, items }: { title: string; items: PressItem[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="eyebrow text-muted">{title}</p>
      <ul className="mt-6 border-b border-border">
        {items.map((item) => {
          const heading = <span className="font-serif text-2xl leading-snug md:text-3xl">{item.title}</span>
          return (
            <li key={item.id} className="border-t border-border py-6">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{item.source}</span>
                <span aria-hidden>·</span>
                <span>{formatMonth(item.date)}</span>
                {item.sample && <SampleTag />}
              </p>
              <p className="mt-3">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-laterite">
                    {heading} <span aria-hidden className="text-laterite">↗</span>
                  </a>
                ) : (
                  heading
                )}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function PressSection({ items, eyebrow }: { items: PressItem[]; eyebrow: string }) {
  if (items.length === 0) return null
  const press = items.filter((i) => i.kind === 'press')
  const awards = items.filter((i) => i.kind === 'award')

  return (
    <section className="py-24 md:py-36">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-6xl">Press &amp; awards</h2>
        </div>
        <Reveal className="grid gap-12 md:grid-cols-2 lg:col-span-8">
          <Column title="Press" items={press} />
          <Column title="Awards" items={awards} />
        </Reveal>
      </Container>
    </section>
  )
}
