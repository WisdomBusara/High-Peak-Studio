'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { HoverPreview } from '@/components/ui/HoverPreview'

export interface ServiceRow {
  id: string
  slug: string
  name: string
  image?: string
  imageAlt?: string
  description: ReactNode
  capabilities?: string[]
}

interface ServiceRowsProps {
  rows: ServiceRow[]
  tone?: 'light' | 'dark'
  linkTo?: 'page' | 'anchor'
}

const pad = (n: number) => String(n).padStart(2, '0')

export function ServiceRows({ rows, tone = 'light', linkTo = 'anchor' }: ServiceRowsProps) {
  const [active, setActive] = useState<number | null>(null)
  const dark = tone === 'dark'

  return (
    <div onMouseLeave={() => setActive(null)}>
      <ol className={`border-b ${dark ? 'border-light/20' : 'border-border'}`}>
        {rows.map((row, i) => {
          const inner = (
            <div className="grid gap-x-8 gap-y-4 py-10 md:grid-cols-12 md:items-baseline md:py-12">
              <span className={`font-serif text-5xl tabular-nums md:col-span-2 md:text-7xl ${dark ? 'text-laterite-light/80' : 'text-laterite'}`}>
                {pad(i + 1)}
              </span>
              <h3 className="text-4xl leading-none md:col-span-5 md:text-6xl">{row.name}</h3>
              <div className={`md:col-span-5 ${dark ? 'text-light/70' : 'text-muted'}`}>
                {row.description}
                {row.capabilities && row.capabilities.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {row.capabilities.map((c) => (
                      <li key={c} className={`border px-3 py-1 text-xs ${dark ? 'border-light/25' : 'border-border'}`}>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {row.image && (
                <div className="relative aspect-[4/3] overflow-hidden md:hidden">
                  <Image src={row.image} alt={row.imageAlt ?? row.name} fill sizes="100vw" className="object-cover" />
                </div>
              )}
            </div>
          )
          return (
            <li
              key={row.id}
              id={linkTo === 'anchor' ? row.slug : undefined}
              onMouseEnter={() => setActive(i)}
              className={`scroll-mt-24 border-t transition-colors duration-300 ${dark ? 'border-light/20 hover:bg-light/[0.03]' : 'border-border hover:bg-surface/60'}`}
            >
              {linkTo === 'page' ? (
                <Link href={`/services#${row.slug}`} className="block" onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ol>
      <HoverPreview images={rows.map((r) => r.image)} active={active} width={360} />
    </div>
  )
}
