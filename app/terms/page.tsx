import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Terms of Service"
        minHeight="tall"
      />

      <section className="py-16 md:py-24 bg-background">
        <Container className="max-w-2xl">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="font-serif text-3xl font-bold">Terms of Service</h2>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Agreement to Terms</h3>
              <p className="text-muted">
                These Terms of Service constitute a legally binding agreement made between you ("user," "you," or "your") and Highpeak Consultants Ltd ("Company," "we," "us," or "our"), concerning your access to and use of the highpeak.co.ke website and all related applications, services, and tools.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Intellectual Property Rights</h3>
              <p className="text-muted">
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">User Representations</h3>
              <p className="text-muted">
                By using the Site, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-4">
                <li>All registration information you submit is true, accurate, and complete</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information</li>
                <li>You have the legal capacity and you agree to comply with these Terms</li>
                <li>You will not access the Site through automated or non-human means</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Limitation of Liability</h3>
              <p className="text-muted">
                In no event shall the Company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of or in connection with the access to, display of, or use of the Site, even if we have been advised of the possibility of such damages.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted">
                If you have any questions about these Terms of Service, please contact us at hello@highpeak.co.ke
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
