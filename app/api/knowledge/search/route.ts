import { getPayload } from 'payload'
import config from '@/src/payload'

interface SearchResult {
  content: string
  section: string
  source: {
    title: string
    url: string
    type: string
  }
  score: number
}

// Placeholder for vector search - will be replaced with pgvector queries once LLM/embeddings are integrated
async function performVectorSearch(
  _query: string,
  _limit: number = 5
): Promise<SearchResult[]> {
  // This will be implemented when embeddings are integrated
  // For now, return empty results
  return []
}

// Simple keyword-based search (fallback)
async function performKeywordSearch(query: string, limit: number = 5) {
  const payload = await getPayload({ config })

  // Get active knowledge versions
  const versions = await payload.find({
    collection: 'knowledge-versions',
    where: {
      status: {
        equals: 'active',
      },
    },
    limit: 1000,
  })

  const results: SearchResult[] = []
  const queryLower = query.toLowerCase()

  for (const version of versions.docs) {
    const content = (version.normalizedContent as string) || ''

    if (content.toLowerCase().includes(queryLower)) {
      const source = version.knowledgeSource as any
      results.push({
        content: content.substring(0, 500),
        section: 'General',
        source: {
          title: source.sourceTitle,
          url: source.sourceUrl,
          type: source.sourceType,
        },
        score: 0.5, // Placeholder score
      })
    }

    if (results.length >= limit) break
  }

  return results
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, limit = 5, useVector = false } = body

    if (!query) {
      return Response.json(
        { error: 'Query parameter required' },
        { status: 400 }
      )
    }

    let results: SearchResult[] = []

    if (useVector) {
      results = await performVectorSearch(query, limit)
    }

    // Fallback to keyword search if vector search disabled or returns no results
    if (results.length === 0) {
      results = await performKeywordSearch(query, limit)
    }

    return Response.json({
      query,
      results,
      total: results.length,
      method: useVector ? 'vector' : 'keyword',
    })
  } catch (error) {
    console.error('Knowledge search error:', error)
    return Response.json(
      { error: 'Failed to search knowledge base' },
      { status: 500 }
    )
  }
}
