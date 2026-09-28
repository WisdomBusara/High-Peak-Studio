# Highpeak Consultants Ltd --- Complete Website, CMS, Admin, Chatbot & Knowledge Platform Specification

## 1. Document Purpose

This document is the consolidated implementation specification for the
Highpeak Consultants Ltd digital platform.

It combines:

-   Public architecture/consultancy website
-   Project portfolio and galleries
-   Services and journal publishing
-   SEO management
-   Editorial review and approval workflows
-   Next.js administration dashboard
-   Lead/CRM management
-   Website chatbot / AI concierge
-   Chatbot knowledge base and RAG
-   CMS-to-chatbot publishing webhooks
-   Knowledge chunking, embeddings and versioning
-   Knowledge rollback and recovery safeguards
-   Media management
-   Analytics
-   Security, accessibility and performance requirements
-   Deployment and infrastructure recommendations

The implementation must prioritize factual integrity. Highpeak-specific
information must never be invented.

------------------------------------------------------------------------

# 2. Product Vision

Build a premium architecture and consultancy website that presents
Highpeak Consultants Ltd as a contemporary professional practice while
also functioning as an operational content, enquiry and knowledge
platform.

The public website should feel:

-   Architectural
-   Editorial
-   Premium
-   Contemporary
-   Professional
-   Image-led
-   Calm
-   Structured
-   Responsive
-   Fast
-   Accessible

Avoid making the site look like a generic construction-company template.

Do not use excessive:

-   Gradients
-   Glassmorphism
-   Particle effects
-   Generic stock imagery
-   Decorative animations with no purpose
-   Overly rounded SaaS-style cards
-   Heavy UI chrome
-   Artificial project statistics

Architecture and project work should remain the visual focus.

------------------------------------------------------------------------

# 3. Critical Data Integrity Rule

The system must distinguish between:

1.  Verified Highpeak information
2.  Approved Highpeak documents
3.  Published Highpeak website content
4.  General architectural knowledge
5.  Model-generated explanations

The chatbot and public website must never invent:

-   Projects
-   Clients
-   Services
-   Project locations
-   Project sizes
-   Project completion dates
-   Materials used by a specific project
-   Construction costs
-   Budgets
-   Timelines
-   Professional credentials
-   Awards
-   Statistics
-   Team members
-   Contact details
-   Certifications
-   Partnerships
-   Testimonials
-   Project status
-   Architectural qualifications

If a fact has not been supplied, approved or published by Highpeak, do
not present it as a Highpeak fact.

------------------------------------------------------------------------

# 4. Recommended Technology Architecture

## Frontend

-   Next.js
-   TypeScript
-   App Router
-   Tailwind CSS
-   React
-   Server Components where appropriate
-   Client Components only where interactivity requires them

Animation:

-   GSAP and/or Framer Motion
-   Use animation selectively
-   Respect `prefers-reduced-motion`

## CMS

### Preferred: Payload CMS

Payload is recommended for this project because the platform extends
beyond a normal editorial website into:

-   CMS
-   CRM
-   chatbot administration
-   knowledge management
-   publishing workflow
-   audit logging
-   custom operational dashboard

Payload should be heavily customized so non-technical editors experience
a purpose-built Highpeak editorial interface rather than a
developer-oriented CMS.

## Database

-   PostgreSQL
-   pgvector for initial RAG implementation

## Media

-   Cloudflare R2
-   Store original assets
-   Generate optimized variants
-   Serve responsive AVIF/WebP/JPEG assets

## AI

-   OpenAI API
-   Embeddings
-   Retrieval-augmented generation
-   Server-side API access only

## Deployment

Recommended:

-   Vercel for Next.js
-   Cloudflare DNS
-   Cloudflare WAF/CDN/security
-   PostgreSQL managed service
-   Cloudflare R2 for media
-   GitHub for source control

Recommended environments:

-   Local development
-   `staging.highpeak.co.ke`
-   Production `highpeak.co.ke`
-   Vercel preview deployments for pull requests

## Email

Use a transactional email provider such as Resend or an equivalent
production email provider.

## Monitoring

-   Sentry
-   Vercel monitoring
-   Application logs
-   Knowledge pipeline monitoring

## Analytics

Plausible or GA4.

------------------------------------------------------------------------

# 5. Payload vs Sanity Decision

Sanity is arguably stronger for a pure editorial team because of its
polished Studio, visual editing, collaboration and content-release
capabilities.

Payload is recommended for Highpeak because the system is more than a
CMS.

The platform needs to integrate:

``` text
                 HIGHPEAK PLATFORM
                        |
          +-------------+-------------+
          |             |             |
       WEBSITE        ADMIN        CHATBOT
          |             |             |
       Next.js       Payload       RAG
          |             |             |
          +-------------+-------------+
                        |
                    PostgreSQL
                        |
                     pgvector
```

## Sanity strengths

-   Excellent editorial experience
-   Strong visual editing
-   Strong media workflows
-   Collaboration features
-   Content releases
-   Excellent for editorial teams

## Payload strengths

-   Deep Next.js integration
-   Full control of admin interface
-   PostgreSQL integration
-   Custom access control
-   Versions and drafts
-   Live preview
-   Custom workflows
-   Easy integration with CRM/chatbot/knowledge infrastructure
-   Self-hosting/control
-   One application architecture

## Decision

Use Payload.

However, deliberately build the Highpeak admin to provide a Sanity-like
editorial experience:

-   Simple navigation
-   Clear fields
-   Visual preview
-   Drag-and-drop galleries
-   Draft/review/publish states
-   Strong validation
-   Easy rollback
-   Friendly media management
-   Minimal technical terminology

------------------------------------------------------------------------

# 6. Public Website Sitemap

Core routes:

``` text
/
 /projects
 /projects/[slug]
 /services
 /services/[slug]
 /about
 /approach
 /journal
 /journal/[slug]
 /contact
 /privacy
 /terms
```

Optional routes only when verified content exists:

``` text
/careers
/team
/publications
/awards
/testimonials
/downloads
```

