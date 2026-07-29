import { FaqAccordion } from './FaqAccordion'
import type { FaqItem } from '../../data/faqCatalog'

type ProductFaqSectionProps = {
  items: readonly FaqItem[]
  productName?: string
}

/** Blocco FAQ a fisarmonica in fondo alla scheda prodotto. */
export function ProductFaqSection({ items, productName }: ProductFaqSectionProps) {
  if (!items.length) return null

  return (
    <section
      className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="product-faq-heading"
    >
      <h2 id="product-faq-heading" className="text-base font-semibold tracking-wide text-slate-600">
        FAQ{productName ? ` — ${productName}` : ' prodotto'}
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Domande frequenti su questo articolo. Per dettagli commerciali o tecnici contattaci.
      </p>
      <div className="mt-5">
        <FaqAccordion items={items} idPrefix="product-faq" />
      </div>
    </section>
  )
}
