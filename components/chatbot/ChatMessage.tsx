interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    title: string
    url?: string
  }>
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-text text-background'
            : 'bg-surface text-text border border-border'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {sources && sources.length > 0 && !isUser && (
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted space-y-1">
            <p className="font-medium">Sources:</p>
            {sources.map((source, idx) => (
              <div key={idx}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:underline"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span>{source.title}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
