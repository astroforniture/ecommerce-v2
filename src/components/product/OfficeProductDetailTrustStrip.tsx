import { CheckCircle2, ShieldCheck, Truck, Undo2 } from 'lucide-react'

import {
  ASTRO_MEDICAL_SHIPPING_LEAD_LABEL,
  ASTRO_MEDICAL_SHIPPING_LEAD_TEXT,
} from '../../lib/astroMedicalShopCopy'
import { IMMEDIATE_AVAILABILITY_LABEL } from '../../lib/agendeCatalog'

const defaultItems = [
  {
    Icon: Truck,
    title: 'Spedizione Veloce',
    subtitle: 'Consegna rapida e tracciata',
  },
  {
    Icon: ShieldCheck,
    title: 'Pagamenti Sicuri',
    subtitle: 'Transazioni protette',
  },
  {
    Icon: Undo2,
    title: 'Reso Facile',
    subtitle: 'Assistenza dedicata',
  },
] as const

const medicalItems = [
  {
    Icon: Truck,
    title: ASTRO_MEDICAL_SHIPPING_LEAD_LABEL,
    subtitle: ASTRO_MEDICAL_SHIPPING_LEAD_TEXT,
  },
  {
    Icon: ShieldCheck,
    title: 'Pagamenti Sicuri',
    subtitle: 'Transazioni protette',
  },
  {
    Icon: Undo2,
    title: 'Reso Facile',
    subtitle: 'Assistenza dedicata',
  },
] as const

const immediateItems = [
  {
    Icon: CheckCircle2,
    title: IMMEDIATE_AVAILABILITY_LABEL,
    subtitle: 'Merce in pronta consegna',
  },
  {
    Icon: ShieldCheck,
    title: 'Pagamenti Sicuri',
    subtitle: 'Transazioni protette',
  },
  {
    Icon: Undo2,
    title: 'Reso Facile',
    subtitle: 'Assistenza dedicata',
  },
] as const

type Props = {
  /** Linea Astro Medical: avviso consegna 5 gg lavorativi su ordinazione. */
  astroMedicalLeadTimes?: boolean
  /** Categoria Agende: giacenza in pronta consegna. */
  immediateAvailability?: boolean
}

/** Riga icone di fiducia sotto il CTA acquisto (PDP standard unificata). */
export function OfficeProductDetailTrustStrip({
  astroMedicalLeadTimes = false,
  immediateAvailability = false,
}: Props) {
  const items = astroMedicalLeadTimes
    ? medicalItems
    : immediateAvailability
      ? immediateItems
      : defaultItems

  return (
    <div
      className="mt-4 grid gap-3 border-t border-slate-200/90 pt-4 sm:grid-cols-3"
      aria-label="Servizi e garanzie"
    >
      {items.map(({ Icon, title, subtitle }) => (
        <div
          key={title}
          className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white/80 px-3 py-2.5 sm:flex-col sm:items-center sm:text-center"
        >
          <span
            className={[
              'flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10',
              astroMedicalLeadTimes && title === ASTRO_MEDICAL_SHIPPING_LEAD_LABEL
                ? 'bg-medical-50 text-medical-800'
                : immediateAvailability && title === IMMEDIATE_AVAILABILITY_LABEL
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-brand-50 text-brand-700',
            ].join(' ')}
          >
            <Icon className="size-[1.05rem] sm:size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight text-slate-800">{title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
