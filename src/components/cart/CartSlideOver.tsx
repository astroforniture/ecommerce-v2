import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { FileText, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useCartDrawer } from '../../context/CartDrawerContext'
import { cartMerchandiseBreakdown, roundMoney2 } from '../../lib/cartMerchandiseIvato'
import { lineImponible } from '../../lib/quantityPricing'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import { FreeShippingProgressBar } from './FreeShippingProgressBar'
import { CartDrawerFreeShippingUpsell } from './CartDrawerFreeShippingUpsell'
import { OrderCostBreakdown } from './OrderCostBreakdown'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

export function CartSlideOver() {
  const { isOpen, closeCartDrawer } = useCartDrawer()
  const {
    items,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    lastAddedPreview,
  } = useCart()

  const { merchandiseIvato } = useMemo(() => cartMerchandiseBreakdown(items), [items])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCartDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCartDrawer])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[180] flex justify-end" role="dialog" aria-modal="true" aria-label="Carrello">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
        aria-label="Chiudi carrello"
        onClick={closeCartDrawer}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-brand-700" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900">
              Carrello
              {totalItems > 0 ? (
                <span className="ml-1.5 text-base font-medium text-slate-500">({totalItems})</span>
              ) : null}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Chiudi"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {lastAddedPreview ? (
          <p className="shrink-0 border-b border-brand-100 bg-brand-50/80 px-4 py-2.5 text-center text-sm font-medium text-brand-900">
            Prodotto aggiunto al carrello
          </p>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Il carrello è vuoto.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const rowIvato = roundMoney2(
                  lineImponible(item.price, item.quantityPriceTiers, item.quantity) * 1.22,
                )
                const imageUrl = withOfficeImageCacheBust(
                  item.imageUrl,
                  OFFICE_CATALOG_DATA_REVISION,
                )
                return (
                  <li
                    key={item.lineId}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
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
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-bold tabular-nums text-brand-800">
                        {eur.format(rowIvato)}{' '}
                        <span className="text-xs font-medium text-slate-500">IVA incl.</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.lineId)}
                          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                          aria-label="Riduci quantità"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.lineId)}
                          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                          aria-label="Aumenta quantità"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          className="ml-auto flex size-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                          aria-label="Rimuovi"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <CartDrawerFreeShippingUpsell
            merchandiseIvato={merchandiseIvato}
            className="shrink-0 border-t border-slate-100 bg-white px-4 py-3"
          />
        ) : null}

        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4">
          {items.length > 0 ? (
            <FreeShippingProgressBar
              merchandiseIvato={merchandiseIvato}
              compact
              className="mb-4"
            />
          ) : null}

          <OrderCostBreakdown
            merchandiseIvato={merchandiseIvato}
            deliveryMethod="shipping"
            compact
            className="mb-4"
          />

          <div className="flex flex-col gap-2">
            <Link
              to="/cart"
              onClick={closeCartDrawer}
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Procedi al checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCartDrawer}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Vai al carrello completo
            </Link>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
