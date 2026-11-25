import { companyWhatsappHref } from './companyContacts'

export const PERSONALIZZATO_BASE = '/personalizzato' as const
export const PERSONALIZZATO_ROLLUP_SLUG = 'roll-up' as const
export const PERSONALIZZATO_ROLLUP_PATH = `${PERSONALIZZATO_BASE}/${PERSONALIZZATO_ROLLUP_SLUG}` as const

export const PERSONALIZZATO_CATEGORY_LABEL = 'Personalizzato'
export const PERSONALIZZATO_ROLLUP_LABEL = 'Roll-up'

/** Banner: official art missing — clearly labeled placeholder until artwork is supplied. */
export const PERSONALIZZATO_ROLLUP_BANNER_URL =
  '/images/personalizzato/roll-up-banner-placeholder.svg'
export const PERSONALIZZATO_ROLLUP_BANNER_ALT =
  'PLACEHOLDER — ASFORNITURE Espositori e Roll-Up Retroilluminati (immagine ufficiale non ancora caricata)'
export const PERSONALIZZATO_ROLLUP_BANNER_IS_PLACEHOLDER = true

export const PERSONALIZZATO_ROLLUP_DESCRIPTION =
  'Gli avvolgibili Roll-up sono uno strumento di comunicazione indispensabile e una soluzione comoda ed efficace da portare sempre con te in ogni occasione per promuovere il tuo messaggio.'

export const PERSONALIZZATO_ROLLUP_WHATSAPP_MESSAGE =
  'Ciao, vorrei ricevere un preventivo personalizzato per un Roll-up'

export const PERSONALIZZATO_ROLLUP_CTA_LABEL =
  'Richiedi un preventivo personalizzato su WhatsApp'

/** Display format requested for the Roll-up CTA (no space in the last block). */
export const PERSONALIZZATO_ROLLUP_WHATSAPP_DISPLAY = '375 6139937'

export const PERSONALIZZATO_ROLLUP_WHATSAPP_HREF = companyWhatsappHref(
  PERSONALIZZATO_ROLLUP_WHATSAPP_MESSAGE,
)

export const PERSONALIZZATO_NAV_ITEMS = [
  {
    label: PERSONALIZZATO_ROLLUP_LABEL,
    href: PERSONALIZZATO_ROLLUP_PATH,
  },
] as const

export function personalizzatoRollupPath(): string {
  return PERSONALIZZATO_ROLLUP_PATH
}

export function allPersonalizzatoStaticPaths(): string[] {
  return PERSONALIZZATO_NAV_ITEMS.map((i) => i.href)
}
