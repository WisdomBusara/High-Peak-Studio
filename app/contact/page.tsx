'use client'

import { FormEvent, useState } from 'react'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
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
                  <h3 className="font-serif text-2xl font-bold">Thank You</h3>
                  <p className="text-muted">
                    We've received your message and will get back to you soon. We appreciate your interest in Highpeak.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
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
                        className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text"
                    >
                      <option>Select a project type</option>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Institutional</option>
                      <option>Hospitality</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-text resize-none"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="w-4 h-4"
                    />
                    <label htmlFor="consent" className="ml-2 text-sm text-muted">
                      I consent to being contacted about this inquiry
                    </label>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
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
