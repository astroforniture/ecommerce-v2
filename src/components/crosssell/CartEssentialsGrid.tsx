import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getCartCheckoutEssentials } from '../../data/crossSellCatalog'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { productDetailPath } from '../../lib/productRoutes'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

type CartEssentialsGridProps = {
  className?: string
  limit?: number
  title?: string
  /** Es. chiudi drawer carrello al click su foto/titolo. */
  onNavigate?: () => void
}

/**
 * Griglia statica essenziali consigliati — una sola sezione compatta sotto la lista carrello.
 */
export function CartEssentialsGrid({
  className = '',
  limit = 3,
  title = 'Essenziali consigliati',
  onNavigate,
}: CartEssentialsGridProps) {
  const { items, addOfficeProduct } = useCart()
  const cartIds = useMemo(() => new Set(items.map((i) => i.id)), [items])
  const essentials = useMemo(
    () => getCartCheckoutEssentials(cartIds, limit),
    [cartIds, limit],
  )

  if (items.length === 0 || essentials.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section className={className} aria-label={title}>
      <h3 className="text-xs font-bold leading-snug text-slate-900">{title}</h3>
      <ul className="mt-2.5 space-y-2">
        {essentials.map((product) => {
          const unitIvato = productUnitIvato(product, 1)
          const hasPrice = unitIvato > 0
          const detailTo = productDetailPath(product)
          return (
            <li
              key={product.id}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2"
            >
              <Link
                to={detailTo}
                onClick={onNavigate}
                className="shrink-0"
                aria-label={`Vai alla scheda di ${product.name}`}
              >
                <ProductThumb
                  imageUrl={product.imageUrl}
                  alt={product.name}
                  className="flex size-11 items-center justify-center overflow-hidden rounded-md bg-slate-50"
                  imgClassName="max-h-full max-w-full object-contain p-0.5"
                  iconClassName="size-5 text-brand-200"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={detailTo}
                  onClick={onNavigate}
                  className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 hover:text-brand-800 hover:underline"
                >
                  {product.name}
                </Link>
                {hasPrice ? (
                  <p className="mt-0.5 text-sm font-bold tabular-nums text-brand-800">
                    {eur.format(unitIvato)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={!hasPrice}
                onClick={() => handleAdd(product)}
                className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1.5 text-[11px] font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-3" aria-hidden />
                Aggiungi
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
