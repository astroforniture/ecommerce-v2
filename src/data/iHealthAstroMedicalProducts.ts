import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
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
  officeIdOverride?: string
  imageGalleryUrls?: string[]
  gimaSku?: string
  downloadId?: string
  quantityPriceTiers?: QuantityPriceTier[]
  showQuantityDiscountTable?: boolean
}

const GIMA_MED = 'https://www.gimaitaly.com/images/prodotti/medium'

const IHEALTH_CATALOG: readonly IHealthRow[] = [
  {
    slug: 'neo-bp5s',
    officeIdOverride: 'gima-23495',
    name: 'Misuratore Pressione iHealth NEO BP5S (braccio)',
    imageUrl: `${GIMA_MED}/23495_a.jpg`,
    imageGalleryUrls: [`${GIMA_MED}/23495_a.jpg`, `${GIMA_MED}/23495_b.jpg`],
    priceImponible: 106.0,
    gimaSku: '23495',
    downloadId: '158277',
    description:
      'Misuratore digitale da braccio iHealth NEO BP5S: monitoraggio della pressione arteriosa in uso domestico o professionale leggero. ' +
      'Compatibile con app iHealth per storico misurazioni; funzioni e precisione secondo specifiche del produttore. ' +
      'Codice GIMA 23495. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'track',
    name: 'Misuratore Pressione iHealth TRACK (braccio)',
    imageUrl: `${GIMA_MED}/23499.jpg`,
    priceImponible: 32.0,
    description:
      'Misuratore pressione da braccio iHealth TRACK, formato compatto per uso quotidiano. ' +
      'Ideale per chi desidera tenere sotto controllo i valori in autonomia; dettagli tecnici e connettività secondo scheda produttore. ' +
      'Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'fit-hs2s',
    name: 'Bilancia Analisi iHealth FIT HS2S Wireless',
    imageUrl: `${GIMA_MED}/23503.jpg`,
    priceImponible: 50,
    gimaSku: '23503',
    downloadId: '158466',
    description:
      'Bilancia smart iHealth FIT HS2S con analisi corporea e connessione wireless. ' +
      'Pensata per il monitoraggio del peso e dei parametri indicati dal produttore tramite app dedicata. ' +
      'Codice GIMA 23503. Prezzo 50,00 € imponibile IVA esclusa.',
  },
  {
    slug: 'strisce-glicemia-large',
    name: 'Strisce Glicemia iHealth (Conf. Large)',
    imageUrl: `${GIMA_MED}/23512.jpg`,
    priceImponible: 28.0,
    gimaSku: '23512',
    downloadId: '158849',
    description:
      'Strisce reattive per glicemia iHealth, confezione large. ' +
      'Compatibilità e scadenza secondo indicazioni iHealth; abbinare al glucometro della stessa linea. ' +
      'Codice GIMA 23512. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'glucometro-bg5',
    officeIdOverride: 'gima-23510-14',
    name: 'Glucometro iHealth BG5 (senza strisce)',
    imageUrl: `${GIMA_MED}/23510-14.jpg`,
    priceImponible: 41.9,
    gimaSku: '23514',
    downloadId: '158849',
    description:
      'Glucometro iHealth BG5 per rilevazione della glicemia (senza strisce in dotazione). ' +
      'Richiede strisce dedicate iHealth vendute separatamente; trasmissione dati e funzioni come da documentazione ufficiale. ' +
      'Codice GIMA 23514. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'pulsox-wireless',
    officeIdOverride: 'gima-23525',
    name: 'Pulsoximetro Wireless iHealth',
    imageUrl: `${GIMA_MED}/23525_a.jpg`,
    priceImponible: 81.0,
    gimaSku: '23525',
    downloadId: '158617',
    description:
      'Pulsossimetro wireless iHealth per saturazione e frequenza; utilizzo non invasivo a dito. ' +
      'Adatto a monitoraggio rapido in contesti domestici o mobili; specifiche di misura e app secondo produttore. ' +
      'Codice GIMA 23525. Prezzo unitario imponibile IVA esclusa.',
  },
  {
    slug: 'sense-bp7-polso',
    officeIdOverride: 'gima-23501',
    name: 'Misuratore Pressione iHealth SENSE BP7 (polso)',
    imageUrl: `${GIMA_MED}/23501_a.jpeg`,
    imageGalleryUrls: [
      `${GIMA_MED}/23501_a.jpeg`,
      `${GIMA_MED}/23501_c.jpeg`,
      `${GIMA_MED}/23501_d.jpeg`,
    ],
    priceImponible: 13.5,
    gimaSku: '23501',
    downloadId: '158277',
    description:
      'Misuratore pressione da polso iHealth SENSE BP7, formato tascabile. ' +
      'Indicato per controlli rapidi; seguire le istruzioni di posizionamento per letture affidabili. ' +
      'Codice GIMA 23501. Prezzo 13,50 € imponibile IVA esclusa.',
  },
  {
    slug: 'view-bp7s-polso',
    officeIdOverride: 'gima-23502',
    name: 'Misuratore Pressione iHealth VIEW BP7S (polso c/display)',
    imageUrl: `${GIMA_MED}/23502_a.jpg`,
    imageGalleryUrls: [`${GIMA_MED}/23502_a.jpg`, `${GIMA_MED}/23502_b.jpg`],
    priceImponible: 89.0,
    gimaSku: '23502',
    downloadId: '158277',
    description:
      'Misuratore pressione da polso iHealth VIEW BP7S con display integrato. ' +
      'Visualizzazione immediata dei valori; funzioni aggiuntive e memoria secondo specifiche iHealth. ' +
      'Codice GIMA 23502. Prezzo unitario imponibile IVA esclusa.',
  },
] as const

