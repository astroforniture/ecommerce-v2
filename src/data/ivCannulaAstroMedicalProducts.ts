import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Cateteri IV, aghi Quincke e cannule BD / B-Braun (listino imponibile IVA esclusa). */
export const IV_CANNULA_OFFICE_ID_PREFIX = 'AF-IVCANN-'

let ivCannulaGimaIdSet: ReadonlySet<string> | null = null

export function isIvCannulaAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  ivCannulaGimaIdSet ??= new Set(buildIvCannulaAstroMedicalOfficeProducts().map((p) => p.id))
  return ivCannulaGimaIdSet.has(s)
}

type IvRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory?: string
}

const P = IV_CANNULA_OFFICE_ID_PREFIX

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const IV_CANNULA_CATALOG: readonly IvRow[] = [
  {
    slug: 'gima-23662',
    name: 'CATETERE IV INTROCAN SAFETY B-BRAUN 18G 45 mm — sterile — GIMA 23662',
    brand: 'B.Braun',
    priceImponible: 193,
    imageUrl: gimaMedium('23662.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Catetere venoso periferico INTROCAN SAFETY B-Braun 18G (1,3×45 mm), sterile, con dispositivo di sicurezza. ' +
      'Radiopaco; confezione secondo listino Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23663',
    name: 'CATETERE IV INTROCAN SAFETY B-BRAUN 20G 32 mm — sterile — GIMA 23663',
    brand: 'B.Braun',
    priceImponible: 193,
    imageUrl: gimaMedium('23663.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Catetere venoso periferico INTROCAN SAFETY B-Braun 20G (1,1×32 mm), sterile, con dispositivo di sicurezza. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23664',
    name: 'CATETERE IV INTROCAN SAFETY B-BRAUN 22G 25 mm — sterile — GIMA 23664',
    brand: 'B.Braun',
    priceImponible: 193,
    imageUrl: gimaMedium('23664.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Catetere venoso periferico INTROCAN SAFETY B-Braun 22G (0,9×25 mm), sterile, con dispositivo di sicurezza. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23705',
    name: 'AGHI BD QUINCKE 18G — 1,2×90 mm — rosa — GIMA 23705',
    brand: 'BD',
    priceImponible: 39.9,
    imageUrl: gimaMedium('23705.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Ago spinale Quincke BD 18G (1,2×90 mm), colore rosa; per procedure che richiedono ago a punta lancetta. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23707',
    name: 'AGHI BD QUINCKE 20G — 0,9×90 mm — giallo — GIMA 23707',
    brand: 'BD',
    priceImponible: 39.9,
    imageUrl: gimaMedium('23707.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Ago spinale Quincke BD 20G (0,9×90 mm), colore giallo. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23709',
    name: 'AGHI BD QUINCKE 22G — 0,7×90 mm — nero — GIMA 23709',
    brand: 'BD',
    priceImponible: 39.9,
    imageUrl: gimaMedium('23709.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Ago spinale Quincke BD 22G (0,7×90 mm), colore nero. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23712',
    name: 'AGO CANNULA BD VENFLON PRO SAFETY 18G 32 mm — sterile — GIMA 23712',
    brand: 'BD',
    priceImponible: 66.5,
    imageUrl: gimaMedium('23712.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Cannula venosa BD Venflon Pro Safety 18G (1,3×32 mm), sterile, con meccanismo di sicurezza integrato. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23713',
    name: 'AGO CANNULA BD VENFLON PRO SAFETY 20G 32 mm — sterile — GIMA 23713',
    brand: 'BD',
    priceImponible: 66.5,
    imageUrl: gimaMedium('23713.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Cannula venosa BD Venflon Pro Safety 20G (1,1×32 mm), sterile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23714',
    name: 'AGO CANNULA BD VENFLON PRO SAFETY 22G 25 mm — sterile — GIMA 23714',
    brand: 'BD',
    priceImponible: 66.5,
    imageUrl: gimaMedium('23714.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Cannula venosa BD Venflon Pro Safety 22G (0,9×25 mm), sterile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23716',
    name: 'AGO CANNULA BD VENFLON 20G 32 mm — sterile — GIMA 23716',
    brand: 'BD',
    priceImponible: 33.2,
    imageUrl: gimaMedium('23716.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Cannula venosa BD Venflon 20G (1,1×32 mm), sterile, linea standard. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23717',
    name: 'AGO CANNULA BD VENFLON 22G 25 mm — sterile — GIMA 23717',
    brand: 'BD',
    priceImponible: 33.2,
    imageUrl: gimaMedium('23717.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Cannula venosa BD Venflon 22G (0,9×25 mm), sterile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23733',
    name: 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 18G 45 mm — sterile — GIMA 23733',
    brand: 'B.Braun',
    priceImponible: 90,
    imageUrl: gimaMedium('23733.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Catetere VASOFIX Safety PUR B-Braun 18G (1,3×45 mm), sterile, poliuretano radiopaco con dispositivo di sicurezza. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23734',
    name: 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 20G 33 mm — sterile — GIMA 23734',
    brand: 'B.Braun',
    priceImponible: 90,
    imageUrl: gimaMedium('23734.jpg'),
    subcategory: 'Aghi, cateteri e cannule',
    description:
      'Catetere VASOFIX Safety PUR B-Braun 20G (1,1×33 mm), sterile. Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function ivRowForSlug(slug: string): IvRow {
  const row = IV_CANNULA_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown IV cannula catalog slug: ${slug}`)
  return row
}

function ivGimaIdForSlug(slug: string): string {
  const row = ivRowForSlug(slug)
  return gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${slug}`
}

export function ivCannulaCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return ivGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const INTROCAN_IDS = [
  ivGimaIdForSlug('gima-23662'),
  ivGimaIdForSlug('gima-23663'),
  ivGimaIdForSlug('gima-23664'),
] as const

const QUINCKE_IDS = [
  ivGimaIdForSlug('gima-23705'),
  ivGimaIdForSlug('gima-23707'),
  ivGimaIdForSlug('gima-23709'),
] as const

const VENFLON_PRO_IDS = [
  ivGimaIdForSlug('gima-23712'),
  ivGimaIdForSlug('gima-23713'),
  ivGimaIdForSlug('gima-23714'),
] as const

const VENFLON_IDS = [ivGimaIdForSlug('gima-23716'), ivGimaIdForSlug('gima-23717')] as const

const VASOFIX_IDS = [ivGimaIdForSlug('gima-23733'), ivGimaIdForSlug('gima-23734')] as const

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function ivCannulaRelatedIdsForProductId(productId: string): string[] {
  const id = ivCannulaCanonicalProductId(productId)

  if (INTROCAN_IDS.includes(id as (typeof INTROCAN_IDS)[number])) {
    return relatedFromGroup(INTROCAN_IDS, id)
  }
  if (QUINCKE_IDS.includes(id as (typeof QUINCKE_IDS)[number])) {
    return relatedFromGroup(QUINCKE_IDS, id)
  }
  if (VENFLON_PRO_IDS.includes(id as (typeof VENFLON_PRO_IDS)[number])) {
    return relatedFromGroup(VENFLON_PRO_IDS, id)
  }
  if (VENFLON_IDS.includes(id as (typeof VENFLON_IDS)[number])) {
    return relatedFromGroup(VENFLON_IDS, id)
  }
  if (VASOFIX_IDS.includes(id as (typeof VASOFIX_IDS)[number])) {
    return relatedFromGroup(VASOFIX_IDS, id)
  }

  return [
    ...INTROCAN_IDS,
    ...QUINCKE_IDS,
    ...VENFLON_PRO_IDS,
    ...VENFLON_IDS,
    ...VASOFIX_IDS,
  ]
    .filter((x) => x !== id)
    .slice(0, 12)
}

export function buildIvCannulaAstroMedicalOfficeProducts(): OfficeProduct[] {
  return IV_CANNULA_CATALOG.map((row) => {
    const id = gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${row.slug}`
    return {
      id,
      name: row.name,
      brand: row.brand,
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: row.subcategory ?? 'Aghi, cateteri e cannule',
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
  })
}
