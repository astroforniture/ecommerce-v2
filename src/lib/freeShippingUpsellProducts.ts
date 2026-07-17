import { OFFICE_CATALOG_DATA_REVISION } from '../api/officeProductsSupabase'
import { FREE_SHIPPING_DRAWER_UPSELL_PRODUCTS } from '../data/freeShippingDrawerUpsellProducts'
import type { OfficeProduct } from '../types/officeProduct'
import { FREE_SHIPPING_THRESHOLD_IVATO, roundMoney2 } from './cartMerchandiseIvato'
import { isHomeFeaturedShowcaseProduct } from './isHomeFeaturedShowcaseProduct'
import { isOfficeProductAstroMedicalLine } from './isOfficeProductAstroMedicalLine'
import { effectiveUnitPrice } from './quantityPricing'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'

const VAT_MULTIPLIER = 1.22
const MAX_UNIT_IMPONIBILE = 10

const UPSELL_NAME_KEYWORDS = [
  'penna',
  'evidenzi',
  'post-it',
  'post it',
  'carta',
  'blocco',
  'matita',
  'quadern',
  'pile',
  'marcatore',
  'roller',
] as const

/** Snapshot prodotti economici se Supabase non è disponibile. */
const STATIC_FREE_SHIPPING_UPSELL_IDS = [
  'AF-PILE-',
  'AF-QUAD-',
  'AF-UPSELL-',
] as const

export function productUnitIvato(
  product: Pick<OfficeProduct, 'price' | 'quantityPriceTiers'>,
  quantity = 1,
): number {
  const imponibile = effectiveUnitPrice(product.price, product.quantityPriceTiers, quantity)
  return roundMoney2(imponibile * VAT_MULTIPLIER)
}

function upsellKeywordScore(name: string): number {
  const n = name.toLowerCase()
  return UPSELL_NAME_KEYWORDS.reduce((acc, kw) => (n.includes(kw) ? acc + 6 : acc), 0)
}

function upsellGapScore(unitIvato: number, remainingIvato: number): number {
  if (unitIvato <= 0) return -1000
  const overshoot = unitIvato - remainingIvato
  if (overshoot >= 0) return 120 - overshoot * 0.5
  return 80 - Math.abs(remainingIvato - unitIvato) * 0.35
}

function isEligibleUpsellProduct(
  product: OfficeProduct,
  cartProductIds: ReadonlySet<string>,
): boolean {
  if (cartProductIds.has(product.id)) return false
  if (isOfficeProductAstroMedicalLine(product)) return false
  if (!(product.imageUrl ?? '').trim()) return false

  const imponibile = effectiveUnitPrice(product.price, product.quantityPriceTiers, 1)
  if (imponibile <= 0 || imponibile > MAX_UNIT_IMPONIBILE) return false

  return true
}

function scoreUpsellProduct(product: OfficeProduct, remainingIvato: number): number {
  const unitIvato = productUnitIvato(product, 1)
  let score = upsellGapScore(unitIvato, remainingIvato) + upsellKeywordScore(product.name)
  if (isHomeFeaturedShowcaseProduct(product)) score += 12
  const id = String(product.id ?? '')
  if (STATIC_FREE_SHIPPING_UPSELL_IDS.some((prefix) => id.startsWith(prefix))) score += 8
  return score
}

function rankUpsellCandidates(
  products: readonly OfficeProduct[],
  cartProductIds: ReadonlySet<string>,
  remainingIvato: number,
  limit: number,
): OfficeProduct[] {
  return products
    .filter((product) => isEligibleUpsellProduct(product, cartProductIds))
    .sort((a, b) => {
      const scoreDiff = scoreUpsellProduct(b, remainingIvato) - scoreUpsellProduct(a, remainingIvato)
      if (scoreDiff !== 0) return scoreDiff
      return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' })
    })
    .slice(0, limit)
}

/** Pool immediato: prodotti fissi drawer + catalogo locale (senza attesa rete). */
function getLocalUpsellPool(): OfficeProduct[] {
  const byId = new Map<string, OfficeProduct>()
  for (const product of [...FREE_SHIPPING_DRAWER_UPSELL_PRODUCTS, ...getInjectedLocalCatalogProducts()]) {
    byId.set(String(product.id), product)
  }
  return [...byId.values()]
}

/**
 * Suggerimenti economici per sbloccare la spedizione gratuita.
 * Evita `fetchOfficeProductsFromSupabase` sull'intero catalogo (lento/bloccante):
 * usa solo prodotti statici drawer + catalogo locale già in bundle.
 */
export function pickFreeShippingUpsellProductsSync(
  merchandiseIvato: number,
  cartProductIds: ReadonlySet<string>,
  limit = 4,
): OfficeProduct[] {
  if (merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO || limit <= 0) return []

  const remainingIvato = roundMoney2(
    Math.max(0, FREE_SHIPPING_THRESHOLD_IVATO - merchandiseIvato),
  )

  return rankUpsellCandidates(getLocalUpsellPool(), cartProductIds, remainingIvato, limit)
}

export async function pickFreeShippingUpsellProducts(
  merchandiseIvato: number,
  cartProductIds: ReadonlySet<string>,
  limit = 4,
): Promise<OfficeProduct[]> {
  return pickFreeShippingUpsellProductsSync(merchandiseIvato, cartProductIds, limit)
}

export const freeShippingUpsellQueryKey = (
  merchandiseIvato: number,
  cartProductIds: readonly string[],
) =>
  [
    'free-shipping-upsell',
    OFFICE_CATALOG_DATA_REVISION,
    roundMoney2(merchandiseIvato).toFixed(2),
    cartProductIds.join('|'),
  ] as const
