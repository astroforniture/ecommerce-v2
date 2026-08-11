import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'

export const MODULISTICA_CATEGORY_LABEL = 'Modulistica' as const

/** Soglia pezzi da cui si applica il listino ingrosso Modulistica (regola categoria). */
export const MODULISTICA_QTY_TIER_MIN = 10 as const

/**
 * Sconto % sul prezzo di listino (imponibile) per quantità ≥ soglia.
 * Fascia 1–9: prezzo pieno · Fascia 10+: listino × (1 − percent/100).
 * Non si applica agli SKU con listino dedicato in `MODULISTICA_SKU_QUANTITY_PRICING`.
 */
export const MODULISTICA_QTY_DISCOUNT_PERCENT = 10 as const

type ModulisticaSkuPricing = {
  basePrice: number
  tiers: readonly QuantityPriceTier[]
}

/**
 * Listini quantità dedicati (imponibile) — chiave = SKU normalizzato (`E 5913`).
 * E 5913 / E 5911: blocchi comande
 * E 5504 C / E 5563 C: ricevute affitto / generica
 * E 2529: verbale assemblea condominio
 */
export const MODULISTICA_SKU_QUANTITY_PRICING: Record<string, ModulisticaSkuPricing> = {
  'E 5913': {
    basePrice: 1.1,
    tiers: [
      { minQuantity: 1, unitPrice: 1.1 },
      { minQuantity: 21, unitPrice: 0.95 },
      { minQuantity: 31, unitPrice: 0.8 },
    ],
  },
  'E 5911': {
    basePrice: 1.4,
    tiers: [
      { minQuantity: 1, unitPrice: 1.4 },
      { minQuantity: 21, unitPrice: 1.25 },
      { minQuantity: 31, unitPrice: 1.0 },
    ],
  },
  'E 5504 C': {
    basePrice: 4.0,
    tiers: [
      { minQuantity: 1, unitPrice: 4.0 },
      { minQuantity: 11, unitPrice: 3.2 },
      { minQuantity: 21, unitPrice: 2.9 },
    ],
  },
  'E 5563 C': {
    basePrice: 4.0,
    tiers: [
      { minQuantity: 1, unitPrice: 4.0 },
      { minQuantity: 11, unitPrice: 3.2 },
      { minQuantity: 21, unitPrice: 2.9 },
    ],
  },
  'E 2529': {
    basePrice: 12.9,
    tiers: [
      { minQuantity: 1, unitPrice: 12.9 },
      { minQuantity: 5, unitPrice: 10.9 },
    ],
  },

  // Prezzi fissi (nessun tier sconto quantità)
  'E 5349':   { basePrice: 8.9,  tiers: [] },  // prima nota 100fg 14,8×22
  'E 5349 A': { basePrice: 8.9,  tiers: [] },  // prima nota 50×2 14,8×22
  'E 5350':   { basePrice: 10.9, tiers: [] },  // prima nota 50×2 cassa-banca 22×29,7
  'E 5356':   { basePrice: 10.9, tiers: [] },  // prima nota 100fg ent-usc-IVA 29,7×22
  'E 5356 A': { basePrice: 10.9, tiers: [] },  // prima nota 50×2 ent-usc-IVA 29,7×22
  'E 5359 A': { basePrice: 10.9, tiers: [] },  // prima nota 50×2 ent-usc 29,7×22
  E2769:      { basePrice: 10.9, tiers: [] },  // Registro 3 colonne 31×24,5
  E2117:      { basePrice: 10.9, tiers: [] },  // Registro acquisti beni usati 31×24,5
  E2686:      { basePrice: 13.9, tiers: [] },  // Registro cassa ent/usc 24×17
  E2656:      { basePrice: 12.9, tiers: [] },  // Registro dare/avere/saldo 17×12
  'E 2108':   { basePrice: 5.4,  tiers: [] },  // Registro corrispettivi 31×24,5
  E2666:      { basePrice: 12.9, tiers: [] },  // Registro due colonne 24×17
  'E 2104 A': { basePrice: 5.4,  tiers: [] },  // Reg. prima nota IVA 13×2 (1 anno)
  'E 2102 A': { basePrice: 7.4,  tiers: [] },  // Reg. prima nota IVA 25×2 (2 anni)
  E4034:      { basePrice: 11.9, tiers: [] },  // Scadenzario effetti attivi 24×17
  E4033:      { basePrice: 11.9, tiers: [] },  // Scadenzario effetti passivi 24×17
  'E 3399':   { basePrice: 9.9,  tiers: [] },  // Schede 2col 24×17 verticale
  'E 3259':   { basePrice: 9.9,  tiers: [] },  // Schede 3col 15×21 orizzontale
  'E 3369':   { basePrice: 9.9,  tiers: [] },  // Schede 3col 17×24 orizzontale
  'E 3406':   { basePrice: 9.9,  tiers: [] },  // Schede 3col 24×17 verticale
  E2172:      { basePrice: 22.9, tiers: [] },  // Giornale degli affari 96pg 31×24,5
}

