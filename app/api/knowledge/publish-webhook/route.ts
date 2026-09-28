// Webhook endpoint for CMS publishing events
// When content is published, this triggers knowledge indexing

import { getPayload } from 'payload'
import config from '@/src/payload'
import {
  normalizeProjectContent,
  normalizeServiceContent,
  normalizeArticleContent,
  normalizeFaqContent,
} from '@/src/lib/knowledge/normalization'
import { hashContent } from '@/src/lib/knowledge/hashing'
import { chunkContent } from '@/src/lib/knowledge/chunking'

interface WebhookPayload {
  event_id: string
  event_type: string
  document_id: string
  version: number
  timestamp: string
}

// Map event types to collection and type
const eventTypeMap: Record<
  string,
  { collection: string; sourceType: string }
> = {
  'project.published': { collection: 'projects', sourceType: 'project' },
  'service.published': { collection: 'services', sourceType: 'service' },
  'article.published': { collection: 'articles', sourceType: 'article' },
  'faq.published': { collection: 'faqs', sourceType: 'faq' },
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WebhookPayload
    const { event_id, event_type, document_id } = body

    // Verify event type is recognized
    const mapping = eventTypeMap[event_type]
    if (!mapping) {
      return Response.json(
        { error: 'Unknown event type' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Fetch the published document
    const doc = await payload.findByID({
      collection: mapping.collection,
      id: document_id,
    })

    if (!doc.published) {
      return Response.json(
        { error: 'Document is not published' },
        { status: 400 }
      )
    }

    // Normalize content based on type
    let normalized
    switch (mapping.sourceType) {
      case 'project':
        normalized = normalizeProjectContent(doc)
        break
      case 'service':
        normalized = normalizeServiceContent(doc)
        break
      case 'article':
        normalized = normalizeArticleContent(doc)
        break
      case 'faq':
        normalized = normalizeFaqContent(doc)
        break
      default:
        throw new Error(`Unknown source type: ${mapping.sourceType}`)
    }

    // Check if content has changed
    const contentHash = hashContent(normalized.text)

    // Create or update knowledge source
    let knowledgeSource = await payload.find({
      collection: 'knowledge-sources',
      where: {
        sourceId: { equals: document_id },
      },
    })

    if (knowledgeSource.docs.length === 0) {
      knowledgeSource = await payload.create({
        collection: 'knowledge-sources',
        data: {
          sourceType: mapping.sourceType,
          sourceId: document_id,
          sourceTitle: doc.title || doc.name,
          sourceUrl: normalized.metadata.sourceUrl,
          published: true,
          chatbotVisible: doc.chatbotVisible !== false,
        },
      })
    }

    const source = knowledgeSource.docs[0] || knowledgeSource

    // Create new knowledge version
    const chunks = chunkContent(normalized.text)

    const newVersion = await payload.create({
      collection: 'knowledge-versions',
      data: {
        knowledgeSource: source.id,
        versionNumber: (source.versionNumber || 0) + 1,
        contentHash,
        normalizedContent: normalized.text,
        status: 'ready', // Ready for activation
        chunkCount: chunks.length,
        knowledgeSchemaVersion: 1,
      },
    })

    // Store chunks
    for (let i = 0; i < chunks.length; i++) {
      await payload.create({
        collection: 'knowledge-chunks',
        data: {
          knowledgeVersion: newVersion.id,
          chunkIndex: i,
          section: chunks[i].section,
          content: chunks[i].content,
          metadata: {
            tokenEstimate: chunks[i].tokenEstimate,
            chunkIndex: i,
            totalChunks: chunks.length,
          },
        },
      })
    }

    // Log event
    await payload.create({
      collection: 'knowledge-events',
      data: {
        eventType: 'knowledge_published',
        sourceId: document_id,
        versionId: newVersion.id,
        status: 'complete',
        details: {
          chunkCount: chunks.length,
          contentHash,
        },
      },
    })

    return Response.json({
      success: true,
      message: 'Knowledge indexed successfully',
      versionId: newVersion.id,
      chunkCount: chunks.length,
    })
  } catch (error) {
    console.error('Knowledge webhook error:', error)
    return Response.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
