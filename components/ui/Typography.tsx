import { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
}

export function H1({ children, className = '' }: TypographyProps) {
  return <h1 className={`font-serif text-5xl md:text-6xl font-bold ${className}`}>{children}</h1>
}

export function H2({ children, className = '' }: TypographyProps) {
  return <h2 className={`font-serif text-4xl font-bold ${className}`}>{children}</h2>
}

export function H3({ children, className = '' }: TypographyProps) {
  return <h3 className={`font-serif text-3xl font-bold ${className}`}>{children}</h3>
}

export function H4({ children, className = '' }: TypographyProps) {
  return <h4 className={`font-serif text-2xl font-bold ${className}`}>{children}</h4>
}

export function Body({ children, className = '' }: TypographyProps) {
  return <p className={`text-base leading-relaxed ${className}`}>{children}</p>
}

export function Caption({ children, className = '' }: TypographyProps) {
  return <p className={`text-sm text-muted ${className}`}>{children}</p>
}

export function Overline({ children, className = '' }: TypographyProps) {
  return <p className={`text-xs font-bold uppercase tracking-widest text-muted ${className}`}>{children}</p>
}
