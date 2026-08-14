import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from './officeCategories'

export const AGENDE_SUBCATEGORY_GIORNALIERE = 'Agende Giornaliere' as const
export const AGENDE_SUBCATEGORY_SETTIMANALI = 'Agende Settimanali' as const
/** @deprecated Usare `AGENDE_SUBCATEGORY_PLANNING`. */
export const AGENDE_SUBCATEGORY_ORGANIZER = 'Agende Planning' as const
export const AGENDE_SUBCATEGORY_PLANNING = 'Agende Planning' as const

export const AGENDE_SUBCATEGORIES = [
  AGENDE_SUBCATEGORY_GIORNALIERE,
  AGENDE_SUBCATEGORY_SETTIMANALI,
  AGENDE_SUBCATEGORY_PLANNING,
] as const

export type AgendeSubcategory = (typeof AGENDE_SUBCATEGORIES)[number]

/** Etichetta legacy (pre-rinomina) ancora presente su alcuni prodotti DB. */
export const AGENDE_SUBCATEGORY_PLANNING_LEGACY_LABELS = [
  'Agende Organizer / Ad Anelli',
  'Agende Organizer',
] as const

/** Slug path `/agende/:slug` → etichetta sottocategoria. */
export const AGENDE_SUBCATEGORY_SLUGS: Record<string, AgendeSubcategory> = {
  giornaliere: AGENDE_SUBCATEGORY_GIORNALIERE,
  settimanali: AGENDE_SUBCATEGORY_SETTIMANALI,
  planning: AGENDE_SUBCATEGORY_PLANNING,
  /** Alias legacy → Agende Planning. */
  organizer: AGENDE_SUBCATEGORY_PLANNING,
}

/** Anno di collezione mostrato in coda al nome prodotto (SKU/prezzi/URL invariati). */
export const AGENDA_CATALOG_YEAR = '2027'

/**
 * Aggiunge ` 2027` in fondo al titolo. Idempotente se il nome termina già con l’anno.
 */
export function withAgendaCatalogYear(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return trimmed
  if (new RegExp(`(?:^|\\s)${AGENDA_CATALOG_YEAR}\\s*$`).test(trimmed)) return trimmed
  return `${trimmed} ${AGENDA_CATALOG_YEAR}`
}

/** Applica l’anno di collezione solo ai prodotti della categoria Agende. */
export function applyAgendeCatalogYearIfNeeded(
  name: string,
  category: string | null | undefined,
): string {
  const cat = (category ?? '').trim()
  if (!cat || cat.localeCompare(AGENDE_CATEGORY, 'it', { sensitivity: 'base' }) !== 0) {
    return name
  }
  return withAgendaCatalogYear(name)
}

export const IMMEDIATE_AVAILABILITY_LABEL = 'Disponibilità immediata'

export function isAgendeCategoryProduct(
  product: Pick<OfficeProduct, 'category'> | null | undefined,
): boolean {
  const cat = (product?.category ?? '').trim()
  return Boolean(cat) && cat.localeCompare(AGENDE_CATEGORY, 'it', { sensitivity: 'base' }) === 0
}

/** Badge/listing: Agende (e articoli già marcati in pronta consegna). */
export function showsImmediateAvailability(
  product: Pick<OfficeProduct, 'category' | 'inStock' | 'availabilityLabel'> | null | undefined,
): boolean {
  if (!product) return false
  if (product.inStock === true) return true
  if ((product.availabilityLabel ?? '').trim() === IMMEDIATE_AVAILABILITY_LABEL) return true
  return isAgendeCategoryProduct(product)
}

export function applyAgendeImmediateAvailability(product: OfficeProduct): OfficeProduct {
  if (!isAgendeCategoryProduct(product)) return product
  if (
    product.inStock === true &&
    product.availabilityLabel === IMMEDIATE_AVAILABILITY_LABEL &&
    product.mainFeatures?.Disponibilità === IMMEDIATE_AVAILABILITY_LABEL
  ) {
    return product
  }
  return {
    ...product,
    inStock: true,
    availabilityLabel: IMMEDIATE_AVAILABILITY_LABEL,
    mainFeatures: {
      ...product.mainFeatures,
      Disponibilità: IMMEDIATE_AVAILABILITY_LABEL,
    },
  }
}

export const AGENDE_CATEGORY_DESCRIPTION =
  "Scopri la nostra ampia selezione di agende per l'ufficio, la scuola e il tempo libero. Agende giornaliere, settimanali e planning dei migliori marchi per pianificare al meglio le tue giornate."

/** Copertina / hero hub Agende. */
export const AGENDE_CATEGORY_HERO_IMAGE_URL =
  'https://www.bernispa.com/storage/media/51569/alfa.jpg'

/** Cover tile hub per sottocategoria. */
export const AGENDE_SUBCATEGORY_COVER_IMAGE: Record<AgendeSubcategory, string> = {
  [AGENDE_SUBCATEGORY_GIORNALIERE]:
    'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
  [AGENDE_SUBCATEGORY_SETTIMANALI]:
    'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7157AF-1024-1024-0.jpg',
  [AGENDE_SUBCATEGORY_PLANNING]:
    'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755AF-1024-1024-0.jpg',
}

/** Pretty URL hub (`/agende`) e listing query coerente. */
export function agendeCategoryHref(subcategory?: string): string {
  const sub = subcategory?.trim()
  if (!sub) return '/agende'
  // Preferisci lo slug canonico (es. planning, non organizer).
  const preferredSlug =
    sub === AGENDE_SUBCATEGORY_PLANNING
      ? 'planning'
      : Object.entries(AGENDE_SUBCATEGORY_SLUGS).find(([, label]) => label === sub)?.[0]
  if (preferredSlug) return `/agende/${preferredSlug}`
  const params = new URLSearchParams()
  params.set('category', AGENDE_CATEGORY)
  params.set('subcategory', sub)
  return `/office-products?${params.toString()}`
}

/** URL interno OfficePage (query) usato dai redirect `/agende`. */
export function agendeOfficeProductsHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', AGENDE_CATEGORY)
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

export function agendeSubcategoryFromSlug(slug: string | null | undefined): AgendeSubcategory | null {
  const key = (slug ?? '').trim().toLowerCase()
  if (!key) return null
  return AGENDE_SUBCATEGORY_SLUGS[key] ?? null
}

export function matchesAgendeSubcategoryFilter(
  product: { subcategory?: string | null },
  subcategory: string,
): boolean {
  const wanted = subcategory.trim()
  if (!wanted) return true
  const actual = (product.subcategory ?? '').trim()
  if (actual.localeCompare(wanted, 'it', { sensitivity: 'base' }) === 0) return true
  // Compat: prodotti ancora etichettati come Organizer → filtro Planning.
  if (wanted === AGENDE_SUBCATEGORY_PLANNING) {
    return AGENDE_SUBCATEGORY_PLANNING_LEGACY_LABELS.some(
      (legacy) => actual.localeCompare(legacy, 'it', { sensitivity: 'base' }) === 0,
    )
  }
  return false
}
