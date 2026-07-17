import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ShoppingCart } from 'lucide-react'
import type { OfficeProduct } from '../../types/officeProduct'
import { useCart } from '../../context/CartContext'
import { effectiveUnitPrice } from '../../lib/quantityPricing'
import { productDetailPath } from '../../lib/productRoutes'
import {
  ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY,
  isOfficeProductInBusteTrasparentiHub,
  OFFICE_CATALOG_DATA_REVISION,
} from '../../api/officeProductsSupabase'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import {
  buildTimbroDefaultCartVariant,
  isTimbroAziendeFarmacieProduct,
} from '../../lib/timbroAziendeFarmacieProduct'
import { isQuoteOnlyOfficeProduct } from '../../data/casseDitronProducts'
import { ProductQuoteRequestButton } from '../product/ProductQuoteRequestButton'

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

type OfficeProductCardProps = {
  product: OfficeProduct
  /** Elenco vetrina Macchine: solo marca, titolo, prezzo e CTA (niente riga categoria). */
  hideCategoryBadge?: boolean
  /** Card più compatta (griglie Macchine per Ufficio). */
  compactGrid?: boolean
  /** Non mostrare la riga «da N pz» sotto il prezzo (elenco vetrina). */
  suppressQuantityTierHint?: boolean
}

export function OfficeProductCard({
  product,
  hideCategoryBadge,
  compactGrid,
  suppressQuantityTierHint,
}: OfficeProductCardProps) {
  const [imgOk, setImgOk] = useState(true)
  const [justAdded, setJustAdded] = useState(false)
  const { addOfficeProduct } = useCart()

  useEffect(() => {
    setImgOk(true)
  }, [product.id, product.imageUrl])

  function handleAddToCart() {
    if (isTimbroAziendeFarmacieProduct(product)) {
      addOfficeProduct(product, 1, buildTimbroDefaultCartVariant())
    } else {
      addOfficeProduct(product)
    }
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1000)
  }

  const isQuoteOnly = isQuoteOnlyOfficeProduct(product)
  const isQuoteTimbro = isTimbroAziendeFarmacieProduct(product)
  const unitImponible = effectiveUnitPrice(
    product.price,
    product.quantityPriceTiers,
    1,
  )
  const quantityDiscountHint = product.quantityPriceTiers
    ?.slice()
    .sort((a, b) => a.minQuantity - b.minQuantity)[0]

  const detailTo = productDetailPath(product)
  const displayName = product.name.trim()
  const displayTitle = displayName
  const displayImageUrl = withOfficeImageCacheBust(product.imageUrl, OFFICE_CATALOG_DATA_REVISION)
  const categoryBadge = isOfficeProductInBusteTrasparentiHub(product)
    ? `Archivio > ${ARCHIVIO_BUSTE_TRASPARENTI_SUBCATEGORY}`
    : product.category

  const cardPad = compactGrid ? 'p-3' : 'p-5'
  const imgPad = compactGrid ? 'p-2' : 'p-4'
  const brandCls = compactGrid
    ? 'text-[10px] font-semibold uppercase tracking-wide text-slate-500'
    : 'text-xs font-semibold uppercase tracking-wide text-slate-500'
  const titleCls = compactGrid
    ? 'mt-0.5 min-h-0 text-sm font-bold leading-snug text-slate-900'
    : 'mt-1 min-h-[2.75rem] text-base font-bold leading-snug text-slate-900'
  const priceCls = compactGrid
    ? 'text-base font-bold tabular-nums text-brand-800'
    : 'text-lg font-bold tabular-nums text-brand-800'
  const btnCls = compactGrid
    ? 'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-800'
    : 'inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800'
  const articleRadius = compactGrid ? 'rounded-xl' : 'rounded-2xl'

  return (
    <article
      className={`flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md ${articleRadius}`}
    >
      <Link
        to={detailTo}
        className="relative block aspect-[4/3] bg-white outline-none ring-brand-500/30 focus-visible:ring-2"
      >
        {imgOk && displayImageUrl ? (
          <img
            key={product.id}
            src={displayImageUrl}
            alt={displayTitle}
            loading="lazy"
            decoding="async"
            className={`size-full object-contain ${imgPad}`}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-brand-200" aria-hidden>
            <FileText className={compactGrid ? 'size-10' : 'size-14'} strokeWidth={1.5} />
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${cardPad}`}>
        <p className={brandCls}>{product.brand}</p>
        <h3 className={titleCls}>
          <Link
            to={detailTo}
            title={displayTitle}
            className="line-clamp-2 block break-words text-slate-900 transition hover:text-brand-800 hover:underline"
          >
            {displayTitle}
          </Link>
        </h3>
        {!hideCategoryBadge ? (
          <p className="mt-2 text-sm font-medium text-slate-600">{categoryBadge}</p>
        ) : null}

        <div
          className={[
            'mt-auto flex flex-col gap-2.5 sm:flex-row sm:items-center',
            isQuoteOnly ? 'sm:justify-end' : 'sm:justify-between',
            hideCategoryBadge ? (compactGrid ? 'pt-2' : 'pt-3') : 'pt-4',
          ].join(' ')}
        >
          {!isQuoteOnly ? (
            <div>
              {isQuoteTimbro ? (
                <p className="text-sm font-semibold text-slate-700">Prezzo su preventivo</p>
              ) : (
                <>
                  <p className={priceCls}>
                    {eur.format(unitImponible)} + IVA
                  </p>
                  {!suppressQuantityTierHint && quantityDiscountHint ? (
                    <p className="mt-1 text-xs font-medium text-brand-700">
                      da {quantityDiscountHint.minQuantity} pz: {eur.format(quantityDiscountHint.unitPrice)}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
          {isQuoteOnly ? (
            <ProductQuoteRequestButton
              productName={displayTitle}
              compact={compactGrid}
              className="w-full"
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={
                isQuoteTimbro
                  ? `Richiedi preventivo per ${displayTitle}`
                  : `Aggiungi ${displayTitle} al carrello`
              }
              className={btnCls}
            >
              <ShoppingCart className={compactGrid ? 'size-3.5' : 'size-4'} aria-hidden />
              {justAdded
                ? 'Aggiunto'
                : isQuoteTimbro
                  ? 'Richiedi preventivo'
                  : 'Acquista'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
