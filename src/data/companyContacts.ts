/** Contatti aziendali condivisi (footer servizi, form, CTA). */
export const COMPANY_TRADE_NAME = 'Astro Forniture / TuttUfficio Buffetti'

export const COMPANY_LANDLINE_DISPLAY = '0376 329959'
export const COMPANY_LANDLINE_TEL = 'tel:0376329959'

export const COMPANY_MOBILE_DISPLAY = '375 613 9937'
export const COMPANY_MOBILE_TEL = 'tel:3756139937'
export const COMPANY_WHATSAPP_E164 = '393756139937'

/** Sede Porto Mantovano — secondo numero WhatsApp / cellulare. */
export const COMPANY_PORTO_MOBILE_DISPLAY = '348 2430910'
export const COMPANY_PORTO_MOBILE_TEL = 'tel:3482430910'
export const COMPANY_PORTO_WHATSAPP_E164 = '393482430910'

export const COMPANY_EMAIL = 'info@astro-forniture.it'
export const COMPANY_MAILTO = `mailto:${COMPANY_EMAIL}`

/** Sede ufficiale / punto di ritiro: Mantova. */
export const COMPANY_ADDRESS_MANTOVA = 'Largo di Porta Pradella, 2, 46100 Mantova MN'
/** Alias usato in checkout, footer servizi e ritiro. */
export const COMPANY_ADDRESS_SHORT = COMPANY_ADDRESS_MANTOVA
export const COMPANY_ADDRESS_PORTO = 'Strada Cisa 7, 46047 Porto Mantovano (MN)'

export const COMPANY_PICKUP_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Largo+di+Porta+Pradella,+2,+46100+Mantova+MN'

/** Embed Google Maps — sede di ritiro Mantova. */
export const COMPANY_PICKUP_MAPS_EMBED_URL =
  'https://www.google.com/maps?q=Largo+di+Porta+Pradella,+2,+46100+Mantova+MN&output=embed'

export type CompanySeat = {
  id: 'mantova' | 'porto-mantovano'
  title: string
  address: string
  phoneDisplay: string
  telHref: string
  whatsappHref: string
}

/** Due sedi mostrate in pagina Contatti. */
export const COMPANY_SEATS: readonly CompanySeat[] = [
  {
    id: 'mantova',
    title: 'Sede Mantova',
    address: COMPANY_ADDRESS_MANTOVA,
    phoneDisplay: COMPANY_MOBILE_DISPLAY,
    telHref: COMPANY_MOBILE_TEL,
    whatsappHref: `https://wa.me/${COMPANY_WHATSAPP_E164}`,
  },
  {
    id: 'porto-mantovano',
    title: 'Sede Porto Mantovano',
    address: COMPANY_ADDRESS_PORTO,
    phoneDisplay: COMPANY_PORTO_MOBILE_DISPLAY,
    telHref: COMPANY_PORTO_MOBILE_TEL,
    whatsappHref: `https://wa.me/${COMPANY_PORTO_WHATSAPP_E164}`,
  },
]

export function companyWhatsappHref(prefillMessage: string): string {
  return `https://wa.me/${COMPANY_WHATSAPP_E164}?text=${encodeURIComponent(prefillMessage)}`
}

export function companyMailtoHref(subject: string, body?: string): string {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body?.trim()) params.set('body', body.trim())
  return `mailto:${COMPANY_EMAIL}?${params.toString()}`
}
