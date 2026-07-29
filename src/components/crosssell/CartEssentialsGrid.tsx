import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getCartCheckoutEssentials } from '../../data/crossSellCatalog'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

type CartEssentialsGridProps = {
  className?: string
  limit?: number
  title?: string
}

/**
 * Griglia statica essenziali (Risma A4, Buste PPL, Archivio, Etichettatrice, Toner)
 * per carrello / checkout — aggiunta rapida con un clic.
 */
export function CartEssentialsGrid({
  className = '',
  limit = 4,
  title = 'Essenziali per l’ufficio',
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
      <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {essentials.map((product) => {
          const unitIvato = productUnitIvato(product, 1)
          const hasPrice = unitIvato > 0
          return (
            <li
              key={product.id}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2"
            >
              <ProductThumb
                imageUrl={product.imageUrl}
                alt={product.name}
                className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50"
                imgClassName="max-h-full max-w-full object-contain p-0.5"
                iconClassName="size-5 text-brand-200"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900">
                  {product.name}
                </p>
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
