import { getSupabaseBrowserClient } from '../lib/supabaseClient'

export type InsertOfficeProductAdminInput = {
  token: string
  id: string
  sku: string
  name: string
  brand: string
  category: string
  imageUrl: string
  description?: string
  price?: number
  parentSku?: string
  colorName?: string
}

export type CreateOfficeProductWithDetailsInput = {
  token: string
  id?: string
  sku: string
  name: string
  description?: string
  price?: number
  stock?: number
  imageUrl?: string
  category: string
  brand?: string
  colors: string[]
  quantityDiscounts: Array<{ minQuantity: number; unitPrice: number }>
}

type RpcResult = { ok: boolean; error?: string; id?: string }

export async function insertOfficeProductAdmin(
  input: InsertOfficeProductAdminInput,
): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato (env mancanti).' }
  }

  const price =
    input.price !== undefined && Number.isFinite(input.price) ? input.price : null

  const { data, error } = await supabase.rpc('insert_office_product_admin', {
    p_token: input.token.trim(),
    p_id: input.id.trim(),
    p_sku: input.sku.trim(),
    p_name: input.name.trim(),
    p_brand: input.brand.trim(),
    p_category: input.category.trim(),
    p_image_url: input.imageUrl.trim(),
    p_description: input.description?.trim() || null,
    p_price: price,
    p_parent_sku: input.parentSku?.trim() || null,
    p_color_name: input.colorName?.trim() || null,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  const row = data as RpcResult | null
  if (!row || typeof row !== 'object') {
    return { ok: false, error: 'Risposta RPC non valida' }
  }
  if (!row.ok) {
    return { ok: false, error: row.error ?? 'Operazione non riuscita' }
  }
  return { ok: true, id: row.id }
}

export async function createOfficeProductWithDetailsAdmin(
  input: CreateOfficeProductWithDetailsInput,
): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase non configurato (env mancanti).' }
  }

  const id = (input.id?.trim() || input.sku.trim() || crypto.randomUUID()).trim()
  const sku = input.sku.trim()
  const name = input.name.trim()
  const brand = (input.brand?.trim() || 'STARLINE').trim()
  const category = input.category.trim()
  const imageUrl = input.imageUrl?.trim() || ''
  const description = input.description?.trim() || undefined
  const price = input.price !== undefined && Number.isFinite(input.price) ? input.price : undefined

  if (!sku || !name || !category) {
    return { ok: false, error: 'Compila almeno SKU, nome e categoria.' }
  }

  const createRes = await insertOfficeProductAdmin({
    token: input.token,
    id,
    sku,
    name,
    brand,
    category,
    imageUrl,
    description,
    price,
  })

  if (!createRes.ok) return createRes

  const colors = input.colors
    .map((c) => c.trim())
    .filter((c) => c.length > 0)
  const variants =
    colors.length > 0
      ? colors.map((label) => ({
          label,
        }))
      : null

  const stock =
    input.stock !== undefined && Number.isFinite(input.stock)
      ? Math.max(0, Math.floor(input.stock))
      : null

  const patchPayload: Record<string, unknown> = {
    variants,
  }
  if (stock !== null) patchPayload.stock = stock
  if (imageUrl) patchPayload.image_url = imageUrl
  if (description) patchPayload.description = description

  const patchRes = await supabase.from('products').update(patchPayload).eq('id', id)
  if (patchRes.error) {
    return {
      ok: false,
      error: `Prodotto creato ma campi extra non aggiornati: ${patchRes.error.message}`,
      id,
    }
  }

  const discounts = input.quantityDiscounts
    .map((d) => ({
      product_id: id,
      min_quantity: Math.max(1, Math.floor(d.minQuantity)),
      price_per_unit: d.unitPrice,
    }))
    .filter((d) => Number.isFinite(d.min_quantity) && Number.isFinite(d.price_per_unit))

  if (discounts.length > 0) {
    const discountRes = await supabase
      .from('product_quantity_prices')
      .upsert(discounts, { onConflict: 'product_id,min_quantity' })
    if (discountRes.error) {
      return {
        ok: false,
        error: `Prodotto creato ma sconti quantità non salvati: ${discountRes.error.message}`,
        id,
      }
    }
  }

  return { ok: true, id }
}
