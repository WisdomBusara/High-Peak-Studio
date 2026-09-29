import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { ArticleGrid, formatDate } from '@/components/sections/ArticleGrid'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { RichContent } from '@/components/ui/RichContent'
import { getArticles } from '@/lib/content'

export const dynamic = 'force-dynamic'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = (await getArticles()).find((a) => a.slug === slug)
  return article ? { title: article.title, description: article.excerpt } : {}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const articles = await getArticles()
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  const more = articles.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <>
      <Hero
        eyebrow={`${article.category} · ${formatDate(article.publishedAt)}`}
        title={article.title}
        image={article.coverImage}
        imageAlt={article.coverImageAlt}
      />

      <article className="py-20 md:py-28">
        <Container className="max-w-3xl">
          <p className="text-sm text-muted">By {article.author}</p>
          <p className="mt-8 font-serif text-2xl leading-snug md:text-3xl">{article.excerpt}</p>
          <RichContent value={article.body} className="mt-10 text-lg text-text/80" />
          <div className="mt-16 border-t border-border pt-10">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
          </div>
        </Container>
      </article>

      {more.length > 0 && (
        <section className="bg-surface py-24 md:py-32">
          <Container>
            <h2 className="mb-12 text-4xl md:text-5xl">More from the journal</h2>
            <ArticleGrid articles={more} />
          </Container>
        </section>
      )}
    </>
  )
}
