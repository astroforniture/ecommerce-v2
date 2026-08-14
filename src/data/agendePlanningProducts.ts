import type { OfficeProduct } from '../types/officeProduct'
import { AGENDE_CATEGORY } from '../lib/officeCategories'
import { AGENDE_SUBCATEGORY_PLANNING, applyAgendeImmediateAvailability, withAgendaCatalogYear } from '../lib/agendeCatalog'
import type { AgendaAlfaSizeSpec } from './agendeAlfaGiornaliereProducts'

export const AGENDA_PLAN_OFFICE_ID_PREFIX = 'AF-AGENDA-PLAN-'
export const AGENDA_PLAN_HUB_ID = 'AF-AGENDA-PLAN'

export const AGENDA_PLAN_COVER_IMAGE_URL =
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755AF-1024-1024-0.jpg'

export type AgendaPlanningFamily = 'alfa' | 'delta' | 'pp7755' | 'datato'

export type AgendaPlanningLineSpec = AgendaAlfaSizeSpec & {
  family: AgendaPlanningFamily
  brand: string
  imageUrl: string
  /** null = prodotto singolo senza colori. */
  colors: readonly string[] | null
  /** Titolo senza colore / senza suffisso colore. */
  titleBase: string
}

export const AGENDA_PLAN_ALFA_COLORS = ['Blu', 'Nero', 'Turchese', 'Rosso'] as const
export const AGENDA_PLAN_DELTA_COLORS = ['Blu', 'Nero', 'Rosso'] as const
export const AGENDA_PLAN_PP7755_COLORS = ['Blu', 'Rosso', 'Arancio'] as const

export const AGENDA_PLAN_LINES: readonly AgendaPlanningLineSpec[] = [
  {
    family: 'alfa',
    key: '30x10-alfa',
    measureLabel: '30x10 cm',
    fullLabel: '30x10 cm Spiralato',
    sku: '7755AF',
    price: 5.2,
    brand: 'ALFA',
    imageUrl: 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755AF-1024-1024-0.jpg',
    colors: AGENDA_PLAN_ALFA_COLORS,
    titleBase: 'Planning Settimanale ALFA - 30x10 cm Spiralato',
  },
  {
    family: 'delta',
    key: '30x12-delta',
    measureLabel: '30x12 cm',
    fullLabel: '30x12 cm Spiralato',
    sku: '7755DE',
    price: 5.5,
    brand: 'DELTA',
    imageUrl: 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755DE-1024-1024-0.jpg',
    colors: AGENDA_PLAN_DELTA_COLORS,
    titleBase: 'Planning Settimanale DELTA - 30x12 cm Spiralato',
  },
  {
    family: 'pp7755',
    key: '30x10-pp',
    measureLabel: '30x10 cm',
    fullLabel: '30x10 cm Spiralato',
    sku: '7755PP',
    price: 7.9,
    brand: 'PP',
    imageUrl: 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755PP-1024-1024-0.jpg',
    colors: AGENDA_PLAN_PP7755_COLORS,
    titleBase: 'Planning Settimanale 7755PP - 30x10 cm Spiralato',
  },
  {
    family: 'datato',
    key: '24x34',
    measureLabel: '24x34 cm',
    fullLabel: '24x34 cm Spiralato Datato',
    sku: '7766PP',
    price: 13.9,
    brand: 'PP',
    imageUrl: 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7766PP-1024-1024-0.jpg',
    colors: null,
    titleBase: 'Planning Settimanale 24x34 cm Spiralato Datato',
  },
  {
    family: 'datato',
    key: '35x50',
    measureLabel: '35x50 cm',
    fullLabel: '35x50 cm Spiralato Datato',
    sku: '7768PP',
    price: 21.5,
    brand: 'PP',
    imageUrl: 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7768PP-1024-1024-0.jpg',
    colors: null,
    titleBase: 'Planning Settimanale 35x50 cm Spiralato Datato',
  },
] as const

export function agendaPlanColorSkuSlug(color: string): string {
  const c = color.trim().toLowerCase()
  if (c.includes('turchese')) return 'TURCHESE'
  if (c.includes('arancio') || c.includes('arancione')) return 'ARANCIO'
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

export function agendaPlanVariantSku(baseSku: string, color?: string | null): string {
  const base = String(baseSku).trim().toUpperCase()
  const col = (color ?? '').trim()
  if (!col) return base
  return `${base}-${agendaPlanColorSkuSlug(col)}`
}

export function agendaPlanProductIdForVariant(baseSku: string, color?: string | null): string {
  return `${AGENDA_PLAN_OFFICE_ID_PREFIX}${agendaPlanVariantSku(baseSku, color)}`
}

export function agendaPlanLineFromSku(sku: string | null | undefined): AgendaPlanningLineSpec | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  if (!upper) return null
  return (
    AGENDA_PLAN_LINES.find((line) => upper === line.sku || upper.startsWith(`${line.sku}-`)) ?? null
  )
}

export function agendaPlanColorFromSku(sku: string | null | undefined): string | null {
  const upper = String(sku ?? '').trim().toUpperCase()
  const line = agendaPlanLineFromSku(upper)
  if (!line?.colors) return null
  if (upper === line.sku) return line.colors[0]
  if (!upper.startsWith(`${line.sku}-`)) return null
  const colorPart = upper.slice(line.sku.length + 1)
  return line.colors.find((c) => agendaPlanColorSkuSlug(c) === colorPart) ?? null
}

export function agendaPlanDisplayName(line: AgendaPlanningLineSpec, color?: string | null): string {
  if (!line.colors) return withAgendaCatalogYear(line.titleBase)
  const col = (color ?? '').trim() || line.colors[0]
  return withAgendaCatalogYear(`${line.titleBase} - ${col}`)
}

