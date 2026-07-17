import { productQuoteRequestHref } from '../../lib/productQuoteRequest'

type ProductQuoteRequestButtonProps = {
  productName: string
  className?: string
  compact?: boolean
}

export function ProductQuoteRequestButton({
  productName,
  className = '',
  compact = false,
}: ProductQuoteRequestButtonProps) {
  const href = productQuoteRequestHref(productName)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center justify-center rounded-lg bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2',
        compact ? 'gap-1.5 px-3 py-2 text-xs' : 'w-full gap-2 px-5 py-3 text-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Richiedi preventivo
    </a>
  )
}
