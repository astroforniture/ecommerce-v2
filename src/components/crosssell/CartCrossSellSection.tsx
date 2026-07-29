import { useMemo } from 'react'
import { FileText, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getCrossSellForCart } from '../../data/crossSellCatalog'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

function CrossSellRow({
  product,
  onAdd,
}: {
  product: OfficeProduct
  onAdd: (p: OfficeProduct) => void
}) {
  const imageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0

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
        {hasPrice ? (
          <p className="mt-0.5 text-sm font-bold tabular-nums text-brand-800">
            {eur.format(unitIvato)}
          </p>
        ) : (
          <p className="mt-0.5 text-[10px] text-slate-500">Su preventivo</p>
        )}
      </div>
      <button
        type="button"
        disabled={!hasPrice}
        onClick={() => onAdd(product)}
        className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1.5 text-[11px] font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3" aria-hidden />
        Aggiungi
      </button>
    </li>
  )
}

type CartCrossSellSectionProps = {
  className?: string
  limit?: number
}

/**
 * Sezione cross-sell nel drawer/pagina carrello.
 * Legge i prodotti nel carrello e propone articoli complementari.
 * Non renderizza nulla se non ci sono suggerimenti pertinenti.
 */
export function CartCrossSellSection({ className = '', limit = 3 }: CartCrossSellSectionProps) {
  const { items, addOfficeProduct } = useCart()

  const cartProductIdSet = useMemo(() => new Set(items.map((i) => i.id)), [items])

  const cartProductsForCrossSell = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        category: i.sku ?? '',
        subcategory: undefined as string | undefined,
      })),
    [items],
  )

  const suggestions = useMemo(
    () => getCrossSellForCart(cartProductsForCrossSell, cartProductIdSet, limit),
    [cartProductsForCrossSell, cartProductIdSet, limit],
  )

  if (items.length === 0 || suggestions.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section className={className} aria-label="Altri clienti hanno acquistato anche">
      <h3 className="text-xs font-bold leading-snug text-slate-900">
        Altri clienti hanno acquistato anche:
      </h3>
      <ul className="mt-2.5 space-y-2">
        {suggestions.map((product) => (
          <CrossSellRow key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </ul>
    </section>
  )
}
