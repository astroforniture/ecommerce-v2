import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_GIORNALIERE } from '../lib/agendeCatalog'

export const AGENDA_ALFA_OFFICE_ID_PREFIX = 'AF-AGENDA-ALFA-'
export const AGENDA_ALFA_HUB_ID = 'AF-AGENDA-ALFA'

/** Cover sottocategoria + fallback (15x21 A5). */
export const AGENDA_ALFA_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg'

export type AgendaAlfaSizeSpec = {
  key: string
  /** Etichetta selettore Misura (compatta). */
  measureLabel: string
  /** Etichetta completa in titolo / carrello. */
  fullLabel: string
  /** Codice misura base (es. 7123AF). */
  sku: string
  price: number
}

export const AGENDA_ALFA_SIZES: readonly AgendaAlfaSizeSpec[] = [
  {
    key: '9x13',
    measureLabel: '9x13 cm',
    fullLabel: '9x13 cm',
    sku: '7123AF',
    price: 4.6,
  },
  {
    key: '12x17',
    measureLabel: '12x17 cm',
    fullLabel: '12x17 cm',
    sku: '7142AF',
    price: 5.2,
  },
  {
    key: '15x21',
    measureLabel: '15x21 cm A5',
    fullLabel: '15x21 cm A5',
    sku: '7136AF',
    price: 5.2,
  },
  {
    key: '17x24',
    measureLabel: '17x24 cm',
    fullLabel: '17x24 cm',
    sku: '7141AF',
    price: 8.6,
  },
  {
    key: '21x30',
    measureLabel: '21x30 cm A4',
    fullLabel: '21x30 cm A4 - Sabato/Domenica Separati',
    sku: '7145AF',
    price: 14.7,
  },
] as const

export const AGENDA_ALFA_COLORS = [
  'Nero',
  'Blu',
  'Verde Lime',
  'Rosso',
  'Azzurro',
] as const

export type AgendaAlfaColor = (typeof AGENDA_ALFA_COLORS)[number]

/** Slug colore per SKU univoco (es. Verde Lime → VERDE-LIME). */
export function agendaAlfaColorSkuSlug(color: string): string {
  return color
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

/** SKU variante: `7123AF-NERO`, `7136AF-VERDE-LIME`, … */
export function agendaAlfaVariantSku(sizeSku: string, color: string): string {
  return `${String(sizeSku).trim().toUpperCase()}-${agendaAlfaColorSkuSlug(color)}`
}

export function agendaAlfaProductIdForVariant(sizeSku: string, color: string): string {
  return `${AGENDA_ALFA_OFFICE_ID_PREFIX}${agendaAlfaVariantSku(sizeSku, color)}`
}

/** @deprecated Preferire agendaAlfaProductIdForVariant */
export function agendaAlfaProductIdForSku(sku: string): string {
  return `${AGENDA_ALFA_OFFICE_ID_PREFIX}${sku.trim().toUpperCase()}`
}

/** Estrae il codice misura base da SKU variante o base. */
export function agendaAlfaBaseSizeSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  const hit = AGENDA_ALFA_SIZES.find((s) => upper === s.sku || upper.startsWith(`${s.sku}-`))
  return hit?.sku ?? null
}

/** Miniatura / hero Bocchio per codice misura (ignora suffisso colore). */
export function agendaAlfaImageUrlForSku(sku: string): string {
  const base = agendaAlfaBaseSizeSku(sku) ?? String(sku ?? '').trim().toUpperCase().split('-')[0]
  if (!base) return AGENDA_ALFA_IMAGE_URL
  return `https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A${base}-1024-1024-0.jpg`
}

export function isAgendaAlfaGiornalieraProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  // Prefisso settimanali distinto — non trattare come giornaliere.
  if (id.startsWith('AF-AGENDA-ALFA-SETT')) return false
  if (id === AGENDA_ALFA_HUB_ID || id.startsWith(AGENDA_ALFA_OFFICE_ID_PREFIX)) return true
  const sku = String(product.producerCode ?? '').trim().toUpperCase()
  if (sku.startsWith('7157AF')) return false
  if (agendaAlfaBaseSizeSku(sku)) {
    const n = String(product.name ?? '').toLowerCase()
    const b = String(product.brand ?? '').toLowerCase()
    if (n.includes('settimanale')) return false
    if (n.includes('alfa') || b.includes('alfa')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  if (n.includes('settimanale') || n.includes('delta')) return false
  return n.includes('agenda') && n.includes('giornaliera') && n.includes('alfa')
}

export function isAgendaAlfaOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  if (k.startsWith('AF-AGENDA-ALFA-SETT')) return false
  return k === AGENDA_ALFA_HUB_ID || k.startsWith(AGENDA_ALFA_OFFICE_ID_PREFIX)
}

export function agendaAlfaSizeFromSku(sku: string | null | undefined): AgendaAlfaSizeSpec | null {
  const base = agendaAlfaBaseSizeSku(sku)
  if (!base) return null
  return AGENDA_ALFA_SIZES.find((s) => s.sku === base) ?? null
}

