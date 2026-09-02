import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { productDetailPath } from '../../lib/productRoutes'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

type RelatedProductsMiniGridProps = {
  products: readonly OfficeProduct[]
  title?: string
  subtitle?: string
  className?: string
  /** Chiude drawer o naviga via. */
  onNavigate?: () => void
  /** `cards` = mini-card verticali; `list` = righe compatte (drawer). */
  layout?: 'cards' | 'list'
}

function MiniCard({
  product,
  onAdd,
  onNavigate,
}: {
  product: OfficeProduct
  onAdd: (p: OfficeProduct) => void
  onNavigate?: () => void
}) {
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0
  const detailTo = productDetailPath(product)

  return (
    <li className="flex min-w-[148px] max-w-[168px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:min-w-[160px] sm:max-w-[180px]">
      <Link
        to={detailTo}
        onClick={onNavigate}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        aria-label={`Vai alla scheda di ${product.name}`}
      >
        <ProductThumb
          imageUrl={product.imageUrl}
          alt={product.name}
          className="flex h-24 items-center justify-center overflow-hidden bg-slate-50 p-2"
          imgClassName="max-h-full max-w-full object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <Link
          to={detailTo}
          onClick={onNavigate}
          className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold leading-snug text-slate-900 hover:text-brand-800 hover:underline"
        >
          {product.name}
        </Link>
        {hasPrice ? (
          <p className="text-sm font-bold tabular-nums text-brand-800">{eur.format(unitIvato)}</p>
        ) : (
          <p className="text-[10px] text-slate-500">Su preventivo</p>
        )}
        <button
          type="button"
          disabled={!hasPrice}
          onClick={() => onAdd(product)}
          className="mt-auto inline-flex w-full items-center justify-center gap-1 rounded-lg bg-brand-700 px-2 py-1.5 text-[11px] font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-3" aria-hidden />
          Aggiungi al carrello
        </button>
      </div>
    </li>
  )
}

function MiniRow({
  product,
  onAdd,
  onNavigate,
}: {
  product: OfficeProduct
  onAdd: (p: OfficeProduct) => void
  onNavigate?: () => void
}) {
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0
  const detailTo = productDetailPath(product)

  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-slate-200/90 bg-white px-2 py-2">
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

/** Mini-card correlati: foto, nome, prezzo, aggiunta rapida. */
export function RelatedProductsMiniGrid({
  products,
  title = 'Potrebbero interessarti anche',
  subtitle = 'Completa il tuo acquisto',
  className = '',
  onNavigate,
  layout = 'cards',
}: RelatedProductsMiniGridProps) {
  const { addOfficeProduct } = useCart()

  if (products.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  return (
    <section className={className} aria-label={title}>
      <div>
        {subtitle ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
            {subtitle}
          </p>
        ) : null}
        <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">{title}</h3>
      </div>
      {layout === 'list' ? (
        <ul className="mt-2.5 space-y-2">
          {products.map((product) => (
            <MiniRow
              key={product.id}
              product={product}
              onAdd={handleAdd}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          {products.map((product) => (
            <MiniCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
