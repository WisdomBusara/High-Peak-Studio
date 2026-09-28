import { getPayload } from 'payload'
import config from '@/src/payload'

interface ChatRequest {
  message: string
  conversationId?: string
}

// Simple intent classification
function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
    return 'project_search'
  }
  if (lowerMessage.includes('service') || lowerMessage.includes('help') || lowerMessage.includes('can you')) {
    return 'service_question'
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('quote') || lowerMessage.includes('price')) {
    return 'contact_request'
  }
  if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
    return 'project_detail'
  }
  if (lowerMessage.includes('about') || lowerMessage.includes('team') || lowerMessage.includes('company')) {
    return 'company_question'
  }

  return 'general_question'
}

// Simple response generation (placeholder for LLM integration)
async function generateResponse(message: string, intent: string) {
  const payload = await getPayload({ config })

  // For MVP, return templated responses based on intent
  const responses: Record<string, string> = {
    project_search:
      'I can help you find our projects! We have completed work in residential, commercial, institutional, and hospitality sectors. Would you like to see projects in a specific category?',
    service_question:
      'We offer a range of services including architectural design, urban planning, sustainability consulting, and project management. Which service interests you?',
    contact_request:
      "I'd be happy to help connect you with our team. Please provide your contact information and project details, and someone will get back to you soon.",
    company_question:
      "Highpeak Consultants is a contemporary architecture and consultancy practice based in Nairobi. We specialize in innovative, sustainable design. Would you like to learn more about our approach?",
    general_question:
      "Thanks for your question! For more detailed information, I'd recommend reaching out to our team directly. Would you like me to collect your contact information?",
  }

  return responses[intent] || responses.general_question
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest

    if (!body.message || typeof body.message !== 'string') {
      return Response.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    const message = body.message.trim()

    if (message.length === 0) {
      return Response.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    // Classify intent
    const intent = classifyIntent(message)

    // Generate response
    const assistantMessage = await generateResponse(message, intent)

    // Store conversation (optional - for analytics)
    try {
      const payload = await getPayload({ config })

      await payload.create({
        collection: 'chat-conversations',
        data: {
          messages: [
            {
              role: 'user',
              content: message,
              intent,
              timestamp: new Date(),
            },
            {
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date(),
            },
          ],
          status: 'active',
          intent,
        },
      })
    } catch (dbError) {
      console.error('Error storing conversation:', dbError)
      // Continue even if storage fails
    }

    return Response.json({
      message: assistantMessage,
      intent,
      sources: [],
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return Response.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
