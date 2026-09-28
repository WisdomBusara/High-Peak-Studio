import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArticleGrid } from '@/components/sections/ArticleGrid'
import { mockArticles } from '@/lib/mockData'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = mockArticles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = mockArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title={article.title}
        minHeight="tall"
      />

      {/* Article Content */}
      <section className="py-16 md:py-24 bg-background">
        <Container className="max-w-2xl">
          <div className="mb-12 pb-12 border-b border-border">
            <div className="flex gap-2 text-sm text-muted mb-6">
              <span>{article.author}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
          </div>

          {article.coverImage && (
            <div className="relative aspect-video bg-surface mb-12 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted leading-relaxed mb-6">{article.excerpt}</p>
            <p className="text-lg text-muted leading-relaxed whitespace-pre-line">{article.body}</p>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <Link href="/contact">
              <Button>Get In Touch</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <Container>
            <h2 className="font-serif text-3xl font-bold mb-12">More from Journal</h2>
          </Container>
          <ArticleGrid articles={relatedArticles} />
        </section>
      )}
    </div>
  )
}
