import {
  fetchCheapOfficeProductsForUpsell,
  OFFICE_CATALOG_DATA_REVISION,
} from '../api/officeProductsSupabase'
import { FREE_SHIPPING_DRAWER_UPSELL_PRODUCTS } from '../data/freeShippingDrawerUpsellProducts'
import type { OfficeProduct } from '../types/officeProduct'
import { FREE_SHIPPING_THRESHOLD_IVATO, roundMoney2 } from './cartMerchandiseIvato'
import { isOfficeProductAstroMedicalLine } from './isOfficeProductAstroMedicalLine'
import { effectiveUnitPrice } from './quantityPricing'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'

const VAT_MULTIPLIER = 1.22
/** Prezzo unitario imponibile massimo per i consigli «aggiungi al volo». */
const MAX_UNIT_IMPONIBILE = 15
const UPSELL_DB_POOL_LIMIT = 80

export function productUnitIvato(
  product: Pick<OfficeProduct, 'price' | 'quantityPriceTiers'>,
  quantity = 1,
): number {
  const imponibile = effectiveUnitPrice(product.price, product.quantityPriceTiers, quantity)
  return roundMoney2(imponibile * VAT_MULTIPLIER)
}

function isEligibleUpsellProduct(
  product: OfficeProduct,
  cartProductIds: ReadonlySet<string>,
): boolean {
  if (cartProductIds.has(product.id)) return false
  if (cartProductIds.has(product.producerCode)) return false
  if (isOfficeProductAstroMedicalLine(product)) return false
  if (!(product.imageUrl ?? '').trim()) return false
  if (!(product.name ?? '').trim()) return false

  const imponibile = effectiveUnitPrice(product.price, product.quantityPriceTiers, 1)
  if (imponibile <= 0 || imponibile > MAX_UNIT_IMPONIBILE) return false

  return true
}

/** Fisher–Yates shuffle (in-place). */
function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = items[i]!
    items[i] = items[j]!
    items[j] = tmp
  }
  return items
}

function pickRandomUpsellCandidates(
  products: readonly OfficeProduct[],
  cartProductIds: ReadonlySet<string>,
  limit: number,
): OfficeProduct[] {
  const eligible = products.filter((product) => isEligibleUpsellProduct(product, cartProductIds))
  return shuffleInPlace([...eligible]).slice(0, limit)
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
 * Fallback sync: pool locale, selezionato a caso (ruota a ogni chiamata).
 */
export function pickFreeShippingUpsellProductsSync(
  merchandiseIvato: number,
  cartProductIds: ReadonlySet<string>,
  limit = 4,
): OfficeProduct[] {
  if (merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO || limit <= 0) return []
  return pickRandomUpsellCandidates(getLocalUpsellPool(), cartProductIds, limit)
}

/**
 * Suggerimenti economici dinamici: pool da Supabase `products` (prezzo ≤ 15€ imponibile),
 * esclusi articoli già in carrello, selezione casuale 3–4. Fallback locale se DB fallisce.
 */
export async function pickFreeShippingUpsellProducts(
  merchandiseIvato: number,
  cartProductIds: ReadonlySet<string>,
  limit = 4,
): Promise<OfficeProduct[]> {
  if (merchandiseIvato >= FREE_SHIPPING_THRESHOLD_IVATO || limit <= 0) return []

  try {
    const remote = await fetchCheapOfficeProductsForUpsell(
      MAX_UNIT_IMPONIBILE,
      UPSELL_DB_POOL_LIMIT,
    )
    if (remote.length > 0) {
      const picked = pickRandomUpsellCandidates(remote, cartProductIds, limit)
      if (picked.length > 0) return picked
    }
  } catch (e) {
    console.warn('[free-shipping-upsell] fetch Supabase fallito, uso fallback locale:', e)
  }

  return pickFreeShippingUpsellProductsSync(merchandiseIvato, cartProductIds, limit)
}

export const freeShippingUpsellQueryKey = (
  merchandiseIvato: number,
  cartProductIds: readonly string[],
  visitSeed: string,
  limit: number,
) =>
  [
    'free-shipping-upsell',
    OFFICE_CATALOG_DATA_REVISION,
    visitSeed,
    limit,
    roundMoney2(merchandiseIvato).toFixed(2),
    [...cartProductIds].sort().join('|'),
  ] as const
