import { RichText } from '@payloadcms/richtext-lexical/react'
import type { RichTextValue } from '@/lib/types'

export function RichContent({ value, className = '' }: { value: RichTextValue; className?: string }) {
  if (typeof value === 'string') {
    return (
      <div className={`rich-text ${className}`}>
        {value.split(/\n{2,}/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    )
  }
  return <RichText data={value} className={`rich-text ${className}`} />
}
