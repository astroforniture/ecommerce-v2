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
    id: '100072',
    name: 'Rotoli Termici 57×40 mm – Conf. 10 pz (carta termica POS)',
    brand: 'Sabacart',
    producerCode: '100072',
    category: 'Carta',
    subcategory: 'Carta Termica',
    mainFeatures: { Larghezza: '57 mm', Diametro: '40 mm', Confezione: '10 rotoli' },
    imageUrl: '/images/carta-termica-100072.jpg',
    price: imp(8.9),
  },
  {
    id: '93454',
    name: 'Rotoli Termici omologati 79×80 mm – Conf. 10 pz',
    brand: 'Rotolificio Pugliese',
    producerCode: '93454',
    category: 'Carta',
    subcategory: 'Carta Termica',
    mainFeatures: { Larghezza: '79 mm', Diametro: '77 mm', Confezione: '10 rotoli' },
    imageUrl: '/images/carta-termica-93454.jpg',
    price: imp(12.5),
  },
  {
    id: 'AF-XS-CASSETTO-PORTADENARO',
    name: 'Cassetto Portadenaro – 4 scomparti banconote + 8 monete',
    brand: 'Ditron',
    producerCode: 'AF-XS-CASSETTO-PORTADENARO',
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
    producerCode: 'AF-XS-LETTORE-BARCODE-USB',
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
    producerCode: 'AF-XS-STAMPANTE-ETICHETTE',
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
    producerCode: 'AF-XS-ROTOLI-ETICHETTE',
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
    producerCode: 'AF-XS-MENU-TAVOLO',
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
    producerCode: 'AF-XS-CARTELLO-PREZZI',
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
    producerCode: 'AF-XS-INSEGNA-APERTO',
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
    producerCode: 'AF-XS-GRAFICA-PERSONALIZZATA',
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
  '100072',
  '93454',
  'AF-XS-CASSETTO-PORTADENARO',
  'AF-XS-LETTORE-BARCODE-USB',
  'AF-XS-STAMPANTE-ETICHETTE',
  'AF-XS-MENU-TAVOLO',
  'AF-XS-CARTELLO-PREZZI',
  'AF-XS-INSEGNA-APERTO',
  'AF-XS-GRAFICA-PERSONALIZZATA',
]

/** Lookup per resolver sintetico / link PDP. */
export function resolveCrossSellCatalogProductById(idOrSku: string): OfficeProduct | null {
  const k = idOrSku.trim()
  if (!k) return null
  return (
    CROSS_SELL_BY_ID.get(k) ??
    CROSS_SELL_PRODUCTS.find((p) => p.producerCode === k || p.id === k) ??
    null
  )
}

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

/** Pool curato Archivio / Carta / Buste — SKU/id reali da `public.products`. */
const OFFICE_RING_CURATED: Record<
  'archivio' | 'carta' | 'buste-trasparenti',
  readonly OfficeProduct[]
