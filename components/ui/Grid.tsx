import { ReactNode } from 'react'

interface GridProps {
  children: ReactNode
  columns?: 'desktop' | 'tablet' | 'mobile'
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({
  children,
  columns = 'desktop',
  gap = 'md',
  className = '',
}: GridProps) {
  const columnClasses = {
    desktop: 'grid-cols-1 md:grid-cols-12',
    tablet: 'grid-cols-1 md:grid-cols-8',
    mobile: 'grid-cols-1 md:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-4 md:gap-6',
    md: 'gap-6 md:gap-8',
    lg: 'gap-8 md:gap-12',
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}
