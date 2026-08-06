import { Truck } from 'lucide-react'

import {
  ASTRO_MEDICAL_SHIPPING_LEAD_TEXT,
  ASTRO_MEDICAL_SHIPPING_PILL_TEXT,
} from '../../lib/astroMedicalShopCopy'

type Props = {
  /** `pill` = card griglia; `banner` = avviso esteso. */
  variant?: 'pill' | 'banner'
  className?: string
}

/** Badge tempi di consegna 5 gg lavorativi — Astro Medical Shop. */
export function AstroMedicalDeliveryBadge({ variant = 'pill', className }: Props) {
  if (variant === 'banner') {
    return (
      <p
        role="note"
        className={[
          'flex items-start gap-2 rounded-xl border border-amber-200/90 bg-amber-50 px-3.5 py-2.5 text-sm leading-snug text-amber-950',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Truck className="mt-0.5 size-4 shrink-0 text-amber-800" aria-hidden />
        <span>
          <span className="font-semibold">🚚 Tempi di Spedizione:</span>{' '}
          {ASTRO_MEDICAL_SHIPPING_LEAD_TEXT}
        </span>
      </p>
    )
  }

  return (
    <span
      className={[
        'inline-flex max-w-full items-center gap-1 rounded-full border border-medical-200 bg-medical-50 px-2 py-0.5 text-[10px] font-semibold leading-tight text-medical-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={ASTRO_MEDICAL_SHIPPING_LEAD_TEXT}
    >
      <Truck className="size-3 shrink-0" aria-hidden />
      {ASTRO_MEDICAL_SHIPPING_PILL_TEXT}
    </span>
  )
}
