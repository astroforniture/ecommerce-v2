import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import type { CrossSellResult } from '../../data/crossSellCatalog'
import { productDetailPath } from '../../lib/productRoutes'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const AUTO_PLAY_MS = 3000

type CrossSellCardProps = {
  product: OfficeProduct
  slotLabel?: string
  onAdd: (product: OfficeProduct) => void
}

function CrossSellCard({ product, slotLabel, onAdd }: CrossSellCardProps) {
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0
  const detailTo = productDetailPath(product)

  return (
    <li className="flex min-w-[min(220px,calc(100vw-3rem))] max-w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:min-w-[200px] sm:max-w-[200px]">
      <Link
        to={detailTo}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        aria-label={`Vai alla scheda di ${product.name}`}
      >
        <ProductThumb
          imageUrl={product.imageUrl}
          alt={product.name}
          className="flex h-28 items-center justify-center overflow-hidden bg-slate-50 p-2 transition hover:bg-slate-100/80"
          imgClassName="max-h-full max-w-full object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        {slotLabel ? (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
            {slotLabel}
          </p>
        ) : null}
        <Link
          to={detailTo}
          className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 transition hover:text-brand-800 hover:underline"
        >
          {product.name}
        </Link>
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAdd(product)
            }}
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

function pickRotating(
  pool: readonly OfficeProduct[],
  tick: number,
  tickOffset = 0,
): OfficeProduct | null {
  if (pool.length === 0) return null
  return pool[(tick + tickOffset) % pool.length] ?? null
}

type CrossSellSectionProps = {
  crossSell: CrossSellResult
  heading?: string
  subheading?: string
  className?: string
}

/**
 * Sezione cross-sell PDP con slot dinamici e rotazione automatica ogni 3s.
 */
export function CrossSellSection({
  crossSell,
  heading,
  subheading,
  className = '',
}: CrossSellSectionProps) {
  const resolvedHeading = heading ?? crossSell.heading ?? 'Completa la tua postazione'
  const resolvedSubheading = subheading ?? crossSell.subheading ?? 'Spesso acquistati insieme'
  const { addOfficeProduct } = useCart()
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  const displaySlots = useMemo(() => {
    if (crossSell.slots.length > 0) {
      const out: Array<{ key: string; label: string; product: OfficeProduct }> = []
      for (const slot of crossSell.slots) {
        const product = pickRotating(slot.pool, tick, slot.tickOffset ?? 0)
        if (product) out.push({ key: slot.key, label: slot.label, product })
      }
      return out
    }

    return crossSell.products.map((product, i) => ({
      key: `list-${i}`,
      label: '',
      product,
    }))
  }, [crossSell, tick])

  useEffect(() => {
    if (!crossSell.autoPlay || paused) return
    const id = window.setInterval(() => {
      setTick((t) => t + 1)
    }, AUTO_PLAY_MS)
    return () => window.clearInterval(id)
  }, [crossSell.autoPlay, paused])

  useEffect(() => {
    setTick(0)
  }, [crossSell.slots, crossSell.products])

  if (displaySlots.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

  const slotLabels = [
    ...new Set(displaySlots.map((s) => s.label).filter(Boolean)),
  ]

  return (
    <section
      className={['mt-12 border-t border-slate-200 pt-10', className].filter(Boolean).join(' ')}
      aria-labelledby="cross-sell-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-5 text-brand-700" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            {resolvedSubheading}
          </p>
          <h2
            id="cross-sell-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {resolvedHeading}
          </h2>
        </div>
      </div>

      <ul
        className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth [-webkit-overflow-scrolling:touch]"
        aria-label={resolvedHeading}
      >
        {displaySlots.map((slot) => (
          <CrossSellCard
            key={`${slot.key}-${slot.product.id}`}
            product={slot.product}
            slotLabel={crossSell.fourSlots ? slot.label || undefined : undefined}
            onAdd={handleAdd}
          />
        ))}
      </ul>
      {crossSell.autoPlay ? (
        <p className="mt-2 text-[11px] text-slate-500">
          {slotLabels.length > 0
            ? `${slotLabels.join(', ')} in rotazione automatica`
            : 'Anteprime in rotazione automatica'}
          {paused ? ' (in pausa)' : ''}.
        </p>
      ) : null}
    </section>
  )
}
