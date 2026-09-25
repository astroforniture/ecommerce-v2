import { cn } from '../../lib/utils'
import {
  formatEuroIt,
  priceWithVat,
  resolveVatRate,
  vatPercentLabel,
} from '../../lib/vatPricing'

export type ProductPriceDisplayProps = {
  /** Prezzo imponibile (IVA esclusa). */
  imponibile: number
  /** Aliquota IVA (0.22 / 22 / 0.04 / 4 / 0.1 / 10...). Default 22%. */
  vatRate?: number | string | null
  /** Prezzo listino imponibile da barrare (promo). */
  compareAtImponibile?: number | null
  /** card griglie, compact mini-card, detail PDP, inline una riga. */
  size?: 'card' | 'compact' | 'detail' | 'inline'
  /** Es. "/ pezzo". */
  unitSuffix?: string
  /** Evidenzia in rosso se in promo. */
  promo?: boolean
  className?: string
  /** Mostra anche la % IVA nel dettaglio imponibile. */
  showVatPercent?: boolean
}

/**
 * Prezzo in evidenza IVA inclusa + riga imponibile.
 * Es.: "29,28 € (IVA inclusa)" / "24,00 € + IVA"
 */
export function ProductPriceDisplay({
  imponibile,
  vatRate,
  compareAtImponibile = null,
  size = 'card',
  unitSuffix,
  promo = false,
  className,
  showVatPercent = false,
}: ProductPriceDisplayProps) {
  const rate = resolveVatRate(vatRate)
  const gross = priceWithVat(imponibile, rate)
  const showCompare =
    typeof compareAtImponibile === 'number' &&
    Number.isFinite(compareAtImponibile) &&
    compareAtImponibile > imponibile
  const compareGross = showCompare ? priceWithVat(compareAtImponibile, rate) : null
  const percent = vatPercentLabel(rate)
  const netLabel = showVatPercent
    ? `${formatEuroIt(imponibile)} + IVA (${percent}%)`
    : `${formatEuroIt(imponibile)} + IVA`

  const grossCls =
    size === 'detail'
      ? 'text-lg font-semibold tabular-nums'
      : size === 'compact'
        ? 'text-xs font-bold tabular-nums sm:text-sm'
        : size === 'inline'
          ? 'text-sm font-bold tabular-nums'
          : 'text-base font-bold tabular-nums sm:text-lg'

  const netCls =
    size === 'detail'
      ? 'mt-0.5 text-sm tabular-nums text-slate-600'
      : size === 'compact'
        ? 'mt-0.5 text-[10px] font-medium tabular-nums text-slate-500'
        : size === 'inline'
          ? 'text-xs tabular-nums text-slate-500'
          : 'mt-0.5 text-xs font-medium tabular-nums text-slate-500 sm:text-sm'

  const colorCls = promo || showCompare ? 'text-red-600' : 'text-brand-800'

  if (size === 'inline') {
    return (
      <span className={cn('inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5', className)}>
        <span className={cn(grossCls, colorCls)}>
          {formatEuroIt(gross)}{' '}
          <span className="text-[0.85em] font-medium text-slate-500">(IVA inclusa)</span>
        </span>
        <span className={netCls}>{netLabel}</span>
        {unitSuffix ? <span className="text-xs text-slate-500">{unitSuffix}</span> : null}
      </span>
    )
  }

  return (
    <div className={cn(className)}>
      {showCompare && compareGross != null ? (
        <p className="text-[10px] font-medium tabular-nums text-slate-400 line-through sm:text-xs">
          {formatEuroIt(compareGross)} (IVA inclusa)
        </p>
      ) : null}
      <p className={cn(grossCls, colorCls)}>
        {formatEuroIt(gross)}{' '}
        <span
          className={cn(
            'font-medium text-slate-500',
            size === 'compact' ? 'text-[10px]' : 'text-[0.85em]',
          )}
        >
          (IVA inclusa)
        </span>
        {unitSuffix && size === 'detail' ? (
          <span className="ml-1 text-base font-normal text-slate-600">{unitSuffix}</span>
        ) : null}
      </p>
      <p className={netCls}>{netLabel}</p>
    </div>
  )
}