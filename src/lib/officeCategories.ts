import {
  LINEA_ASTRO_MEDICAL_CATEGORY,
  LINEA_ASTRO_MEDICAL_CATEGORY_NORM,
  isAstroMedicalProductCategory,
} from '../data/iHealthAstroMedicalProducts'

/**
 * Taxonomia catalogo office lato frontend (allineata al reset DB).
 * Categorie ufficiali in UI; il resto va in `Altro`.
 */
export const OFFICE_CATALOG_CANONICAL_CATEGORIES = [
  'Carta',
  'Archivio',
  'Cancelleria',
  'Cartucce & Toner',
  'Macchine per Ufficio',
  LINEA_ASTRO_MEDICAL_CATEGORY,
] as const

export const CARTUCCE_TONER_CATEGORY = 'Cartucce & Toner' as const
export const CARTUCCE_TONER_CATEGORY_NORM = 'cartucce & toner'

export const OFFICE_CATEGORY_FALLBACK = 'Altro' as const

export type OfficeCatalogCanonicalCategory =
  (typeof OFFICE_CATALOG_CANONICAL_CATEGORIES)[number]

export type OfficeCatalogDisplayCategory =
  | OfficeCatalogCanonicalCategory
  | typeof OFFICE_CATEGORY_FALLBACK

/** Ordine voci filtro sidebar / coerenza UI */
export const OFFICE_CATEGORY_FILTER_ORDER: readonly OfficeCatalogDisplayCategory[] = [
  'Cancelleria',
  CARTUCCE_TONER_CATEGORY,
  'Macchine per Ufficio',
  LINEA_ASTRO_MEDICAL_CATEGORY,
  'Carta',
  'Archivio',
  OFFICE_CATEGORY_FALLBACK,
]

export function cartucceTonerCategoryHref(): string {
  return `/office-products?category=${encodeURIComponent(CARTUCCE_TONER_CATEGORY)}`
}

export const CARTA_SUBCATEGORY_A4 = 'Formato Carta A4' as const
export const CARTA_SUBCATEGORY_A3 = 'Formato Carta A3' as const

export const CARTA_SUBCATEGORIES = [CARTA_SUBCATEGORY_A4, CARTA_SUBCATEGORY_A3] as const

export function cartaCategoryHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', 'Carta')
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

export function matchesCartaSubcategoryFilter(
  product: { subcategory?: string | null },
  subcategory: string,
): boolean {
  const expected = subcategory.trim()
  if (!expected) return true
  const actual = (product.subcategory ?? '').trim()
  return actual.localeCompare(expected, 'it', { sensitivity: 'base' }) === 0
}

export function normalizeOfficeProductCategory(raw: string): OfficeCatalogDisplayCategory {
  const t = raw.trim()
  if (!t) return OFFICE_CATEGORY_FALLBACK
  if (isAstroMedicalProductCategory(t)) return LINEA_ASTRO_MEDICAL_CATEGORY
  for (const c of OFFICE_CATALOG_CANONICAL_CATEGORIES) {
    if (t.localeCompare(c, 'it', { sensitivity: 'base' }) === 0) return c
  }
  return OFFICE_CATEGORY_FALLBACK
}

/**
 * Param `?category=` dalla URL: Cancelleria / Macchine / Linea Astro Medical / Carta / Archivio / Altro;
 * valori legacy sconosciuti → stringa vuota (mostra tutti).
 */
export function officeCategoryFilterFromUrlParam(
  param: string | null | undefined,
): string {
  if (!param?.trim()) return ''
  const t = param.trim()
  if (t.localeCompare('Cancelleria', 'it', { sensitivity: 'base' }) === 0)
    return 'cancelleria'
  if (t.localeCompare('Macchine per Ufficio', 'it', { sensitivity: 'base' }) === 0)
    return 'macchine per ufficio'
  if (t.localeCompare(LINEA_ASTRO_MEDICAL_CATEGORY, 'it', { sensitivity: 'base' }) === 0)
    return LINEA_ASTRO_MEDICAL_CATEGORY_NORM
  if (t.localeCompare('Medicale', 'it', { sensitivity: 'base' }) === 0)
    return LINEA_ASTRO_MEDICAL_CATEGORY_NORM
  if (t.localeCompare('Sanitario', 'it', { sensitivity: 'base' }) === 0)
    return LINEA_ASTRO_MEDICAL_CATEGORY_NORM
  if (t.localeCompare('Carta', 'it', { sensitivity: 'base' }) === 0) return 'carta'
  if (
    t.localeCompare(CARTUCCE_TONER_CATEGORY, 'it', { sensitivity: 'base' }) === 0 ||
    t.localeCompare('Cartucce e Toner', 'it', { sensitivity: 'base' }) === 0
  ) {
    return CARTUCCE_TONER_CATEGORY_NORM
  }
  if (t.localeCompare('Archivio', 'it', { sensitivity: 'base' }) === 0) return 'archivio'
  if (t.localeCompare(OFFICE_CATEGORY_FALLBACK, 'it', { sensitivity: 'base' }) === 0)
    return 'altro'
  return ''
}