------------------------------------------------------------------------

# 7. Homepage

Recommended structure:

1.  Full-screen hero
2.  Introductory statement
3.  Featured projects
4.  Services
5.  About Highpeak
6.  Approach/process
7.  Verified statistics, if available
8.  Journal/insights
9.  Contact CTA
10. Footer

The homepage should prioritize project imagery.

Do not create fake statistics merely to fill the design.

------------------------------------------------------------------------

# 8. Visual Design System

The final design should be derived from verified Highpeak brand assets
where available.

Suggested baseline palette:

``` css
--background: #F5F3EE;
--surface: #EAE7DF;
--text: #151515;
--muted: #686762;
--border: #C9C6BD;
--dark: #111111;
--light: #F7F6F2;
--accent: <BRAND_ACCENT>;
```

These are baseline design tokens only. Replace them if actual Highpeak
brand assets establish different colors.

Suggested typography:

-   Instrument Serif for editorial/display moments
-   Inter for body/UI

Use fluid typography.

Layout:

-   Desktop: 12-column grid
-   Tablet: 8-column grid
-   Mobile: 4-column grid
-   Maximum content width: approximately 1440px

Use generous whitespace.

Architecture imagery should dominate.

------------------------------------------------------------------------

# 9. Responsive Design

Desktop:

-   Editorial layouts
-   Asymmetric grids
-   Large project imagery
-   Large typography
-   Spacious navigation

Tablet:

-   Simplify asymmetric compositions
-   Preserve hierarchy
-   Reduce excessive horizontal layouts

Mobile:

-   Vertical content flow
-   Bottom-sheet/fullscreen chatbot
-   Mobile navigation
-   Touch-friendly controls
-   Minimum 44x44px touch targets

Mobile navigation must have:

-   Open/closed states
-   Accessible keyboard behavior
-   Focus management
-   Escape-to-close
-   Touch-friendly transitions
-   Reduced-motion support

------------------------------------------------------------------------

# 10. Animation

Use subtle animation for:

-   Image reveals
-   Page transitions
-   Navigation state changes
-   Scroll-triggered reveals
-   Project image transitions

Do not animate everything.

Respect:

``` css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion users should receive minimal or no decorative movement.

------------------------------------------------------------------------

# 11. Project Archive

Route:

``` text
/projects
```

Filters:

-   All
-   Residential
-   Commercial
-   Institutional
-   Hospitality
-   Other

The archive should use editorial/asymmetric grids rather than generic
card grids.

Project cards may contain:

-   Hero image
-   Project name
-   Location
-   Category
-   Year
-   Status

Only show verified information.

------------------------------------------------------------------------

# 12. Project Detail Page

Route:

``` text
/projects/[slug]
```

Structure:

1.  Hero image
2.  Project title
3.  Metadata
4.  Project introduction
5.  Design concept
6.  Project story
7.  Gallery
8.  Drawings
9.  Materials
10. Credits
11. Related projects
12. Next project
13. Enquiry CTA

Possible metadata:

-   Location
-   Category
-   Year
-   Status
-   Area
-   Client
-   Architect
-   Consultants

Only display fields that have verified data.

------------------------------------------------------------------------

# 13. Services

Routes:

``` text
/services
/services/[slug]
```

Service records should contain:

-   Name
-   Short description
-   Detailed description
-   Capabilities
-   Process
-   Related projects
-   Hero image
-   SEO
-   Chatbot visibility
-   Publishing status

Never invent a service merely because it is common in architecture.

------------------------------------------------------------------------

# 14. Journal

Routes:

``` text
/journal
/journal/[slug]
```

Journal records:

-   Title
-   Slug
-   Excerpt
-   Body
-   Cover image
-   Author
-   Category
-   Tags
-   Related projects
-   Publication date
-   SEO
-   Chatbot visibility
-   Publishing status

The editorial experience should be simple enough for non-technical
editors.

------------------------------------------------------------------------

# 15. Contact

Contact form fields:

-   Name
-   Email
-   Phone
-   Company
-   Project type
-   Location
-   Budget range
-   Timeline
-   Message
-   Consent

Security requirements:

-   CSRF protection
-   Server-side validation
-   Rate limiting
-   Honeypot
-   Spam protection
-   Secure output encoding
-   Consent capture

Do not expose sensitive lead data to analytics.

------------------------------------------------------------------------

# 16. Media Architecture

Use Cloudflare R2 for originals.

Supported formats:

-   AVIF
-   WebP
-   JPEG
-   PNG
-   SVG where appropriate

Generate responsive variants:

``` text
400
800
1200
1600
2400
```

Media metadata:

-   Filename
-   Title
-   Alt text
-   Caption
-   Description
-   Project
-   Category
-   Photographer
-   Copyright
-   Orientation
-   Dimensions
-   File size
-   Uploader
-   Created date

Editors should be able to:

-   Upload
-   Search
-   Filter
-   Reuse
-   Assign to projects
-   Reorder galleries
-   Edit metadata
-   Preview
-   Replace assets

------------------------------------------------------------------------

# 17. SEO

Every major content type must support:

-   Meta title
-   Meta description
-   Slug
-   Canonical URL
-   OpenGraph title
-   OpenGraph description
-   OpenGraph image
-   Twitter metadata
-   Sitemap inclusion
-   Index/noindex

Validation should occur before publication.

Example:

``` text
SEO CHECK

✓ Meta title
✓ Meta description
✓ Valid slug
✓ Canonical URL
✓ OG image
✓ Content available
```

Structured data where applicable:

-   Organization
-   LocalBusiness, only if verified and appropriate
-   Article
-   BreadcrumbList
-   ImageObject

Never create fabricated organization data.

------------------------------------------------------------------------

# 18. Editorial Workflow

Recommended content lifecycle:

``` text
DRAFT
  ↓
IN REVIEW
  ↓
APPROVED
  ↓
SCHEDULED
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Roles:

## Editor

Can:

-   Create content
-   Edit drafts
-   Upload media
-   Submit for review

