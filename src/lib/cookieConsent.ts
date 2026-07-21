export type CookieCategory = 'necessary' | 'analytics' | 'marketing'

export type CookieConsentPreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

export type CookieConsentRecord = {
  version: number
  decidedAt: string
  preferences: CookieConsentPreferences
}

export const COOKIE_CONSENT_STORAGE_KEY = 'af:cookie-consent:v1'
export const COOKIE_CONSENT_VERSION = 1

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function readCookieConsent(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null
    if (!parsed.preferences || typeof parsed.preferences !== 'object') return null
    return {
      version: COOKIE_CONSENT_VERSION,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : new Date().toISOString(),
      preferences: {
        necessary: true,
        analytics: Boolean(parsed.preferences.analytics),
        marketing: Boolean(parsed.preferences.marketing),
      },
    }
  } catch {
    return null
  }
}

export function hasCookieConsentDecision(): boolean {
  return readCookieConsent() != null
}

export function saveCookieConsent(preferences: CookieConsentPreferences): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    preferences: {
      necessary: true,
      analytics: Boolean(preferences.analytics),
      marketing: Boolean(preferences.marketing),
    },
  }
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
  } catch {
    /* quota / privacy mode */
  }
  window.dispatchEvent(new CustomEvent('af:cookie-consent-changed', { detail: record }))
  return record
}

export function acceptAllCookieConsent(): CookieConsentRecord {
  return saveCookieConsent({ necessary: true, analytics: true, marketing: true })
}

export function rejectOptionalCookieConsent(): CookieConsentRecord {
  return saveCookieConsent({ ...DEFAULT_COOKIE_PREFERENCES })
}

export function openCookiePreferencesEvent(): void {
  window.dispatchEvent(new CustomEvent('af:cookie-preferences-open'))
}

export function isCookieCategoryAllowed(category: Exclude<CookieCategory, 'necessary'>): boolean {
  const consent = readCookieConsent()
  if (!consent) return false
  return Boolean(consent.preferences[category])
}
