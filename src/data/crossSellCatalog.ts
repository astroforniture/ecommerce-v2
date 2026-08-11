/**
 * Catalogo cross-selling Astro Forniture.
 *
 * - Casse Ditron / hospitality ↔ Carta Termica ↔ Shopper ↔ Alberghi e Ristoranti
 * - Anello ufficio: Archivio ↔ Carta A4/A3 ↔ Buste ↔ Etichettatrici ↔ Toner ↔ Distruggi ↔ Cancelleria
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
  buildDistruggidocumentiOfficeProducts,
  isDistruggidocumentiOfficeProductId,
  MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
} from './distruggidocumentiProducts'
import {
  buildCartaTermicaOfficeProducts,
} from './cartaTermicaCatalog'
import {
  buildModulisticaOfficeProducts,
  MODULISTICA_CATEGORY,
  MODULISTICA_SUB_ALBERGHI,
  canonicalizeModulisticaSubcategory,
} from './modulisticaCatalog'
import {
  buildCasseDitronOfficeProducts,
  isCasseDitronOfficeProductId,
} from './casseDitronProducts'
import {
  buildShopperCartaOfficeProducts,
  buildShopperPlasticaOfficeProducts,
  matchesShopperCartaProduct,
  matchesShopperPlasticaProduct,
} from './shopperCancelleria'
import {
  CARTA_SUBCATEGORY_A3,
  CARTA_SUBCATEGORY_A4,
  CARTA_SUBCATEGORY_TERMICA,
  CARTUCCE_TONER_CATEGORY,
} from '../lib/officeCategories'
import {
  AGENDA_ALFA_COLORS,
  AGENDA_ALFA_SIZES,
  buildAgendaAlfaOfficeProduct,
} from './agendeAlfaGiornaliereProducts'
import {
  AGENDA_DELTA_SETT_SIZES,
  buildAgendaDeltaSettOfficeProduct,
} from './agendeDeltaSettimanaliProducts'
import {
  AGENDA_DELTA_COLORS,
} from './agendeDeltaGiornaliereProducts'
import {
  AGENDA_PLAN_ALFA_COLORS,
  AGENDA_PLAN_LINES,
  buildAgendaPlanningOfficeProduct,
} from './agendePlanningProducts'

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
  | 'distruggi-documenti'
  | 'cancelleria'
  | 'alberghi-ristoranti'
  | 'carta-termica'
  | 'shopper'
  | 'casse'

export const OFFICE_CROSS_SELL_RING: readonly OfficeCrossSellGroup[] = [
  'archivio',
  'carta',
  'buste-trasparenti',
  'etichettatrici',
  'cartucce-toner',
  'distruggi-documenti',
  'cancelleria',
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
  cancelleria?: readonly OfficeProduct[]
  distruggi?: readonly OfficeProduct[]
  cartaTermica?: readonly OfficeProduct[]
  shopper?: readonly OfficeProduct[]
  alberghi?: readonly OfficeProduct[]
  casse?: readonly OfficeProduct[]
}

function poolEtichettatrici(): OfficeProduct[] {
  return buildEtichettatriciOfficeProducts()
}

function poolCartucceToner(): OfficeProduct[] {
  return buildCartucceTonerOfficeProducts()
}

function poolDistruggiFallback(): OfficeProduct[] {
  return buildDistruggidocumentiOfficeProducts()
}

function poolCartaTermicaFallback(): OfficeProduct[] {
  return buildCartaTermicaOfficeProducts()
}

function poolAlberghiFallback(): OfficeProduct[] {
  return buildModulisticaOfficeProducts(MODULISTICA_SUB_ALBERGHI)
}

function poolCasseFallback(): OfficeProduct[] {
  return buildCasseDitronOfficeProducts()
}

function poolShopperFallback(): OfficeProduct[] {
  return [...buildShopperCartaOfficeProducts(), ...buildShopperPlasticaOfficeProducts()]
}

const CANCELLERIA_ESSENTIAL_RE =
  /penna|penne|biro|roller|sfera|cucitric|stapler|spillatric|nastro\s*adesiv|scotch|evidenziat|highlighter|fermagli|punti\b|marcat|marker|clip\b|matita|matite/i

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

function isCartaTermicaProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory' | 'name' | 'id'>,
): boolean {
  const sub = (product.subcategory ?? '').trim()
  if (sub.localeCompare(CARTA_SUBCATEGORY_TERMICA, 'it', { sensitivity: 'base' }) === 0) {
    return true
  }
  const hay = `${product.name} ${product.subcategory ?? ''}`.toLowerCase()
  if (!hay.includes('termica') && !hay.includes('termic')) return false
  return (
    (product.category ?? '').localeCompare('Carta', 'it', { sensitivity: 'base' }) === 0 ||
    hay.includes('rotolo') ||
    hay.includes('pos')
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

function isCancelleriaEssentialProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory' | 'name'>,
): boolean {
  if ((product.category ?? '').localeCompare('Cancelleria', 'it', { sensitivity: 'base' }) !== 0) {
    return false
  }
  return CANCELLERIA_ESSENTIAL_RE.test(`${product.name} ${product.subcategory ?? ''}`)
}

function isDistruggiProduct(
  product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory' | 'name'>,
): boolean {
  if (isDistruggidocumentiOfficeProductId(product.id)) return true
  const hay = `${product.name} ${product.subcategory ?? ''} ${product.category ?? ''}`.toLowerCase()
  if (hay.includes('distrugg')) return true
  return (product.subcategory ?? '')
    .toLowerCase()
    .includes(MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL.toLowerCase())
}

function isShopperProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'category' | 'subcategory' | 'name'>,
): boolean {
  if (matchesShopperCartaProduct(product as OfficeProduct)) return true
  if (matchesShopperPlasticaProduct(product as OfficeProduct)) return true
  const hay = `${product.name} ${product.subcategory ?? ''} ${product.id} ${product.producerCode ?? ''}`.toLowerCase()
  return hay.includes('shopper') || (hay.includes('sacchett') && hay.includes('asporto'))
}

function isAlberghiRistorantiProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory' | 'name'>,
): boolean {
  const sub = canonicalizeModulisticaSubcategory(product.subcategory)
  if (sub === MODULISTICA_SUB_ALBERGHI) return true
  const hay = `${product.name} ${product.subcategory ?? ''} ${product.category ?? ''}`.toLowerCase()
  if (hay.includes('alberghi') && hay.includes('ristorant')) return true
  return (
    (product.category ?? '').localeCompare(MODULISTICA_CATEGORY, 'it', { sensitivity: 'base' }) ===
      0 &&
    (hay.includes('comand') || hay.includes('ristorant') || hay.includes('alberg'))
  )
}

function isCassaProduct(product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory' | 'name'>): boolean {
  if (isCasseDitronOfficeProductId(product.id)) return true
  const haystack =
    `${product.category} ${product.subcategory ?? ''} ${product.id} ${product.name ?? ''}`.toLowerCase()
  if (haystack.includes('raccoglitore') || haystack.includes('starbox')) return false
  return ['casse ditron', 'registratore telematic', 'registratori di cassa', 'cassa automatic'].some(
    (pat) => haystack.includes(pat),
  ) ||
    ((haystack.includes('casse') || haystack.includes('ditron')) &&
      (haystack.includes('macchine') || haystack.includes('cassa')))
}

export function detectOfficeCrossSellGroup(
  product: Pick<OfficeProduct, 'id' | 'category' | 'subcategory' | 'name' | 'producerCode'>,
): OfficeCrossSellGroup | null {
  if (isDistruggiProduct(product)) return 'distruggi-documenti'
  if (isCassaProduct(product)) return 'casse'
  if (isCartaTermicaProduct(product)) return 'carta-termica'
  if (isShopperProduct(product)) return 'shopper'
  if (isAlberghiRistorantiProduct(product)) return 'alberghi-ristoranti'

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

  if (isCancelleriaEssentialProduct(product)) return 'cancelleria'
  if ((product.category ?? '').localeCompare('Cancelleria', 'it', { sensitivity: 'base' }) === 0) {
    return 'cancelleria'
  }

  if ((product.category ?? '').localeCompare('Archivio', 'it', { sensitivity: 'base' }) === 0) {
    return 'archivio'
  }

  return null
}

export type CrossSellSlot = {
  key: string
  label: string
  pool: OfficeProduct[]
  /** Sfasamento rotazione (due slot stessa categoria mostrano prodotti diversi). */
  tickOffset?: number
}

