import type { OfficeSearchSuggestion } from '../api/officeProductsSupabase'
import type { OfficeProduct } from '../types/officeProduct'
import { extractGimaNumericCodes } from './gimaProductCode'
import { isExcludedFromOfficeSearchSuggestions } from './isOfficeProductAstroMedicalLine'
import { isGeneralOfficeShopCatalogProduct } from './isGeneralOfficeShopCatalogProduct'
import {
  officeProductToSearchFields,
  scoreSearchableProduct,
  searchableProductMatchesTerm,
  tokenizeSearchQuery,
} from './officeSearchRelevance'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'
import { getSearchableSyntheticOfficeProducts } from './debugShowcaseCatalog'

/** Sotto questa soglia la ricerca autocomplete è solo lato client (istantanea). */
export const LOCAL_SEARCH_CATALOG_MAX = 100

type IndexedProduct = {
  suggestion: OfficeSearchSuggestion
  fields: ReturnType<typeof officeProductToSearchFields>
  gimaCodes: string[]
}

let searchIndex: IndexedProduct[] | null = null
let searchIndexUseLocal: boolean | null = null

function productToSuggestion(p: OfficeProduct): OfficeSearchSuggestion {
  const id = String(p.id ?? '').trim()
  const producerCode = (p.producerCode ?? '').trim() || id
  return {
    id,
    producerCode,
    name: p.name.trim(),
    brand: (p.brand ?? '').trim(),
    colorName: p.colorName?.trim() || undefined,
    imageUrl: (p.imageUrl ?? '').trim(),
    price: typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : undefined,
    category: (p.category ?? '').trim() || undefined,
    subcategory: (p.subcategory ?? '').trim() || undefined,
  }
}

function buildIndexedProducts(products: readonly OfficeProduct[]): IndexedProduct[] {
  const byId = new Map<string, OfficeProduct>()
  for (const p of products) byId.set(String(p.id), p)
  for (const p of getSearchableSyntheticOfficeProducts()) {
    if (!byId.has(String(p.id))) byId.set(String(p.id), p)
  }
  return [...byId.values()]
    .filter((p) => !isExcludedFromOfficeSearchSuggestions(p))
    .filter((p) => isGeneralOfficeShopCatalogProduct(p))
    .map((p) => {
      const gimaCodes = extractGimaNumericCodes(p)
      return {
        suggestion: productToSuggestion(p),
        fields: officeProductToSearchFields(p),
        gimaCodes,
      }
    })
}

function getInjectedIndexedCatalog(): IndexedProduct[] {
  return buildIndexedProducts(getInjectedLocalCatalogProducts())
}

function getActiveSearchIndex(): IndexedProduct[] {
  return searchIndex ?? getInjectedIndexedCatalog()
}

/** Imposta l'indice ricerca (catalogo shop scaricato una volta). */
export function setOfficeSearchIndexFromProducts(
  products: readonly OfficeProduct[],
  useLocalSearch: boolean,
): void {
  searchIndex = buildIndexedProducts(products)
  searchIndexUseLocal = useLocalSearch
}

export function getOfficeSearchIndexSize(): number {
  return getActiveSearchIndex().length
}

export function shouldUseLocalSearchOnly(): boolean {
  if (searchIndexUseLocal != null) return searchIndexUseLocal
  return getOfficeSearchIndexSize() < LOCAL_SEARCH_CATALOG_MAX
}

const SUGGEST_MATCH_OPTIONS = { suggestAutocomplete: true } as const

function termMatchesEntry(entry: IndexedProduct, term: string): boolean {
  if (/^\d{3,6}$/.test(term)) {
    return entry.gimaCodes.includes(term) || searchableProductMatchesTerm(entry.fields, term, SUGGEST_MATCH_OPTIONS)
  }
  return searchableProductMatchesTerm(entry.fields, term, SUGGEST_MATCH_OPTIONS)
}

/** Ricerca istantanea sull'indice in memoria (fuzzy / parole intere via officeSearchRelevance). */
export function searchOfficeProductsClient(rawQuery: string, limit = 8): OfficeSearchSuggestion[] {
  const trimmed = rawQuery.trim()
  const terms = tokenizeSearchQuery(trimmed)
  if (!terms.length || trimmed.length < 2) return []

  const index = getActiveSearchIndex()
  return index
    .filter((entry) => terms.every((term) => termMatchesEntry(entry, term)))
    .sort(
      (a, b) =>
        scoreSearchableProduct(b.fields, terms, trimmed) -
        scoreSearchableProduct(a.fields, terms, trimmed),
    )
    .slice(0, limit)
    .map((e) => e.suggestion)
}

/** Invalida cache indice (test o hot reload catalogo). */
export function resetOfficeClientSearchIndex(): void {
  searchIndex = null
  searchIndexUseLocal = null
}
