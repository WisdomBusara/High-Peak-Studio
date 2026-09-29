import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@/src/payload'
import { mockArticles, mockPress, mockProjects, mockServices, mockTeam } from '@/lib/mockData'
import type { Article, Picture, PressItem, Project, Service, TeamMember } from '@/lib/types'

// Published CMS content always wins. The placeholder content is only shown for a
// collection that has nothing published yet, so the site never looks empty.

type Doc = Record<string, unknown>

async function findPublished(collection: string, sort: string): Promise<Doc[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection,
      where: { published: { equals: true } },
      sort,
      limit: 200,
      depth: 1,
    })
    return result.docs as Doc[]
  } catch (error) {
    console.error(`[content] could not load ${collection} from the CMS, showing placeholder content`, error)
    return []
  }
}

function picture(value: unknown, fallbackAlt: string): Picture | undefined {
  if (!value || typeof value !== 'object') return undefined
  const media = value as { url?: unknown; alt?: unknown }
  if (typeof media.url !== 'string') return undefined
  return { src: media.url, alt: typeof media.alt === 'string' && media.alt ? media.alt : fallbackAlt }
}

function toProject(doc: Doc): Project {
  const title = String(doc.title)
  const hero = picture(doc.heroImage, title)
  const gallery = Array.isArray(doc.gallery)
    ? doc.gallery
        .map((item) => picture((item as Doc).image, typeof (item as Doc).caption === 'string' ? String((item as Doc).caption) : title))
        .filter((p): p is Picture => Boolean(p))
    : []
  return {
    id: String(doc.id),
    title,
    slug: String(doc.slug),
    category: doc.category as Project['category'],
    location: String(doc.location ?? ''),
    year: Number(doc.year),
    status: doc.status as Project['status'],
    heroImage: hero?.src,
    heroImageAlt: hero?.alt,
    gallery,
    drawing: picture(doc.drawing, `Drawing of ${title}`),
    featured: doc.featured === true,
    description: doc.description as Project['description'],
    chatbotVisible: doc.chatbotVisible !== false,
    published: true,
    createdAt: new Date(String(doc.createdAt)),
    updatedAt: new Date(String(doc.updatedAt)),
  }
}

function toService(doc: Doc): Service {
  const name = String(doc.name)
  const hero = picture(doc.heroImage, name)
  const capabilities = Array.isArray(doc.capabilities)
    ? doc.capabilities.map((c) => String((c as Doc).capability ?? '')).filter(Boolean)
    : []
  return {
    id: String(doc.id),
    name,
    slug: String(doc.slug),
    description: doc.description as Service['description'],
    capabilities,
    heroImage: hero?.src,
    heroImageAlt: hero?.alt,
    chatbotVisible: doc.chatbotVisible !== false,
    published: true,
    createdAt: new Date(String(doc.createdAt)),
    updatedAt: new Date(String(doc.updatedAt)),
  }
}

function toArticle(doc: Doc): Article {
  const title = String(doc.title)
  const cover = picture(doc.coverImage, title)
  return {
    id: String(doc.id),
    title,
    slug: String(doc.slug),
    excerpt: String(doc.excerpt ?? ''),
    body: doc.body as Article['body'],
    coverImage: cover?.src,
    coverImageAlt: cover?.alt,
    author: String(doc.author ?? ''),
    category: String(doc.category ?? ''),
    publishedAt: new Date(String(doc.publishedAt)),
    chatbotVisible: doc.chatbotVisible !== false,
    published: true,
    createdAt: new Date(String(doc.createdAt)),
    updatedAt: new Date(String(doc.updatedAt)),
  }
}

function toTeamMember(doc: Doc): TeamMember {
  const name = String(doc.name)
  return {
    id: String(doc.id),
    name,
    role: String(doc.role ?? ''),
    bio: typeof doc.bio === 'string' ? doc.bio : undefined,
    portrait: picture(doc.portrait, name),
  }
}

function toPressItem(doc: Doc): PressItem {
  const link = typeof doc.link === 'string' && /^https?:\/\//.test(doc.link) ? doc.link : undefined
  return {
    id: String(doc.id),
    kind: doc.kind === 'award' ? 'award' : 'press',
    title: String(doc.title),
    source: String(doc.source ?? ''),
    date: new Date(String(doc.date)),
    link,
    showInTicker: doc.showInTicker !== false,
  }
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const docs = await findPublished('projects', '-year')
  return docs.length ? docs.map(toProject) : mockProjects
})

// Projects switched to "Show on home page"; the most recent five if none are.
export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = (await getProjects()).filter((p) => p.heroImage)
  const featured = projects.filter((p) => p.featured)
  return (featured.length ? featured : projects).slice(0, 6)
})

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const docs = await findPublished('team-members', 'order')
  return docs.length ? docs.map(toTeamMember) : mockTeam
})

export const getPress = cache(async (): Promise<PressItem[]> => {
  const docs = await findPublished('press-items', '-date')
  return docs.length ? docs.map(toPressItem) : mockPress
})

export const getServices = cache(async (): Promise<Service[]> => {
  const docs = await findPublished('services', 'createdAt')
  return docs.length ? docs.map(toService) : mockServices
})

export const getArticles = cache(async (): Promise<Article[]> => {
  const docs = await findPublished('articles', '-publishedAt')
  return docs.length ? docs.map(toArticle) : mockArticles
})
