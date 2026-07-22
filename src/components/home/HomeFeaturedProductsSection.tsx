import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  fetchOfficeProductsShowcase,
  OFFICE_CATALOG_DATA_REVISION,
} from '../../api/officeProductsSupabase'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { getInjectedLocalCatalogProducts } from '../../lib/timbroAziendeFarmacieProduct'
import { isHomeFeaturedShowcaseProduct } from '../../lib/isHomeFeaturedShowcaseProduct'
import { CompactOfficeProductCard } from '../office/CompactOfficeProductCard'
import type { OfficeProduct } from '../../types/officeProduct'

const CAROUSEL_INTERVAL_MS = 3000
const SCROLL_GAP_PX = 12
const REMOTE_SHOWCASE_TIMEOUT_MS = 8_000

const cardShellClass =
  'snap-start flex-none min-w-[42vw] max-w-[42vw] sm:min-w-[160px] sm:max-w-[160px] md:min-w-[150px] md:max-w-[150px] lg:min-w-[calc((100%-3.75rem)/6)] lg:max-w-[calc((100%-3.75rem)/6)] transition-opacity duration-500'

function shuffledProducts<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function mergeFeaturedProducts(
  local: ReturnType<typeof getInjectedLocalCatalogProducts>,
  remote: readonly OfficeProduct[],
): OfficeProduct[] {
  const byKey = new Map<string, OfficeProduct>()
  const keyOf = (p: OfficeProduct) =>
    (p.producerCode || p.id).trim().toLowerCase() || String(p.id)

  for (const p of local) {
    if (isHomeFeaturedShowcaseProduct(p)) byKey.set(keyOf(p), p)
  }
  for (const p of remote) {
    if (!isHomeFeaturedShowcaseProduct(p)) continue
    const k = keyOf(p)
    if (!byKey.has(k)) byKey.set(k, p)
  }
  return [...byKey.values()]
}

function getLocalFeaturedProducts(): OfficeProduct[] {
  return mergeFeaturedProducts(getInjectedLocalCatalogProducts(), [])
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(fallback), ms)
    promise.then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      () => {
        window.clearTimeout(timer)
        resolve(fallback)
      },
    )
  })
}

export function HomeFeaturedProductsSection() {
  const useRemote = isSupabaseConfigured()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstSlideRef = useRef<HTMLDivElement>(null)
  const [pauseScroll, setPauseScroll] = useState(false)

  const localFeatured = useMemo(() => getLocalFeaturedProducts(), [])

  const query = useQuery({
    queryKey: ['home-products-grid', OFFICE_CATALOG_DATA_REVISION],
    queryFn: async () => {
      const local = getInjectedLocalCatalogProducts()
      if (!useRemote) return mergeFeaturedProducts(local, [])
      try {
        const remote = await withTimeout(
          fetchOfficeProductsShowcase(96),
          REMOTE_SHOWCASE_TIMEOUT_MS,
          [],
        )
        return mergeFeaturedProducts(local, remote)
      } catch {
        return mergeFeaturedProducts(local, [])
      }
    },
    /** Mostra subito i prodotti locali: niente skeleton infinito se Supabase è lento/bloccato. */
    initialData: localFeatured,
    initialDataUpdatedAt: 0,
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const products = query.data ?? localFeatured
  const randomizedProducts = useMemo(() => shuffledProducts(products), [products])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || randomizedProducts.length === 0 || pauseScroll) return

    const tick = () => {
      const slide = firstSlideRef.current
      const step = slide ? slide.offsetWidth + SCROLL_GAP_PX : 180
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      if (el.scrollLeft >= max - 2) {
        el.scrollTo({ left: 0, behavior: 'auto' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }

    const id = window.setInterval(tick, CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [randomizedProducts.length, pauseScroll])

  if (!randomizedProducts.length && query.isPending) {
    return (
      <section className="border-t border-slate-100 bg-slate-50/40 py-10 sm:py-12" aria-busy="true">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-5 flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 min-w-[140px] flex-none animate-pulse rounded-xl bg-slate-200/80"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!randomizedProducts.length) return null

  return (
    <section className="border-t border-slate-100 bg-slate-50/40 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Prodotti in evidenza
          </h2>
          <Link
            to="/office-products?category=Cancelleria"
            className="text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Catalogo cancelleria
          </Link>
        </div>

        <div
          className="relative mt-5"
          onMouseEnter={() => setPauseScroll(true)}
          onMouseLeave={() => setPauseScroll(false)}
        >
          <div
            ref={scrollerRef}
            className={[
              'flex gap-3 overflow-x-auto scroll-smooth pb-1',
              'snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]',
              '[&::-webkit-scrollbar]:hidden',
            ].join(' ')}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Prodotti in evidenza cancelleria e ufficio, scorrimento automatico ogni 3 secondi"
          >
            {randomizedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                ref={index === 0 ? firstSlideRef : undefined}
                className={cardShellClass}
              >
                <CompactOfficeProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
