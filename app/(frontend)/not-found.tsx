import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-end bg-dark text-light">
      <Container className="pb-20 pt-36">
        <p className="eyebrow text-light/60">Error 404</p>
        <h1 className="mt-6 text-6xl leading-[1.02] md:text-8xl">This page doesn&rsquo;t exist.</h1>
        <p className="mt-6 max-w-xl text-lg text-light/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="light">
            Back to home
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline-light">
            View projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
