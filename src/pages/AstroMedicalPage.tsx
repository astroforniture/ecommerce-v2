import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { OfficeProductCard } from '../components/office/OfficeProductCard'
import { AstroMedicalSubcategoryNav } from '../components/astroMedical/AstroMedicalSubcategoryNav'
import { AstroMedicalSearchBar } from '../components/astroMedical/AstroMedicalSearchBar'
import { AstroMedicalShopInfoPanel } from '../components/astroMedical/AstroMedicalShopInfoPanel'
import { AstroMedicalHealthcareDisclaimer } from '../components/astroMedical/AstroMedicalHealthcareDisclaimer'
import { AstroMedicalPromoVideoBanner } from '../components/astroMedical/AstroMedicalPromoVideoBanner'
import { HoverImagePreviewTrigger } from '../components/astroMedical/HoverImagePreviewTrigger'
import { useOfficeCatalog } from '../hooks/useOfficeCatalog'
import { normalizeOfficeProductCategory } from '../lib/officeCategories'
import { mergeLineaAstroMedicalCatalog } from '../data/lineaAstroMedicalCombined'
import {
  LINEA_ASTRO_MEDICAL_CATEGORY,
  lineaAstroMedicalIHealthListingPath,
} from '../data/iHealthAstroMedicalProducts'
import {
  firstAstroMedicalSubcategoryWithProducts,
  matchesAstroMedicalSubcategoryFilter,
  normalizeAstroMedicalNavFilter,
} from '../lib/astroMedicalSubcategories'
import type { OfficeProduct } from '../types/officeProduct'
import { normalizeSearchText } from '../lib/officeSearchRelevance'

const MEDICAL_SEARCH_SESSION_KEY = 'af:astro-medical-listing-search:v1'

function readStoredMedicalSearch(): string {
  if (typeof window === 'undefined') return ''
  try {
    return String(window.sessionStorage.getItem(MEDICAL_SEARCH_SESSION_KEY) ?? '').trim()
  } catch {
    return ''
  }
}

function writeStoredMedicalSearch(value: string) {
  if (typeof window === 'undefined') return
  try {
    const v = value.trim()
    if (v) window.sessionStorage.setItem(MEDICAL_SEARCH_SESSION_KEY, v)
    else window.sessionStorage.removeItem(MEDICAL_SEARCH_SESSION_KEY)
  } catch {
    /* ignore quota / private mode */
  }
}

/** Match listing: nome o SKU/codice GIMA contengono la query (case-insensitive). */
function astroMedicalProductMatchesListingQuery(product: OfficeProduct, rawQuery: string): boolean {
  const q = normalizeSearchText(rawQuery)
  if (!q) return true
  const gimaFeature = String(product.mainFeatures?.['Codice GIMA'] ?? '').trim()
  const skuParts = [product.producerCode, product.id, gimaFeature]
    .map((v) => String(v ?? '').trim())
    .filter(Boolean)
  const skuHaystack = normalizeSearchText(
    skuParts
      .flatMap((part) => {
        const bare = part.replace(/^gima-/i, '')
        return bare === part ? [part] : [part, bare]
      })
      .join(' '),
  )
  const nameHaystack = normalizeSearchText(product.name ?? '')
  const categoryHaystack = normalizeSearchText(
    `${product.category ?? ''} ${product.subcategory ?? ''}`,
  )
  return nameHaystack.includes(q) || skuHaystack.includes(q) || categoryHaystack.includes(q)
}

