# Payload CMS Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

Create a PostgreSQL database:

```bash
createdb highpeak
```

Or via psql:

```sql
CREATE DATABASE highpeak;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and update:

```bash
cp .env.example .env.local
```

Update these values:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/highpeak
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Initialize Database

Run Payload migrations:

```bash
npm run payload:migrate
```

This will:
- Create all database tables
- Set up relationships
- Create indexes

### 5. Create Admin User

```bash
npm run payload:create-user
```

This interactive command will prompt you to:
- Enter admin email
- Set password

### 6. Start Development Server

```bash
npm run dev
```

Access:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

## Collections

### Projects
- Title, slug, category, location, year, status
- Description, hero image, gallery
- Materials list
- SEO metadata
- Publish/chatbot visibility controls

### Services
- Name, slug, description
- Capabilities and process
- Hero image
- SEO metadata
- Publish/chatbot visibility controls

### Articles
- Title, slug, excerpt, body
- Cover image, author, category, tags
- Publication date
- SEO metadata
- Publish/chatbot visibility controls

### Media
- Image uploads with automatic resizing
- Metadata: title, alt text, caption, photographer, copyright
- Sizes: thumbnail (400), square (800), tablet (1200)

### Leads
- Contact information (name, email, phone, company)
- Project details (type, location, budget, timeline)
- Status tracking
- Source attribution
- Internal notes

### Users
- Email, name, role
- Roles: Editor, Admin, Super Admin, Analyst, Sales

## API Routes

All API routes require published content:

### Projects

**List Projects**
```
GET /api/projects?limit=10&page=1&category=residential
```

**Get Project**
```
GET /api/projects/:id
```

### Services

**List Services**
```
GET /api/services
```

### Articles

**List Articles**
```
GET /api/articles?limit=10&page=1
```

### Leads

**Create Lead**
```
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "company": "Example Co",
  "projectType": "commercial",
  "location": "Nairobi",
  "budgetRange": "1-5M",
  "timeline": "6 months",
  "message": "Interested in your services"
}
```

## Development Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run payload:migrate` - Run database migrations
- `npm run payload:create-user` - Create admin user
- `npm run type-check` - Run TypeScript checks

## Admin Panel Features

### Content Management
- Create, edit, publish projects, services, articles
- Draft/review/publish workflow
- Rich text editing with media embedding
- Gallery management with drag-to-reorder

### Media Management
- Upload images with automatic resizing
- Add metadata (alt text, captions, photographer)
- View and manage all media assets

### Lead Management
- View all leads with status tracking
- Update status and add notes
- Filter by source and status

### User Management
- Manage team members and roles
- Set permissions by role

## Database Schema

All tables created by Payload with relations:
- `users` - Admin users
- `projects` - Architecture projects
- `services` - Services offered
- `articles` - Journal articles
- `media` - Media assets
- `leads` - Lead records
- Payload system tables for versioning and media relations

## Security

- Environment secrets required (PAYLOAD_SECRET)
- Database password protection
- Access control by role
- Webhook signing for external integrations
- Input validation on all forms

## Troubleshooting

### Database Connection Failed

Check:
1. PostgreSQL is running
2. DATABASE_URL is correct
3. Database exists
4. User has permissions

### Admin Panel Not Loading

Check:
1. Payload dependencies installed
2. Database migrations ran
3. .env.local configured
4. No TypeScript errors: `npm run type-check`

### API Routes Returning 500

Check:
1. Database connection
2. Payload configuration
3. Server logs for errors
4. Required fields populated

## Next Steps

1. Create admin user: `npm run payload:create-user`
2. Access admin panel at `/admin`
3. Create sample projects, services, articles
4. Publish content to make it available on public site
5. Connect chatbot to knowledge pipeline
