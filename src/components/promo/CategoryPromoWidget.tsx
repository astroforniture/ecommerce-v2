import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, MessageCircle, X } from 'lucide-react'
import { OFFICE_CATALOG_DATA_REVISION } from '../../api/officeProductsSupabase'
import { withOfficeImageCacheBust } from '../../lib/officeImageCacheBust'
import {
  categoryPromoWhatsappHref,
  fetchCategoryPromoData,
  type CategoryPromoOffer,
} from '../../lib/categoryPromoProducts'
import { productDetailPath } from '../../lib/productRoutes'
import { useCategoryPageContext } from '../../lib/useCategoryPageContext'
import type { OfficeProduct } from '../../types/officeProduct'

const ROTATE_MS = 8_000
const FADE_MS = 350
const DISMISS_STORAGE_KEY = 'af:category-promo-widget-dismissed:v1'

type PromoSlide = 'bestseller' | 'offer' | 'b2b'

const SLIDE_ORDER: PromoSlide[] = ['bestseller', 'offer', 'b2b']

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

function dismissKey(categoryLabel: string): string {
  return `${DISMISS_STORAGE_KEY}:${categoryLabel.trim().toLowerCase()}`
}

function ProductThumb({ product }: { product: OfficeProduct }) {
  const imageUrl = (product.imageUrl ?? '').trim()
  return (
    <div className="mt-3.5 flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        {imageUrl ? (
          <img
            src={withOfficeImageCacheBust(imageUrl, OFFICE_CATALOG_DATA_REVISION)}
            alt=""
            className="size-full object-contain p-1"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-sm text-slate-400">N/D</span>
        )}
      </div>
      <p className="line-clamp-3 text-base font-medium leading-snug text-slate-800">{product.name}</p>
    </div>
  )
}

function OfferSlideBody({ offer }: { offer: CategoryPromoOffer }) {
  return (
    <>
      <ProductThumb product={offer.product} />
      <p className="mt-3.5 text-base text-slate-600">
        <span className="mr-2 text-slate-400 line-through">{eur.format(offer.originalPrice)}</span>
        <span className="text-xl font-bold text-red-600">{eur.format(offer.salePrice)}</span>
        <span className="ml-1 text-sm text-slate-500">+ IVA / pezzo</span>
      </p>
      <Link
        to={productDetailPath(offer.product)}
        className="mt-3.5 inline-flex items-center gap-2 text-base font-semibold text-brand-800 hover:text-brand-950"
      >
        Vedi offerta
        <ArrowRight className="size-5" aria-hidden />
      </Link>
    </>
  )
}

export function CategoryPromoWidget() {
  const categoryPage = useCategoryPageContext()
  const [slideIndex, setSlideIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  const categoryLabel = categoryPage?.categoryLabel ?? ''

  useEffect(() => {
    if (!categoryLabel) return
    if (typeof window === 'undefined') return
    setDismissed(window.sessionStorage.getItem(dismissKey(categoryLabel)) === '1')
  }, [categoryLabel])

  const promoQuery = useQuery({
    queryKey: [
      'category-promo-widget',
      OFFICE_CATALOG_DATA_REVISION,
      categoryPage?.categoryQueryParam ?? '',
      categoryPage?.subcategory ?? '',
    ],
    queryFn: () =>
      fetchCategoryPromoData(categoryPage!.categoryQueryParam, categoryPage!.subcategory),
    enabled: Boolean(categoryPage) && !dismissed,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!categoryPage || dismissed) return

    let fadeTimeoutId: number | undefined
    const intervalId = window.setInterval(() => {
      setVisible(false)
      fadeTimeoutId = window.setTimeout(() => {
        setSlideIndex((i) => (i + 1) % SLIDE_ORDER.length)
        setVisible(true)
      }, FADE_MS)
    }, ROTATE_MS)

    return () => {
      window.clearInterval(intervalId)
      if (fadeTimeoutId !== undefined) window.clearTimeout(fadeTimeoutId)
    }
  }, [categoryPage, dismissed])

  useEffect(() => {
    setSlideIndex(0)
    setVisible(true)
  }, [categoryPage?.categoryQueryParam, categoryPage?.subcategory])

  if (!categoryPage || dismissed) return null

  const slide = SLIDE_ORDER[slideIndex]!
  const { bestseller, offer } = promoQuery.data ?? { bestseller: null, offer: null }

  let title = ''
  let body: ReactNode = null

  if (slide === 'bestseller') {
    title = `🔥 Il più venduto in ${categoryLabel}`
    if (promoQuery.isPending) {
      body = <p className="mt-3.5 text-base text-slate-500">Caricamento in corso…</p>
    } else if (bestseller) {
      body = (
        <>
          <ProductThumb product={bestseller} />
          <Link
            to={productDetailPath(bestseller)}
            className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-brand-800"
          >
            Vedi prodotto
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </>
      )
    } else {
      body = (
        <p className="mt-3.5 text-base text-slate-600">
          Scopri i prodotti più richiesti in questa categoria nel nostro catalogo.
        </p>
      )
    }
  } else if (slide === 'offer') {
    title = `⚡ Offerta speciale ${categoryLabel}`
    if (promoQuery.isPending) {
      body = <p className="mt-3.5 text-base text-slate-500">Caricamento in corso…</p>
    } else if (offer) {
      body = <OfferSlideBody offer={offer} />
    } else {
      body = (
        <p className="mt-3.5 text-base text-slate-600">
          Consulta il catalogo per le promozioni attive su questa categoria.
        </p>
      )
    }
  } else {
    title = '💼 Forniture Continuative?'
    body = (
      <>
        <p className="mt-3.5 text-base leading-relaxed text-slate-600">
          Richiedi un listino aziendale personalizzato su misura per la tua attività.
        </p>
        <a
          href={categoryPromoWhatsappHref(categoryLabel)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#25D366] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
        >
          <MessageCircle className="size-5" aria-hidden />
          Richiedi listino su Whatsapp
        </a>
      </>
    )
  }

  function handleDismiss() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(dismissKey(categoryLabel), '1')
    }
    setDismissed(true)
  }

  return (
    <aside
      className="fixed bottom-5 right-5 z-[90] w-[min(100vw-2.5rem,26.5rem)] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10"
      aria-live="polite"
      aria-label="Promozione categoria"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Chiudi promozione"
      >
        <X className="size-4" aria-hidden />
      </button>

      <div
        className="pr-7 transition-opacity ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        <p className="text-lg font-bold leading-snug text-slate-900">{title}</p>
        {body}
      </div>
    </aside>
  )
}
