import { Link, useParams } from 'react-router-dom'

import {
  LEGAL_GOVERNANCE_DOCS,
  LEGAL_GOVERNANCE_FOOTER_LINKS,
  LEGAL_GOVERNANCE_HUB_PATH,
  legalGovernanceDocBySlug,
} from '../data/legalGovernanceNav'

/** Hub e pagine placeholder «Note Legali – Governance». */
export function LegalGovernanceHubPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Note Legali – Governance
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Governance, Etica, Ambiente
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          In questa sezione sono raccolti i documenti di governance, etica e responsabilità
          ambientale di Astro Forniture. Alcuni testi sono in aggiornamento: seleziona una voce per
          consultare il contenuto disponibile.
        </p>

        <nav className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Documenti governance">
          <ul className="space-y-2.5 text-sm">
            {LEGAL_GOVERNANCE_FOOTER_LINKS.filter((l) => l.to !== LEGAL_GOVERNANCE_HUB_PATH).map(
              (link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-medium text-brand-800 underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="mt-8 space-y-4">
          {LEGAL_GOVERNANCE_DOCS.map((doc) => (
            <section
              key={doc.slug}
              id={doc.slug}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h2 className="text-lg font-semibold text-slate-900">{doc.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{doc.summary}</p>
              {doc.relatedLinks?.length ? (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {doc.relatedLinks.map((r) => (
                    <li key={r.to}>
                      <Link to={r.to} className="font-medium text-brand-800 hover:underline">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-amber-800">
                  Pagina placeholder — contenuto in aggiornamento
                </p>
              )}
              <p className="mt-3">
                <Link
                  to={`${LEGAL_GOVERNANCE_HUB_PATH}/${doc.slug}`}
                  className="text-sm font-semibold text-slate-800 underline-offset-2 hover:underline"
                >
                  Apri scheda dedicata →
                </Link>
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export function LegalGovernanceDocPage() {
  const { slug } = useParams<{ slug: string }>()
  const doc = legalGovernanceDocBySlug(slug)

  if (!doc) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Documento non trovato</h1>
        <p className="mt-3 text-slate-600">
          La pagina richiesta non fa parte delle Note Legali – Governance.
        </p>
        <Link
          to={LEGAL_GOVERNANCE_HUB_PATH}
          className="mt-6 inline-flex font-semibold text-brand-800 hover:underline"
        >
          Torna all&apos;indice Governance
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to={LEGAL_GOVERNANCE_HUB_PATH}
          className="text-sm font-semibold text-brand-800 underline-offset-2 hover:underline"
        >
          ← Note Legali – Governance
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{doc.title}</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{doc.summary}</p>
          {doc.relatedLinks?.length ? (
            <ul className="mt-5 space-y-2 text-sm">
              {doc.relatedLinks.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="inline-flex rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 font-semibold text-brand-900 transition hover:bg-brand-100"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Contenuto placeholder: il documento ufficiale sarà pubblicato a breve. Per
              informazioni contatta l&apos;ufficio amministrativo.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
