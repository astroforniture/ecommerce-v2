import type { OfficeProduct, ProductVariantOption } from '../types/officeProduct'

/** Normalizza EAN/GTIN: solo cifre, lunghezza tipica 8–14. */
export function normalizeProductEan(raw: string | null | undefined): string | undefined {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length >= 8 && digits.length <= 14) return digits
  return undefined
}

function eanFromFeatureMap(features: Record<string, string> | undefined): string | undefined {
  if (!features) return undefined
  const preferredKeys = [
    'EAN',
    'Ean',
    'ean',
    'GTIN',
    'Gtin',
    'gtin',
    'Barcode',
    'barcode',
    'Codice EAN',
    'Codice EAN/GTIN',
    'EAN/UPC',
    'EAN13',
  ]
  for (const key of preferredKeys) {
    const hit = normalizeProductEan(features[key])
    if (hit) return hit
  }
  for (const [key, value] of Object.entries(features)) {
    if (!/ean|gtin|barcode|upc/i.test(key)) continue
    const hit = normalizeProductEan(value)
    if (hit) return hit
  }
  return undefined
}

function eanFromVariants(variants: ProductVariantOption[] | undefined): string | undefined {
  if (!variants?.length) return undefined
  for (const v of variants) {
    const hit = normalizeProductEan(
      v.ean ??
        (v as { gtin?: string }).gtin ??
        (v as { barcode?: string }).barcode,
    )
    if (hit) return hit
  }
  return undefined
}

/** Estrae EAN/GTIN da colonna prodotto, mainFeatures o prima variante valorizzata. */
export function extractOfficeProductEan(
  product: Pick<OfficeProduct, 'ean' | 'mainFeatures' | 'variants' | 'description'>,
): string | undefined {
  const fromField = normalizeProductEan(product.ean)
  if (fromField) return fromField

  const fromFeatures = eanFromFeatureMap(product.mainFeatures)
  if (fromFeatures) return fromFeatures

  const fromVariants = eanFromVariants(product.variants)
  if (fromVariants) return fromVariants

  // Fallback: "EAN 8056..." / "EAN/UPC 8056..." in descrizione (schede GIMA).
  const desc = String(product.description ?? '')
  const m = desc.match(/\bEAN(?:\/UPC)?\s*[:=]?\s*(\d{8,14})\b/i)
  if (m?.[1]) return normalizeProductEan(m[1])

  return undefined
}
