import { CollectionConfig } from 'payload'

export const KnowledgeChunks: CollectionConfig = {
  slug: 'knowledge-chunks',
  admin: {
    useAsTitle: 'chunkIndex',
    group: 'Knowledge',
    hidden: true, // Usually queried via API, not directly
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'knowledgeVersion',
      type: 'relationship',
      relationTo: 'knowledge-versions',
      required: true,
      index: true,
    },
    {
      name: 'chunkIndex',
      type: 'number',
      required: true,
    },
    {
      name: 'section',
      type: 'text',
      admin: {
        description: 'Semantic section (e.g., "Overview", "Materials")',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: '400-800 tokens of content',
      },
    },
    {
      name: 'embedding',
      type: 'json',
      admin: {
        description: 'Vector embedding (1536 dimensions for text-embedding-3-small)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Chunk metadata: source, section, token count, etc',
      },
    },
  ],
}
