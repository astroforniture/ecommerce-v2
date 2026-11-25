import { useEffect } from 'react'

import {
  ServiceContactPanel,
  ServicePageChrome,
} from '../components/servizi/ServiceContactPanel'
import {
  PERSONALIZZATO_CATEGORY_LABEL,
  PERSONALIZZATO_ROLLUP_BANNER_ALT,
  PERSONALIZZATO_ROLLUP_BANNER_IS_PLACEHOLDER,
  PERSONALIZZATO_ROLLUP_BANNER_URL,
  PERSONALIZZATO_ROLLUP_CTA_LABEL,
  PERSONALIZZATO_ROLLUP_DESCRIPTION,
  PERSONALIZZATO_ROLLUP_LABEL,
  PERSONALIZZATO_ROLLUP_PATH,
  PERSONALIZZATO_ROLLUP_WHATSAPP_DISPLAY,
  PERSONALIZZATO_ROLLUP_WHATSAPP_HREF,
} from '../data/personalizzatoCatalog'
import {
  clearSeoReady,
  markSeoReady,
  setCanonical,
  setMetaName,
  setMetaProperty,
  SITE_ORIGIN,
} from '../lib/siteSeo'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function PersonalizzatoRollupPage() {
  useEffect(() => {
    clearSeoReady()
    const title = `${PERSONALIZZATO_ROLLUP_LABEL} | ${PERSONALIZZATO_CATEGORY_LABEL} | Astro Forniture (asforniture.it)`
    const description = PERSONALIZZATO_ROLLUP_DESCRIPTION
    const canonical = `${SITE_ORIGIN}${PERSONALIZZATO_ROLLUP_PATH}`

    document.title = title
    setMetaName('description', description)
    setCanonical(canonical)
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', canonical)
    setMetaProperty('og:type', 'website')
    setMetaProperty('og:image', `${SITE_ORIGIN}${PERSONALIZZATO_ROLLUP_BANNER_URL}`)
    markSeoReady()
  }, [])

  return (
    <ServicePageChrome>
      <article
        className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        data-seo-page="personalizzato"
      >
        <div className="relative border-b border-slate-200 bg-slate-100">
          <img
            src={PERSONALIZZATO_ROLLUP_BANNER_URL}
            alt={PERSONALIZZATO_ROLLUP_BANNER_ALT}
            className="h-auto w-full object-cover object-center sm:max-h-[22rem]"
            width={1400}
            height={560}
            decoding="async"
          />
          {PERSONALIZZATO_ROLLUP_BANNER_IS_PLACEHOLDER ? (
            <p className="absolute bottom-3 left-3 rounded-lg bg-amber-500/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm sm:text-sm">
              Placeholder — artwork ufficiale mancante
            </p>
          ) : null}
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            {PERSONALIZZATO_CATEGORY_LABEL}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {PERSONALIZZATO_ROLLUP_LABEL}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {PERSONALIZZATO_ROLLUP_DESCRIPTION}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={PERSONALIZZATO_ROLLUP_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PERSONALIZZATO_ROLLUP_CTA_LABEL} — WhatsApp ${PERSONALIZZATO_ROLLUP_WHATSAPP_DISPLAY}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe57]"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              {PERSONALIZZATO_ROLLUP_CTA_LABEL}
            </a>
            <p className="text-sm text-slate-600 sm:ml-1">
              WhatsApp:{' '}
              <a
                href={PERSONALIZZATO_ROLLUP_WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-800 underline-offset-2 hover:underline"
                aria-label={`Apri WhatsApp ${PERSONALIZZATO_ROLLUP_WHATSAPP_DISPLAY} per un preventivo Roll-up`}
              >
                {PERSONALIZZATO_ROLLUP_WHATSAPP_DISPLAY}
              </a>
            </p>
          </div>

          <ServiceContactPanel serviceLabel={PERSONALIZZATO_ROLLUP_LABEL} />
        </div>
      </article>
    </ServicePageChrome>
  )
}
