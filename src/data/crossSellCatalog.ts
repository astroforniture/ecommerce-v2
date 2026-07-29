/**
 * Catalogo cross-selling Astro Forniture.
 *
 * - Casse Ditron → accessori POS (statici)
 * - Anello bidirezionale: Archivio ↔ Carta A4/A3 ↔ Buste Trasparenti ↔ Etichettatrici ↔ Cartucce & Toner
 * - Essenziali fissi per carrello/checkout
 */

import type { OfficeProduct } from '../types/officeProduct'
import { buildCartucceTonerOfficeProducts, isCartucceTonerOfficeProductId } from './cartucceTonerProducts'
import {
  buildEtichettatriciOfficeProducts,
  isEtichettatriciOfficeProductId,
  MACCHINE_SUB_ETICHETTATRICI_LABEL,
} from './macchineEtichettatrici'
import {
  CARTA_SUBCATEGORY_A3,
  CARTA_SUBCATEGORY_A4,
  CARTA_SUBCATEGORY_TERMICA,
  CARTUCCE_TONER_CATEGORY,
} from '../lib/officeCategories'
import { isCasseDitronOfficeProductId } from './casseDitronProducts'

const BUSTE_TRASPARENTI_SUB = 'Buste Trasparenti' as const

const VAT = 1.22
function imp(ivato: number) {
  return Math.round((ivato / VAT) * 100) / 100
}

// ---------------------------------------------------------------------------
// Prodotti cross-sell POS (casse)
// ---------------------------------------------------------------------------

