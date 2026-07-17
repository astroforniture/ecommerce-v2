import { isAstroMedicalProductCategory } from '../data/iHealthAstroMedicalProducts'
import type { OfficeProduct } from '../types/officeProduct'

function normLite(value: string): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’'`]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Indica se un prodotto office appartiene alla linea Astro Medical / articoli medicali,
 * così da escluderlo dalla vetrina home (catalogo dedicato).
 */
export function isOfficeProductAstroMedicalLine(product: OfficeProduct): boolean {
  const id = String(product.id ?? '').trim().toLowerCase()
  if (id.startsWith('gima-')) return true

  const categoryNorm = normLite(product.category)
  if (isAstroMedicalProductCategory(categoryNorm)) return true

  const mf = Object.entries(product.mainFeatures ?? {})
    .map(([k, v]) => `${k} ${v}`)
    .join(' ')
  const hay = normLite(
    `${product.name} ${product.brand ?? ''} ${product.category} ${product.subcategory ?? ''} ${product.description ?? ''} ${mf}`,
  )
  if (!hay) return false
  if (hay.includes('astro medical')) return true
  if (hay.includes('articoli medicali')) return true
  if (hay.includes('articolo medical')) return true
  if (hay.includes('linea medical') && hay.includes('astro')) return true
  if (hay.includes('gima') && (hay.includes('medical') || hay.includes('sanitar'))) return true
  if (hay.includes('elettromedical') && hay.includes('gima')) return true
  return false
}

type OfficeSearchExclusionFields = Pick<
  OfficeProduct,
  'id' | 'name' | 'brand' | 'category' | 'subcategory' | 'description' | 'mainFeatures' | 'producerCode'
>

/**
 * Esclude dalla ricerca globale (autocomplete header) articoli sanitari / linea Astro Medical / GIMA.
 */
export function isExcludedFromOfficeSearchSuggestions(
  product: OfficeSearchExclusionFields,
): boolean {
  const brandNorm = normLite(product.brand ?? '')
  if (brandNorm === 'gima') return true

  const categoryNorm = normLite(product.category ?? '')
  const subcategoryNorm = normLite(product.subcategory ?? '')
  if (
    categoryNorm.includes('medic') ||
    categoryNorm.includes('sanitar') ||
    subcategoryNorm.includes('medic') ||
    subcategoryNorm.includes('sanitar')
  ) {
    return true
  }

  return isOfficeProductAstroMedicalLine({
    id: product.id,
    name: product.name,
    brand: product.brand ?? '',
    producerCode: (product.producerCode ?? product.id).trim(),
    category: product.category ?? '',
    subcategory: product.subcategory,
    description: product.description,
    mainFeatures: product.mainFeatures ?? {},
    imageUrl: '',
  })
}
