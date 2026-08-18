import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
import type { MedicalProduct } from './medicalProducts'
import { getAllMedicalProducts } from './medicalProducts'
import { LINEA_ASTRO_MEDICAL_CATEGORY } from './iHealthAstroMedicalProducts'
import { gimaOfficeProductIdFromImageUrl } from '../lib/gimaImageStem'

/** Prefisso legacy PDP / carrello quando manca URL Gima. */
export const LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX = 'AF-AMED-'

let legacyAstroMedicalGimaIdSet: ReadonlySet<string> | null = null

export function legacyAstroMedicalCanonicalId(key: string): string {
  const k = String(key ?? '').trim()
  if (!k.startsWith(LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX)) return k
  const sku = k.slice(LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX.length)
  const m = getAllMedicalProducts().find((x) => x.sku === sku)
  if (!m) return k
  if (m.gimaSku?.trim()) return `gima-${m.gimaSku.trim()}`
  return gimaOfficeProductIdFromImageUrl(m.imageUrl) ?? k
}

export function isLegacyAstroMedicalOfficeProductId(id: string): boolean {
  const s = String(id ?? '').trim()
  if (!s.startsWith('gima-')) return false
  legacyAstroMedicalGimaIdSet ??= new Set(
    buildLegacyAstroMedicalOfficeProducts().map((p) => p.id),
  )
  return legacyAstroMedicalGimaIdSet.has(s)
}

function officeDescription(m: MedicalProduct): string {
  const path = m.categoryPath.join(' › ')
  const base = (m.fullDescription ?? m.name).trim()
  return `${base}\n\nLinea: ${path}. Prezzo unitario imponibile IVA esclusa.`
}

type GimaCatalogOverride = {
  gimaSku: string
  name: string
  price: number
  packLabel?: string
  features?: Record<string, string>
  imageUrl?: string
  galleryUrls?: string[]
  description: string
  /** Path Download GIMA: `https://www.gimaitaly.com/Download/{id}/{sku}` */
  downloadId: string
  /** Vuoto = prezzo fisso per confezione (niente tabella scaglioni). */
  quantityPriceTiers: QuantityPriceTier[]
  /** Mostra la tabella listino quantità anche con un solo scaglione (prezzo base). */
  showQuantityDiscountTable?: boolean
}

