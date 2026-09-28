'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <Container className="py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold">
            Highpeak
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/projects" className="text-sm hover:text-muted transition-colors">
              Projects
            </Link>
            <Link href="/services" className="text-sm hover:text-muted transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm hover:text-muted transition-colors">
              About
            </Link>
            <Link href="/journal" className="text-sm hover:text-muted transition-colors">
              Journal
            </Link>
            <Link href="/contact" className="text-sm hover:text-muted transition-colors">
              Contact
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              href="/projects"
              className="block text-sm hover:text-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/services"
              className="block text-sm hover:text-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/about"
              className="block text-sm hover:text-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/journal"
              className="block text-sm hover:text-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Journal
            </Link>
            <Link
              href="/contact"
              className="block text-sm hover:text-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </Container>
    </header>
  )
}
