import { CollectionConfig } from 'payload'

export const KnowledgeVersions: CollectionConfig = {
  slug: 'knowledge-versions',
  admin: {
    useAsTitle: 'versionNumber',
    group: 'Knowledge',
    defaultColumns: ['versionNumber', 'status', 'chunkCount', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'knowledgeSource',
      type: 'relationship',
      relationTo: 'knowledge-sources',
      required: true,
    },
    {
      name: 'versionNumber',
      type: 'number',
      required: true,
    },
    {
      name: 'contentHash',
      type: 'text',
      required: true,
      admin: {
        description: 'SHA-256 hash of normalized content',
      },
    },
    {
      name: 'normalizedContent',
      type: 'richText',
      required: true,
      admin: {
        description: 'Structured, normalized content for embedding',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'received',
      options: [
        { label: 'Received', value: 'received' },
        { label: 'Validating', value: 'validating' },
        { label: 'Fetching', value: 'fetching' },
        { label: 'Normalizing', value: 'normalizing' },
        { label: 'Chunking', value: 'chunking' },
        { label: 'Embedding', value: 'embedding' },
        { label: 'Validating Index', value: 'validating_index' },
        { label: 'Ready', value: 'ready' },
        { label: 'Active', value: 'active' },
        { label: 'Retired', value: 'retired' },
        { label: 'Outdated', value: 'outdated' },
        { label: 'Incompatible', value: 'incompatible' },
        { label: 'Invalid', value: 'invalid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'activatedAt',
      type: 'date',
    },
    {
      name: 'retiredAt',
      type: 'date',
    },
    {
      name: 'embeddingModel',
      type: 'text',
      defaultValue: 'text-embedding-3-small',
      admin: {
        description: 'OpenAI embedding model used',
      },
    },
    {
      name: 'chunkCount',
      type: 'number',
      admin: {
        description: 'Number of semantic chunks created',
      },
    },
    {
      name: 'knowledgeSchemaVersion',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Schema version for compatibility checks',
      },
    },
    {
      name: 'validationChecks',
      type: 'group',
      fields: [
        {
          name: 'sourceExists',
          type: 'checkbox',
        },
        {
          name: 'sourcePublished',
          type: 'checkbox',
        },
        {
          name: 'chatbotVisible',
          type: 'checkbox',
        },
        {
          name: 'contentHashValid',
          type: 'checkbox',
        },
        {
          name: 'chunksComplete',
          type: 'checkbox',
        },
        {
          name: 'embeddingsValid',
          type: 'checkbox',
        },
        {
          name: 'schemaCompatible',
          type: 'checkbox',
        },
        {
          name: 'modelCompatible',
          type: 'checkbox',
        },
        {
          name: 'metadataValid',
          type: 'checkbox',
        },
        {
          name: 'retrievalWorks',
          type: 'checkbox',
        },
      ],
    },
  ],
}
