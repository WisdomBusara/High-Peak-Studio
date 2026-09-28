import { CollectionConfig } from 'payload'

export const KnowledgeSources: CollectionConfig = {
  slug: 'knowledge-sources',
  admin: {
    useAsTitle: 'sourceTitle',
    group: 'Knowledge',
    defaultColumns: ['sourceTitle', 'sourceType', 'published', 'chatbotVisible', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Project', value: 'project' },
        { label: 'Service', value: 'service' },
        { label: 'Article', value: 'article' },
        { label: 'FAQ', value: 'faq' },
      ],
    },
    {
      name: 'sourceId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the linked project, service, article, or FAQ',
      },
    },
    {
      name: 'sourceTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'chatbotVisible',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'activeVersionId',
      type: 'relationship',
      relationTo: 'knowledge-versions',
      admin: {
        description: 'Currently active knowledge version',
      },
    },
  ],
}
