import type { OfficeProduct } from '../types/officeProduct'
import {
  AGENDE_SUBCATEGORY_GIORNALIERE,
  AGENDE_SUBCATEGORY_PLANNING,
  AGENDE_SUBCATEGORY_PLANNING_LEGACY_LABELS,
  AGENDE_SUBCATEGORY_SETTIMANALI,
  AGENDA_CATALOG_YEAR,
  isAgendeCategoryProduct,
} from './agendeCatalog'
import { productCatalogKey } from './productRoutes'

export const MERCHANT_AGENDE_COLLECTION_LABEL = `Agende ${AGENDA_CATALOG_YEAR}`
export const MERCHANT_AGENDE_PUBLISHER_LABEL = 'InTempo'

export type MerchantAgendeCustomLabels = {
  custom_label_0: string
  custom_label_1: string
  custom_label_2: string
}

function normalizeSubcategory(subcategory: string | null | undefined): string {
  return (subcategory ?? '').trim()
}

function isPlanningSubcategory(subcategory: string): boolean {
  if (subcategory.localeCompare(AGENDE_SUBCATEGORY_PLANNING, 'it', { sensitivity: 'base' }) === 0) {
    return true
  }
  return AGENDE_SUBCATEGORY_PLANNING_LEGACY_LABELS.some(
    (legacy) => subcategory.localeCompare(legacy, 'it', { sensitivity: 'base' }) === 0,
  )
}

/** Giornaliera / Settimanale (Planning incluso in Settimanale). */
export function merchantAgendeFormatLabel(
  product: Pick<OfficeProduct, 'subcategory' | 'name' | 'id' | 'producerCode'>,
): string | null {
  const sub = normalizeSubcategory(product.subcategory)
  if (sub.localeCompare(AGENDE_SUBCATEGORY_GIORNALIERE, 'it', { sensitivity: 'base' }) === 0) {
    return 'Giornaliera'
  }
  if (
    sub.localeCompare(AGENDE_SUBCATEGORY_SETTIMANALI, 'it', { sensitivity: 'base' }) === 0 ||
    isPlanningSubcategory(sub)
  ) {
    return 'Settimanale'
  }

  const key = productCatalogKey(product).toUpperCase()
  const name = (product.name ?? '').toLowerCase()
  if (key.includes('GIORNAL') || name.includes('giornalier')) return 'Giornaliera'
  if (
    key.includes('SETT') ||
    key.includes('PLAN') ||
    key.includes('WP-') ||
    name.includes('settimanal') ||
    name.includes('planning')
  ) {
    return 'Settimanale'
  }
  return null
}

/** Linea/modello agenda: ALFA, DELTA, TEXT, WEEKLY PATTERN, PP, … */
export function merchantAgendeLineBrand(
  product: Pick<OfficeProduct, 'brand' | 'name' | 'id' | 'producerCode'>,
): string | null {
  const brand = (product.brand ?? '').trim()
  if (brand) return brand.toUpperCase()

  const key = productCatalogKey(product).toUpperCase()
  if (key.includes('AF-AGENDA-ALFA') || key.includes('ALFA')) return 'ALFA'
  if (key.includes('AF-AGENDA-DELTA') || key.includes('DELTA')) return 'DELTA'
  if (key.includes('AF-AGENDA-TEXT') || key.includes('TEXT')) return 'TEXT'
  if (key.includes('AF-AGENDA-WP') || key.includes('WEEKLY')) return 'WEEKLY PATTERN'
  if (key.includes('AF-AGENDA-PLAN')) {
    const n = (product.name ?? '').toLowerCase()
    if (n.includes('delta')) return 'DELTA'
    if (n.includes('alfa')) return 'ALFA'
    return 'PP'
  }

  const name = (product.name ?? '').toUpperCase()
  if (/\bALFA\b/.test(name)) return 'ALFA'
  if (/\bDELTA\b/.test(name)) return 'DELTA'
  if (/\bTEXT\b/.test(name)) return 'TEXT'
  if (/WEEKLY\s+PATTERN/.test(name)) return 'WEEKLY PATTERN'

  return null
}

export function merchantAgendeProductType(
  product: Pick<OfficeProduct, 'brand' | 'name' | 'id' | 'producerCode' | 'category'>,
): string | null {
  if (!isAgendeCategoryProduct(product)) return null
  const line = merchantAgendeLineBrand(product)
  if (!line) return MERCHANT_AGENDE_COLLECTION_LABEL
  return `${MERCHANT_AGENDE_COLLECTION_LABEL} > ${MERCHANT_AGENDE_PUBLISHER_LABEL} > ${line}`
}

export function merchantAgendeCustomLabels(
  product: Pick<
    OfficeProduct,
    'brand' | 'name' | 'id' | 'producerCode' | 'category' | 'subcategory'
  >,
): MerchantAgendeCustomLabels | null {
  if (!isAgendeCategoryProduct(product)) return null

  const format = merchantAgendeFormatLabel(product)
  const line = merchantAgendeLineBrand(product)
  if (!format || !line) return null

  return {
    custom_label_0: MERCHANT_AGENDE_COLLECTION_LABEL,
    custom_label_1: format,
    custom_label_2: line,
  }
}
