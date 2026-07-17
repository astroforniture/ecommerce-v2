import type { OfficeProduct } from '../types/officeProduct'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'

/** Categoria catalogo office (deve coincidere con `?category=` e filtri listing). */
export const LINEA_ASTRO_MEDICAL_CATEGORY = 'Linea Specializzata Astro Medical'

/** Allineato a `officeCategoryFilterFromUrlParam` e confronti `p.category.toLowerCase()`. */
export const LINEA_ASTRO_MEDICAL_CATEGORY_NORM = LINEA_ASTRO_MEDICAL_CATEGORY.toLowerCase()

/** Alias categoria da DB legacy (es. `Medicale`, `Sanitario`). */
export const ASTRO_MEDICAL_CATEGORY_DB_ALIASES = [
  'medicale',
  'sanitario',
  'medical',
  'sanitari',
] as const

/** Pagina catalogo dedicata (card home, menu). */
export function lineaAstroMedicalCatalogPath(): string {
  return '/categoria/astro-medical'
}

export function lineaAstroMedicalIHealthListingPath(): string {
  return `/office-products?category=${encodeURIComponent(LINEA_ASTRO_MEDICAL_CATEGORY)}`
}

/** Riconosce la categoria sanitaria su righe Supabase o prodotti office. */
export function isAstroMedicalProductCategory(category: string): boolean {
  const norm = String(category ?? '')
    .trim()
    .toLowerCase()
  if (!norm) return false
  if (norm === LINEA_ASTRO_MEDICAL_CATEGORY_NORM) return true
  if (norm.includes('linea specializzata astro medical')) return true
  return (ASTRO_MEDICAL_CATEGORY_DB_ALIASES as readonly string[]).includes(norm)
}

/** Legacy URL PDP / carrello (retrocompatibilità). */
export const IHEALTH_OFFICE_ID_PREFIX = 'AF-IHEALTH-'

let iHealthGimaIdSet: ReadonlySet<string> | null = null

type IHealthRow = {
  slug: string
  name: string
  imageUrl: string
  priceImponible: number
  description: string
}

