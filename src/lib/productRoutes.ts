import type { OfficeProduct } from '../types/officeProduct'

/** Prefisso canonico scheda prodotto (indicizzabile). */
export const PRODUCT_DETAIL_BASE_PATH = '/prodotti'

/**
 * Decodifica il segmento `/prodotti/:slug` (o legacy `/product/:id`) da React Router.
 * Gestisce `decodeURIComponent` non valido e normalizza spazi da query-style `+`.
 *
 * Accetta anche slug “pretty” del tipo `nome-prodotto--SKU`: la chiave catalogo
 * è la parte dopo l’ultimo `--`, altrimenti l’intero segmento.
 */
export function decodeProductPathParam(raw: string): string {
  const withSpaces = raw.replace(/\+/g, ' ')
  let decoded: string
  try {
    decoded = decodeURIComponent(withSpaces).normalize('NFC').trim()
  } catch {
    decoded = withSpaces.normalize('NFC').trim()
  }
  const sep = '--'
  const idx = decoded.lastIndexOf(sep)
  if (idx >= 0) {
    const catalogKey = decoded.slice(idx + sep.length).trim()
    if (catalogKey) return catalogKey
  }
  return decoded
}

/**
 * Slug URL-friendly da nome (solo per segmenti pretty; non obbligatorio).
 */
export function slugifyProductName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Chiave catalogo (SKU o id) usata per fetch e come slug univoco.
 */
export function productCatalogKey(
  product: Pick<OfficeProduct, 'id' | 'producerCode'>,
): string {
  const sku = (product.producerCode ?? '').trim()
  if (sku) return sku
  return String(product.id ?? '').trim()
}

/**
 * Segmento per `/prodotti/:slug`: `nome-prodotto--SKU` quando c’è un nome leggibile,
 * altrimenti solo SKU/id (univoco e risolvibile da decodeProductPathParam).
 */
export function productDetailUrlSegment(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> & { name?: string | null },
): string {
  const key = productCatalogKey(product)
  if (!key) return ''
  const nameSlug = slugifyProductName((product.name ?? '').trim())
  if (nameSlug) return `${nameSlug}--${key}`
  return key
}

export function productDetailPath(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> & { name?: string | null },
): string {
  return `${PRODUCT_DETAIL_BASE_PATH}/${encodeURIComponent(productDetailUrlSegment(product))}`
}

/** Path assoluto canonico (SEO / sitemap). */
export function productDetailAbsoluteUrl(
  product: Pick<OfficeProduct, 'id' | 'producerCode'> & { name?: string | null },
  origin = 'https://www.asforniture.it',
): string {
  const base = origin.replace(/\/$/, '')
  return `${base}${productDetailPath(product)}`
}
