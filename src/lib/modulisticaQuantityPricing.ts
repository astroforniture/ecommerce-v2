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
 * E 5913: Blocco comande 2 copie 17×9,9
 * E 5911: Blocco comande 25×3 fogli 17×9,9
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
}

function roundEur(value: number): number {
  return Math.round(value * 100) / 100
}

/** Normalizza SKU Modulistica (`E5913` / `e 5913` → `E 5913`). */
export function normalizeModulisticaSkuKey(raw: string | null | undefined): string {
  const t = String(raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
  if (!t) return ''
  const compact = t.replace(/\s/g, '')
  const m = compact.match(/^E(\d+[A-Z]*)$/)
  if (m) return `E ${m[1]}`
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
 * - SKU dedicati (comande E 5913 / E 5911) con scaglioni assoluti
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
