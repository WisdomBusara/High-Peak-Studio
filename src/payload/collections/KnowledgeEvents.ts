import { CollectionConfig } from 'payload'

export const KnowledgeEvents: CollectionConfig = {
  slug: 'knowledge-events',
  admin: {
    useAsTitle: 'eventType',
    group: 'Knowledge',
    defaultColumns: ['eventType', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Knowledge Published', value: 'knowledge_published' },
        { label: 'Knowledge Updated', value: 'knowledge_updated' },
        { label: 'Knowledge Unpublished', value: 'knowledge_unpublished' },
        { label: 'Indexing Started', value: 'indexing_started' },
        { label: 'Indexing Complete', value: 'indexing_complete' },
        { label: 'Activation Triggered', value: 'activation_triggered' },
        { label: 'Rollback Triggered', value: 'rollback_triggered' },
        { label: 'Validation Failed', value: 'validation_failed' },
      ],
    },
    {
      name: 'sourceId',
      type: 'text',
      required: true,
    },
    {
      name: 'versionId',
      type: 'text',
    },
    {
      name: 'payloadHash',
      type: 'text',
      admin: {
        description: 'Hash of the event payload for deduplication',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Complete', value: 'complete' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'error',
      type: 'textarea',
    },
    {
      name: 'processedAt',
      type: 'date',
    },
    {
      name: 'details',
      type: 'json',
      admin: {
        description: 'Event-specific details',
      },
    },
  ],
}
