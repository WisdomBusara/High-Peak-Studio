import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-serif font-bold mb-4">Highpeak</h4>
            <p className="text-sm text-muted">
              Contemporary architecture and consultancy practice
            </p>
          </div>

          <div>
            <h5 className="font-bold text-sm uppercase tracking-wide mb-4">Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-muted hover:text-text transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted hover:text-text transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-text transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-muted hover:text-text transition-colors">
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm uppercase tracking-wide mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted hover:text-text transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-text transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm uppercase tracking-wide mb-4">Contact</h5>
            <p className="text-sm text-muted">
              hello@highpeak.co.ke
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted">
          <p>&copy; 2026 Highpeak Consultants Ltd. All rights reserved.</p>
          <p>Crafted with care</p>
        </div>
      </Container>
    </footer>
  )
}
