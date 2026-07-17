import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, X } from 'lucide-react'
import { HeroSection } from '../components/home/HeroSection'
import { FeaturedCategorySpotlight } from '../components/home/FeaturedCategorySpotlight'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { HomeFeaturedProductsSection } from '../components/home/HomeFeaturedProductsSection'
import { AstroSalutePromoSection } from '../components/home/AstroSalutePromoSection'
import { fetchOfficeProductsFromSupabase, OFFICE_CATALOG_DATA_REVISION } from '../api/officeProductsSupabase'
import { isTimbroAziendeFarmacieProduct } from '../lib/timbroAziendeFarmacieProduct'
import { withOfficeImageCacheBust } from '../lib/officeImageCacheBust'
import { effectiveUnitPrice } from '../lib/quantityPricing'
import { productDetailPath } from '../lib/productRoutes'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import type { OfficeProduct } from '../types/officeProduct'

const WELCOME_MODAL_STORAGE_KEY = 'af:welcome-modal-shown:v207'
const HOME_EXCLUDED_PRODUCT_NAMES = new Set(
  [
    'Carta Color Copy - A3 - 160 gr - bianco - Mondi - conf. 250 fogli',
    'Carta Color Copy - A4 - 160 gr - bianco - Mondi - conf. 250 fogli',
  ].map((v) => normalizeLite(v)),
)
const HOME_EXCLUDED_PRODUCT_TOKEN_GROUPS: ReadonlyArray<ReadonlyArray<string>> = [
  ['carta', 'color', 'copy', 'a3', '160', 'mondi'],
  ['carta', 'color', 'copy', 'a4', '160', 'mondi'],
  ['color', 'copy', '160'],
]
const WELCOME_MODAL_TARGETS: ReadonlyArray<ReadonlyArray<string>> = [
  ['scatola', 'progetto', 'eurobox', '12', 'blu'],
  ['cartellina', '3', 'lembi', 'assortiti', 'starline'],
  ['carta', 'universal', 'navigator', 'a4'],
  ['evidenziatore', 'tratto', 'video', 'giallo'],
  ['buste', 'forate', 'medium', 'starline'],
  ['registratore', 'oxford', 'g84', 'rosso'],
]

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

function normalizeLite(value: string): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’'`]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function isExcludedHomeProductName(rawName: string): boolean {
  const name = normalizeLite(rawName)
  if (!name) return false
  if (HOME_EXCLUDED_PRODUCT_NAMES.has(name)) return true
  return HOME_EXCLUDED_PRODUCT_TOKEN_GROUPS.some((tokens) => tokens.every((t) => name.includes(t)))
}

function pickWelcomeProduct(products: readonly OfficeProduct[]): OfficeProduct | null {
  if (!products.length) return null
  const scored = products
    .filter(
      (product) =>
        !isExcludedHomeProductName(product.name) && !isTimbroAziendeFarmacieProduct(product),
    )
    .map((product) => {
      const hay = normalizeLite(`${product.name} ${(product.brand ?? '').trim()} ${product.description ?? ''}`)
      const score = WELCOME_MODAL_TARGETS.reduce((acc, tokens) => {
        const hit = tokens.every((token) => hay.includes(token))
        return acc + (hit ? 1 : 0)
      }, 0)
      return { product, score }
    })
    .filter((row) => row.score > 0)
    .map((row) => row.product)
  if (!scored.length) return null
  return scored[Math.floor(Math.random() * scored.length)] ?? null
}

function WelcomeModal() {
  const useRemote = isSupabaseConfigured()
  const [blocked, setBlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.sessionStorage.getItem(WELCOME_MODAL_STORAGE_KEY) === '1'
  })

  const query = useQuery({
    queryKey: ['home-welcome-modal', OFFICE_CATALOG_DATA_REVISION],
    queryFn: () => fetchOfficeProductsFromSupabase(null, null),
    enabled: useRemote && !blocked,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const featuredProduct = useMemo(() => pickWelcomeProduct(query.data ?? []), [query.data])
  const isOpen = useRemote && !blocked && Boolean(featuredProduct)

  function closeModal() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(WELCOME_MODAL_STORAGE_KEY, '1')
    }
    setBlocked(true)
  }

  useEffect(() => {
    if (!isOpen) return
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen])

  if (!isOpen || !featuredProduct || isExcludedHomeProductName(featuredProduct.name)) return null

  const imageUrl = (featuredProduct.imageUrl ?? '').trim()
  const unitPrice = effectiveUnitPrice(
    featuredProduct.price,
    featuredProduct.quantityPriceTiers,
    1,
  )

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Prodotto in primo piano"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"
        onClick={closeModal}
        aria-label="Chiudi popup benvenuto"
      />
      <section className="relative z-10 h-[80vh] w-[85vw] max-w-[1400px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Chiudi"
        >
          <X className="size-6" aria-hidden />
        </button>
        <div className="grid h-full gap-0 md:grid-cols-[1.35fr_1fr]">
          <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50/35 p-8 sm:p-10 md:min-h-0">
            {imageUrl ? (
              <img
                src={withOfficeImageCacheBust(imageUrl, OFFICE_CATALOG_DATA_REVISION)}
                alt={featuredProduct.name}
                className="h-full max-h-[72vh] w-full max-w-[820px] object-contain"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex h-full min-h-[260px] w-full max-w-[700px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-brand-200">
                <FileText className="size-28" strokeWidth={1.25} aria-hidden />
              </div>
            )}
          </div>
          <div className="flex h-full flex-col justify-center p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Offerta del giorno</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.7rem]">
              {featuredProduct.name}
            </h2>
            <p className="mt-7 text-[3.7rem] font-extrabold leading-none tracking-tight text-brand-800 sm:text-[4.4rem] lg:text-[5rem]">
              {eur.format(unitPrice)}
              <span className="ml-2 text-lg font-semibold text-slate-500 sm:text-xl">+ IVA</span>
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              Qualita professionale per il tuo ufficio, pronta a magazzino.
            </p>
            <div className="mt-10">
              <Link
                to={productDetailPath(featuredProduct)}
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-brand-800 sm:px-10 sm:py-5 sm:text-xl"
              >
                Scopri di più
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function HomePage() {
  return (
    <main>
      <WelcomeModal />
      <HeroSection />
      <FeaturedCategorySpotlight />
      <WhyChooseUs />
      <HomeFeaturedProductsSection />
      <AstroSalutePromoSection />
    </main>
  )
}
