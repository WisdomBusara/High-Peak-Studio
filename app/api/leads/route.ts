import { getPayload, ValidationError } from 'payload'
import config from '@/src/payload'

const LEAD_FIELDS = [
  'name',
  'email',
  'phone',
  'company',
  'projectType',
  'location',
  'budgetRange',
  'timeline',
  'message',
] as const

const LEAD_SOURCES = ['website', 'chatbot', 'contact-form', 'journal', 'project-page', 'referral', 'other']

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const data: Record<string, string> = {
    status: 'new',
    source: typeof body.source === 'string' && LEAD_SOURCES.includes(body.source) ? body.source : 'website',
  }
  for (const field of LEAD_FIELDS) {
    const value = body[field]
    if (typeof value === 'string' && value.trim()) {
      data[field] = value.trim()
    }
  }

  if (!data.name || !data.email || !data.message) {
    return Response.json({ error: 'Name, email and message are required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const lead = await payload.create({ collection: 'leads', data })
    return Response.json({ id: lead.id }, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    console.error('Error creating lead:', error)
    return Response.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
