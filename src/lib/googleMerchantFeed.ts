/**
 * Google Merchant Center product feed helpers (RSS 2.0 + g: namespace).
 * Prices are IVA inclusa (imponibile ù VAT_RATE) ù formato "12.50 EUR".
 *
 * Merchant Center ? Products ? Feeds ? Scheduled fetch:
 *   https://www.asforniture.it/api/google-merchant-feed
 *   https://www.asforniture.it/feeds/google-merchant-feed.xml
 */

import type { OfficeProduct } from '../types/officeProduct'
import { isQuoteOnlyOfficeProduct } from '../data/casseDitronProducts'
import { VAT_RATE, roundMoney2 } from './cartMerchandiseIvato'
import { productCatalogKey, productDetailAbsoluteUrl } from './productRoutes'
import { SITE_BRAND_NAME, SITE_ORIGIN } from './siteSeo'

export type GoogleMerchantAvailability = 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder'

export type GoogleMerchantFeedItem = {
  id: string
  title: string
  description: string
  link: string
  image_link: string
  price: string
  availability: GoogleMerchantAvailability
  brand: string
  google_product_category: string
  product_type?: string
  gtin?: string
  mpn?: string
  additional_image_link?: string[]
  condition: 'new'
}

export type MapMerchantOptions = {
  origin?: string
  /** Stock numerico da DB; se 0 ? out_of_stock. Se assente, usa inStock FE o default in_stock. */
  stock?: number | null
}

/** Google product taxonomy IDs (IT retail / office / medical). */
const GOOGLE_CATEGORY_BY_SITE: Array<{ match: RegExp; id: string }> = [
  { match: /agende/i, id: '5181' }, // Office Supplies > Planning & Organizers > Calendars & Planners
  { match: /modulistica/i, id: '923' }, // Office Supplies > Filing & Organization
  { match: /carta/i, id: '961' }, // Office Supplies > Office Paper
  { match: /archivio/i, id: '923' },
  { match: /sicurezza|dpi|abbigliamento/i, id: '2047' }, // Apparel & Accessories > Clothing
  { match: /astro\s*medical|medical|salute|chirurg|diagnost/i, id: '491' }, // Health & Beauty > Health Care
  { match: /macchine|distrugg|etichett|plastific|cassa|toner|verifica/i, id: '1624' }, // Electronics > Print / Office Electronics
  { match: /shopper|buste|sacboll/i, id: '100' }, // Luggage & Bags > Shopping Bags / Handbags-ish; Bags
  { match: /cancelleria|penne|quadern|pile|timbr/i, id: '922' }, // Office Supplies
]

const DEFAULT_GOOGLE_CATEGORY = '922'

export function googleProductCategoryForProduct(
  product: Pick<OfficeProduct, 'category' | 'subcategory' | 'name'>,
): string {
  const hay = `${product.category ?? ''} ${product.subcategory ?? ''} ${product.name ?? ''}`
  for (const row of GOOGLE_CATEGORY_BY_SITE) {
    if (row.match.test(hay)) return row.id
  }
  return DEFAULT_GOOGLE_CATEGORY
}

