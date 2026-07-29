import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getCrossSellForCart } from '../../data/crossSellCatalog'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

function CrossSellRow({
  product,
  onAdd,
}: {
  product: OfficeProduct
  onAdd: (p: OfficeProduct) => void
}) {
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0

  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2">
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
 * Cross-sell dinamico nel drawer/pagina carrello (casse + anello ufficio).
 */
export function CartCrossSellSection({ className = '', limit = 3 }: CartCrossSellSectionProps) {
  const { items, addOfficeProduct } = useCart()

  const cartProductIdSet = useMemo(() => new Set(items.map((i) => i.id)), [items])

  const cartProductsForCrossSell = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.sku?.includes('DITRON') || /cassa|ditron/i.test(i.name) ? 'Casse' : '',
        subcategory: undefined as string | undefined,
      })),
    [items],
  )

  // Migliora detection: usa name per etichettatrici/toner/carta/archivio
  const enriched = useMemo(
    () =>
      items.map((i) => {
        const n = i.name.toLowerCase()
        let category = ''
        let subcategory: string | undefined
        if (/ditron|registratore|cassa/i.test(n) || i.id.includes('DITRON')) category = 'Casse'
        else if (/toner|cartucc/i.test(n)) category = 'Cartucce & Toner'
        else if (/etichettatric/i.test(n)) {
          category = 'Macchine per Ufficio'
          subcategory = 'Etichettatrici'
        } else if (/risma|carta\s*a4|carta\s*a3/i.test(n)) {
          category = 'Carta'
          subcategory = /a3/i.test(n) ? 'Formato Carta A3' : 'Formato Carta A4'
        } else if (/bust/i.test(n)) {
          category = 'Archivio'
          subcategory = 'Buste Trasparenti'
        } else if (/registratore|cartellin|archivio|classificator/i.test(n)) {
          category = 'Archivio'
        }
        return {
          id: i.id,
          name: i.name,
          category,
          subcategory,
        }
      }),
    [items],
  )

  const suggestions = useMemo(
    () => getCrossSellForCart(enriched.length ? enriched : cartProductsForCrossSell, cartProductIdSet, limit),
    [enriched, cartProductsForCrossSell, cartProductIdSet, limit],
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
