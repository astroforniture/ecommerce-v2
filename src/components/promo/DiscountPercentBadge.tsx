/** Badge sconto promo (es. "-20%"). */
export function DiscountPercentBadge({
  percent,
  className = '',
}: {
  percent: number
  className?: string
}) {
  if (!Number.isFinite(percent) || percent <= 0) return null
  return (
    <span
      className={[
        'inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Sconto ${percent} percento`}
    >
      -{Math.round(percent)}%
    </span>
  )
}