export function agendaAlfaColorFromSku(sku: string | null | undefined): AgendaAlfaColor | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const size = agendaAlfaSizeFromSku(upper)
  if (!size) return null
  if (upper === size.sku) return AGENDA_ALFA_COLORS[0]
  if (!upper.startsWith(`${size.sku}-`)) return null
  const colorPart = upper.slice(size.sku.length + 1)
  return AGENDA_ALFA_COLORS.find((c) => agendaAlfaColorSkuSlug(c) === colorPart) ?? null
}

export function agendaAlfaColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): AgendaAlfaColor | null {
  if (!product) return null
  const fromColor = (product.colorName ?? '').trim()
  if ((AGENDA_ALFA_COLORS as readonly string[]).includes(fromColor)) {
    return fromColor as AgendaAlfaColor
  }
  const fromSku = agendaAlfaColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_ALFA_COLORS.find((c) => n.includes(c.toLowerCase())) ?? null
  )
}

export function agendaAlfaSizeFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name' | 'id'> | null | undefined,
): AgendaAlfaSizeSpec | null {
  if (!product) return null
  const fromSku = agendaAlfaSizeFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_ALFA_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_ALFA_OFFICE_ID_PREFIX.length)
    const fromId = agendaAlfaSizeFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_ALFA_SIZES.find(
      (s) =>
        n.includes(s.measureLabel.toLowerCase()) ||
        n.includes(s.fullLabel.toLowerCase()) ||
        n.includes(s.key.toLowerCase()),
    ) ?? null
  )
}

export function agendaAlfaDisplayName(size: AgendaAlfaSizeSpec, color: string): string {
  const col = color.trim() || AGENDA_ALFA_COLORS[0]
  return `Agenda Giornaliera ALFA - ${size.fullLabel} - ${col}`
}

export function buildAgendaAlfaOfficeProduct(
  size: AgendaAlfaSizeSpec,
  color: AgendaAlfaColor = AGENDA_ALFA_COLORS[0],
): OfficeProduct {
  const variantSku = agendaAlfaVariantSku(size.sku, color)
  return {
    id: agendaAlfaProductIdForVariant(size.sku, color),
    name: agendaAlfaDisplayName(size, color),
    brand: 'ALFA',
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_GIORNALIERE,
    colorName: color,
    format: size.fullLabel,
    mainFeatures: {
      Tipologia: 'Agenda giornaliera',
      Misura: size.fullLabel,
      Colore: color,
      Marca: 'ALFA',
      Codice: variantSku,
      'Codice misura': size.sku,
    },
    imageUrl: agendaAlfaImageUrlForSku(size.sku),
    description:
      'Agenda giornaliera ALFA a blocco fisso, ideale per ufficio e studio. Seleziona misura e colore della copertina: codice articolo e prezzo si aggiornano in base al formato scelto.',
    price: size.price,
  }
}

/** 25 schede = 5 misure × 5 colori — listing Agende Giornaliere. */
export function buildAgendaAlfaGiornaliereOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const size of AGENDA_ALFA_SIZES) {
    for (const color of AGENDA_ALFA_COLORS) {
      out.push(buildAgendaAlfaOfficeProduct(size, color))
    }
  }
  return out
}

export function resolveAgendaAlfaProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_ALFA_HUB_ID) {
    return buildAgendaAlfaOfficeProduct(AGENDA_ALFA_SIZES[0], AGENDA_ALFA_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_ALFA_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_ALFA_OFFICE_ID_PREFIX.length)
  }

  const size = agendaAlfaSizeFromSku(rest)
  if (!size) return null
  const color = agendaAlfaColorFromSku(rest) ?? AGENDA_ALFA_COLORS[0]
  return buildAgendaAlfaOfficeProduct(size, color)
}

export function agendaAlfaSwatchFill(colorName: string): string {
  const c = colorName.toLowerCase()
  if (c.includes('nero')) return 'bg-slate-900'
  if (c.includes('verde') && c.includes('lime')) return 'bg-lime-500'
  if (c.includes('azzurro')) return 'bg-sky-400'
  if (c.includes('blu')) return 'bg-blue-700'
  if (c.includes('rosso')) return 'bg-red-600'
  return 'bg-slate-400'
}

export function agendaAlfaColorToneBorder(colorName: string): string {
  const c = colorName.toLowerCase()
  if (c.includes('nero')) return 'border-slate-800'
  if (c.includes('verde') && c.includes('lime')) return 'border-lime-500'
  if (c.includes('azzurro')) return 'border-sky-400'
  if (c.includes('blu')) return 'border-blue-700'
  if (c.includes('rosso')) return 'border-red-600'
  return 'border-slate-300'
}

export function agendaAlfaSelectedGlow(colorName: string): string {
  const c = colorName.toLowerCase()
  if (c.includes('nero')) return 'shadow-slate-500/70'
  if (c.includes('verde') && c.includes('lime')) return 'shadow-lime-400/70'
  if (c.includes('azzurro')) return 'shadow-sky-300/70'
  if (c.includes('blu')) return 'shadow-blue-400/70'
  if (c.includes('rosso')) return 'shadow-red-400/70'
  return 'shadow-slate-300/70'
}
