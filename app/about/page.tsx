import Link from 'next/link'
import { Hero } from '@/components/sections/Hero'
import { TextSection } from '@/components/sections/TextSection'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="About Highpeak"
        subtitle="Our Practice"
        minHeight="tall"
      />

      <TextSection
        title="Who We Are"
        content={
          <div className="space-y-4">
            <p>
              Highpeak Consultants Ltd is a contemporary architecture and consultancy practice based in Nairobi, Kenya. Founded on principles of innovation, sustainability, and cultural sensitivity, we work across residential, commercial, institutional, and hospitality sectors.
            </p>
            <p>
              Our practice is distinguished by a commitment to understanding the unique context of each project—whether geographic, cultural, or functional—and translating that understanding into compelling architectural solutions.
            </p>
          </div>
        }
      />

      <TextSection
        title="Our Values"
        background="surface"
        content={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-serif text-xl font-bold mb-3">Innovation</h4>
              <p className="text-muted">
                We embrace contemporary design thinking while respecting proven architectural principles.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold mb-3">Sustainability</h4>
              <p className="text-muted">
                Environmental responsibility is integral to our design approach and project delivery.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold mb-3">Collaboration</h4>
              <p className="text-muted">
                We work closely with clients, communities, and stakeholders throughout the project lifecycle.
              </p>
            </div>
          </div>
        }
      />

      <TextSection
        title="Our Approach"
        content={
          <div className="space-y-4">
            <p>
              Great architecture emerges from deep engagement with a project's context. We invest time in understanding client aspirations, site conditions, community needs, and cultural significance.
            </p>
            <p>
              This foundation informs our design process, which combines rigorous analysis with creative exploration. We believe that the best solutions emerge when technical expertise meets thoughtful design thinking.
            </p>
            <p>
              From concept through completion, we maintain close collaboration with our clients and project teams to ensure that the finished work reflects the vision and values that inspired it.
            </p>
          </div>
        }
      />

      <section className="py-16 md:py-24 bg-surface">
        <Container className="text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            Whether you have a specific project in mind or are exploring possibilities, we'd welcome a conversation.
          </p>
          <Link href="/contact">
            <Button>Get In Touch</Button>
          </Link>
        </Container>
      </section>
    </div>
  )
}