Cannot:

-   Publish protected production content unless explicitly authorized

## Admin

Can:

-   Review
-   Approve
-   Publish
-   Roll back
-   Manage leads
-   Manage chatbot knowledge

## Super Admin

Full access.

## Sales

-   Leads
-   Requests
-   Contact information
-   Relevant project data

## Analyst

-   Analytics
-   Read-only reporting

All authorization must be enforced server-side.

------------------------------------------------------------------------

# 19. Next.js Admin Dashboard

Routes:

``` text
/admin
/admin/dashboard

/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/projects/[id]/preview

/admin/services
/admin/services/[id]

/admin/journal
/admin/journal/new
/admin/journal/[id]

/admin/media

/admin/leads
/admin/leads/[id]

/admin/chatbot
/admin/chatbot/conversations
/admin/chatbot/conversations/[id]
/admin/chatbot/knowledge
/admin/chatbot/questions
/admin/chatbot/requests

/admin/analytics
/admin/users
/admin/settings
```

------------------------------------------------------------------------

# 20. Admin Dashboard Home

KPIs must come from the database.

Possible cards:

-   Total projects
-   Published projects
-   New leads
-   Open leads
-   Chatbot requests
-   Unanswered questions

Never hard-code fake numbers.

Include:

-   Recent activity
-   Recent leads
-   Publishing activity
-   Chatbot activity
-   Knowledge indexing status

Global search:

``` text
Cmd/Ctrl + K
```

Search:

-   Projects
-   Services
-   Journal
-   Leads
-   Conversations
-   Knowledge
-   Media

------------------------------------------------------------------------

# 21. Project Editor

Use tabs:

``` text
General
Content
Media
Drawings
Materials
SEO
Chatbot
Publishing
```

The editor should feel like a guided workflow rather than a raw database
form.

Recommended publishing flow:

``` text
1. Edit
2. Validate
3. Preview
4. Submit for review
5. Approve
6. Publish
```

------------------------------------------------------------------------

# 22. Project Gallery Editor

Provide:

-   Drag-to-reorder
-   Upload
-   Replace
-   Delete
-   Caption
-   Alt text
-   Image focal point
-   Project association

Warn before destructive actions.

Use soft deletion where possible.

------------------------------------------------------------------------

# 23. Leads / Lightweight CRM

Statuses:

``` text
New
Contacted
Qualified
Proposal
Negotiation
Won
Lost
Spam
```

Lead detail:

-   Contact
-   Project information
-   Source
-   Conversation
-   Chat request
-   Activity
-   Notes
-   Assigned user
-   Created date
-   Updated date

Track source:

``` text
Website
Chatbot
Contact Form
Journal
Project Page
Referral
Other
```

------------------------------------------------------------------------

# 24. Chatbot Purpose

The chatbot is a:

**Website concierge and project-enquiry assistant.**

It is not:

-   An autonomous architect
-   Engineer
-   Quantity surveyor
-   Lawyer
-   Financial advisor
-   Contract advisor

Primary uses:

-   Services
-   Projects
-   Project discovery
-   Materials, when verified
-   Published timelines
-   Published budgets/pricing
-   Contact information
-   Project enquiries
-   Lead qualification
-   Human handoff

------------------------------------------------------------------------

# 25. Chatbot Knowledge Hierarchy

Priority:

``` text
1. Highpeak CMS
2. Approved Highpeak documents
3. Approved website content
4. General architectural knowledge
5. General model knowledge
```

Highpeak-specific questions must rely on Highpeak-approved sources.

General architectural explanations may use general knowledge but must
clearly distinguish general information from Highpeak-specific
information.

------------------------------------------------------------------------

# 26. Chatbot Prohibited Behavior

Never invent:

-   Projects
-   Clients
-   Pricing
-   Budgets
-   Materials
-   Timelines
-   Credentials
-   Contact details
-   Statistics
-   Awards
-   Project completion status

If information is unavailable:

> I don't have verified information about that from Highpeak's published
> information. I can help you contact the team about it.

------------------------------------------------------------------------

# 27. Chatbot Intent Types

Use:

``` text
service_question
project_search
project_detail
material_question
timeline_question
budget_question
contact_request
quote_request
project_enquiry
company_question
journal_question
general_architecture_question
human_handoff
unknown
```

------------------------------------------------------------------------

# 28. Project Enquiry Flow

Ask one question at a time.

Recommended sequence:

1.  Project type
2.  Location
3.  Current project stage
4.  Budget range
5.  Desired start date
6.  Best contact method

Allow:

> Not sure

for budget and timeline.

Before submission:

``` text
PROJECT ENQUIRY SUMMARY

Project type: ...
Location: ...
Stage: ...
Budget: ...
Desired start: ...
Contact: ...

Is this correct?

[Submit] [Edit]
```

Require explicit confirmation.

------------------------------------------------------------------------

# 29. Chatbot Escalation

Escalate to humans for:

-   Quotes
-   Contracts
-   Detailed engineering questions
-   Legal questions
-   Financial advice
-   Site-specific technical advice
-   Complex projects
-   Missing Highpeak information
-   Explicit human requests

------------------------------------------------------------------------

# 30. Chatbot UI

Desktop:

-   Floating chat button
-   Expandable panel

Mobile:

-   Bottom sheet or fullscreen interface

Include:

-   Suggested questions
-   Project cards
-   Service cards
-   Links
-   CTAs
-   Enquiry form
-   Human handoff

------------------------------------------------------------------------

# 31. Chatbot Analytics

Track:

``` text
chat_opened
question_submitted
project_clicked
service_clicked
quote_started
lead_started
lead_submitted
human_handoff
chat_abandoned
```

Do not put sensitive PII into analytics events.

------------------------------------------------------------------------

# 32. Chatbot Knowledge Model

Core entities:

``` text
KnowledgeSource
KnowledgeVersion
KnowledgeChunk
KnowledgeEvent
```

Recommended schema:

``` sql
knowledge_sources
-----------------
id
source_type
source_id
source_title
source_url
published
chatbot_visible
created_at
updated_at
```

