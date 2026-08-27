import Fuse from 'fuse.js'
import type { OfficeSearchSuggestion } from '../api/officeProductsSupabase'
import type { OfficeProduct } from '../types/officeProduct'
import { extractGimaNumericCodes } from './gimaProductCode'
import { isOfficeProductAstroMedicalLine } from './isOfficeProductAstroMedicalLine'
import { isSuppressedCatalogSku } from './suppressedCatalogSkus'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'
import { getSearchableSyntheticOfficeProducts } from './debugShowcaseCatalog'
import { buildLineaAstroMedicalAllOfficeProducts } from '../data/lineaAstroMedicalCombined'
import {
  officeProductToSearchFields,
  scoreSearchableProduct,
  searchableProductMatchesTerm,
  tokenizeSearchQuery,
} from './officeSearchRelevance'
import { normalizeSearchText } from './fuzzySearch'

/** Indice locale fuzzy: usato per autocomplete istantaneo indipendentemente dalla dimensione catalogo. */
export const LOCAL_SEARCH_CATALOG_MAX = 100

export type OfficeSearchCatalogScope = 'all' | 'medical' | 'office'

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
  isMedical: boolean
}

let searchIndex: IndexedProduct[] | null = null
let fuseIndex: Fuse<IndexedProduct> | null = null
let searchIndexUseLocal: boolean | null = null
const CLIENT_SEARCH_CACHE_MAX = 48
const clientSearchResultCache = new Map<string, OfficeSearchSuggestion[]>()

function clientSearchCacheKey(
  query: string,
  limit: number,
  scope: OfficeSearchCatalogScope,
): string {
  return `${scope}|${limit}|${normalizeSearchText(query)}`
}

function rememberClientSearchResult(key: string, data: OfficeSearchSuggestion[]) {
  clientSearchResultCache.set(key, data)
  while (clientSearchResultCache.size > CLIENT_SEARCH_CACHE_MAX) {
    const first = clientSearchResultCache.keys().next().value
    if (first == null) break
    clientSearchResultCache.delete(first)
  }
}

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
  // Catalogo sanitario / GIMA / Astro Medical (sempre ricercabile)
  for (const p of buildLineaAstroMedicalAllOfficeProducts()) {
    if (!byId.has(String(p.id))) byId.set(String(p.id), p)
  }
  return [...byId.values()]
    .filter((p) => !isSuppressedCatalogSku(p.producerCode) && !isSuppressedCatalogSku(p.id))
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
      isMedical: isOfficeProductAstroMedicalLine(p),
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
  clientSearchResultCache.clear()
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
export function searchOfficeProductsClient(
  rawQuery: string,
  limit = 8,
  scope: OfficeSearchCatalogScope = 'all',
): OfficeSearchSuggestion[] {
  const trimmed = rawQuery.trim()
  const terms = tokenizeSearchQuery(trimmed)
  if (!terms.length || trimmed.length < 2) return []

  const cacheKey = clientSearchCacheKey(trimmed, limit, scope)
  const cached = clientSearchResultCache.get(cacheKey)
  if (cached) return cached

  const index = getActiveSearchIndex()
  const queryNorm = normalizeSearchText(trimmed)

  let candidates = index.filter((entry) => {
    if (scope === 'medical' && !entry.isMedical) return false
    if (scope === 'office' && entry.isMedical) return false
    return terms.every((term) => termMatchesEntry(entry, term))
  })

  const strongHits = candidates.filter(
    (entry) =>
      entry.nameNorm.includes(queryNorm) ||
      entry.subcategoryNorm.includes(queryNorm) ||
      entry.skuNorm.includes(queryNorm),
  )
  // Query distintive (es. «elettrodi»): non diluire con Fuse su «elettronica».
  if (queryNorm.length >= 5 && strongHits.length > 0) {
    candidates = strongHits
  } else if (queryNorm.length >= 3 && fuseIndex) {
    const seen = new Set(candidates.map((entry) => entry.suggestion.id))
    for (const hit of fuseIndex.search(queryNorm, { limit: Math.max(limit * 4, 24) })) {
      const item = hit.item
      if (seen.has(item.suggestion.id)) continue
      if (scope === 'medical' && !item.isMedical) continue
      if (scope === 'office' && item.isMedical) continue
      if (hit.score != null && hit.score > 0.62) continue
      candidates.push(item)
      seen.add(item.suggestion.id)
    }
  }

  const exact = findExactSkuIndexedEntry(trimmed, scope)
  if (exact) {
    candidates = [exact, ...candidates.filter((c) => c.suggestion.id !== exact.suggestion.id)]
  }

  const results = rankWithFuse(queryNorm, candidates)
    .sort(
      (a, b) =>
        scoreSearchableProduct(b.fields, terms, trimmed) -
        scoreSearchableProduct(a.fields, terms, trimmed),
    )
    .slice(0, limit)
    .map((e) => e.suggestion)
  rememberClientSearchResult(cacheKey, results)
  return results
}

function normalizeSkuKey(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/^gima-/i, '')
    .replace(/\s+/g, '')
}

function entryMatchesExactSku(entry: IndexedProduct, queryRaw: string): boolean {
  const q = queryRaw.trim()
  if (!q) return false
  const qLower = q.toLowerCase()
  const qKey = normalizeSkuKey(q)

  const id = String(entry.suggestion.id ?? '').trim()
  const sku = String(entry.suggestion.producerCode ?? '').trim()
  const idLower = id.toLowerCase()
  const skuLower = sku.toLowerCase()

  if (idLower === qLower || skuLower === qLower) return true
  if (normalizeSkuKey(id) === qKey || normalizeSkuKey(sku) === qKey) return true
  if (entry.gimaCodes.some((code) => code === q || code === qKey)) return true
  if (/^\d{4,6}$/.test(qKey) && (idLower === `gima-${qKey}` || skuLower === `gima-${qKey}`)) {
    return true
  }
  return false
}

function findExactSkuIndexedEntry(
  rawQuery: string,
  scope: OfficeSearchCatalogScope = 'all',
): IndexedProduct | null {
  const q = rawQuery.trim()
  if (!q) return null
  const index = getActiveSearchIndex()
  for (const entry of index) {
    if (scope === 'medical' && !entry.isMedical) continue
    if (scope === 'office' && entry.isMedical) continue
    if (entryMatchesExactSku(entry, q)) return entry
  }
  return null
}

/**
 * Match esatto su SKU / codice GIMA / id prodotto.
 * Usato per redirect diretto alla scheda (comportamento tipo gimaitaly.com).
 */
export function findExactSkuOfficeSuggestion(
  rawQuery: string,
  scope: OfficeSearchCatalogScope = 'all',
): OfficeSearchSuggestion | null {
  return findExactSkuIndexedEntry(rawQuery, scope)?.suggestion ?? null
}

/** Invalida cache indice (test o hot reload catalogo). */
export function resetOfficeClientSearchIndex(): void {
  searchIndex = null
  fuseIndex = null
  searchIndexUseLocal = null
}
