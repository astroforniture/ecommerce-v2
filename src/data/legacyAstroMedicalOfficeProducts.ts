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
  minOrderQuantity?: number
  orderQuantityStep?: number
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
    name: 'ELETTRODI MONOUSO FOAM 36-40 mm - Conf. 100 pz.',
    price: 11,
    packLabel: '100 pz',
    features: { Diametro: '36-40 mm', Tipo: 'Elettrodi foam monouso' },
    imageUrl: '/images/gima-33314-100pz.png',
    galleryUrls: [
      '/images/gima-33314-100pz.png',
      'https://www.gimaitaly.com/images/prodotti/medium/33314_a.jpg',
    ],
    description:
      'Elettrodi monouso foam diametro 36-40 mm, confezione da 100 pezzi. Codice GIMA 33314. ' +
      'Prezzo 11,00 € per confezione da 100 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Elettrodi.',
    downloadId: '158480',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 11 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '33344',
    name: 'ELETTRODI FOAM MONOUSO 48-50mm - gel - Conf. 50 pz.',
    price: 7.15,
    packLabel: '50 pz',
    features: { Diametro: '48-50 mm', Gel: 'Sì' },
    description:
      'Elettrodi foam monouso diametro 48-50 mm con gel, confezione da 50 pezzi. Codice GIMA 33344. ' +
      'Prezzo riferito alla confezione da 50 pz, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Consumabili. Prezzo unitario imponibile IVA esclusa.',
    downloadId: '158480',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 7.15 }],
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
    // 32967.jpg non e' pubblicato su GIMA: asset ufficiale famiglia griglia arancio 210 mm (33021).
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33021.jpg',
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
  // ── Cavi ECG ───────────────────────────────────────────────────────────────
  {
    gimaSku: '33319',
    name: 'CAVO ECG VETERINARIA 5 derivazioni per 33305/6',
    price: 130,
    features: { Derivazioni: '5', Compatibilità: 'ECG GIMA 33305 / 33306', Tipo: 'Cavo ECG veterinaria' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33319.jpg',
    description:
      'Cavo ECG veterinaria 5 derivazioni, compatibile con elettrocardiografo GIMA 33305/33306. ' +
      'Codice GIMA 33319. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Elettromedicali.',
    downloadId: '158305',
    quantityPriceTiers: [],
  },
  // ── Sfigmomanometri e misuratori di pressione ──────────────────────────────
  {
    gimaSku: '32725',
    name: 'SFIGMO LONDON nero - aneroide',
    price: 20,
    features: { Modello: 'LONDON', Colore: 'Nero', Tipo: 'Sfigmomanometro aneroide' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32725.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32725_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32725_c.jpg',
    ],
    description:
      'Sfigmomanometro aneroide LONDON nero. Codice GIMA 32725. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158385',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 20 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32690',
    name: 'SFIGMO PALMARE KOBE',
    price: 19,
    features: { Modello: 'KOBE', Tipo: 'Sfigmomanometro palmare' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32690.jpg',
    description:
      'Sfigmomanometro palmare KOBE. Codice GIMA 32690. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158420',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 19 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32921',
    name: 'MISURATORE DI PRESSIONE AUTOMATICO GIMA SMART',
    price: 25,
    features: { Modello: 'GIMA SMART', Tipo: 'Misuratore automatico' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32921.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32921_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32921_a.jpg',
    ],
    description:
      'Misuratore di pressione automatico GIMA SMART. Codice GIMA 32921. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158864',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 25 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '32714',
    name: 'SFIGMO MINOR-2 - bracciale a velcro',
    price: 35,
    features: { Modello: 'MINOR-2', Tipo: 'Sfigmomanometro aneroide', Bracciale: 'Velcro' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32714.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32714_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32714_b.jpg',
    ],
    description:
      'Sfigmomanometro MINOR-2 con bracciale a velcro. Codice GIMA 32714. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158835',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 35 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '49898',
    name: 'MISURATORE DI PRESSIONE DIGITALE OMRON M2+ HEM-7188-LE',
    price: 40,
    features: { Marca: 'OMRON', Modello: 'M2+ HEM-7188-LE', Tipo: 'Misuratore digitale' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49898.jpeg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/49898_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/49898_b.jpg',
    ],
    description:
      'Misuratore di pressione digitale OMRON M2+ HEM-7188-LE. Codice GIMA 49898. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '49907',
    name: 'MISURATORE DI PRESSIONE DIGITALE OMRON M3 COMFORT AFIB HEM-7196-FLE',
    price: 60,
    features: { Marca: 'OMRON', Modello: 'M3 COMFORT AFIB HEM-7196-FLE', Tipo: 'Misuratore digitale' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49907.jpeg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/49907_a.jpg'],
    description:
      'Misuratore di pressione digitale OMRON M3 COMFORT AFIB HEM-7196-FLE. Codice GIMA 49907. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '49880',
    name: 'MISURATORE DI PRESSIONE AUTOMATICO EASYCHECK GIMA',
    price: 20,
    features: { Modello: 'EASYCHECK', Tipo: 'Misuratore automatico' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/49880.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/49880_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/49880_a.jpg',
    ],
    description:
      'Misuratore di pressione automatico EASYCHECK GIMA. Codice GIMA 49880. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158864',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 20 }],
    showQuantityDiscountTable: true,
  },
  // ── ECG ────────────────────────────────────────────────────────────────────
  {
    gimaSku: '33221',
    name: 'ECG CONTEC 300G - 3 canali con display',
    price: 400,
    features: { Marca: 'CONTEC', Modello: '300G', Canali: '3', Tipo: 'ECG' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33221.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/33221_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/33221_c.jpg',
    ],
    description:
      'Elettrocardiografo CONTEC 300G a 3 canali con display. Codice GIMA 33221. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158778',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '33224',
    name: 'ECG CONTEC 1200G - 12 canali con display',
    price: 740,
    features: { Marca: 'CONTEC', Modello: '1200G', Canali: '12', Tipo: 'ECG' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33224.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/33224_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/33224_b.jpg',
    ],
    description:
      'Elettrocardiografo CONTEC 1200G a 12 canali con display. Codice GIMA 33224. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158477',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '33222',
    name: 'ECG CONTEC 600G - 3/6 canali con display',
    price: 599,
    features: { Marca: 'CONTEC', Modello: '600G', Canali: '3/6', Tipo: 'ECG' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33222.jpeg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/33222_a.jpg'],
    description:
      'Elettrocardiografo CONTEC 600G a 3/6 canali con display. Codice GIMA 33222. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158778',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '54205',
    name: 'CARDIOLINE ECG200L FULL (Glasgow + EasyApp) - schermo a colori touch da 7',
    price: 1600,
    features: {
      Marca: 'CARDIOLINE',
      Modello: 'ECG200L FULL',
      Display: 'Touch 7" a colori',
      Tipo: 'ECG',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54205.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/54205_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/54205_c.jpg',
    ],
    description:
      'Cardioline ECG200L FULL (Glasgow + EasyApp) con schermo a colori touch da 7". Codice GIMA 54205. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158331',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '54231',
    name: 'NEO ECG T180 TABLET ECG con stampante',
    price: 1500,
    features: { Modello: 'NEO ECG T180', Tipo: 'Tablet ECG', Stampante: 'Integrata' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54231.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/54231_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/54231_c.jpg',
    ],
    description:
      'NEO ECG T180 tablet ECG con stampante. Codice GIMA 54231. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158565',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '33236',
    name: 'MONITOR ECG TASCABILE PCECG-500',
    price: 700,
    features: { Modello: 'PCECG-500', Tipo: 'Monitor ECG tascabile' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/33236_b.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/33236_c.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/33236.jpg',
    ],
    description:
      'Monitor ECG tascabile PCECG-500. Codice GIMA 33236. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158508',
    quantityPriceTiers: [],
  },
  // ── Colposcopi ─────────────────────────────────────────────────────────────
  {
    gimaSku: '29613',
    name: 'COLPOSCOPIO ALLTION A LED - 3,75X, 7X, 15X > 28.000 Lux',
    price: 2100,
    features: {
      Marca: 'ALLTION',
      Illuminazione: 'LED > 28.000 Lux',
      Ingrandimenti: '3,75X / 7X / 15X',
      Tipo: 'Colposcopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29613.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/29613_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29613_c.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29613_d.jpg',
    ],
    description:
      'Colposcopio ALLTION a LED con ingrandimenti 3,75X, 7X, 15X e illuminazione > 28.000 Lux. Codice GIMA 29613. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Strumenti.',
    downloadId: '158543',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '29600',
    name: 'COLPOSCOPIO GIMA COLPY',
    price: 2800,
    features: { Marca: 'GIMA', Modello: 'COLPY', Tipo: 'Colposcopio' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29600.jpg',
    description:
      'Colposcopio GIMA COLPY. Codice GIMA 29600. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Strumenti.',
    downloadId: '158543',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '29612',
    name: 'COLPOSCOPIO ALLTION A LED - 9X',
    price: 1900,
    features: {
      Marca: 'ALLTION',
      Illuminazione: 'LED',
      Ingrandimento: '9X',
      Tipo: 'Colposcopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29612.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/29612_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29612_c.jpg',
    ],
    description:
      'Colposcopio ALLTION a LED con ingrandimento 9X. Codice GIMA 29612. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Strumenti.',
    downloadId: '158543',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '29620',
    name: 'VIDEOCOLPOSCOPIO A LED COLPRO',
    price: 2600,
    features: {
      Marca: 'COLPRO',
      Illuminazione: 'LED',
      Tipo: 'Videocolposcopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/29620.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/29620_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29620_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29620_c.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/29620_d.jpg',
    ],
    description:
      'Videocolposcopio a LED COLPRO. Codice GIMA 29620. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Strumenti.',
    downloadId: '158543',
    quantityPriceTiers: [],
  },
  // ── Lettini / poltrone ginecologiche ───────────────────────────────────────
  {
    gimaSku: '27507',
    name: 'LETTINO GINECOLOGICO ALTEZZA VAR. - blu',
    price: 1300,
    features: {
      Colore: 'Blu',
      Altezza: 'Variabile',
      Tipo: 'Lettino ginecologico',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27507.jpg',
    description:
      'Lettino ginecologico ad altezza variabile, colore blu. Codice GIMA 27507. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Arredo.',
    downloadId: '158608',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '27506',
    name: 'LETTINO GINECOLOGICO ALTEZZA VAR. - verde',
    price: 1300,
    features: {
      Colore: 'Verde',
      Altezza: 'Variabile',
      Tipo: 'Lettino ginecologico',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27506.jpg',
    description:
      'Lettino ginecologico ad altezza variabile, colore verde. Codice GIMA 27506. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Arredo.',
    downloadId: '158608',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '27520',
    name: 'POLTRONA GINECOLOGICA GYNEX - colore a richiesta',
    price: 3000,
    features: {
      Modello: 'GYNEX',
      Colore: 'A richiesta',
      Tipo: 'Poltrona ginecologica',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27520.jpg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/27520-26_a.jpg'],
    description:
      'Poltrona ginecologica GYNEX, colore a richiesta. Codice GIMA 27520. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Arredo.',
    downloadId: '158499',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '27496',
    name: 'LETTO GINECOLOGICO AD ALTEZZA VARIABILE - altri colori',
    price: 1700,
    features: {
      Colore: 'Altri colori',
      Altezza: 'Variabile',
      Tipo: 'Letto ginecologico',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27496.jpg',
    description:
      'Letto ginecologico ad altezza variabile, altri colori. Codice GIMA 27496. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Ginecologia › Arredo.',
    downloadId: '158608',
    quantityPriceTiers: [],
  },
  // ── Defibrillatore / Holter ────────────────────────────────────────────────
  {
    gimaSku: '35340',
    name: 'DEFIBRILLATORE iPad CU-SP1 AED - GB,FR,IT,ES,DE,PL,US, JP, KR, Arabo',
    price: 900,
    features: {
      Modello: 'iPad CU-SP1 AED',
      Tipo: 'Defibrillatore',
      Lingue: 'GB, FR, IT, ES, DE, PL, US, JP, KR, Arabo',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/35340.jpg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/35340_b.jpg'],
    description:
      'Defibrillatore iPad CU-SP1 AED multilingua (GB, FR, IT, ES, DE, PL, US, JP, KR, Arabo). Codice GIMA 35340. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Emergenza e pronto soccorso › Pronto soccorso.',
    downloadId: '158667',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '35130',
    name: 'HOLTER ECG + SOFTWARE',
    price: 600,
    features: { Tipo: 'Holter ECG', Incluso: 'Software' },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/35130.jpeg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/35130_a.jpg'],
    description:
      'Holter ECG con software. Codice GIMA 35130. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158729',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '54300',
    name: 'SISTEMA DI MONITORAGGIO HOLTER M12 - 12 derivazioni',
    price: 950,
    features: {
      Modello: 'Holter M12',
      Derivazioni: '12',
      Tipo: 'Sistema di monitoraggio Holter',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/54300.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/54300_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/54300_d.jpg',
    ],
    description:
      'Sistema di monitoraggio Holter M12 a 12 derivazioni. Codice GIMA 54300. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158626',
    quantityPriceTiers: [],
  },
  // ── Dermatoscopi / Criochirurgia ───────────────────────────────────────────
  {
    gimaSku: '32177',
    name: 'DERMATOSCOPIO A LED POLARIZZATI+UV+BIANCHI MIC Wi-Fi & USB con software',
    price: 700,
    features: {
      Modello: 'MIC',
      Illuminazione: 'LED polarizzati + UV + bianchi',
      Connettività: 'Wi-Fi & USB',
      Tipo: 'Dermatoscopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/32177.jpeg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/32177_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32177_e.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/32177_a.jpg',
    ],
    description:
      'Dermatoscopio a LED polarizzati + UV + bianchi MIC Wi-Fi & USB con software. Codice GIMA 32177. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158362',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '31146',
    name: 'DERMATOSCOPIO HEINE DELTA 30 - K-230.28.305',
    price: 1500,
    features: {
      Marca: 'HEINE',
      Modello: 'DELTA 30',
      Codice: 'K-230.28.305',
      Tipo: 'Dermatoscopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31146.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/31146_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/31146_d.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/31146_a.jpg',
    ],
    description:
      'Dermatoscopio HEINE DELTA 30 (K-230.28.305). Codice GIMA 31146. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '31187',
    name: 'DERMATOSCOPIO GIMA 2000 - 10 ingrandimenti',
    price: 190,
    features: {
      Marca: 'GIMA',
      Modello: '2000',
      Ingrandimenti: '10',
      Tipo: 'Dermatoscopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31187.jpg',
    galleryUrls: [
      'https://www.gimaitaly.com/images/prodotti/medium/31187_a.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/31187_b.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/31187_c.jpg',
      'https://www.gimaitaly.com/images/prodotti/medium/31187_d.jpg',
    ],
    description:
      'Dermatoscopio GIMA 2000 a 10 ingrandimenti. Codice GIMA 31187. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '158362',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '31158',
    name: 'DERMATOSCOPIO LED HEINE MINI 3000 - nero',
    price: 400,
    features: {
      Marca: 'HEINE',
      Modello: 'MINI 3000',
      Colore: 'Nero',
      Illuminazione: 'LED',
      Tipo: 'Dermatoscopio',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/31158.jpg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/31158_a.jpg'],
    description:
      'Dermatoscopio LED HEINE MINI 3000, colore nero. Codice GIMA 31158. Prezzo fisso, imponibile IVA esclusa.\n\n' +
      'Linea: Diagnostica › Strumenti.',
    downloadId: '',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '30586',
    name: 'DISPOSITIVO CRIOCHIRURGICO CRYOMEGA con cartuccia 16 g',
    price: 290,
    features: {
      Modello: 'CRYOMEGA',
      Cartuccia: '16 g',
      Tipo: 'Dispositivo criochirurgico',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/30586.jpg',
    galleryUrls: ['https://www.gimaitaly.com/images/prodotti/medium/30586_b.jpg'],
    description:
      'Dispositivo criochirurgico CRYOMEGA con cartuccia 16 g. Codice GIMA 30586. Prezzo unitario imponibile IVA esclusa.\n\n' +
      'Linea: Strumentario e chirurgia › Strumenti.',
    downloadId: '158707',
    quantityPriceTiers: [{ minQuantity: 1, unitPrice: 290 }],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27416',
    name: 'LETTINO DA VISITA IN LEGNO - GIMA 27416',
    price: 740,
    features: {
      Materiale: 'Legno',
      Tipo: 'Lettino da visita',
      Unità: '1 pezzo',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27416.jpg',
    description:
      'Lettino da visita in legno. Codice GIMA 27416. Prezzo 740,00 € al pezzo, imponibile IVA esclusa.\n\n' +
      'Linea: Arredo e illuminazione › Lettini da visita.',
    downloadId: '158870',
    quantityPriceTiers: [],
  },
  {
    gimaSku: '27428',
    name: 'LENZUOLINO PUNTA A PUNTA 2 VELI 50m x 59 cm - Conf. 9 rotoli',
    price: 4.8,
    packLabel: 'Minimo 9 rotoli',
    features: {
      Formato: '50m x 59 cm',
      Tipo: 'Lenzuolino punta a punta 2 veli',
      Unità: 'Rotolo',
      Acquisto: 'Minimo 9 pezzi, solo multipli di 9',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27428.jpg',
    description:
      'Lenzuolino punta a punta 2 veli 50m x 59 cm. Codice GIMA 27428. Prezzo 4,80 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 9 rotoli, solo quantità multiple di 9.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 9 (45 rotoli), 10% da 10 confezioni (90 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 9,
    orderQuantityStep: 9,
    quantityPriceTiers: [
      { minQuantity: 9, unitPrice: 4.8 },
      { minQuantity: 45, unitPrice: 4.56 },
      { minQuantity: 90, unitPrice: 4.32 },
    ],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27427',
    name: 'LENZUOLINO PUNTA A PUNTA 2 VELI 100m x 50 cm',
    price: 7.5,
    packLabel: 'Minimo 6 rotoli',
    features: {
      Formato: '100m x 50 cm',
      Tipo: 'Lenzuolino punta a punta 2 veli',
      Unità: 'Rotolo',
      Acquisto: 'Minimo 6 pezzi, solo multipli di 6',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27427.jpg',
    description:
      'Lenzuolino punta a punta 2 veli 100m x 50 cm. Codice GIMA 27427. Prezzo 7,50 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 6 (30 rotoli), 10% da 10 confezioni (60 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 6,
    orderQuantityStep: 6,
    quantityPriceTiers: [
      { minQuantity: 6, unitPrice: 7.5 },
      { minQuantity: 30, unitPrice: 7.13 },
      { minQuantity: 60, unitPrice: 6.75 },
    ],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27411',
    name: 'LENZUOLINO 2 VELI - 47,5m x 59 cm',
    price: 5.45,
    packLabel: 'Minimo 6 rotoli',
    features: {
      Formato: '47,5m x 59 cm',
      Tipo: 'Lenzuolino 2 veli',
      'Unità': 'Rotolo',
      'Acquisto': 'Minimo 6 pezzi, solo multipli di 6',
    },
    imageUrl: '/images/placeholder.jpg',
    description:
      'Lenzuolino 2 veli 47,5m x 59 cm. Codice GIMA 27411. Prezzo 5,45 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 6 (30 rotoli), 10% da 10 confezioni (60 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 6,
    orderQuantityStep: 6,
    quantityPriceTiers: [
      { minQuantity: 6, unitPrice: 5.45 },
      { minQuantity: 30, unitPrice: 5.18 },
      { minQuantity: 60, unitPrice: 4.91 },
    ],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27415',
    name: 'LENZUOLINO POLITENATO GOFFRATO - 50m x 60 cm',
    price: 7.15,
    packLabel: 'Minimo 6 rotoli',
    features: {
      Formato: '50m x 60 cm',
      Tipo: 'Lenzuolino politenato goffrato',
      Unità: 'Rotolo',
      Acquisto: 'Minimo 6 pezzi, solo multipli di 6',
    },
    // Asset famiglia lenzuolini GIMA (27415.jpg non pubblicato; 27413 e' l'immagine ufficiale condivisa).
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27413.jpg',
    description:
      'Lenzuolino politenato goffrato 50m x 60 cm. Codice GIMA 27415. Prezzo 7,15 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 6 (30 rotoli), 10% da 10 confezioni (60 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 6,
    orderQuantityStep: 6,
    quantityPriceTiers: [
      { minQuantity: 6, unitPrice: 7.15 },
      { minQuantity: 30, unitPrice: 6.79 },
      { minQuantity: 60, unitPrice: 6.44 },
    ],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27419',
    name: 'LENZUOLINO PUNTA A PUNTA 80m x 59 cm',
    price: 7.8,
    packLabel: 'Minimo 6 rotoli',
    features: {
      Formato: '80m x 59 cm',
      Tipo: 'Lenzuolino punta a punta',
      Unità: 'Rotolo',
      Acquisto: 'Minimo 6 pezzi, solo multipli di 6',
    },
    imageUrl: 'https://www.gimaitaly.com/images/prodotti/medium/27419.jpg',
    description:
      'Lenzuolino punta a punta 80m x 59 cm. Codice GIMA 27419. Prezzo 7,80 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 6 (30 rotoli), 10% da 10 confezioni (60 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 6,
    orderQuantityStep: 6,
    quantityPriceTiers: [
      { minQuantity: 6, unitPrice: 7.8 },
      { minQuantity: 30, unitPrice: 7.41 },
      { minQuantity: 60, unitPrice: 7.02 },
    ],
    showQuantityDiscountTable: true,
  },
  {
    gimaSku: '27410',
    name: 'LENZUOLINO MONOVELO GOFFRATO 95m x 50cm',
    price: 6.7,
    packLabel: 'Minimo 6 rotoli',
    features: {
      Formato: '95m x 50 cm',
      Tipo: 'Lenzuolino monovelo goffrato',
      Unità: 'Rotolo',
      Acquisto: 'Minimo 6 pezzi, solo multipli di 6',
    },
    imageUrl: '/images/placeholder.jpg',
    description:
      'Lenzuolino monovelo goffrato 95m x 50 cm. Codice GIMA 27410. Prezzo 6,70 € al rotolo, imponibile IVA esclusa. ' +
      'Acquisto minimo 6 rotoli, solo quantità multiple di 6.\n\n' +
      'Sconto quantità: 5% da 5 confezioni da 6 (30 rotoli), 10% da 10 confezioni (60 rotoli).\n\n' +
      'Linea: Farmacia e cura › Lenzuolini medici / Monouso.',
    downloadId: '158870',
    minOrderQuantity: 6,
    orderQuantityStep: 6,
    quantityPriceTiers: [
      { minQuantity: 6, unitPrice: 6.7 },
      { minQuantity: 30, unitPrice: 6.37 },
      { minQuantity: 60, unitPrice: 6.03 },
    ],
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
  if (name.includes('cavo') && name.includes('ecg') && name.includes('vet')) return GIMA_OVERRIDE_BY_SKU.get('33319') ?? null
  if (name.includes('sfigmo') && name.includes('london')) return GIMA_OVERRIDE_BY_SKU.get('32725') ?? null
  if (name.includes('sfigmo') && name.includes('kobe')) return GIMA_OVERRIDE_BY_SKU.get('32690') ?? null
  if (name.includes('sfigmo') && name.includes('minor')) return GIMA_OVERRIDE_BY_SKU.get('32714') ?? null
  if (name.includes('pressione') && name.includes('smart') && name.includes('gima')) {
    return GIMA_OVERRIDE_BY_SKU.get('32921') ?? null
  }
  if (name.includes('pressione') && name.includes('easycheck')) return GIMA_OVERRIDE_BY_SKU.get('49880') ?? null
  if (name.includes('omron') && name.includes('m2')) return GIMA_OVERRIDE_BY_SKU.get('49898') ?? null
  if (name.includes('omron') && name.includes('m3')) return GIMA_OVERRIDE_BY_SKU.get('49907') ?? null
  if (name.includes('contec') && name.includes('300g')) return GIMA_OVERRIDE_BY_SKU.get('33221') ?? null
  if (name.includes('contec') && name.includes('1200g')) return GIMA_OVERRIDE_BY_SKU.get('33224') ?? null
  if (name.includes('contec') && name.includes('600g')) return GIMA_OVERRIDE_BY_SKU.get('33222') ?? null
  if (name.includes('cardioline') && name.includes('ecg200')) return GIMA_OVERRIDE_BY_SKU.get('54205') ?? null
  if (name.includes('neo') && name.includes('t180')) return GIMA_OVERRIDE_BY_SKU.get('54231') ?? null
  if (name.includes('pcecg') || (name.includes('tascabile') && name.includes('ecg'))) {
    return GIMA_OVERRIDE_BY_SKU.get('33236') ?? null
  }
  if (name.includes('videocolposcop') || name.includes('colpro')) {
    return GIMA_OVERRIDE_BY_SKU.get('29620') ?? null
  }
  if (name.includes('colposcop') && name.includes('colpy')) {
    return GIMA_OVERRIDE_BY_SKU.get('29600') ?? null
  }
  if (name.includes('colposcop') && name.includes('alltion') && name.includes('9x')) {
    return GIMA_OVERRIDE_BY_SKU.get('29612') ?? null
  }
  if (
    name.includes('colposcop') &&
    name.includes('alltion') &&
    (name.includes('3,75') || name.includes('3.75') || name.includes('28.000') || name.includes('28000'))
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('29613') ?? null
  }
  if (name.includes('gynex') || (name.includes('poltrona') && name.includes('ginecolog'))) {
    return GIMA_OVERRIDE_BY_SKU.get('27520') ?? null
  }
  if (name.includes('lettino') && name.includes('ginecolog') && name.includes('blu')) {
    return GIMA_OVERRIDE_BY_SKU.get('27507') ?? null
  }
  if (name.includes('lettino') && name.includes('ginecolog') && name.includes('verde')) {
    return GIMA_OVERRIDE_BY_SKU.get('27506') ?? null
  }
  if (
    name.includes('letto') &&
    name.includes('ginecolog') &&
    (name.includes('altri colori') || name.includes('altezza variabile'))
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('27496') ?? null
  }
  if (
    name.includes('defibrill') &&
    (name.includes('cu-sp1') || name.includes('ipad') || name.includes('aed'))
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('35340') ?? null
  }
  if (name.includes('holter') && name.includes('m12')) {
    return GIMA_OVERRIDE_BY_SKU.get('54300') ?? null
  }
  if (name.includes('holter') && name.includes('ecg')) {
    return GIMA_OVERRIDE_BY_SKU.get('35130') ?? null
  }
  if (
    name.includes('dermatoscop') &&
    name.includes('mic') &&
    (name.includes('wifi') || name.includes('wi-fi'))
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('32177') ?? null
  }
  if (name.includes('dermatoscop') && name.includes('delta') && name.includes('30')) {
    return GIMA_OVERRIDE_BY_SKU.get('31146') ?? null
  }
  if (name.includes('dermatoscop') && name.includes('gima') && name.includes('2000')) {
    return GIMA_OVERRIDE_BY_SKU.get('31187') ?? null
  }
  if (name.includes('dermatoscop') && name.includes('mini') && name.includes('3000')) {
    return GIMA_OVERRIDE_BY_SKU.get('31158') ?? null
  }
  if (name.includes('cryomega') || (name.includes('criochirurg') && name.includes('16'))) {
    return GIMA_OVERRIDE_BY_SKU.get('30586') ?? null
  }
  if (name.includes('lenzuolin') && name.includes('politenato')) {
    return GIMA_OVERRIDE_BY_SKU.get('27415') ?? null
  }
  if (name.includes('lenzuolin') && name.includes('100m') && name.includes('50')) {
    return GIMA_OVERRIDE_BY_SKU.get('27427') ?? null
  }
  if (
    name.includes('lenzuolin') &&
    name.includes('50m') &&
    name.includes('59') &&
    name.includes('9 rotoli')
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('27428') ?? null
  }
  if (name.includes('lenzuolin') && (name.includes('47,5') || name.includes('47.5'))) {
    return GIMA_OVERRIDE_BY_SKU.get('27411') ?? null
  }
  if (name.includes('lenzuolin') && name.includes('80m') && name.includes('59')) {
    return GIMA_OVERRIDE_BY_SKU.get('27419') ?? null
  }
  if (name.includes('lenzuolin') && name.includes('monovelo')) {
    return GIMA_OVERRIDE_BY_SKU.get('27410') ?? null
  }
  if (
    name.includes('lettino') &&
    (name.includes('legno') || name.includes('visita') || name.includes('visitato'))
  ) {
    return GIMA_OVERRIDE_BY_SKU.get('27416') ?? null
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
    ...(typeof spec.minOrderQuantity === 'number' ? { minOrderQuantity: spec.minOrderQuantity } : {}),
    ...(typeof spec.orderQuantityStep === 'number' ? { orderQuantityStep: spec.orderQuantityStep } : {}),
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
