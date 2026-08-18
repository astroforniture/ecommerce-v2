import type { ReactNode } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

import { OfficeProductDetailTrustStrip } from './OfficeProductDetailTrustStrip'
import { ProductQuoteOnlyDetailCtas } from './ProductQuoteOnlyDetailCtas'
import { ProductWhatsappQuoteButton } from './ProductWhatsappQuoteButton'
import { AstroMedicalDeliveryBadge } from '../astroMedical/AstroMedicalDeliveryBadge'
import { ImmediateAvailabilityBadge } from '../office/ImmediateAvailabilityBadge'
import { DiscountPercentBadge } from '../promo/DiscountPercentBadge'

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
  /** Brochure / descrizione prodotto PDF. */
  brochureUrl?: string | null
  brochureLinkLabel?: string | null
  /** Pagina di catalogo PDF (allegato distinto). */
  catalogPagePdfUrl?: string | null
  catalogPagePdfLabel?: string | null
  /** Suffisso unità prezzo (default "/ pezzo"). Es. "/ confezione". */
  priceUnitSuffix?: string
  /** Nota sotto il selettore quantità (es. minimo / multipli). */
  quantityRuleHint?: string
  /** Astro Medical Shop: badge e trust strip con tempi 5 gg lavorativi. */
  astroMedicalLeadTimes?: boolean
  /** Categoria Agende: badge «Disponibilità immediata». */
  immediateAvailability?: boolean
  /** Prezzo listino (imponibile) da mostrare barrato se in promo. */
  compareAtUnitPrice?: number | null
  /** Percentuale sconto promo (es. 20). */
  discountPercent?: number | null
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
  brochureUrl,
  brochureLinkLabel,
  catalogPagePdfUrl,
  catalogPagePdfLabel,
  priceUnitSuffix = '/ pezzo',
  quantityRuleHint,
  astroMedicalLeadTimes = false,
  immediateAvailability = false,
  compareAtUnitPrice = null,
  discountPercent = null,
}: OfficeProductDetailPurchasePanelProps) {
  const root = ['mt-3 w-full space-y-3', rootClassName].filter(Boolean).join(' ')
  const showCompare =
    typeof compareAtUnitPrice === 'number' &&
    Number.isFinite(compareAtUnitPrice) &&
    compareAtUnitPrice > unitForQty
  const showDiscountBadge =
    typeof discountPercent === 'number' && discountPercent > 0

  if (quoteOnly) {
    return (
      <div className={root}>
        {astroMedicalLeadTimes ? <AstroMedicalDeliveryBadge variant="banner" /> : null}
        {!astroMedicalLeadTimes && immediateAvailability ? (
          <ImmediateAvailabilityBadge variant="banner" />
        ) : null}
        <ProductQuoteOnlyDetailCtas
          productName={productName}
          brochureUrl={brochureUrl}
          brochureLinkLabel={brochureLinkLabel}
          catalogPagePdfUrl={catalogPagePdfUrl}
          catalogPagePdfLabel={catalogPagePdfLabel}
        />
        <OfficeProductDetailTrustStrip
          astroMedicalLeadTimes={astroMedicalLeadTimes}
          immediateAvailability={immediateAvailability}
        />
      </div>
    )
  }

  const brochure = brochureUrl?.trim() || ''
  const catalogPdf = catalogPagePdfUrl?.trim() || ''

  return (
    <div className={root}>
      {astroMedicalLeadTimes ? <AstroMedicalDeliveryBadge variant="banner" /> : null}
      {!astroMedicalLeadTimes && immediateAvailability ? (
        <ImmediateAvailabilityBadge variant="banner" />
      ) : null}
      <div className="rounded-2xl border border-red-400/80 bg-gradient-to-b from-red-50/70 to-white p-4 shadow-sm ring-1 ring-red-200/60">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-500">{priceLineLabel}</p>
          {showDiscountBadge ? <DiscountPercentBadge percent={discountPercent} /> : null}
        </div>
        {showCompare ? (
          <p className="mt-1 text-sm font-medium tabular-nums text-slate-400 line-through">
            {eur.format(compareAtUnitPrice)} + IVA
          </p>
        ) : null}
        <p
          className={[
            'mt-1 text-lg font-semibold tabular-nums',
            showCompare ? 'text-red-600' : 'text-brand-600',
          ].join(' ')}
        >
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
        {quantityRuleHint ? (
          <p className="mt-2 text-xs font-medium text-slate-600">{quantityRuleHint}</p>
        ) : null}
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
      {brochure || catalogPdf ? (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Documenti e Schede Tecniche
          </p>
          {brochure ? (
            <a
              href={brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-brand-700 bg-white px-5 py-3 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
            >
              {brochureLinkLabel?.trim() || 'Descrizione prodotto (PDF)'}
            </a>
          ) : null}
          {catalogPdf ? (
            <a
              href={catalogPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
            >
              {catalogPagePdfLabel?.trim() || 'Pagina di catalogo (PDF)'}
            </a>
          ) : null}
        </div>
      ) : null}
      <ProductWhatsappQuoteButton productName={productName} />
      <OfficeProductDetailTrustStrip
        astroMedicalLeadTimes={astroMedicalLeadTimes}
        immediateAvailability={immediateAvailability}
      />
    </div>
  )
}
