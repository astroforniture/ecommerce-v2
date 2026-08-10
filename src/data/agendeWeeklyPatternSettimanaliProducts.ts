import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_SETTIMANALI } from '../lib/agendeCatalog'
import type { AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'

export const AGENDA_WP_SETT_OFFICE_ID_PREFIX = 'AF-AGENDA-WP-SETT-'
export const AGENDA_WP_SETT_HUB_ID = 'AF-AGENDA-WP-SETT'

export const AGENDA_WP_SETT_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7357PT-1024-1024-0.jpg'

export const AGENDA_WP_SETT_GALLERY_URLS = [
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7357PT_3-1024-1024-0.jpg',
] as const

export const AGENDA_WP_SETT_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '15x21',
    measureLabel: '15x21 cm',
    fullLabel: '15x21 cm',
    sku: '7350PT',
    price: 14.9,
  },
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7357PT',
    price: 16.9,
  },
  {
    key: '21x26',
    measureLabel: '21x26 cm',
    fullLabel: '21x26 cm',
    sku: '7358PT',
    price: 18.9,
  },
  {
    key: '21x30',
    measureLabel: '21x30 cm A4',
    fullLabel: '21x30 cm A4',
    sku: '7360PT',
    price: 19.9,
  },
] as const

export const AGENDA_WP_SETT_COLORS = ['Nero', 'Blu'] as const

export type AgendaWpSettColor = (typeof AGENDA_WP_SETT_COLORS)[number]

export function agendaWpSettColorSkuSlug(color: string): string {
  const c = color.trim().toLowerCase()
  if (c.includes('nero')) return 'NERO'
  if (c.includes('blu')) return 'BLU'
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function agendaWpSettVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaWpSettColorSkuSlug(color)}`
}

export function agendaWpSettProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_WP_SETT_OFFICE_ID_PREFIX}${agendaWpSettVariantSku(sizeSku, color)}`
}

export function agendaWpSettBaseSizeSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  const hit = AGENDA_WP_SETT_SIZES.find((s) => upper === s.sku || upper.startsWith(`${s.sku}-`))
  return hit?.sku ?? null
}

export function agendaWpSettImageUrlForSku(_sku?: string): string {
  return AGENDA_WP_SETT_IMAGE_URL
}

export function isAgendaWpSettimanaleProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id === AGENDA_WP_SETT_HUB_ID || id.startsWith(AGENDA_WP_SETT_OFFICE_ID_PREFIX)) return true
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (agendaWpSettBaseSizeSku(sku)) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('weekly') || n.includes('pattern') || b.includes('weekly') || b.includes('pattern')) {
      return true
    }
  }
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('agenda') && n.includes('settimanale') && n.includes('weekly') && n.includes('pattern')
}

export function isAgendaWpSettOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  return k === AGENDA_WP_SETT_HUB_ID || k.startsWith(AGENDA_WP_SETT_OFFICE_ID_PREFIX)
}

export function agendaWpSettSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const base = agendaWpSettBaseSizeSku(sku)
  if (!base) return null
  return AGENDA_WP_SETT_SIZES.find((s) => s.sku === base) ?? null
}

export function agendaWpSettColorFromSku(sku: string | null | undefined): AgendaWpSettColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaWpSettSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_WP_SETT_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return AGENDA_WP_SETT_COLORS.find((c) => agendaWpSettColorSkuSlug(c) === colorPart) ?? null
}

export function agendaWpSettColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaWpSettColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_WP_SETT_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaWpSettColor
  }
  const fromSku = agendaWpSettColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  return AGENDA_WP_SETT_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
}

export function agendaWpSettSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaWpSettSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_WP_SETT_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_WP_SETT_OFFICE_ID_PREFIX.length)
    const fromId = agendaWpSettSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_WP_SETT_SIZES.find(
      (s) =>
        n.includes(s.measureLabel.toLowerCase()) ||
        n.includes(s.fullLabel.toLowerCase()) ||
        n.includes(s.key.toLowerCase()),
    ) ?? null
  )
}

export function agendaWpSettDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_WP_SETT_COLORS[0]
  return `Agenda Settimanale WEEKLY PATTERN - ${size.fullLabel} - ${col}`
}

export function buildAgendaWpSettOfficeProduct(
  size: AgendaAlfaSizeSpec,
  color: AgendaWpSettColor = AGENDA_WP_SETT_COLORS[0],
): OfficeProduct {
  const variantSku = agendaWpSettVariantSku(size.sku, color)
  return {
    id: agendaWpSettProductIdForVariant(size.sku, color),
    name: agendaWpSettDisplayName(size, color),
    brand: 'WEEKLY PATTERN',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_SETTIMANALI,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda settimanale',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'WEEKLY PATTERN',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: AGENDA_WP_SETT_IMAGE_URL,
    imageGalleryUrls: [...AGENDA_WP_SETT_GALLERY_URLS],
    description:
      'Agenda settimanale WEEKLY PATTERN a blocco fisso, ideale per ufficio e studio. Seleziona misura e colore della copertina: codice articolo e prezzo si aggiornano in base al formato scelto.',
    price: size.price,
  }
}

/** 8 schede = 4 misure × 2 colori — listing Agende Settimanali. */
export function buildAgendaWpSettimanaliOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const size of AGENDA_WP_SETT_SIZES) {
    for (const color of AGENDA_WP_SETT_COLORS) {
      out.push(buildAgendaWpSettOfficeProduct(size, color))
    }
  }
  return out
}

export function resolveAgendaWpSettProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_WP_SETT_HUB_ID) {
    return buildAgendaWpSettOfficeProduct(AGENDA_WP_SETT_SIZES[0], AGENDA_WP_SETT_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_WP_SETT_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_WP_SETT_OFFICE_ID_PREFIX.length)
  }

  const size = agendaWpSettSizeFromSku(rest)
  if (!size) return null
  const color = agendaWpSettColorFromSku(rest) ?? AGENDA_WP_SETT_COLORS[0]
  return buildAgendaWpSettOfficeProduct(size, color)
}
