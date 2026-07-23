import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'

import {
  COMPANY_ADDRESS_SHORT,
  COMPANY_EMAIL,
  COMPANY_LANDLINE_DISPLAY,
  COMPANY_LANDLINE_TEL,
  COMPANY_MAILTO,
  COMPANY_MOBILE_DISPLAY,
  COMPANY_MOBILE_TEL,
  COMPANY_PICKUP_MAPS_EMBED_URL,
  COMPANY_PICKUP_MAPS_URL,
  COMPANY_TRADE_NAME,
  companyWhatsappHref,
} from '../../data/companyContacts'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type Props = {
  serviceLabel: string
}

/**
 * Contatti aziendali + ritiro in sede, condivisi in fondo a ogni pagina servizio.
 */
export function ServiceContactPanel({ serviceLabel }: Props) {
  const waHref = companyWhatsappHref(
    `Ciao Astro Forniture, vorrei informazioni sul servizio ${serviceLabel}.`,
  )

  return (
    <aside
      className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm sm:p-6"
      aria-label="Contatti e ritiro in sede"
    >
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Contatti e ritiro in sede</h2>
      <p className="mt-1 text-sm text-slate-600">{COMPANY_TRADE_NAME}</p>

      <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
        <li className="flex items-start gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
          <span>
            Fisso:{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_LANDLINE_TEL}>
              {COMPANY_LANDLINE_DISPLAY}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
          <span>
            Cellulare / WhatsApp:{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_MOBILE_TEL}>
              {COMPANY_MOBILE_DISPLAY}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Mail className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden />
          <span>
            Email:{' '}
            <a className="font-semibold text-brand-800 underline-offset-2 hover:underline" href={COMPANY_MAILTO}>
              {COMPANY_EMAIL}
            </a>
          </span>
        </li>
      </ul>

      <div className="ritiro-sede-container mt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="text-red-700" aria-hidden>
            📍
          </span>
          <span>
            <strong>Ritiro in sede:</strong> {COMPANY_ADDRESS_SHORT}
          </span>
          <a
            href={COMPANY_PICKUP_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-red-800 underline hover:text-red-900"
          >
            Apri mappa Google
          </a>
        </div>

        <div className="mt-3 h-60 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <iframe
            title="Mappa Ritiro in Sede - Astro Forniture"
            src={COMPANY_PICKUP_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1ebe57]"
        >
          <WhatsAppIcon className="size-5 shrink-0" />
          WhatsApp
        </a>
        <a
          href={COMPANY_MAILTO}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Mail className="size-4 shrink-0" aria-hidden />
          Scrivi una email
        </a>
      </div>
    </aside>
  )
}

type LayoutProps = {
  children: ReactNode
  backHref?: string
  backLabel?: string
}

export function ServicePageChrome({
  children,
  backHref = '/',
  backLabel = 'Torna alla home',
}: LayoutProps) {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/40 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          ← {backLabel}
        </Link>
        {children}
      </div>
    </main>
  )
}
