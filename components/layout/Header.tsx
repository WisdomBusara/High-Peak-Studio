'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

// Every page opens on a dark hero, so the header starts transparent with light
// text and turns solid once the visitor scrolls past the top.
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled && !open
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'border-b border-border bg-background/95 text-text backdrop-blur' : 'text-light'
      }`}
    >
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8 md:py-6 lg:px-12">
        <Link href="/" className="font-serif text-2xl tracking-tight md:text-3xl">
          Highpeak
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className="link-underline text-sm tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="fixed inset-0 flex flex-col justify-end bg-dark px-5 pb-16 text-light md:hidden">
          <ul className="space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block py-1 font-serif text-5xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href="mailto:hello@highpeak.co.ke" className="mt-12 text-sm text-light/70">
            hello@highpeak.co.ke
          </a>
        </nav>
      )}
    </header>
  )
}
