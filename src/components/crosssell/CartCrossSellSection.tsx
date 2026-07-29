import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getCrossSellForCart } from '../../data/crossSellCatalog'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { productDetailPath } from '../../lib/productRoutes'
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
  const detailTo = productDetailPath(product)

  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2">
      <Link
        to={detailTo}
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
          className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 hover:text-brand-800 hover:underline"
        >
          {product.name}
        </Link>
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

  const enriched = useMemo(
    () =>
      cartProductsForCrossSell.map((i) => {
        const n = i.name.toLowerCase()
        let category = i.category
        let subcategory: string | undefined
        if (/ditron|registratore|cassa/i.test(n) || i.id.includes('DITRON')) category = 'Casse'
        else if (/etichettatric/i.test(n)) {
          category = 'Macchine per Ufficio'
          subcategory = 'Etichettatrici'
        } else if (/toner|cartucc/i.test(n)) category = 'Cartucce & Toner'
        else if (/carta|rism/i.test(n) && /termic/i.test(n)) {
          category = 'Carta'
          subcategory = 'Carta Termica'
        } else if (/carta|rism|a4|a3|navigator|fabriano/i.test(n)) {
          category = 'Carta'
          subcategory = 'Formato Carta A4'
        } else if (/buste?\s*(forate|trasparent)|shopper/i.test(n)) {
          category = 'Archivio'
          subcategory = 'Buste Trasparenti'
        } else if (/distrugg/i.test(n)) {
          category = 'Macchine per Ufficio'
          subcategory = 'Distruggi Documenti'
        } else if (/comand|alberghi|ristorant/i.test(n)) {
          category = 'Modulistica'
          subcategory = 'Alberghi e Ristoranti'
        } else if (/penna|cucitric|evidenziat|fermagli|nastro|marcat/i.test(n)) {
          category = 'Cancelleria'
        } else if (/registratore|cartellin|archivio|classificator/i.test(n)) {
          category = 'Archivio'
        }
        return { ...i, category, subcategory, relatedProductIds: undefined as string[] | undefined }
      }),
    [cartProductsForCrossSell],
  )

  const products = useMemo(
    () => getCrossSellForCart(enriched, cartProductIdSet, limit),
    [enriched, cartProductIdSet, limit],
  )

  if (items.length === 0 || products.length === 0) return null

  return (
    <section className={className} aria-label="Spesso acquistati insieme">
      <h3 className="text-xs font-bold leading-snug text-slate-900">Spesso acquistati insieme</h3>
      <ul className="mt-2.5 space-y-2">
        {products.map((p) => (
          <CrossSellRow key={p.id} product={p} onAdd={(product) => addOfficeProduct(product, 1)} />
        ))}
      </ul>
    </section>
  )
}
