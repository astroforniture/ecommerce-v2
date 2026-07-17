import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import type { QuantityPriceTier } from '../types/officeProduct'

/** Righe come restituite da Supabase con select esplicito. */
type QuantityPriceRow = {
  product_id: string
  quantity_threshold?: number
  price_per_unit?: number | string
}

/** Allinea chiavi Map a `products.id` (uuid case-insensitive) e SKU testuali trimmati. */
export function normalizeQuantityPriceProductKey(id: string): string {
  const t = String(id ?? '').trim()
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) {
    return t.toLowerCase()
  }
  return t
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number.parseFloat(v.replace(',', '.'))
    return Number.isFinite(n) ? n : null
  }
  return null
}

function rowToTier(row: QuantityPriceRow): { productId: string; tier: QuantityPriceTier } | null {
  const productId =
    typeof row.product_id === 'string'
      ? row.product_id.trim()
      : row.product_id != null
        ? String(row.product_id).trim()
        : ''
  const minQ = num(row.quantity_threshold)
  const unitPrice = num(row.price_per_unit)
  if (!productId || minQ === null || unitPrice === null) return null
  return {
    productId,
    tier: { minQuantity: Math.max(1, Math.floor(minQ)), unitPrice },
  }
}

export type QuantityPricesFetchResult = {
  tiersByProductId: Map<string, QuantityPriceTier[]>
  /** Righe grezze da Supabase (utile per debug RLS / colonne). */
  quantityData: QuantityPriceRow[] | null
  error: { message: string } | null
}

function isQuantityPricesSchemaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const o = error as { message?: string; details?: string; code?: string }
  const text = `${o.message ?? ''} ${o.details ?? ''}`.toLowerCase()
  if (String(o.code ?? '') === '42703') return true
  if (text.includes('does not exist') && text.includes('column')) return true
  if (text.includes('could not find') && text.includes('column')) return true
  return false
}

/** Schema ricostruito: colonne canonical per sconti quantità su Supabase. */
const QUANTITY_PRICE_SELECT_FALLBACKS: readonly string[] = [
  'product_id, quantity_threshold, price_per_unit',
]

/** Raggruppa i listini per product_id (allineato a public.products.id). */
export async function fetchQuantityPriceTiersByProductId(): Promise<QuantityPricesFetchResult> {
  const empty: QuantityPricesFetchResult = {
    tiersByProductId: new Map(),
    quantityData: [],
    error: null,
  }
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return empty

  try {
    let data: unknown[] | null = null
    let lastError: unknown = null
    for (const sel of QUANTITY_PRICE_SELECT_FALLBACKS) {
      const res = await supabase.from('product_quantity_prices').select(sel)
      if (!res.error) {
        data = res.data as unknown[] | null
        break
      }
      lastError = res.error
      if (!isQuantityPricesSchemaError(res.error)) {
        return empty
      }
    }
    if (data == null) {
      if (lastError) {
        console.warn(
          '[product_quantity_prices] Nessun select compatibile con lo schema:',
          lastError,
        )
      }
      return empty
    }

    const rows = (data ?? []) as QuantityPriceRow[]
    const map = new Map<string, QuantityPriceTier[]>()

    for (const row of rows) {
      const parsed = rowToTier(row)
      if (!parsed) continue
      const mapKey = normalizeQuantityPriceProductKey(parsed.productId)
      const list = map.get(mapKey) ?? []
      const mq = parsed.tier.minQuantity
      const idx = list.findIndex((t) => t.minQuantity === mq)
      if (idx >= 0) list[idx] = parsed.tier
      else list.push(parsed.tier)
      map.set(mapKey, list)
    }

    for (const [id, tiers] of map) {
      tiers.sort((a, b) => a.minQuantity - b.minQuantity)
      map.set(id, tiers)
    }

    return { tiersByProductId: map, quantityData: rows, error: null }
  } catch {
    // Silent fail anche su eccezioni runtime/network.
    return empty
  }
}
