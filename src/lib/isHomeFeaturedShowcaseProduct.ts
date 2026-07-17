import { LINEA_ASTRO_MEDICAL_CATEGORY } from '../data/iHealthAstroMedicalProducts'
import type { OfficeProduct } from '../types/officeProduct'
import { isOfficeProductAstroMedicalLine } from './isOfficeProductAstroMedicalLine'
import { normalizeOfficeProductCategory, type OfficeCatalogDisplayCategory } from './officeCategories'
import { isTimbroAziendeFarmacieProduct } from './timbroAziendeFarmacieProduct'

const FEATURED_HOME_CATEGORIES: ReadonlySet<OfficeCatalogDisplayCategory> = new Set([
  'Cancelleria',
  'Archivio',
  'Carta',
  'Macchine per Ufficio',
])

const FEATURED_SYNTHETIC_PREFIXES = [
  'af-dist-',
  'af-toner-',
  'af-pile-',
  'af-quad-',
  'af-etch-',
] as const

const MEDICAL_SYNTHETIC_PREFIXES = [
  'gima-',
  'af-ihealth-',
  'af-amed-',
  'af-diag-',
  'af-surg-',
  'af-ivcann-',
  'af-sut-',
  'af-lab-',
  'af-well-',
  'af-proinstr-',
] as const

/**
 * Prodotti ammessi nel carosello home «Prodotti in evidenza»:
 * solo cancelleria / ufficio (timbri inclusi), mai linea Astro Medical GIMA.
 */
export function isHomeFeaturedShowcaseProduct(product: OfficeProduct): boolean {
  if (isOfficeProductAstroMedicalLine(product)) return false

  const id = String(product.id ?? '').trim().toLowerCase()
  if (MEDICAL_SYNTHETIC_PREFIXES.some((p) => id.startsWith(p))) return false

  const category = normalizeOfficeProductCategory(product.category)
  if (category === LINEA_ASTRO_MEDICAL_CATEGORY) return false

  if (isTimbroAziendeFarmacieProduct(product)) return true
  if (FEATURED_SYNTHETIC_PREFIXES.some((p) => id.startsWith(p))) return true

  return FEATURED_HOME_CATEGORIES.has(category)
}
