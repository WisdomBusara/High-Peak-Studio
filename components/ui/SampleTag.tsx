// Marks placeholder facts (press, awards, team) so nobody mistakes them for real ones.
export function SampleTag({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block border border-current px-1.5 py-px align-middle text-[10px] font-medium uppercase leading-4 tracking-[0.2em] text-laterite ${className}`}
      title="Sample content: replaced when Highpeak publishes the real entry in the CMS"
    >
      Sample
    </span>
  )
}
