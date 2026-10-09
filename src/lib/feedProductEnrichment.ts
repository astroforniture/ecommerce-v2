import type { OfficeProduct } from '../types/officeProduct'
import { applySicurezzaApparelCatalog } from '../data/sicurezzaApparelCatalog'
import { MODULISTICA_CATALOG } from '../data/modulisticaCatalog'
import { extractOfficeProductEan } from './productEan'

/**
 * Allinea prezzo/EAN feed al sito:
 * - promo Sicurezza + EAN taglie da catalogo apparel
 * - EAN Modulistica Edipro da catalogo FE se assente a DB
 */
export function enrichProductForMerchantFeed(product: OfficeProduct): OfficeProduct {
  let next = applySicurezzaApparelCatalog(product)
  if (extractOfficeProductEan(next)) return next

  const sku = String(next.producerCode || next.id || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
  if (!sku) return next

  const catalogItem = MODULISTICA_CATALOG.find((item) => {
    const itemSku = item.sku.trim().toUpperCase().replace(/\s+/g, ' ')
    return itemSku === sku || itemSku.replace(/\s+/g, '-') === sku.replace(/\s+/g, '-')
  })
  const ean = (catalogItem?.ean ?? '').trim()
  if (!ean) return next
  return {
    ...next,
    ean,
    mainFeatures: { ...next.mainFeatures, EAN: ean },
  }
}
