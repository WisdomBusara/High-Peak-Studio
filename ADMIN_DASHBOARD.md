# Admin Dashboard - Content Management Interface

Complete guide to the admin dashboard for managing Highpeak content.

## Overview

The admin dashboard provides a unified interface for:
- Content management (projects, services, articles)
- Lead/CRM management
- Chatbot conversations
- Knowledge base administration
- Analytics and reporting
- User management

## Architecture

```
Admin Dashboard (Next.js)
    ↓
Payload CMS Collections
    ↓
PostgreSQL Database
    ↓
Real-time Data Updates
```

## Dashboard Home

Main KPI dashboard showing:

### Key Metrics

- **Total Projects** - Published + Draft
- **New Leads** - This week
- **Active Conversations** - Current chatbot sessions
- **Knowledge Versions** - Active in RAG system
- **Published Content** - All types
- **Unanswered Questions** - From chatbot

### Recent Activity Feed

- Latest leads submitted
- Recent publications
- Chatbot interactions
- Knowledge indexing events

### Quick Actions

- New Project
- New Service
- New Article
- View All Leads
- Manage Knowledge

## Content Management

### Projects Editor

**Tabs:**
1. **General**
   - Title, slug, category
   - Location, year, status
   - Hero image

2. **Content**
   - Description (rich text)
   - Design concept
   - Story/details

3. **Media**
   - Gallery (drag-to-reorder)
   - Upload images
   - Crop/edit

4. **Details**
   - Materials list
   - Area, client, architect
   - Related projects

5. **SEO**
   - Meta title
   - Meta description
   - OG image
   - URL slug

6. **Chatbot**
   - Chatbot visibility toggle
   - Knowledge sync status
   - Version history

7. **Publishing**
   - Draft/Published toggle
   - Scheduled publishing
   - Preview before publishing
   - Validation checklist

### Services Editor

Similar structure:
1. General (name, slug)
2. Content (description, capabilities)
3. Media (hero image)
4. Process (workflow description)
5. SEO
6. Publishing

### Articles Editor

1. General (title, slug, author)
2. Content (excerpt, body)
3. Media (cover image)
4. Details (category, tags, date)
5. SEO
6. Publishing

## Lead Management

### Leads Dashboard

**Table Columns:**
- Name
- Email
- Project Type
- Status
- Source
- Date
- Actions (view, edit)

**Filters:**
- Status (New, Contacted, Qualified, etc)
- Source (Website, Chatbot, Contact Form)
- Date range
- Project type

### Lead Detail View

- Contact information
- Project details
- Communication history
- Notes
- Status timeline
- Activity log

**Actions:**
- Update status
- Add notes
- Send email
- Schedule follow-up
- Convert to project

## Chatbot Management

### Conversations

View all chatbot conversations:
- User message
- Assistant response
- Intent classification
- Sources used
- Knowledge versions referenced
- Lead association

**Features:**
- Full conversation history
- Source traceability
- Export conversation
- Manual correction

### Requests

Track chatbot requests (quotes, callbacks, etc):
- Request type
- Status
- Priority
- Assigned to
- Lead associated
- Conversation link

**Actions:**
- Update status
- Assign to team member
- Add notes
- Create task

### Unanswered Questions

Monitor questions the chatbot couldn't answer:
- Question text
- Context
- Date
- Status

**Workflow:**
- Mark as answered
- Create FAQ from it
- Create content
- Ignore/archive

## Knowledge Management

### Knowledge Dashboard

**Overview:**
- Active versions
- Total chunks
- Embedding model
- Last indexed

**Version History:**
- Version number
- Status
- Chunk count
- Created date
- Activated date

**Actions:**
- View chunks
- Compare versions
- Rollback
- Reindex
- View validation report

### Version Comparison

Compare two versions side-by-side:
- Content changes
- Chunk count difference
- Status timeline
- Validation differences

### Rollback Interface

Safe version rollback with:
1. Select target version
2. Pre-rollback validation (12 checks)
3. Confirmation with reason
4. Execution
5. Health checks
6. Auto-recovery if needed

**Validation Checklist:**
- ✓ Source still published
- ✓ Chatbot visible
- ✓ Content hash valid
- ✓ Chunks complete
- ✓ Embeddings present
- ✓ Schema compatible
- ✓ Model compatible
- ✓ Metadata valid
- ✓ Retrieval works
- ✓ No withdrawn content
- ✓ CMS version ok
- ✓ Not superseded

## Components

### DashboardCard
```typescript
<DashboardCard
  title="Total Projects"
  value={42}
  change={12}
  trend="up"
  actionLabel="View All"
/>
```

Properties:
- `title` - Card heading
- `value` - Main metric
- `change` - % change
- `trend` - up/down/neutral
- `actionLabel` - CTA text
- `onClick` - Click handler

