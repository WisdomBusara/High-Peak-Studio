# Chatbot Core - Implementation Guide

## Overview

The Highpeak chatbot is a website concierge that helps visitors explore projects, learn about services, and submit enquiries. It operates in phases:

1. **Phase 1 (Current)**: Basic chat interface with template responses
2. **Phase 2**: LLM integration with OpenAI API
3. **Phase 3**: RAG system with knowledge base retrieval
4. **Phase 4**: Advanced features (lead qualification, escalation)

## Architecture

```
Frontend (React)
    ↓
Chatbot Component (/components/chatbot)
    ↓
API Route (/api/chatbot/message)
    ↓
Intent Classification
    ↓
Response Generation (currently template-based)
    ↓
Payload CMS (conversation storage)
    ↓
Database (PostgreSQL)
```

## Components

### Chatbot.tsx
Main component - floating chat widget with:
- Open/close toggle button
- Message history display
- Auto-scroll to latest message
- Loading indicator

**Props:**
- `initialMessage?: string` - Welcome message when opened

### ChatMessage.tsx
Displays individual messages with:
- Role-based styling (user vs assistant)
- Source attribution
- Link to related content

**Props:**
- `role: 'user' | 'assistant'`
- `content: string`
- `sources?: Array<{title, url}>`

### ChatInput.tsx
Message input form with:
- Auto-expanding textarea
- Ctrl+Enter to submit
- Disabled state during submission
- Character validation

**Props:**
- `onSubmit: (message: string) => Promise<void>`
- `disabled?: boolean`
- `placeholder?: string`

## API Endpoints

### POST /api/chatbot/message

**Request:**
```json
{
  "message": "Tell me about your projects",
  "conversationId": "optional-id"
}
```

**Response:**
```json
{
  "message": "Assistant response text",
  "intent": "project_search",
  "sources": [
    {
      "title": "Project Name",
      "url": "/projects/slug"
    }
  ]
}
```

**Intent Types:**
- `project_search` - User asking about projects
- `service_question` - Services inquiry
- `contact_request` - Lead/quote request
- `project_detail` - Specific project question
- `company_question` - About Highpeak
- `general_question` - Other

### GET /api/chatbot/health

Returns chatbot operational status:
```json
{
  "status": "ok",
  "chatbot": {
    "status": "operational",
    "features": ["message_handling", "intent_classification", "conversation_storage"]
  }
}
```

## Phase 1: Basic Chatbot (Current)

### Template-Based Responses

Currently uses intent classification + templates:

```typescript
const responses = {
  project_search: "I can help you find our projects! We have...",
  service_question: "We offer a range of services...",
  contact_request: "I'd be happy to help connect you...",
  company_question: "Highpeak Consultants is...",
  general_question: "Thanks for your question!...",
}
```

### Intent Classification

Simple keyword matching:
- "project" / "portfolio" → `project_search`
- "service" / "help" → `service_question`
- "contact" / "quote" → `contact_request`
- "location" / "where" → `project_detail`
- "about" / "team" → `company_question`
- default → `general_question`

### Storage

Conversations stored in Payload CMS collection `chat_conversations`:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "User message",
      "intent": "service_question",
      "timestamp": "2024-09-28T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Assistant response",
      "timestamp": "2024-09-28T10:00:01Z"
    }
  ],
  "status": "active",
  "intent": "service_question"
}
```

## Phase 2: LLM Integration (Upcoming)

Will integrate a free LLM (Ollama, HuggingFace, Replicate, or Together AI).

### Recommended: Ollama (Development)
Free, self-hosted, runs locally:
```typescript
const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'mistral',
    messages: [
      {
        role: 'system',
        content: 'You are Highpeak Consultants assistant...'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
  }),
})
```

### Alternative: Cloud Providers
- **HuggingFace** - Free tier, easy setup
- **Replicate** - Free tier, good quality
- **Together AI** - Free tier, fast, production-ready

See [FREE_LLM_GUIDE.md](FREE_LLM_GUIDE.md) for complete setup instructions.

**Benefits:**
- Natural language understanding
- Context awareness
- Better responses
- Conversation history
- Completely free

## Phase 3: RAG System (Knowledge Base)

Will add Retrieval-Augmented Generation:

```
User Question
    ↓
