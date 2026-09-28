import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Article } from '@/lib/types'

interface ArticleGridProps {
  articles: Article[]
  limit?: number
}

export function ArticleGrid({ articles, limit }: ArticleGridProps) {
  const displayedArticles = limit ? articles.slice(0, limit) : articles

  if (displayedArticles.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <p className="text-center text-muted">No articles available yet.</p>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="space-y-12">
          {displayedArticles.map((article) => (
            <article key={article.id} className="pb-12 border-b border-border last:border-b-0 last:pb-0">
              <Link href={`/journal/${article.slug}`} className="group">
                {article.coverImage && (
                  <div className="relative aspect-video overflow-hidden bg-surface mb-6">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm text-muted">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold group-hover:underline">{article.title}</h3>
                  <p className="text-muted text-lg leading-relaxed">{article.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
