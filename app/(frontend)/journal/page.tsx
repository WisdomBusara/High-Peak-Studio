import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '@/components/sections/Hero'
import { ArticleGrid, formatDate } from '@/components/sections/ArticleGrid'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { getArticles } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Thoughts on architecture, design, and the built environment.',
}

export default async function JournalPage() {
  const [featured, ...rest] = await getArticles()

  return (
    <>
      <Hero
        eyebrow="Insights & perspectives"
        title="Journal"
        description="Thoughts on architecture, design, and the built environment."
        image="/images/hero-journal.jpg"
        imageAlt="Carved stone vaults seen from below"
      />

      <section className="py-20 md:py-28">
        <Container>
          {featured && (
            <Reveal>
              <Link href={`/journal/${featured.slug}`} className="group grid items-center gap-10 lg:grid-cols-12">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:col-span-7">
                  {featured.coverImage && (
                    <Image
                      src={featured.coverImage}
                      alt={featured.coverImageAlt ?? featured.title}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="lg:col-span-5">
                  <p className="eyebrow text-muted">
                    {featured.category} · {formatDate(featured.publishedAt)}
                  </p>
                  <h2 className="mt-4 text-4xl leading-[1.05] md:text-5xl">{featured.title}</h2>
                  <p className="mt-6 text-lg text-muted">{featured.excerpt}</p>
                  <span className="link-underline mt-8 inline-block text-sm">Read the article →</span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-24 border-t border-border pt-16 md:mt-32">
              <ArticleGrid articles={rest} />
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
