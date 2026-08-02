import type { OfficeProduct, QuantityPriceTier } from '../types/officeProduct'
import { CARTA_SUBCATEGORY_TERMICA, cartaCategoryHref } from '../lib/officeCategories'
import { purchaseQuantityRuleForSku } from '../lib/purchaseQuantity'

/** Listini quantità / prezzi fissi carta termica (imponibile / conf.) — chiave = SKU. */
const CARTA_TERMICA_QUANTITY_PRICING_BY_SKU: Record<
  string,
  { basePrice: number; tiers: QuantityPriceTier[] }
> = {
  '93453': {
    basePrice: 2.87,
    tiers: [
      { minQuantity: 1, unitPrice: 2.87 },
      { minQuantity: 6, unitPrice: 2.5 },
    ],
  },
  '93454': {
    basePrice: 17.21,
    tiers: [
      { minQuantity: 1, unitPrice: 17.21 },
      { minQuantity: 5, unitPrice: 16.38 },
      { minQuantity: 10, unitPrice: 15.67 },
    ],
  },
  '100072': {
    basePrice: 5.77,
    tiers: [
      { minQuantity: 1, unitPrice: 5.77 },
      { minQuantity: 5, unitPrice: 4.51 },
      { minQuantity: 10, unitPrice: 4.09 },
    ],
  },
  '100149': {
    basePrice: 6.56,
    tiers: [
      { minQuantity: 1, unitPrice: 6.56 },
      { minQuantity: 5, unitPrice: 5.74 },
      { minQuantity: 10, unitPrice: 5.29 },
    ],
  },
  '100335': { basePrice: 18.5, tiers: [] },
  '100332': { basePrice: 10.5, tiers: [] },
  '100337': { basePrice: 21.0, tiers: [] },
  '100195': { basePrice: 2.0, tiers: [] },
  '104279': { basePrice: 15.0, tiers: [] },
}

export const CARTA_TERMICA_CATEGORY = 'Carta' as const

/** Copertina tile hub Carta → Carta Termica. */
export const CARTA_TERMICA_HUB_COVER_IMAGE_URL = '/images/carta-termica-100072.jpg'

export type CartaTermicaCatalogItem = {
  sku: string
  name: string
  brand: string
  format?: string
  imageUrl: string
  description: string
}

/** Catalogo rotoli carta termica (codici OD Multimedia). */
export const CARTA_TERMICA_CATALOG: readonly CartaTermicaCatalogItem[] = [
  {
    sku: '100072',
    name: 'Rotolo per POS e carta di credito - 57 mm x 20 m - 55 gr - diametro esterno 40 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
    brand: 'Sabacart',
    format: '57 mm x 20 m',
    imageUrl: '/images/carta-termica-100072.jpg',
    description:
      'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 20 m, 55 gr, diametro esterno 40 mm, anima 12 mm. Blister da 10 pezzi.',
  },
  {
    sku: '100149',
    name: 'Rotolo per POS e carta di credito - 57 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
    brand: 'Sabacart',
    format: '57 mm x 30 m',
    imageUrl: '/images/carta-termica-100149.jpg',
    description:
      'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.',
  },
  {
    sku: '93453',
    name: 'Rotolo per POS e carta di credito - 57 mm x 7 m - 55 gr - diametro esterno 25 mm - senza anima - carta termica BPA free - Rotolificio Pugliese - blister 3 pezzi',
    brand: 'Rotolificio Pugliese',
    format: '57 mm x 7 m',
    imageUrl: '/images/carta-termica-93453.jpg',
    description:
      'Rotolo carta termica BPA free Rotolificio Pugliese per POS e carta di credito, 57 mm × 7 m, 55 gr, diametro esterno 25 mm, senza anima. Blister da 3 pezzi.',
  },
  {
    sku: '93454',
    name: 'Rotolo registratore di cassa - omologato - 79 mm x 80 m - 55 gr - diametro esterno 77 mm - anima 12 mm - carta termica BPA free - Rotolificio Pugliese - blister 10 pezzi',
    brand: 'Rotolificio Pugliese',
    format: '79 mm x 80 m',
    imageUrl: '/images/carta-termica-93454.jpg',
    description:
      'Rotolo carta termica BPA free omologato Rotolificio Pugliese per registratore di cassa, 79 mm × 80 m, 55 gr, diametro esterno 77 mm, anima 12 mm. Blister da 10 pezzi.',
  },
  {
    sku: '104279',
    name: 'Rotolo per registratori di cassa - carta termica BPA free - 79 mm x 60 mt - 48 gr - diametro esterno 64 mm - anima 12 mm - Rotolificio Pugliese - blister 10 pezzi',
    brand: 'Rotolificio Pugliese',
    format: '79 mm x 60 m',
    imageUrl: '/images/carta-termica-104279.jpg',
    description:
      'Rotolo carta termica BPA free Rotolificio Pugliese per registratori di cassa, 79 mm × 60 m, 48 gr, diametro esterno 64 mm, anima 12 mm. Blister da 10 pezzi.',
  },
  {
    sku: '100195',
    name: 'Rotolo per distributore self service - 57 mm x 85 m - 70 gr - diametro esterno 87 mm - anima 12 mm - carta termica BPA free - Sabacart',
    brand: 'Sabacart',
    format: '57 mm x 85 m',
    imageUrl: '/images/carta-termica-100195.jpg',
    description:
      'Rotolo carta termica BPA free Sabacart per distributore self service, 57 mm × 85 m, 70 gr, diametro esterno 87 mm, anima 12 mm.',
  },
  {
    sku: '100332',
    name: 'Rotolo per bilancia - 62,5 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
    brand: 'Sabacart',
    format: '62,5 mm x 30 m',
    imageUrl: '/images/carta-termica-100332.jpg',
    description:
      'Rotolo carta termica BPA free Sabacart per bilancia, 62,5 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.',
  },
  {
    sku: '100335',
    name: 'Rotolo per bilancia - 57 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi',
    brand: 'Sabacart',
    format: '57 mm x 38 m',
    imageUrl: '/images/carta-termica-100335.jpg',
    description:
      'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 57 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.',
  },
  {
    sku: '100337',
    name: 'Rotolo per bilancia - 62,5 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi',
    brand: 'Sabacart',
    format: '62,5 mm x 38 m',
    imageUrl: '/images/carta-termica-100337.jpg',
    description:
      'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 62,5 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.',
  },
] as const

