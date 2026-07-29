import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import {
  COMPANY_EMAIL,
  COMPANY_MAILTO,
  COMPANY_PICKUP_MAPS_URL,
  COMPANY_SEATS,
  COMPANY_TRADE_NAME,
} from '../data/companyContacts'

const SEDE_IMAGE_SRC = '/images/sede-astro.jpg'

export function ContattiPage() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna alla home
        </Link>

        <header className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Servizio clienti</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contattaci</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Due sedi a disposizione per assistenza, preventivi e ritiro merce. Scrivici su WhatsApp o via email:
            rispondiamo rapidamente.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={SEDE_IMAGE_SRC}
              alt={`Sede ${COMPANY_TRADE_NAME}`}
              className="aspect-[4/3] w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <figcaption className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
              {COMPANY_TRADE_NAME} — sedi di Mantova e Porto Mantovano
            </figcaption>
          </figure>

          <div className="space-y-4">
            <a
              href={COMPANY_MAILTO}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                <Mail className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email generale</p>
                <p className="mt-0.5 truncate text-base font-semibold text-brand-900">{COMPANY_EMAIL}</p>
              </div>
            </a>

            {COMPANY_SEATS.map((seat) => (
              <article
                key={seat.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">{seat.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{seat.address}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <a
                    href={seat.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe57]"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    WhatsApp {seat.phoneDisplay}
                  </a>
                  <a
                    href={seat.telHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    <Phone className="size-4" aria-hidden />
                    Chiama {seat.phoneDisplay}
                  </a>
                </div>
              </article>
            ))}

            <a
              href={COMPANY_PICKUP_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-semibold text-brand-800 underline-offset-2 hover:underline"
            >
              Apri la mappa della sede di ritiro (Porto Mantovano)
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
