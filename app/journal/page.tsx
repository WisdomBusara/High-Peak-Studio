import { Hero } from '@/components/sections/Hero'
import { ArticleGrid } from '@/components/sections/ArticleGrid'
import { mockArticles } from '@/lib/mockData'

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Journal"
        subtitle="Insights & Perspectives"
        minHeight="tall"
        description="Thoughts on architecture, design, and the built environment"
      />

      <ArticleGrid articles={mockArticles} />
    </div>
  )
}