const GIMA_CATALOG_OVERRIDES: readonly GimaCatalogOverride[] = [
  {
    gimaSku: '33371',
    name: 'ELETTRODI PE-FOAM MONOUSO 48-50 mm - Conf. 50 pz.',
    price: 6.7,
    packLabel: '50 pz',
    features: { Diametro: '48-50 mm' },
    description:
      'Elettrodi PE-Foam monouso diametro 48-50 mm, confezione da 50 pezzi. Codice GIMA 33371. ' +
      'Prezzo fisso per confezione da 50 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158480',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '33314',
    name: 'ELETTRODI MONOUSO FOAM 36-40 mm - Conf. 2000 pz.',
    price: 200,
    packLabel: '2000 pz',
    features: { Diametro: '36-40 mm' },
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/33314_a.jpg'],
    description:
      'Elettrodi monouso foam diametro 36-40 mm, confezione da 2000 pezzi. Codice GIMA 33314. ' +
      'Prezzo riferito alla confezione da 2000 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158480',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 200 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '33344',
    name: 'ELETTRODI FOAM MONOUSO 48-50mm - gel - Conf. 1200 pz.',
    price: 170,
    packLabel: '1200 pz',
    features: { Diametro: '48-50 mm', Gel: 'Sì' },
    description:
      'Elettrodi foam monouso diametro 48-50 mm con gel, confezione da 1200 pezzi. Codice GIMA 33344. ' +
      'Prezzo riferito alla confezione da 1200 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158480',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 170 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32950',
    name: 'Carta termica ECG 215x25 mmxm - rotolo griglia arancio - Conf. 5pz',
    price: 30,
    packLabel: '5 pz',
    features: { Formato: '215x25 mmxm', Griglia: 'Arancio', Tipo: 'Rotolo ECG' },
    description:
      'Carta termica ECG 215x25 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 32950. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158717',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 30 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32969',
    name: 'Carta termica ECG 80x20 mmxm - rotolo griglia arancio - Conf. 10pz',
    price: 25,
    packLabel: '10 pz',
    features: { Formato: '80x20 mmxm', Griglia: 'Arancio', Tipo: 'Rotolo ECG' },
    description:
      'Carta termica ECG 80x20 mmxm, rotolo con griglia arancio, confezione da 10 pezzi. Codice GIMA 32969. ' +
      'Prezzo riferito alla confezione da 10 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158717',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 25 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32967',
    name: 'Carta termica ECG 210x30 mmxm - rotolo griglia arancio - Conf. 5pz',
    price: 29,
    packLabel: '5 pz',
    features: { Formato: '210x30 mmxm', Griglia: 'Arancio', Tipo: 'Rotolo ECG' },
    description:
      'Carta termica ECG 210x30 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 32967. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158717',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 29 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32970',
    name: 'Carta termica ECG 110x20 mmxm - rotolo griglia arancio - Conf. 10pz',
    price: 30,
    packLabel: '10 pz',
    features: { Formato: '110x20 mmxm', Griglia: 'Arancio', Tipo: 'Rotolo ECG' },
    description:
      'Carta termica ECG 110x20 mmxm, rotolo con griglia arancio, confezione da 10 pezzi. Codice GIMA 32970. ' +
      'Prezzo riferito alla confezione da 10 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158717',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 30 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '33021',
    name: 'Carta termica ECG 210x20 mmxm - rotolo griglia arancio - Conf. 5pz',
    price: 30,
    packLabel: '5 pz',
    features: { Formato: '210x20 mmxm', Griglia: 'Arancio', Tipo: 'Rotolo ECG' },
    description:
      'Carta termica ECG 210x20 mmxm, rotolo con griglia arancio, confezione da 5 pezzi. Codice GIMA 33021. ' +
      'Prezzo riferito alla confezione da 5 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158858',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 30 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32560',
    name: 'FONENDO "TRAD" - lira nera',
    price: 4.2,
    features: { Modello: 'TRAD', Lira: 'Nera', Tipo: 'Fonendoscopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32555_57-64_b.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32560.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32555_57-64_a.jpg',
    ],
    description:
      'Fonendoscopio TRAD con lira nera. Codice GIMA 32560. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158328',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 4.2 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '49511',
    name: 'DUOFONO YTON - lira blu scuro',
    price: 15,
    features: { Modello: 'YTON', Lira: 'Blu scuro', Tipo: 'Duofono' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49511.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/49511_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/49511_c.jpg',
    ],
    description:
      'Duofono YTON con lira blu scuro. Codice GIMA 49511. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158313',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 15 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32570',
    name: 'FONENDO "WAN" - lira blu',
    price: 14,
    features: { Modello: 'WAN', Lira: 'Blu', Tipo: 'Fonendoscopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32570.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32570_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32569-72_b.jpg',
    ],
    description:
      'Fonendoscopio WAN con lira blu. Codice GIMA 32570. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158313',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 14 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '49501',
    name: 'FONENDOSCOPIO YTON - lira blu scuro',
    price: 13,
    features: { Modello: 'YTON', Lira: 'Blu scuro', Tipo: 'Fonendoscopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49501.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/49501_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/49501_c.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/49501_b.jpg',
    ],
    description:
      'Fonendoscopio YTON con lira blu scuro. Codice GIMA 49501. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158313',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 13 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32524',
    name: 'STETOSCOPIO LINUX - lira nera',
    price: 17,
    features: { Modello: 'LINUX', Lira: 'Nera', Tipo: 'Stetoscopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32524.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32524_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32524_a.jpg',
    ],
    description:
      'Stetoscopio LINUX con lira nera. Codice GIMA 32524. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158539',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 17 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32526',
    name: 'FONENDO REGALITE DELUXE',
    price: 55,
    features: { Modello: 'REGALITE DELUXE', Tipo: 'Fonendoscopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32526.jpg',
    description:
      'Fonendoscopio REGALITE DELUXE. Codice GIMA 32526. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158232',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '32550',
    name: 'DUOFONO "CLASSIC CARDIOLOGICO" - lira blu',
    price: 30,
    features: { Modello: 'CLASSIC CARDIOLOGICO', Lira: 'Blu', Tipo: 'Duofono' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32550.jpg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/32550_a.jpg'],
    description:
      'Duofono CLASSIC CARDIOLOGICO con lira blu. Codice GIMA 32550. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158232',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 30 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32580',
    name: 'DUOFONO "JOTARAP" - lira nera',
    price: 14,
    features: { Modello: 'JOTARAP', Lira: 'Nera', Tipo: 'Duofono' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32580.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32580_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32580_b.jpg',
    ],
    description:
      'Duofono JOTARAP con lira nera. Codice GIMA 32580. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158539',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 14 }],
    showQuantityDiscountTable: true,
  },
]

const GIMA_OVERRIDE_BY_SKU = new Map(GIMA_CATALOG_OVERRIDES.map((row) => [row.gimaSku, row]))

function numericGimaSku(value: string): string | null {
  const s = String(value ?? '').trim().toLowerCase()
  const m = s.match(/^(?:gima-)?(\d{5})(?:[_-].*)?$/)
  return m?.[1] ?? null
}

function gimaCatalogOverrideForProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name'>,
): GimaCatalogOverride | null {
  const fromId = numericGimaSku(product.id)
  if (fromId && GIMA_OVERRIDE_BY_SKU.has(fromId)) return GIMA_OVERRIDE_BY_SKU.get(fromId) ?? null
  const fromSku = numericGimaSku(product.producerCode)
  if (fromSku && GIMA_OVERRIDE_BY_SKU.has(fromSku)) return GIMA_OVERRIDE_BY_SKU.get(fromSku) ?? null
  const name = String(product.name ?? '').trim().toLowerCase()
  if (name.includes('elettrod')) {
    if (name.includes('gel') && name.includes('48-50')) return GIMA_OVERRIDE_BY_SKU.get('33344') ?? null
    if (name.includes('36-40')) return GIMA_OVERRIDE_BY_SKU.get('33314') ?? null
    if (name.includes('pe-foam') && name.includes('48-50')) return GIMA_OVERRIDE_BY_SKU.get('33371') ?? null
  }
  if (name.includes('carta termica') && name.includes('ecg')) {
    if (name.includes('215x25')) return GIMA_OVERRIDE_BY_SKU.get('32950') ?? null
    if (name.includes('80x20')) return GIMA_OVERRIDE_BY_SKU.get('32969') ?? null
    if (name.includes('210x30')) return GIMA_OVERRIDE_BY_SKU.get('32967') ?? null
    if (name.includes('110x20')) return GIMA_OVERRIDE_BY_SKU.get('32970') ?? null
    if (name.includes('210x20')) return GIMA_OVERRIDE_BY_SKU.get('33021') ?? null
  }
  if (name.includes('duofono') && name.includes('yton')) return GIMA_OVERRIDE_BY_SKU.get('49511') ?? null
  if (name.includes('duofono') && name.includes('cardiologico')) {
    return GIMA_OVERRIDE_BY_SKU.get('32550') ?? null
  }
  if (name.includes('duofono') && name.includes('jotarap')) {
    return GIMA_OVERRIDE_BY_SKU.get('32580') ?? null
  }
  if (name.includes('fonendoscopio') && name.includes('yton')) {
    return GIMA_OVERRIDE_BY_SKU.get('49501') ?? null
  }
  if (name.includes('fonendo') && name.includes('regalite')) {
    return GIMA_OVERRIDE_BY_SKU.get('32526') ?? null
  }
  if (name.includes('fonendo') && name.includes('trad')) return GIMA_OVERRIDE_BY_SKU.get('32560') ?? null
  if (name.includes('fonendo') && name.includes('wan')) return GIMA_OVERRIDE_BY_SKU.get('32570') ?? null
  if (name.includes('stetoscopio') && name.includes('linux')) {
    return GIMA_OVERRIDE_BY_SKU.get('32524') ?? null
  }
  return null
}

/** Listino, documenti e galleria GIMA Astro Medical (anche dopo merge DB). */
export function applyLegacyAstroMedicalProductOverrides(product: OfficeProduct): OfficeProduct {
  const spec = gimaCatalogOverrideForProduct(product)
  if (!spec) return product
  const imageUrl = spec.imageUrl?.trim() || product.imageUrl
  const gallery = (spec.galleryUrls?.length ? spec.galleryUrls : product.imageGalleryUrls ?? [])
    .map((url) => url.trim())
    .filter((url) => url && url !== imageUrl)
  return {
    ...product,
    name: spec.name,
    price: spec.price,
    description: spec.description,
    imageUrl,
    brochureUrl: `https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=${spec.gimaSku}`,
    brochureLinkLabel: 'Scheda Tecnica',
    catalogPagePdfUrl: `https://www.gimaitaly.com/Download/${spec.downloadId}/${spec.gimaSku}`,
    catalogPagePdfLabel: 'Manuale / Documento PDF',
    quantityPriceTiers: spec.quantityPriceTiers.map((t) => ({ ...t })),
    showQuantityDiscountTable: spec.showQuantityDiscountTable === true,
    imageGalleryUrls: gallery.length ? gallery : undefined,
    mainFeatures: {
      ...(product.mainFeatures ?? {}),
      'Codice GIMA': spec.gimaSku,
      ...(spec.packLabel ? { Confezione: spec.packLabel } : {}),
      ...(spec.features ?? {}),
    },
  }
}

export function buildLegacyAstroMedicalOfficeProducts(): OfficeProduct[] {
  return getAllMedicalProducts().map((m) => {
    const gimaSku = String(m.gimaSku ?? '').trim()
    const id = gimaSku
      ? `gima-${gimaSku}`
      : gimaOfficeProductIdFromImageUrl(m.imageUrl) ??
        `${LEGACY_ASTRO_MEDICAL_OFFICE_ID_PREFIX}${m.sku}`
    return applyLegacyAstroMedicalProductOverrides({
      id,
      name: m.name.trim(),
      brand: 'Gima',
      producerCode: id,
      category: LINEA_ASTRO_MEDICAL_CATEGORY,
      subcategory: (m.categoryPath[0] ?? 'Medical').trim(),
      mainFeatures: {},
      imageUrl: (m.imageUrl ?? '').trim(),
      price: m.price,
      description: officeDescription(m),
    })
  })
}
