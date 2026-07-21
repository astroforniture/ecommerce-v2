import { flexibleTermMatchesInHaystack, normalizeSearchText, tokenizeSearchQuery } from './fuzzySearch'

export type SearchableProductFields = {
  name: string
  brand?: string
  sku?: string
  category?: string
  subcategory?: string
  colorName?: string
  description?: string
  id?: string
}

/** Testo combinato normalizzato per match parziali / fuzzy. */
export function buildProductSearchHaystack(fields: SearchableProductFields): string {
  return normalizeSearchText(
    [
      fields.name,
      fields.description,
      fields.brand,
      fields.category,
      fields.subcategory,
      fields.colorName,
    ]
      .filter(Boolean)
      .join(' '),
  )
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Match su parola intera (evita falsi positivi tipo «carta» ⊂ «cartacei» / «documenti»).
 * I codici numerici restano match per sottostringa.
 */
export function normalizedTextContainsWholeWord(haystack: string, term: string): boolean {
  const h = normalizeSearchText(haystack)
  const t = normalizeSearchText(term)
  if (!t) return true
  if (/^\d+$/.test(t)) return h.includes(t)
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(t)}(?=[^a-z0-9]|$)`)
  return re.test(h)
}

/** Autocomplete: prefisso su token (es. «ca» → «Carta fotocopie»), senza match dentro «cartacei». */
export function normalizedTextHasTokenPrefix(haystack: string, term: string): boolean {
  const h = normalizeSearchText(haystack)
  const t = normalizeSearchText(term)
  if (!t) return true
  if (h.startsWith(t)) return true
  return h.split(/[^a-z0-9]+/).some((word) => word.length > 0 && word.startsWith(t))
}

export type SearchMatchOptions = {
  /** Suggerimenti header: da 2 caratteri accetta prefissi su titolo/marca/categoria. */
  suggestAutocomplete?: boolean
}

export function searchableProductMatchesTerm(
  fields: SearchableProductFields,
  term: string,
  options?: SearchMatchOptions,
): boolean {
  const t = normalizeSearchText(term)
  if (!t) return true

  if (/^\d{3,6}$/.test(t)) {
    const sku = normalizeSearchText(fields.sku ?? '')
    const id = normalizeSearchText(fields.id ?? '')
    return sku.includes(t) || id.includes(t)
  }

  const skuNorm = normalizeSearchText(fields.sku ?? '')
  const idNorm = normalizeSearchText(fields.id ?? '')
  if (skuNorm === t || idNorm === t) return true
  if (t.length >= 4 && (skuNorm.includes(t) || idNorm.includes(t))) return true

  if (options?.suggestAutocomplete && t.length >= 2) {
    if (normalizedTextHasTokenPrefix(fields.name, t)) return true
    if (normalizedTextHasTokenPrefix(fields.brand ?? '', t)) return true
    if (normalizedTextHasTokenPrefix(fields.category ?? '', t)) return true
    if (normalizedTextHasTokenPrefix(fields.subcategory ?? '', t)) return true
    if (normalizedTextHasTokenPrefix(fields.colorName ?? '', t)) return true
    if (normalizedTextHasTokenPrefix(fields.description ?? '', t)) return true
    if (skuNorm.startsWith(t) || idNorm.startsWith(t)) return true
  }

  const haystack = buildProductSearchHaystack(fields)
  if (options?.suggestAutocomplete && t.length >= 3 && haystack.includes(t)) return true
  if (t.length >= 3 && flexibleTermMatchesInHaystack(haystack, term)) return true

  return (
    normalizedTextContainsWholeWord(fields.name, t) ||
    normalizedTextContainsWholeWord(fields.brand ?? '', t) ||
    normalizedTextContainsWholeWord(fields.category ?? '', t) ||
    normalizedTextContainsWholeWord(fields.subcategory ?? '', t) ||
    normalizedTextContainsWholeWord(fields.colorName ?? '', t) ||
    normalizedTextContainsWholeWord(fields.description ?? '', t)
  )
}

export function searchableProductMatchesAllTerms(
  fields: SearchableProductFields,
  terms: string[],
  options?: SearchMatchOptions,
): boolean {
  if (!terms.length) return false
  return terms.every((term) => searchableProductMatchesTerm(fields, term, options))
}

function isDocumentShredderFields(fields: SearchableProductFields): boolean {
  const hay = normalizeSearchText(
    `${fields.name} ${fields.subcategory ?? ''} ${fields.category ?? ''}`,
  )
  return (
    hay.includes('distruggidocument') ||
    hay.includes('distruggi document') ||
    hay.includes('tritacarta') ||
    hay.includes('trita carta') ||
    hay.includes('trita-carta')
  )
}

function queryTargetsShredders(terms: string[]): boolean {
  return terms.some(
    (t) =>
      t.includes('distrugg') ||
      t.includes('trita') ||
      t.includes('shredd') ||
      (t.includes('document') && !t.includes('carta')),
  )
}

function isPaperStationeryFields(fields: SearchableProductFields): boolean {
  const cat = normalizeSearchText(fields.category ?? '')
  if (cat === 'carta') return true
  const sub = normalizeSearchText(fields.subcategory ?? '')
  if (sub.includes('carta')) return true
  const name = normalizeSearchText(fields.name)
  return (
    normalizedTextContainsWholeWord(fields.name, 'carta') ||
    name.includes('fotocopi') ||
    name.includes('risma') ||
    name.includes('blocco fogli') ||
    name.includes('color copy')
  )
}

/** Punteggio rilevanza: titolo e categoria Carta in cima; distruggidocumenti in fondo se non cercati esplicitamente. */
export function scoreSearchableProduct(
  fields: SearchableProductFields,
  terms: string[],
  rawQuery: string,
): number {
  const nameNorm = normalizeSearchText(fields.name)
  const queryNorm = normalizeSearchText(rawQuery)
  let score = 0

  if (queryNorm && nameNorm.startsWith(queryNorm)) score += 100

  for (const term of terms) {
    if (/^\d{3,6}$/.test(term)) {
      const sku = normalizeSearchText(fields.sku ?? '')
      const id = normalizeSearchText(fields.id ?? '')
      if (sku === term || id === term) score += 120
      else if (sku.includes(term) || id.includes(term)) score += 90
      continue
    }

    if (nameNorm.startsWith(term)) score += 80
    else if (normalizedTextContainsWholeWord(fields.name, term)) score += 50

    if (normalizedTextContainsWholeWord(fields.category ?? '', term)) score += 35
    if (normalizedTextContainsWholeWord(fields.subcategory ?? '', term)) score += 25

    const brandNorm = normalizeSearchText(fields.brand ?? '')
    if (brandNorm.startsWith(term)) score += 30
    else if (normalizedTextContainsWholeWord(fields.brand ?? '', term)) score += 15

    if (normalizedTextContainsWholeWord(fields.colorName ?? '', term)) score += 20
    if (normalizedTextContainsWholeWord(fields.description ?? '', term)) score += 28
    else if (term.length >= 5 && flexibleTermMatchesInHaystack(buildProductSearchHaystack(fields), term)) {
      score += 22
    }
  }

  if (terms.some((t) => t === 'carta')) {
    if (isPaperStationeryFields(fields)) score += 45
    if (isDocumentShredderFields(fields) && !queryTargetsShredders(terms)) score -= 120
  }

  if (isDocumentShredderFields(fields) && !queryTargetsShredders(terms)) {
    score -= 40
  }

  return score
}

export function officeProductToSearchFields(
  product: Pick<
    SearchableProductFields,
    'name' | 'brand' | 'category' | 'subcategory' | 'colorName' | 'id' | 'description'
  > & { producerCode?: string },
): SearchableProductFields {
  return {
    name: product.name,
    brand: product.brand,
    sku: product.producerCode ?? product.id,
    category: product.category,
    subcategory: product.subcategory,
    colorName: product.colorName,
    description: product.description?.trim() || undefined,
    id: product.id,
  }
}

export { normalizeSearchText, tokenizeSearchQuery }
