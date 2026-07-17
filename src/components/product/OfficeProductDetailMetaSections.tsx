import { Briefcase, Leaf, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { OfficeProduct } from '../../types/officeProduct'
import { OfficeProductCard } from '../office/OfficeProductCard'
import { CATEGORY_PROMO_WHATSAPP_NUMBER } from '../../lib/categoryPromoProducts'

type DescriptionProps = {
  description: string
}

type ProductValueBlock = {
  icon: LucideIcon
  title: string
  body: string
}

const PRODUCT_VALUE_BLOCKS: ProductValueBlock[] = [
  {
    icon: Briefcase,
    title: '💼 Ideale per il tuo Ufficio',
    body:
      'Selezionato per garantire massima affidabilità nei flussi di lavoro intensi, riducendo gli sprechi e ottimizzando i costi aziendali.',
  },
  {
    icon: Leaf,
    title: '🌱 Qualità Garantita Astro Forniture',
    body:
      'Tutti i nostri articoli superano rigidi controlli di conformità. Garantiamo prestazioni costanti dal primo all\'ultimo utilizzo.',
  },
  {
    icon: Truck,
    title: '🚚 Consegna Rapida & Supporto',
    body:
      'Spedizione tracciata e imballaggio sicuro. Il nostro team è sempre a disposizione su WhatsApp per assistenza all\'acquisto o per grandi ordinativi.',
  },
]

const WHATSAPP_SUPPORT_HREF = `https://wa.me/${CATEGORY_PROMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Buongiorno, vorrei assistenza per un acquisto o un ordine aziendale.',
)}`

/** Blocco PDP unificato: descrizione DB + valori commerciali Astro Forniture. */
export function OfficeProductDetailDescriptionSection({ description }: DescriptionProps) {
  const text = description.trim()
  const body = text
    ? text
    : 'Scheda prodotto in aggiornamento: per scheda tecnica dettagliata, compatibilità e disponibilità contatta il nostro ufficio commerciale.'

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold tracking-wide text-slate-600">DESCRIZIONE PRODOTTO</h2>
      <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-slate-700">{body}</p>

      <div className="mt-8 border-t border-slate-100 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Perché sceglierlo
        </p>
        <ul className="mt-4 space-y-4" aria-label="Vantaggi Astro Forniture">
          {PRODUCT_VALUE_BLOCKS.map((block) => {
            const Icon = block.icon
            return (
              <li
                key={block.title}
                className="flex gap-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50/90 via-white to-brand-50/40 p-4 sm:p-5"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800 shadow-sm"
                  aria-hidden
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-900">{block.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
                    {block.title.includes('Consegna Rapida') ? (
                      <>
                        Spedizione tracciata e imballaggio sicuro. Il nostro team è sempre a disposizione su{' '}
                        <a
                          href={WHATSAPP_SUPPORT_HREF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-brand-800 underline decoration-brand-300 underline-offset-2 hover:text-brand-950"
                        >
                          WhatsApp
                        </a>{' '}
                        per assistenza all&apos;acquisto o per grandi ordinativi.
                      </>
                    ) : (
                      block.body
                    )}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

type RelatedProps = {
  products: OfficeProduct[]
  /** `carousel`: come ProductDetailPage. `grid-4`: griglia fino a 4 colonne (es. distruggidocumenti). */
  layout?: 'carousel' | 'grid-4'
  /** Card correlate compatte (stesso elenco Macchine / vetrina). */
  relatedCardHideCategory?: boolean
  /** Stessa griglia compatta delle categorie sintetiche (niente hint quantità, altezza uniforme). */
  relatedCompactGrid?: boolean
}

export function OfficeProductDetailRelatedSection({
  products,
  layout = 'carousel',
  relatedCardHideCategory = false,
  relatedCompactGrid = false,
}: RelatedProps) {
  return (
    <section
      className="mt-16 border-t border-slate-200 pt-12"
      aria-labelledby="related-products-heading"
    >
      <h2
        id="related-products-heading"
        className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
      >
        Articoli Correlati
      </h2>
      <p className="mt-1 text-sm text-muted">Potrebbe interessarti anche</p>
      {products.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-600">
          Nessun articolo correlato al momento: esplora il catalogo o contattaci per suggerimenti su prodotti
          affini.
        </p>
      ) : layout === 'grid-4' ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="min-w-0 h-full">
              <OfficeProductCard
                product={p}
                hideCategoryBadge={relatedCardHideCategory}
                compactGrid={relatedCompactGrid}
                suppressQuantityTierHint={relatedCompactGrid}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex gap-6 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
          {products.map((p) => (
            <div
              key={p.id}
              className="w-[min(300px,calc(100vw-2.5rem))] shrink-0 sm:w-[280px]"
            >
              <OfficeProductCard product={p} hideCategoryBadge={relatedCardHideCategory} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
