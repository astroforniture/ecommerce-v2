import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FaqAccordion } from '../components/faq/FaqAccordion'
import { GLOBAL_FAQ_CATEGORIES } from '../data/faqCatalog'
import {
  COMPANY_EMAIL,
  COMPANY_LANDLINE_DISPLAY,
  COMPANY_LANDLINE_TEL,
  COMPANY_MAILTO,
  COMPANY_MOBILE_DISPLAY,
  COMPANY_MOBILE_TEL,
} from '../data/companyContacts'

export function FaqPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna alla home
        </Link>

        <header className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Servizio clienti</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Domande frequenti
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Risposte rapide su ordini, spedizioni, prezzi, preventivi, garanzia e assistenza Astro
            Forniture. Non trovi quello che cerchi? Contattaci.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {GLOBAL_FAQ_CATEGORIES.map((category) => (
            <section key={category.id} aria-labelledby={`faq-cat-${category.id}`}>
              <h2
                id={`faq-cat-${category.id}`}
                className="mb-4 text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
              >
                {category.title}
              </h2>
              <FaqAccordion items={category.items} idPrefix={category.id} />
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Serve aiuto personalizzato?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Telefono{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_LANDLINE_TEL}>
              {COMPANY_LANDLINE_DISPLAY}
            </a>
            , cellulare / WhatsApp{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_MOBILE_TEL}>
              {COMPANY_MOBILE_DISPLAY}
            </a>
            , oppure email{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_MAILTO}>
              {COMPANY_EMAIL}
            </a>
            .
          </p>
        </aside>
      </div>
    </main>
  )
}
