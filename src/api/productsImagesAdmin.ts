import { getSupabaseBrowserClient } from '../lib/supabaseClient'

export type SyncProductsImagesResult = {
  ok: boolean
  error?: string
  updated_from_office_products?: number
  updated_od_multimedia_urls?: number
}

export async function syncProductsImagesAdmin(input: {
  token: string
  applyOdMultimedia?: boolean
  odSkuRegex?: string
}): Promise<SyncProductsImagesResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato.' }
  }

  const { data, error } = await supabase.rpc('sync_products_images_admin', {
    p_token: input.token.trim(),
    p_apply_od_multimedia: input.applyOdMultimedia ?? true,
    p_od_sku_regex: (input.odSkuRegex ?? '^STL[0-9]+').trim() || '^STL[0-9]+',
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  const row = data as SyncProductsImagesResult | null
  if (!row || typeof row !== 'object') {
    return { ok: false, error: 'Risposta RPC non valida' }
  }
  if (!row.ok) {
    return { ok: false, error: row.error ?? 'Operazione non riuscita' }
  }
  return row
}

export type ProductImageRow = {
  id: string
  sku: string | null
  name: string | null
  image_url: string | null
}

/** Elenco prodotti con immagine mancante (solo lettura; per anteprima / SQL manuale). */
export async function fetchProductsMissingImages(
  limit = 200,
): Promise<ProductImageRow[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return []

  const cap = Math.min(500, Math.max(1, limit))
  const [nullRes, emptyRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, sku, name, image_url')
      .is('image_url', null)
      .order('name')
      .limit(cap),
    supabase
      .from('products')
      .select('id, sku, name, image_url')
      .eq('image_url', '')
      .order('name')
      .limit(cap),
  ])

  const err = nullRes.error ?? emptyRes.error
  if (err) {
    console.warn('fetchProductsMissingImages:', err.message)
    return []
  }

  const byId = new Map<string, ProductImageRow>()
  for (const row of [...(nullRes.data ?? []), ...(emptyRes.data ?? [])] as ProductImageRow[]) {
    byId.set(String(row.id), row)
  }
  return Array.from(byId.values()).slice(0, cap)
}
