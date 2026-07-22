import type { ReactNode } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

import { OfficeProductDetailTrustStrip } from './OfficeProductDetailTrustStrip'
import { ProductQuoteOnlyDetailCtas } from './ProductQuoteOnlyDetailCtas'
import { ProductWhatsappQuoteButton } from './ProductWhatsappQuoteButton'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

export type OfficeProductDetailPurchasePanelProps = {
  /** Es. "Prezzo unitario" o "Per la quantità selezionata". */
  priceLineLabel: string
  unitForQty: number
  lineTotal: number
  quantity: number
  onBumpQuantity: (delta: number) => void
  onAddToCart: () => void
  justAdded: boolean
  /** Nome prodotto per messaggio WhatsApp precompilato. */
  productName: string
  /** Classi aggiuntive sul wrapper esterno (es. margine dopo titolo senza varianti). */
  rootClassName?: string
  /** Tabella sconti quantità: sotto il selettore e prima del pulsante acquisto. */
  quantityDiscountTable?: ReactNode
  /** Solo preventivo: nasconde prezzo, quantità e carrello. */
  quoteOnly?: boolean
  /** Suffisso unità prezzo (default "/ pezzo"). Es. "/ confezione". */
  priceUnitSuffix?: string
}

/**
 * Pannello prezzo + quantità + totale imponibile + CTA, condiviso tra PDP catalogo e prodotti sintetici statici.
 */
export function OfficeProductDetailPurchasePanel({
  priceLineLabel,
  unitForQty,
  lineTotal,
  quantity,
  onBumpQuantity,
  onAddToCart,
  justAdded,
  productName,
  rootClassName,
  quantityDiscountTable,
  quoteOnly = false,
  priceUnitSuffix = '/ pezzo',
}: OfficeProductDetailPurchasePanelProps) {
  const root = ['mt-3 w-full space-y-3', rootClassName].filter(Boolean).join(' ')

  if (quoteOnly) {
    return (
      <div className={root}>
        <ProductQuoteOnlyDetailCtas productName={productName} />
        <OfficeProductDetailTrustStrip />
      </div>
    )
  }

  return (
    <div className={root}>
      <div className="rounded-2xl border border-red-400/80 bg-gradient-to-b from-red-50/70 to-white p-4 shadow-sm ring-1 ring-red-200/60">
        <p className="text-sm font-medium text-slate-500">{priceLineLabel}</p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-brand-600">
          {eur.format(unitForQty)} + IVA{' '}
          <span className="text-base font-normal text-slate-600">{priceUnitSuffix}</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-medium text-slate-700">Quantità</span>
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => onBumpQuantity(-1)}
              className="p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Diminuisci quantità"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => onBumpQuantity(1)}
              className="p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Aumenta quantità"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <p className="ml-auto text-right text-xs text-slate-600 sm:text-sm">
            Totale imponibile
            <span className="ml-2 text-2xl font-bold tabular-nums text-brand-900">
              {eur.format(lineTotal)}
            </span>
          </p>
        </div>
      </div>

      {quantityDiscountTable}

      <button
        type="button"
        onClick={onAddToCart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-900"
      >
        <ShoppingCart className="size-4 text-white" aria-hidden />
        {justAdded ? 'Aggiunto al carrello' : 'Aggiungi al carrello'}
      </button>
      <ProductWhatsappQuoteButton productName={productName} />
      <OfficeProductDetailTrustStrip />
    </div>
  )
}
