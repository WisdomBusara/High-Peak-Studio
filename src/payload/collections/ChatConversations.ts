import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access'

export const ChatConversations: CollectionConfig = {
  slug: 'chat-conversations',
  admin: {
    useAsTitle: 'id',
    group: 'Chatbot',
    defaultColumns: ['id', 'intent', 'status', 'createdAt'],
  },
  access: staffOnly,
  fields: [
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'User', value: 'user' },
            { label: 'Assistant', value: 'assistant' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'intent',
          type: 'text',
        },
        {
          name: 'sources',
          type: 'array',
          fields: [
            {
              name: 'sourceId',
              type: 'text',
            },
            {
              name: 'sourceType',
              type: 'text',
            },
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Waiting for Human', value: 'escalated' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'intent',
      type: 'text',
      admin: {
        description: 'Primary intent classification',
      },
    },
    {
      name: 'leadAssociated',
      type: 'relationship',
      relationTo: 'leads',
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'ipAddress',
          type: 'text',
        },
        {
          name: 'sessionId',
          type: 'text',
        },
      ],
    },
  ],
}