function iHealthRowForSlug(slug: string): IHealthRow {
  const row = IHEALTH_CATALOG.find((r) => r.slug === slug)
  if (!row) throw new Error(`Unknown iHealth catalog slug: ${slug}`)
  return row
}

function iHealthGimaIdForSlug(slug: string): string {
  const row = iHealthRowForSlug(slug)
  return (
    row.officeIdOverride ??
    gimaOfficeProductIdFromImageUrl(row.imageUrl) ??
    `${IHEALTH_OFFICE_ID_PREFIX}${slug}`
  )
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
  iHealthGimaIdForSlug('sense-bp7-polso'),
  iHealthGimaIdForSlug('view-bp7s-polso'),
]

const GLUCOMETRO_ID = iHealthGimaIdForSlug('glucometro-bg5')
const STRISCE_L_ID = iHealthGimaIdForSlug('strisce-glicemia-large')
const BILANCIA_ID = iHealthGimaIdForSlug('fit-hs2s')
const PULSOX_ID = iHealthGimaIdForSlug('pulsox-wireless')

/** Ordine stabile di correlati (massimo ~12); pressione ↔ pressione; strisce ↔ glucometro. */
export function iHealthAstroMedicalRelatedIdsForProductId(productId: string): string[] {
  const id = iHealthCanonicalProductId(productId)

  if (PRESSURE_IDS.includes(id)) {
    return PRESSURE_IDS.filter((x) => x !== id)
  }
  if (id === STRISCE_L_ID) {
    return [GLUCOMETRO_ID, PULSOX_ID]
  }
  if (id === GLUCOMETRO_ID) {
    return [STRISCE_L_ID, PULSOX_ID, BILANCIA_ID]
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
    const gimaSku = String(row.gimaSku ?? '').trim()
    const gallery = (row.imageGalleryUrls ?? [])
      .map((url) => url.trim())
      .filter((url, i, arr) => url && url !== row.imageUrl && arr.indexOf(url) === i)
    const product: OfficeProduct = {
      id,
      name: row.name,
      brand: 'iHealth',
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: 'Elettromedicali',
      mainFeatures: {
        ...(gimaSku ? { 'Codice GIMA': gimaSku } : {}),
      },
      imageUrl: row.imageUrl,
      price: row.priceImponible,
      description: row.description,
    }
    if (gallery.length) product.imageGalleryUrls = gallery
    if (gimaSku) {
      product.brochureUrl = `https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=${gimaSku}`
      product.brochureLinkLabel = 'Scheda Tecnica'
    }
    if (gimaSku && row.downloadId) {
      product.catalogPagePdfUrl = `https://www.gimaitaly.com/Download/${row.downloadId}/${gimaSku}`
      product.catalogPagePdfLabel = 'Manuale / Documento PDF'
    }
    if (row.quantityPriceTiers?.length) {
      product.quantityPriceTiers = row.quantityPriceTiers.map((t) => ({ ...t }))
      product.showQuantityDiscountTable = row.showQuantityDiscountTable === true
    }
    return product
  })
}
