'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; url?: string }>
}

interface ChatbotProps {
  initialMessage?: string
}

export function Chatbot({ initialMessage }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0 && initialMessage) {
      handleSendMessage(initialMessage)
    }
  }, [isOpen])

  const handleSendMessage = async (userMessage: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: 'temp-session',
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          sources: data.sources,
        },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again or contact us directly.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-text text-background rounded-full hover:bg-dark transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text"
        aria-label="Open chat"
      >
        <svg
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          )}
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-2xl flex flex-col max-h-96 md:max-h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface">
            <h3 className="font-serif text-lg font-bold">Highpeak Assistant</h3>
            <p className="text-sm text-muted">Ask about our projects and services</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-muted text-sm">
                  <p className="font-medium mb-2">Welcome!</p>
                  <p>Ask me about our architecture projects, services, or any questions you have.</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} {...msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface text-text px-4 py-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-text rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-text rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-text rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-surface">
            <ChatInput onSubmit={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      )}
    </>
  )
}
