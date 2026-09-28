import Link from 'next/link'
import { Hero } from '@/components/sections/Hero'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { ArticleGrid } from '@/components/sections/ArticleGrid'
import { TextSection } from '@/components/sections/TextSection'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { mockProjects, mockServices, mockArticles } from '@/lib/mockData'

export default function Home() {
  const featuredProjects = mockProjects.slice(0, 3)
  const recentArticles = mockArticles.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        title="Highpeak Consultants"
        subtitle="Architecture & Consultancy"
        description="Contemporary design practices rooted in innovation and cultural sensitivity"
      >
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/projects">
            <Button>View Projects</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary">Get In Touch</Button>
          </Link>
        </div>
      </Hero>

      {/* Featured Projects */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted text-lg max-w-2xl">
              A selection of our recent work across residential, commercial, and institutional sectors.
            </p>
          </div>
        </Container>
        <ProjectGrid projects={featuredProjects} columns={3} />
        <Container className="mt-12">
          <Link href="/projects">
            <Button variant="secondary">View All Projects</Button>
          </Link>
        </Container>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-surface">
        <Container>
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Services</h2>
            <p className="text-muted text-lg max-w-2xl">
              We provide comprehensive architecture and consultancy services tailored to our clients' unique needs.
            </p>
          </div>
        </Container>
        <ServiceGrid services={mockServices} />
      </section>

      {/* About Section */}
      <TextSection
        title="About Highpeak"
        content={
          <div className="space-y-4">
            <p>
              Highpeak Consultants Ltd is a contemporary architecture and consultancy practice dedicated to creating meaningful spaces that serve communities and celebrate cultural heritage.
            </p>
            <p>
              With expertise across residential, commercial, and institutional projects, we combine innovative design thinking with practical expertise to deliver sustainable and impactful solutions.
            </p>
            <p>
              Our approach prioritizes collaboration, environmental responsibility, and a deep understanding of local context.
            </p>
          </div>
        }
      />

      {/* Journal Section */}
      <section className="py-16 md:py-24 bg-surface">
        <Container>
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Journal</h2>
            <p className="text-muted text-lg max-w-2xl">
              Insights and perspectives on architecture, design, and the built environment.
            </p>
          </div>
        </Container>
        <ArticleGrid articles={recentArticles} limit={3} />
        <Container className="mt-12">
          <Link href="/journal">
            <Button variant="secondary">Read More Articles</Button>
          </Link>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <Container className="text-center max-w-2xl">
          <h2 className="font-serif text-4xl font-bold mb-6">Have a Project in Mind?</h2>
          <p className="text-muted text-lg mb-8">
            Let's collaborate on creating spaces that matter. Reach out to discuss your project requirements.
          </p>
          <Link href="/contact">
            <Button>Start a Conversation</Button>
          </Link>
        </Container>
      </section>
    </div>
  )
}
