import { useEffect, useMemo, useState } from 'react'
import { FREE_SHIPPING_THRESHOLD_IVATO, roundMoney2 } from '../../lib/cartMerchandiseIvato'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const BAR_TRANSITION = 'width 650ms cubic-bezier(0.22, 1, 0.36, 1)'

type FreeShippingProgressBarProps = {
  /** Totale merce IVA inclusa (senza spedizione). */
  merchandiseIvato: number
  className?: string
  /** Testo più piccolo per popover header. */
  compact?: boolean
}

export function FreeShippingProgressBar({
  merchandiseIvato,
  className = '',
  compact = false,
}: FreeShippingProgressBarProps) {
  const hasFreeShipping = merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO

  const progressTargetPct = useMemo(() => {
    const raw = (merchandiseIvato / FREE_SHIPPING_THRESHOLD_IVATO) * 100
    return Math.min(100, Math.max(0, raw))
  }, [merchandiseIvato])

  const amountRemaining = roundMoney2(
    Math.max(0, FREE_SHIPPING_THRESHOLD_IVATO - merchandiseIvato),
  )

  const [barFillPct, setBarFillPct] = useState(0)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setBarFillPct(progressTargetPct))
    })
    return () => window.cancelAnimationFrame(id)
  }, [progressTargetPct])

  const message = hasFreeShipping ? (
    <p
      className={`text-center font-semibold leading-snug text-emerald-800 transition-colors duration-500 ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      🎉 Complimenti! Hai sbloccato la Spedizione Gratuita!
    </p>
  ) : (
    <p
      className={`text-center leading-snug text-slate-600 transition-colors duration-500 ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      Ti mancano solo{' '}
      <span className="font-semibold tabular-nums text-slate-900">
        {eur.format(amountRemaining)}
      </span>{' '}
      per ottenere la Spedizione Gratuita!
    </p>
  )

  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-3.5 ${className}`}
      aria-live="polite"
    >
      {message}
      <div
        className={`overflow-hidden rounded-full bg-slate-200 ${compact ? 'mt-2 h-2' : 'mt-3 h-2.5'}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(barFillPct)}
        aria-label="Avanzamento verso spedizione gratuita"
      >
        <div
          className={`h-full rounded-full will-change-[width] transition-[background-color] duration-500 ${
            hasFreeShipping
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-r from-brand-500 to-brand-700'
          }`}
          style={{
            width: `${barFillPct}%`,
            transition: `${BAR_TRANSITION}, background-color 500ms ease`,
          }}
        />
      </div>
      {!compact ? (
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Soglia {eur.format(FREE_SHIPPING_THRESHOLD_IVATO)} di merce · attuale{' '}
          <span className="font-medium tabular-nums text-slate-500">
            {eur.format(merchandiseIvato)}
          </span>
        </p>
      ) : null}
    </div>
  )
}