export const CROSS_SELL_PRODUCTS: readonly OfficeProduct[] = [
  {
    id: 'AF-XS-ROTOLI-TERMICI-57',
    name: 'Rotoli Termici 57×40 mm – Conf. 10 pz',
    brand: 'Ditron',
    producerCode: 'RT-57x40-10PZ',
    category: 'Carta',
    subcategory: 'Carta Termica',
    mainFeatures: { Larghezza: '57 mm', Diametro: '40 mm', Confezione: '10 rotoli' },
    imageUrl: '/images/rotoli-termici-57.jpg',
    price: imp(8.9),
  },
  {
    id: 'AF-XS-ROTOLI-TERMICI-80',
    name: 'Rotoli Termici 80×80 mm – Conf. 10 pz',
    brand: 'Ditron',
    producerCode: 'RT-80x80-10PZ',
    category: 'Carta',
    subcategory: 'Carta Termica',
    mainFeatures: { Larghezza: '80 mm', Diametro: '80 mm', Confezione: '10 rotoli' },
    imageUrl: '/images/rotoli-termici-80.jpg',
    price: imp(12.5),
  },
  {
    id: 'AF-XS-CASSETTO-PORTADENARO',
    name: 'Cassetto Portadenaro – 4 scomparti banconote + 8 monete',
    brand: 'Ditron',
    producerCode: 'CASH-DRAWER-4B8C',
    category: 'Accessori Cassa',
    subcategory: 'Cassetti',
    mainFeatures: { Connessione: 'RJ11', Larghezza: '41 cm' },
    imageUrl: '/images/cassetto-portadenaro.jpg',
    price: imp(49),
  },
  {
    id: 'AF-XS-LETTORE-BARCODE-USB',
    name: 'Lettore Barcode USB 1D/2D – Omnidirezionale',
    brand: 'Ditron',
    producerCode: 'SCAN-USB-2D',
    category: 'Accessori Cassa',
    subcategory: 'Lettori Barcode',
    mainFeatures: { Interfaccia: 'USB HID', Codici: '1D / 2D / QR' },
    imageUrl: '/images/lettore-barcode-usb.jpg',
    price: imp(39),
  },
  {
    id: 'AF-XS-STAMPANTE-ETICHETTE',
    name: 'Stampante Etichette Termica – 203 dpi USB+BT',
    brand: 'Ditron',
    producerCode: 'LBL-PRINT-203DPI',
    category: 'Stampa',
    subcategory: 'Stampanti Etichette',
    mainFeatures: { Risoluzione: '203 dpi', Interfacce: 'USB, Bluetooth' },
    imageUrl: '/images/stampante-etichette.jpg',
    price: imp(89),
  },
  {
    id: 'AF-XS-ROTOLI-ETICHETTE',
    name: 'Rotoli Etichette Termiche 57×32 mm – Conf. 5 rotoli',
    brand: 'Astro Forniture',
    producerCode: 'ETI-57x32-5PZ',
    category: 'Carta',
    subcategory: 'Etichette',
    mainFeatures: { Formato: '57×32 mm', Confezione: '5 rotoli' },
    imageUrl: '/images/rotoli-etichette.jpg',
    price: imp(11.5),
  },
  {
    id: 'AF-XS-MENU-TAVOLO',
    name: 'Porta Menù da Tavolo A4 – Set 5 pz',
    brand: 'Astro Forniture',
    producerCode: 'MENU-TAV-A4-5PZ',
    category: 'Segnaletica',
    subcategory: 'Menu & Cartellini',
    mainFeatures: { Formato: 'A4', Confezione: '5 pezzi' },
    imageUrl: '/images/menu-tavolo.jpg',
    price: imp(14.5),
  },
  {
    id: 'AF-XS-CARTELLO-PREZZI',
    name: 'Cartello Esposizione Prezzi – Set 10 pz',
    brand: 'Astro Forniture',
    producerCode: 'CART-PREZZI-10PZ',
    category: 'Segnaletica',
    subcategory: 'Cartellini Prezzi',
    mainFeatures: { Confezione: '10 pezzi' },
    imageUrl: '/images/cartello-prezzi.jpg',
    price: imp(7.9),
  },
  {
    id: 'AF-XS-INSEGNA-APERTO',
    name: 'Insegna LED "APERTO / CHIUSO" – con telecomando',
    brand: 'Astro Forniture',
    producerCode: 'LED-APERTO-CHIUSO',
    category: 'Segnaletica',
    subcategory: 'Insegne',
    mainFeatures: { Alimentazione: 'USB', Colori: 'Verde / Rosso' },
    imageUrl: '/images/insegna-aperto.jpg',
    price: imp(22),
  },
  {
    id: 'AF-XS-GRAFICA-PERSONALIZZATA',
    name: 'Servizio Grafica Personalizzata – Logo & Insegne',
    brand: 'Astro Forniture',
    producerCode: 'SVC-GRAFICA',
    category: 'Servizi',
    subcategory: 'Grafica',
    mainFeatures: { Formato: 'Digitale + stampa', Consegna: 'Preventivo su richiesta' },
    imageUrl: '/logo-astro-forniture.png',
    price: undefined,
  },
] as const

const CROSS_SELL_BY_ID = new Map<string, OfficeProduct>(
  CROSS_SELL_PRODUCTS.map((p) => [p.id, p]),
)

export const CROSS_SELL_IDS_CASSE: readonly string[] = [
  'AF-XS-ROTOLI-TERMICI-57',
  'AF-XS-ROTOLI-TERMICI-80',
  'AF-XS-CASSETTO-PORTADENARO',
  'AF-XS-LETTORE-BARCODE-USB',
  'AF-XS-STAMPANTE-ETICHETTE',
  'AF-XS-MENU-TAVOLO',
  'AF-XS-CARTELLO-PREZZI',
  'AF-XS-INSEGNA-APERTO',
  'AF-XS-GRAFICA-PERSONALIZZATA',
]

// ---------------------------------------------------------------------------
// Anello ufficio bidirezionale
// ---------------------------------------------------------------------------

export type OfficeCrossSellGroup =
  | 'archivio'
  | 'carta'
  | 'buste-trasparenti'
  | 'etichettatrici'
  | 'cartucce-toner'