``` sql
knowledge_versions
------------------
id
knowledge_source_id
version_number
content_hash
normalized_content
status
created_by
created_at
activated_at
retired_at
embedding_model
chunk_count
knowledge_schema_version
```

``` sql
knowledge_chunks
----------------
id
knowledge_version_id
chunk_index
section
content
embedding
metadata
created_at
```

``` sql
knowledge_events
----------------
id
event_type
source_id
payload_hash
status
error
created_at
processed_at
```

------------------------------------------------------------------------

# 33. Knowledge Version Statuses

Use explicit statuses:

``` text
RECEIVED
VALIDATING
FETCHING
NORMALIZING
CHUNKING
EMBEDDING
VALIDATING_INDEX
READY
ACTIVE
RETIRED
OUTDATED
INCOMPATIBLE
INVALID
FAILED
BLOCKED
```

Do not reduce this to simply active/inactive.

------------------------------------------------------------------------

# 34. CMS → Knowledge Publishing Pipeline

The publishing pipeline:

``` text
Payload CMS
     ↓
Signed webhook
     ↓
Knowledge Ingestion API
     ↓
Validate event
     ↓
Fetch authoritative published CMS record
     ↓
Normalize
     ↓
Create knowledge version
     ↓
Semantic chunking
     ↓
Generate embeddings
     ↓
Validate index
     ↓
READY
     ↓
Atomic activation
     ↓
Chatbot RAG
```

Only publishing should trigger the production knowledge update.

Editing a draft must not automatically make it available to the chatbot.

------------------------------------------------------------------------

# 35. Webhook Events

Examples:

``` text
project.published
project.updated
project.unpublished
service.published
journal.published
content.unpublished
```

Webhook payload should contain identifiers rather than being treated as
the authoritative content.

Example:

``` json
{
  "event_id": "evt_123",
  "event_type": "project.published",
  "document_id": "project_456",
  "version": 7,
  "timestamp": "2026-09-26T12:00:00Z"
}
```

The ingestion system must fetch the authoritative published record.

------------------------------------------------------------------------

# 36. Webhook Security

Verify:

-   Signature
-   Timestamp
-   Event type
-   Event ID
-   Document ID
-   Replay protection

Reject:

-   Invalid signature
-   Expired timestamp
-   Unknown event
-   Duplicate event
-   Unauthorized source

Use unique event IDs for idempotency.

------------------------------------------------------------------------

# 37. Queue Architecture

Do not make CMS publishing wait for embeddings.

Use:

-   BullMQ + Redis, or
-   A reliable DB-backed job queue

Flow:

``` text
CMS publish
    ↓
Webhook
    ↓
Queue
    ↓
Knowledge worker
```

Retries must use exponential backoff.

Failed jobs should enter a dead-letter queue.

------------------------------------------------------------------------

# 38. Knowledge Ingestion Lifecycle

``` text
RECEIVED
   ↓
VALIDATING
   ↓
FETCHING
   ↓
NORMALIZING
   ↓
CHUNKING
   ↓
EMBEDDING
   ↓
VALIDATING_INDEX
   ↓
READY
   ↓
ACTIVE
```

Failures:

``` text
FAILED
```

A failed new version must never deactivate a valid previous version.

------------------------------------------------------------------------

# 39. Source Validation

Before indexing verify:

``` text
published = true
chatbot_visible = true
title exists
slug exists
required content exists
```

Optional fields:

-   Location
-   Year
-   Status
-   Materials
-   Area
-   Client
-   Description

Never infer missing fields.

------------------------------------------------------------------------

# 40. Normalization

Convert CMS JSON into structured knowledge text.

Example:

``` text
PROJECT: Verified Project Name

CATEGORY:
Residential

LOCATION:
Verified location

YEAR:
Verified year

STATUS:
Verified status

DESCRIPTION:
Verified project description

DESIGN CONCEPT:
Verified design concept

MATERIALS:
Only materials explicitly recorded by Highpeak.

SOURCE:
https://highpeak.co.ke/projects/example
```

Attach metadata:

``` text
source_type
source_id
source_title
source_url
updated_at
published_at
section
```

------------------------------------------------------------------------

# 41. Semantic Chunking

Do not split content arbitrarily.

Target approximately:

``` text
400–800 tokens
```

Overlap where necessary:

``` text
50–100 tokens
```

Preserve semantic sections.

Example:

``` text
Project Overview
Design Concept
Materials
Location
Project Status
```

Each chunk should remain understandable when retrieved independently.

------------------------------------------------------------------------

# 42. Content Hashing

Generate:

``` text
SHA-256(normalized_content)
```

If the hash has not changed:

``` text
No re-index required.
```

This avoids unnecessary embedding work.

------------------------------------------------------------------------

# 43. Knowledge Versioning

Never overwrite the live knowledge version.

Example:

``` text
v5 ACTIVE

New CMS publication

v6 CREATED
v6 INDEXING
v6 VALIDATED
v6 READY

Atomic switch:

v5 → RETIRED
v6 → ACTIVE
```

Store:

-   Version number
-   Content hash
-   Status
-   Created by
-   Created at
-   Activated at
-   Retired at
-   Embedding model
-   Chunk count
-   Schema version

------------------------------------------------------------------------

# 44. Atomic Activation

Never:

``` text
DELETE old version
ACTIVATE new version
```

Instead:

``` text
BEGIN TRANSACTION

validate new version

old_version → RETIRED
new_version → ACTIVE
knowledge_source.active_version_id → new_version

write audit event

COMMIT
```

If anything fails:

``` text
ROLLBACK TRANSACTION
```

The previous active version remains active.

------------------------------------------------------------------------

# 45. Retrieval Rules

Only retrieve knowledge that satisfies:

``` text
status = ACTIVE
published = true
chatbot_visible = true
```

Retrieval must also verify the source is still valid.

Never retrieve private drafts or unpublished content.

------------------------------------------------------------------------

# 46. Chatbot Source Traceability

