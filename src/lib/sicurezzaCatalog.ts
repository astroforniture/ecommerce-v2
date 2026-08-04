import { SICUREZZA_CATEGORY } from './officeCategories'

export const SICUREZZA_SUBCATEGORY_NASTRI = 'Nastri' as const
export const SICUREZZA_SUBCATEGORY_ELMETTI = 'Elmetti' as const
export const SICUREZZA_SUBCATEGORY_GUANTI = 'Guanti' as const
export const SICUREZZA_SUBCATEGORY_OCCHIALI = 'Occhiali' as const
export const SICUREZZA_SUBCATEGORY_PANTALONI = 'Pantaloni' as const
export const SICUREZZA_SUBCATEGORY_GIUBBOTTI = 'Giubbotti' as const
export const SICUREZZA_SUBCATEGORY_GIACCHE = 'Giacche' as const
export const SICUREZZA_SUBCATEGORY_PROTEZIONE_UDITO =
  "Dispositivi di protezione per l'udito" as const

export const SICUREZZA_SUBCATEGORIES = [
  SICUREZZA_SUBCATEGORY_NASTRI,
  SICUREZZA_SUBCATEGORY_ELMETTI,
  SICUREZZA_SUBCATEGORY_GUANTI,
  SICUREZZA_SUBCATEGORY_OCCHIALI,
  SICUREZZA_SUBCATEGORY_PANTALONI,
  SICUREZZA_SUBCATEGORY_GIUBBOTTI,
  SICUREZZA_SUBCATEGORY_GIACCHE,
  SICUREZZA_SUBCATEGORY_PROTEZIONE_UDITO,
] as const

export type SicurezzaSubcategory = (typeof SICUREZZA_SUBCATEGORIES)[number]

/** Hero banner macro-categoria Sicurezza (asset locale). */
export const SICUREZZA_CATEGORY_HERO_IMAGE_URL =
  '/images/man-with-arms-crossed-working-warehouse.jpg' as const

/** Cover tile hub / Mega Menu / nav per sottocategorie Sicurezza. */
export const SICUREZZA_SUBCATEGORY_COVER_IMAGE: Record<SicurezzaSubcategory, string> = {
  [SICUREZZA_SUBCATEGORY_NASTRI]: 'https://odmultimedia.eu/immagini/MD/101356.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_ELMETTI]: 'https://odmultimedia.eu/immagini/MD/97181.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_GUANTI]: 'https://odmultimedia.eu/immagini/LD/76214.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_OCCHIALI]: 'https://odmultimedia.eu/immagini/MD/79718.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_PANTALONI]: 'https://odmultimedia.eu/immagini/LD/86187.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_GIUBBOTTI]: 'https://odmultimedia.eu/immagini/LD/73755.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_GIACCHE]: 'https://odmultimedia.eu/immagini/LD/104546.jpg?v=246',
  [SICUREZZA_SUBCATEGORY_PROTEZIONE_UDITO]:
    'https://odmultimedia.eu/immagini/LD/79840.jpg?v=246',
}

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
