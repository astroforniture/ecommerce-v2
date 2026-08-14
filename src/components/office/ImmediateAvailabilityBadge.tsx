import { CheckCircle2 } from 'lucide-react'

import { IMMEDIATE_AVAILABILITY_LABEL } from '../../lib/agendeCatalog'

type Props = {
  /** `pill` = card griglia; `banner` = avviso esteso in scheda prodotto. */
  variant?: 'pill' | 'banner'
  className?: string
}

/** Badge giacenza in pronta consegna — stesso schema visivo del badge tempi Astro Medical. */
export function ImmediateAvailabilityBadge({ variant = 'pill', className }: Props) {
  if (variant === 'banner') {
    return (
      <p
        role="status"
        className={[
          'flex items-start gap-2 rounded-xl border border-emerald-200/90 bg-emerald-50 px-3.5 py-2.5 text-sm leading-snug text-emerald-950',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden />
        <span>
          <span className="font-semibold">{IMMEDIATE_AVAILABILITY_LABEL}</span>
          {' — '}
          merce in pronta consegna dal magazzino.
        </span>
      </p>
    )
  }

  return (
    <span
      className={[
        'inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold leading-tight text-emerald-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={IMMEDIATE_AVAILABILITY_LABEL}
    >
      <CheckCircle2 className="size-3 shrink-0" aria-hidden />
      {IMMEDIATE_AVAILABILITY_LABEL}
    </span>
  )
}