Every Highpeak-specific answer should be traceable to:

``` text
source_type
source_id
source_title
source_url
knowledge_version
knowledge_chunk
updated_at
```

Admin conversation view should show:

``` text
ANSWER

Retrieved Sources:

1. Highpeak Residence
   Knowledge v7
   Chunk 4
   Source: /projects/highpeak-residence

2. Highpeak Services
   Knowledge v3
   Chunk 2
   Source: /services/architecture
```

------------------------------------------------------------------------

# 47. Historical Conversation Auditing

Each chatbot response should retain:

``` text
conversation_id
message_id
knowledge_version(s)
retrieved_sources
timestamp
intent
```

This ensures historical answers remain auditable even after knowledge
changes.

------------------------------------------------------------------------

# 48. Knowledge Admin Dashboard

Route:

``` text
/admin/chatbot/knowledge
```

Table:

``` text
Source
Type
CMS Version
Knowledge Version
Status
Chatbot Visible
Last Indexed
Chunks
Embedding Model
Updated
Actions
```

Actions:

-   View
-   Compare
-   Reindex
-   Rollback
-   View history

------------------------------------------------------------------------

# 49. Rollback Philosophy

Rollback is a controlled deployment operation.

It must not be equivalent to:

``` text
Click Restore
```

The system must validate the target version before activation.

An old version is not automatically invalid.

The important question is whether it is:

-   Still authorized to be served
-   Internally consistent
-   Compatible
-   Based on content Highpeak is still allowed to expose
-   Properly indexed
-   Retrievable

------------------------------------------------------------------------

# 50. Rollback Screen

Recommended interface:

``` text
Knowledge / Highpeak Residence
────────────────────────────────────────────

CURRENT ACTIVE

v7 · Published 26 Sep 2026 · 14:32
Status: ACTIVE
Chunks: 18
Embedding: text-embedding-3-small
Content hash: 8f91…c21a

VERSION HISTORY

v7 ACTIVE
v6 Previous
v5 Previous

SELECTED VERSION: v6

✓ Source still exists
✓ Source is still published
✓ Chatbot visibility enabled
✓ Content hash verified
✓ 17/17 chunks present
✓ Embeddings available
✓ Embedding model compatible
✓ Source URL valid
✓ Version integrity verified

⚠ This will replace v7 as the active knowledge version.

[Compare with Current] [Cancel] [Rollback to v6]
```

------------------------------------------------------------------------

# 51. Rollback Confirmation

Require explicit confirmation.

``` text
Rollback knowledge to v6?

This will make v6 the active knowledge version for the chatbot.
The current v7 version will be retained.

Reason for rollback:
[ Required reason ]

[Cancel]
[Confirm Rollback]
```

------------------------------------------------------------------------

# 52. Rollback Safeguard 1 --- Source Publication

Before rollback verify:

``` text
published = true
chatbot_visible = true
```

If either is false:

``` text
ROLLBACK BLOCKED

Source is no longer published or chatbot-visible.
```

This prevents unpublished content from being resurrected.

------------------------------------------------------------------------

# 53. Rollback Safeguard 2 --- Content Hash

Recompute:

``` text
SHA256(normalized_content)
```

Compare against the stored hash.

Mismatch:

``` text
ROLLBACK BLOCKED

Knowledge version integrity check failed.
```

------------------------------------------------------------------------

# 54. Rollback Safeguard 3 --- Chunk Integrity

If:

``` text
chunk_count = 17
```

verify:

``` text
17 expected
17 present
17 embedded
```

A partially indexed version must never become active.

------------------------------------------------------------------------

# 55. Rollback Safeguard 4 --- Embedding Compatibility

Verify:

-   Embedding model
-   Vector dimensions
-   Index compatibility

Example:

``` text
Version:
text-embedding-3-small
1536 dimensions

Current index:
text-embedding-3-small
1536 dimensions

✓ Compatible
```

If incompatible:

``` text
ROLLBACK BLOCKED

Version requires re-indexing with the current embedding model.
```

------------------------------------------------------------------------

# 56. Rollback Safeguard 5 --- Schema Compatibility

Store:

``` text
knowledge_schema_version
```

Example:

``` text
v6 schema: 3
current schema: 3

✓ Compatible
```

If:

``` text
v2 schema: 1
current schema: 3
```

block activation until migrated/re-indexed.

------------------------------------------------------------------------

# 57. Rollback Safeguard 6 --- Superseded CMS Content

If:

``` text
Current CMS version = 12
Rollback knowledge = CMS version 11
```

show:

``` text
WARNING

This knowledge version corresponds to an older CMS version.

Current published version: 12
Selected version: 11
```

For normal production operation, block this unless the user has an
explicit emergency rollback permission.

------------------------------------------------------------------------

# 58. Rollback Safeguard 7 --- Withdrawn Content

Hard-block versions associated with:

-   Withdrawn projects
-   Content marked legally restricted
-   Deleted content
-   Explicitly prohibited chatbot content
-   Confidential material

Do not resurrect withdrawn information.

------------------------------------------------------------------------

# 59. Rollback Safeguard 8 --- Pre-Activation Validation

Show:

``` text
VALIDATION

✓ Source exists
✓ Source published
✓ Chatbot visible
✓ Content hash
✓ Chunk integrity
✓ Embeddings
✓ Schema compatibility
✓ Metadata integrity
✓ Source URL
✓ No prohibited status
✓ Retrieval test
✓ Knowledge completeness

12 / 12 checks passed
```

Rollback must remain disabled until required checks pass.

------------------------------------------------------------------------

# 60. Rollback Safeguard 9 --- Retrieval Smoke Test

Run representative retrieval queries.

Examples:

``` text
What is this project?
Where is this project located?
What materials were used?
What type of project is it?
```

Verify relevant chunks can be retrieved.

A technically intact but unusable knowledge version should not become
active.

------------------------------------------------------------------------

# 61. Rollback Safeguard 10 --- Permissions