export function AstroMedicalPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const subcategoryFromUrl = (searchParams.get('subcategory') ?? '').trim()
  const selectedSubcategory = normalizeAstroMedicalNavFilter(subcategoryFromUrl)
  const searchFromUrl = (searchParams.get('search') ?? searchParams.get('q') ?? '').trim()
  const brandFromUrl = (searchParams.get('brand') ?? '').trim()

  /** Stato locale = fonte di verità per il filtro griglia (digitazione + Invio + ritorno da PDP). */
  const [searchQuery, setSearchQuery] = useState(() => searchFromUrl || readStoredMedicalSearch())

  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
      writeStoredMedicalSearch(searchFromUrl)
      return
    }
    const stored = readStoredMedicalSearch()
    if (stored) setSearchQuery(stored)
  }, [searchFromUrl])

  const { products, isLoading } = useOfficeCatalog(LINEA_ASTRO_MEDICAL_CATEGORY, null)
  const catalog = useMemo(() => {
    const normalized = products.map((p) => ({
      ...p,
      category: normalizeOfficeProductCategory(p.category),
    }))
    return mergeLineaAstroMedicalCatalog(normalized)
  }, [products])

  const catalogLoading = isLoading && catalog.length === 0
  const defaultSubcategory = useMemo(
    () => firstAstroMedicalSubcategoryWithProducts(catalog),
    [catalog],
  )

  const listingSearch = searchQuery.trim()

  // Nessuna macro in URL → attiva di default la prima con prodotti (es. Diagnostica).
  // Con una ricerca attiva non forziamo la macro, così i match restano visibili su tutto il catalogo medico.
  useEffect(() => {
    if (catalogLoading || !defaultSubcategory) return
    if (selectedSubcategory) return
    if (listingSearch) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('subcategory', defaultSubcategory)
        return next
      },
      { replace: true },
    )
  }, [catalogLoading, defaultSubcategory, selectedSubcategory, listingSearch, setSearchParams])

  const filteredList = useMemo(() => {
    let list = catalog
    if (selectedSubcategory && !listingSearch) {
      list = list.filter((p) => matchesAstroMedicalSubcategoryFilter(p, selectedSubcategory))
    }
    if (brandFromUrl) {
      const wanted = brandFromUrl.toLowerCase()
      list = list.filter((p) => {
        const productBrand = (p.brand ?? '').trim().toLowerCase()
        if (!productBrand) return false
        return (
          productBrand === wanted ||
          productBrand.includes(wanted) ||
          wanted.includes(productBrand)
        )
      })
    }
    if (listingSearch) {
      list = list.filter((p) => astroMedicalProductMatchesListingQuery(p, listingSearch))
    }
    return list
  }, [catalog, selectedSubcategory, brandFromUrl, listingSearch])

  function setMedicalSubcategory(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('subcategory', value)
      return next
    })
  }

  function setMedicalSearch(value: string) {
    setSearchQuery(value)
    writeStoredMedicalSearch(value)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('q')
      const v = value.trim()
      if (v) next.set('search', v)
      else next.delete('search')
      return next
    }, { replace: true })
  }

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-medical-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-medical-700 transition hover:text-medical-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna alla home
        </Link>

        <AstroMedicalPromoVideoBanner className="mt-8" />

        <header className="border-b border-medical-100 pb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            <div className="flex shrink-0 flex-col items-start gap-3">
              <span className="flex h-20 w-auto max-w-[220px] items-center justify-center rounded-2xl bg-white p-3 shadow-lg shadow-medical-600/15 ring-1 ring-medical-100">
                <img
                  src="/images/logo-gima-ita.jpg"
                  alt="Logo GIMA"
                  className="max-h-14 w-auto max-w-full object-contain"
                  width={200}
                  height={56}
                  loading="eager"
                  decoding="async"
                />
              </span>
              <p className="max-w-[240px] text-xs font-semibold leading-snug text-medical-800">
                Prodotti originali GIMA - Distribuzione riservata ai rivenditori
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-medical-600">
                Linea specializzata
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-medical-950 sm:text-5xl">
                {LINEA_ASTRO_MEDICAL_CATEGORY}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Catalogo unificato (articoli medicali e elettromedicali iHealth): prezzi imponibili IVA
                esclusa. La scheda prodotto usa lo stesso layout del catalogo office (prezzo, quantità,
                trust, descrizione e correlati).
              </p>
              <div className="mt-4 text-sm text-slate-600">
                <HoverImagePreviewTrigger
                  as="link"
                  to={lineaAstroMedicalIHealthListingPath()}
                  className="inline-flex"
                  triggerClassName="font-semibold text-medical-800 underline decoration-medical-300 underline-offset-2 transition hover:text-medical-950"
                  placement="top"
                  previewCaption="Catalogo Astro Medical"
                >
                  Vedi nel catalogo Prodotti Ufficio
                </HoverImagePreviewTrigger>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-medical-700">
              Ricerca catalogo GIMA
            </p>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Trova subito un articolo per nome, descrizione o codice SKU.
            </p>
            <div className="mt-5 w-full max-w-3xl">
              <AstroMedicalSearchBar
                variant="hero"
                value={searchQuery}
                onChange={setMedicalSearch}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Ricerca esclusiva sul catalogo sanitario (separata dallo shop generale).
            </p>
          </div>
        </header>

        <AstroMedicalShopInfoPanel />

        <section className="py-10" aria-labelledby="astro-medical-catalog-heading">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="astro-medical-catalog-heading"
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              Catalogo prodotti
            </h2>
            <p className="inline-flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {catalogLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-medical-600" aria-hidden />
                  Caricamento…
                </>
              ) : (
                <>
                  {filteredList.length} articol{filteredList.length === 1 ? 'o' : 'i'}
                  {selectedSubcategory && !listingSearch ? (
                    <span className="text-medical-700">
                      {' '}
                      · {selectedSubcategory}
                    </span>
                  ) : null}
                  {searchQuery.trim() ? (
                    <span className="text-medical-700"> · ricerca “{searchQuery.trim()}”</span>
                  ) : null}
                  {brandFromUrl ? (
                    <span className="text-medical-700"> · brand “{brandFromUrl}”</span>
                  ) : null}
                </>
              )}
            </p>
          </div>

          {!catalogLoading ? (
            <AstroMedicalSubcategoryNav
              className="mb-8"
              products={catalog}
              selectedSubcategory={selectedSubcategory}
              onSelect={setMedicalSubcategory}
            />
          ) : null}

          {catalogLoading ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="h-72 animate-pulse rounded-xl bg-medical-100/50" aria-hidden />
              ))}
            </ul>
          ) : filteredList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-medical-200 bg-medical-50/50 px-6 py-12 text-center">
              <p className="text-base font-medium text-slate-800">
                {searchQuery.trim()
                  ? `Nessun prodotto trovato per “${searchQuery.trim()}”.`
                  : 'Nessun prodotto in questa categoria.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    setMedicalSearch('')
                  } else if (defaultSubcategory) {
                    setMedicalSubcategory(defaultSubcategory)
                  }
                }}
                className="mt-4 inline-flex rounded-full border border-medical-300 bg-white px-5 py-2.5 text-sm font-semibold text-medical-800 transition hover:bg-medical-50"
              >
                {searchQuery.trim()
                  ? 'Cancella ricerca'
                  : defaultSubcategory
                    ? `Vai a ${defaultSubcategory}`
                    : 'Aggiorna filtri'}
              </button>
            </div>
          ) : (
            <ul className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredList.map((p) => (
                <li key={p.id} className="flex h-full min-h-0">
                  <OfficeProductCard
                    product={p}
                    hideCategoryBadge
                    compactGrid
                    suppressQuantityTierHint
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <AstroMedicalHealthcareDisclaimer className="mt-4 mb-2" />
      </div>
    </main>
  )
}
