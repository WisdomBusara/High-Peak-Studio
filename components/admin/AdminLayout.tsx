import { ReactNode } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

interface AdminLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: {
    label: string
    href: string
  }
}

export function AdminLayout({
  title,
  subtitle,
  children,
  action,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-surface">
        <Container className="py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">{title}</h1>
              {subtitle && <p className="text-muted">{subtitle}</p>}
            </div>
            {action && (
              <Link
                href={action.href}
                className="px-4 py-2 bg-text text-background hover:bg-dark transition-colors"
              >
                {action.label}
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-12">
        {children}
      </Container>
    </div>
  )
}
