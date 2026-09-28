import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access'

export const ChatRequests: CollectionConfig = {
  slug: 'chat-requests',
  admin: {
    useAsTitle: 'requestType',
    group: 'Chatbot',
    defaultColumns: ['requestType', 'status', 'createdAt'],
  },
  access: staffOnly,
  fields: [
    {
      name: 'requestType',
      type: 'select',
      required: true,
      options: [
        { label: 'Quote', value: 'quote' },
        { label: 'Callback', value: 'callback' },
        { label: 'Site Visit', value: 'site-visit' },
        { label: 'General Enquiry', value: 'general-enquiry' },
        { label: 'Human Handoff', value: 'human-handoff' },
        { label: 'Project Consultation', value: 'project-consultation' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Acknowledged', value: 'acknowledged' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'chat-conversations',
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
