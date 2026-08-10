/**
 * Tassonomia Astro Medical Shop allineata a gimaitaly.com.
 *
 * - Macro = raggruppamenti vetrina (`medicalCatalogByMacro` in medicalProducts.ts)
 * - Mapping = sottocategorie già presenti sui prodotti → macro (senza alterare id/schede)
 * - Non scrive sul database: solo layer FE di navigazione/filtro
 */

import type { OfficeProduct } from '../types/officeProduct'
import {
  gimaWebsiteDepartments,
  medicalCatalogByMacro,
} from '../data/medicalProducts'
import { lineaAstroMedicalCatalogPath } from '../data/iHealthAstroMedicalProducts'

/** Macro-categoria navigabile (etichetta IT = `medicalCatalogByMacro.macroLabelIt`). */
export type AstroMedicalMacroLabel = (typeof ASTRO_MEDICAL_MACROS)[number]['label']

export type AstroMedicalMacroDef = {
  id: string
  label: string
  /** Etichette GIMA (EN) dei reparti collegati, per riferimento / mega menu. */
  gimaDepartmentsEn: readonly string[]
}

function departmentsForMacro(gimaDeptIds: readonly number[]): string[] {
  return gimaDeptIds
    .map((id) => gimaWebsiteDepartments.find((d) => d.deptId === id)?.labelAsPublished)
    .filter((x): x is string => Boolean(x))
}

/** Macro principali = stesso albero di `medicalCatalogByMacro` (GIMA). */
export const ASTRO_MEDICAL_MACROS: readonly AstroMedicalMacroDef[] = medicalCatalogByMacro.map(
  (m) => ({
    id: m.macroId,
    label: m.macroLabelIt,
    gimaDepartmentsEn: departmentsForMacro(m.gimaDeptIds),
  }),
)

/** Etichette macro in ordine menu (fonte unica per nav). */
export const ASTRO_MEDICAL_SUBCATEGORIES = ASTRO_MEDICAL_MACROS.map((m) => m.label)

export type AstroMedicalSubcategoryLabel = (typeof ASTRO_MEDICAL_SUBCATEGORIES)[number]

/** Alias legacy delle 4 pill precedenti → macro GIMA (URL vecchie). */
const LEGACY_UI_SUBCATEGORY_TO_MACRO: Record<string, string> = {
  Aghi: 'Strumentario e chirurgia',
  Bilance: 'Diagnostica',
  'Borse Mediche': 'Organizzazione e ausili',
  'Cerotti e Garze': 'Emergenza e pronto soccorso',
}

/**
 * Mapping esplicito: sottocategoria già presente sui prodotti (cataloghi FE)
 * → macro GIMA. Chiavi normalizzate in lowercase.
 */
const EXISTING_SUBCATEGORY_TO_MACRO: Record<string, string> = {
  // Diagnostica
  termometria: 'Diagnostica',
  'laboratorio e campioni': 'Diagnostica',
  'materiale da laboratorio': 'Diagnostica',
  'diagnostica corporea e sistemi di pesatura': 'Diagnostica',
  'antropometria e misurazione': 'Diagnostica',
  plicometri: 'Diagnostica',
  'bilance mediche professionali': 'Diagnostica',
  'bilance pesapersone': 'Diagnostica',
  'bilance professionali e pesaneonati': 'Diagnostica',
  'diagnostica professionale': 'Diagnostica',
  'rilevatori di vene': 'Diagnostica',
  diagnostica: 'Diagnostica',

  // Emergenza / pronto soccorso
  'medicazione e primo soccorso': 'Emergenza e pronto soccorso',
  'emergenza e emostasi': 'Emergenza e pronto soccorso',
  'borse mediche e emergenza': 'Emergenza e pronto soccorso',
  'emergenza e pronto soccorso': 'Emergenza e pronto soccorso',
  'pronto soccorso': 'Emergenza e pronto soccorso',

  // Arredo
  'arredo e illuminazione': 'Arredo e illuminazione',
  arredamento: 'Arredo e illuminazione',
  'arredamento medico': 'Arredo e illuminazione',

  // Strumentario / chirurgia
  'strumentario chirurgico': 'Strumentario e chirurgia',
  strumentario: 'Strumentario e chirurgia',
  'suture chirurgiche': 'Strumentario e chirurgia',
  'aghi, cateteri e cannule': 'Strumentario e chirurgia',
  'strumentario e chirurgia': 'Strumentario e chirurgia',

  // Elettromedicali
  elettromedicali: 'Elettromedicali',
  'terapia respiratoria': 'Elettromedicali',

  // Farmacia / monouso / cura
  'termoterapia e benessere': 'Farmacia e cura',
  'dpi vie respiratorie': 'Farmacia e cura',
  'protezione oculare': 'Farmacia e cura',
  'smaltimento rifiuti speciali': 'Farmacia e cura',
  'farmacia e cura': 'Farmacia e cura',
  monouso: 'Farmacia e cura',
  consumabili: 'Farmacia e cura',

  // Organizzazione / ausili / borse
  'ausili e sanitaria': 'Organizzazione e ausili',
  'ausili per pazienti': 'Organizzazione e ausili',
  'borse pregiate in pelle e cuoio': 'Organizzazione e ausili',
  'organizzazione e ausili': 'Organizzazione e ausili',

  // Ginecologia
  'maternità e specialistica': 'Ginecologia',
  ginecologia: 'Ginecologia',

  // Altri macro legacy usati come subcategory (seed medicalProducts)
  sterilizzazione: 'Sterilizzazione',
  veterinaria: 'Veterinaria',
  'formazione e anatomia': 'Formazione e anatomia',
}

function normKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function isKnownMacroLabel(label: string): boolean {
  const n = normKey(label)
  return ASTRO_MEDICAL_SUBCATEGORIES.some((m) => normKey(m) === n)
}

function resolveMacroLabelCanonical(label: string): string | null {
  const n = normKey(label)
  const hit = ASTRO_MEDICAL_SUBCATEGORIES.find((m) => normKey(m) === n)
  return hit ?? null
}

/**
 * Inferenza di fallback dal titolo solo se manca una sottocategoria mappabile.
 * Non sostituisce i dati prodotto: usata solo per il filtro macro.
 */
function inferMacroFromProductName(name: string): string | null {
  const title = normKey(name)
  if (!title) return null

  if (
    title.includes('bilancia') ||
    title.includes('pesapersone') ||
    title.includes('pesaneonat') ||
    title.includes('otoscop') ||
    title.includes('stetoscop') ||
    title.includes('spirometr') ||
    title.includes('ecg') ||
    title.includes('monitor') ||
    title.includes('termometr') ||
    title.includes('ossimetro') ||
    title.includes('glucomet')
  ) {
    return 'Diagnostica'
  }

  if (
    title.includes('defibrill') ||
    title.includes('barell') ||
    title.includes('tourniquet') ||
    title.includes('emostas') ||
    title.includes('pronto soccorso') ||
    title.includes('first aid')
  ) {
    return 'Emergenza e pronto soccorso'
  }

  if (
    title.includes('lettin') ||
    title.includes('carrello') ||
    title.includes('armadiet') ||
    title.includes('lampad') ||
    title.includes('scialitic')
  ) {
    return 'Arredo e illuminazione'
  }

  if (
    title.includes('forbici') ||
    title.includes('pinza') ||
    title.includes('bisturi') ||
    title.includes('sutura') ||
    title.includes('ago') ||
    title.includes('aghi') ||
    title.includes('cateter') ||
    title.includes('cannul')
  ) {
    return 'Strumentario e chirurgia'
  }

  if (
    title.includes('elettromedic') ||
    title.includes('aspirator') ||
    title.includes('nebuliz') ||
    title.includes('magnetoterap') ||
    title.includes('diaterm')
  ) {
    return 'Elettromedicali'
  }

  if (title.includes('ginecolog') || title.includes('pessar') || title.includes('tiralatte')) {
    return 'Ginecologia'
  }

  if (title.includes('steriliz') || title.includes('autoclave')) {
    return 'Sterilizzazione'
  }

  if (title.includes('veterinar')) {
    return 'Veterinaria'
  }

  if (title.includes('anatom') || title.includes('manichin') || title.includes('modello')) {
    return 'Formazione e anatomia'
  }

  if (
    title.includes('borsa') ||
    title.includes('ausilio') ||
    title.includes('sedia a rotelle') ||
    title.includes('deambulatore')
  ) {
    return 'Organizzazione e ausili'
  }

  if (
    title.includes('mascherin') ||
    title.includes('guant') ||
    title.includes('cerott') ||
    title.includes('garza') ||
    title.includes('disinfett')
  ) {
    return 'Farmacia e cura'
  }

  return null
}

/**
 * Risolve la macro GIMA per un prodotto a partire dalla sottocategoria esistente
 * (e, in assenza, dal titolo). Non modifica id / scheda / DB.
 */
