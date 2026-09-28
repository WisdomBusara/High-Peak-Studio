'use client'

import { FormEvent, useState } from 'react'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  location: string
  budgetRange: string
  timeline: string
  message: string
  consent: boolean
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    location: '',
    budgetRange: '',
    timeline: '',
    message: '',
    consent: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          projectType: formData.projectType || undefined,
          location: formData.location || undefined,
          budgetRange: formData.budgetRange || undefined,
          timeline: formData.timeline || undefined,
          message: formData.message,
          source: 'contact-form',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        location: '',
        budgetRange: '',
        timeline: '',
        message: '',
        consent: false,
      })
    } catch (err) {
      setError('Failed to submit form. Please try again or contact us directly.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Get In Touch"
        subtitle="Contact"
        minHeight="tall"
        description="We'd love to hear about your project or vision"
      />

      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold mb-2">Email</h3>
                <a href="mailto:hello@highpeak.co.ke" className="text-muted hover:text-text transition-colors">
                  hello@highpeak.co.ke
                </a>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-2">Location</h3>
                <p className="text-muted">
                  Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="space-y-4 p-8 bg-surface border border-border">
                  <h3 className="font-serif text-2xl font-bold">Thank You! 🎉</h3>
                  <p className="text-muted">
                    We've received your message and will get back to you within 24 hours. We appreciate your interest in Highpeak.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-text hover:underline text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      >
                        <option value="">Select a project type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="institutional">Institutional</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-2">
                        Project Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budgetRange" className="block text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <input
                        type="text"
                        id="budgetRange"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        placeholder="e.g., 1-5M KES"
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                        Project Timeline
                      </label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        placeholder="e.g., 6 months"
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      placeholder="Tell us about your project..."
                      className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text resize-none"
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 mt-1"
                    />
                    <label htmlFor="consent" className="ml-2 text-sm text-muted">
                      I consent to being contacted about this inquiry and understand my information will be securely stored.
                    </label>
                  </div>

                  <Button type="submit" disabled={isSubmitting || !formData.consent}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
