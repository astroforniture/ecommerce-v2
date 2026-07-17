import { PrinterRentalCard } from './PrinterRentalCard'
import { printerRentals } from '../../data/printers'

export function PrinterRentalSection() {
  return (
    <section
      id="noleggio-stampanti"
      className="border-t border-slate-100 bg-white pb-8 pt-16 sm:pb-10 sm:pt-20"
      aria-labelledby="rental-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Feature chiave
          </p>
          <h2
            id="rental-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Noleggio stampanti
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Canoni chiari, stampe incluse e hardware aggiornato. Sostituisci i modelli
            sotto con le specifiche reali: i dati vivono in{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              src/data/printers.ts
            </code>
            .
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {printerRentals.map((p) => (
            <li key={p.id}>
              <PrinterRentalCard item={p} />
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
