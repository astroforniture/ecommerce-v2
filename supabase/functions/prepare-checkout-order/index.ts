/**
 * Prima del redirect Stripe: crea orders (status=pending) + order_items
 * e aggiorna metadata/description del PaymentIntent con order_id e articoli.
 */
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'apikey, x-client-info, content-type, authorization, accept, cache-control, pragma, expires, x-supabase-api-version, prefer, origin',
  'Access-Control-Max-Age': '86400',
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

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

function buildOrderRef(id: string): string {
  const year = new Date().getFullYear()
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const tail = clean.slice(-6).padStart(6, '0')
  return `AF-${year}-${tail || '000000'}`
}

function extractMissingColumn(message: string): string | null {
  const match = message.match(/Could not find the ['"]?([a-zA-Z0-9_]+)['"]? column/i)
  return match?.[1] ?? null
}

function sanitize(payload: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, v]) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'string' && v.trim() === '') return false
      return true
    }),
  )
}

type LineItem = {
  id?: string
  sku?: string
  name: string
  variant?: string
  quantity: number
  unit_imponibile: number
  row_imponibile: number
  imageUrl?: string
}

function normalizeItems(raw: unknown): LineItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const name = asString(o.name ?? o.product_name)
      if (!name) return null
      const qty = Math.max(1, Math.floor(asNumber(o.quantity)))
      const unit = asNumber(o.unit_imponibile ?? o.unitImponibile ?? o.price)
      const rowTotal = asNumber(o.row_imponibile ?? o.rowImponibile ?? o.total) || unit * qty
      return {
        id: asString(o.id) || undefined,
        sku: asString(o.sku) || undefined,
        name,
        variant: asString(o.variant ?? o.variantLabel) || undefined,
        quantity: qty,
        unit_imponibile: unit,
        row_imponibile: rowTotal,
        imageUrl: asString(o.imageUrl) || undefined,
      }
    })
    .filter((x): x is LineItem => Boolean(x))
}

function itemsSummary(items: LineItem[]): string {
  return items
    .slice(0, 8)
    .map((i) => {
      const price = i.unit_imponibile.toFixed(2)
      return `${i.quantity}x ${i.name} @${price}€`
    })
    .join(' | ')
    .slice(0, 480)
}

async function insertWithColumnFallback(
  // deno-lint-ignore no-explicit-any
  table: any,
  payload: Record<string, unknown> | Record<string, unknown>[],
  selectId = false,
): Promise<{ data: { id?: string } | null; error: string | null }> {
  let rows = Array.isArray(payload) ? payload : [payload]
  for (let attempt = 0; attempt < 14; attempt += 1) {
    const query = selectId ? table.insert(rows).select('id').single() : table.insert(rows)
    const { data, error } = await query
    if (!error) {
      return { data: (data as { id?: string } | null) ?? null, error: null }
    }
    const missing = extractMissingColumn(error.message)
    if (!missing) {
      return { data: null, error: error.message }
    }
    rows = rows.map((row) => {
      const { [missing]: _r, ...rest } = row
      return rest
    })
  }
  return { data: null, error: 'Insert fallito dopo retry colonne' }
}

