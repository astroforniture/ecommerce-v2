/** Branding condiviso per email transazionali Astro Forniture. */
export const EMAIL_BRAND_NAME = 'Astro Forniture'
export const EMAIL_SITE_ORIGIN = 'https://www.asforniture.it'
export const EMAIL_LOGO_URL = `${EMAIL_SITE_ORIGIN}/logo-astro-forniture.png`
export const EMAIL_SUPPORT = 'info@astro-forniture.it'
export const EMAIL_CATALOG_URL = `${EMAIL_SITE_ORIGIN}/office-products`
export const EMAIL_ACCOUNT_URL = `${EMAIL_SITE_ORIGIN}/account`
export const EMAIL_FROM_DEFAULT = 'Astro Forniture <info@astro-forniture.it>'

export function formatEuroIt(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number.isFinite(amount) ? amount : 0)
}
