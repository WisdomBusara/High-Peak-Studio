import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'services',
      where: {
        published: {
          equals: true,
        },
      },
      limit: 100,
      sort: 'name',
    })

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching services:', error)
    return Response.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
