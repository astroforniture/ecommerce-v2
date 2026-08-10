import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_GIORNALIERE } from '../lib/agendeCatalog'
import type { AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'

export const AGENDA_TEXT_OFFICE_ID_PREFIX = 'AF-AGENDA-TEXT-'
export const AGENDA_TEXT_HUB_ID = 'AF-AGENDA-TEXT'

/** Cover / fallback (15x21 A5). */
export const AGENDA_TEXT_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7137TX-1024-1024-0.jpg'

export const AGENDA_TEXT_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '15x21',
    measureLabel: '15x21 cm A5',
    fullLabel: '15x21 cm A5',
    sku: '7137TX',
    price: 9.9,
  },
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7141TX',
    price: 14.9,
  },
  {
    key: '21x30',
    measureLabel: '21x30 cm A4',
    fullLabel: '21x30 cm A4',
    sku: '7145TX',
    price: 19.9,
  },
] as const

export const AGENDA_TEXT_COLORS = ['Blu', 'Rosso', 'Turchese', 'Beige'] as const

export type AgendaTextColor = (typeof AGENDA_TEXT_COLORS)[number]

const AGENDA_TEXT_COLOR_SKU_SLUG: Record<AgendaTextColor, string> = {
  Blu: 'BLU',
  Rosso: 'ROSSO',
  Turchese: 'TURCHESE',
  Beige: 'BEIGE',
}

export function agendaTextColorSkuSlug(color: string): string {
  const exact = (AGENDA_TEXT_COLORS as readonly string[]).includes(color)
    ? AGENDA_TEXT_COLOR_SKU_SLUG[color as AgendaTextColor]
    : undefined
  if (exact) return exact
  const c = color.trim().toLowerCase()
  if (c.includes('turchese')) return 'TURCHESE'
  if (c.includes('beige')) return 'BEIGE'
  if (c.includes('rosso')) return 'ROSSO'
  if (c.includes('blu')) return 'BLU'
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function agendaTextVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaTextColorSkuSlug(color)}`
}

export function agendaTextProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_TEXT_OFFICE_ID_PREFIX}${agendaTextVariantSku(sizeSku, color)}`
}

export function agendaTextBaseSizeSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  const hit = AGENDA_TEXT_SIZES.find((s) => upper === s.sku || upper.startsWith(`${s.sku}-`))
  return hit?.sku ?? null
}

export function agendaTextImageUrlForSku(sku: string): string {
  const base = agendaTextBaseSizeSku(sku) ?? String(sku ?? '').trim().toUpperCase().split('-')[0]
  if (!base) return AGENDA_TEXT_IMAGE_URL
  return `https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A${base}-1024-1024-0.jpg`
}

export function isAgendaTextGiornalieraProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id === AGENDA_TEXT_HUB_ID || id.startsWith(AGENDA_TEXT_OFFICE_ID_PREFIX)) return true
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (agendaTextBaseSizeSku(sku)) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('text') || b.includes('text')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('agenda') && n.includes('giornaliera') && n.includes('text')
}

export function isAgendaTextOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  return k === AGENDA_TEXT_HUB_ID || k.startsWith(AGENDA_TEXT_OFFICE_ID_PREFIX)
}

export function agendaTextSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const base = agendaTextBaseSizeSku(sku)
  if (!base) return null
  return AGENDA_TEXT_SIZES.find((s) => s.sku === base) ?? null
}

export function agendaTextColorFromSku(sku: string | null | undefined): AgendaTextColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaTextSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_TEXT_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return AGENDA_TEXT_COLORS.find((c) => agendaTextColorSkuSlug(c) === colorPart) ?? null
}

export function agendaTextColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaTextColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_TEXT_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaTextColor
  }
  const fromSku = agendaTextColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  return AGENDA_TEXT_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
}

export function agendaTextSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaTextSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_TEXT_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_TEXT_OFFICE_ID_PREFIX.length)
    const fromId = agendaTextSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_TEXT_SIZES.find(
      (s) =>
        n.includes(s.measureLabel.toLowerCase()) ||
        n.includes(s.fullLabel.toLowerCase()) ||
        n.includes(s.key.toLowerCase()),
    ) ?? null
  )
}

export function agendaTextDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_TEXT_COLORS[0]
  return `Agenda Giornaliera TEXT - ${size.fullLabel} - Sabato/Domenica Separati - ${col}`
}

export function buildAgendaTextOfficeProduct(
  size: AgendaAlfaSizeSpec,
  color: AgendaTextColor = AGENDA_TEXT_COLORS[0],
): OfficeProduct {
  const variantSku = agendaTextVariantSku(size.sku, color)
  return {
    id: agendaTextProductIdForVariant(size.sku, color),
    name: agendaTextDisplayName(size, color),
    brand: 'TEXT',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_GIORNALIERE,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda giornaliera',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'TEXT',
      Layout: 'Sabato/Domenica Separati',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: agendaTextImageUrlForSku(size.sku),
    description:
      'Agenda giornaliera TEXT a blocco fisso, con sabato e domenica separati. Ideale per ufficio e studio: seleziona misura e colore della copertina; codice articolo e prezzo si aggiornano in base al formato scelto.',
    price: size.price,
  }
}

/** 12 schede = 3 misure × 4 colori — listing Agende Giornaliere. */
export function buildAgendaTextGiornaliereOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const size of AGENDA_TEXT_SIZES) {
    for (const color of AGENDA_TEXT_COLORS) {
      out.push(buildAgendaTextOfficeProduct(size, color))
    }
  }
  return out
}

export function resolveAgendaTextProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_TEXT_HUB_ID) {
    return buildAgendaTextOfficeProduct(AGENDA_TEXT_SIZES[0], AGENDA_TEXT_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_TEXT_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_TEXT_OFFICE_ID_PREFIX.length)
  }

  const size = agendaTextSizeFromSku(rest)
  if (!size) return null
  const color = agendaTextColorFromSku(rest) ?? AGENDA_TEXT_COLORS[0]
  return buildAgendaTextOfficeProduct(size, color)
}
