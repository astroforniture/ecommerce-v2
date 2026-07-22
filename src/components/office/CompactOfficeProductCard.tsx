import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import type { OfficeProduct } from '../../types/officeProduct'
import { effectiveUnitPrice } from '../../lib/quantityPricing'
import { productDetailPath } from '../../lib/productRoutes'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type Props = {
  product: OfficeProduct
  /** Disabilita il link alla scheda (es. prodotti solo vetrina). */
  disableDetailLink?: boolean
}

export function CompactOfficeProductCard({ product, disableDetailLink }: Props) {
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    setImgOk(true)
  }, [product.id, product.imageUrl])
  const unitImponible = effectiveUnitPrice(product.price, product.quantityPriceTiers, 1)
  const displayTitle = product.name.trim()
  const imageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const to = productDetailPath(product)

  const inner = (
    <>
      <div className="relative aspect-[4/3] w-full shrink-0 bg-gradient-to-b from-slate-50 to-white">
        {imgOk && imageUrl ? (
          <img
            key={product.id}
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-slate-200" aria-hidden>
            <FileText className="size-10" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-1 px-2.5 pb-2.5 pt-1">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-snug text-slate-900 sm:text-[13px]">
          {displayTitle}
        </h3>
        <p className="text-xs font-bold tabular-nums text-brand-800 sm:text-sm">
          {eur.format(unitImponible)}
          <span className="ml-0.5 text-[10px] font-semibold text-slate-500">+ IVA</span>
        </p>
      </div>
    </>
  )

  if (disableDetailLink) {
    return (
      <div
        className={[
          'group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white',
          'shadow-sm transition-shadow duration-300 hover:border-slate-300 hover:shadow-md',
        ].join(' ')}
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={to}
      className={[
        'group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white',
        'shadow-sm transition-shadow duration-300 hover:border-slate-300 hover:shadow-md',
      ].join(' ')}
    >
      {inner}
    </Link>
  )
}
