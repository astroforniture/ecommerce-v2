/**
 * Crea/aggiorna l'ordine Supabase da un PaymentIntent Stripe riuscito.
 * Usato da stripe-webhook e finalize-stripe-order (Klarna / redirect async).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import type Stripe from 'https://esm.sh/stripe@17.7.0?target=deno'

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number.parseFloat(value.replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function buildOrderRef(id: string): string {
  const year = new Date().getFullYear()
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const tail = clean.slice(-6).padStart(6, '0')
  return `AF-${year}-${tail || '000000'}`
}

export function paymentMethodLabelFromIntent(pi: Stripe.PaymentIntent): string {
  const types = pi.payment_method_types ?? []
  if (types.includes('klarna')) return 'klarna'
  if (types.includes('paypal')) return 'paypal'
  if (types.includes('card')) return 'stripe'
  const first = types[0]
  return first ? String(first) : 'stripe'
}

type CartItemRow = {
  id?: string
  sku?: string
  name: string
  variant?: string
  quantity: number
  unit_imponibile: number
  row_imponibile?: number
  imageUrl?: string
}

function parseItemsJson(raw: unknown): CartItemRow[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const name = asString(o.name ?? o.product_name)
      if (!name) return null
      const qty = Math.max(1, Math.floor(asNumber(o.quantity)))
      const unit = asNumber(o.unit_imponibile ?? o.unitImponibile ?? o.price)
      return {
        id: asString(o.id) || undefined,
        sku: asString(o.sku) || undefined,
        name,
        variant: asString(o.variant) || undefined,
        quantity: qty,
        unit_imponibile: unit,
        row_imponibile: asNumber(o.row_imponibile ?? o.rowImponibile) || unit * qty,
        imageUrl: asString(o.imageUrl) || undefined,
      }
    })
    .filter((x): x is CartItemRow => Boolean(x))
}

async function ensureOrderItems(
  supabase: SupabaseClient,
  orderId: string,
  items: CartItemRow[],
): Promise<void> {
  if (!items.length) return

  const { count, error: countError } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', orderId)

  if (countError) {
    console.warn('[ensureStripeOrder] count order_items:', countError.message)
  }
  if ((count ?? 0) > 0) return

  const payload = items.map((item) => ({
    order_id: orderId,
    product_name: item.name,
    name: item.name,
    sku: item.sku || item.id || null,
    variant: item.variant || null,
    quantity: item.quantity,
    price: item.unit_imponibile,
    total: item.row_imponibile ?? item.unit_imponibile * item.quantity,
    unit_imponibile: item.unit_imponibile,
    unit_price: item.unit_imponibile,
    product_id: item.id || null,
    image_url: item.imageUrl || null,
  }))

  // Schema remoto può non avere tutte le colonne: ritenta togliendo campi assenti.
  let rows: Record<string, unknown>[] = payload
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { error } = await supabase.from('order_items').insert(rows)
    if (!error) return
    const match = error.message.match(/Could not find the ['"]?([a-zA-Z0-9_]+)['"]? column/i)
    if (!match?.[1]) {
      console.error('[ensureStripeOrder] order_items insert failed:', error.message)
      return
    }
    const missing = match[1]
    rows = rows.map((row) => {
      const { [missing]: _removed, ...rest } = row
      return rest
    })
  }
}

function billingFromCartSession(
  billing: Record<string, unknown> | null | undefined,
  emailFallback: string,
  amountCents: number,
  items: CartItemRow[],
): Record<string, unknown> {
  const b = billing ?? {}
  const email =
    asString(b.customerEmail) ||
    asString(b.billingEmail) ||
    asString(emailFallback)
  const name =
    asString(b.billingName) ||
    asString(b.companyName) ||
    [asString(b.firstName), asString(b.lastName)].filter(Boolean).join(' ') ||
    'Cliente'
  const street = asString(b.addressStreet) || asString(b.shippingStreet)
  const city = asString(b.addressCity) || asString(b.shippingCity)
  const zip = asString(b.addressZip) || asString(b.shippingZip)
  const province = asString(b.addressProvince) || asString(b.shippingProvince)
  const total = amountCents > 0 ? Number((amountCents / 100).toFixed(2)) : 0
  const taxableFromItems = items.reduce(
    (sum, i) => sum + (i.row_imponibile ?? i.unit_imponibile * i.quantity),
    0,
  )
  const delivery = asString(b.deliveryMethod) || 'Spedizione a domicilio'
  const isPickup = /ritiro/i.test(delivery)
  const shippingFee = isPickup ? 0 : 9.9
  const taxable =
    taxableFromItems > 0
      ? Number(taxableFromItems.toFixed(2))
      : total > 0
        ? Number(((total - shippingFee) / 1.22).toFixed(2))
        : 0
  const vat =
    total > 0
      ? Number((total - taxable - shippingFee).toFixed(2))
      : Number((taxable * 0.22).toFixed(2))

  return {
    customer_name: name,
    customer_email: email || undefined,
    billing_name: name,
    billing_email: email || undefined,
    billing_street: street || undefined,
    billing_city: city || undefined,
    billing_zip: zip || undefined,
    billing_province: province || undefined,
    billing_phone: asString(b.billingPhone) || undefined,
    shipping_address: street || undefined,
    shipping_city: city || undefined,
    shipping_zip: zip || undefined,
    shipping_province: province || undefined,
    delivery_method: delivery,
    total_amount: total || Number((taxable + vat + shippingFee).toFixed(2)),
    taxable_total: taxable,
    vat_amount: vat,
    shipping_cost: shippingFee,
    items_json: items,
    is_company: b.isCompany === true,
    billing_vat: asString(b.vatNumber) || undefined,
    billing_sdi: asString(b.sdiCode) || undefined,
    pec: asString(b.pec) || undefined,
    customer_type: asString(b.customerType) || undefined,
  }
}

export type EnsureStripeOrderResult = {
  orderId: string
  orderRef: string
  created: boolean
  updated: boolean
}

/**
 * Marca Pagato un ordine esistente o lo crea da cart_sessions + metadata PI.
 */
