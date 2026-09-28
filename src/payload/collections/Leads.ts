import { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'Business',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'projectType',
      type: 'select',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Institutional', value: 'institutional' },
        { label: 'Hospitality', value: 'hospitality' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'budgetRange',
      type: 'text',
    },
    {
      name: 'timeline',
      type: 'text',
    },
    {
      name: 'message',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Proposal', value: 'proposal' },
        { label: 'Negotiation', value: 'negotiation' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Chatbot', value: 'chatbot' },
        { label: 'Contact Form', value: 'contact-form' },
        { label: 'Journal', value: 'journal' },
        { label: 'Project Page', value: 'project-page' },
        { label: 'Referral', value: 'referral' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
    },
  ],
}
