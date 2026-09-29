import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { SampleTag } from '@/components/ui/SampleTag'
import type { TeamMember } from '@/lib/types'

const TILE_TONES = ['bg-laterite-light text-laterite', 'bg-surface text-text', 'bg-laterite text-light', 'bg-dark text-light']

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Members without a portrait get a monogram tile rather than a stand-in photo of a stranger.
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member, i) => (
        <Reveal key={member.id} delay={(i % 4) * 100}>
          <div className="relative aspect-[4/5] overflow-hidden">
            {member.portrait ? (
              <Image
                src={member.portrait.src}
                alt={member.portrait.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className={`flex h-full items-center justify-center font-serif text-8xl ${TILE_TONES[i % TILE_TONES.length]}`}>
                {initials(member.name)}
              </div>
            )}
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-3 font-serif text-3xl">
            {member.name}
            {member.sample && <SampleTag />}
          </p>
          <p className="eyebrow mt-2 text-laterite">{member.role}</p>
          {member.bio && <p className="mt-3 text-muted">{member.bio}</p>}
        </Reveal>
      ))}
    </div>
  )
}
