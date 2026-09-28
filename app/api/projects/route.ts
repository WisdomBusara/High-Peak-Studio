import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
  const category = searchParams.get('category')

  try {
    const payload = await getPayload({ config })

    const where: any = {
      published: {
        equals: true,
      },
    }

    if (category) {
      where.category = {
        equals: category,
      }
    }

    const result = await payload.find({
      collection: 'projects',
      where,
      limit,
      page,
      sort: '-createdAt',
    })

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
