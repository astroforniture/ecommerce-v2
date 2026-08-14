import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_GIORNALIERE, withAgendaCatalogYear } from '../lib/agendeCatalog'
import type { AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'

export const AGENDA_DELTA_OFFICE_ID_PREFIX = 'AF-AGENDA-DELTA-'
export const AGENDA_DELTA_HUB_ID = 'AF-AGENDA-DELTA'

/** Cover / fallback (15x21 A5). */
export const AGENDA_DELTA_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7137DE-1024-1024-0.jpg'

export const AGENDA_DELTA_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '15x21',
    measureLabel: '15x21 cm A5',
    fullLabel: '15x21 cm A5',
    sku: '7137DE',
    price: 7.9,
  },
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7141DE',
    price: 9.9,
  },
  {
    key: '21x30',
    measureLabel: '21x30 cm A4',
    fullLabel: '21x30 cm A4',
    sku: '7145DE',
    price: 14.9,
  },
] as const

export const AGENDA_DELTA_COLORS = ['Nero', 'Blu', 'Verde', 'Rosso Bordeaux'] as const

export type AgendaDeltaColor = (typeof AGENDA_DELTA_COLORS)[number]

/** Slug colore SKU (Rosso Bordeaux → BORDEAUX). */
const AGENDA_DELTA_COLOR_SKU_SLUG: Record<AgendaDeltaColor, string> = {
  Nero: 'NERO',
  Blu: 'BLU',
  Verde: 'VERDE',
  'Rosso Bordeaux': 'BORDEAUX',
}

export function agendaDeltaColorSkuSlug(color: string): string {
  const exact = (AGENDA_DELTA_COLORS as readonly string[]).includes(color)
    ? AGENDA_DELTA_COLOR_SKU_SLUG[color as AgendaDeltaColor]
    : undefined
  if (exact) return exact
  const c = color.trim().toLowerCase()
  if (c.includes('bordeaux')) return 'BORDEAUX'
  if (c.includes('verde')) return 'VERDE'
  if (c.includes('nero')) return 'NERO'
  if (c.includes('blu')) return 'BLU'
  if (c.includes('rosso')) return 'BORDEAUX'
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function agendaDeltaVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaDeltaColorSkuSlug(color)}`
}

export function agendaDeltaProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_DELTA_OFFICE_ID_PREFIX}${agendaDeltaVariantSku(sizeSku, color)}`
}

export function agendaDeltaBaseSizeSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  const hit = AGENDA_DELTA_SIZES.find((s) => upper === s.sku || upper.startsWith(`${s.sku}-`))
  return hit?.sku ?? null
}

export function agendaDeltaImageUrlForSku(sku: string): string {
  const base = agendaDeltaBaseSizeSku(sku) ?? String(sku ?? '').trim().toUpperCase().split('-')[0]
  if (!base) return AGENDA_DELTA_IMAGE_URL
  return `https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A${base}-1024-1024-0.jpg`
}

export function isAgendaDeltaGiornalieraProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  // Prefisso settimanali distinto — non trattare come giornaliere.
  if (id.startsWith('AF-AGENDA-DELTA-SETT')) return false
  if (id === AGENDA_DELTA_HUB_ID || id.startsWith(AGENDA_DELTA_OFFICE_ID_PREFIX)) return true
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (sku.startsWith('7157DE') || sku.startsWith('7158DE')) return false
  if (agendaDeltaBaseSizeSku(sku)) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('settimanale')) return false
    if (n.includes('delta') || b.includes('delta')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  if (n.includes('settimanale')) return false
  return n.includes('agenda') && n.includes('giornaliera') && n.includes('delta')
}

export function isAgendaDeltaOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  if (k.startsWith('AF-AGENDA-DELTA-SETT')) return false
  return k === AGENDA_DELTA_HUB_ID || k.startsWith(AGENDA_DELTA_OFFICE_ID_PREFIX)
}

export function agendaDeltaSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const base = agendaDeltaBaseSizeSku(sku)
  if (!base) return null
  return AGENDA_DELTA_SIZES.find((s) => s.sku === base) ?? null
}

export function agendaDeltaColorFromSku(sku: string | null | undefined): AgendaDeltaColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaDeltaSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_DELTA_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return AGENDA_DELTA_COLORS.find((c) => agendaDeltaColorSkuSlug(c) === colorPart) ?? null
}

export function agendaDeltaColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaDeltaColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_DELTA_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaDeltaColor
  }
  const fromSku = agendaDeltaColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  if (n.includes('bordeaux')) return 'Rosso Bordeaux'
  return AGENDA_DELTA_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
}

export function agendaDeltaSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaDeltaSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_DELTA_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_DELTA_OFFICE_ID_PREFIX.length)
    const fromId = agendaDeltaSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_DELTA_SIZES.find(
      (s) =>
        n.includes(s.measureLabel.toLowerCase()) ||
        n.includes(s.fullLabel.toLowerCase()) ||
        n.includes(s.key.toLowerCase()),
    ) ?? null
  )
}

export function agendaDeltaDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_DELTA_COLORS[0]
  return withAgendaCatalogYear(
    `Agenda Giornaliera DELTA - ${size.fullLabel} - Sabato/Domenica Separati - ${col}`,
  )
}

export function buildAgendaDeltaOfficeProduct(
  size: AgendaAlfaSizeSpec,
  color: AgendaDeltaColor = AGENDA_DELTA_COLORS[0],
): OfficeProduct {
  const variantSku = agendaDeltaVariantSku(size.sku, color)
  return {
    id: agendaDeltaProductIdForVariant(size.sku, color),
    name: agendaDeltaDisplayName(size, color),
    brand: 'DELTA',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_GIORNALIERE,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda giornaliera',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'DELTA',
      Layout: 'Sabato/Domenica Separati',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: agendaDeltaImageUrlForSku(size.sku),
    description:
      'Agenda giornaliera DELTA a blocco fisso, con sabato e domenica separati. Ideale per ufficio e studio: seleziona misura e colore della copertina; codice articolo e prezzo si aggiornano in base al formato scelto.',
    price: size.price,
  }
}

/** 12 schede = 3 misure × 4 colori — listing Agende Giornaliere. */
export function buildAgendaDeltaGiornaliereOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const size of AGENDA_DELTA_SIZES) {
    for (const color of AGENDA_DELTA_COLORS) {
      out.push(buildAgendaDeltaOfficeProduct(size, color))
    }
  }
  return out
}

export function resolveAgendaDeltaProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_DELTA_HUB_ID) {
    return buildAgendaDeltaOfficeProduct(AGENDA_DELTA_SIZES[0], AGENDA_DELTA_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_DELTA_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_DELTA_OFFICE_ID_PREFIX.length)
  }

  const size = agendaDeltaSizeFromSku(rest)
  if (!size) return null
  const color = agendaDeltaColorFromSku(rest) ?? AGENDA_DELTA_COLORS[0]
  return buildAgendaDeltaOfficeProduct(size, color)
}
