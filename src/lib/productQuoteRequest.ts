import { CATEGORY_PROMO_WHATSAPP_NUMBER } from './categoryPromoProducts'

/** Numero fisso Astro Forniture per richieste preventivo (Casse Ditron e simili). */
export const ASTRO_FORNITURE_LANDLINE_DISPLAY = '0376 399311'
export const ASTRO_FORNITURE_LANDLINE_TEL = 'tel:0376399311'

export function productQuoteRequestMessage(productName: string): string {
  return `Buongiorno, desidero ricevere un preventivo per il prodotto ${productName.trim()}.`
}

export function productQuoteRequestHref(productName: string): string {
  return `https://wa.me/${CATEGORY_PROMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    productQuoteRequestMessage(productName),
  )}`
}
