import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Check, Mail } from 'lucide-react'

import {
  ServiceContactPanel,
  ServicePageChrome,
} from '../components/servizi/ServiceContactPanel'
import { getServizioPage, type ServizioSlug } from '../data/serviziCatalog'
import { setCanonical, setMetaName, setMetaProperty, SITE_ORIGIN, markSeoReady, clearSeoReady } from '../lib/siteSeo'

type Props = {
  /** Slug fisso quando la route è dichiarata esplicitamente (es. /servizi/vetrofanie). */
  slug?: ServizioSlug
}

export function ServizioDetailPage({ slug: slugProp }: Props = {}) {
  const { slug: slugParam = '' } = useParams<{ slug: string }>()
  const slug = (slugProp ?? slugParam).trim()
  const page = getServizioPage(slug)

  useEffect(() => {
    clearSeoReady()
    if (!page) return
    const title = `${page.h1} | Astro Forniture (asforniture.it)`
    const description =
      page.description?.trim() ||
      page.subtitle ||
      `${page.h1} — Astro Forniture / TuttUfficio Buffetti.`
    const canonical = `${SITE_ORIGIN}${page.path}`

    document.title = title
    setMetaName('description', description)
    setCanonical(canonical)
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', canonical)
    setMetaProperty('og:type', 'website')
    setMetaProperty('og:image', `${SITE_ORIGIN}/logo.png`)
    markSeoReady()
  }, [page])

  if (!page) {
    return <Navigate to="/" replace />
  }

  const isMailto = page.ctaHref.startsWith('mailto:')
  const isHttp = page.ctaHref.startsWith('http')

  return (
    <ServicePageChrome>
      <article
        className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
        data-seo-page="servizio"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
          Servizi Astro Forniture
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-slate-700 sm:text-xl">
          {page.subtitle}
        </p>
        {page.description ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{page.description}</p>
        ) : null}

        {page.features && page.features.length > 0 ? (
          <section className="mt-8" aria-labelledby={`features-${page.slug}`}>
            <h2 id={`features-${page.slug}`} className="text-lg font-bold text-slate-900">
              {page.featureTitle ?? 'Caratteristiche'}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {page.features.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {page.categories && page.categories.length > 0 ? (
          <section className="mt-8" aria-labelledby={`cats-${page.slug}`}>
            <h2 id={`cats-${page.slug}`} className="text-lg font-bold text-slate-900">
              {page.categoriesTitle ?? 'Categorie'}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {page.categories.map((cat) => (
                <li
                  key={cat}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm font-semibold text-slate-800"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {page.processSteps && page.processSteps.length > 0 ? (
          <section className="mt-8" aria-labelledby={`process-${page.slug}`}>
            <h2 id={`process-${page.slug}`} className="text-lg font-bold text-slate-900">
              {page.processTitle ?? 'Come funziona'}
            </h2>
            <ol className="mt-4 space-y-3">
              {page.processSteps.map((step, idx) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {page.guideText ? (
          <section
            className="mt-8 rounded-2xl border border-sky-200/80 bg-sky-50/70 p-5"
            aria-labelledby={`guide-${page.slug}`}
          >
            <h2 id={`guide-${page.slug}`} className="text-base font-bold text-slate-900">
              {page.guideTitle ?? 'Guida'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
              {page.guideText}
            </p>
          </section>
        ) : null}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={page.ctaHref}
            {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-900"
          >
            {isMailto ? <Mail className="size-4 shrink-0" aria-hidden /> : null}
            {page.ctaLabel}
          </a>
          {page.ctaSecondaryHref && page.ctaSecondaryLabel ? (
            page.ctaSecondaryHref.startsWith('/') ? (
              <Link
                to={page.ctaSecondaryHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {page.ctaSecondaryLabel}
              </Link>
            ) : (
              <a
                href={page.ctaSecondaryHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {page.ctaSecondaryLabel}
              </a>
            )
          ) : null}
        </div>

        <ServiceContactPanel serviceLabel={page.navLabel} />
      </article>
    </ServicePageChrome>
  )
}
