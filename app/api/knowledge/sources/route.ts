import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const sources = await payload.find({
      collection: 'knowledge-sources',
      where: {
        published: { equals: true },
        chatbotVisible: { equals: true },
      },
      limit: 1000,
    })

    return Response.json(sources)
  } catch (error) {
    console.error('Error fetching knowledge sources:', error)
    return Response.json(
      { error: 'Failed to fetch knowledge sources' },
      { status: 500 }
    )
  }
}
