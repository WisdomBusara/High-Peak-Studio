export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    chatbot: {
      status: 'operational',
      features: [
        'message_handling',
        'intent_classification',
        'conversation_storage',
      ],
    },
  })
}
