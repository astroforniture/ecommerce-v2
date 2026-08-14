import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_SETTIMANALI, withAgendaCatalogYear } from '../lib/agendeCatalog'
import type { AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'
import {
  AGENDA_DELTA_COLORS,
  agendaDeltaColorSkuSlug,
  type AgendaDeltaColor,
} from './agendeDeltaGiornaliereProducts'

export const AGENDA_DELTA_SETT_OFFICE_ID_PREFIX = 'AF-AGENDA-DELTA-SETT-'
export const AGENDA_DELTA_SETT_HUB_ID = 'AF-AGENDA-DELTA-SETT'

/** Immagine di riferimento serie (Bocchio). */
export const AGENDA_DELTA_SETT_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7137DE-1024-1024-0.jpg'

export const AGENDA_DELTA_SETT_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7157DE',
    price: 7,
  },
  {
    key: '21x26',
    measureLabel: '21x26 cm',
    fullLabel: '21x26 cm',
    sku: '7158DE',
    price: 8,
  },
] as const

export function agendaDeltaSettVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaDeltaColorSkuSlug(color)}`
}

export function agendaDeltaSettProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_DELTA_SETT_OFFICE_ID_PREFIX}${agendaDeltaSettVariantSku(sizeSku, color)}`
}

export function agendaDeltaSettBaseSizeSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  const hit = AGENDA_DELTA_SETT_SIZES.find((s) => upper === s.sku || upper.startsWith(`${s.sku}-`))
  return hit?.sku ?? null
}

export function agendaDeltaSettImageUrlForSku(_sku?: string): string {
  return AGENDA_DELTA_SETT_IMAGE_URL
}

export function isAgendaDeltaSettimanaleProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id === AGENDA_DELTA_SETT_HUB_ID || id.startsWith(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX)) {
    return true
  }
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (agendaDeltaSettBaseSizeSku(sku)) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('delta') || b.includes('delta')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  return n.includes('agenda') && n.includes('settimanale') && n.includes('delta')
}

export function isAgendaDeltaSettOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  return k === AGENDA_DELTA_SETT_HUB_ID || k.startsWith(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX)
}

export function agendaDeltaSettSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const base = agendaDeltaSettBaseSizeSku(sku)
  if (!base) return null
  return AGENDA_DELTA_SETT_SIZES.find((s) => s.sku === base) ?? null
}

export function agendaDeltaSettColorFromSku(sku: string | null | undefined): AgendaDeltaColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaDeltaSettSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_DELTA_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return AGENDA_DELTA_COLORS.find((c) => agendaDeltaColorSkuSlug(c) === colorPart) ?? null
}

export function agendaDeltaSettColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaDeltaColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_DELTA_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaDeltaColor
  }
  const fromSku = agendaDeltaSettColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  if (n.includes('bordeaux')) return 'Rosso Bordeaux'
  return AGENDA_DELTA_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
}

export function agendaDeltaSettSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaDeltaSettSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX.length)
    const fromId = agendaDeltaSettSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_DELTA_SETT_SIZES.find(
      (s) =>
        n.includes(s.measureLabel.toLowerCase()) ||
        n.includes(s.fullLabel.toLowerCase()) ||
        n.includes(s.key.toLowerCase()),
    ) ?? null
  )
}

export function agendaDeltaSettDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_DELTA_COLORS[0]
  return withAgendaCatalogYear(`Agenda Settimanale DELTA - ${size.fullLabel} - ${col}`)
}

export function buildAgendaDeltaSettOfficeProduct(
  size: AgendaAlfaSizeSpec,
  color: AgendaDeltaColor = AGENDA_DELTA_COLORS[0],
): OfficeProduct {
  const variantSku = agendaDeltaSettVariantSku(size.sku, color)
  return {
    id: agendaDeltaSettProductIdForVariant(size.sku, color),
    name: agendaDeltaSettDisplayName(size, color),
    brand: 'DELTA',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_SETTIMANALI,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda settimanale',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'DELTA',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: AGENDA_DELTA_SETT_IMAGE_URL,
    description:
      'Agenda settimanale DELTA a blocco fisso, ideale per ufficio e studio. Seleziona misura e colore della copertina: codice articolo e prezzo si aggiornano in base al formato scelto.',
    price: size.price,
  }
}

/** 8 schede = 2 misure × 4 colori — listing Agende Settimanali. */
export function buildAgendaDeltaSettimanaliOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const size of AGENDA_DELTA_SETT_SIZES) {
    for (const color of AGENDA_DELTA_COLORS) {
      out.push(buildAgendaDeltaSettOfficeProduct(size, color))
    }
  }
  return out
}

export function resolveAgendaDeltaSettProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_DELTA_SETT_HUB_ID) {
    return buildAgendaDeltaSettOfficeProduct(AGENDA_DELTA_SETT_SIZES[0], AGENDA_DELTA_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_DELTA_SETT_OFFICE_ID_PREFIX.length)
  }

  const size = agendaDeltaSettSizeFromSku(rest)
  if (!size) return null
  const color = agendaDeltaSettColorFromSku(rest) ?? AGENDA_DELTA_COLORS[0]
  return buildAgendaDeltaSettOfficeProduct(size, color)
}
