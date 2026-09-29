import type { ComponentProps } from 'react'
import type { RichText } from '@payloadcms/richtext-lexical/react'

// Plain text for placeholder content, Lexical JSON for content published in the CMS.
export type RichTextValue = string | ComponentProps<typeof RichText>['data']

export interface Picture {
  src: string
  alt: string
}

export interface Project {
  id: string
  title: string
  slug: string
  category: 'residential' | 'commercial' | 'institutional' | 'hospitality' | 'other'
  location: string
  year: number
  status: 'completed' | 'in-progress' | 'planning'
  heroImage?: string
  heroImageAlt?: string
  gallery?: Picture[]
  description: RichTextValue
  chatbotVisible: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  slug: string
  description: RichTextValue
  capabilities?: string[]
  heroImage?: string
  heroImageAlt?: string
  chatbotVisible: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  body: RichTextValue
  coverImage?: string
  coverImageAlt?: string
  author: string
  category: string
  publishedAt: Date
  chatbotVisible: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  projectType?: string
  location?: string
  budgetRange?: string
  timeline?: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'spam'
  source: 'website' | 'chatbot' | 'contact-form' | 'journal' | 'project-page' | 'referral' | 'other'
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  intent?: string
  sources?: string[]
  createdAt: Date
}

export interface KnowledgeSource {
  id: string
  sourceType: 'project' | 'service' | 'article' | 'faq'
  sourceId: string
  sourceTitle: string
  sourceUrl: string
  published: boolean
  chatbotVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeVersion {
  id: string
  knowledgeSourceId: string
  versionNumber: number
  contentHash: string
  normalizedContent: string
  status: 'received' | 'validating' | 'fetching' | 'normalizing' | 'chunking' | 'embedding' | 'validating_index' | 'ready' | 'active' | 'retired' | 'outdated' | 'incompatible' | 'invalid' | 'failed' | 'blocked'
  createdBy?: string
  createdAt: Date
  activatedAt?: Date
  retiredAt?: Date
  embeddingModel?: string
  chunkCount?: number
  knowledgeSchemaVersion: number
}
