# Knowledge Pipeline - RAG System

Complete guide to the knowledge management and retrieval system.

## Architecture

```
CMS Publishing
    ↓
Webhook Trigger (/api/knowledge/publish-webhook)
    ↓
Content Normalization (Project/Service/Article/FAQ)
    ↓
Content Hashing (SHA-256)
    ↓
Semantic Chunking (400-800 tokens)
    ↓
Version Creation (versioning system)
    ↓
Embedding Generation (OpenAI - future)
    ↓
Index Validation (12 safeguards)
    ↓
Atomic Activation
    ↓
Chatbot RAG Retrieval
```

## Collections

### KnowledgeSources
Maps CMS content to knowledge system:
- `sourceType` - project, service, article, faq
- `sourceId` - ID in CMS
- `sourceTitle` - Content title
- `sourceUrl` - Public URL
- `published` - Is published
- `chatbotVisible` - Available to chatbot
- `activeVersionId` - Currently active version

### KnowledgeVersions
Immutable content versions:
- `versionNumber` - Sequential version
- `contentHash` - SHA-256 of content (change detection)
- `normalizedContent` - Structured text
- `status` - Current state (15 possible states)
- `chunkCount` - Number of chunks
- `embeddingModel` - Model used
- `activatedAt` / `retiredAt` - Activation timeline

**Status Flow:**
```
RECEIVED → VALIDATING → NORMALIZING → CHUNKING → EMBEDDING 
  → VALIDATING_INDEX → READY → ACTIVE
```

### KnowledgeChunks
Semantic content chunks:
- `knowledgeVersion` - Parent version
- `chunkIndex` - Chunk sequence
- `section` - Semantic section name
- `content` - 400-800 token chunk
- `embedding` - Vector (1536 dimensions)
- `metadata` - Token count, source info

### KnowledgeEvents
Audit trail of all events:
- `eventType` - published, updated, indexing_started, etc
- `sourceId` - What triggered it
- `versionId` - Related version
- `status` - pending, processing, complete, failed
- `error` - Error message if failed

## Normalization

Converts CMS JSON to structured knowledge text.

### Project Example
```
PROJECT: Highpeak Residence

CATEGORY: Residential

LOCATION: Nairobi, Kenya

YEAR: 2024

STATUS: Completed

DESCRIPTION: A contemporary residential project...

MATERIALS: Steel, Glass, Concrete

SOURCE: /projects/highpeak-residence
```

### Service Example
```
SERVICE: Architectural Design

DESCRIPTION: Comprehensive architectural design services...

CAPABILITIES: Concept Development, Detailed Design, Specifications

PROCESS: Initial consultation, site analysis, design development...

SOURCE: /services/architectural-design
```

See `src/lib/knowledge/normalization.ts` for all normalizers.

## Chunking

Semantic content division (400-800 tokens per chunk).

```typescript
// Example: 3 chunks with 75-token overlap

Chunk 1 (500 tokens):
[Overview + Design Concept]

Chunk 2 (550 tokens):
[Design Concept (overlap) + Materials + Location]

Chunk 3 (480 tokens):
[Location (overlap) + Project Status + Credits]
```

**Key Features:**
- Semantic preservation (sections stay together)
- Overlap for continuity (75 tokens)
- Token estimation (word count × 1.3)
- Validation checks

See `src/lib/knowledge/chunking.ts` for implementation.

## Content Hashing

SHA-256 hash of normalized content for change detection.

```typescript
// If hash matches previous version, skip re-indexing
currentHash = SHA256(normalizedContent)
if (currentHash === previousHash) {
  return { message: 'No changes, skipping indexing' }
}
```

Benefits:
- Avoid unnecessary embedding work
- Detect actual changes
- Optimize pipeline

See `src/lib/knowledge/hashing.ts`.

## Versioning

**Never** overwrite the active version:

```
v5 ACTIVE (current production)
    ↓ New CMS publish
v6 CREATED
v6 NORMALIZING
v6 CHUNKING
v6 EMBEDDING
v6 VALIDATED → READY
    ↓ Atomic switch
v5 RETIRED
v6 ACTIVE (new production)
```

**Immutable versions** mean you can always rollback.

## Atomic Activation

Transactional version switching:

```sql
BEGIN TRANSACTION

-- Validate new version
SELECT * FROM knowledge_versions WHERE id = v6 FOR UPDATE
IF status != 'ready' THEN ROLLBACK

-- Update references
UPDATE knowledge_sources 
SET active_version_id = v6
WHERE id = source_123

-- Mark old as retired
UPDATE knowledge_versions
SET status = 'retired', retired_at = NOW()
WHERE id = v5

-- Log event
INSERT INTO knowledge_events (event_type, source_id, version_id)
VALUES ('activation_triggered', source_123, v6)

COMMIT
```

**Guarantee:** Either completely switches or rolls back. No partial states.

## Validation Safeguards

12 checks before activation:

1. **Source Exists** - Source record exists in DB
2. **Source Published** - Source.published = true
3. **Chatbot Visible** - Source.chatbotVisible = true
4. **Content Hash Valid** - Hash matches original
5. **Chunk Integrity** - All chunks present
6. **Embeddings Valid** - All vectors present
7. **Schema Compatible** - Version schema matches current
8. **Model Compatible** - Embedding model compatible
9. **Metadata Integrity** - All metadata valid
10. **Retrieval Works** - Test queries retrieve chunks
11. **No Withdrawn Content** - Source not marked withdrawn
12. **CMS Version Ok** - CMS version not superseded

