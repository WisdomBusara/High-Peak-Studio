import Link from 'next/link'

export interface TickerItem {
  label: string
  text: string
  href?: string
  sample?: boolean
}

function Items({ items, hidden = false }: { items: TickerItem[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => {
        const content = (
          <>
            <span className="eyebrow mr-3 text-light/60">{item.label}</span>
            <span>{item.text}</span>
            {item.sample && <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-light/60">(sample)</span>}
          </>
        )
        return (
          <li key={i} className="flex items-center whitespace-nowrap px-8">
            {item.href && !hidden ? (
              <Link href={item.href} className="hover:underline hover:underline-offset-4">
                {content}
              </Link>
            ) : (
              content
            )}
            <span aria-hidden className="ml-16 h-1.5 w-1.5 rounded-full bg-light/40" />
          </li>
        )
      })}
    </ul>
  )
}

// A slow news ticker in the accent colour. The list is duplicated so the loop is seamless.
export function Ticker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null
  return (
    <section aria-label="Latest news" className="ticker overflow-hidden bg-laterite py-4 text-sm text-light">
      <div className="ticker-track flex w-max">
        <Items items={items} />
        <Items items={items} hidden />
      </div>
    </section>
  )
}