### DataTable
```typescript
<DataTable<Lead>
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ]}
  data={leads}
  onRowClick={handleSelectLead}
/>
```

Properties:
- `columns` - Column definitions
- `data` - Table rows
- `loading` - Loading state
- `onRowClick` - Row selection
- `rowKey` - Unique key field

### AdminLayout
```typescript
<AdminLayout
  title="Projects"
  subtitle="Manage architecture projects"
  action={{ label: 'New Project', href: '/admin/projects/new' }}
>
  {/* Content */}
</AdminLayout>
```

### FormField
```typescript
<FormField
  label="Project Title"
  required
  error={errors.title}
  help="Used for display and SEO"
>
  <input type="text" />
</FormField>
```

## User Roles & Permissions

### Editor
- Create/edit own drafts
- Upload media
- Submit for review
- View analytics (read-only)
- Cannot publish

### Admin
- Approve/publish content
- Edit all content
- Manage leads
- Manage users
- View analytics
- Perform rollbacks

### Super Admin
- Full access
- System settings
- Database management
- Audit logs

### Analyst
- View analytics (read-only)
- View leads (read-only)
- Export reports
- Cannot edit content

## Workflows

### Content Publishing Workflow

```
1. DRAFT
   ↓ Submit for review
2. IN REVIEW
   ↓ Admin approves
3. APPROVED
   ↓ Publish
4. PUBLISHED
   ↓ Trigger webhook
5. KNOWLEDGE INDEXING
   ↓ Create chunks
6. READY FOR RAG
   ↓ Chatbot uses
7. ACTIVE
```

### Lead Qualification Workflow

```
1. NEW (submitted from contact form or chatbot)
   ↓ Team reviews
2. CONTACTED (email/phone)
   ↓ Qualifying discussion
3. QUALIFIED (real project)
   ↓ Proposal stage
4. PROPOSAL (send quote)
   ↓ Negotiation
5. NEGOTIATION
   ↓ Agreement
6. WON (project engaged)
   or LOST (didn't convert)
```

## Analytics

### Dashboard Analytics

- Visitor count
- Project views
- Lead sources
- Chatbot conversations
- Knowledge retrieval hits
- Popular content

### Lead Analytics

- Source breakdown
- Conversion rate
- Status distribution
- Lead value
- Average close time

### Chatbot Analytics

- Total conversations
- Intent breakdown
- Unanswered questions
- Lead generation rate
- User satisfaction

### Content Performance

- Page views
- Time on page
- Scroll depth
- Bounce rate
- Conversion rate

## Bulk Operations

### Import
- Bulk upload projects (CSV)
- Bulk upload media
- Bulk import leads

### Export
- Export leads (CSV, PDF)
- Export conversations
- Export analytics

### Batch Actions
- Publish multiple items
- Update status batch
- Assign batch
- Archive batch

## Search & Filters

### Global Search
```
Cmd/Ctrl + K
```

Search across:
- Projects
- Services
- Articles
- Leads
- Conversations
- FAQs

### Advanced Filters

Apply multiple filters:
- Date range
- Status
- Category
- Author
- Published state
- Chatbot visibility

## Settings

### Content Settings
- Homepage hero message
- Default category
- Required fields
- Publishing rules

### Knowledge Settings
- Embedding model
- Chunk settings
- Validation rules
- Rollback policies

### Lead Settings
- Lead scoring
- Auto-assignment rules
- Email templates
- Notification settings

### User Settings
- Permissions
- Team management
- Audit logs

## Implementation Status

- ✅ Component library (DashboardCard, DataTable, AdminLayout, FormField)
- ✅ Collection definitions (all data ready)
- ✅ API endpoints (ready)
- ⏳ Full page implementations (coming next)
- ⏳ Real-time updates
- ⏳ Analytics charts
- ⏳ Bulk operations
- ⏳ Export features

## Future Enhancements

1. **AI Suggestions**
   - Auto-fill fields
   - Content recommendations
   - Lead scoring

2. **Collaboration**
   - Commenting on drafts
   - Approval workflows
   - Notifications

3. **Scheduling**
   - Schedule publishing
   - Recurring content
   - Content calendars

4. **Integrations**
   - CRM sync
   - Email marketing
   - Slack notifications

5. **Advanced Analytics**
   - Custom reports
   - Predictive analytics
   - Performance tracking

## Deployment

Payload CMS admin is automatically deployed:
- Available at `/admin`
- After authentication
- With role-based access
- Real-time data

## Troubleshooting

### Publishing Fails
- Check required fields
- Verify SEO settings
- Check file uploads
- Review validation errors

### Knowledge Sync Issues
- Check chatbot visibility
- Verify publishing status
- Review error logs
- Manual reindex if needed

### Permission Denied
- Verify user role
- Check admin status
- Refresh page
- Clear browser cache
