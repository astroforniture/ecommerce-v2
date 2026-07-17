import { fetchOfficeProductsFromSupabase } from '../api/officeProductsSupabase'
import { getInjectedLocalCatalogProducts } from './timbroAziendeFarmacieProduct'
import { isHomeFeaturedShowcaseProduct } from './isHomeFeaturedShowcaseProduct'
import {
  matchesCartaSubcategoryFilter,
  normalizeOfficeProductCategory,
  officeCategoryFilterFromUrlParam,
} from './officeCategories'
import { effectiveUnitPrice } from './quantityPricing'
import type { OfficeProduct } from '../types/officeProduct'

export type CategoryPromoOffer = {
  product: OfficeProduct
  originalPrice: number
  salePrice: number
}

export type CategoryPromoData = {
  bestseller: OfficeProduct | null
  offer: CategoryPromoOffer | null
}

function categoryNormMatches(product: OfficeProduct, categoryNorm: string): boolean {
  const productNorm = normalizeOfficeProductCategory(product.category).toLowerCase()
  if (productNorm === categoryNorm) return true
  return product.category.trim().toLowerCase() === categoryNorm
}

function filterCategoryProducts(
  products: OfficeProduct[],
  categoryLabel: string,
  subcategory: string | null,
): OfficeProduct[] {
  const categoryNorm = officeCategoryFilterFromUrlParam(categoryLabel)
  if (!categoryNorm) return []

  return products.filter((product) => {
    if (!categoryNormMatches(product, categoryNorm)) return false
    if (categoryNorm === 'carta' && subcategory) {
      return matchesCartaSubcategoryFilter(product, subcategory)
    }
    return true
  })
}

function hasDisplayableProduct(product: OfficeProduct): boolean {
  return Boolean((product.imageUrl ?? '').trim()) && typeof product.price === 'number'
}

function pickBestseller(products: OfficeProduct[]): OfficeProduct | null {
  const candidates = products
    .filter(hasDisplayableProduct)
    .sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))

  const featured = candidates.filter(isHomeFeaturedShowcaseProduct)
  return (featured[0] ?? candidates[0]) ?? null
}

function pickOfferProduct(
  products: OfficeProduct[],
  excludeId?: string,
): CategoryPromoOffer | null {
  let best: (CategoryPromoOffer & { savings: number }) | null = null

  for (const product of products) {
    if (excludeId && product.id === excludeId) continue
    if (!hasDisplayableProduct(product)) continue

    const base = product.price ?? 0
    if (base <= 0) continue

    const tiers = product.quantityPriceTiers ?? []
    if (!tiers.length) continue

    const bestTierQty = Math.max(...tiers.map((t) => t.minQuantity))
    const salePrice = effectiveUnitPrice(base, tiers, bestTierQty)
    if (salePrice >= base) continue

    const savings = base - salePrice
    if (!best || savings > best.savings) {
      best = { product, originalPrice: base, salePrice, savings }
    }
  }

  if (best) {
    const { savings: _s, ...offer } = best
    return offer
  }

  const fallback = products.find(
    (p) => p.id !== excludeId && hasDisplayableProduct(p) && (p.quantityPriceTiers?.length ?? 0) > 0,
  )
  if (!fallback) return null

  const base = fallback.price ?? 0
  const tier = fallback.quantityPriceTiers!.reduce((min, t) =>
    t.unitPrice < min.unitPrice ? t : min,
  )
  if (tier.unitPrice >= base) return null

  return {
    product: fallback,
    originalPrice: base,
    salePrice: tier.unitPrice,
  }
}

export async function fetchCategoryPromoData(
  categoryLabel: string,
  subcategory: string | null,
): Promise<CategoryPromoData> {
  let products: OfficeProduct[] = []

  try {
    products = await fetchOfficeProductsFromSupabase(categoryLabel, null)
  } catch {
    products = []
  }

  const injected = getInjectedLocalCatalogProducts()
  const mergedById = new Map<string, OfficeProduct>()
  for (const p of [...products, ...injected]) {
    mergedById.set(String(p.id), p)
  }

  const scoped = filterCategoryProducts([...mergedById.values()], categoryLabel, subcategory)
  const bestseller = pickBestseller(scoped)
  const offer = pickOfferProduct(scoped, bestseller?.id)

  return { bestseller, offer }
}

export const CATEGORY_PROMO_WHATSAPP_NUMBER = '393756139937'

export function categoryPromoWhatsappHref(categoryLabel: string): string {
  const text = `Buongiorno, vorrei richiedere un listino aziendale personalizzato per la categoria ${categoryLabel}.`
  return `https://wa.me/${CATEGORY_PROMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function productWhatsappQuoteHref(productName: string): string {
  const text = `Ciao Astro Forniture, ho bisogno di informazioni sul prodotto *${productName.trim()}* o vorrei un preventivo personalizzato.`
  return `https://wa.me/${CATEGORY_PROMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
