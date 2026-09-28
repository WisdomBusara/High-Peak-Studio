// Normalize CMS content into structured knowledge format

interface NormalizedContent {
  text: string
  metadata: Record<string, unknown>
}

export function normalizeProjectContent(project: any): NormalizedContent {
  const lines = [
    `PROJECT: ${project.title}`,
    `CATEGORY: ${project.category}`,
    `LOCATION: ${project.location}`,
    `YEAR: ${project.year}`,
    `STATUS: ${project.status}`,
    `DESCRIPTION: ${stripHtml(project.description)}`,
  ]

  if (project.materials && project.materials.length > 0) {
    lines.push(`MATERIALS: ${project.materials.map((m: any) => m.name).join(', ')}`)
  }

  lines.push(`SOURCE: ${project.sourceUrl || `/projects/${project.slug}`}`)

  return {
    text: lines.join('\n\n'),
    metadata: {
      sourceType: 'project',
      sourceId: project.id,
      sourceTitle: project.title,
      sourceUrl: project.sourceUrl || `/projects/${project.slug}`,
      updatedAt: project.updatedAt,
      publishedAt: project.publishedAt,
    },
  }
}

export function normalizeServiceContent(service: any): NormalizedContent {
  const lines = [
    `SERVICE: ${service.name}`,
    `DESCRIPTION: ${stripHtml(service.description)}`,
  ]

  if (service.capabilities && service.capabilities.length > 0) {
    lines.push(`CAPABILITIES: ${service.capabilities.map((c: any) => c.capability).join(', ')}`)
  }

  if (service.process) {
    lines.push(`PROCESS: ${stripHtml(service.process)}`)
  }

  lines.push(`SOURCE: ${service.sourceUrl || `/services/${service.slug}`}`)

  return {
    text: lines.join('\n\n'),
    metadata: {
      sourceType: 'service',
      sourceId: service.id,
      sourceTitle: service.name,
      sourceUrl: service.sourceUrl || `/services/${service.slug}`,
      updatedAt: service.updatedAt,
      publishedAt: service.publishedAt,
    },
  }
}

export function normalizeArticleContent(article: any): NormalizedContent {
  const lines = [
    `ARTICLE: ${article.title}`,
    `AUTHOR: ${article.author}`,
    `CATEGORY: ${article.category}`,
    `PUBLISHED: ${article.publishedAt}`,
    `EXCERPT: ${article.excerpt}`,
    `CONTENT: ${stripHtml(article.body)}`,
  ]

  if (article.tags && article.tags.length > 0) {
    lines.push(`TAGS: ${article.tags.map((t: any) => t.tag).join(', ')}`)
  }

  lines.push(`SOURCE: ${article.sourceUrl || `/journal/${article.slug}`}`)

  return {
    text: lines.join('\n\n'),
    metadata: {
      sourceType: 'article',
      sourceId: article.id,
      sourceTitle: article.title,
      sourceUrl: article.sourceUrl || `/journal/${article.slug}`,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt,
    },
  }
}

export function normalizeFaqContent(faq: any): NormalizedContent {
  const lines = [
    `FAQ: ${faq.question}`,
    `ANSWER: ${stripHtml(faq.answer)}`,
    `CATEGORY: ${faq.category}`,
  ]

  lines.push(`SOURCE: FAQ`)

  return {
    text: lines.join('\n\n'),
    metadata: {
      sourceType: 'faq',
      sourceId: faq.id,
      sourceTitle: faq.question,
      sourceUrl: 'FAQ',
      updatedAt: faq.updatedAt,
    },
  }
}

// Strip HTML tags from content
function stripHtml(html: string | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}
