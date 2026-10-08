/**
 * Feed Trovaprezzi — prezzi IVA inclusa (specifiche marketplace).
 *
 * Endpoint:
 *   https://asforniture.it/feeds/trovaprezzi.xml
 *   https://asforniture.it/feeds/trovaprezzi.csv
 *   https://asforniture.it/api/feeds/trovaprezzi
 *   https://asforniture.it/api/trovaprezzi-feed
 */

import type { OfficeProduct } from '../types/officeProduct'
import { computeShippingFeeIvato } from './cartShipping'
import type { GoogleMerchantFeedItem } from './googleMerchantFeed'
import {
  absoluteAssetUrl,
  isFeedableOfficeProduct,
  truncateMerchantText,
} from './googleMerchantFeed'
import { productCatalogKey, productDetailAbsoluteUrl } from './productRoutes'
import { SITE_BRAND_NAME, SITE_ORIGIN } from './siteSeo'
import { priceWithVat, resolveVatRate, vatPercentLabel } from './vatPricing'

export type TrovaprezziOffer = {
  code: string
  name: string
  description: string
  /** Prezzo finale IVA inclusa (numero). */
  price: number
  /** Prezzo formattato IT con 2 decimali. */
  priceFormatted: string
  link: string
  image: string
  brand: string
  categories: string
  shippingCost: number
  availability: '1' | '0'
  vatPercent: number
  /** EAN/GTIN numerico se disponibile; altrimenti assente. */
  eanCode?: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function csvEscape(value: string | number): string {
  const text = String(value ?? '')
  if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/** Normalizza EAN/GTIN: solo cifre, lunghezza tipica 8–14; altrimenti undefined. */
export function normalizeTrovaprezziEan(
  raw: string | null | undefined,
): string | undefined {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length >= 8 && digits.length <= 14) return digits
  return undefined
}

/** Spese spedizione feed = stessa regola carrello sul prezzo ivato dell'offerta. */
export function trovaprezziShippingCostForPrice(priceIvato: number): number {
  return computeShippingFeeIvato(priceIvato, 'shipping')
}

export function mapOfficeProductToTrovaprezziOffer(
  product: OfficeProduct,
  opts: { origin?: string } = {},
): TrovaprezziOffer | null {
  if (!isFeedableOfficeProduct(product)) return null
  const origin = (opts.origin ?? SITE_ORIGIN).replace(/\/$/, '')
  const code = productCatalogKey(product)
  if (!code) return null
  const link = productDetailAbsoluteUrl(product, origin)
  const image = absoluteAssetUrl(product.imageUrl, origin)
  if (!link || !image) return null

  const imponibile = product.price as number
  const price = priceWithVat(imponibile, product.vatRate)
  const categories = [product.category, product.subcategory]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .join(' > ')

  const descriptionRaw =
    (product.description ?? '').trim() ||
    (product.subtitle ?? '').trim() ||
    `${product.name}${product.brand ? ` - ${product.brand}` : ''}`

  const eanCode = normalizeTrovaprezziEan(
    product.ean ?? product.mainFeatures?.EAN ?? product.mainFeatures?.['Codice EAN'],
  )

  return {
    code,
    name: truncateMerchantText(product.name, 150),
    description: truncateMerchantText(descriptionRaw, 2000),
    price,
    priceFormatted: price.toFixed(2).replace('.', ','),
    link,
    image,
    brand: (product.brand ?? '').trim() || SITE_BRAND_NAME,
    categories: categories || 'Cancelleria',
    shippingCost: trovaprezziShippingCostForPrice(price),
    availability: product.inStock === false ? '0' : '1',
    vatPercent: vatPercentLabel(resolveVatRate(product.vatRate)),
    ...(eanCode ? { eanCode } : {}),
  }
}

/** Converte item Merchant (già filtrati) in offerte Trovaprezzi. */
export function mapMerchantItemToTrovaprezziOffer(
  item: GoogleMerchantFeedItem,
): TrovaprezziOffer | null {
  const priceNum = Number.parseFloat(String(item.price ?? '').replace(/[^\d.]/g, ''))
  if (!Number.isFinite(priceNum) || priceNum <= 0) return null
  const code = (item.id ?? '').trim()
  if (!code) return null
  const link = (item.link ?? '').trim()
  const image = (item.image_link ?? '').trim()
  if (!link || !image) return null

  const eanCode = normalizeTrovaprezziEan(item.gtin)

  return {
    code,
    name: truncateMerchantText(item.title, 150),
    description: truncateMerchantText(item.description, 2000),
    price: priceNum,
    priceFormatted: priceNum.toFixed(2).replace('.', ','),
    link,
    image,
    brand: (item.brand ?? '').trim() || SITE_BRAND_NAME,
    categories: (item.product_type ?? '').trim() || 'Cancelleria',
    shippingCost: trovaprezziShippingCostForPrice(priceNum),
    availability: item.availability === 'in_stock' ? '1' : '0',
    vatPercent: 22,
    ...(eanCode ? { eanCode } : {}),
  }
}

export function renderTrovaprezziXml(offers: readonly TrovaprezziOffer[]): string {
  const body = offers
    .map((o) => {
      const eanLine = o.eanCode
        ? `\n    <EanCode>${escapeXml(o.eanCode)}</EanCode>`
        : ''
      return `  <Offer>
    <Code>${escapeXml(o.code)}</Code>
    <Name>${escapeXml(o.name)}</Name>
    <Description>${escapeXml(o.description)}</Description>
    <Price>${o.price.toFixed(2)}</Price>
    <Link>${escapeXml(o.link)}</Link>
    <Image>${escapeXml(o.image)}</Image>
    <Brand>${escapeXml(o.brand)}</Brand>
    <Categories>${escapeXml(o.categories)}</Categories>
    <ShippingCost>${o.shippingCost.toFixed(2)}</ShippingCost>
    <Availability>${o.availability}</Availability>
    <Vat>${o.vatPercent}</Vat>${eanLine}
  </Offer>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<Products>
${body}
</Products>
`
}

/** CSV Trovaprezzi-compatibile (separatore ";", prezzo IVA inclusa). */
export function renderTrovaprezziCsv(offers: readonly TrovaprezziOffer[]): string {
  const headers = [
    'Code',
    'Name',
    'Description',
    'Price',
    'Link',
    'Image',
    'Brand',
    'Categories',
    'ShippingCost',
    'Availability',
    'Vat',
    'EanCode',
  ]
  const rows = offers.map((o) =>
    [
      o.code,
      o.name,
      o.description,
      o.price.toFixed(2),
      o.link,
      o.image,
      o.brand,
      o.categories,
      o.shippingCost.toFixed(2),
      o.availability,
      o.vatPercent,
      o.eanCode ?? '',
    ]
      .map(csvEscape)
      .join(';'),
  )
  return `\uFEFF${[headers.join(';'), ...rows].join('\n')}`
}
