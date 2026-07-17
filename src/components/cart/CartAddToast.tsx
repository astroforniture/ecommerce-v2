import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useCartDrawer } from '../../context/CartDrawerContext'
import {
  cartMerchandiseBreakdown,
  FREE_SHIPPING_THRESHOLD_IVATO,
  roundMoney2,
} from '../../lib/cartMerchandiseIvato'
import { FreeShippingProgressBar } from './FreeShippingProgressBar'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

/** Toast in basso a destra quando il drawer è chiuso ma è appena stato aggiunto un prodotto. */
export function CartAddToast() {
  const { lastAddedPreview, items, clearLastAddedPreview } = useCart()
  const { isOpen } = useCartDrawer()

  const merchandiseIvato = useMemo(() => cartMerchandiseBreakdown(items).merchandiseIvato, [items])
  const hasFreeShipping = merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO
  const amountRemaining = roundMoney2(
    Math.max(0, FREE_SHIPPING_THRESHOLD_IVATO - merchandiseIvato),
  )

  const visible = Boolean(lastAddedPreview) && !isOpen

  useEffect(() => {
    if (!visible) return
    const id = window.setTimeout(() => clearLastAddedPreview(), 5500)
    return () => window.clearTimeout(id)
  }, [visible, clearLastAddedPreview, lastAddedPreview])

  if (!visible) return null

  const headline = hasFreeShipping
    ? 'Prodotto aggiunto! Hai sbloccato la Spedizione Gratuita!'
    : `Prodotto aggiunto! Ti mancano solo ${eur.format(amountRemaining)} per la spedizione gratuita.`

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[190] w-[min(22rem,calc(100vw-2rem))]"
      role="status"
      aria-live="polite"
    >
      <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15">
        <button
          type="button"
          onClick={() => clearLastAddedPreview()}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Chiudi notifica"
        >
          <X className="size-4" aria-hidden />
        </button>
        <p className="pr-8 text-sm font-semibold leading-snug text-slate-900">{headline}</p>
        <div className="mt-3">
          <FreeShippingProgressBar merchandiseIvato={merchandiseIvato} compact />
        </div>
      </div>
    </div>,
    document.body,
  )
}