export async function ensureOrderPaidFromPaymentIntent(
  supabase: SupabaseClient,
  pi: Stripe.PaymentIntent,
): Promise<EnsureStripeOrderResult | null> {
  const paymentIntentId = pi.id
  if (!paymentIntentId) return null

  const paymentMethod = paymentMethodLabelFromIntent(pi)
  const meta = (pi.metadata ?? {}) as Record<string, string>
  const emailFromPi =
    asString(pi.receipt_email) ||
    asString(meta.customer_email) ||
    asString(meta.billing_email)
  const metaOrderId = asString(meta.supabase_order_id) || asString(meta.order_id)

  // 1) Lookup per metadata order_id (ordine pending creato prima del redirect)
  // 2) Fallback per stripe_payment_intent_id
  let existing: Record<string, unknown> | null = null

  if (metaOrderId) {
    const byMeta = await supabase
      .from('orders')
      .select('id, status, items_json, customer_email, billing_email')
      .eq('id', metaOrderId)
      .maybeSingle()
    if (byMeta.error) {
      console.warn('[ensureStripeOrder] lookup by metadata order_id:', byMeta.error.message)
    } else if (byMeta.data) {
      existing = byMeta.data as Record<string, unknown>
    }
  }

  if (!existing) {
    const byPi = await supabase
      .from('orders')
      .select('id, status, items_json, customer_email, billing_email')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (byPi.error) {
      console.warn('[ensureStripeOrder] lookup order by PI:', byPi.error.message)
    } else if (byPi.data) {
      existing = byPi.data as Record<string, unknown>
    }
  }

  if (existing?.id) {
    const orderId = asString(existing.id)
    // Aggiorna SOLO stato/pagamento: non toccare order_items esistenti.
    const patch: Record<string, unknown> = {
      status: 'Pagato',
      payment_method: paymentMethod,
      stripe_payment_intent_id: paymentIntentId,
    }
    if (emailFromPi && !asString(existing.customer_email) && !asString(existing.billing_email)) {
      patch.customer_email = emailFromPi
      patch.billing_email = emailFromPi
    }

    const { error: updateError } = await supabase.from('orders').update(patch).eq('id', orderId)
    if (updateError) {
      console.error('[ensureStripeOrder] update order failed:', updateError.message)
    }

    // Se mancano le righe (bug storico), prova a ripristinarle — mai cancellare quelle presenti.
    const { count } = await supabase
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', orderId)

    if ((count ?? 0) === 0) {
      let items = parseItemsJson(existing.items_json)
      if (items.length === 0) {
        const { data: session } = await supabase
          .from('cart_sessions')
          .select('items_json')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .maybeSingle()
        items = parseItemsJson(session?.items_json)
        if (items.length) {
          await supabase.from('orders').update({ items_json: items }).eq('id', orderId)
        }
      }
      if (items.length) {
        await ensureOrderItems(supabase, orderId, items)
      }
    }

    return {
      orderId,
      orderRef: buildOrderRef(orderId),
      created: false,
      updated: true,
    }
  }

  const { data: session, error: sessionError } = await supabase
    .from('cart_sessions')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (sessionError) {
    console.warn('[ensureStripeOrder] cart_sessions lookup:', sessionError.message)
  }

  const sessionRow = (session ?? null) as Record<string, unknown> | null
  const items = parseItemsJson(sessionRow?.items_json)
  const amountCents =
    typeof pi.amount_received === 'number' && pi.amount_received > 0
      ? pi.amount_received
      : typeof pi.amount === 'number'
        ? pi.amount
        : asNumber(sessionRow?.amount_cents)

  const billingJson =
    sessionRow?.billing_json && typeof sessionRow.billing_json === 'object'
      ? (sessionRow.billing_json as Record<string, unknown>)
      : {
          billingName: asString(meta.billing_name),
          addressStreet: asString(meta.billing_street),
          addressCity: asString(meta.billing_city),
          addressZip: asString(meta.billing_zip),
          addressProvince: asString(meta.billing_province),
          billingPhone: asString(meta.billing_phone),
          deliveryMethod: asString(meta.delivery_method),
          isCompany: meta.is_company === 'true',
          vatNumber: asString(meta.vat_number),
          sdiCode: asString(meta.sdi_code),
          customerEmail: emailFromPi,
        }

  if (items.length === 0 && amountCents <= 0) {
    console.warn(
      '[ensureStripeOrder] impossibile creare ordine: nessun cart_session/items per',
      paymentIntentId,
    )
    return null
  }

  const base = billingFromCartSession(
    billingJson,
    emailFromPi || asString(sessionRow?.email),
    amountCents,
    items,
  )

  let orderPayload: Record<string, unknown> = {
    ...base,
    status: 'Pagato',
    stripe_payment_intent_id: paymentIntentId,
    payment_method: paymentMethod,
    ...(asString(sessionRow?.user_id) ? { user_id: asString(sessionRow?.user_id) } : {}),
    ...(asString(meta.user_id) ? { user_id: asString(meta.user_id) } : {}),
  }

  // Rimuovi chiavi vuote
  orderPayload = Object.fromEntries(
    Object.entries(orderPayload).filter(([, v]) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'string' && v.trim() === '') return false
      return true
    }),
  )

  let data: { id?: string } | null = null
  let error: { message: string } | null = null
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const result = await supabase.from('orders').insert(orderPayload).select('id').single()
    data = (result.data as { id?: string } | null) ?? null
    error = result.error
    if (!error) break
    const match = error.message.match(/Could not find the ['"]?([a-zA-Z0-9_]+)['"]? column/i)
    if (!match?.[1] || !(match[1] in orderPayload)) break
    const missing = match[1]
    const removed = orderPayload[missing]
    const { [missing]: _r, ...rest } = orderPayload
    orderPayload = rest
    if (missing === 'shipping_cost' && removed != null) orderPayload.shipping_fee = removed
    else if (missing === 'shipping_fee' && removed != null) orderPayload.shipping_cost = removed
  }

  if (error || !data?.id) {
    console.error(
      '[ensureStripeOrder] insert order failed:',
      error?.message ?? 'id missing',
      paymentIntentId,
    )
    return null
  }

  const orderId = data.id
  await ensureOrderItems(supabase, orderId, items)

  console.log('[ensureStripeOrder] ordine creato da webhook/finalize', orderId, paymentIntentId)
  return {
    orderId,
    orderRef: buildOrderRef(orderId),
    created: true,
    updated: false,
  }
}
