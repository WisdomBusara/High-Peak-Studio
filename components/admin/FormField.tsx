import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  help?: string
}

export function FormField({
  label,
  required,
  error,
  children,
  help,
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {help && <p className="text-muted text-sm mt-1">{help}</p>}
    </div>
  )
}
