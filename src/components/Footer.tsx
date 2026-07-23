import { Award, Clock, Handshake, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  COMPANY_EMAIL,
  COMPANY_LANDLINE_DISPLAY,
  COMPANY_LANDLINE_TEL,
  COMPANY_MAILTO,
  COMPANY_MOBILE_DISPLAY,
  COMPANY_MOBILE_TEL,
  COMPANY_PICKUP_MAPS_URL,
  COMPANY_TRADE_NAME,
} from '../data/companyContacts'
import { SERVIZI_NAV_ITEMS } from '../data/serviziCatalog'

const FOOTER_VALUES: ReadonlyArray<{
  title: string
  description: string
  Icon: typeof Award
}> = [
  {
    title: 'Qualità',
    description: 'Selezioniamo solo prodotti affidabili dai migliori marchi.',
    Icon: Award,
  },
  {
    title: 'Affidabilità',
    description: 'Rispettiamo gli impegni, sempre.',
    Icon: Handshake,
  },
  {
    title: 'Tempestività',
    description: 'Consegne rapide e puntuali.',
    Icon: Clock,
  },
  {
    title: 'Assistenza dedicata',
    description: 'Un referente sempre a disposizione.',
    Icon: Headphones,
  },
]

const Footer = () => {
  return (
    <footer className="mt-auto w-full min-w-0 bg-white">
      <section
        className="w-full min-w-0 border-b border-slate-900/25 bg-[#0a1f3d] text-white"
        aria-labelledby="footer-valori-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-10 text-center sm:px-6 sm:py-11 lg:px-10 lg:py-12 xl:px-14">
          <p
            id="footer-valori-heading"
            className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 sm:text-sm"
          >
            I nostri valori
          </p>
          <ul className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-10 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-8">
            {FOOTER_VALUES.map(({ title, description, Icon }) => (
              <li key={title} className="flex flex-col items-center gap-3 text-center sm:gap-2.5">
                <span className="text-orange-400">
                  <Icon className="size-9 sm:size-8" strokeWidth={1.35} aria-hidden />
                </span>
                <span className="block text-xs font-bold uppercase tracking-wide text-white">{title}</span>
                <span className="block max-w-xs text-sm leading-relaxed text-white/90 sm:max-w-none">
                  {description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="w-full border-t border-slate-200 px-4 py-8 text-slate-700 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="space-y-1.5 text-sm leading-relaxed md:text-left">
            <p className="font-semibold text-slate-900">{COMPANY_TRADE_NAME}</p>
            <p>Astro Forniture di Borella Mario</p>
            <p>Sede: Str Cisa 7 - 46047 Porto M.no (MN)</p>
            <p className="text-xs text-slate-600 sm:text-sm">
              C.F.: BRLMRA78D11L750E - P.IVA: 02383560204
            </p>
            <p className="text-xs text-slate-600 sm:text-sm">
              SDI: T04ZHR3 - Tel.{' '}
              <a className="underline-offset-4 hover:underline" href={COMPANY_LANDLINE_TEL}>
                {COMPANY_LANDLINE_DISPLAY}
              </a>
            </p>
            <p className="text-xs text-slate-600 sm:text-sm">
              Cellulare / WhatsApp:{' '}
              <a className="underline-offset-4 hover:underline" href={COMPANY_MOBILE_TEL}>
                {COMPANY_MOBILE_DISPLAY}
              </a>
            </p>
            <p>
              Email:{' '}
              <a className="underline-offset-4 hover:underline" href={COMPANY_MAILTO}>
                {COMPANY_EMAIL}
              </a>
            </p>
            <p className="text-xs text-slate-600 sm:text-sm">
              Ritiro in sede:{' '}
              <a
                className="underline-offset-4 hover:underline"
                href={COMPANY_PICKUP_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apri mappa Google
              </a>
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">Servizi</p>
            <ul className="mt-3 space-y-2 text-sm">
              {SERVIZI_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link className="text-slate-700 underline-offset-4 hover:underline" to={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-slate-700 underline-offset-4 hover:underline"
                  to="/servizi/rilegature"
                >
                  Rilegature Notarili e Tesi
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