export const OFFICE_CROSS_SELL_RING: readonly OfficeCrossSellGroup[] = [
  'archivio',
  'carta',
  'buste-trasparenti',
  'etichettatrici',
  'cartucce-toner',
] as const

/** Pool curato Archivio / Carta / Buste (sempre disponibile offline). */
const OFFICE_RING_CURATED: Record<
  'archivio' | 'carta' | 'buste-trasparenti',
  readonly OfficeProduct[]
> = {
  archivio: [
    {
      id: 'AF-XS-ARCHIVIO-REGISTRATORE',
      name: 'Registratore a leva Protocollo – dorso 8 cm',
      brand: 'Blasetti',
      producerCode: 'AF-XS-ARCHIVIO-REGISTRATORE',
      category: 'Archivio',
      subcategory: 'Registratori',
      mainFeatures: { Formato: 'Protocollo', Dorso: '8 cm' },
      imageUrl: '/Articoli_Cancelleria_Ufficio.jpg',
      price: imp(6.9),
    },
    {
      id: 'AF-XS-ARCHIVIO-CARTELLINE',
      name: 'Cartelline a L trasparenti – conf. 50 pz',
      brand: 'Starline',
      producerCode: 'AF-XS-ARCHIVIO-CARTELLINE',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: 'A4', Confezione: '50 pz' },
      imageUrl: '/images/menu-tavolo.jpg',
      price: imp(5.5),
    },
  ],
  carta: [
    {
      id: 'AF-XS-CARTA-RISMA-A4',
      name: 'Risma Carta A4 80 g – 500 fogli',
      brand: 'Navigator',
      producerCode: 'AF-XS-CARTA-RISMA-A4',
      category: 'Carta',
      subcategory: CARTA_SUBCATEGORY_A4,
      mainFeatures: { Formato: 'A4', Grammatura: '80 g', Fogli: '500' },
      imageUrl: '/carta-risme-evidenza.png',
      price: imp(5.9),
    },
    {
      id: 'AF-XS-CARTA-RISMA-A3',
      name: 'Risma Carta A3 80 g – 500 fogli',
      brand: 'Navigator',
      producerCode: 'AF-XS-CARTA-RISMA-A3',
      category: 'Carta',
      subcategory: CARTA_SUBCATEGORY_A3,
      mainFeatures: { Formato: 'A3', Grammatura: '80 g', Fogli: '500' },
      imageUrl: '/carta-risme-evidenza.png',
      price: imp(11.9),
    },
  ],
  'buste-trasparenti': [
    {
      id: 'AF-XS-BUSTE-PPL-A4',
      name: 'Buste Trasparenti PPL forate A4 – conf. 100 pz',
      brand: 'Blasetti',
      producerCode: 'AF-XS-BUSTE-PPL-A4',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: 'A4', Materiale: 'PPL', Confezione: '100 pz' },
      imageUrl: '/images/menu-tavolo.jpg',
      price: imp(4.5),
    },
    {
      id: 'AF-XS-BUSTE-PPL-A4-TOP',
      name: 'Buste forate trasparenti Top A4 – conf. 50 pz',
      brand: 'Sei Rota',
      producerCode: 'AF-XS-BUSTE-PPL-A4-TOP',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: 'A4', Qualità: 'Top', Confezione: '50 pz' },
      imageUrl: '/images/cartello-prezzi.jpg',
      price: imp(6.2),
    },
  ],
}

function poolEtichettatrici(): OfficeProduct[] {
  return buildEtichettatriciOfficeProducts()
}

function poolCartucceToner(): OfficeProduct[] {
  return buildCartucceTonerOfficeProducts()
}

function poolForGroup(group: OfficeCrossSellGroup): OfficeProduct[] {
  switch (group) {
    case 'archivio':
    case 'carta':
    case 'buste-trasparenti':
      return [...OFFICE_RING_CURATED[group]]
    case 'etichettatrici':
      return poolEtichettatrici()
    case 'cartucce-toner':
      return poolCartucceToner()
  }
}