export type CrossSellResult = {
  products: OfficeProduct[]
  /** Slot dinamici con rotazione 3s. */
  slots: CrossSellSlot[]
  /** @deprecated Compat — usare `slots`. */
  rotateCarta: OfficeProduct[]
  /** @deprecated Compat — usare `slots`. */
  rotateBuste: OfficeProduct[]
  /** @deprecated Compat — usare `slots`. */
  rotateEtichettatrici: OfficeProduct[]
  /** @deprecated Compat — usare `slots`. */
  rotateCartucceToner: OfficeProduct[]
  /** True quando la UI usa slot tipizzati con label. */
  fourSlots: boolean
  autoPlay: boolean
}

function emptyCrossSell(): CrossSellResult {
  return {
    products: [],
    slots: [],
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

function resultFromSlots(
  slots: CrossSellSlot[],
  extras?: Partial<
    Pick<
      CrossSellResult,
      'rotateCarta' | 'rotateBuste' | 'rotateEtichettatrici' | 'rotateCartucceToner'
    >
  >,
): CrossSellResult {
  const products = slots
    .map((s) => s.pool[0])
    .filter((p): p is OfficeProduct => Boolean(p))
  const autoPlay = slots.some((s) => s.pool.length > 1)
  return {
    products,
    slots,
    rotateCarta: extras?.rotateCarta ?? [],
    rotateBuste: extras?.rotateBuste ?? [],
    rotateEtichettatrici: extras?.rotateEtichettatrici ?? [],
    rotateCartucceToner: extras?.rotateCartucceToner ?? [],
    fourSlots: slots.length > 0,
    autoPlay,
  }
}

/**
 * Cross-sell PDP: relatedProductIds → hospitality / ufficio slot dinamici.
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
  const rotateCancelleria = mergePool(dbPools?.cancelleria, [], product.id)
  const rotateDistruggi = mergePool(
    dbPools?.distruggi,
    poolDistruggiFallback(),
    product.id,
  )
  const rotateCartaTermica = mergePool(
    dbPools?.cartaTermica,
    poolCartaTermicaFallback(),
    product.id,
  )
  const rotateShopper = mergePool(dbPools?.shopper, poolShopperFallback(), product.id)
  const rotateAlberghi = mergePool(dbPools?.alberghi, poolAlberghiFallback(), product.id)
  const rotateCasse = mergePool(dbPools?.casse, poolCasseFallback(), product.id)
  const rotateEtichettatrici = poolEtichettatrici().filter((p) => p.id !== product.id)
  const rotateCartucceToner = poolCartucceToner().filter((p) => p.id !== product.id)

  // Hospitality ring: Alberghi ↔ Carta Termica ↔ Casse ↔ Shopper
  if (
    group === 'alberghi-ristoranti' ||
    group === 'carta-termica' ||
    group === 'shopper' ||
    group === 'casse'
  ) {
    const hospitalitySlots: CrossSellSlot[] = []
    if (group !== 'carta-termica') {
      hospitalitySlots.push({
        key: 'carta-termica',
        label: 'Carta Termica',
        pool: rotateCartaTermica,
      })
    }
    if (group !== 'casse') {
      hospitalitySlots.push({
        key: 'casse',
        label: 'Casse Automatiche',
        pool: rotateCasse,
      })
    }
    if (group !== 'shopper') {
      hospitalitySlots.push({
        key: 'shopper',
        label: 'Shopper',
        pool: rotateShopper,
      })
    }
    if (group !== 'alberghi-ristoranti') {
      hospitalitySlots.push({
        key: 'alberghi',
        label: 'Alberghi e Ristoranti',
        pool: rotateAlberghi,
      })
    }
    // Varietà extra: secondo slot carta termica / shopper con offset
    if (group === 'alberghi-ristoranti' || group === 'casse') {
      if (rotateCartaTermica.length > 1) {
        hospitalitySlots.push({
          key: 'carta-termica-b',
          label: 'Carta Termica',
          pool: rotateCartaTermica,
          tickOffset: 1,
        })
      }
      if (rotateShopper.length > 1) {
        hospitalitySlots.push({
          key: 'shopper-b',
          label: 'Shopper',
          pool: rotateShopper,
          tickOffset: 1,
        })
      }
    }
    if (group === 'carta-termica' || group === 'shopper') {
      if (rotateAlberghi.length > 1) {
        hospitalitySlots.push({
          key: 'alberghi-b',
          label: 'Alberghi e Ristoranti',
          pool: rotateAlberghi,
          tickOffset: 1,
        })
      }
      if (rotateCasse.length > 1) {
        hospitalitySlots.push({
          key: 'casse-b',
          label: 'Casse Automatiche',
          pool: rotateCasse,
          tickOffset: 1,
        })
      }
    }

    return resultFromSlots(hospitalitySlots.filter((s) => s.pool.length > 0))
  }

  // Distruggi Documenti → Carta + Cancelleria (alternate)
  if (group === 'distruggi-documenti') {
    const slots: CrossSellSlot[] = [
      { key: 'carta', label: 'Carta', pool: rotateCarta, tickOffset: 0 },
      { key: 'cancelleria', label: 'Cancelleria', pool: rotateCancelleria, tickOffset: 0 },
      { key: 'carta-b', label: 'Carta', pool: rotateCarta, tickOffset: 1 },
      {
        key: 'cancelleria-b',
        label: 'Cancelleria',
        pool: rotateCancelleria,
        tickOffset: 1,
      },
    ].filter((s) => s.pool.length > 0)
    return resultFromSlots(slots, { rotateCarta })
  }

  // Cancelleria → Carta + Distruggi (+ Buste / Etichettatrici)
  if (group === 'cancelleria') {
    const slots: CrossSellSlot[] = [
      { key: 'carta', label: 'Carta', pool: rotateCarta },
      { key: 'distruggi', label: 'Distruggi Documenti', pool: rotateDistruggi },
      { key: 'buste', label: 'Buste', pool: rotateBuste },
      { key: 'etichettatrici', label: 'Etichettatrici', pool: rotateEtichettatrici },
    ].filter((s) => s.pool.length > 0)
    return resultFromSlots(slots, {
      rotateCarta,
      rotateBuste,
      rotateEtichettatrici,
    })
  }

  // Carta → slot classici + Distruggi Documenti (bidirezionale)
  if (group === 'carta') {
    const slots: CrossSellSlot[] = [
      { key: 'carta', label: 'Carta', pool: rotateCarta },
      { key: 'buste', label: 'Buste', pool: rotateBuste },
      { key: 'distruggi', label: 'Distruggi Documenti', pool: rotateDistruggi },
      { key: 'etichettatrici', label: 'Etichettatrici', pool: rotateEtichettatrici },
      { key: 'toner', label: 'Cartucce & Toner', pool: rotateCartucceToner },
    ].filter((s) => s.pool.length > 0)
    return resultFromSlots(slots, {
      rotateCarta,
      rotateBuste,
      rotateEtichettatrici,
      rotateCartucceToner,
    })
  }

  // Archivio Ufficio / Buste / Etichettatrici / Toner:
  // Slot 1 Carta, Slot 2 Buste (DB), Slot 3 Etichettatrici, Slot 4 Toner — rotazione 3s
  if (
    group === 'archivio' ||
    group === 'buste-trasparenti' ||
    group === 'etichettatrici' ||
    group === 'cartucce-toner'
  ) {
    const slots: CrossSellSlot[] = [
      { key: 'carta', label: 'Carta', pool: rotateCarta },
      { key: 'buste', label: 'Buste', pool: rotateBuste },
      { key: 'etichettatrici', label: 'Etichettatrici', pool: rotateEtichettatrici },
      { key: 'toner', label: 'Cartucce & Toner', pool: rotateCartucceToner },
    ].filter((s) => s.pool.length > 0)
    return resultFromSlots(slots, {
      rotateCarta,
      rotateBuste,
      rotateEtichettatrici,
      rotateCartucceToner,
    })
  }

  return emptyCrossSell()
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
 * Griglia statica carrello/checkout: Agende 2027 in priorità, poi essenziali ufficio.
 */
const CART_CHECKOUT_AGENDE_2027: readonly OfficeProduct[] = [
  buildAgendaAlfaOfficeProduct(
    AGENDA_ALFA_SIZES.find((s) => s.key === '15x21') ?? AGENDA_ALFA_SIZES[0]!,
    AGENDA_ALFA_COLORS[0],
  ),
  buildAgendaDeltaSettOfficeProduct(AGENDA_DELTA_SETT_SIZES[0]!, AGENDA_DELTA_COLORS[0]),
  buildAgendaPlanningOfficeProduct(
    AGENDA_PLAN_LINES.find((l) => l.family === 'alfa') ?? AGENDA_PLAN_LINES[0]!,
    AGENDA_PLAN_ALFA_COLORS[0],
  ),
]

export const CART_CHECKOUT_ESSENTIALS: readonly OfficeProduct[] = [
  ...CART_CHECKOUT_AGENDE_2027,
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