**All 12 must pass** before activation can proceed.

## Rollback

Controlled downgrade to previous version:

```
Current: v7 ACTIVE
User selects: v6 (previous)
    ↓
Validate v6 against 12 safeguards
    ↓
Confirm with reason
    ↓
Atomic switch
    ↓
v7 RETIRED, v6 ACTIVE
    ↓
Health checks
    ↓
If health fails, auto-restore v7 ACTIVE
```

**Never deletes** the previous version.

## API Endpoints

### GET /api/knowledge/sources
List all active knowledge sources.

**Response:**
```json
{
  "docs": [
    {
      "id": "ks_123",
      "sourceType": "project",
      "sourceTitle": "Highpeak Residence",
      "sourceUrl": "/projects/highpeak-residence",
      "activeVersionId": "kv_456"
    }
  ]
}
```

### GET /api/knowledge/versions/:sourceId
Get version history for a source.

**Response:**
```json
{
  "sourceId": "ks_123",
  "versions": [
    {
      "id": "kv_789",
      "versionNumber": 7,
      "status": "active",
      "chunkCount": 18,
      "activatedAt": "2024-09-28T10:00:00Z"
    }
  ]
}
```

### POST /api/knowledge/search
Search knowledge base (vector or keyword).

**Request:**
```json
{
  "query": "What materials were used?",
  "limit": 5,
  "useVector": false
}
```

**Response:**
```json
{
  "results": [
    {
      "content": "Chunk content...",
      "section": "Materials",
      "source": {
        "title": "Highpeak Residence",
        "url": "/projects/highpeak-residence",
        "type": "project"
      },
      "score": 0.85
    }
  ],
  "method": "keyword"
}
```

### POST /api/knowledge/publish-webhook
CMS publishes content → triggers indexing.

**Request from CMS:**
```json
{
  "event_id": "evt_123",
  "event_type": "project.published",
  "document_id": "proj_456",
  "version": 7,
  "timestamp": "2024-09-28T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "versionId": "kv_789",
  "chunkCount": 18
}
```

## Future: LLM Integration

When ready, integrate:

1. **OpenAI Embeddings**
   - Model: text-embedding-3-small (1536 dims)
   - Call during EMBEDDING status
   - Store in knowledge_chunks.embedding

2. **Vector Search**
   - Use pgvector extension
   - Cosine similarity search
   - Replace keyword search

3. **LLM Responses**
   - Use retrieved chunks as context
   - Call ChatGPT with context
   - Citation from source

Code already prepared in:
- `app/api/knowledge/search/route.ts` - Vector search placeholder
- `src/lib/knowledge/chunking.ts` - Token estimation
- Collections ready for embeddings

## Database Schema

```sql
-- Core tables
CREATE TABLE knowledge_sources (
  id TEXT PRIMARY KEY,
  source_type VARCHAR(50),
  source_id TEXT,
  source_title TEXT,
  source_url TEXT,
  published BOOLEAN,
  chatbot_visible BOOLEAN,
  active_version_id TEXT REFERENCES knowledge_versions(id)
)

CREATE TABLE knowledge_versions (
  id TEXT PRIMARY KEY,
  knowledge_source_id TEXT REFERENCES knowledge_sources(id),
  version_number INTEGER,
  content_hash TEXT,
  normalized_content TEXT,
  status VARCHAR(50),
  chunk_count INTEGER,
  embedding_model VARCHAR(100),
  activated_at TIMESTAMP,
  retired_at TIMESTAMP,
  validation_checks JSONB
)

CREATE TABLE knowledge_chunks (
  id TEXT PRIMARY KEY,
  knowledge_version_id TEXT REFERENCES knowledge_versions(id),
  chunk_index INTEGER,
  section TEXT,
  content TEXT,
  embedding VECTOR(1536),  -- pgvector
  metadata JSONB
)

CREATE TABLE knowledge_events (
  id TEXT PRIMARY KEY,
  event_type VARCHAR(100),
  source_id TEXT,
  version_id TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP
)

-- Indexes
CREATE INDEX idx_kv_source ON knowledge_versions(knowledge_source_id)
CREATE INDEX idx_kc_version ON knowledge_chunks(knowledge_version_id)
CREATE INDEX idx_ke_event ON knowledge_events(event_type, created_at)
CREATE INDEX idx_embedding ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
```

## Monitoring

Track knowledge pipeline health:

```
GET /admin/knowledge/health
{
  "activeVersions": 42,
  "totalChunks": 8500,
  "failedVersions": 0,
  "embeddings": {
    "model": "text-embedding-3-small",
    "dimensions": 1536
  },
  "lastIndexed": "2024-09-28T15:30:00Z"
}
```

## Best Practices

1. **Always validate** before activation
2. **Never delete** version history
3. **Test retrieval** with sample queries
4. **Monitor** validation failures
5. **Rollback quickly** if issues found
6. **Keep audit trail** of all changes
7. **Separate** content updates from embedding

## Roadmap

- ✅ Collection definitions
- ✅ Normalization logic
- ✅ Chunking system
- ✅ Version management
- ✅ API routes (keyword search)
- ⏳ OpenAI embeddings integration
- ⏳ Vector search (pgvector)
- ⏳ Admin dashboard for management
- ⏳ Automatic rollback on failures
