import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        eyebrow="Legal"
        title="Privacy Policy"
        size="short"
      />

      <section className="py-16 md:py-24 bg-background">
        <Container className="max-w-2xl">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="font-serif text-3xl font-bold">Privacy Policy</h2>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Introduction</h3>
              <p className="text-muted">
                Highpeak Consultants Ltd ("we," "us," or "our") operates the highpeak.co.ke website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Information Collection and Use</h3>
              <p className="text-muted">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-4">
                <li>Personal Data: name, email address, phone number, company information</li>
                <li>Usage Data: information about how you access and use the Service</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Use of Data</h3>
              <p className="text-muted">
                Highpeak Consultants Ltd uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To gather analysis or valuable information about Service usage</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Security of Data</h3>
              <p className="text-muted">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Contact Us</h3>
              <p className="text-muted">
                If you have any questions about this Privacy Policy, please contact us at hello@highpeak.co.ke
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
