/**
 * Catalogo cross-selling Astro Forniture.
 *
 * Definisce:
 * 1. `CROSS_SELL_PRODUCTS` — prodotti suggeriti (schede veloci con prezzo/immagine indicativa).
 * 2. `getCrossSellForCategory` — regole per categoria → array di ID prodotti correlati.
 * 3. `getCrossSellForProduct` — risolve i prodotti cross-sell dato un OfficeProduct.
 */

import type { OfficeProduct } from '../types/officeProduct'

const VAT = 1.22
function imp(ivato: number) {
  return Math.round((ivato / VAT) * 100) / 100
}

// ---------------------------------------------------------------------------
// Prodotti cross-sell (voci suggerite nelle schede cassa / carrello).
// Gli ID iniziano con "AF-XS-" per non collidere con il catalogo principale.
// ---------------------------------------------------------------------------

export const CROSS_SELL_PRODUCTS: readonly OfficeProduct[] = [
  // --- Rotoli termici ---
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
  // --- Cassetto portadenaro ---
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
  // --- Lettore barcode ---
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
  // --- Stampante etichette ---
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
  // --- Rotoli etichette ---
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
  // --- Menu da tavolo ---
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
  // --- Cartello prezzi ---
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
  // --- Insegna LED ---
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
  // --- Servizio di grafica ---
  {
    id: 'AF-XS-GRAFICA-PERSONALIZZATA',
    name: 'Servizio Grafica Personalizzata – Logo & Insegne',
    brand: 'Astro Forniture',
    producerCode: 'SVC-GRAFICA',
    category: 'Servizi',
    subcategory: 'Grafica',
    mainFeatures: { Formato: 'Digitale + stampa', Consegna: 'Preventivo su richiesta' },
    imageUrl: '/images/grafica-personalizzata.jpg',
    price: undefined,
  },
] as const

// Mappa id → prodotto per lookup O(1)
const CROSS_SELL_BY_ID = new Map<string, OfficeProduct>(
  CROSS_SELL_PRODUCTS.map((p) => [p.id, p]),
)

// ---------------------------------------------------------------------------
// Regole categoria → ID prodotti cross-sell
// ---------------------------------------------------------------------------

/** Categorie che mappano alle casse (Registratori di Cassa / Casse Ditron). */
const CASSE_CATEGORY_PATTERNS = [
  'Casse',
  'Registratori',
  'cassa',
  'ditron',
  'Ditron',
]

/** ID cross-sell per prodotti Casse / Registratori di cassa. */
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

function isCassaProduct(product: OfficeProduct): boolean {
  const haystack = `${product.category} ${product.subcategory ?? ''} ${product.id}`.toLowerCase()
  return CASSE_CATEGORY_PATTERNS.some((pat) => haystack.includes(pat.toLowerCase()))
}

/**
 * Restituisce un array di prodotti cross-sell da mostrare in PDP e carrello.
 *
 * Priorità:
 * 1. `product.relatedProductIds` (specifici, da Supabase o catalogo statico)
 * 2. Regola categoria (casse → accessori cassa, rotoli, segnaletica…)
 * 3. Array vuoto (nessun cross-sell)
 */
export function getCrossSellForProduct(
  product: OfficeProduct,
  limit = 4,
): OfficeProduct[] {
  // 1. IDs specifici sul prodotto
  const specificIds = product.relatedProductIds ?? []
  if (specificIds.length > 0) {
    return specificIds
      .map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
  }

  // 2. Regola categoria casse
  if (isCassaProduct(product)) {
    return CROSS_SELL_IDS_CASSE.map((id) => CROSS_SELL_BY_ID.get(id))
      .filter((p): p is OfficeProduct => p !== undefined)
      .slice(0, limit)
  }

  return []
}

/**
 * Restituisce prodotti cross-sell aggregati per un insieme di prodotti nel carrello.
 * Deduplica e limita il risultato.
 */
export function getCrossSellForCart(
  cartProducts: ReadonlyArray<{ id: string; category: string; subcategory?: string; relatedProductIds?: string[] }>,
  cartProductIdSet: ReadonlySet<string>,
  limit = 4,
): OfficeProduct[] {
  const seen = new Set<string>()
  const result: OfficeProduct[] = []

  for (const item of cartProducts) {
    const candidates = getCrossSellForProduct(item as OfficeProduct, limit)
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
