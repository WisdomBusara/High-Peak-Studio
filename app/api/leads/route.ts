import { getPayload } from 'payload'
import config from '@/src/payload'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const payload = await getPayload({ config })

    const lead = await payload.create({
      collection: 'leads',
      data: {
        ...body,
        status: 'new',
        source: body.source || 'website',
      },
    })

    return Response.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return Response.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
