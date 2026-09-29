import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import type { Article } from '@/lib/types'

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ArticleCard({ article, sizes = '(min-width: 768px) 33vw, 100vw' }: { article: Article; sizes?: string }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden bg-surface">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        )}
      </div>
      <p className="eyebrow mt-6 text-muted">
        {article.category} · {formatDate(article.publishedAt)}
      </p>
      <h3 className="mt-3 text-2xl md:text-3xl">{article.title}</h3>
      <p className="mt-3 text-muted">{article.excerpt}</p>
    </Link>
  )
}

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const columns = articles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  return (
    <div className={`grid gap-x-8 gap-y-16 ${columns}`}>
      {articles.map((article, i) => (
        <Reveal key={article.id} delay={i * 100}>
          <ArticleCard article={article} />
        </Reveal>
      ))}
    </div>
  )
}