function roundEur(value: number): number {
  return Math.round(value * 100) / 100
}

/** Normalizza SKU Modulistica (`E5913` → `E 5913`, `E5504C` → `E 5504 C`). */
export function normalizeModulisticaSkuKey(raw: string | null | undefined): string {
  const t = String(raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
  if (!t) return ''
  const compact = t.replace(/\s/g, '')
  const m = compact.match(/^E(\d+)([A-Z]*)$/)
  if (m) return m[2] ? `E ${m[1]} ${m[2]}` : `E ${m[1]}`
  return t
}

export function modulisticaSkuKeyFromProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> | null | undefined,
): string {
  if (!product) return ''
  return (
    normalizeModulisticaSkuKey(product.producerCode) ||
    normalizeModulisticaSkuKey(product.id)
  )
}

export function isModulisticaQuantityPricingProduct(
  product: Pick<OfficeProduct, 'category' | 'id' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  if (modulisticaSkuKeyFromProduct(product) in MODULISTICA_SKU_QUANTITY_PRICING) return true
  const cat = (product.category ?? '').trim()
  return cat.localeCompare(MODULISTICA_CATEGORY_LABEL, 'it', { sensitivity: 'base' }) === 0
}

/** Tier sconto quantità Modulistica a partire dal prezzo di listino imponibile. */
export function modulisticaQuantityTiersFromListPrice(
  listPrice: number,
): QuantityPriceTier[] {
  const price =
    typeof listPrice === 'number' && Number.isFinite(listPrice) ? listPrice : 0
  if (price <= 0) return []
  const factor = (100 - MODULISTICA_QTY_DISCOUNT_PERCENT) / 100
  return [
    {
      minQuantity: MODULISTICA_QTY_TIER_MIN,
      unitPrice: roundEur(price * factor),
    },
  ]
}

function tiersEqual(
  a: QuantityPriceTier[] | undefined,
  b: readonly QuantityPriceTier[],
): boolean {
  if (!a || a.length !== b.length) return false
  return a.every(
    (t, i) => t.minQuantity === b[i].minQuantity && t.unitPrice === b[i].unitPrice,
  )
}

/**
 * Applica listini quantità Modulistica:
 * - SKU dedicati (comande, ricevute, verbale) con scaglioni assoluti
 * - resto categoria: ≥10 pezzi (−10%) sul listino corrente
 */
export function applyModulisticaQuantityPricing(product: OfficeProduct): OfficeProduct {
  const skuKey = modulisticaSkuKeyFromProduct(product)
  const dedicated = skuKey ? MODULISTICA_SKU_QUANTITY_PRICING[skuKey] : undefined
  if (dedicated) {
    if (
      product.price === dedicated.basePrice &&
      tiersEqual(product.quantityPriceTiers, dedicated.tiers)
    ) {
      return product
    }
    return {
      ...product,
      price: dedicated.basePrice,
      quantityPriceTiers: dedicated.tiers.map((t) => ({ ...t })),
      // Assicura che nessun tier residuo da DB venga applicato per prezzi fissi
      ...(dedicated.tiers.length === 0 ? { quantityPriceTiers: [] } : {}),
    }
  }

  if (!isModulisticaQuantityPricingProduct(product)) return product

  const listPrice =
    typeof product.price === 'number' && Number.isFinite(product.price) && product.price > 0
      ? product.price
      : 0
  if (listPrice <= 0) return product

  const tiers = modulisticaQuantityTiersFromListPrice(listPrice)
  if (!tiers.length) return product

  if (tiersEqual(product.quantityPriceTiers, tiers)) return product

  return {
    ...product,
    quantityPriceTiers: tiers.map((t) => ({ ...t })),
  }
}
