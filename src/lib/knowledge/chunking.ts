// Semantic chunking - split content into 400-800 token chunks
// This is a simplified implementation. For production, use more sophisticated methods.

interface Chunk {
  section: string
  content: string
  tokenEstimate: number
}

const TOKENS_PER_WORD = 1.3 // Approximate conversion
const MIN_TOKENS = 400
const MAX_TOKENS = 800
const OVERLAP_TOKENS = 75

export function estimateTokens(text: string): number {
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount * TOKENS_PER_WORD)
}

export function chunkContent(normalizedContent: string): Chunk[] {
  const chunks: Chunk[] = []
  const sections = normalizedContent.split('\n\n').filter((s) => s.trim())

  let currentChunk = ''
  let currentTokens = 0
  let chunkSection = 'General'

  for (const section of sections) {
    const sectionTokens = estimateTokens(section)

    // If adding this section would exceed max tokens, save current chunk
    if (currentTokens + sectionTokens > MAX_TOKENS && currentChunk) {
      chunks.push({
        section: chunkSection,
        content: currentChunk.trim(),
        tokenEstimate: currentTokens,
      })

      // Start new chunk with overlap
      currentChunk = getOverlap(currentChunk, OVERLAP_TOKENS)
      currentTokens = estimateTokens(currentChunk)
      chunkSection = section.split(':')[0] || 'General'
    }

    currentChunk += (currentChunk ? '\n\n' : '') + section
    currentTokens = estimateTokens(currentChunk)

    // If we have a substantial chunk, save it
    if (currentTokens >= MIN_TOKENS && currentTokens < MAX_TOKENS) {
      chunks.push({
        section: chunkSection,
        content: currentChunk.trim(),
        tokenEstimate: currentTokens,
      })

      currentChunk = ''
      currentTokens = 0
    }
  }

  // Save any remaining content
  if (currentChunk.trim()) {
    chunks.push({
      section: chunkSection,
      content: currentChunk.trim(),
      tokenEstimate: currentTokens,
    })
  }

  return chunks
}

function getOverlap(text: string, overlapTokens: number): string {
  const overlapWords = Math.ceil(overlapTokens / TOKENS_PER_WORD)
  const words = text.split(/\s+/)
  return words.slice(-overlapWords).join(' ')
}

export function validateChunks(chunks: Chunk[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (chunks.length === 0) {
    errors.push('No chunks created')
    return { valid: false, errors }
  }

  chunks.forEach((chunk, idx) => {
    if (!chunk.content.trim()) {
      errors.push(`Chunk ${idx} has empty content`)
    }
    if (chunk.tokenEstimate < 50) {
      errors.push(`Chunk ${idx} is too small (${chunk.tokenEstimate} tokens)`)
    }
    if (chunk.tokenEstimate > 1000) {
      errors.push(`Chunk ${idx} is too large (${chunk.tokenEstimate} tokens)`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
