import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { OfficeProduct } from '../../types/officeProduct'

type GpsrFields = Pick<
  OfficeProduct,
  | 'manufacturerName'
  | 'manufacturerAddress'
  | 'importerName'
  | 'importerAddress'
  | 'euResponsibleName'
  | 'euResponsibleAddress'
  | 'safetyWarnings'
>

export function hasGpsrDisplayData(product: GpsrFields | null | undefined): boolean {
  if (!product) return false
  return Boolean(
    product.manufacturerName?.trim() ||
      product.manufacturerAddress?.trim() ||
      product.importerName?.trim() ||
      product.importerAddress?.trim() ||
      product.euResponsibleName?.trim() ||
      product.euResponsibleAddress?.trim() ||
      product.safetyWarnings?.trim(),
  )
}

type Props = {
  product: GpsrFields
  /** Se true, mostra comunque un riquadro informativo anche senza dati compilati. */
  showEmptyPlaceholder?: boolean
}

/** Blocco PDP: produttore / importatore / responsabile UE e avvertenze (GPSR). */
export function OfficeProductGpsrSection({ product, showEmptyPlaceholder = true }: Props) {
  const hasData = hasGpsrDisplayData(product)
  if (!hasData && !showEmptyPlaceholder) return null

  const rows: Array<{ label: string; value: string }> = []
  if (product.manufacturerName?.trim()) {
    rows.push({ label: 'Produttore', value: product.manufacturerName.trim() })
  }
  if (product.manufacturerAddress?.trim()) {
    rows.push({ label: 'Indirizzo produttore', value: product.manufacturerAddress.trim() })
  }
  if (product.importerName?.trim()) {
    rows.push({ label: 'Importatore', value: product.importerName.trim() })
  }
  if (product.importerAddress?.trim()) {
    rows.push({ label: 'Indirizzo importatore', value: product.importerAddress.trim() })
  }
  if (product.euResponsibleName?.trim()) {
    rows.push({
      label: 'Responsabile economico UE',
      value: product.euResponsibleName.trim(),
    })
  }
  if (product.euResponsibleAddress?.trim()) {
    rows.push({
      label: 'Indirizzo responsabile UE',
      value: product.euResponsibleAddress.trim(),
    })
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="product-gpsr-heading"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2
            id="product-gpsr-heading"
            className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg"
          >
            Sicurezza prodotto (GPSR)
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Informazioni su produttore, importatore / responsabile nell&apos;UE e avvertenze di
            sicurezza, ai sensi del Regolamento (UE) 2023/988. Dettagli generali:{' '}
            <Link
              to="/termini-condizioni-vendita#sicurezza-prodotti-gpsr"
              className="font-semibold text-brand-700 hover:underline"
            >
              Termini di vendita — Sicurezza prodotti
            </Link>
            .
          </p>
        </div>
      </div>

      {rows.length > 0 ? (
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-sm"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {row.label}
              </dt>
              <dd className="mt-0.5 whitespace-pre-wrap font-semibold text-slate-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {product.safetyWarnings?.trim() ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
          <h3 className="text-sm font-semibold text-amber-950">Avvertenze e note di sicurezza</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-amber-950/90">
            {product.safetyWarnings.trim()}
          </p>
        </div>
      ) : null}

      {!hasData ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          I dati di produttore/importatore e le avvertenze specifiche per questo articolo saranno
          pubblicati non appena disponibili dal fornitore. Per informazioni urgenti contatta
          l&apos;assistenza Astro Forniture.
        </p>
      ) : null}
    </section>
  )
}
