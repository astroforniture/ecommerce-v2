import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Strumentario chirurgico GIMA / Aesculap (listino imponibile IVA esclusa). */
export const SURGICAL_INSTRUMENTS_OFFICE_ID_PREFIX = 'AF-SURG-'

let surgicalInstrumentsGimaIdSet: ReadonlySet<string> | null = null

export function isSurgicalInstrumentsOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  surgicalInstrumentsGimaIdSet ??= new Set(
    buildSurgicalInstrumentsAstroMedicalOfficeProducts().map((p) => p.id),
  )
  return surgicalInstrumentsGimaIdSet.has(s)
}

type SurgRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory?: string
  /** Quando più articoli condividono lo stesso JPG GIMA (es. teli 26495-97). */
  officeIdOverride?: string
}

const P = SURGICAL_INSTRUMENTS_OFFICE_ID_PREFIX

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const SURG_CATALOG: readonly SurgRow[] = [
  {
    slug: 'gima-26580',
    name: 'BACINELLA RENIFORME INOX 162x77x31 mm — GIMA 26580',
    brand: 'Gima',
    priceImponible: 3.5,
    imageUrl: gimaMedium('26580.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Bacinella reniforme in acciaio inox, dimensioni 162×77×31 mm (circa 190 ml). ' +
      'Per medicazione e uso chirurgico; lavabile e riutilizzabile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-26581',
    name: 'BACINELLA RENIFORME INOX 207x98x39 mm — GIMA 26581',
    brand: 'Gima',
    priceImponible: 6,
    imageUrl: gimaMedium('26581.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Bacinella reniforme in acciaio inox, dimensioni 207×98×39 mm (circa 400 ml). ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'telo-90x150',
    officeIdOverride: 'gima-26495-90x150',
    name: 'TELO CHIRURGICO 90×150 cm — GIMA 26495',
    brand: 'Gima',
    priceImponible: 11,
    imageUrl: gimaMedium('26495-97.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Telo chirurgico in cotone 100%, formato 90×150 cm, colore verde; produzione europea. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'telo-150x150',
    officeIdOverride: 'gima-26496-150x150',
    name: 'TELO CHIRURGICO 150×150 cm — GIMA 26496',
    brand: 'Gima',
    priceImponible: 12,
    imageUrl: gimaMedium('26495-97.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Telo chirurgico in cotone 100%, formato 150×150 cm, colore verde; produzione europea. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-26760',
    name: 'TROUSSE FERRI STANDARD — nylon 9 strumenti — GIMA 26760',
    brand: 'Gima',
    priceImponible: 62,
    imageUrl: gimaMedium('26760.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Trousse standard: kit da 9 strumenti in acciaio inox in borsa in poliestere. ' +
      'Include sonda, bisturi, pinze e forbici secondo composizione Gima. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-26761',
    name: 'TROUSSE FERRI CLASSICA — nylon 10 strumenti — GIMA 26761',
    brand: 'Gima',
    priceImponible: 72,
    imageUrl: gimaMedium('26761.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Trousse classica: kit da 10 strumenti in borsa in poliestere; include levapunti e porta aghi Mayo Hegar. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-26762',
    name: 'TROUSSE FERRI SUPREMA — nylon 11 strumenti — GIMA 26762',
    brand: 'Gima',
    priceImponible: 82,
    imageUrl: gimaMedium('26762.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Trousse suprema: kit da 11 strumenti in borsa in poliestere; include pinza Klemmmer e porta aghi Mathieu. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-26768',
    name: 'TROUSSE FERRI SUPREMA — scatola alluminio 11 strumenti — GIMA 26768',
    brand: 'Gima',
    priceImponible: 89,
    imageUrl: gimaMedium('26768.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Trousse ferri suprema: kit da 11 strumenti in scatola in alluminio; set professionale per medicazione e piccola chirurgia. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39101',
    name: 'FORBICI IRIS SOTTILI AESCULAP BC110R — 11 cm — GIMA 39101',
    brand: 'Aesculap',
    priceImponible: 82,
    imageUrl: gimaMedium('39101.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Iris sottili Aesculap, rette, punte acute/acute, 11 cm, codice BC110R. ' +
      'Dispositivo medico classe I; prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39102',
    name: 'FORBICI IRIDECTOMIA E LEGATURE AESCULAP BC111R — 11 cm — GIMA 39102',
    brand: 'Aesculap',
    priceImponible: 82,
    imageUrl: gimaMedium('39102.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici per iridectomia e legature Aesculap, curve, punte acute/acute, 11 cm, codice BC111R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39110',
    name: 'FORBICI CHIRURGICHE AESCULAP BC314R — smusse 14,5 cm — GIMA 39110',
    brand: 'Aesculap',
    priceImponible: 71,
    imageUrl: gimaMedium('39110.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici chirurgiche Aesculap, rette, punte smusse/smusse, 14,5 cm, codice BC314R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39111',
    name: 'FORBICI CHIRURGICHE AESCULAP BC315R — smusse 15 cm — GIMA 39111',
    brand: 'Aesculap',
    priceImponible: 72,
    imageUrl: gimaMedium('39111.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici chirurgiche Aesculap, rette, punte smusse/smusse, 15 cm, codice BC315R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39114',
    name: 'FORBICI CHIRURGICHE AESCULAP BC324R — alterne 14,5 cm — GIMA 39114',
    brand: 'Aesculap',
    priceImponible: 74,
    imageUrl: gimaMedium('39114.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici chirurgiche Aesculap, rette, punte acute/smusse, 14,5 cm, codice BC324R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39115',
    name: 'FORBICI CHIRURGICHE AESCULAP BC326R — alterne 16,5 cm — GIMA 39115',
    brand: 'Aesculap',
    priceImponible: 79,
    imageUrl: gimaMedium('39115.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici chirurgiche Aesculap, rette, punte acute/smusse, 16,5 cm, codice BC326R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39120',
    name: 'FORBICI MAYO AESCULAP BC545R — 15,5 cm — GIMA 39120',
    brand: 'Aesculap',
    priceImponible: 74,
    imageUrl: gimaMedium('39120.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Mayo Aesculap, rette, punte smusse/smusse, 15,5 cm, codice BC545R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39121',
    name: 'FORBICI MAYO AESCULAP BC555R — curve 15,5 cm — GIMA 39121',
    brand: 'Aesculap',
    priceImponible: 75,
    imageUrl: gimaMedium('39121.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Mayo Aesculap, curve, punte smusse/smusse, 15,5 cm, codice BC555R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39122',
    name: 'FORBICI MAYO AESCULAP BC584R — 16,5 cm — GIMA 39122',
    brand: 'Aesculap',
    priceImponible: 77,
    imageUrl: gimaMedium('39122.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Mayo Aesculap, rette, punte smusse/smusse, 16,5 cm, codice BC584R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39123',
    name: 'FORBICI MAYO DISSEZIONE AESCULAP BC587R — curve 16,5 cm — GIMA 39123',
    brand: 'Aesculap',
    priceImponible: 78,
    imageUrl: gimaMedium('39123.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Mayo da dissezione Aesculap, curve, punte smusse/smusse, 16,5 cm, codice BC587R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39130',
    name: 'FORBICI METZENBAUM AESCULAP BC601R — 14,5 cm — GIMA 39130',
    brand: 'Aesculap',
    priceImponible: 76,
    imageUrl: gimaMedium('39130.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Metzenbaum Aesculap, rette, punte smusse/smusse, 14,5 cm, codice BC601R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39131',
    name: 'FORBICI METZENBAUM AESCULAP BC602R — 18 cm — GIMA 39131',
    brand: 'Aesculap',
    priceImponible: 81,
    imageUrl: gimaMedium('39131.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Metzenbaum Aesculap, rette, punte smusse/smusse, 18 cm, codice BC602R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39132',
    name: 'FORBICI METZENBAUM AESCULAP BC605R — curve 14,5 cm — GIMA 39132',
    brand: 'Aesculap',
    priceImponible: 78,
    imageUrl: gimaMedium('39132.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Metzenbaum Aesculap, curve, punte smusse/smusse, 14,5 cm, codice BC605R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-39133',
    name: 'FORBICI METZENBAUM AESCULAP BC606R — curve 18 cm — GIMA 39133',
    brand: 'Aesculap',
    priceImponible: 83,
    imageUrl: gimaMedium('39133.jpg'),
    subcategory: 'Strumentario chirurgico',
    description:
      'Forbici Metzenbaum Aesculap, curve, punte smusse/smusse, 18 cm, codice BC606R. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function surgicalRowForSlug(slug: string): SurgRow {
  const row = SURG_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown surgical catalog slug: ${slug}`)
  return row
}

function surgicalGimaIdForSlug(slug: string): string {
  const row = surgicalRowForSlug(slug)
  return (
    row.officeIdOverride ??
    gimaOfficeProductIdFromImageUrl(row.imageUrl) ??
    `${P}${slug}`
  )
}

export function surgicalCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return surgicalGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const BACINELLE_IDS = [surgicalGimaIdForSlug('gima-26580'), surgicalGimaIdForSlug('gima-26581')] as const
const TELI_IDS = [
  surgicalGimaIdForSlug('telo-90x150'),
  surgicalGimaIdForSlug('telo-150x150'),
] as const
const TROUSSE_IDS = [
  surgicalGimaIdForSlug('gima-26760'),
  surgicalGimaIdForSlug('gima-26761'),
  surgicalGimaIdForSlug('gima-26762'),
  surgicalGimaIdForSlug('gima-26768'),
] as const
const AESCULAP_SCISSORS_IDS = [
  surgicalGimaIdForSlug('gima-39101'),
  surgicalGimaIdForSlug('gima-39102'),
  surgicalGimaIdForSlug('gima-39110'),
  surgicalGimaIdForSlug('gima-39111'),
  surgicalGimaIdForSlug('gima-39114'),
  surgicalGimaIdForSlug('gima-39115'),
  surgicalGimaIdForSlug('gima-39120'),
  surgicalGimaIdForSlug('gima-39121'),
  surgicalGimaIdForSlug('gima-39122'),
  surgicalGimaIdForSlug('gima-39123'),
  surgicalGimaIdForSlug('gima-39130'),
  surgicalGimaIdForSlug('gima-39131'),
  surgicalGimaIdForSlug('gima-39132'),
  surgicalGimaIdForSlug('gima-39133'),
] as const

const ALL_SURGICAL_GIMA_IDS = new Set<string>([
  ...BACINELLE_IDS,
  ...TELI_IDS,
  ...TROUSSE_IDS,
  ...AESCULAP_SCISSORS_IDS,
])

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function surgicalInstrumentsRelatedIdsForProductId(productId: string): string[] {
  const id = surgicalCanonicalProductId(productId)
  if (BACINELLE_IDS.includes(id as (typeof BACINELLE_IDS)[number])) {
    return relatedFromGroup(BACINELLE_IDS, id)
  }
  if (TELI_IDS.includes(id as (typeof TELI_IDS)[number])) {
    return relatedFromGroup(TELI_IDS, id)
  }
  if (TROUSSE_IDS.includes(id as (typeof TROUSSE_IDS)[number])) {
    return relatedFromGroup(TROUSSE_IDS, id)
  }
  if (AESCULAP_SCISSORS_IDS.includes(id as (typeof AESCULAP_SCISSORS_IDS)[number])) {
    return relatedFromGroup(AESCULAP_SCISSORS_IDS, id)
  }
  if (ALL_SURGICAL_GIMA_IDS.has(id)) {
    return [...TROUSSE_IDS, ...AESCULAP_SCISSORS_IDS].filter((x) => x !== id).slice(0, 12)
  }
  return []
}

export function buildSurgicalInstrumentsAstroMedicalOfficeProducts(): OfficeProduct[] {
  return SURG_CATALOG.map((row) => {
    const id =
      row.officeIdOverride ??
      gimaOfficeProductIdFromImageUrl(row.imageUrl) ??
      `${P}${row.slug}`
    return {
      id,
      name: row.name,
      brand: row.brand,
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: row.subcategory ?? 'Strumentario chirurgico',
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
  })
}