const IHEALTH_CATALOG: readonly IHealthRow[] = [
  {
    slug: 'neo-bp5s',
    name: 'Misuratore Pressione iHealth NEO BP5S (braccio)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23495.jpg',
    priceImponible: 106.0,
    description:
      'Misuratore digitale da braccio iHealth NEO BP5S: monitoraggio della pressione arteriosa in uso domestico o professionale leggero. ' +
      'Compatibile con app iHealth per storico misurazioni; funzioni e precisione secondo specifiche del produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'track',
    name: 'Misuratore Pressione iHealth TRACK (braccio)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23499.jpg',
    priceImponible: 32.0,
    description:
      'Misuratore pressione da braccio iHealth TRACK, formato compatto per uso quotidiano. ' +
      'Ideale per chi desidera tenere sotto controllo i valori in autonomia; dettagli tecnici e connettività secondo scheda produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'fit-hs2s',
    name: 'Bilancia Analisi iHealth FIT HS2S Wireless',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23503.jpg',
    priceImponible: 60.5,
    description:
      'Bilancia smart iHealth FIT HS2S con analisi corporea e connessione wireless. ' +
      'Pensata per il monitoraggio del peso e dei parametri indicati dal produttore tramite app dedicata. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'strisce-glicemia-small',
    name: 'Strisce Glicemia iHealth (Conf. Small)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23511.jpg',
    priceImponible: 14.0,
    description:
      'Strisce reattive per glicemia iHealth, confezione small. ' +
      'Da utilizzare esclusivamente con i glucometri compatibili indicati dal produttore; conservazione e modalità d’uso come da istruzioni in confezione. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'strisce-glicemia-large',
    name: 'Strisce Glicemia iHealth (Conf. Large)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23512.jpg',
    priceImponible: 28.0,
    description:
      'Strisce reattive per glicemia iHealth, confezione large. ' +
      'Compatibilità e scadenza secondo indicazioni iHealth; abbinare al glucometro della stessa linea. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'glucometro-bg5',
    name: 'Glucometro iHealth BG5 (senza strisce)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23510-14.jpg',
    priceImponible: 41.9,
    description:
      'Glucometro iHealth BG5 per rilevazione della glicemia (senza strisce in dotazione). ' +
      'Richiede strisce dedicate iHealth vendute separatamente; trasmissione dati e funzioni come da documentazione ufficiale. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'pulsox-wireless',
    name: 'Pulsoximetro Wireless iHealth',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23525.jpg',
    priceImponible: 81.0,
    description:
      'Pulsossimetro wireless iHealth per saturazione e frequenza; utilizzo non invasivo a dito. ' +
      'Adatto a monitoraggio rapido in contesti domestici o mobili; specifiche di misura e app secondo produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'bp5-braccio',
    name: 'Misuratore Pressione iHealth BP5 (braccio)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23500.jpeg',
    priceImponible: 82.0,
    description:
      'Misuratore pressione da braccio iHealth BP5 con connettività secondo scheda tecnica. ' +
      'Per tracciamento pressione e polso in modo semplice; cuffia e alimentazione come da kit produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'sense-bp7-polso',
    name: 'Misuratore Pressione iHealth SENSE BP7 (polso)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23501.jpeg',
    priceImponible: 14.4,
    description:
      'Misuratore pressione da polso iHealth SENSE BP7, formato tascabile. ' +
      'Indicato per controlli rapidi; seguire le istruzioni di posizionamento per letture affidabili. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'view-bp7s-polso',
    name: 'Misuratore Pressione iHealth VIEW BP7S (polso c/display)',
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/23502.jpg',
    priceImponible: 89.0,
    description:
      'Misuratore pressione da polso iHealth VIEW BP7S con display integrato. ' +
      'Visualizzazione immediata dei valori; funzioni aggiuntive e memoria secondo specifiche iHealth. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function iHealthRowForSlug(slug: string): IHealthRow {
  const row = IHEALTH_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown iHealth catalog slug: ${slug}`)
  return row
}

function iHealthGimaIdForSlug(slug: string): string {
  const row = iHealthRowForSlug(slug)
  return gimaOfficeProductIdFromImageUrl(row.imageUrl) ?? `${IHEALTH_OFFICE_ID_PREFIX}${slug}`
}

export function iHealthCanonicalProductId(productId: string): string {
  const raw = String(productId ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith(IHEALTH_OFFICE_ID_PREFIX)) {
    return iHealthGimaIdForSlug(raw.slice(IHEALTH_OFFICE_ID_PREFIX.length))
  }
  return raw
}

export function isIHealthOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  iHealthGimaIdSet ??= new Set(buildIHealthAstroMedicalOfficeProducts().map((p) => p.id))
  return iHealthGimaIdSet.has(s)
}

const PRESSURE_IDS: readonly string[] = [
  iHealthGimaIdForSlug('neo-bp5s'),
  iHealthGimaIdForSlug('track'),
  iHealthGimaIdForSlug('bp5-braccio'),
  iHealthGimaIdForSlug('sense-bp7-polso'),
  iHealthGimaIdForSlug('view-bp7s-polso'),
]

const GLUCOMETRO_ID = iHealthGimaIdForSlug('glucometro-bg5')
const STRISCE_S_ID = iHealthGimaIdForSlug('strisce-glicemia-small')
const STRISCE_L_ID = iHealthGimaIdForSlug('strisce-glicemia-large')
const BILANCIA_ID = iHealthGimaIdForSlug('fit-hs2s')
const PULSOX_ID = iHealthGimaIdForSlug('pulsox-wireless')

/** Ordine stabile di correlati (massimo ~12); pressione ↔ pressione; strisce ↔ glucometro. */
export function iHealthAstroMedicalRelatedIdsForProductId(productId: string): string[] {
  const id = iHealthCanonicalProductId(productId)

  if (PRESSURE_IDS.includes(id)) {
    return PRESSURE_IDS.filter((x) => x !== id)
  }
  if (id === STRISCE_S_ID) {
    return [GLUCOMETRO_ID, STRISCE_L_ID]
  }
  if (id === STRISCE_L_ID) {
    return [GLUCOMETRO_ID, STRISCE_S_ID]
  }
  if (id === GLUCOMETRO_ID) {
    return [STRISCE_S_ID, STRISCE_L_ID, PULSOX_ID, BILANCIA_ID]
  }
  if (id === BILANCIA_ID) {
    return [PULSOX_ID, iHealthGimaIdForSlug('track'), iHealthGimaIdForSlug('neo-bp5s'), GLUCOMETRO_ID]
  }
  if (id === PULSOX_ID) {
    return [BILANCIA_ID, GLUCOMETRO_ID, iHealthGimaIdForSlug('view-bp7s-polso'), iHealthGimaIdForSlug('neo-bp5s')]
  }
  return []
}

export function buildIHealthAstroMedicalOfficeProducts(): OfficeProduct[] {
  return IHEALTH_CATALOG.map((row) => {
    const id = iHealthGimaIdForSlug(row.slug)
    return {
      id,
      name: row.name,
      brand: 'iHealth',
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: 'Elettromedicali',
      mainFeatures: {},
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
  })
}
