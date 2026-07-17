import { ShieldCheck, Truck, Undo2 } from 'lucide-react'

const items = [
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

/** Riga icone di fiducia sotto il CTA acquisto (PDP standard unificata). */
export function OfficeProductDetailTrustStrip() {
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
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 sm:size-10">
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
