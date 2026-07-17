import { useState } from 'react'
import { FileText, ShoppingBag } from 'lucide-react'
import type { MedicalProduct } from '../../data/medicalProducts'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type MedicalProductCardProps = {
  product: MedicalProduct
}

export function MedicalProductCard({ product }: MedicalProductCardProps) {
  const [imgOk, setImgOk] = useState(true)
  const isQuote = product.cta === 'quote'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-medical-200 hover:shadow-md">
      <div className="relative aspect-square bg-gradient-to-br from-medical-50 to-slate-50">
        {imgOk && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-medical-300"
            aria-hidden
          >
            <ShoppingBag className="size-14 opacity-60" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-medical-700/90">
          Gima · {product.sku}
        </p>
        <p className="mt-1 text-[10px] leading-tight text-muted">
          {product.categoryPath.join(' · ')}
        </p>
        <h2 className="mt-1.5 text-base font-bold leading-snug text-slate-900">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
          {product.fullDescription}
        </p>
        <p className="mt-4 text-lg font-semibold tabular-nums text-medical-800">
          {eur.format(product.price)}
        </p>
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-medical-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-600"
        >
          {isQuote ? (
            <>
              <FileText className="size-4 shrink-0 opacity-90" aria-hidden />
              Aggiungi al preventivo
            </>
          ) : (
            <>
              <ShoppingBag className="size-4 shrink-0 opacity-90" aria-hidden />
              Acquista
            </>
          )}
        </button>
      </div>
    </article>
  )
}
