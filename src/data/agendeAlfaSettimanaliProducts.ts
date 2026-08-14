import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_SETTIMANALI, applyAgendeImmediateAvailability, withAgendaCatalogYear } from '../lib/agendeCatalog'
import type { AgendaAlfaColor, AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'
import { AGENDA_ALFA_COLORS } from './agendeAlfaGiornaliereProducts'

export const AGENDA_ALFA_SETT_OFFICE_ID_PREFIX = 'AF-AGENDA-ALFA-SETT-'
export const AGENDA_ALFA_SETT_HUB_ID = 'AF-AGENDA-ALFA-SETT'

/** Immagine serie + cover sottocategoria Agende Settimanali. */
export const AGENDA_ALFA_SETT_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7157AF-1024-1024-0.jpg'

export const AGENDA_ALFA_SETT_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7157AF',
    price: 5.9,
  },
] as const

/** Slug colore SKU settimanali (Verde Lime → LIME come da listino). */
const AGENDA_ALFA_SETT_COLOR_SKU_SLUG: Record<AgendaAlfaColor, string> = {
  Nero: 'NERO',
  Blu: 'BLU',
  'Verde Lime': 'LIME',
  Rosso: 'ROSSO',
  Azzurro: 'AZZURRO',
}

export function agendaAlfaSettColorSkuSlug(color: string): string {
  const exact = (AGENDA_ALFA_COLORS as readonly string[]).includes(color)
    ? AGENDA_ALFA_SETT_COLOR_SKU_SLUG[color as AgendaAlfaColor]
    : undefined
  if (exact) return exact
  const c = color.trim().toLowerCase()
  if (c.includes('verde') || c.includes('lime')) return 'LIME'
  if (c.includes('azzurro')) return 'AZZURRO'
  if (c.includes('nero')) return 'NERO'
  if (c.includes('blu')) return 'BLU'
  if (c.includes('rosso')) return 'ROSSO'
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function agendaAlfaSettVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaAlfaSettColorSkuSlug(color)}`
}

export function agendaAlfaSettProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_ALFA_SETT_OFFICE_ID_PREFIX}${agendaAlfaSettVariantSku(sizeSku, color)}`
}

export function agendaAlfaSettImageUrlForSku(sku: string): string {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (upper.includes('7157AF') || !upper) return AGENDA_ALFA_SETT_IMAGE_URL
  return AGENDA_ALFA_SETT_IMAGE_URL
}

export function isAgendaAlfaSettimanaleProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id === AGENDA_ALFA_SETT_HUB_ID || id.startsWith(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX)) return true
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (sku === '7157AF' || sku.startsWith('7157AF-')) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('alfa') || b.includes('alfa')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('agenda') && n.includes('settimanale') && n.includes('alfa')
}

export function isAgendaAlfaSettOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  return k === AGENDA_ALFA_SETT_HUB_ID || k.startsWith(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX)
}

export function agendaAlfaSettSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  if (upper === '7157AF' || upper.startsWith('7157AF-')) return AGENDA_ALFA_SETT_SIZES[0]
  return null
}

export function agendaAlfaSettColorFromSku(sku: string | null | undefined): AgendaAlfaColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaAlfaSettSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_ALFA_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return (
    AGENDA_ALFA_COLORS.find((c) => agendaAlfaSettColorSkuSlug(c) === colorPart) ?? null
  )
}

export function agendaAlfaSettColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaAlfaColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_ALFA_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaAlfaColor
  }
  const fromSku = agendaAlfaSettColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  return AGENDA_ALFA_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
}

export function agendaAlfaSettSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaAlfaSettSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX.length)
    const fromId = agendaAlfaSettSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  if (n.includes('17x24') || n.includes('settimanale')) return AGENDA_ALFA_SETT_SIZES[0]
  return null
}

export function agendaAlfaSettDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_ALFA_COLORS[0]
  return withAgendaCatalogYear(`Agenda Settimanale ALFA - ${size.fullLabel} - ${col}`)
}

export function buildAgendaAlfaSettOfficeProduct(
  size: AgendaAlfaSizeSpec = AGENDA_ALFA_SETT_SIZES[0],
  color: AgendaAlfaColor = AGENDA_ALFA_COLORS[0],
): OfficeProduct {
  const variantSku = agendaAlfaSettVariantSku(size.sku, color)
  return applyAgendeImmediateAvailability({
    id: agendaAlfaSettProductIdForVariant(size.sku, color),
    name: agendaAlfaSettDisplayName(size, color),
    brand: 'ALFA',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_SETTIMANALI,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda settimanale',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'ALFA',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: AGENDA_ALFA_SETT_IMAGE_URL,
    description:
      'Agenda settimanale ALFA a blocco fisso, formato 17x24 cm. Ideale per ufficio e studio: seleziona il colore della copertina; codice articolo e prezzo si aggiornano in scheda.',
    price: size.price,
  })
}

/** 5 schede colore — listing Agende Settimanali. */
export function buildAgendaAlfaSettimanaliOfficeProducts(): OfficeProduct[] {
  return AGENDA_ALFA_COLORS.map((color) =>
    buildAgendaAlfaSettOfficeProduct(AGENDA_ALFA_SETT_SIZES[0], color),
  )
}

export function resolveAgendaAlfaSettProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_ALFA_SETT_HUB_ID) {
    return buildAgendaAlfaSettOfficeProduct(AGENDA_ALFA_SETT_SIZES[0], AGENDA_ALFA_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_ALFA_SETT_OFFICE_ID_PREFIX.length)
  }

  const size = agendaAlfaSettSizeFromSku(rest)
  if (!size) return null
  const color = agendaAlfaSettColorFromSku(rest) ?? AGENDA_ALFA_COLORS[0]
  return buildAgendaAlfaSettOfficeProduct(size, color)
}
