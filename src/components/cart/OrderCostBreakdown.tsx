import { useMemo } from 'react'
import {
  orderCostBreakdown,
  type DeliveryMethod,
} from '../../lib/cartShipping'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type OrderCostBreakdownProps = {
  merchandiseIvato: number
  deliveryMethod?: DeliveryMethod
  className?: string
  compact?: boolean
  /** Tipografia e spaziatura più evidenti (sidebar checkout). */
  prominent?: boolean
}

export function OrderCostBreakdown({
  merchandiseIvato,
  deliveryMethod = 'shipping',
  className = '',
  compact = false,
  prominent = false,
}: OrderCostBreakdownProps) {
  const breakdown = useMemo(
    () => orderCostBreakdown(merchandiseIvato, deliveryMethod),
    [deliveryMethod, merchandiseIvato],
  )

  const rowClass = compact ? 'text-xs' : prominent ? 'text-[15px]' : 'text-sm'
  const labelClass = `${rowClass} text-slate-600`
  const valueClass = `${rowClass} shrink-0 text-right font-semibold tabular-nums text-slate-900`
  const totalLabelClass = compact
    ? 'text-sm font-bold text-slate-900'
    : prominent
      ? 'text-lg font-bold text-brand-900'
      : 'text-base font-bold text-brand-900'
  const totalValueClass = compact
    ? 'text-sm font-bold tabular-nums text-slate-900'
    : prominent
      ? 'text-2xl font-bold tabular-nums text-brand-900'
      : 'text-lg font-bold tabular-nums text-brand-900'
  const gapClass = prominent ? 'space-y-3' : 'space-y-2'
  const totalPad = prominent ? 'mt-2 pt-4' : compact ? 'pt-2.5' : 'mt-1 pt-3'

  return (
    <dl className={`${gapClass} ${className}`} aria-label="Riepilogo costi">
      <div className="flex items-baseline justify-between gap-4">
        <dt className={labelClass}>Totale imponibile</dt>
        <dd className={valueClass}>{eur.format(breakdown.taxableTotal)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className={labelClass}>IVA (22%)</dt>
        <dd className={valueClass}>{eur.format(breakdown.vatAmount)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className={labelClass}>Spedizione</dt>
        <dd
          className={`${rowClass} shrink-0 text-right font-semibold tabular-nums ${
            breakdown.shippingFee === 0 ? 'text-emerald-600' : 'text-slate-900'
          }`}
        >
          {breakdown.shippingFee === 0 ? 'Gratis' : eur.format(breakdown.shippingFee)}
        </dd>
      </div>
      <div className={`flex items-baseline justify-between gap-4 border-t border-slate-200 ${totalPad}`}>
        <dt className={totalLabelClass}>Totale da pagare</dt>
        <dd className={totalValueClass}>{eur.format(breakdown.totalDue)}</dd>
      </div>
    </dl>
  )
}
