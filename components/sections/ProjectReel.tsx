'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { categoryLabel } from '@/components/sections/ProjectCard'
import type { Project } from '@/lib/types'

const DURATION = 6500

const pad = (n: number) => String(n).padStart(2, '0')

// Full-screen reel of featured projects: name, place and year on the photo, a counter,
// and an index strip whose active item fills as the slide plays.
export function ProjectReel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const count = projects.length
  const paused = hovered || userPaused || reducedMotion || count < 2

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), DURATION)
    return () => window.clearTimeout(timer)
  }, [index, paused, count])

  if (count === 0) return null
  const current = projects[index]
  const go = (i: number) => setIndex((i + count) % count)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured projects"
      data-paused={paused}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-dark text-light"
      style={{ ['--reel-duration' as string]: `${DURATION}ms` }}
    >
      {projects.map((project, i) => (
        <div
          key={project.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          {project.heroImage && (
            <Image
              src={project.heroImage}
              alt={i === index ? (project.heroImageAlt ?? project.title) : ''}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : 'eager'}
              sizes="100vw"
              className={`object-cover transition-transform duration-[7000ms] ease-out ${i === index ? 'scale-100' : 'scale-[1.06]'}`}
            />
          )}
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />

      <Container className="relative pb-8 pt-36 md:pb-10">
        <div aria-live={paused ? 'polite' : 'off'}>
          <p className="eyebrow text-light/70">
            Selected work · {pad(index + 1)} / {pad(count)}
          </p>
          <h2 key={current.id} className="reel-title mt-5 max-w-5xl text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
            {current.title}
          </h2>
          <p className="mt-4 text-light/75">
            {current.location} · {current.year} · {categoryLabel(current.category)}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href={`/projects/${current.slug}`} variant="light">
            View project
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline-light">
            All projects
          </ButtonLink>
        </div>

        <div className="mt-12 flex items-end gap-2 md:gap-6">
          {/* On the left so it never sits under the chat button in the bottom-right corner. */}
          {count > 1 && !reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? 'Play the project reel' : 'Pause the project reel'}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-light/30 text-xs"
            >
              {userPaused ? '▶' : '❚❚'}
            </button>
          )}
          <ol
            className="hidden flex-1 gap-6 md:grid"
            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
          >
            {projects.map((project, i) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={`Show ${project.title}`}
                  className="group block w-full pb-1 text-left"
                >
                  <span className="relative block h-px bg-light/25">
                    {i === index &&
                      (paused ? (
                        <span className="absolute inset-0 bg-light" />
                      ) : (
                        <span key={index} className="reel-progress absolute inset-0 bg-light" />
                      ))}
                  </span>
                  <span
                    className={`mt-4 block truncate text-sm transition-colors ${
                      i === index ? 'text-light' : 'text-light/50 group-hover:text-light/80'
                    }`}
                  >
                    {project.title}
                  </span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-light/40">
                    {project.year} · {categoryLabel(project.category)}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex flex-1 items-center gap-2 md:hidden">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous project" className="flex h-11 w-11 items-center justify-center border border-light/30">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next project" className="flex h-11 w-11 items-center justify-center border border-light/30">
              →
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
