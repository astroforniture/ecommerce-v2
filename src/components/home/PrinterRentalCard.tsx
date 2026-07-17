import { Link } from 'react-router-dom'
import { ImageOff, Printer } from 'lucide-react'
import type { PrinterRentalItem } from '../../types/printer-rental'

type PrinterRentalCardProps = {
  item: PrinterRentalItem
}

export function PrinterRentalCard({ item }: PrinterRentalCardProps) {
  const { specs, subscription } = item
  const pct = Math.min(
    100,
    Math.round((subscription.includedPrints / subscription.printsBarMax) * 100),
  )

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.model}
            className="size-full object-cover"
          />
        ) : (
          <div
            className="flex size-full flex-col items-center justify-center gap-2 text-slate-400"
            aria-hidden
          >
            <Printer className="size-14 text-brand-300" />
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <ImageOff className="size-3.5" />
              Aggiungi foto in data
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold tracking-tight text-slate-900">
          {item.model}
        </h3>
        {item.tagline ? (
          <p className="mt-1 text-sm text-muted">{item.tagline}</p>
        ) : null}

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Prestazioni">
          <li className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800">
            {specs.ppmMono} ppm B/N
          </li>
          {specs.ppmColor != null && specs.ppmColor > 0 ? (
            <li className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800">
              {specs.ppmColor} ppm colore
            </li>
          ) : null}
          <li className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
            {specs.resolution}
          </li>
        </ul>

        <div className="mt-6 rounded-xl border border-slate-100 bg-surface p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Stampe incluse nel canone
              {subscription.periodLabel ? (
                <span className="font-normal normal-case text-muted">
                  {' '}
                  ({subscription.periodLabel})
                </span>
              ) : null}
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-brand-800">
            {subscription.includedPrints.toLocaleString('it-IT')}
          </p>
          <div
            className="mt-3"
            role="img"
            aria-label={`Barra utilizzo: ${pct} percento rispetto al massimo di riferimento`}
          >
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Riferimento visivo: fino a{' '}
              {subscription.printsBarMax.toLocaleString('it-IT')} stampe (scala
              configurabile in <code className="text-[11px]">printers.ts</code>)
            </p>
          </div>
        </div>

        <Link
          to="/contatti-toner"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-brand-200 bg-white py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
        >
          Richiedi preventivo
        </Link>
      </div>
    </article>
  )
}