export function absoluteAssetUrl(url: string, origin = SITE_ORIGIN): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const base = origin.replace(/\/$/, '')
  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`
}

export function formatMerchantGrossPrice(imponibile: number): string {
  const gross = roundMoney2(imponibile * (1 + VAT_RATE))
  return `${gross.toFixed(2)} EUR`
}

export function truncateMerchantText(value: string, max: number): string {
  const cleaned = value.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  return `${cleaned.slice(0, Math.max(0, max - 1)).trimEnd()}ù`
}

export function isFeedableOfficeProduct(
  product: OfficeProduct,
  opts?: { stock?: number | null },
): boolean {
  if (isQuoteOnlyOfficeProduct(product)) return false
  const title = (product.name ?? '').trim()
  if (!title) return false
  const image = (product.imageUrl ?? '').trim()
  if (!image) return false
  const imponibile = product.price
  if (typeof imponibile !== 'number' || !Number.isFinite(imponibile) || imponibile <= 0) {
    return false
  }
  const key = productCatalogKey(product)
  if (!key) return false
  // stock esplicitamente 0 resta feedable ma out_of_stock (non escluso)
  void opts
  return true
}

function resolveAvailability(
  product: OfficeProduct,
  _stock?: number | null,
): GoogleMerchantAvailability {
  // La colonna `products.stock` non Ë affidabile sul catalogo attuale (spesso 0).
  // Allineamento a JSON-LD PDP: in vendita = in_stock, salvo flag FE esplicito.
  void _stock
  if (product.inStock === false) return 'out_of_stock'
  return 'in_stock'
}

export function mapOfficeProductToMerchantItem(
  product: OfficeProduct,
  opts: MapMerchantOptions = {},
): GoogleMerchantFeedItem | null {
  if (!isFeedableOfficeProduct(product, opts)) return null

  const origin = (opts.origin ?? SITE_ORIGIN).replace(/\/$/, '')
  const id = productCatalogKey(product)
  const title = truncateMerchantText(product.name, 150)
  const descriptionRaw =
    (product.description ?? '').trim() ||
    (product.subtitle ?? '').trim() ||
    `${product.name}${product.brand ? ` ù ${product.brand}` : ''}`
  const description = truncateMerchantText(descriptionRaw, 5000)
  const link = productDetailAbsoluteUrl(product, origin)
  const image_link = absoluteAssetUrl(product.imageUrl, origin)
  if (!image_link || !link) return null

  const additional = (product.imageGalleryUrls ?? [])
    .map((u) => absoluteAssetUrl(u, origin))
    .filter((u) => u && u !== image_link)
    .slice(0, 10)

  const brand = (product.brand ?? '').trim() || SITE_BRAND_NAME
  const productTypeParts = [product.category, product.subcategory]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)

  const ean = (product.ean ?? product.mainFeatures?.EAN ?? '').replace(/\D/g, '')
  const gtin = ean.length >= 8 && ean.length <= 14 ? ean : undefined
  const mpn = (product.producerCode ?? '').trim() || undefined

  return {
    id,
    title,
    description,
    link,
    image_link,
    price: formatMerchantGrossPrice(product.price as number),
    availability: resolveAvailability(product, opts.stock),
    brand,
    google_product_category: googleProductCategoryForProduct(product),
    product_type: productTypeParts.length ? productTypeParts.join(' > ') : undefined,
    gtin,
    mpn,
    additional_image_link: additional.length ? additional : undefined,
    condition: 'new',
  }
}

export function xmlEscape(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function itemToXml(item: GoogleMerchantFeedItem): string {
  const lines: string[] = [
    '    <item>',
    `      <g:id>${xmlEscape(item.id)}</g:id>`,
    `      <g:title>${xmlEscape(item.title)}</g:title>`,
    `      <g:description>${xmlEscape(item.description)}</g:description>`,
    `      <g:link>${xmlEscape(item.link)}</g:link>`,
    `      <g:image_link>${xmlEscape(item.image_link)}</g:image_link>`,
    `      <g:availability>${item.availability}</g:availability>`,
    `      <g:price>${xmlEscape(item.price)}</g:price>`,
    `      <g:brand>${xmlEscape(item.brand)}</g:brand>`,
    `      <g:condition>${item.condition}</g:condition>`,
    `      <g:google_product_category>${xmlEscape(item.google_product_category)}</g:google_product_category>`,
  ]
  if (item.product_type) {
    lines.push(`      <g:product_type>${xmlEscape(item.product_type)}</g:product_type>`)
  }
  if (item.gtin) {
    lines.push(`      <g:gtin>${xmlEscape(item.gtin)}</g:gtin>`)
  }
  if (item.mpn) {
    lines.push(`      <g:mpn>${xmlEscape(item.mpn)}</g:mpn>`)
  }
  for (const extra of item.additional_image_link ?? []) {
    lines.push(`      <g:additional_image_link>${xmlEscape(extra)}</g:additional_image_link>`)
  }
  lines.push('    </item>')
  return lines.join('\n')
}

export function renderGoogleMerchantRssXml(
  items: GoogleMerchantFeedItem[],
  opts?: { title?: string; link?: string; description?: string },
): string {
  const title = opts?.title ?? `${SITE_BRAND_NAME} Google Merchant Feed`
  const link = opts?.link ?? SITE_ORIGIN
  const description =
    opts?.description ?? `Catalogo prodotti ${SITE_BRAND_NAME} (prezzi IVA inclusa)`

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xmlEscape(title)}</title>
    <link>${xmlEscape(link)}</link>
    <description>${xmlEscape(description)}</description>
${items.map(itemToXml).join('\n')}
  </channel>
</rss>
`
}
