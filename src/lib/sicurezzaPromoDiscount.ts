import type { OfficeProduct } from '../types/officeProduct'
import { SICUREZZA_CATEGORY } from './officeCategories'
import {
  SICUREZZA_SUBCATEGORY_ELMETTI,
  SICUREZZA_SUBCATEGORY_GIACCHE,
  SICUREZZA_SUBCATEGORY_GIUBBOTTI,
  SICUREZZA_SUBCATEGORY_GUANTI,
  SICUREZZA_SUBCATEGORY_NASTRI,
  SICUREZZA_SUBCATEGORY_PANTALONI,
} from './sicurezzaCatalog'

/** Sconto promo attivo sulle sottocategorie Sicurezza elencate. */
export const SICUREZZA_PROMO_DISCOUNT_PERCENT = 20 as const

const SICUREZZA_PROMO_SUBCATEGORIES = new Set(
  [
    SICUREZZA_SUBCATEGORY_GIACCHE,
    SICUREZZA_SUBCATEGORY_ELMETTI,
    SICUREZZA_SUBCATEGORY_NASTRI,
    SICUREZZA_SUBCATEGORY_GUANTI,
    SICUREZZA_SUBCATEGORY_PANTALONI,
    SICUREZZA_SUBCATEGORY_GIUBBOTTI,
  ].map((s) => s.toLowerCase()),
)

function roundEur(value: number): number {
  return Math.round(value * 100) / 100
}

function applyFactor(value: number, factor: number): number {
  return roundEur(value * factor)
}

export function isSicurezzaPromoDiscountProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory'> | null | undefined,
): boolean {
  if (!product) return false
  const cat = (product.category ?? '').trim()
  if (cat.localeCompare(SICUREZZA_CATEGORY, 'it', { sensitivity: 'base' }) !== 0) {
    return false
  }
  const sub = (product.subcategory ?? '').trim().toLowerCase()
  return SICUREZZA_PROMO_SUBCATEGORIES.has(sub)
}

/**
 * Applica listino × 0.80 sulle sottocategorie promo Sicurezza.
 * Conserva il listino in `compareAtPrice` e imposta `discountPercent` a 20.
 * Idempotente: non ri-applica se lo sconto è già presente.
 */
export function applySicurezzaPromoDiscount(product: OfficeProduct): OfficeProduct {
  if (!isSicurezzaPromoDiscountProduct(product)) return product
  if (
    product.discountPercent === SICUREZZA_PROMO_DISCOUNT_PERCENT &&
    typeof product.compareAtPrice === 'number' &&
    product.compareAtPrice > 0
  ) {
    return product
  }

  const listPrice =
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > 0
      ? product.compareAtPrice
      : typeof product.price === 'number' && product.price > 0
        ? product.price
        : undefined

  if (listPrice == null) {
    return {
      ...product,
      discountPercent: SICUREZZA_PROMO_DISCOUNT_PERCENT,
    }
  }

  const factor = (100 - SICUREZZA_PROMO_DISCOUNT_PERCENT) / 100
  const salePrice = applyFactor(listPrice, factor)

  const quantityPriceTiers = product.quantityPriceTiers?.map((tier) => ({
    ...tier,
    unitPrice: applyFactor(tier.unitPrice, factor),
  }))

  const variants = product.variants?.map((v) =>
    typeof v.price === 'number' && v.price > 0
      ? { ...v, price: applyFactor(v.price, factor) }
      : v,
  )

  return {
    ...product,
    price: salePrice,
    compareAtPrice: listPrice,
    discountPercent: SICUREZZA_PROMO_DISCOUNT_PERCENT,
    ...(quantityPriceTiers ? { quantityPriceTiers } : {}),
    ...(variants ? { variants } : {}),
  }
}
