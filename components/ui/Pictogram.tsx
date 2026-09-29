import type { ReactNode } from 'react'
import type { Project } from '@/lib/types'

// Line drawings used as the site's signature marks. Sample projects each have their
// own; projects added in the CMS fall back to the drawing for their sector.
export type PictogramKind = 'terraces' | 'towers' | 'sculpture' | 'dome' | 'masterplan' | 'mixed'

const DRAWINGS: Record<PictogramKind, ReactNode> = {
  terraces: (
    <>
      <path d="M6 102H114" />
      <rect x="45" y="20" width="30" height="10" />
      <rect x="37" y="30" width="46" height="12" />
      <rect x="29" y="42" width="62" height="12" />
      <rect x="21" y="54" width="78" height="12" />
      <rect x="13" y="66" width="94" height="12" />
      <path d="M41 36h38M33 48h54M25 60h70M17 72h86" />
      <path d="M24 78v24M96 78v24M52 102V88h16v14" />
    </>
  ),
  towers: (
    <>
      <path d="M6 102H114" />
      <rect x="20" y="14" width="32" height="88" />
      <rect x="60" y="34" width="38" height="68" />
      <path d="M20 28h32M20 42h32M20 56h32M20 70h32M20 84h32" />
      <path d="M60 48h38M60 62h38M60 76h38M60 90h38" />
      <path d="M36 14v88M79 34v68" />
    </>
  ),
  sculpture: (
    <>
      <path d="M6 102H114" />
      <path d="M16 102 34 56h68v46" />
      <path d="M56 102V14h9v88" />
      <path d="M56 56c-11 1-17 11-19 24" />
      <path d="M78 70h14v12H78z" />
    </>
  ),
  dome: (
    <>
      <path d="M6 102H114" />
      <path d="M12 102V76h50v26" />
      <path d="M12 76h50" />
      <path d="M22 76c-5-4-5-13 1-16h6c6 3 6 12 1 16" />
      <rect x="70" y="44" width="30" height="58" />
      <path d="M70 44c0-13 7-21 15-21s15 8 15 21" />
      <path d="M80 102V84a5 5 0 0 1 10 0v18" />
      <path d="M81 54h8v9h-8z" />
      <path d="M40 90h12v12" />
    </>
  ),
  masterplan: (
    <>
      <rect x="10" y="10" width="100" height="100" />
      <path d="M10 58h100M58 10v100" />
      <path d="M18 18h16v12H18zM40 18h12v12H40zM18 36h34v14H18z" />
      <path d="M66 18h36v10H66zM66 34h15v16H66zM87 34h15v16H87z" />
      <path d="M18 66h14v36H18zM38 66h14v14H38z" />
      <circle cx="45" cy="93" r="6" />
      <path d="M64 104c9-15 21-20 40-22M64 92c10-10 22-15 40-15M64 80c10-6 22-9 40-9" />
    </>
  ),
  mixed: (
    <>
      <path d="M6 102H114" />
      <path d="M14 102V52h42V28h50v74" />
      <path d="M64 28v74M72 28v74M80 28v74M88 28v74M96 28v74" />
      <path d="M14 64h42M14 76h42M14 88h42" />
      <path d="M26 102v-9h18v9" />
    </>
  ),
}

const BY_SLUG: Record<string, PictogramKind> = {
  'highpeak-residence': 'terraces',
  'tech-hub-office-complex': 'towers',
  'cultural-center': 'sculpture',
  'boutique-hotel': 'dome',
  'residential-estate-master-plan': 'masterplan',
  'mixed-use-development': 'mixed',
}

const BY_CATEGORY: Record<Project['category'], PictogramKind> = {
  residential: 'terraces',
  commercial: 'towers',
  institutional: 'sculpture',
  hospitality: 'dome',
  other: 'masterplan',
}

export function pictogramFor(project: Pick<Project, 'slug' | 'category'>): PictogramKind {
  return BY_SLUG[project.slug] ?? BY_CATEGORY[project.category] ?? 'masterplan'
}

export function pictogramForCategory(category: Project['category']): PictogramKind {
  return BY_CATEGORY[category] ?? 'masterplan'
}

interface PictogramProps {
  kind: PictogramKind
  className?: string
  title?: string
}

export function Pictogram({ kind, className = '', title }: PictogramProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pictogram ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {DRAWINGS[kind]}
    </svg>
  )
}
