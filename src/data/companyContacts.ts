/** Contatti aziendali condivisi (footer servizi, form, CTA). */
export const COMPANY_TRADE_NAME = 'Astro Forniture / TuttUfficio Buffetti'

export const COMPANY_LANDLINE_DISPLAY = '0376 329959'
export const COMPANY_LANDLINE_TEL = 'tel:0376329959'

export const COMPANY_MOBILE_DISPLAY = '375 613 9937'
export const COMPANY_MOBILE_TEL = 'tel:3756139937'
export const COMPANY_WHATSAPP_E164 = '393756139937'

export const COMPANY_EMAIL = 'info@astro-forniture.it'
export const COMPANY_MAILTO = `mailto:${COMPANY_EMAIL}`

export const COMPANY_PICKUP_MAPS_URL =
  'https://www.google.com/maps/place/TuttUfficio+-+Astro+Forniture+-+Buffetti/@45.1577559,10.780641,798m/data=!3m1!1e3!4m6!3m5!1s0x4781d40542969b23:0xa501aea8bfb94f19!8m2!3d45.1574893!4d10.7817291!16s%2Fg%2F1tdc8nkn?entry=ttu'

/** Embed ufficiale Google Maps (TuttUfficio / Astro Forniture / Buffetti). */
export const COMPANY_PICKUP_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2816.632731872166!2d10.77915417670731!3d45.15748927107055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781d40542969b23%3A0xa501aea8bfb94f19!2sTuttUfficio%20-%20Astro%20Forniture%20-%20Buffetti!5e0!3m2!1sit!2sit!4v1710000000000!5m2!1sit!2sit'

export const COMPANY_ADDRESS_SHORT = 'Strada Cisa 7, 46047 Porto Mantovano (MN)'

export function companyWhatsappHref(prefillMessage: string): string {
  return `https://wa.me/${COMPANY_WHATSAPP_E164}?text=${encodeURIComponent(prefillMessage)}`
}

export function companyMailtoHref(subject: string, body?: string): string {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body?.trim()) params.set('body', body.trim())
  return `mailto:${COMPANY_EMAIL}?${params.toString()}`
}
