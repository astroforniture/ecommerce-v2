import { isCookieCategoryAllowed } from './cookieConsent'

export const GA_MEASUREMENT_ID = 'G-VQ92JYJF6D'
export const GTM_CONTAINER_ID = 'GTM-P3CNF34T'
export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
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
