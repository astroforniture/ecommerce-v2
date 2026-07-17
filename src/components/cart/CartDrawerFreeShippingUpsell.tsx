import { useMemo } from 'react'
import { FileText, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { FREE_SHIPPING_THRESHOLD_IVATO } from '../../lib/cartMerchandiseIvato'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { getFreeShippingDrawerUpsellProducts } from '../../data/freeShippingDrawerUpsellProducts'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type CartDrawerFreeShippingUpsellProps = {
  merchandiseIvato: number
  className?: string
}

function UpsellRow({
  product,
  onAdd,
}: {
  product: OfficeProduct
  onAdd: (product: OfficeProduct) => void
}) {
  const imageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const unitIvato = productUnitIvato(product, 1)

  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2">
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain p-0.5"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <FileText className="size-5 text-brand-200" strokeWidth={1.25} aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900">
          {product.name}
        </p>
        <p className="mt-0.5 text-sm font-bold tabular-nums text-brand-800">
          {eur.format(unitIvato)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAdd(product)}
        className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1.5 text-[11px] font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-100"
      >
        <Plus className="size-3" aria-hidden />
        Aggiungi
      </button>
    </li>
  )
}

export function CartDrawerFreeShippingUpsell({
  merchandiseIvato,
  className = '',
}: CartDrawerFreeShippingUpsellProps) {
  const { items, addOfficeProduct } = useCart()
  const cartProductIds = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const showUpsell =
    items.length > 0 && merchandiseIvato < FREE_SHIPPING_THRESHOLD_IVATO

  const suggestions = useMemo(
    () => (showUpsell ? getFreeShippingDrawerUpsellProducts(cartProductIds, 3) : []),
    [cartProductIds, showUpsell],
  )

  if (!showUpsell || suggestions.length === 0) return null

  function handleQuickAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section
      className={className}
      aria-label="Suggerimenti per la spedizione gratuita"
    >
      <h3 className="text-xs font-bold leading-snug text-slate-900">
        Aggiungi un piccolo extra per sbloccare la spedizione gratuita:
      </h3>
      <ul className="mt-2.5 space-y-2">
        {suggestions.map((product) => (
          <UpsellRow key={product.id} product={product} onAdd={handleQuickAdd} />
        ))}
      </ul>
    </section>
  )
}