export function resolveAstroMedicalMacro(
  product: Pick<OfficeProduct, 'subcategory'> & { name?: string | null } | null | undefined,
): string | null {
  if (!product) return null

  const rawSub = (product.subcategory ?? '').trim()
  if (rawSub) {
    const asMacro = resolveMacroLabelCanonical(rawSub)
    if (asMacro) return asMacro

    const legacy = LEGACY_UI_SUBCATEGORY_TO_MACRO[rawSub]
    if (legacy) return legacy

    const mapped = EXISTING_SUBCATEGORY_TO_MACRO[normKey(rawSub)]
    if (mapped) return mapped
  }

  return inferMacroFromProductName(product.name ?? '')
}

/** @deprecated alias: le "subcategories" UI sono ora le macro GIMA. */
export function inferAstroMedicalSubcategoryFromName(name: string): AstroMedicalSubcategoryLabel | null {
  const macro = inferMacroFromProductName(name)
  return macro && isKnownMacroLabel(macro) ? (macro as AstroMedicalSubcategoryLabel) : null
}

/**
 * Non sovrascrive più `subcategory` (resta il dettaglio catalogo).
 * Conservata per compatibilità con `mergeLineaAstroMedicalCatalog`.
 */
export function withAstroMedicalInferredSubcategory(product: OfficeProduct): OfficeProduct {
  return product
}

export function applyAstroMedicalSubcategoriesToCatalog(
  products: OfficeProduct[],
): OfficeProduct[] {
  return products.map(withAstroMedicalInferredSubcategory)
}

/**
 * Filtro listing: `subcategoryLabel` può essere macro GIMA o alias legacy (Aghi, Bilance, …).
 */
export function matchesAstroMedicalSubcategoryFilter(
  product: OfficeProduct,
  subcategoryLabel: string,
): boolean {
  const expectedRaw = subcategoryLabel.trim()
  if (!expectedRaw) return true

  const expectedMacro =
    resolveMacroLabelCanonical(expectedRaw) ||
    LEGACY_UI_SUBCATEGORY_TO_MACRO[expectedRaw] ||
    EXISTING_SUBCATEGORY_TO_MACRO[normKey(expectedRaw)] ||
    expectedRaw

  const productMacro = resolveAstroMedicalMacro(product)
  if (!productMacro) return false
  return normKey(productMacro) === normKey(expectedMacro)
}

export function isAstroMedicalSubcategoryLabel(
  value: string | null | undefined,
): value is AstroMedicalSubcategoryLabel {
  const v = (value ?? '').trim()
  if (!v) return false
  if (isKnownMacroLabel(v)) return true
  if (v in LEGACY_UI_SUBCATEGORY_TO_MACRO) return true
  return false
}

/** Normalizza un param URL legacy/macro alla label macro canonica (o null). */
export function normalizeAstroMedicalNavFilter(
  value: string | null | undefined,
): AstroMedicalSubcategoryLabel | null {
  const v = (value ?? '').trim()
  if (!v) return null
  if (isKnownMacroLabel(v)) return resolveMacroLabelCanonical(v) as AstroMedicalSubcategoryLabel
  const legacy = LEGACY_UI_SUBCATEGORY_TO_MACRO[v]
  if (legacy && isKnownMacroLabel(legacy)) return legacy as AstroMedicalSubcategoryLabel
  return null
}

export function countAstroMedicalProductsBySubcategory(
  products: OfficeProduct[],
): Record<AstroMedicalSubcategoryLabel, number> {
  const counts = Object.fromEntries(
    ASTRO_MEDICAL_SUBCATEGORIES.map((label) => [label, 0]),
  ) as Record<AstroMedicalSubcategoryLabel, number>

  for (const p of products) {
    const label = resolveAstroMedicalMacro(p)
    if (label && label in counts) {
      counts[label as AstroMedicalSubcategoryLabel] += 1
    }
  }
  return counts
}

export function lineaAstroMedicalMacroHref(macroLabel?: string | null): string {
  const base = lineaAstroMedicalCatalogPath()
  const macro = normalizeAstroMedicalNavFilter(macroLabel)
  if (!macro) return base
  const params = new URLSearchParams()
  params.set('subcategory', macro)
  return `${base}?${params.toString()}`
}

/** Costanti legacy (non più usate come voci menu; tenute per import esterni). */
export const ASTRO_MEDICAL_SUBCATEGORY_AGHI = 'Aghi'
export const ASTRO_MEDICAL_SUBCATEGORY_BILANCE = 'Bilance'
export const ASTRO_MEDICAL_SUBCATEGORY_BORSE = 'Borse Mediche'
export const ASTRO_MEDICAL_SUBCATEGORY_CEROTTI_GARZE = 'Cerotti e Garze'
