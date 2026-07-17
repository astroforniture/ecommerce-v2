import { isHomeFeaturedShowcaseProduct } from './isHomeFeaturedShowcaseProduct'
import type { OfficeProduct } from '../types/officeProduct'

/**
 * Punteggio popolarità client-side (nessun campo vendite in DB):
 * prodotti in evidenza, listini quantità e completezza scheda.
 */
export function officeProductPopularityScore(product: OfficeProduct): number {
  let score = 0

  if (isHomeFeaturedShowcaseProduct(product)) score += 60
  if ((product.quantityPriceTiers?.length ?? 0) > 0) score += 25
  if (typeof product.price === 'number' && product.price > 0) score += 10
  if ((product.imageUrl ?? '').trim()) score += 5
  if ((product.description ?? '').trim().length > 40) score += 3

  return score
}

export function compareOfficeProductsByPopularity(a: OfficeProduct, b: OfficeProduct): number {
  const scoreDiff = officeProductPopularityScore(b) - officeProductPopularityScore(a)
  if (scoreDiff !== 0) return scoreDiff
  return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' })
}
