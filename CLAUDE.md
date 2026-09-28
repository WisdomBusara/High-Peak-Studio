# Highpeak Platform - Implementation Guide

## Core Principle

**The CMS is the source of truth. The chatbot is a controlled consumer of approved content.**

Never invent Highpeak-specific information. Only verified, published content should be exposed.

## Project Overview

Building a complete platform for Highpeak Consultants Ltd:
- Public website showcasing architecture work
- Editorial CMS for content management
- Admin dashboard for operations
- AI chatbot with knowledge base
- Knowledge versioning and rollback system

## Technology Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Instrument Serif + Inter
- **Database**: PostgreSQL + pgvector
- **CMS**: Payload CMS 3.x
- **Media**: Local storage (Cloudflare R2 for production)
- **AI**: OpenAI embeddings

## Design System

### Colors (Light Mode)
```
--background: #F5F3EE (cream)
--surface: #EAE7DF (light grey)
--text: #151515 (dark grey/black)
--muted: #686762 (muted grey)
--border: #C9C6BD (border grey)
--dark: #111111 (pure black)
--light: #F7F6F2 (off-white)
```

### Typography
- **Display/Serif**: Instrument Serif
- **Body/UI**: Inter
- Fluid typography scaling
- Generous whitespace

### Layout
- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: 4-column grid
- Max width: 1440px
- Gutter: 1rem (mobile), 2rem (desktop)

## Content Types

### Projects
- Title, slug, category
- Location, year, status
- Hero image, description
- Design concept, story
- Gallery, drawings, materials
- Credits, related projects
- SEO metadata
- Chatbot visibility

### Services
- Name, description, capabilities
- Process, related projects
- Hero image
- SEO metadata
- Chatbot visibility

### Journal
- Title, slug, excerpt, body
- Cover image, author
- Category, tags
- Publication date
- Related projects
- SEO metadata
- Chatbot visibility

### Leads/CRM
- Contact info (name, email, phone, company)
- Project details (type, location, budget, timeline)
- Status tracking
- Source attribution
- Activity log

## Knowledge Management

### Pipeline
1. CMS content is published
2. Webhook triggers knowledge ingestion
3. Content is normalized and validated
4. Semantic chunking (~400-800 tokens)
5. OpenAI embeddings generated
6. Stored as versioned knowledge
7. Atomic activation (old version → RETIRED, new → ACTIVE)
8. Chatbot retrieves active knowledge

### Versioning
- Never overwrite current active version
- Each new version gets incremented
- Content hash prevents unnecessary re-indexing
- Full version history maintained
- Atomic transactions for all state changes

### Rollback Safeguards
1. Source publication status
2. Content hash integrity
3. Chunk completeness
4. Embedding model compatibility
5. Schema compatibility
6. No withdrawn content
7. CMS version compatibility
8. Pre-activation validation
9. Retrieval smoke test
10. Permission-based access
11. Mandatory reason capture
12. Never delete current version

## Chatbot Behavior

### Must Not Invent
- Projects, clients, pricing
- Budgets, materials, timelines
- Credentials, awards
- Statistics, contact details
- Project status, completion dates

### Appropriate Responses
- Use verified Highpeak content
- Distinguish general knowledge from Highpeak-specific facts
- Escalate to humans for quotes, contracts, legal questions
- Show source attribution for all answers
- Refuse when information unavailable

### Intent Types
- service_question
- project_search, project_detail
- material_question
- timeline_question, budget_question
- contact_request, quote_request
- project_enquiry
- company_question
- journal_question
- general_architecture_question
- human_handoff
- unknown

## Admin Dashboard

### Roles
- **Editor**: Create/edit drafts, upload media
- **Admin**: Review, approve, publish, rollback
- **Super Admin**: Full access
- **Analyst**: Read-only analytics

### Key Features
- Global search (Cmd/Ctrl + K)
- Real-time KPIs (projects, leads, chatbot activity)
- Conversation auditing (intent, sources, knowledge versions)
- Knowledge management (versioning, validation, rollback)
- Unanswered questions (identify knowledge gaps)
- Audit logging (all admin actions)

## Security

### Must Enforce
- Server-side RBAC
- CSRF protection
- Input validation & output encoding
- Secure uploads (MIME validation)
- Rate limiting
- Webhook signature verification
- Replay protection

### Must Never Expose
- System prompts
- API keys
- Private documents
- Draft knowledge
- Admin data
- Hidden CMS content

## Performance Targets

- Lighthouse Performance: 90+
- Accessibility: 95+ (WCAG 2.2 AA)
- Best Practices: 95+
- SEO: 95+

## Accessibility

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Screen reader support
- Color contrast (WCAG AA)
- Respect `prefers-reduced-motion`
- Minimum 44x44px touch targets

## Implementation Order

1. ✅ Project foundation (Next.js, design system, structure)
2. ✅ Public website pages & layouts
3. ✅ Payload CMS setup & collections
4. PostgreSQL & database initialization
5. Media management (R2 production setup)
6. Admin dashboard with Payload
7. Lead management interface
8. Chatbot UI & basic functionality
9. Knowledge pipeline & embeddings
10. Versioning & rollback system
11. Webhook integration for CMS publishing
12. Audit logging
13. Analytics
14. Security hardening
15. Performance optimization

## Key Files

### Frontend
- `app/layout.tsx` - Root layout with fonts and global meta
- `app/globals.css` - Design tokens and global styles
- `components/ui/` - Design system components
- `components/layout/` - Page layout components
- `components/sections/` - Section components (Hero, Grids, etc)
- `lib/types.ts` - TypeScript interfaces
- `lib/constants.ts` - Constants and routes
- `lib/mockData.ts` - Mock data for development

### API
- `app/api/projects/` - Projects API routes
- `app/api/services/` - Services API routes
- `app/api/articles/` - Articles API routes
- `app/api/leads/` - Leads creation route

### CMS
- `src/payload/payload.config.ts` - Payload configuration
- `src/payload/collections/` - Collection definitions
- `app/admin/` - Admin panel route

## Environment Variables

See `.env.example` for required configuration:
- `DATABASE_URL` - PostgreSQL connection
- `OPENAI_API_KEY` - OpenAI API key
- `R2_*` - Cloudflare R2 credentials
- `RESEND_API_KEY` - Email provider
- `ADMIN_SECRET` - Admin authentication

## Git Workflow

- Feature branches for major work
- Conventional commits
- Squash merge to main
- Tag releases

## Testing

- Unit tests (components, utilities)
- Integration tests (API routes, webhooks)
- E2E tests (critical user flows)
- Lighthouse audits (performance, accessibility)
- SEO validation

## Deployment

- GitHub repository
- Vercel for hosting
- Preview deployments for PRs
- staging.highpeak.co.ke
- highpeak.co.ke (production)
