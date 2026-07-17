import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import type { MedicalProduct } from '../../data/medicalProducts'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type Props = {
  product: MedicalProduct
}

export function MedicalProductCompactCard({ product }: Props) {
  const [imgOk, setImgOk] = useState(true)
  const isQuote = product.cta === 'quote'

  useEffect(() => {
    setImgOk(true)
  }, [product.sku, product.imageUrl])

  return (
    <article
      className={[
        'flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white',
        'shadow-sm transition-shadow duration-300 hover:border-medical-200/80 hover:shadow-md',
      ].join(' ')}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-gradient-to-b from-medical-50/60 to-white">
        {imgOk && product.imageUrl ? (
          <img
            key={product.sku}
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full object-contain p-2"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-medical-200" aria-hidden>
            <FileText className="size-10" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-1 px-2.5 pb-2.5 pt-1">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-snug text-slate-900 sm:text-[13px]">
          {product.name}
        </h3>
        {isQuote ? (
          <p className="text-xs font-semibold text-slate-600">Su preventivo</p>
        ) : (
          <p className="text-xs font-bold tabular-nums text-medical-800 sm:text-sm">
            {eur.format(product.price)}
            <span className="ml-0.5 text-[10px] font-semibold text-slate-500">+ IVA</span>
          </p>
        )}
      </div>
    </article>
  )
}
