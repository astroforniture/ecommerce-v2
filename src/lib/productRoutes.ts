import type { OfficeProduct } from '../types/officeProduct'

/**
 * Decodifica il segmento `/product/:productId` come arriva da React Router (già decodificato in genere).
 * Gestisce `decodeURIComponent` non valido e normalizza spazi da query-style `+`.
 */
export function decodeProductPathParam(raw: string): string {
  const withSpaces = raw.replace(/\+/g, ' ')
  try {
    return decodeURIComponent(withSpaces).normalize('NFC').trim()
  } catch {
    return withSpaces.normalize('NFC').trim()
  }
}

/**
 * Segmento per `/product/:segment`: coincide con lo SKU in tabella quando presente;
 * altrimenti l'id riga (come `producerCode` in mapRowToOfficeProduct).
 */
export function productDetailUrlSegment(
  product: Pick<OfficeProduct, 'id' | 'producerCode'>,
): string {
  const sku = (product.producerCode ?? '').trim()
  if (sku) return sku
  return String(product.id ?? '').trim()
}

export function productDetailPath(product: Pick<OfficeProduct, 'id' | 'producerCode'>): string {
  return `/product/${encodeURIComponent(productDetailUrlSegment(product))}`
}
