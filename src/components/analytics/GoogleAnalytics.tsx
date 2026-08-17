import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  ensureGoogleAnalyticsLoaded,
  flushPendingGoogleAnalyticsPurchase,
  syncGoogleAnalyticsConsent,
  trackGoogleAnalyticsPageView,
} from '../../lib/googleAnalytics'
import { isCookieCategoryAllowed, type CookieConsentRecord } from '../../lib/cookieConsent'

function currentPath(pathname: string, search: string): string {
  return `${pathname}${search}`
}

/** Carica gtag e invia page_view SPA solo con consenso cookie analitici. */
export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    ensureGoogleAnalyticsLoaded()
    syncGoogleAnalyticsConsent(isCookieCategoryAllowed('analytics'))

    function onConsentChanged(event: Event) {
      const record = (event as CustomEvent<CookieConsentRecord>).detail
      const allowed = Boolean(record?.preferences?.analytics)
      syncGoogleAnalyticsConsent(allowed)
      if (allowed) {
        trackGoogleAnalyticsPageView(
          currentPath(window.location.pathname, window.location.search),
        )
        flushPendingGoogleAnalyticsPurchase()
      }
    }

    window.addEventListener('af:cookie-consent-changed', onConsentChanged)
    return () => window.removeEventListener('af:cookie-consent-changed', onConsentChanged)
  }, [])

  useEffect(() => {
    trackGoogleAnalyticsPageView(currentPath(location.pathname, location.search))
  }, [location.pathname, location.search])

  return null
}
