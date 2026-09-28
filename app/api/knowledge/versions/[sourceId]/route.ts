import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params

  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all versions for this source
    const versions = await payload.find({
      collection: 'knowledge-versions',
      where: {
        knowledgeSource: {
          equals: sourceId,
        },
      },
      sort: '-versionNumber',
      limit: 100,
    })

    return Response.json({
      sourceId,
      versions: versions.docs,
      total: versions.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching knowledge versions:', error)
    return Response.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    )
  }
}
