export const PROJECT_CATEGORIES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'institutional', label: 'Institutional' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' },
] as const

export const PROJECT_STATUSES = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'planning', label: 'Planning' },
] as const

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'spam', label: 'Spam' },
] as const

export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'contact-form', label: 'Contact Form' },
  { value: 'journal', label: 'Journal' },
  { value: 'project-page', label: 'Project Page' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
] as const

export const CHATBOT_INTENTS = [
  'service_question',
  'project_search',
  'project_detail',
  'material_question',
  'timeline_question',
  'budget_question',
  'contact_request',
  'quote_request',
  'project_enquiry',
  'company_question',
  'journal_question',
  'general_architecture_question',
  'human_handoff',
  'unknown',
] as const

export const KNOWLEDGE_STATUSES = [
  'received',
  'validating',
  'fetching',
  'normalizing',
  'chunking',
  'embedding',
  'validating_index',
  'ready',
  'active',
  'retired',
  'outdated',
  'incompatible',
  'invalid',
  'failed',
  'blocked',
] as const

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://highpeak.co.ke'
export const SITE_DESCRIPTION = 'Contemporary architecture and consultancy practice'

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROJECT: (slug: string) => `/projects/${slug}`,
  SERVICES: '/services',
  SERVICE: (slug: string) => `/services/${slug}`,
  ABOUT: '/about',
  JOURNAL: '/journal',
  ARTICLE: (slug: string) => `/journal/${slug}`,
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_JOURNAL: '/admin/journal',
  ADMIN_LEADS: '/admin/leads',
  ADMIN_CHATBOT: '/admin/chatbot',
} as const
