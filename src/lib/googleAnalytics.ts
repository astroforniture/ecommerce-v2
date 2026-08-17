import type { CartItem } from '../context/CartContext'
import { isCookieCategoryAllowed } from './cookieConsent'
import { effectiveUnitPrice } from './quantityPricing'

export const GA_MEASUREMENT_ID = 'G-VQ92JYJF6D'
export const GTM_CONTAINER_ID = 'GTM-P3CNF34T'
export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

const GA4_PURCHASE_PENDING_KEY = 'af:ga4-purchase-pending'
const GA4_PURCHASE_SENT_PREFIX = 'af:ga4-purchase-sent:'

function writeStorage(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value)
    localStorage.setItem(key, value)
  } catch {
    /* quota / privacy mode */
  }
}

function readStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key)
  } catch {
    return null
  }
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type Ga4EcommerceItem = {
  item_id: string
  item_name: string
  price: number
  quantity: number
}

export type Ga4PurchaseEcommerce = {
  transaction_id: string
  value: number
  tax: number
  shipping: number
  currency: 'EUR'
  items: Ga4EcommerceItem[]
}

function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100
}

function ensureGtagStub(): void {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag === 'function') return
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
}

export function ensureGoogleAnalyticsLoaded(): void {
  if (typeof window === 'undefined') return
  ensureGtagStub()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GA_SCRIPT_SRC}"]`)
  if (existing) return
  const script = document.createElement('script')
  script.async = true
  script.src = GA_SCRIPT_SRC
  document.head.appendChild(script)
}

export function syncGoogleAnalyticsConsent(analyticsAllowed: boolean): void {
  if (typeof window === 'undefined') return
  ensureGtagStub()
  window.gtag?.('consent', 'update', {
    analytics_storage: analyticsAllowed ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

export function trackGoogleAnalyticsPageView(path: string): void {
  if (typeof window === 'undefined') return
  if (!isCookieCategoryAllowed('analytics')) return
  if (path.startsWith('/admin')) return
  ensureGtagStub()
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

function isPurchasePayload(value: unknown): value is Ga4PurchaseEcommerce {
  if (!value || typeof value !== 'object') return false
  const row = value as Partial<Ga4PurchaseEcommerce>
  return (
    typeof row.transaction_id === 'string' &&
    row.transaction_id.trim() !== '' &&
    typeof row.value === 'number' &&
    Number.isFinite(row.value) &&
    Array.isArray(row.items)
  )
}

export function buildGa4PurchaseFromCheckout(input: {
  orderRef: string
  items: CartItem[]
  totalWithVat: number
  vatAmount: number
  shippingFee: number
}): Ga4PurchaseEcommerce {
  return {
    transaction_id: input.orderRef.trim(),
    value: roundMoney2(input.totalWithVat),
    tax: roundMoney2(input.vatAmount),
    shipping: roundMoney2(input.shippingFee),
    currency: 'EUR',
    items: input.items.map((item) => ({
      item_id: (item.sku || item.id).trim() || item.id,
      item_name: item.name,
      price: roundMoney2(effectiveUnitPrice(item.price, item.quantityPriceTiers, item.quantity)),
      quantity: item.quantity,
    })),
  }
}

export function persistPendingGa4Purchase(payload: Ga4PurchaseEcommerce): void {
  if (typeof window === 'undefined') return
  if (!payload.transaction_id || payload.items.length === 0) return
  writeStorage(GA4_PURCHASE_PENDING_KEY, JSON.stringify(payload))
}

export function readPendingGa4Purchase(): Ga4PurchaseEcommerce | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = readStorage(GA4_PURCHASE_PENDING_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isPurchasePayload(parsed) ? parsed : null
  } catch {
    return null
  }
}

function hasSentGa4Purchase(transactionId: string): boolean {
  if (typeof window === 'undefined') return false
  return readStorage(`${GA4_PURCHASE_SENT_PREFIX}${transactionId}`) === '1'
}

function markGa4PurchaseSent(transactionId: string): void {
  writeStorage(`${GA4_PURCHASE_SENT_PREFIX}${transactionId}`, '1')
}

function toPurchaseEcommerce(payload: Ga4PurchaseEcommerce) {
  return {
    transaction_id: String(payload.transaction_id),
    value: Number(payload.value),
    tax: Number(payload.tax || 0),
    shipping: Number(payload.shipping || 0),
    currency: 'EUR' as const,
    items: payload.items.map((item) => ({
      item_id: String(item.item_id),
      item_name: String(item.item_name),
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
  }
}

const pushedPurchaseThisRuntime = new Set<string>()

/**
 * Push GA4/GTM `purchase` sul dataLayer e, se disponibile, anche via gtag.
 * Il payload resta in storage: Tag Assistant ricarica /checkout/success senza history state.
 */
export function trackGoogleAnalyticsPurchase(payload: Ga4PurchaseEcommerce): boolean {
  if (typeof window === 'undefined') return false
  if (!payload.transaction_id || payload.items.length === 0) return false
  persistPendingGa4Purchase(payload)

  const ecommerce = toPurchaseEcommerce(payload)
  window.dataLayer = window.dataLayer || []

  if (pushedPurchaseThisRuntime.has(payload.transaction_id)) {
    console.log('[GA4] purchase già pushato in questo runtime, skip', payload.transaction_id)
    return false
  }
  pushedPurchaseThisRuntime.add(payload.transaction_id)

  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: 'purchase',
    ecommerce,
  })

  if (typeof window.gtag === 'function' && !hasSentGa4Purchase(payload.transaction_id)) {
    window.gtag('event', 'purchase', ecommerce)
    markGa4PurchaseSent(payload.transaction_id)
  } else if (typeof window.gtag === 'function') {
    console.log('[GA4] gtag purchase già inviato per', payload.transaction_id)
  }
  return true
}

export function flushPendingGoogleAnalyticsPurchase(): boolean {
  const pending = readPendingGa4Purchase()
  if (!pending) return false
  return trackGoogleAnalyticsPurchase(pending)
}
