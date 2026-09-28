import { Hero } from '@/components/sections/Hero'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { TextSection } from '@/components/sections/TextSection'
import { mockServices } from '@/lib/mockData'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Services"
        subtitle="What We Offer"
        minHeight="tall"
        description="Comprehensive architecture and consultancy services"
      />

      <ServiceGrid services={mockServices} />

      <TextSection
        title="Our Approach"
        background="surface"
        content={
          <div className="space-y-4">
            <p>
              We believe that great architecture stems from a thorough understanding of client needs, site context, and cultural significance. Our services are tailored to each project, combining technical expertise with creative vision.
            </p>
            <p>
              From initial concept through project completion, we work collaboratively with clients and stakeholders to ensure that the built outcome reflects the aspirations and values that inspired it.
            </p>
          </div>
        }
      />
    </div>
  )
}
