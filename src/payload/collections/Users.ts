import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        position: 'side',
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Analyst', value: 'analyst' },
        { label: 'Sales', value: 'sales' },
      ],
    },
  ],
}
