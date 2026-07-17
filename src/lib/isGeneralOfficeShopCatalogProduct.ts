import { LINEA_ASTRO_MEDICAL_CATEGORY } from '../data/iHealthAstroMedicalProducts'
import type { OfficeProduct } from '../types/officeProduct'
import { isOfficeProductAstroMedicalLine } from './isOfficeProductAstroMedicalLine'
import { normalizeOfficeProductCategory } from './officeCategories'

/**
 * Catalogo Shop generale (cancelleria, ufficio, timbri): esclude linea Astro Medical / GIMA.
 * La categoria medical ha pagina e filtro dedicati (`?category=Linea Specializzata Astro Medical`).
 */
export function isGeneralOfficeShopCatalogProduct(product: OfficeProduct): boolean {
  if (isOfficeProductAstroMedicalLine(product)) return false
  const category = normalizeOfficeProductCategory(product.category)
  if (category === LINEA_ASTRO_MEDICAL_CATEGORY) return false
  return true
}

/** Path del catalogo Shop (solo articoli ufficio/cancelleria, senza sanitario). */
export const OFFICE_GENERAL_SHOP_PATH = '/office-products?catalog=ufficio'

export function isOfficeGeneralShopCatalogUrl(
  searchParams: Pick<URLSearchParams, 'get'>,
): boolean {
  return (searchParams.get('catalog') ?? '').trim().toLowerCase() === 'ufficio'
}
