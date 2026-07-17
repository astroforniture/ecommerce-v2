import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ShoppingCart, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { cartMerchandiseBreakdown } from '../../lib/cartMerchandiseIvato'
import { FreeShippingProgressBar } from '../cart/FreeShippingProgressBar'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const POPOVER_AUTO_CLOSE_MS = 3800

const btnClass =
  'relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand-200/80 text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800'

export function CartHeaderButton({ badge }: { badge: number }) {
  const { items, lastAddedPreview, clearLastAddedPreview } = useCart()
  const merchandiseIvato = useMemo(() => cartMerchandiseBreakdown(items).merchandiseIvato, [items])

  useEffect(() => {
    if (!lastAddedPreview) return
    const id = window.setTimeout(() => clearLastAddedPreview(), POPOVER_AUTO_CLOSE_MS)
    return () => window.clearTimeout(id)
  }, [lastAddedPreview, clearLastAddedPreview])

  const badgeNode =
    typeof badge === 'number' && badge > 0 ? (
      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
        {badge > 9 ? '9+' : badge}
      </span>
    ) : null

  return (
    <div className="relative">
      <Link to="/cart" className={btnClass} aria-label="Carrello">
        <ShoppingCart className="size-5" aria-hidden />
        {badgeNode}
      </Link>
      {lastAddedPreview ? (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-[70] w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-2 shadow-xl shadow-slate-900/15"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={() => clearLastAddedPreview()}
            className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Chiudi notifica"
          >
            <X className="size-4" aria-hidden />
          </button>
          <div className="flex gap-3 pr-7 pt-1">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-brand-50/40">
              {lastAddedPreview.imageUrl ? (
                <img
                  src={lastAddedPreview.imageUrl}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-brand-200">
                  <FileText className="size-6" strokeWidth={1.25} aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                {lastAddedPreview.name}
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums text-brand-800">
                {eur.format(lastAddedPreview.rowIvato)}{' '}
                <span className="text-xs font-semibold text-slate-500">IVA incl.</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Aggiunto al carrello</p>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 px-1 pb-1 pt-2.5 pr-7">
            <FreeShippingProgressBar merchandiseIvato={merchandiseIvato} compact />
          </div>
        </div>
      ) : null}
    </div>
  )
}
