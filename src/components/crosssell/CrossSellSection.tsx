import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productUnitIvato } from '../../lib/freeShippingUpsellProducts'
import { detectOfficeCrossSellGroup, type CrossSellResult } from '../../data/crossSellCatalog'
import { ProductThumb } from './ProductThumb'
import type { OfficeProduct } from '../../types/officeProduct'

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const AUTO_PLAY_MS = 3000

type CrossSellCardProps = {
  product: OfficeProduct
  onAdd: (product: OfficeProduct) => void
}

function CrossSellCard({ product, onAdd }: CrossSellCardProps) {
  const unitIvato = productUnitIvato(product, 1)
  const hasPrice = unitIvato > 0

  return (
    <li className="flex min-w-[min(220px,calc(100vw-3rem))] max-w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:min-w-[200px] sm:max-w-[200px]">
      <ProductThumb
        imageUrl={product.imageUrl}
        alt={product.name}
        className="flex h-28 items-center justify-center overflow-hidden bg-slate-50 p-2"
        imgClassName="max-h-full max-w-full object-contain"
      />
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
  crossSell: CrossSellResult
  heading?: string
  subheading?: string
  className?: string
}

/**
 * Sezione cross-sell PDP con rotazione soft ogni 3s su Etichettatrici e Cartucce & Toner.
 */
export function CrossSellSection({
  crossSell,
  heading = 'Completa la tua postazione',
  subheading = 'Spesso acquistati insieme',
  className = '',
}: CrossSellSectionProps) {
  const { addOfficeProduct } = useCart()
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  const displayProducts = useMemo(() => {
    const base = [...crossSell.products]
    if (!crossSell.autoPlay) return base

    const etchIdx =
      crossSell.rotateEtichettatrici.length > 0
        ? tick % crossSell.rotateEtichettatrici.length
        : 0
    const tonerIdx =
      crossSell.rotateCartucceToner.length > 0
        ? tick % crossSell.rotateCartucceToner.length
        : 0

    const etch = crossSell.rotateEtichettatrici[etchIdx]
    const toner = crossSell.rotateCartucceToner[tonerIdx]

    return base.map((p) => {
      const g = detectOfficeCrossSellGroup(p)
      if (g === 'etichettatrici' && etch) return etch
      if (g === 'cartucce-toner' && toner) return toner
      return p
    })
  }, [crossSell, tick])

  useEffect(() => {
    if (!crossSell.autoPlay || paused) return
    const id = window.setInterval(() => {
      setTick((t) => t + 1)
      const el = scrollerRef.current
      if (!el || el.scrollWidth <= el.clientWidth + 8) return
      const cardWidth = el.querySelector('li')?.getBoundingClientRect().width ?? 220
      const gap = 16
      const step = cardWidth + gap
      const nextLeft = el.scrollLeft + step
      const maxLeft = el.scrollWidth - el.clientWidth
      el.scrollTo({
        left: nextLeft >= maxLeft - 4 ? 0 : nextLeft,
        behavior: 'smooth',
      })
    }, AUTO_PLAY_MS)
    return () => window.clearInterval(id)
  }, [crossSell.autoPlay, paused])

  if (displayProducts.length === 0) return null

  function handleAdd(product: OfficeProduct) {
    addOfficeProduct(product, 1)
  }

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
        ref={scrollerRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth [-webkit-overflow-scrolling:touch]"
        aria-label={heading}
      >
        {displayProducts.map((product) => (
          <CrossSellCard
            key={`${product.id}-${detectOfficeCrossSellGroup(product) ?? 'x'}`}
            product={product}
            onAdd={handleAdd}
          />
        ))}
      </ul>
      {crossSell.autoPlay ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Anteprime Etichettatrici e Cartucce &amp; Toner in rotazione automatica
          {paused ? ' (in pausa)' : ''}.
        </p>
      ) : null}
    </section>
  )
}