Recommended:

  Role            View   Compare   Rollback
  ------------- ------ --------- ----------
  Editor           Yes       Yes         No
  Admin            Yes       Yes        Yes
  Super Admin      Yes       Yes        Yes
  Analyst          Yes       Yes         No

All permissions must be enforced server-side.

------------------------------------------------------------------------

# 62. Rollback Safeguard 11 --- Required Reason

Require:

``` text
Rollback reason
```

Options:

-   Incorrect information
-   Bad indexing
-   Embedding problem
-   Accidental publication
-   CMS synchronization issue
-   Content regression
-   Other

Store free-text explanation.

------------------------------------------------------------------------

# 63. Rollback Safeguard 12 --- Never Delete Current Version

If:

``` text
v7 ACTIVE
```

and rollback to v6:

``` text
v7 → RETIRED
v6 → ACTIVE
```

Keep v7 available for future restoration.

------------------------------------------------------------------------

# 64. Rollback Audit Log

Every rollback must record:

``` text
actor
timestamp
source_id
previous_version
new_version
reason
validation_results
CMS version
knowledge schema version
embedding model
IP/device metadata where appropriate
```

Example:

``` text
26 Sep 2026 16:22

Admin: user_123
Source: Highpeak Residence
From: Knowledge v7
To: Knowledge v6

Reason:
Incorrect project description after publication

Validation:
12/12 passed

Result:
SUCCESS
```

------------------------------------------------------------------------

# 65. Atomic Rollback

Use a database transaction:

``` text
BEGIN TRANSACTION

validate target

current → RETIRED
target → ACTIVE

update active_version_id

create audit event

COMMIT
```

Failure:

``` text
ROLLBACK TRANSACTION
```

The existing active version must remain active.

------------------------------------------------------------------------

# 66. Post-Rollback Health Check

After activation:

``` text
v6 ACTIVE
      ↓
health checks
      ↓
retrieval checks
      ↓
chatbot requests
```

If infrastructure/validation health fails, restore the previous active
version automatically.

Example:

``` text
v7 ACTIVE

↓ rollback

v6 ACTIVE
v7 RETIRED

↓ health failure

v7 ACTIVE
v6 RETIRED
```

Automatic recovery should only respond to objective
infrastructure/validation failures, not subjective judgments about
answer quality.

------------------------------------------------------------------------

# 67. Knowledge Pipeline Failure Behavior

If a new version fails:

``` text
v7 ACTIVE

v8 FAILED
```

The chatbot must continue using v7.

Never:

``` text
v7 → inactive
v8 → failed
```

leaving the system without valid knowledge.

------------------------------------------------------------------------

# 68. Admin Chatbot Dashboard

Dashboard KPIs:

-   Conversations
-   Leads generated
-   Human handoffs
-   Unanswered questions
-   Knowledge sources
-   Indexing failures
-   Active knowledge versions

Conversation table:

-   Date
-   Conversation ID
-   Intent
-   User request
-   Status
-   Lead
-   Sources used
-   Knowledge version

Conversation detail:

-   Full conversation
-   Intent classification
-   Retrieved sources
-   Knowledge versions
-   Escalation
-   Lead association
-   Request association

------------------------------------------------------------------------

# 69. Chatbot Requests

Route:

``` text
/admin/chatbot/requests
```

Request types:

``` text
Quote
Callback
Site Visit
General Enquiry
Human Handoff
Project Consultation
```

Statuses:

``` text
New
Acknowledged
Assigned
In Progress
Completed
Closed
```

Support configurable priority.

Link each request to:

-   Conversation
-   Lead
-   User
-   Project where applicable

------------------------------------------------------------------------

# 70. Unanswered Questions

Route:

``` text
/admin/chatbot/questions
```

Statuses:

``` text
New
Reviewing
Answered
Ignored
```

Use unanswered questions to identify knowledge gaps.

Editors should be able to convert recurring unanswered questions into:

-   FAQ
-   Service content
-   Project content
-   Journal content

Only approved content should enter production chatbot knowledge.

------------------------------------------------------------------------

# 71. FAQ Management

FAQ entity:

-   Question
-   Answer
-   Category
-   Related service
-   Related project
-   SEO visibility
-   Chatbot visibility
-   Publishing state

FAQs should enter the same knowledge versioning pipeline.

------------------------------------------------------------------------

# 72. Database Entities

Core application entities:

``` text
User
Project
Service
Article
Media
Lead
LeadActivity
ChatConversation
ChatMessage
ChatRequest
KnowledgeSource
KnowledgeVersion
KnowledgeChunk
KnowledgeEvent
FAQ
Notification
AuditLog
SiteSetting
```

Add appropriate indexes for:

-   Slugs
-   Status
-   Published state
-   Updated dates
-   Lead status
-   Conversation status
-   Knowledge source ID
-   Knowledge version ID
-   Active version
-   Vector search

------------------------------------------------------------------------

# 73. Audit Logging

Audit all important admin actions:

-   Login
-   Content creation
-   Content updates
-   Publish
-   Unpublish
-   Delete
-   Restore
-   Media replacement
-   Lead assignment
-   Knowledge reindex
-   Knowledge rollback
-   User role changes
-   Settings changes

Audit logs should be append-only from the normal application interface.

------------------------------------------------------------------------

# 74. Security

Implement:

-   Server-side RBAC
-   Secure authentication
-   CSRF protection where applicable
-   Rate limiting
-   Input validation
-   Output encoding
-   Secure headers
-   MIME validation
-   Secure uploads
-   Environment secrets
-   No API keys in client code
-   Prompt injection defense
-   RAG source validation
-   Webhook signature verification
-   Replay protection
-   Audit logging

Never expose:

-   System prompts
-   API keys
-   Private documents
-   Draft knowledge
-   Internal notes
-   Hidden CMS content
-   Admin-only data

------------------------------------------------------------------------

# 75. RAG Security

Treat retrieved documents as data, not instructions.

A malicious document must not be able to alter the chatbot's system
behavior.

The chatbot should follow the application/system instructions above
retrieved content.

