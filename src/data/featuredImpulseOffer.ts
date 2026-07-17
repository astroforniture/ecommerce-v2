import { productDetailPath } from '../lib/productRoutes'
import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'

export const OFFERTA_IMPULSE_IMAGE_PATH = '/offerta-impulse.png'

/**
 * SKU in `public.products` per «Carta fotocopie Impulse 75 A4».
 */
export const IMPULSE_75_A4_CATALOG_SKU = 'IMPULSE75-A4'

/** Listino imponibile IVA esclusa — fascia 1-5 pezzi. */
export const IMPULSE_75_A4_BASE_PRICE = 4.5

/** Scaglioni 6-19 e 20+ pezzi (PDP e carrello). */
export const IMPULSE_75_A4_QUANTITY_TIERS: readonly QuantityPriceTier[] = [
  { minQuantity: 6, unitPrice: 4.25 },
  { minQuantity: 20, unitPrice: 3.9 },
]

export function isImpulse75A4OfficeProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'name'> | null | undefined,
): boolean {
  if (!product) return false
  const sku = String(product.producerCode ?? product.id ?? '')
    .trim()
    .toUpperCase()
  if (sku === IMPULSE_75_A4_CATALOG_SKU || sku.includes('IMPULSE75')) return true
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('impulse') && n.includes('75') && n.includes('a4')
}

export const impulseA4ProductDetailPath = productDetailPath({
  id: '',
  producerCode: IMPULSE_75_A4_CATALOG_SKU,
})

export const OFFERTA_SHOPPER_IMAGE_PATH = '/offerta-shopper.png'
export const OFFERTA_GIMA_IMAGE_PATH = '/offerta-gima.jpg'

/**
 * Categoria catalogo per la promo Shopper (personalizzazione).
 * Modifica se nel tuo catalogo le shopper sono altrove (es. `?search=Shopper`).
 */
export const SHOPPER_PROMO_CATEGORY_HREF = '/office-products?category=Cancelleria'