Embed question (OpenAI embeddings)
    ↓
Search vector database (pgvector)
    ↓
Retrieve relevant knowledge chunks
    ↓
Generate response with context
    ↓
Cite sources
```

**Knowledge Sources:**
- Projects (descriptions, materials, locations)
- Services (capabilities, process)
- Articles (insights, case studies)
- FAQs (common questions)

## Phase 4: Advanced Features (Future)

### Lead Qualification
- Collect project details in conversation
- Create leads automatically
- Route to sales team

### Escalation
- Detect when human help needed
- Create chat request
- Assign to team member
- Notify user

### Analytics
Track:
- User intents
- Conversation paths
- Lead conversion
- Unanswered questions

## Development & Testing

### Local Testing

1. Start server:
```bash
npm run dev
```

2. Visit http://localhost:3000

3. Click chatbot button (bottom-right)

4. Send messages

5. Check browser console for logs

### API Testing

```bash
# Test chatbot message endpoint
curl -X POST http://localhost:3000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your projects"}'

# Check health
curl http://localhost:3000/api/chatbot/health
```

### Database Inspection

View conversations stored:

```bash
psql -U highpeak_user -d highpeak -c "SELECT * FROM chat_conversations LIMIT 5;"
```

## Configuration

### Environment Variables

None required for Phase 1.

For Phase 2 (LLM):
```env
OPENAI_API_KEY=sk-...
```

For Phase 3 (RAG):
```env
OPENAI_API_KEY=sk-...
KNOWLEDGE_MODEL=text-embedding-3-small
```

## Styling

Uses design system colors:
- **User messages**: `bg-text text-background`
- **Assistant messages**: `bg-surface text-text border-border`
- **Buttons**: `bg-text hover:bg-dark`

Respects `prefers-reduced-motion` for animations.

## Accessibility

- Keyboard navigation (Tab, Enter)
- ARIA labels on buttons
- Semantic HTML
- Color contrast WCAG AA
- Focus indicators

## Future Enhancements

### Short Term
- [ ] LLM integration (Phase 2)
- [ ] Knowledge base search (Phase 3)
- [ ] Better intent classification
- [ ] Conversation history persistence

### Medium Term
- [ ] Lead qualification flow
- [ ] Multi-language support
- [ ] Mobile-optimized UI
- [ ] Typing indicators

### Long Term
- [ ] Sentiment analysis
- [ ] Proactive suggestions
- [ ] Integration with CRM
- [ ] Analytics dashboard

## Troubleshooting

### Chatbot Not Appearing

1. Check browser console for errors
2. Verify `Chatbot` component in layout
3. Clear browser cache
4. Restart dev server

### Messages Not Sending

1. Check API endpoint response: `POST /api/chatbot/message`
2. Verify database connection
3. Check browser network tab
4. Review server logs

### Conversations Not Stored

1. Verify Payload CMS is running
2. Check database connection
3. Review collection schema
4. Check for database errors in logs

## API Integration Examples

### React Component Integration

```typescript
import { Chatbot } from '@/components/chatbot/Chatbot'

export default function Page() {
  return (
    <div>
      <h1>Contact us</h1>
      <Chatbot initialMessage="How can we help with your project?" />
    </div>
  )
}
```

### Custom Message Handling

```typescript
const handleSendMessage = async (userMessage: string) => {
  const response = await fetch('/api/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  })

  const data = await response.json()
  console.log('Intent:', data.intent)
  console.log('Sources:', data.sources)
}
```

## Next Steps

1. ✅ Chatbot UI built and integrated
2. ✅ Basic API routes working
3. ✅ Database storage setup
4. → Phase 2: Add OpenAI LLM
5. → Phase 3: Add RAG knowledge base
6. → Phase 4: Lead qualification & escalation
