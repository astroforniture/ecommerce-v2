import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../../data/faqCatalog'

type FaqAccordionProps = {
  items: readonly FaqItem[]
  /** Prefisso id accessibilità (univoco nella pagina). */
  idPrefix?: string
  className?: string
}

/**
 * Accordion FAQ riusabile (pagina /faq e schede prodotto).
 */
export function FaqAccordion({ items, idPrefix = 'faq', className }: FaqAccordionProps) {
  const reactId = useId().replace(/:/g, '')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!items.length) return null

  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      {items.map((item, index) => {
        const open = openIndex === index
        const panelId = `${idPrefix}-${reactId}-panel-${index}`
        const buttonId = `${idPrefix}-${reactId}-btn-${index}`
        return (
          <div
            key={`${item.question}-${index}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5"
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">{item.question}</span>
              <ChevronDown
                className={[
                  'size-5 shrink-0 text-slate-500 transition',
                  open ? 'rotate-180' : '',
                ].join(' ')}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5"
            >
              <p className="text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