function applyCatalogQuantityPricing(product: OfficeProduct, sku: string): OfficeProduct {
  const key = sku.toUpperCase()
  const pricing = CARTA_TERMICA_QUANTITY_PRICING_BY_SKU[key]
  const rule = purchaseQuantityRuleForSku(key)
  if (!pricing && !rule) return product
  return {
    ...product,
    ...(pricing
      ? {
          price: pricing.basePrice,
          quantityPriceTiers: pricing.tiers.map((t) => ({ ...t })),
        }
      : {}),
    ...(rule
      ? {
          minOrderQuantity: rule.minOrderQuantity,
          orderQuantityStep: rule.orderQuantityStep,
        }
      : {}),
  }
}

function toOfficeProduct(item: CartaTermicaCatalogItem): OfficeProduct {
  return applyCatalogQuantityPricing(
    {
      id: item.sku,
      name: item.name,
      brand: item.brand,
      producerCode: item.sku,
      category: CARTA_TERMICA_CATEGORY,
      subcategory: CARTA_SUBCATEGORY_TERMICA,
      mainFeatures: {
        ...(item.format ? { Formato: item.format } : {}),
        Tipo: 'Carta termica',
      },
      imageUrl: item.imageUrl,
      format: item.format,
      description: item.description,
      price: 0,
    },
    item.sku,
  )
}

export function buildCartaTermicaOfficeProducts(): OfficeProduct[] {
  return CARTA_TERMICA_CATALOG.map(toOfficeProduct)
}

export function resolveCartaTermicaProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim().toUpperCase()
  const item = CARTA_TERMICA_CATALOG.find((row) => row.sku.toUpperCase() === k)
  return item ? toOfficeProduct(item) : null
}

export function mergeCartaTermicaListingProducts(
  fromCatalog: OfficeProduct[],
): OfficeProduct[] {
  const synthetic = buildCartaTermicaOfficeProducts()
  const patched = fromCatalog.map((p) => {
    const sku = String(p.producerCode || p.id || '').trim().toUpperCase()
    const catalogItem = CARTA_TERMICA_CATALOG.find((item) => item.sku.toUpperCase() === sku)
    if (!catalogItem) return p
    return applyCatalogQuantityPricing(
      {
        ...p,
        category: CARTA_TERMICA_CATEGORY,
        subcategory: CARTA_SUBCATEGORY_TERMICA,
        imageUrl: catalogItem.imageUrl || p.imageUrl,
        format: p.format || catalogItem.format,
        brand: p.brand || catalogItem.brand,
        description: p.description || catalogItem.description,
      },
      sku,
    )
  })
  const dbSkus = new Set(
    patched.map((p) => String(p.producerCode || p.id || '').trim().toUpperCase()).filter(Boolean),
  )
  const missing = synthetic.filter((p) => !dbSkus.has(p.id.toUpperCase()))
  return [...missing, ...patched]
}

export function cartaTermicaListingPath(): string {
  return cartaCategoryHref(CARTA_SUBCATEGORY_TERMICA)
}
