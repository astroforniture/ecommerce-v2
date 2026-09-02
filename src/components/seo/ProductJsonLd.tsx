import { useEffect } from 'react'

import { SITE_ORIGIN, upsertJsonLdById } from '../../lib/siteSeo'

export const PRODUCT_JSONLD_ID = 'seo-product-jsonld'

export type ProductJsonLdInput = {
  name: string
  description?: string | null
  sku?: string | null
  brandName?: string | null
  imageUrl?: string | null
  /** URL canonico assoluto della scheda prodotto. */
  url: string
  price?: number | null
  /** Se false ? OutOfStock; undefined/true ? InStock. */
  inStock?: boolean | null
  /** Se true, Offer senza prezzo numerico (preventivo). */
  quoteOnly?: boolean
  priceCurrency?: string
}

/** Converte path relativi (`/images/...`) in URL assoluti per Google. */
export function toAbsoluteAssetUrl(
  rawUrl: string | null | undefined,
  origin: string = SITE_ORIGIN,
): string {
  const url = String(rawUrl ?? '').trim()
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('//')) return `https:${url}`
  const base = origin.replace(/\/$/, '')
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
}

export function buildProductJsonLd(input: ProductJsonLdInput): Record<string, unknown> {
  const name = input.name.trim()
  const brandName = (input.brandName ?? '').trim() || 'Astro Forniture'
  const sku = (input.sku ?? '').trim()
  const description =
    (input.description ?? '').trim() || `${name} - ${brandName}`
  const absoluteImage = toAbsoluteAssetUrl(input.imageUrl)
  const currency = (input.priceCurrency ?? 'EUR').trim() || 'EUR'
  const availability =
    input.inStock === false
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock'

  const offers: Record<string, unknown> = {
    '@type': 'Offer',
    priceCurrency: currency,
    availability,
    url: input.url,
  }

  if (input.quoteOnly) {
    offers.description = 'Prezzo su preventivo'
  } else {
    const price =
      typeof input.price === 'number' && Number.isFinite(input.price)
        ? input.price.toFixed(2)
        : '0.00'
    offers.price = price
  }

  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers,
  }

  if (sku) payload.sku = sku
  if (absoluteImage) payload.image = [absoluteImage]

  return payload
}

export function upsertProductJsonLd(payload: Record<string, unknown>) {
  upsertJsonLdById(PRODUCT_JSONLD_ID, payload)
}

/**
 * Inietta / aggiorna lo script `application/ld+json` Product per Rich Snippets.
 * Usato nelle pagine di dettaglio prodotto.
 */
export function ProductJsonLd(props: ProductJsonLdInput) {
  useEffect(() => {
    if (!props.name.trim() || !props.url.trim()) return
    upsertProductJsonLd(buildProductJsonLd(props))
  }, [
    props.name,
    props.description,
    props.sku,
    props.brandName,
    props.imageUrl,
    props.url,
    props.price,
    props.inStock,
    props.quoteOnly,
    props.priceCurrency,
  ])

  return null
}
