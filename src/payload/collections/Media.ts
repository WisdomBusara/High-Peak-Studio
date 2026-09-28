import path from 'path'
import type { CollectionConfig } from 'payload'
import { publicMedia } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Management',
  },
  access: publicMedia,
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'square',
        width: 800,
        height: 800,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1200,
        height: 800,
        position: 'centre',
      },
    ],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'photographer',
      type: 'text',
    },
    {
      name: 'copyright',
      type: 'text',
    },
  ],
}
