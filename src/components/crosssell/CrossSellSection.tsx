import { FileText, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

type CrossSellCardProps = {
  product: OfficeProduct
  onAdd: (product: OfficeProduct) => void
}

function CrossSellCard({ product, onAdd }: CrossSellCardProps) {
  const imageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0

  return (
    <li className="flex min-w-[min(220px,calc(100vw-3rem))] max-w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:min-w-[200px] sm:max-w-[200px]">
      <div className="flex h-28 items-center justify-center overflow-hidden bg-slate-50 p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <FileText className="size-10 text-brand-200" strokeWidth={1.25} aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900">
          {product.name}
        </p>
        {product.subcategory ? (
          <p className="mt-1 text-[10px] font-medium text-slate-500">{product.subcategory}</p>
        ) : null}
        <div className="mt-auto pt-3">
          {hasPrice ? (
            <p className="mb-2 text-sm font-bold tabular-nums text-brand-800">
              {eur.format(unitIvato)}{' '}
              <span className="text-[10px] font-medium text-slate-500">IVA incl.</span>
            </p>
          ) : (
            <p className="mb-2 text-[11px] text-slate-500">Prezzo su preventivo</p>
          )}
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={!hasPrice}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-3" aria-hidden />
            {hasPrice ? 'Aggiungi' : 'Richiedi'}
          </button>
        </div>
      </div>
    </li>
  )
}

type CrossSellSectionProps = {
  products: OfficeProduct[]
  /** Titolo sezione. Default: "Completa la tua postazione". */
  heading?: string
  /** Sottotitolo. Default: "Spesso acquistati insieme". */
  subheading?: string
  className?: string
}

/**
 * Sezione cross-sell in PDP: carosello orizzontale con "Aggiungi al carrello" rapido.
 * Non renderizza nulla se `products` è vuoto.
 */
export function CrossSellSection({
  products,
  heading = 'Completa la tua postazione',
  subheading = 'Spesso acquistati insieme',
  className = '',
}: CrossSellSectionProps) {
  const { addOfficeProduct } = useCart()

  if (products.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section
      className={['mt-12 border-t border-slate-200 pt-10', className].filter(Boolean).join(' ')}
      aria-labelledby="cross-sell-heading"
    >
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-5 text-brand-700" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            {subheading}
          </p>
          <h2
            id="cross-sell-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {heading}
          </h2>
        </div>
      </div>

      <ul
        className="mt-6 flex gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
        aria-label={heading}
      >
        {products.map((product) => (
          <CrossSellCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </ul>
    </section>
  )
}
