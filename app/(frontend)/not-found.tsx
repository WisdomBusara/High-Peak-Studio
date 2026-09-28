import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Container className="text-center space-y-6 max-w-2xl">
        <h1 className="font-serif text-8xl font-bold">404</h1>
        <h2 className="font-serif text-4xl font-bold">Page Not Found</h2>
        <p className="text-lg text-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
          <Link href="/projects">
            <Button variant="secondary">View Projects</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
