import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, HeartPulse, Loader2 } from 'lucide-react'
import { OfficeProductCard } from '../components/office/OfficeProductCard'
import { AstroMedicalSubcategoryNav } from '../components/astroMedical/AstroMedicalSubcategoryNav'
import { useOfficeCatalog } from '../hooks/useOfficeCatalog'
import { normalizeOfficeProductCategory } from '../lib/officeCategories'
import { mergeLineaAstroMedicalCatalog } from '../data/lineaAstroMedicalCombined'
import {
  LINEA_ASTRO_MEDICAL_CATEGORY,
  lineaAstroMedicalIHealthListingPath,
} from '../data/iHealthAstroMedicalProducts'
import {
  isAstroMedicalSubcategoryLabel,
  matchesAstroMedicalSubcategoryFilter,
} from '../lib/astroMedicalSubcategories'

export function AstroMedicalPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const subcategoryFromUrl = (searchParams.get('subcategory') ?? '').trim()
  const selectedSubcategory = isAstroMedicalSubcategoryLabel(subcategoryFromUrl)
    ? subcategoryFromUrl
    : null

  const { products, isLoading } = useOfficeCatalog(LINEA_ASTRO_MEDICAL_CATEGORY, null)
  const catalog = useMemo(() => {
    const normalized = products.map((p) => ({
      ...p,
      category: normalizeOfficeProductCategory(p.category),
    }))
    return mergeLineaAstroMedicalCatalog(normalized)
  }, [products])

  const catalogLoading = isLoading && catalog.length === 0

  const filteredList = useMemo(() => {
    if (!selectedSubcategory) return catalog
    return catalog.filter((p) =>
      matchesAstroMedicalSubcategoryFilter(p, selectedSubcategory),
    )
  }, [catalog, selectedSubcategory])

  function setMedicalSubcategory(value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value) next.delete('subcategory')
      else next.set('subcategory', value)
      return next
    })
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

        <header className="mt-8 flex flex-col gap-6 border-b border-medical-100 pb-10 sm:flex-row sm:items-start sm:gap-10">
          <span
            className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-medical-600 text-white shadow-lg shadow-medical-600/25"
            aria-hidden
          >
            <HeartPulse className="size-10" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-medical-600">
              Linea specializzata
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-medical-950 sm:text-5xl">
              {LINEA_ASTRO_MEDICAL_CATEGORY}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Catalogo unificato (articoli medicali e elettromedicali iHealth): prezzi imponibili IVA esclusa.
              La scheda prodotto usa lo stesso layout del catalogo office (prezzo, quantità, trust, descrizione e
              correlati).
            </p>
            <p className="mt-4 text-sm text-slate-600">
              <Link
                to={lineaAstroMedicalIHealthListingPath()}
                className="font-semibold text-medical-800 underline decoration-medical-300 underline-offset-2 transition hover:text-medical-950"
              >
                Vedi nel catalogo Prodotti Ufficio
              </Link>
            </p>
          </div>
        </header>

        <section className="py-10" aria-labelledby="astro-medical-catalog-heading">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="astro-medical-catalog-heading"
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              Catalogo prodotti
            </h2>
            <p className="inline-flex items-center gap-2 text-sm text-slate-600">
              {catalogLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-medical-600" aria-hidden />
                  Caricamento…
                </>
              ) : (
                <>
                  {filteredList.length} articol{filteredList.length === 1 ? 'o' : 'i'}
                  {selectedSubcategory ? (
                    <span className="text-medical-700">
                      {' '}
                      · {selectedSubcategory}
                    </span>
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
                Nessun prodotto in questa sotto-categoria.
              </p>
              <button
                type="button"
                onClick={() => setMedicalSubcategory(null)}
                className="mt-4 inline-flex rounded-full border border-medical-300 bg-white px-5 py-2.5 text-sm font-semibold text-medical-800 transition hover:bg-medical-50"
              >
                Mostra tutti i prodotti
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
      </div>
    </main>
  )
}
