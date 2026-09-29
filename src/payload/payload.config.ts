import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { migrations } from '../migrations'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { Users } from './collections/Users'
import { ChatConversations } from './collections/ChatConversations'
import { ChatRequests } from './collections/ChatRequests'
import { FAQs } from './collections/FAQs'
import { KnowledgeSources } from './collections/KnowledgeSources'
import { KnowledgeVersions } from './collections/KnowledgeVersions'
import { KnowledgeChunks } from './collections/KnowledgeChunks'
import { KnowledgeEvents } from './collections/KnowledgeEvents'
import { TeamMembers } from './collections/TeamMembers'
import { PressItems } from './collections/PressItems'

const siteUrl = process.env.SITE_URL

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd()),
    },
  },
  // The site's own route handlers live under /api, so Payload's REST API gets its own prefix.
  routes: {
    api: '/cms-api',
  },
  collections: [
    Users,
    Projects,
    Services,
    Articles,
    TeamMembers,
    PressItems,
    Media,
    Leads,
    ChatConversations,
    ChatRequests,
    FAQs,
    KnowledgeSources,
    KnowledgeVersions,
    KnowledgeChunks,
    KnowledgeEvents,
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Discrete fields in Docker so any password characters work without URL-encoding.
    pool: process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
    migrationDir: path.resolve(process.cwd(), 'src/migrations'),
    // Applied automatically on startup when NODE_ENV=production.
    prodMigrations: migrations,
  }),
  sharp,
  graphQL: {
    disable: true,
  },
  csrf: siteUrl ? [siteUrl] : [],
  typescript: {
    autoGenerate: false,
  },
})
