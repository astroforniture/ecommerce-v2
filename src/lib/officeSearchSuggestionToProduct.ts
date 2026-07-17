import type { OfficeSearchSuggestion } from '../api/officeProductsSupabase'
import type { OfficeProduct } from '../types/officeProduct'

/** Converte un suggerimento autocomplete nel minimo `OfficeProduct` per `addOfficeProduct`. */
export function officeSearchSuggestionToProduct(
  suggestion: OfficeSearchSuggestion,
): OfficeProduct {
  return {
    id: suggestion.id,
    name: suggestion.name.trim(),
    brand: suggestion.brand.trim(),
    producerCode: suggestion.producerCode.trim() || suggestion.id,
    category: suggestion.category?.trim() || '',
    subcategory: suggestion.subcategory?.trim() || undefined,
    colorName: suggestion.colorName?.trim() || undefined,
    mainFeatures: suggestion.colorName ? { Colore: suggestion.colorName } : {},
    imageUrl: suggestion.imageUrl.trim(),
    price: suggestion.price,
  }
}
