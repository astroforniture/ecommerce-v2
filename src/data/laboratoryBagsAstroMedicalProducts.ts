import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'

/** Materiale da laboratorio e borse mediche GIMA (listino imponibile IVA esclusa). */
export const LAB_BAGS_OFFICE_ID_PREFIX = 'AF-LAB-'

let labBagsGimaIdSet: ReadonlySet<string> | null = null

export function isLaboratoryBagsAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  labBagsGimaIdSet ??= new Set(buildLaboratoryBagsAstroMedicalOfficeProducts().map((p) => p.id))
  return labBagsGimaIdSet.has(s)
}

type LabRow = {
  slug: string
  name: string
  brand: string
  priceImponible: number
  imageUrl: string
  description: string
  subcategory: string
}

const P = LAB_BAGS_OFFICE_ID_PREFIX
const LAB_SUB = 'Materiale da laboratorio'
const BAGS_SUB = 'Borse mediche e emergenza'

function gimaMedium(file: string): string {
  const tail = file.replace(/^\/+/, '').trim()
  return `https://www.gimaitaly.com/images/prodotti/medium/${tail}`
}

const LAB_BAGS_CATALOG: readonly LabRow[] = [
  {
    slug: 'gima-37918',
    name: 'PROVETTA 5 ml — cilindrica 12×86 mm — PP sterile — GIMA 37918',
    brand: 'Gima',
    priceImponible: 298,
    imageUrl: gimaMedium('37918.jpg'),
    subcategory: LAB_SUB,
    description:
      'Provetta cilindrica 5 ml in polipropilene, 12×86 mm, sterile; per campioni e laboratorio. ' +
      'Compatibile con rastrelliera diam. 12–13 mm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37919',
    name: 'PROVETTA 10 ml — cilindrica 16×100 mm — PP sterile — GIMA 37919',
    brand: 'Gima',
    priceImponible: 185,
    imageUrl: gimaMedium('37919.jpg'),
    subcategory: LAB_SUB,
    description:
      'Provetta cilindrica 10 ml in polipropilene, 16×100 mm, sterile. Compatibile con rastrelliera diam. 16 mm. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37920',
    name: 'PROVETTA 5 ml — sterile — variante — GIMA 37920',
    brand: 'Gima',
    priceImponible: 148,
    imageUrl: gimaMedium('37920.jpg'),
    subcategory: LAB_SUB,
    description:
      'Provetta 5 ml sterile, variante listino Gima; polipropilene per uso di laboratorio. ' +
      'Compatibile con rastrelliera diam. 12–13 mm. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37935',
    name: 'RASTRELLIERA PER PROVETTE — diam. 12 o 13 mm — 90 posti — GIMA 37935',
    brand: 'Gima',
    priceImponible: 32,
    imageUrl: gimaMedium('37935.jpg'),
    subcategory: LAB_SUB,
    description:
      'Rastrelliera per provette, fori diam. 12 o 13 mm, 90 posti; per organizzazione banco laboratorio. ' +
      'Abbinare alle provette 5 ml GIMA 37918 e 37920. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37936',
    name: 'RASTRELLIERA PER PROVETTE — diam. 16 mm — 60 posti — GIMA 37936',
    brand: 'Gima',
    priceImponible: 32,
    imageUrl: gimaMedium('37936.jpg'),
    subcategory: LAB_SUB,
    description:
      'Rastrelliera per provette, fori diam. 16 mm, 60 posti. Abbinare alla provetta 10 ml GIMA 37919. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37950',
    name: 'PIPETTA PASTEUR 1 ml — GIMA 37950',
    brand: 'Gima',
    priceImponible: 215,
    imageUrl: gimaMedium('37950.jpg'),
    subcategory: LAB_SUB,
    description:
      'Pipetta Pasteur monouso 1 ml per prelievi e dosaggi in laboratorio. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-37951',
    name: 'PIPETTA PASTEUR 3 ml — GIMA 37951',
    brand: 'Gima',
    priceImponible: 215,
    imageUrl: gimaMedium('37951.jpg'),
    subcategory: LAB_SUB,
    description:
      'Pipetta Pasteur monouso 3 ml per prelievi e dosaggi in laboratorio. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27125',
    name: 'BORSA UTILITY — nylon — blu — GIMA 27125',
    brand: 'Gima',
    priceImponible: 53,
    imageUrl: gimaMedium('27125.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa utility in nylon, colore blu; formato compatto per materiali e piccoli accessori sanitari. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27127',
    name: 'BORSA UTILITY — nylon — beige — GIMA 27127',
    brand: 'Gima',
    priceImponible: 53,
    imageUrl: gimaMedium('27127.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa utility in nylon, colore beige. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27128',
    name: 'BORSA PROFESSIONAL — GIMA 27128',
    brand: 'Gima',
    priceImponible: 92,
    imageUrl: gimaMedium('27128.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa professional per uso sanitario e ambulatoriale; capienza e organizzazione interna secondo scheda Gima. ' +
      'Accessorio consigliato: portafiale GIMA 27129. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27129',
    name: 'PORTAFIALE — nylon — rosso — GIMA 27129',
    brand: 'Gima',
    priceImponible: 19.6,
    imageUrl: gimaMedium('27129.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Portafiale in nylon rosso per trasporto sicuro di fiale e flaconi; accessorio ideale con borse Smart e Professional. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27132',
    name: 'BORSA FIRST AID — blu — vuota — GIMA 27132',
    brand: 'Gima',
    priceImponible: 29.3,
    imageUrl: gimaMedium('27132.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa primo soccorso vuota, colore blu; da completare con contenuto secondo protocollo. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27133',
    name: 'BORSA MEDICAZIONE — cordura — blu — GIMA 27133',
    brand: 'Gima',
    priceImponible: 20.3,
    imageUrl: gimaMedium('27133.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa medicazione in cordura blu per materiali di cura e medicazione domiciliare/ambulatoriale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27134',
    name: 'BORSA MULTIUSO — blu/grigio — GIMA 27134',
    brand: 'Gima',
    priceImponible: 74.5,
    imageUrl: gimaMedium('27134.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa multiuso blu/grigio per equipaggiamento sanitario versatile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27135',
    name: 'BORSA MULTIUSO — marrone/beige — GIMA 27135',
    brand: 'Gima',
    priceImponible: 74.6,
    imageUrl: gimaMedium('27135.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa multiuso marrone/beige; stessa linea della versione blu/grigio. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27139',
    name: 'BORSA PORTASTRUMENTI — cordura — nera — GIMA 27139',
    brand: 'Gima',
    priceImponible: 31.5,
    imageUrl: gimaMedium('27139.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa portastrumenti in cordura nera per ferri e piccolo strumentario. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27141',
    name: 'BORSA SMART CON TROLLEY — media — blu — GIMA 27141',
    brand: 'Gima',
    priceImponible: 129,
    imageUrl: gimaMedium('27141.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart media con trolley integrato, colore blu; per emergenza e trasporto kit sanitari. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27150',
    name: 'BORSA SMART — piccola — rossa — GIMA 27150',
    brand: 'Gima',
    priceImponible: 56,
    imageUrl: gimaMedium('27150.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart piccola rossa; linea emergenza Gima. Abbinare al portafiale GIMA 27129. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27151',
    name: 'BORSA SMART — media — rossa — GIMA 27151',
    brand: 'Gima',
    priceImponible: 93,
    imageUrl: gimaMedium('27151.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart media rossa per kit sanitari e soccorso. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27152',
    name: 'BORSA SMART — media — blu — GIMA 27152',
    brand: 'Gima',
    priceImponible: 93,
    imageUrl: gimaMedium('27152.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart media blu; formato intermedio della linea Smart. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27153',
    name: 'BORSA SMART — grande — rossa — GIMA 27153',
    brand: 'Gima',
    priceImponible: 98.5,
    imageUrl: gimaMedium('27153.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart grande rossa; capienza superiore per equipaggiamento esteso. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27154',
    name: 'BORSA SMART CON TROLLEY — media — rossa — GIMA 27154',
    brand: 'Gima',
    priceImponible: 154,
    imageUrl: gimaMedium('27154.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart media con trolley, colore rosso; mobilità per intervento e ambulanza. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27155',
    name: 'BORSA SMART PVC — piccola — rossa — GIMA 27155',
    brand: 'Gima',
    priceImponible: 82,
    imageUrl: gimaMedium('27155.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart in PVC, formato piccolo, rossa; superficie lavabile. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'gima-27157',
    name: 'BORSA SMART PVC — media — rossa — GIMA 27157',
    brand: 'Gima',
    priceImponible: 110,
    imageUrl: gimaMedium('27157.jpg'),
    subcategory: BAGS_SUB,
    description:
      'Borsa Smart in PVC, formato medio, rossa. Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function labRowForSlug(slug: string): LabRow {
  const row = LAB_BAGS_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown laboratory/bags catalog slug: ${slug}`)
  return row
}

function labGimaIdForSlug(slug: string): string {
  return gimaOfficeProductIdFromImageUrl(labRowForSlug(slug).imageUrl) ?? `${P}${slug}`
}

export function laboratoryBagsCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(P)) {
    return labGimaIdForSlug(raw.slice(P.length))
  }
  return raw
}

const PROVETTE_12_13_IDS = [labGimaIdForSlug('gima-37918'), labGimaIdForSlug('gima-37920')] as const
const PROVETTE_16_ID = labGimaIdForSlug('gima-37919')
const RACK_12_13_ID = labGimaIdForSlug('gima-37935')
const RACK_16_ID = labGimaIdForSlug('gima-37936')
const PASTEUR_IDS = [labGimaIdForSlug('gima-37950'), labGimaIdForSlug('gima-37951')] as const

const PORTAFIALE_ID = labGimaIdForSlug('gima-27129')
const PROFESSIONAL_BAG_ID = labGimaIdForSlug('gima-27128')
const SMART_BAG_IDS = [
  labGimaIdForSlug('gima-27150'),
  labGimaIdForSlug('gima-27151'),
  labGimaIdForSlug('gima-27152'),
  labGimaIdForSlug('gima-27153'),
  labGimaIdForSlug('gima-27154'),
  labGimaIdForSlug('gima-27155'),
  labGimaIdForSlug('gima-27157'),
  labGimaIdForSlug('gima-27141'),
] as const

const PORTAFIALE_ACCESSORY_TARGETS = [PROFESSIONAL_BAG_ID, ...SMART_BAG_IDS] as const

const LAB_ALL_PROVETTE = [...PROVETTE_12_13_IDS, PROVETTE_16_ID] as const

function relatedFromGroup(group: readonly string[], id: string, max = 12): string[] {
  return group.filter((x) => x !== id).slice(0, max)
}

export function laboratoryBagsRelatedIdsForProductId(productId: string): string[] {
  const id = laboratoryBagsCanonicalProductId(productId)

  if (id === RACK_12_13_ID) {
    return [...PROVETTE_12_13_IDS, ...PASTEUR_IDS].slice(0, 12)
  }
  if (id === RACK_16_ID) {
    return [PROVETTE_16_ID, ...PASTEUR_IDS].filter((x) => x !== id).slice(0, 12)
  }
  if (PROVETTE_12_13_IDS.includes(id as (typeof PROVETTE_12_13_IDS)[number])) {
    return [RACK_12_13_ID, ...relatedFromGroup(PROVETTE_12_13_IDS, id), ...PASTEUR_IDS].slice(0, 12)
  }
  if (id === PROVETTE_16_ID) {
    return [RACK_16_ID, ...PASTEUR_IDS].filter((x) => x !== id).slice(0, 12)
  }
  if (PASTEUR_IDS.includes(id as (typeof PASTEUR_IDS)[number])) {
    return [...LAB_ALL_PROVETTE, RACK_12_13_ID, RACK_16_ID].filter((x) => x !== id).slice(0, 12)
  }

  if (id === PORTAFIALE_ID) {
    return [...PORTAFIALE_ACCESSORY_TARGETS].slice(0, 12)
  }
  if (id === PROFESSIONAL_BAG_ID || SMART_BAG_IDS.includes(id as (typeof SMART_BAG_IDS)[number])) {
    return [PORTAFIALE_ID, ...relatedFromGroup([...SMART_BAG_IDS, PROFESSIONAL_BAG_ID], id)].slice(0, 12)
  }

  if (id.startsWith('gima-271')) {
    return relatedFromGroup(
      LAB_BAGS_CATALOG.filter((r) => r.slug.startsWith('gima-271')).map((r) => labGimaIdForSlug(r.slug)),
      id,
    )
  }

  return relatedFromGroup(
    LAB_BAGS_CATALOG.map((r) => labGimaIdForSlug(r.slug)),
    id,
  )
}

export function buildLaboratoryBagsAstroMedicalOfficeProducts(): OfficeProduct[] {
  return LAB_BAGS_CATALOG.map((row) => {
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