async function ensureOrderItems(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  orderId: string,
  items: LineItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { count, error: countError } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', orderId)

  if (countError) {
    console.warn('[prepare-checkout-order] count items:', countError.message)
  }
  if ((count ?? 0) > 0) return { ok: true }

  const payload = items.map((item) => ({
    order_id: orderId,
    product_name: item.name,
    name: item.name,
    sku: item.sku || item.id || null,
    variant: item.variant || null,
    quantity: item.quantity,
    price: item.unit_imponibile,
    total: item.row_imponibile,
    unit_imponibile: item.unit_imponibile,
    unit_price: item.unit_imponibile,
    product_id: item.id || null,
    image_url: item.imageUrl || null,
  }))

  const result = await insertWithColumnFallback(supabase.from('order_items'), payload, false)
  if (result.error) return { ok: false, error: result.error }
  return { ok: true }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
    if (!stripeSecretKey) {
      return json({ error: 'STRIPE_SECRET_KEY missing' }, 500)
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return json({ error: 'Supabase admin non configurato' }, 500)
    }

    let body: Record<string, unknown> = {}
    try {
      const parsed = await req.json()
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>
      }
    } catch {
      return json({ error: 'Body JSON non valido' }, 400)
    }

    const paymentIntentId = asString(body.paymentIntentId)
    if (!paymentIntentId.startsWith('pi_')) {
      return json({ error: 'paymentIntentId non valido' }, 400)
    }

    const items = normalizeItems(body.items ?? body.cartItems)
    if (items.length === 0) {
      return json({ error: 'Nessun articolo nell’ordine' }, 400)
    }

    const order = (body.order && typeof body.order === 'object'
      ? (body.order as Record<string, unknown>)
      : {}) as Record<string, unknown>

    const email =
      asString(order.customer_email) ||
      asString(order.billing_email) ||
      asString(body.customerEmail)
    const customerName =
      asString(order.customer_name) ||
      asString(order.billing_name) ||
      asString(body.customerName) ||
      'Cliente'

    // Idempotenza: se esiste già un ordine per questo PI, riusa e completa items.
    const { data: existing } = await supabase
      .from('orders')
      .select('id, status')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let orderId = asString(existing?.id)

    if (!orderId) {
      let orderPayload = sanitize({
        customer_name: customerName,
        customer_email: email || undefined,
        billing_name: customerName,
        billing_email: email || undefined,
        billing_street: asString(order.billing_street) || undefined,
        billing_city: asString(order.billing_city) || undefined,
        billing_zip: asString(order.billing_zip) || undefined,
        billing_province: asString(order.billing_province) || undefined,
        billing_phone: asString(order.billing_phone) || undefined,
        billing_company_name: asString(order.billing_company_name) || undefined,
        billing_vat: asString(order.billing_vat) || undefined,
        billing_sdi: asString(order.billing_sdi) || undefined,
        billing_tax_code: asString(order.billing_tax_code) || undefined,
        shipping_address: asString(order.shipping_address) || undefined,
        shipping_city: asString(order.shipping_city) || undefined,
        shipping_zip: asString(order.shipping_zip) || undefined,
        shipping_province: asString(order.shipping_province) || undefined,
        delivery_method: asString(order.delivery_method) || undefined,
        total_amount: asNumber(order.total_amount ?? body.totalWithVat),
        taxable_total: asNumber(order.taxable_total ?? body.taxableTotal),
        vat_amount: asNumber(order.vat_amount ?? body.vatAmount),
        shipping_cost: asNumber(order.shipping_cost ?? body.shippingFee),
        items_json: items,
        status: 'pending',
        stripe_payment_intent_id: paymentIntentId,
        payment_method: 'stripe',
        customer_type: asString(order.customer_type) || undefined,
        pec: asString(order.pec) || undefined,
        is_company: order.is_company === true,
        wants_electronic_invoice: order.wants_electronic_invoice !== false,
        e_invoice_company_name: asString(order.e_invoice_company_name) || undefined,
        e_invoice_vat: asString(order.e_invoice_vat) || undefined,
        e_invoice_tax_code: asString(order.e_invoice_tax_code) || undefined,
        e_invoice_sdi_or_pec: asString(order.e_invoice_sdi_or_pec) || undefined,
        order_notes: asString(order.order_notes) || undefined,
        user_id: asString(order.user_id ?? body.userId) || undefined,
      })

      const inserted = await insertWithColumnFallback(
        supabase.from('orders'),
        orderPayload,
        true,
      )
      if (inserted.error || !inserted.data?.id) {
        // Race: altro request ha creato l'ordine
        if (inserted.error && /duplicate|unique/i.test(inserted.error)) {
          const { data: again } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .maybeSingle()
          orderId = asString(again?.id)
        }
        if (!orderId) {
          return json(
            { error: inserted.error ?? 'Creazione ordine pending fallita' },
            500,
          )
        }
      } else {
        orderId = inserted.data.id
      }
    } else {
      // Mantieni pending se non già pagato; aggiorna snapshot items_json.
      const status = asString(existing?.status).toLowerCase()
      if (!status.includes('pagat') && status !== 'paid' && status !== 'completed') {
        await supabase
          .from('orders')
          .update({
            status: 'pending',
            items_json: items,
            stripe_payment_intent_id: paymentIntentId,
          })
          .eq('id', orderId)
      }
    }

    const itemsResult = await ensureOrderItems(supabase, orderId, items)
    if (!itemsResult.ok) {
      return json(
        {
          error: `Ordine creato ma salvataggio order_items fallito: ${itemsResult.error}`,
          orderId,
        },
        500,
      )
    }

    const orderRef = buildOrderRef(orderId)
    const summary = itemsSummary(items)
    const description =
      `AF ordine ${orderRef} (${orderId}) — ${items.length} articol${items.length === 1 ? 'o' : 'i'}`
        .slice(0, 900)

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
      const nextMeta: Record<string, string> = {
        ...(pi.metadata ?? {}),
        supabase_order_id: orderId,
        order_id: orderId,
        order_ref: orderRef,
        item_count: String(items.length),
        items_summary: summary,
      }
      if (email) nextMeta.customer_email = email

      await stripe.paymentIntents.update(paymentIntentId, {
        description,
        metadata: nextMeta,
      })
    } catch (stripeErr) {
      console.error('[prepare-checkout-order] Stripe metadata update failed:', stripeErr)
      return json(
        {
          error:
            'Ordine salvato ma aggiornamento metadata Stripe fallito. Riprova prima di pagare.',
          orderId,
          orderRef,
        },
        502,
      )
    }

    // Allinea cart_sessions con order id nei billing_json
    await supabase
      .from('cart_sessions')
      .update({
        updated_at: new Date().toISOString(),
        billing_json: {
          ...(typeof body.billing === 'object' && body.billing ? body.billing : {}),
          supabase_order_id: orderId,
          order_ref: orderRef,
        },
      })
      .eq('stripe_payment_intent_id', paymentIntentId)

    return json({
      ok: true,
      orderId,
      orderRef,
      status: 'pending',
      itemsCount: items.length,
      paymentIntentId,
    })
  } catch (err) {
    console.error('[prepare-checkout-order]', err)
    return json(
      { error: err instanceof Error ? err.message : 'Errore preparazione ordine' },
      500,
    )
  }
})
