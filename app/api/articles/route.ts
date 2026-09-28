import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'articles',
      where: {
        published: {
          equals: true,
        },
      },
      limit,
      page,
      sort: '-publishedAt',
    })

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return Response.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