export function isAgendaPlanningProduct(
  product: Pick<OfficeProduct, 'id' | 'name' | 'brand' | 'producerCode' | 'subcategory'> | null | undefined,
): boolean {
  if (!product) return false
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id === AGENDA_PLAN_HUB_ID || id.startsWith(AGENDA_PLAN_OFFICE_ID_PREFIX)) return true
  if (agendaPlanLineFromSku(product.producerCode)) {
    const n = String(product.name ?? '').toLowerCase()
    if (n.includes('planning')) return true
  }
  const n = String(product.name ?? '').toLowerCase()
  const sub = String(product.subcategory ?? '').toLowerCase()
  return n.includes('planning') && (sub.includes('planning') || n.includes('spiralat'))
}

export function isAgendaPlanningOfficeProductId(id: string | null | undefined): boolean {
  const k = String(id ?? '').trim().toUpperCase()
  return k === AGENDA_PLAN_HUB_ID || k.startsWith(AGENDA_PLAN_OFFICE_ID_PREFIX)
}

export function agendaPlanLineFromProduct(
  product: Pick<OfficeProduct, 'producerCode' | 'name'> & { id?: string | null } | null | undefined,
): AgendaPlanningLineSpec | null {
  if (!product) return null
  const fromSku = agendaPlanLineFromSku(product.producerCode)
  if (fromSku) return fromSku
  const id = String(product.id ?? '').trim().toUpperCase()
  if (id.startsWith(AGENDA_PLAN_OFFICE_ID_PREFIX)) {
    const rest = id.slice(AGENDA_PLAN_OFFICE_ID_PREFIX.length)
    const fromId = agendaPlanLineFromSku(rest)
    if (fromId) return fromId
  }
  const n = String(product.name ?? '').toLowerCase()
  return (
    AGENDA_PLAN_LINES.find(
      (line) =>
        n.includes(line.measureLabel.toLowerCase()) ||
        n.includes(line.fullLabel.toLowerCase()) ||
        n.includes(line.sku.toLowerCase()) ||
        (line.brand === 'ALFA' && n.includes('alfa')) ||
        (line.brand === 'DELTA' && n.includes('delta') && n.includes('30x12')),
    ) ?? null
  )
}

export function agendaPlanColorFromProduct(
  product: Pick<OfficeProduct, 'colorName' | 'producerCode' | 'name'> | null | undefined,
): string | null {
  if (!product) return null
  const line = agendaPlanLineFromSku(product.producerCode) ?? agendaPlanLineFromProduct(product)
  if (!line?.colors) return null
  const fromColor = (product.colorName ?? '').trim()
  if (line.colors.includes(fromColor)) return fromColor
  const fromSku = agendaPlanColorFromSku(product.producerCode)
  if (fromSku) return fromSku
  const n = String(product.name ?? '').toLowerCase()
  return line.colors.find((c) => n.includes(c.toLowerCase())) ?? line.colors[0]
}

export function agendaPlanColorsForLine(line: AgendaPlanningLineSpec): readonly string[] {
  return line.colors ?? []
}

export function agendaPlanDatatoLines(): AgendaPlanningLineSpec[] {
  return AGENDA_PLAN_LINES.filter((l) => l.family === 'datato')
}

export function buildAgendaPlanningOfficeProduct(
  line: AgendaPlanningLineSpec,
  color?: string | null,
): OfficeProduct {
  const resolvedColor =
    line.colors != null ? (color?.trim() || line.colors[0]) : null
  const variantSku = agendaPlanVariantSku(line.sku, resolvedColor)
  return applyAgendeImmediateAvailability({
    id: agendaPlanProductIdForVariant(line.sku, resolvedColor),
    name: agendaPlanDisplayName(line, resolvedColor),
    brand: line.brand,
    producerCode: variantSku,
    category: AGENDE_CATEGORY,
    subcategory: AGENDE_SUBCATEGORY_PLANNING,
    colorName: resolvedColor ?? undefined,
    format: line.fullLabel,
    mainFeatures: {
      Tipologia: 'Planning settimanale',
      Misura: line.fullLabel,
      ...(resolvedColor ? { Colore: resolvedColor } : {}),
      Marca: line.brand,
      Codice: variantSku,
      'Codice misura': line.sku,
    },
    imageUrl: line.imageUrl,
    description:
      'Planning settimanale spiralato, ideale per scrivania e ufficio. Seleziona misura e colore disponibili: codice articolo e prezzo si aggiornano in scheda.',
    price: line.price,
  })
}

/** 12 schede = 4+3+3 colori + 2 singoli datati. */
export function buildAgendaPlanningOfficeProducts(): OfficeProduct[] {
  const out: OfficeProduct[] = []
  for (const line of AGENDA_PLAN_LINES) {
    if (!line.colors) {
      out.push(buildAgendaPlanningOfficeProduct(line))
      continue
    }
    for (const color of line.colors) {
      out.push(buildAgendaPlanningOfficeProduct(line, color))
    }
  }
  return out
}

export function resolveAgendaPlanningProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim()
  if (!k) return null
  const upper = k.toUpperCase()
  if (upper === AGENDA_PLAN_HUB_ID) {
    return buildAgendaPlanningOfficeProduct(AGENDA_PLAN_LINES[0], AGENDA_PLAN_ALFA_COLORS[0])
  }

  let rest = upper
  if (upper.startsWith(AGENDA_PLAN_OFFICE_ID_PREFIX)) {
    rest = upper.slice(AGENDA_PLAN_OFFICE_ID_PREFIX.length)
  }

  const line = agendaPlanLineFromSku(rest)
  if (!line) return null
  const color = agendaPlanColorFromSku(rest)
  return buildAgendaPlanningOfficeProduct(line, color)
}
