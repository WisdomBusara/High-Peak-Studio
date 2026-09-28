import { getPayload } from 'payload'
import config from '@/src/payload'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const payload = await getPayload({ config })

    const project = await payload.findByID({
      collection: 'projects',
      id,
    })

    if (!project.published) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return Response.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return Response.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