function isCartaA4orA3(product: Pick<OfficeProduct, 'category' | 'subcategory'>): boolean {
  if ((product.category ?? '').localeCompare('Carta', 'it', { sensitivity: 'base' }) !== 0) {
    return false
  }
  const sub = (product.subcategory ?? '').trim()
  if (sub.localeCompare(CARTA_SUBCATEGORY_TERMICA, 'it', { sensitivity: 'base' }) === 0) {
    return false
  }
  if (!sub) return true
  return (
    sub.localeCompare(CARTA_SUBCATEGORY_A4, 'it', { sensitivity: 'base' }) === 0 ||
    sub.localeCompare(CARTA_SUBCATEGORY_A3, 'it', { sensitivity: 'base' }) === 0 ||
    /\ba4\b/i.test(sub) ||
    /\ba3\b/i.test(sub)
  )
}

function isBusteTrasparentiProduct(product: OfficeProduct): boolean {
  const sub = (product.subcategory ?? '').trim()
  if (sub.localeCompare(BUSTE_TRASPARENTI_SUB, 'it', { sensitivity: 'base' }) === 0) {
    return true
  }
  const name = `${product.name} ${product.id} ${product.producerCode}`.toLowerCase()
  return /buste?\s*(forate|trasparent|ppl)/i.test(name) || /cartellin.*\ba\s*l\b/i.test(name)
}

export function detectOfficeCrossSellGroup(
  product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory' | 'name' | 'producerCode'>,
): OfficeCrossSellGroup | null {
  if (isEtichettatriciOfficeProductId(product.id)) return 'etichettatrici'
  if (
    (product.subcategory ?? '')
      .toLowerCase()
      .includes(MACCHINE_SUB_ETICHETTATRICI_LABEL.toLowerCase()) ||
    /etichettatric/i.test(`${product.name} ${product.category}`)
  ) {
    return 'etichettatrici'
  }

  if (isCartucceTonerOfficeProductId(product.id)) return 'cartucce-toner'
  if (
    (product.category ?? '').localeCompare(CARTUCCE_TONER_CATEGORY, 'it', {
      sensitivity: 'base',
    }) === 0
  ) {
    return 'cartucce-toner'
  }

  if (isBusteTrasparentiProduct(product as OfficeProduct)) return 'buste-trasparenti'

  if (isCartaA4orA3(product)) return 'carta'

  if ((product.category ?? '').localeCompare('Archivio', 'it', { sensitivity: 'base' }) === 0) {
    return 'archivio'
  }

  return null
}

function isCassaProduct(product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory'>): boolean {
  if (isCasseDitronOfficeProductId(product.id)) return true
  const haystack = `${product.category} ${product.subcategory ?? ''} ${product.id}`.toLowerCase()
  return ['casse', 'registratori', 'cassa', 'ditron'].some((pat) => haystack.includes(pat))
}

export type CrossSellResult = {
  products: OfficeProduct[]
  /** Pool per rotazione automatica PDP (etichettatrici). */
  rotateEtichettatrici: OfficeProduct[]
  /** Pool per rotazione automatica PDP (cartucce & toner). */
  rotateCartucceToner: OfficeProduct[]
  /** Abilita auto-play carousel 3s. */
  autoPlay: boolean
}

function pickFromPool(
  pool: readonly OfficeProduct[],
  excludeId: string,
  count: number,
  offset = 0,
): OfficeProduct[] {
  const filtered = pool.filter((p) => p.id !== excludeId)
  if (filtered.length === 0) return []
  const out: OfficeProduct[] = []
  for (let i = 0; i < count && i < filtered.length; i += 1) {
    out.push(filtered[(offset + i) % filtered.length]!)
  }
  return out
}

/**
 * Cross-sell PDP: priorità relatedProductIds → casse → anello ufficio bidirezionale.
 */