> = {
  archivio: [
    {
      id: 'STL4001',
      name: 'Raccoglitore Registratore Starbox - dorso 8 cm - Rosso',
      brand: 'Starline',
      producerCode: 'STL4001',
      category: 'Archivio',
      subcategory: 'Raccoglitori Archivio',
      mainFeatures: { Dorso: '8 cm', Colore: 'Rosso' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL4001.jpg',
      price: 3.5,
    },
    {
      id: 'STL4008',
      name: 'Raccoglitore Registratore Starbox - dorso 8 cm - Blu',
      brand: 'Starline',
      producerCode: 'STL4008',
      category: 'Archivio',
      subcategory: 'Raccoglitori Archivio',
      mainFeatures: { Dorso: '8 cm', Colore: 'Blu' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL4008.jpg',
      price: 3.5,
    },
  ],
  carta: [
    {
      id: '39257',
      name: 'Carta Universal - A4 - 80 gr - bianco - Navigator - conf. 500 fogli',
      brand: 'Navigator',
      producerCode: '39257',
      category: 'Carta',
      subcategory: CARTA_SUBCATEGORY_A4,
      mainFeatures: { Formato: 'A4', Grammatura: '80 g', Fogli: '500' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/39257.jpg',
      price: 6.5,
    },
    {
      id: '40408',
      name: 'Carta Universal - A3 - 80 gr - bianco - Navigator - conf. 500 fogli',
      brand: 'Navigator',
      producerCode: '40408',
      category: 'Carta',
      subcategory: CARTA_SUBCATEGORY_A3,
      mainFeatures: { Formato: 'A3', Grammatura: '80 g', Fogli: '500' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/40408.jpg',
      price: 13.9,
    },
  ],
  'buste-trasparenti': [
    {
      id: 'STL7412',
      name: 'Buste forate Medium - buccia - 22 x 30 cm - trasparente - Starline - conf. 50 pezzi',
      brand: 'Starline',
      producerCode: 'STL7412',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: '22 x 30 cm', Qualità: 'Medium', Confezione: '50 pz' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL7412.jpg',
      price: 2.4,
    },
    {
      id: 'STL7413',
      name: 'Buste forate Medium - liscio - 22 x 30 cm - trasparente - Starline - conf. 50 pezzi',
      brand: 'Starline',
      producerCode: 'STL7413',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: '22 x 30 cm', Qualità: 'Medium', Confezione: '50 pz' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL7413.jpg',
      price: 2.6,
    },
    {
      id: 'STL7415',
      name: 'Buste forate Top - liscio - 22 x 30 cm - trasparente - Starline - conf. 50 pezzi',
      brand: 'Starline',
      producerCode: 'STL7415',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: '22 x 30 cm', Qualità: 'Top', Confezione: '50 pz' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL7415.jpg',
      price: 3.2,
    },
    {
      id: 'STL7416',
      name: 'Cartellina a L - buccia - trasparente - Starline',
      brand: 'Starline',
      producerCode: 'STL7416',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: 'A4', Finitura: 'Buccia' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL7416.jpg',
      price: 0.35,
    },
    {
      id: 'STL7417',
      name: 'Cartellina a L - liscio - trasparente - Starline',
      brand: 'Starline',
      producerCode: 'STL7417',
      category: 'Archivio',
      subcategory: BUSTE_TRASPARENTI_SUB,
      mainFeatures: { Formato: 'A4', Finitura: 'Liscio' },
      imageUrl: 'https://odmultimedia.eu/immagini/HD/STL7417.jpg',
      price: 0.35,
    },
  ],
}

export type CrossSellDbPools = {
  carta?: readonly OfficeProduct[]
  buste?: readonly OfficeProduct[]
}

function poolEtichettatrici(): OfficeProduct[] {
  return buildEtichettatriciOfficeProducts()
}

function poolCartucceToner(): OfficeProduct[] {
  return buildCartucceTonerOfficeProducts()
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
  /** Slot 1 — Carta A4/A3 (pool DB o curato). */
  rotateCarta: OfficeProduct[]
  /** Slot 2 — Buste Trasparenti (pool DB o curato). */
  rotateBuste: OfficeProduct[]
  /** Slot 3 — Etichettatrici. */
  rotateEtichettatrici: OfficeProduct[]
  /** Slot 4 — Cartucce & Toner. */
  rotateCartucceToner: OfficeProduct[]
  /** Quattro slot fissi (Carta / Buste / Etichettatrici / Toner). */
  fourSlots: boolean
  /** Abilita auto-play rotazione 3s. */
  autoPlay: boolean
}

function emptyCrossSell(): CrossSellResult {
  return {
    products: [],
    rotateCarta: [],
    rotateBuste: [],
    rotateEtichettatrici: [],
    rotateCartucceToner: [],
    fourSlots: false,
    autoPlay: false,
  }
}

function mergePool(
  dbPool: readonly OfficeProduct[] | undefined,
  curated: readonly OfficeProduct[],
  excludeId: string,
): OfficeProduct[] {
  const byId = new Map<string, OfficeProduct>()
  for (const p of [...(dbPool ?? []), ...curated]) {
    if (!p?.id || p.id === excludeId) continue
    if (!byId.has(p.id)) byId.set(p.id, p)
  }
  return [...byId.values()]
}

/**
 * Cross-sell PDP: priorità relatedProductIds → casse → 4 slot fissi (Carta/Buste/Etch/Toner).
 */
export function getCrossSellForProduct(
  product: OfficeProduct,
  limit = 8,
  dbPools?: CrossSellDbPools,
): CrossSellResult {
  const specificIds = product.relatedProductIds ?? []
  if (specificIds.length > 0) {
    const products = specificIds
      .map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
    return { ...emptyCrossSell(), products }
  }

  if (isCassaProduct(product)) {
    const products = CROSS_SELL_IDS_CASSE.map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
    return { ...emptyCrossSell(), products }
  }

  const group = detectOfficeCrossSellGroup(product)
  if (!group) {
    return emptyCrossSell()
  }

  const rotateCarta = mergePool(dbPools?.carta, OFFICE_RING_CURATED.carta, product.id)
  const rotateBuste = mergePool(
    dbPools?.buste,
    OFFICE_RING_CURATED['buste-trasparenti'],
    product.id,
  )
  const rotateEtichettatrici = poolEtichettatrici().filter((p) => p.id !== product.id)
  const rotateCartucceToner = poolCartucceToner().filter((p) => p.id !== product.id)

  const products = [
    rotateCarta[0],
    rotateBuste[0],
    rotateEtichettatrici[0],
    rotateCartucceToner[0],
  ].filter((p): p is OfficeProduct => Boolean(p))

  const autoPlay =
    rotateCarta.length > 1 ||
    rotateBuste.length > 1 ||
    rotateEtichettatrici.length > 1 ||
    rotateCartucceToner.length > 1

  return {
    products,
    rotateCarta,
    rotateBuste,
    rotateEtichettatrici,
    rotateCartucceToner,
    fourSlots: true,
    autoPlay,
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
