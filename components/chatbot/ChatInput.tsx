import { FormEvent, useRef, useState } from 'react'

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = 'Ask about our projects or services...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isSubmitting || disabled) return

    setIsSubmitting(true)

    try {
      await onSubmit(message)
      setMessage('')

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        rows={1}
        className="flex-1 px-3 py-2 border border-border bg-background text-text resize-none focus:outline-none focus:border-text placeholder-muted text-sm"
      />
      <button
        type="submit"
        disabled={disabled || isSubmitting || !message.trim()}
        className="px-4 py-2 bg-text text-background font-medium hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? '...' : 'Send'}
      </button>
    </form>
  )
}
