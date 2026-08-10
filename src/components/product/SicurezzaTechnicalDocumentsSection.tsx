import { FileDown, ScrollText, FileText } from 'lucide-react'
import type { OfficeProduct } from '../../types/officeProduct'

type Props = {
  documents: NonNullable<OfficeProduct['technicalDocuments']>
}

function iconForDoc(id: string) {
  if (id.includes('conformita') || id.includes('ce') || id.includes('qualita')) return ScrollText
  if (id.includes('tecnica')) return FileText
  return FileDown
}

/** Sezione PDP abbigliamento Sicurezza: schede e certificazioni scaricabili. */
export function SicurezzaTechnicalDocumentsSection({ documents }: Props) {
  const list = documents.filter((d) => d.href?.trim())
  if (!list.length) return null

  return (
    <section
      className="mt-8 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-slate-50 p-5 shadow-sm sm:p-6"
      aria-labelledby="sicurezza-tech-docs-heading"
    >
      <h2
        id="sicurezza-tech-docs-heading"
        className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg"
      >
        Documentazione Tecnica e Certificazioni
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        Scarica o apri in anteprima le schede informative e le certificazioni del produttore per
        questo capo da lavoro.
      </p>
      <ul className="mt-4 space-y-3">
        {list.map((doc) => {
          const Icon = iconForDoc(doc.id)
          return (
            <li key={doc.id}>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full flex-col gap-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 transition hover:border-brand-400 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:gap-3"
              >
                <span className="inline-flex items-center gap-2.5 text-sm font-bold text-brand-900 sm:text-base">
                  <Icon className="size-5 shrink-0 text-brand-700" aria-hidden />
                  {doc.title}
                </span>
                {doc.hint ? (
                  <span className="text-xs text-slate-500 sm:ml-auto sm:text-sm sm:text-slate-600">
                    {doc.hint}
                  </span>
                ) : null}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
