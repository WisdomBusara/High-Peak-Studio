'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface HoverPreviewProps {
  images: (string | undefined)[]
  active: number | null
  width?: number
}

// A photo that follows the pointer while a row is hovered. Pointer devices only;
// every image is mounted up front so switching rows never flashes.
export function HoverPreview({ images, active, width = 340 }: HoverPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const offsetY = (width * 3) / 8
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      el.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - offsetY}px, 0)`
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [width])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-40 hidden transition-opacity duration-300 [@media(hover:hover)]:md:block ${
        active === null ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ width }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface shadow-2xl">
        {images.map((src, i) =>
          src ? (
            <Image
              key={`${src}-${i}`}
              src={src}
              alt=""
              fill
              sizes={`${width}px`}
              className={`object-cover transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : null,
        )}
      </div>
    </div>
  )
}
