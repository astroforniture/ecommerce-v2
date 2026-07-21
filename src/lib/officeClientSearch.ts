import Fuse from 'fuse.js'
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
import { normalizeSearchText } from './fuzzySearch'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'
import { getSearchableSyntheticOfficeProducts } from './debugShowcaseCatalog'

/** Indice locale fuzzy: usato per autocomplete istantaneo indipendentemente dalla dimensione catalogo. */
export const LOCAL_SEARCH_CATALOG_MAX = 100

type IndexedProduct = {
  suggestion: OfficeSearchSuggestion
  fields: ReturnType<typeof officeProductToSearchFields>
  gimaCodes: string[]
  nameNorm: string
  brandNorm: string
  categoryNorm: string
  subcategoryNorm: string
  skuNorm: string
  haystackNorm: string
}

let searchIndex: IndexedProduct[] | null = null
let fuseIndex: Fuse<IndexedProduct> | null = null
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
      const fields = officeProductToSearchFields(p)
      const haystackNorm = normalizeSearchText(
        [
          fields.name,
          fields.description,
          fields.brand,
          fields.category,
          fields.subcategory,
          fields.colorName,
          fields.sku,
        ]
          .filter(Boolean)
          .join(' '),
      )
      return {
        suggestion: productToSuggestion(p),
        fields,
        gimaCodes,
        nameNorm: normalizeSearchText(fields.name),
        brandNorm: normalizeSearchText(fields.brand ?? ''),
        categoryNorm: normalizeSearchText(fields.category ?? ''),
        subcategoryNorm: normalizeSearchText(fields.subcategory ?? ''),
        skuNorm: normalizeSearchText(fields.sku ?? ''),
        haystackNorm,
      }
    })
}

function rebuildFuseIndex(index: IndexedProduct[]): void {
  fuseIndex = new Fuse(index, {
    keys: [
      { name: 'nameNorm', weight: 0.38 },
      { name: 'brandNorm', weight: 0.14 },
      { name: 'categoryNorm', weight: 0.1 },
      { name: 'subcategoryNorm', weight: 0.08 },
      { name: 'skuNorm', weight: 0.15 },
      { name: 'haystackNorm', weight: 0.15 },
    ],
    threshold: 0.42,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
    shouldSort: true,
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
  rebuildFuseIndex(searchIndex)
  searchIndexUseLocal = useLocalSearch
}

export function getOfficeSearchIndexSize(): number {
  return getActiveSearchIndex().length
}

export function shouldUseLocalSearchOnly(): boolean {
  if (searchIndexUseLocal != null) return searchIndexUseLocal
  return getOfficeSearchIndexSize() > 0
}

const SUGGEST_MATCH_OPTIONS = { suggestAutocomplete: true } as const

function termMatchesEntry(entry: IndexedProduct, term: string): boolean {
  if (/^\d{3,6}$/.test(term)) {
    return entry.gimaCodes.includes(term) || searchableProductMatchesTerm(entry.fields, term, SUGGEST_MATCH_OPTIONS)
  }
  return searchableProductMatchesTerm(entry.fields, term, SUGGEST_MATCH_OPTIONS)
}

function rankWithFuse(queryNorm: string, entries: IndexedProduct[]): IndexedProduct[] {
  if (!fuseIndex || !queryNorm) return entries
  const fuseById = new Map(
    fuseIndex.search(queryNorm, { limit: Math.max(entries.length, 24) }).map((hit) => [
      hit.item.suggestion.id,
      hit.score ?? 1,
    ]),
  )
  return [...entries].sort((a, b) => {
    const scoreA = fuseById.get(a.suggestion.id) ?? 1
    const scoreB = fuseById.get(b.suggestion.id) ?? 1
    return scoreA - scoreB
  })
}

/** Ricerca istantanea sull'indice in memoria (fuzzy / sillabe / typo via Fuse + officeSearchRelevance). */
export function searchOfficeProductsClient(rawQuery: string, limit = 8): OfficeSearchSuggestion[] {
  const trimmed = rawQuery.trim()
  const terms = tokenizeSearchQuery(trimmed)
  if (!terms.length || trimmed.length < 2) return []

  const index = getActiveSearchIndex()
  const queryNorm = normalizeSearchText(trimmed)

  let candidates = index.filter((entry) => terms.every((term) => termMatchesEntry(entry, term)))

  if (candidates.length < limit && queryNorm.length >= 3 && fuseIndex) {
    const seen = new Set(candidates.map((entry) => entry.suggestion.id))
    for (const hit of fuseIndex.search(queryNorm, { limit: limit * 4 })) {
      const item = hit.item
      if (seen.has(item.suggestion.id)) continue
      if (hit.score != null && hit.score > 0.55) continue
      candidates.push(item)
      seen.add(item.suggestion.id)
    }
  }

  return rankWithFuse(queryNorm, candidates)
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
  fuseIndex = null
  searchIndexUseLocal = null
}
