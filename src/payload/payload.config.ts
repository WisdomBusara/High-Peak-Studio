import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { Users } from './collections/Users'
import { ChatConversations } from './collections/ChatConversations'
import { ChatRequests } from './collections/ChatRequests'
import { FAQs } from './collections/FAQs'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Projects,
    Services,
    Articles,
    Media,
    Leads,
    ChatConversations,
    ChatRequests,
    FAQs,
  ],
  db: postgresAdapter({
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/highpeak',
  }),
  typescript: {
    outputFile: 'src/payload/generated-types.ts',
  },
})
