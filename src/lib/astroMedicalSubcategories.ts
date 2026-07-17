import type { OfficeProduct } from '../types/officeProduct'

/** Sotto-categorie navigabili della linea Astro Medical (smistamento automatico dal titolo). */
export const ASTRO_MEDICAL_SUBCATEGORY_AGHI = 'Aghi'
export const ASTRO_MEDICAL_SUBCATEGORY_BILANCE = 'Bilance'
export const ASTRO_MEDICAL_SUBCATEGORY_BORSE = 'Borse Mediche'
export const ASTRO_MEDICAL_SUBCATEGORY_CEROTTI_GARZE = 'Cerotti e Garze'

export const ASTRO_MEDICAL_SUBCATEGORIES = [
  ASTRO_MEDICAL_SUBCATEGORY_AGHI,
  ASTRO_MEDICAL_SUBCATEGORY_BILANCE,
  ASTRO_MEDICAL_SUBCATEGORY_BORSE,
  ASTRO_MEDICAL_SUBCATEGORY_CEROTTI_GARZE,
] as const

export type AstroMedicalSubcategoryLabel = (typeof ASTRO_MEDICAL_SUBCATEGORIES)[number]

/** Termini nel titolo → Bilance (pesatura, piattaforme, neonati). */
const BILANCE_TITLE_TERMS = [
  'bilancia',
  'pesapersone',
  'piattaforma digitale',
  'pesaneonati',
  'pesaneonato',
] as const

/** Termini nel titolo → Cerotti e Garze (medicazione, suture). */
const CEROTTI_GARZE_TITLE_TERMS = [
  'cerotti',
  'cerotto',
  'garza',
  'garze',
  'compresse',
  'sutura',
] as const

const BORSE_MEDICHE_TITLE_TERMS = ['borsa', 'portafiale', 'trousse'] as const

function normalizeProductTitle(name: string): string {
  return String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** `ago` come token (evita falsi positivi in parole più lunghe). */
function titleHasAgoToken(titleNorm: string): boolean {
  if (titleNorm.includes('aghi')) return true
  return /(^|[^a-z0-9])ago([^a-z0-9]|$)/.test(titleNorm)
}

function titleIncludesAny(titleNorm: string, terms: readonly string[]): boolean {
  return terms.some((term) => titleNorm.includes(term.toLowerCase()))
}

/**
 * Assegna una sotto-categoria in base al titolo prodotto (`name`).
 * Priorità: Bilance → Cerotti e Garze (incl. sutura) → Aghi → Borse Mediche.
 * Le suture Ethicon contengono «ago» nel titolo ma vanno in Cerotti e Garze prima del match Aghi.
 */
export function inferAstroMedicalSubcategoryFromName(
  name: string,
): AstroMedicalSubcategoryLabel | null {
  const title = normalizeProductTitle(name)
  if (!title) return null

  if (titleIncludesAny(title, BILANCE_TITLE_TERMS)) {
    return ASTRO_MEDICAL_SUBCATEGORY_BILANCE
  }

  if (titleIncludesAny(title, CEROTTI_GARZE_TITLE_TERMS)) {
    return ASTRO_MEDICAL_SUBCATEGORY_CEROTTI_GARZE
  }

  if (titleHasAgoToken(title)) return ASTRO_MEDICAL_SUBCATEGORY_AGHI

  if (titleIncludesAny(title, BORSE_MEDICHE_TITLE_TERMS)) {
    return ASTRO_MEDICAL_SUBCATEGORY_BORSE
  }

  return null
}

export function withAstroMedicalInferredSubcategory(product: OfficeProduct): OfficeProduct {
  const inferred = inferAstroMedicalSubcategoryFromName(product.name)
  if (!inferred) return product
  return { ...product, subcategory: inferred }
}

export function applyAstroMedicalSubcategoriesToCatalog(
  products: OfficeProduct[],
): OfficeProduct[] {
  return products.map(withAstroMedicalInferredSubcategory)
}

export function matchesAstroMedicalSubcategoryFilter(
  product: OfficeProduct,
  subcategoryLabel: string,
): boolean {
  const expected = subcategoryLabel.trim()
  if (!expected) return true
  const inferred =
    (product.subcategory ?? '').trim() ||
    inferAstroMedicalSubcategoryFromName(product.name) ||
    ''
  return inferred === expected
}

export function isAstroMedicalSubcategoryLabel(
  value: string | null | undefined,
): value is AstroMedicalSubcategoryLabel {
  const v = (value ?? '').trim()
  return (ASTRO_MEDICAL_SUBCATEGORIES as readonly string[]).includes(v)
}

export function countAstroMedicalProductsBySubcategory(
  products: OfficeProduct[],
): Record<AstroMedicalSubcategoryLabel, number> {
  const counts = Object.fromEntries(
    ASTRO_MEDICAL_SUBCATEGORIES.map((label) => [label, 0]),
  ) as Record<AstroMedicalSubcategoryLabel, number>

  for (const p of products) {
    const label =
      (p.subcategory ?? '').trim() ||
      inferAstroMedicalSubcategoryFromName(p.name)
    if (label && label in counts) {
      counts[label as AstroMedicalSubcategoryLabel] += 1
    }
  }
  return counts
}
