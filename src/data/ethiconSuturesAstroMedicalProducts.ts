import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Suture Ethicon e rilevatori di vene (listino imponibile IVA esclusa). */
export const ETHICON_SUTURES_OFFICE_ID_PREFIX = 'AF-SUT-'

let ethiconSuturesGimaIdSet: ReadonlySet<string> | null = null

export function isEthiconSuturesAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  ethiconSuturesGimaIdSet ??= new Set(buildEthiconSuturesAstroMedicalOfficeProducts().map((p) => p.id))
  return ethiconSuturesGimaIdSet.has(s)
}

type SutureRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory: string
}

const P = ETHICON_SUTURES_OFFICE_ID_PREFIX

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const SUTURE_SUB = 'Suture chirurgiche'
const VEIN_SUB = 'Rilevatori di vene'

const ETHICON_CATALOG: readonly SutureRow[] = [
  /* ETHILON monofilamento */
  {
    slug: 'gima-22294',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 4/0 ago 13 mm — GIMA 22294',
    brand: 'Ethicon',
    priceImponible: 500,
    imageUrl: gimaMedium('22294.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura monofilamento non assorbibile ETHILON Ethicon, calibro 4/0, ago 13 mm (P-3), lunghezza filo 45 cm; confezione da 36 pezzi. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22296',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 3/0 ago 19 mm — GIMA 22296',
    brand: 'Ethicon',
    priceImponible: 355,
    imageUrl: gimaMedium('22296.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 3/0, ago 19 mm (FS-2), monofilamento nero; per approssimazione dei tessuti molli. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22297',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 4/0 ago 19 mm — GIMA 22297',
    brand: 'Ethicon',
    priceImponible: 157,
    imageUrl: gimaMedium('22297.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 4/0, ago 19 mm (FS-2). Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22298',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 4/0 ago 16 mm — GIMA 22298',
    brand: 'Ethicon',
    priceImponible: 165,
    imageUrl: gimaMedium('22298.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 4/0, ago 16 mm (FS-3). Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22299',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 8/0 ago 6,5 mm — GIMA 22299',
    brand: 'Ethicon',
    priceImponible: 310,
    imageUrl: gimaMedium('22299.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 8/0, ago 6,5 mm; indicata anche in ambito oftalmico e microchirurgico. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22300',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 6/0 ago 16 mm — GIMA 22300',
    brand: 'Ethicon',
    priceImponible: 175,
    imageUrl: gimaMedium('22300.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 6/0, ago 16 mm (FS-3). Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22301',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 5/0 ago 19 mm — GIMA 22301',
    brand: 'Ethicon',
    priceImponible: 164,
    imageUrl: gimaMedium('22301.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 5/0, ago 19 mm (FS-2). Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22302',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 4/0 ago 19 mm FS-2 — GIMA 22302',
    brand: 'Ethicon',
    priceImponible: 157,
    imageUrl: gimaMedium('22302.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 4/0, ago 19 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22303',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 3/0 ago 19 mm FS-2 — GIMA 22303',
    brand: 'Ethicon',
    priceImponible: 355,
    imageUrl: gimaMedium('22303.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 3/0, ago 19 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22304',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 3/0 ago 24 mm FS-1 — GIMA 22304',
    brand: 'Ethicon',
    priceImponible: 370,
    imageUrl: gimaMedium('22304.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 3/0, ago 24 mm FS-1, filo 75 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22305',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 5/0 ago 19 mm FS-2 — GIMA 22305',
    brand: 'Ethicon',
    priceImponible: 164,
    imageUrl: gimaMedium('22305.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 5/0, ago 19 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22306',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 5/0 ago 19 mm C-2 — GIMA 22306',
    brand: 'Ethicon',
    priceImponible: 164,
    imageUrl: gimaMedium('22306.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 5/0, ago 19 mm C-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22307',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 5/0 ago 19 mm P-3 — GIMA 22307',
    brand: 'Ethicon',
    priceImponible: 164,
    imageUrl: gimaMedium('22307.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 5/0, ago 19 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22308',
    name: 'SUTURA MONOFILAMENTO ETHICON ETHILON — 3/0 ago 13 mm P-3 — GIMA 22308',
    brand: 'Ethicon',
    priceImponible: 485,
    imageUrl: gimaMedium('22308.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura ETHILON Ethicon 3/0, ago 13 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  /* PERMA-HAND seta */
  {
    slug: 'gima-22310',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 4/0 ago 17 mm J-1 — intrecciata — GIMA 22310',
    brand: 'Ethicon',
    priceImponible: 66,
    imageUrl: gimaMedium('22310.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 4/0, ago 17 mm J-1, intrecciata; confezione da 12 pezzi. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22311',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 3/0 ago 22 mm — intrecciata — GIMA 22311',
    brand: 'Ethicon',
    priceImponible: 47,
    imageUrl: gimaMedium('22311.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 3/0, ago 22 mm, intrecciata. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22312',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 2/0 ago 22 mm X-1 — intrecciata — GIMA 22312',
    brand: 'Ethicon',
    priceImponible: 72,
    imageUrl: gimaMedium('22312.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 2/0, ago 22 mm X-1. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22313',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 4/0 ago 19 mm ST-4 — intrecciata — GIMA 22313',
    brand: 'Ethicon',
    priceImponible: 58,
    imageUrl: gimaMedium('22313.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 4/0, ago retto 19 mm ST-4. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22314',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 4/0 ago 13 mm P-3 — intrecciata — GIMA 22314',
    brand: 'Ethicon',
    priceImponible: 55,
    imageUrl: gimaMedium('22314.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 4/0, ago 13 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22315',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 3/0 ago 22 mm SH-1 Plus — intrecciata — GIMA 22315',
    brand: 'Ethicon',
    priceImponible: 52,
    imageUrl: gimaMedium('22315.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 3/0, ago 22 mm SH-1 Plus. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22316',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 4/0 ago 17 mm FS-2 — intrecciata — GIMA 22316',
    brand: 'Ethicon',
    priceImponible: 60,
    imageUrl: gimaMedium('22316.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 4/0, ago 17 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22317',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 3/0 ago 19 mm RB-1 — intrecciata — GIMA 22317',
    brand: 'Ethicon',
    priceImponible: 54,
    imageUrl: gimaMedium('22317.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 3/0, ago 19 mm RB-1. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22318',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 4/0 ago 19 mm FS-2S — intrecciata — GIMA 22318',
    brand: 'Ethicon',
    priceImponible: 56,
    imageUrl: gimaMedium('22318.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 4/0, ago 19 mm FS-2S. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22319',
    name: 'SUTURA SETA ETHICON PERMA-HAND — 3/0 ago 24 mm FS-1 — intrecciata — GIMA 22319',
    brand: 'Ethicon',
    priceImponible: 50,
    imageUrl: gimaMedium('22319.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura in seta PERMA-HAND Ethicon, 3/0, ago 24 mm FS-1. Prezzo unitario imponibile IVA esclusa.',
  },
  /* PROLENE */
  {
    slug: 'gima-22320',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 4/0 ago 19 mm FS-2 — GIMA 22320',
    brand: 'Ethicon',
    priceImponible: 203,
    imageUrl: gimaMedium('22320.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura monofilamento PROLENE blu Ethicon, 4/0, ago 19 mm FS-2; polipropilene non assorbibile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22321',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 4/0 ago 19 mm FS-2 — GIMA 22321',
    brand: 'Ethicon',
    priceImponible: 198,
    imageUrl: gimaMedium('22321.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 4/0, ago 19 mm FS-2, filo 45 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22322',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 6/0 ago 16 mm PC-3 Prime — GIMA 22322',
    brand: 'Ethicon',
    priceImponible: 228,
    imageUrl: gimaMedium('22322.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 6/0, ago 16 mm PC-3 Prime. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22323',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 5/0 ago 19 mm FS-2 — GIMA 22323',
    brand: 'Ethicon',
    priceImponible: 205,
    imageUrl: gimaMedium('22323.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 5/0, ago 19 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22324',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 3/0 ago 19 mm FS-3 — GIMA 22324',
    brand: 'Ethicon',
    priceImponible: 218,
    imageUrl: gimaMedium('22324.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 3/0, ago 19 mm FS-3. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22325',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 4/0 ago 19 mm PS-2 — GIMA 22325',
    brand: 'Ethicon',
    priceImponible: 195,
    imageUrl: gimaMedium('22325.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 4/0, ago 19 mm PS-2, filo 75 cm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22326',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 4/0 ago 19 mm FS-2 — GIMA 22326',
    brand: 'Ethicon',
    priceImponible: 200,
    imageUrl: gimaMedium('22326.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 4/0, ago 19 mm FS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22327',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 3/0 ago 19 mm PS-2 — GIMA 22327',
    brand: 'Ethicon',
    priceImponible: 212,
    imageUrl: gimaMedium('22327.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 3/0, ago 19 mm PS-2. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22328',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 5/0 ago 13 mm P-3 — GIMA 22328',
    brand: 'Ethicon',
    priceImponible: 188,
    imageUrl: gimaMedium('22328.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 5/0, ago 13 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22329',
    name: 'SUTURA MONOFILAMENTO ETHICON PROLENE BLUE — 4/0 ago 13 mm P-3 — GIMA 22329',
    brand: 'Ethicon',
    priceImponible: 192,
    imageUrl: gimaMedium('22329.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura PROLENE Ethicon 4/0, ago 13 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  /* VICRYL PLUS */
  {
    slug: 'gima-22360',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 4/0 ago 19 mm — intrecciata — GIMA 22360',
    brand: 'Ethicon',
    priceImponible: 298,
    imageUrl: gimaMedium('22360.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura assorbibile VICRYL PLUS intrecciata Ethicon, 4/0, ago 19 mm FS-2; rivestimento antibatterico. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22361',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 3/0 ago 17 mm RB-1 Plus — intrecciata — GIMA 22361',
    brand: 'Ethicon',
    priceImponible: 305,
    imageUrl: gimaMedium('22361.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 3/0, ago 17 mm RB-1 Plus. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22362',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 3/0 ago 24 mm FS-1 — intrecciata — GIMA 22362',
    brand: 'Ethicon',
    priceImponible: 308,
    imageUrl: gimaMedium('22362.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 3/0, ago 24 mm FS-1. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22363',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 2/0 ago 24 mm — intrecciata — GIMA 22363',
    brand: 'Ethicon',
    priceImponible: 315,
    imageUrl: gimaMedium('22363.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 2/0, ago 24 mm FS-1, intrecciata. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22364',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 3/0 ago 22 mm SH-1 — intrecciata — GIMA 22364',
    brand: 'Ethicon',
    priceImponible: 318,
    imageUrl: gimaMedium('22364.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 3/0, ago 22 mm SH-1. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22365',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 2/0 ago 26 mm SH — intrecciata — GIMA 22365',
    brand: 'Ethicon',
    priceImponible: 322,
    imageUrl: gimaMedium('22365.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 2/0, ago 26 mm SH. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-22366',
    name: 'SUTURA ASSORBIBILE ETHICON VICRYL PLUS — 4/0 ago 13 mm P-3 — intrecciata — GIMA 22366',
    brand: 'Ethicon',
    priceImponible: 295,
    imageUrl: gimaMedium('22366.jpg'),
    subcategory: SUTURE_SUB,
    description:
      'Sutura VICRYL PLUS Ethicon 4/0, ago 13 mm P-3. Prezzo unitario imponibile IVA esclusa.',
  },
  /* Rilevatori vene */
  {
    slug: 'gima-23454',
    name: 'RILEVATORE DI VENE PROFESSIONALE QV-600 — GIMA 23454',
    brand: 'Gima',
    priceImponible: 2560,
    imageUrl: gimaMedium('23454.jpg'),
    subcategory: VEIN_SUB,
    description:
      'Rilevatore di vene professionale QV-600 con display; 12 modalità colore per adattarsi a età e tipologia del paziente. ' +
      'Per flebologia e accessi venosi difficili. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-23456',
    name: 'RILEVATORE DI VENE PROFESSIONALE QV-500 — GIMA 23456',
    brand: 'Gima',
    priceImponible: 1970,
    imageUrl: gimaMedium('23456.jpg'),
    subcategory: VEIN_SUB,
    description:
      'Rilevatore di vene professionale QV-500; 7 modalità colore, uso ambulatoriale e sala operatoria. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function sutureRowForSlug(slug: string): SutureRow {
  const row = ETHICON_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown Ethicon catalog slug: ${slug}`)
  return row
}

function sutureGimaIdForSlug(slug: string): string {
  const row = sutureRowForSlug(slug)
  return gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${slug}`
}

export function ethiconSuturesCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return sutureGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const ETHILON_IDS = [
  'gima-22294',
  'gima-22296',
  'gima-22297',
  'gima-22298',
  'gima-22299',
  'gima-22300',
  'gima-22301',
  'gima-22302',
  'gima-22303',
  'gima-22304',
  'gima-22305',
  'gima-22306',
  'gima-22307',
  'gima-22308',
].map((s) => sutureGimaIdForSlug(s)) as readonly string[]

const PERMA_HAND_IDS = [
  'gima-22310',
  'gima-22311',
  'gima-22312',
  'gima-22313',
  'gima-22314',
  'gima-22315',
  'gima-22316',
  'gima-22317',
  'gima-22318',
  'gima-22319',
].map((s) => sutureGimaIdForSlug(s)) as readonly string[]

const PROLENE_IDS = [
  'gima-22320',
  'gima-22321',
  'gima-22322',
  'gima-22323',
  'gima-22324',
  'gima-22325',
  'gima-22326',
  'gima-22327',
  'gima-22328',
  'gima-22329',
].map((s) => sutureGimaIdForSlug(s)) as readonly string[]

const VICRYL_PLUS_IDS = [
  'gima-22360',
  'gima-22361',
  'gima-22362',
  'gima-22363',
  'gima-22364',
  'gima-22365',
  'gima-22366',
].map((s) => sutureGimaIdForSlug(s)) as readonly string[]

const VEIN_DETECTOR_IDS = ['gima-23454', 'gima-23456'].map((s) =>
  sutureGimaIdForSlug(s),
) as readonly string[]

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function ethiconSuturesRelatedIdsForProductId(productId: string): string[] {
  const id = ethiconSuturesCanonicalProductId(productId)

  if (ETHILON_IDS.includes(id)) return relatedFromGroup(ETHILON_IDS, id)
  if (PERMA_HAND_IDS.includes(id)) return relatedFromGroup(PERMA_HAND_IDS, id)
  if (PROLENE_IDS.includes(id)) return relatedFromGroup(PROLENE_IDS, id)
  if (VICRYL_PLUS_IDS.includes(id)) return relatedFromGroup(VICRYL_PLUS_IDS, id)
  if (VEIN_DETECTOR_IDS.includes(id)) return relatedFromGroup(VEIN_DETECTOR_IDS, id)

  return [...ETHILON_IDS, ...VEIN_DETECTOR_IDS].filter((x) => x !== id).slice(0, 12)
}

export function buildEthiconSuturesAstroMedicalOfficeProducts(): OfficeProduct[] {
  return ETHICON_CATALOG.map((row) => {
    const id = gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${P}${row.slug}`
    return {
      id,
      name: row.name,
      brand: row.brand,
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: row.subcategory,
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
  })
}
