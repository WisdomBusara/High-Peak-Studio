import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Chatbot',
  },
  access: publicContent,
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
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
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher priority FAQs shown first',
      },
    },
  ],
}
