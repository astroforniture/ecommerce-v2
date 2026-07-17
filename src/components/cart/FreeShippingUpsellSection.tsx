import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import {
  FREE_SHIPPING_THRESHOLD_IVATO,
  roundMoney2,
} from '../../lib/cartMerchandiseIvato'
import {
  freeShippingUpsellQueryKey,
  pickFreeShippingUpsellProducts,
  pickFreeShippingUpsellProductsSync,
  productUnitIvato,
} from '../../lib/freeShippingUpsellProducts'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import type { OfficeProduct } from '../../types/officeProduct'
import { FreeShippingProgressBar } from './FreeShippingProgressBar'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type FreeShippingUpsellSectionProps = {
  merchandiseIvato: number
  className?: string
  compact?: boolean
  /** Nasconde la barra se già mostrata altrove (solo cross-sell). */
  hideProgressBar?: boolean
}

function UpsellProductCard({
  product,
  onAdd,
}: {
  product: OfficeProduct
  onAdd: (product: OfficeProduct) => void
}) {
  const imageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const unitIvato = productUnitIvato(product, 1)

  return (
    <article className="flex w-[min(100%,11.5rem)] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="flex h-16 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain p-1"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <FileText className="size-7 text-brand-200" strokeWidth={1.25} aria-hidden />
        )}
      </div>
      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-snug text-slate-800">
        {product.name}
      </p>
      <p className="mt-1 text-sm font-bold tabular-nums text-brand-800">
        {eur.format(unitIvato)}
        <span className="ml-1 text-[10px] font-medium text-slate-500">IVA incl.</span>
      </p>
      <button
        type="button"
        onClick={() => onAdd(product)}
        className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1.5 text-xs font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-100"
      >
        <Plus className="size-3.5" aria-hidden />
        Aggiungi
      </button>
    </article>
  )
}

export function FreeShippingUpsellSection({
  merchandiseIvato,
  className = '',
  compact = false,
  hideProgressBar = false,
}: FreeShippingUpsellSectionProps) {
  const { items, addOfficeProduct } = useCart()
  const cartProductIds = useMemo(() => new Set(items.map((item) => item.id)), [items])
  const needsUpsell = merchandiseIvato < FREE_SHIPPING_THRESHOLD_IVATO && items.length > 0
  const upsellLimit = compact ? 3 : 4

  const upsellQuery = useQuery({
    queryKey: freeShippingUpsellQueryKey(merchandiseIvato, [...cartProductIds]),
    queryFn: () => pickFreeShippingUpsellProducts(merchandiseIvato, cartProductIds, upsellLimit),
    enabled: needsUpsell,
    initialData: () =>
      needsUpsell
        ? pickFreeShippingUpsellProductsSync(merchandiseIvato, cartProductIds, upsellLimit)
        : [],
    initialDataUpdatedAt: 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  const suggestions = upsellQuery.data ?? []

  function handleQuickAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section className={className} aria-label="Spedizione gratuita e suggerimenti">
      {!hideProgressBar ? (
        <FreeShippingProgressBar merchandiseIvato={merchandiseIvato} compact={compact} />
      ) : null}

      {needsUpsell ? (
        <div className={hideProgressBar ? '' : 'mt-4'}>
          <h3
            className={`font-semibold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}
          >
            Aggiungi al volo per azzerare la spedizione:
          </h3>

          {suggestions.length > 0 ? (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {suggestions.map((product) => (
                <UpsellProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleQuickAdd}
                />
              ))}
            </div>
          ) : upsellQuery.isPending || upsellQuery.isFetching ? (
            <div className="mt-3 flex gap-3 overflow-hidden">
              {Array.from({ length: upsellLimit }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 w-40 shrink-0 animate-pulse rounded-xl bg-slate-100"
                  aria-hidden
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Esplora il catalogo per aggiungere articoli economici e raggiungere i{' '}
              {eur.format(FREE_SHIPPING_THRESHOLD_IVATO)} di merce.
            </p>
          )}

          {!compact ? (
            <p className="mt-2 text-xs text-slate-500">
              Mancano ancora{' '}
              <span className="font-semibold tabular-nums text-slate-700">
                {eur.format(roundMoney2(FREE_SHIPPING_THRESHOLD_IVATO - merchandiseIvato))}
              </span>{' '}
              di merce (IVA inclusa) per la spedizione gratuita.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
