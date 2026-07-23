import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import {
  clearSeoReady,
  markSeoReady,
  setCanonical,
  setMetaName,
  setMetaProperty,
  SITE_LOGO_URL,
  SITE_ORIGIN,
} from '../lib/siteSeo'

export function BindingServicePage() {
  useEffect(() => {
    clearSeoReady()
    const title = 'Rilegature Notarili e Tesi | Astro Forniture (asforniture.it)'
    const description =
      'Servizio di rilegature professionali per notai e tesi. Materiali, formati e finiture dedicate — Astro Forniture.'
    const canonical = `${SITE_ORIGIN}/servizi/rilegature`
    document.title = title
    setMetaName('description', description)
    setCanonical(canonical)
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', canonical)
    setMetaProperty('og:type', 'website')
    setMetaProperty('og:image', SITE_LOGO_URL)
    markSeoReady()
  }, [])

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/40 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna alla home
        </Link>

        <section
          id="tesi"
          data-seo-page="servizio"
          className="mt-6 scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            Servizi Astro Forniture
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Rilegature Notarili e Tesi
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            In questa sezione troverai a breve tutte le opzioni di configurazione per rilegature
            professionali, con materiali, formati e finiture dedicate.
          </p>
          <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-slate-700">
            Pagina in allestimento: stiamo preparando configuratore, tempi e prezzi per il servizio.
          </div>
        </section>
      </div>
    </main>
  )
}
