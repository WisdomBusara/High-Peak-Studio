import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'

export const PressItems: CollectionConfig = {
  slug: 'press-items',
  labels: { singular: 'Press or award', plural: 'Press & awards' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'kind', 'source', 'date', 'published'],
  },
  access: publicContent,
  defaultSort: '-date',
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'press',
      options: [
        { label: 'Press', value: 'press' },
        { label: 'Award', value: 'award' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline, or the award result and category',
      },
    },
    {
      name: 'source',
      type: 'text',
      required: true,
      admin: {
        description: 'Publication or awarding body',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      validate: (value: unknown) =>
        !value || (typeof value === 'string' && /^https?:\/\//.test(value)) || 'Use a full link starting with https://',
    },
    {
      name: 'showInTicker',
      type: 'checkbox',
      label: 'Show in the home page ticker',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
