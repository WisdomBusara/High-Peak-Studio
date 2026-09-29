import Link from 'next/link'
import { Container } from '@/components/ui/Container'

const EXPLORE = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="bg-dark text-light">
      <Container className="py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-serif text-4xl leading-[1.05] md:text-6xl">Let&rsquo;s create spaces that matter.</p>
            <a href="mailto:hello@highpeak.co.ke" className="link-underline mt-8 inline-block text-lg">
              hello@highpeak.co.ke
            </a>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="eyebrow mb-6 text-light/50">Explore</p>
            <ul className="space-y-3">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-light/80 hover:text-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-6 text-light/50">Studio</p>
            <p className="text-light/80">Nairobi, Kenya</p>
            <p className="mt-1 text-sm tabular-nums text-light/50">1°17′ S 36°49′ E</p>
            <ul className="mt-8 space-y-3">
              <li>
                <Link href="/privacy" className="link-underline text-light/80 hover:text-light">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="link-underline text-light/80 hover:text-light">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-light/15 pt-8 text-sm text-light/50 md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Highpeak Consultants Ltd</p>
          <p>Placeholder photography via Unsplash</p>
        </div>
      </Container>
    </footer>
  )
}