export function getCrossSellForProduct(
  product: OfficeProduct,
  limit = 8,
): CrossSellResult {
  const specificIds = product.relatedProductIds ?? []
  if (specificIds.length > 0) {
    const products = specificIds
      .map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
    return {
      products,
      rotateEtichettatrici: [],
      rotateCartucceToner: [],
      autoPlay: false,
    }
  }

  if (isCassaProduct(product)) {
    const products = CROSS_SELL_IDS_CASSE.map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
    return {
      products,
      rotateEtichettatrici: [],
      rotateCartucceToner: [],
      autoPlay: false,
    }
  }

  const group = detectOfficeCrossSellGroup(product)
  if (!group) {
    return {
      products: [],
      rotateEtichettatrici: [],
      rotateCartucceToner: [],
      autoPlay: false,
    }
  }

  const rotateEtichettatrici = poolEtichettatrici().filter((p) => p.id !== product.id)
  const rotateCartucceToner = poolCartucceToner().filter((p) => p.id !== product.id)

  const seen = new Set<string>([product.id])
  const products: OfficeProduct[] = []

  for (const other of OFFICE_CROSS_SELL_RING) {
    if (other === group) continue
    const take = other === 'etichettatrici' || other === 'cartucce-toner' ? 1 : 1
    for (const p of pickFromPool(poolForGroup(other), product.id, take)) {
      if (seen.has(p.id)) continue
      seen.add(p.id)
      products.push(p)
      if (products.length >= limit) break
    }
    if (products.length >= limit) break
  }

  // Assicura almeno una etichettatrice e un toner nel set iniziale (se disponibili)
  if (!products.some((p) => detectOfficeCrossSellGroup(p) === 'etichettatrici')) {
    const extra = pickFromPool(rotateEtichettatrici, product.id, 1)[0]
    if (extra) products.push(extra)
  }
  if (!products.some((p) => detectOfficeCrossSellGroup(p) === 'cartucce-toner')) {
    const extra = pickFromPool(rotateCartucceToner, product.id, 1)[0]
    if (extra) products.push(extra)
  }

  return {
    products: products.slice(0, limit),
    rotateEtichettatrici,
    rotateCartucceToner,
    autoPlay: rotateEtichettatrici.length > 1 || rotateCartucceToner.length > 1,
  }
}

/**
 * Compatibilità: array prodotti (senza meta rotazione).
 */
export function getCrossSellProductsForProduct(
  product: OfficeProduct,
  limit = 8,
): OfficeProduct[] {
  return getCrossSellForProduct(product, limit).products
}

export function getCrossSellForCart(
  cartProducts: ReadonlyArray<
    Pick<OfficeProduct, 'id' | 'category' | 'subcategory' | 'name' | 'relatedProductIds'>
  >,
  cartProductIdSet: ReadonlySet<string>,
  limit = 4,
): OfficeProduct[] {
  const seen = new Set<string>()
  const result: OfficeProduct[] = []

  for (const item of cartProducts) {
    const candidates = getCrossSellForProduct(item as OfficeProduct, limit).products
    for (const p of candidates) {
      if (!seen.has(p.id) && !cartProductIdSet.has(p.id)) {
        seen.add(p.id)
        result.push(p)
        if (result.length >= limit) return result
      }
    }
  }

  return result
}

/**
 * Griglia statica carrello/checkout: essenziali fissi dall'anello ufficio.
 */
export const CART_CHECKOUT_ESSENTIALS: readonly OfficeProduct[] = [
  OFFICE_RING_CURATED.carta[0]!,
  OFFICE_RING_CURATED['buste-trasparenti'][0]!,
  OFFICE_RING_CURATED.archivio[0]!,
  poolEtichettatrici()[0]!,
  poolCartucceToner()[0]!,
].filter(Boolean)

export function getCartCheckoutEssentials(
  cartProductIdSet: ReadonlySet<string>,
  limit = 4,
): OfficeProduct[] {
  return CART_CHECKOUT_ESSENTIALS.filter((p) => !cartProductIdSet.has(p.id)).slice(0, limit)
}
