import Link from 'next/link'
import { ReactNode } from 'react'

type Variant = 'primary' | 'light' | 'outline' | 'outline-light'

const base =
  'group inline-flex min-h-12 items-center justify-center gap-3 px-7 text-sm font-medium tracking-wide transition-colors duration-300 disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-dark text-light hover:bg-text/80',
  light: 'bg-light text-dark hover:bg-surface',
  outline: 'border border-text/30 text-text hover:border-dark hover:bg-dark hover:text-light',
  'outline-light': 'border border-light/40 text-light hover:border-light hover:bg-light hover:text-dark',
}

function Arrow() {
  return (
    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  )
}

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, variant = 'primary', className = '', disabled = false, onClick, type = 'button' }: ButtonProps) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <Arrow />
    </Link>
  )
}
