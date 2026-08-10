import { Download, Headphones, Phone, Truck } from 'lucide-react'

import {
  COMPANY_LANDLINE_DISPLAY,
  COMPANY_LANDLINE_TEL,
} from '../../data/companyContacts'
import {
  ASTRO_MEDICAL_ASSISTANCE_NOTE,
  ASTRO_MEDICAL_CATALOG_CTA_LABEL,
  ASTRO_MEDICAL_CATALOG_PROMO_DESCRIPTION,
  ASTRO_MEDICAL_CATALOG_PROMO_TITLE,
  ASTRO_MEDICAL_SHIPPING_LEAD_LABEL,
  ASTRO_MEDICAL_SHIPPING_LEAD_TEXT,
  GIMA_COMPLETE_CATALOG_COVER_IMAGE_URL,
  GIMA_COMPLETE_CATALOG_PDF_URL,
} from '../../lib/astroMedicalShopCopy'
import { HoverImagePreviewTrigger } from './HoverImagePreviewTrigger'

type Props = {
  className?: string
}

/**
 * Banner catalogo GIMA + box assistenza + avviso tempi di spedizione (Astro Medical Shop).
 */
export function AstroMedicalShopInfoPanel({ className }: Props) {
  return (
    <div className={['mt-8 space-y-4', className].filter(Boolean).join(' ')}>
      <aside
        className="relative overflow-visible rounded-2xl border border-medical-200 bg-gradient-to-br from-medical-50 via-white to-teal-50/80 p-5 shadow-sm ring-1 ring-medical-100/80 sm:p-6"
        aria-labelledby="astro-medical-gima-catalog-heading"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-medical-200/30 blur-2xl"
          aria-hidden
        />
        <div className="relative z-[1] flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <a
              href={GIMA_COMPLETE_CATALOG_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto block w-[9.5rem] shrink-0 sm:mx-0 sm:w-[11rem]"
              aria-label={`Apri ${ASTRO_MEDICAL_CATALOG_CTA_LABEL}`}
              title={ASTRO_MEDICAL_CATALOG_CTA_LABEL}
            >
              <span className="relative block rotate-[-2deg] transition duration-300 group-hover:rotate-0 group-hover:scale-[1.02]">
                <img
                  src={GIMA_COMPLETE_CATALOG_COVER_IMAGE_URL}
                  alt="Copertina Catalogo Generale GIMA — Articoli & Apparecchi per Medicina"
                  width={220}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full rounded-lg border border-slate-200/80 object-cover shadow-[0_12px_28px_-8px_rgba(15,23,42,0.35),0_4px_10px_-4px_rgba(15,23,42,0.2)] ring-1 ring-black/5 transition group-hover:shadow-[0_18px_36px_-10px_rgba(15,23,42,0.4)]"
                />
                <span
                  className="pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-medical-950/75 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 sm:text-[11px]"
                  aria-hidden
                >
                  Apri PDF
                </span>
              </span>
            </a>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-medical-700">
                Catalogo GIMA
              </p>
              <h2
                id="astro-medical-gima-catalog-heading"
                className="mt-2 text-xl font-bold tracking-tight text-medical-950 sm:text-2xl"
              >
                {ASTRO_MEDICAL_CATALOG_PROMO_TITLE}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {ASTRO_MEDICAL_CATALOG_PROMO_DESCRIPTION}
              </p>
              <HoverImagePreviewTrigger
                href={GIMA_COMPLETE_CATALOG_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full sm:w-auto"
                triggerClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-medical-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-medical-800/20 transition hover:bg-medical-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500/50 focus-visible:ring-offset-2 sm:w-auto"
                placement="top"
                previewCaption="Catalogo Generale GIMA (PDF)"
              >
                <Download className="size-4 shrink-0" aria-hidden />
                {ASTRO_MEDICAL_CATALOG_CTA_LABEL}
              </HoverImagePreviewTrigger>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-medical-200/80 bg-white/90 p-4 shadow-sm sm:max-w-sm lg:mt-1">
            <p className="flex items-center gap-2 text-sm font-bold text-medical-900">
              <Truck className="size-4 shrink-0 text-medical-700" aria-hidden />
              🚚 {ASTRO_MEDICAL_SHIPPING_LEAD_LABEL}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {ASTRO_MEDICAL_SHIPPING_LEAD_TEXT}
            </p>
          </div>
        </div>
      </aside>

      <aside
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="astro-medical-assistenza-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-medical-700">
              <Headphones className="size-3.5" aria-hidden />
              Assistenza dedicata
            </p>
            <h2
              id="astro-medical-assistenza-heading"
              className="mt-2 text-lg font-bold text-slate-900 sm:text-xl"
            >
              Contatti & ordini speciali
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {ASTRO_MEDICAL_ASSISTANCE_NOTE}
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-medical-100 bg-medical-50/80 px-4 py-3 sm:min-w-[14rem]">
            <p className="text-xs font-semibold uppercase tracking-wide text-medical-800">Telefono</p>
            <a
              href={COMPANY_LANDLINE_TEL}
              className="mt-1 inline-flex items-center gap-2 text-lg font-bold tabular-nums text-medical-900 transition hover:text-medical-700"
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              {COMPANY_LANDLINE_DISPLAY}
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}
