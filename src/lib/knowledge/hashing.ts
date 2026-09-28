import crypto from 'crypto'

// Generate SHA-256 hash of content for change detection
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

// Generate deterministic hash for deduplication
export function hashPayload(payload: unknown): string {
  const json = JSON.stringify(payload)
  return crypto.createHash('sha256').update(json).digest('hex')
}

// Compare hashes to detect changes
export function contentChanged(oldHash: string, newHash: string): boolean {
  return oldHash !== newHash
}