Never allow retrieved text to:

-   Reveal system prompts
-   Reveal API credentials
-   Execute commands
-   Override safety/security policies
-   Expose private records

------------------------------------------------------------------------

# 76. Performance

Target:

``` text
Lighthouse Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Optimize:

-   Images
-   Fonts
-   JavaScript
-   Third-party scripts
-   Caching
-   Server rendering
-   Database queries
-   Vector retrieval

Use responsive image delivery.

------------------------------------------------------------------------

# 77. Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

-   Keyboard navigation
-   Visible focus states
-   Semantic HTML
-   Accessible forms
-   Proper labels
-   Screen-reader support
-   Color contrast
-   Reduced motion
-   Accessible dialogs
-   Accessible navigation
-   Minimum touch targets
-   Error messaging

------------------------------------------------------------------------

# 78. Empty, Loading and Error States

Every admin and public interactive feature must have:

-   Loading state
-   Empty state
-   Error state
-   Retry action where appropriate

Examples:

``` text
No projects published yet.
```

not:

``` text
0 Projects
```

unless the context is clearly analytical.

------------------------------------------------------------------------

# 79. Deployment Architecture

Recommended:

``` text
GitHub
   ↓
Vercel
   ↓
Next.js + Payload
   ↓
PostgreSQL
   ↓
pgvector

Cloudflare
   ↓
DNS / WAF / CDN

Cloudflare R2
   ↓
Media

OpenAI
   ↓
Embeddings / Chat

Transactional Email
   ↓
Lead notifications
```

------------------------------------------------------------------------

# 80. Caching and Publishing

When content is published:

1.  Validate
2.  Save
3.  Invalidate relevant Next.js cache
4.  Update public page
5.  Send knowledge webhook
6.  Queue knowledge indexing
7.  Validate knowledge
8.  Activate new knowledge version

If knowledge indexing fails, website publication must not fail.

The website and chatbot knowledge pipelines should be independently
recoverable.

------------------------------------------------------------------------

# 81. Preview

Editors need preview for:

-   Projects
-   Services
-   Journal
-   Homepage changes where supported

Preview should allow:

-   Draft view
-   Mobile preview
-   Desktop preview
-   Actual typography/layout
-   Actual imagery

Do not expose draft preview publicly without secure authorization.

------------------------------------------------------------------------

# 82. CMS Publishing Rules

Important distinction:

``` text
SAVE DRAFT
```

does not mean:

``` text
PUBLISH
```

and:

``` text
PUBLISH
```

does not immediately mean:

``` text
CHATBOT READY
```

Instead:

``` text
CMS PUBLISH
     ↓
Public website update
     ↓
Knowledge pipeline
     ↓
Validation
     ↓
Knowledge ACTIVE
```

The old knowledge remains active until the new knowledge is fully
validated.

------------------------------------------------------------------------

# 83. Content Versioning

Maintain independent but linked versions:

``` text
CMS version
Knowledge version
```

Example:

``` text
Project CMS v12
     ↓
Knowledge v8
```

Historical chatbot messages retain the knowledge version used.

This enables exact auditing.

------------------------------------------------------------------------

# 84. Rollback User Experience

The rollback page should answer four questions immediately:

### What is active now?

``` text
Knowledge v7
```

### What am I restoring?

``` text
Knowledge v6
```

### Why is it safe?

``` text
12/12 validation checks passed
```

### What will happen?

``` text
v6 becomes active
v7 remains retained
chatbot starts retrieving v6
audit event is created
```

The administrator should never have to infer these facts.

------------------------------------------------------------------------

# 85. Recommended Rollback Status UI

Use clear visual statuses:

``` text
ACTIVE       Current production version
VALID        Safe but not active
OUTDATED     Based on older CMS content
INCOMPATIBLE Cannot be activated
INVALID      Integrity/validation failure
FAILED       Pipeline failure
RETIRED      Previously active
BLOCKED      Explicitly prohibited
```

Avoid vague statuses such as:

``` text
Old
Bad
Inactive
```

------------------------------------------------------------------------

# 86. Project Chatbot Synchronization Indicator

Within the Project editor:

``` text
CHATBOT KNOWLEDGE

● Synchronized

CMS version: 12
Knowledge version: 8
Last indexed: 26 Sep 2026 15:42
Chunks: 18
Embedding: text-embedding-3-small

[View Knowledge]
```

During indexing:

``` text
⟳ Updating chatbot knowledge...

CMS version: 13
Knowledge: indexing
```

Failure:

``` text
⚠ Knowledge update failed

The previous knowledge version remains active.

[View Error] [Retry]
```

------------------------------------------------------------------------

# 87. Notifications

Notify administrators when:

-   Knowledge indexing fails
-   Embedding jobs fail
-   Webhook signature fails repeatedly
-   Rollback occurs
-   Source becomes invalid
-   Content has been unpublished while an active knowledge version
    exists
-   Queue backlog exceeds threshold
-   Retrieval validation fails

Do not spam notifications for transient failures.

Use aggregation/debounce where appropriate.

------------------------------------------------------------------------

# 88. Editorial Safeguards

Prevent accidental publishing by validating:

### Project

-   Title
-   Hero image
-   Description
-   Category
-   Slug
-   Required metadata

### Journal

-   Title
-   Body
-   Cover image
-   Slug
-   Author
-   SEO

### Service

-   Name
-   Description
-   Required content
-   SEO

Only enforce fields that Highpeak actually requires.

Do not fabricate placeholder content.

------------------------------------------------------------------------

# 89. Content Governance

Highpeak should be able to distinguish:

``` text
Internal
Public
Chatbot-visible
Website-visible
Archived
Confidential
```

A document being uploaded to the CMS must not automatically make it
chatbot-visible.

Explicit visibility controls are required.

------------------------------------------------------------------------

# 90. Recommended Admin Navigation

``` text
HIGHPEAK ADMIN

Dashboard

Content
  Projects
  Services
  Journal
  Media

Enquiries
  Leads
  Requests

