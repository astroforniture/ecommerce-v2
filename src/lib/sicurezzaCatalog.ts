import { SICUREZZA_CATEGORY } from './officeCategories'

export const SICUREZZA_SUBCATEGORY_NASTRI = 'Nastri' as const

export const SICUREZZA_SUBCATEGORIES = [SICUREZZA_SUBCATEGORY_NASTRI] as const

export type SicurezzaSubcategory = (typeof SICUREZZA_SUBCATEGORIES)[number]

export function sicurezzaCategoryHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', SICUREZZA_CATEGORY)
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

export function matchesSicurezzaSubcategoryFilter(
  product: { subcategory?: string | null },
  subcategory: string,
): boolean {
  const wanted = subcategory.trim()
  if (!wanted) return true
  const actual = (product.subcategory ?? '').trim()
  return actual.localeCompare(wanted, 'it', { sensitivity: 'base' }) === 0
}
