import { PRODOTTI_IGIENE_CATEGORY } from './officeCategories'

export const IGIENE_SUBCATEGORY_DETERGENTI = 'Detergenti' as const
export const IGIENE_SUBCATEGORY_ATTREZZATURE = 'Attrezzature e Panni' as const
export const IGIENE_SUBCATEGORY_MACCHINE = 'Macchine per Pulizia' as const

export const IGIENE_SUBCATEGORIES = [
  IGIENE_SUBCATEGORY_DETERGENTI,
  IGIENE_SUBCATEGORY_ATTREZZATURE,
  IGIENE_SUBCATEGORY_MACCHINE,
] as const

export type IgieneSubcategory = (typeof IGIENE_SUBCATEGORIES)[number]

export function prodottiIgieneSubcategoryHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', PRODOTTI_IGIENE_CATEGORY)
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

export function matchesIgieneSubcategoryFilter(
  product: { subcategory?: string | null },
  subcategory: string,
): boolean {
  const wanted = subcategory.trim()
  if (!wanted) return true
  const actual = (product.subcategory ?? '').trim()
  return actual.localeCompare(wanted, 'it', { sensitivity: 'base' }) === 0
}