Chatbot
  Conversations
  Requests
  Knowledge
  FAQs
  Unanswered Questions

Analytics

System
  Users
  Audit Log
  Settings
```

------------------------------------------------------------------------

# 91. Non-Technical Editor Principles

The editor interface must:

-   Use plain language
-   Hide technical implementation details
-   Group related fields
-   Explain required fields
-   Preview results
-   Warn before destructive actions
-   Clearly distinguish draft/published state
-   Clearly show chatbot synchronization
-   Make approval status obvious
-   Provide undo/restore where safe

Avoid exposing terms such as:

-   Vector
-   Embedding
-   Chunk
-   RAG
-   Hash
-   Webhook
-   Queue

unless the user is an administrator looking at technical diagnostics.

For editors, use:

> Chatbot knowledge

instead of:

> Vector index.

------------------------------------------------------------------------

# 92. Technical Admin Diagnostics

Super Admins can optionally see:

``` text
Knowledge version
Chunk count
Embedding model
Embedding dimensions
Content hash
Webhook event
Queue job ID
Pipeline duration
Validation result
Error logs
```

Keep this hidden from ordinary editors.

------------------------------------------------------------------------

# 93. Acceptance Criteria

The system is not complete until:

## Public website

-   Responsive
-   Accessible
-   Fast
-   SEO-ready
-   Architecture-led
-   No fabricated content

## CMS

-   Editors can create/edit projects
-   Editors can manage galleries
-   Editors can create journal posts
-   Editors can edit SEO
-   Editors can preview
-   Approval workflow works
-   Scheduled publishing works where configured

## Admin

-   Leads manageable
-   Chatbot conversations visible
-   Requests manageable
-   Knowledge sources visible
-   Unanswered questions manageable
-   Audit logs available
-   RBAC enforced

## Chatbot

-   Uses verified Highpeak content
-   Refuses to invent facts
-   Captures enquiries
-   Escalates appropriately
-   Shows source traceability
-   Protects private content

## Knowledge

-   Publish triggers webhook
-   Webhook is authenticated
-   Queue processes asynchronously
-   Content is normalized
-   Semantic chunks are created
-   Embeddings generated
-   Index validated
-   Versions stored
-   Atomic activation implemented
-   Failed versions cannot replace valid versions

## Rollback

-   Version history available
-   Compare view available
-   Source status checked
-   Content hash checked
-   Chunk integrity checked
-   Embedding compatibility checked
-   Schema compatibility checked
-   Superseded CMS content identified
-   Withdrawn content blocked
-   Retrieval smoke test performed
-   Permissions enforced
-   Reason required
-   Audit record created
-   Activation atomic
-   Previous version retained
-   Recovery path available

------------------------------------------------------------------------

# 94. Recommended Implementation Order

Build in this order:

``` text
1. Next.js foundation
2. Design system
3. Public page architecture
4. Payload CMS
5. PostgreSQL
6. Project content model
7. Media model + R2
8. Services
9. Journal
10. SEO
11. Editorial workflow
12. Admin dashboard
13. Leads
14. Chatbot UI
15. Chatbot API
16. Knowledge models
17. RAG retrieval
18. CMS webhook
19. Queue/worker
20. Chunking
21. Embeddings
22. Knowledge validation
23. Atomic activation
24. Version history
25. Rollback
26. Audit logging
27. Analytics
28. Security hardening
29. Performance optimization
30. Accessibility audit
31. Production deployment
```

------------------------------------------------------------------------

# 95. Final Architecture

The complete system should operate as:

``` text
                           HIGHPEAK
                              |
             +----------------+----------------+
             |                                 |
             ↓                                 ↓
        PUBLIC WEBSITE                    ADMIN PLATFORM
           Next.js                           Payload
             |                                 |
     +-------+--------+              +---------+----------+
     |       |        |              |         |          |
 Projects Services Journal        Content    Leads     Chatbot
     |       |        |              |                    |
     +-------+--------+              |                    |
             |                       |                    |
             +-----------------------+--------------------+
                                     |
                                PostgreSQL
                                     |
                              +------+------+
                              |             |
                              ↓             ↓
                           pgvector        Audit
                              |
                              ↓
                         RAG Retrieval
                              |
                              ↓
                           Chatbot
                              |
                              ↓
                       Human Handoff
```

Publishing:

``` text
Editor
  ↓
Draft
  ↓
Review
  ↓
Approval
  ↓
Publish
  ↓
Payload Webhook
  ↓
Queue
  ↓
Normalize
  ↓
Hash
  ↓
Chunk
  ↓
Embed
  ↓
Validate
  ↓
READY
  ↓
Atomic Activation
  ↓
Chatbot uses new knowledge
```

Rollback:

``` text
Admin
  ↓
Version History
  ↓
Select version
  ↓
Validate
  ├── Source still published?
  ├── Chatbot visible?
  ├── Hash valid?
  ├── Chunks complete?
  ├── Embeddings valid?
  ├── Model compatible?
  ├── Schema compatible?
  ├── Not withdrawn?
  ├── CMS version acceptable?
  └── Retrieval test passes?
          ↓
      Confirmation
          ↓
       Audit Log
          ↓
    Atomic Activation
          ↓
       Health Check
          ↓
      Chatbot serves
      selected version
```

------------------------------------------------------------------------

# 96. Core Product Principle

The most important principle for the entire platform is:

> **The CMS is the source of truth. The chatbot is a controlled consumer
> of approved content.**

Publishing content should trigger a controlled knowledge deployment
pipeline.

Knowledge should be:

-   Versioned
-   Validated
-   Traceable
-   Reversible
-   Auditable
-   Permission-controlled

A failed update must never destroy the last known-good knowledge state.

A rollback must never silently resurrect content that Highpeak has
unpublished, withdrawn, restricted or made incompatible.

The public website should present Highpeak professionally, while the
admin system should make content management simple enough for
non-technical editors and powerful enough for administrators and
developers.

This specification should be treated as the source-of-truth
implementation brief for the Highpeak Consultants Ltd platform.
