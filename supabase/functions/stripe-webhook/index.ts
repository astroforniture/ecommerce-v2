import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno'
import { Resend } from 'npm:resend@4.1.2'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'
import {
  EMAIL_FROM_DEFAULT,
  EMAIL_SUPPORT,
  buildAdminNewOrderEmail,
  type OrderLine,
} from '../_shared/transactionalEmailTemplates.ts'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'apikey, x-client-info, content-type, authorization, stripe-signature, accept, cache-control, pragma, expires, x-supabase-api-version, prefer, origin',
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

function parseOrderItems(raw: unknown): OrderLine[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const name = asString(o.name ?? o.product_name)
      if (!name) return null
      return {
        name,
        quantity: Math.max(1, Math.floor(asNumber(o.quantity))),
        unitImponibile: asNumber(o.unit_imponibile ?? o.unitImponibile ?? o.price),
        variant: asString(o.variant) || undefined,
      }
    })
    .filter((x): x is OrderLine => Boolean(x))
}

async function setCartSessionStatusByPaymentIntent(
  paymentIntentId: string,
  status: 'completed' | 'abandoned' | 'canceled',
) {
  const supabase = getServiceSupabase()
  if (!supabase || !paymentIntentId) return { updated: 0 }

  const { data, error } = await supabase
    .from('cart_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .in('status', ['pending', 'abandoned', 'reminded'])
    .select('id')

  if (error) {
    console.error('[stripe-webhook] cart_sessions update error:', error.message)
    return { updated: 0 }
  }
  return { updated: data?.length ?? 0 }
}

async function setCartSessionStatusByCheckoutSession(
  checkoutSessionId: string,
  status: 'completed' | 'abandoned' | 'canceled',
  paymentIntentId?: string | null,
) {
  const supabase = getServiceSupabase()
  if (!supabase) return { updated: 0 }

  if (paymentIntentId) {
    return setCartSessionStatusByPaymentIntent(paymentIntentId, status)
  }

  const { data, error } = await supabase
    .from('cart_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .contains('billing_json', { checkout_session_id: checkoutSessionId })
    .in('status', ['pending', 'abandoned', 'reminded'])
    .select('id')

  if (error) {
    console.warn('[stripe-webhook] checkout session fallback update:', error.message)
    return { updated: 0 }
  }
  return { updated: data?.length ?? 0 }
}

/** Backup: notifica admin se l'ordine e gia in DB (dopo checkout client). */
async function notifyAdminNewOrderFromPaymentIntent(paymentIntentId: string) {
  const supabase = getServiceSupabase()
  const apiKey = Deno.env.get('RESEND_API_KEY')?.trim()
  if (!supabase || !apiKey || !paymentIntentId) return { sent: false }

  // Piccolo ritardo: l'ordine viene inserito dal client subito dopo il PaymentIntent.
  await new Promise((r) => setTimeout(r, 2500))

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.warn('[stripe-webhook] order lookup:', error.message)
    return { sent: false }
  }
  if (!data) {
    console.log('[stripe-webhook] nessun ordine ancora per PI', paymentIntentId)
    return { sent: false }
  }

  const row = data as Record<string, unknown>
  if (row.admin_notified_at) {
    console.log('[stripe-webhook] admin gia notificato per ordine', row.id)
    return { sent: false, skipped: true }
  }

  const orderId = asString(row.id)
  const orderRef = buildOrderRef(orderId)
  const billingAddress = [
    asString(row.billing_street),
    [asString(row.billing_zip), asString(row.billing_city)].filter(Boolean).join(' '),
    asString(row.billing_province),
  ]
    .filter(Boolean)
    .join(', ')
  const shippingAddress = [
    asString(row.shipping_address) || asString(row.shipping_street),
    [asString(row.shipping_zip), asString(row.shipping_city)].filter(Boolean).join(' '),
    asString(row.shipping_province),
  ]
    .filter(Boolean)
    .join(', ')

  const built = buildAdminNewOrderEmail({
    orderRef,
    customerName: asString(row.customer_name) || asString(row.billing_name) || undefined,
    email: asString(row.billing_email) || asString(row.customer_email) || undefined,
    phone: asString(row.billing_phone) || undefined,
    billingAddress: billingAddress || undefined,
    shippingAddress: shippingAddress || undefined,
    items: parseOrderItems(row.items_json),
    taxableTotal: asNumber(row.taxable_total ?? row.subtotal),
    vatAmount: asNumber(row.vat_amount ?? row.vat_total),
    shippingFee: asNumber(row.shipping_cost ?? row.shipping_fee),
    totalWithVat: asNumber(row.total_amount ?? row.total),
    paymentMethod: 'Stripe / Carta',
    orderNotes: asString(row.order_notes) || undefined,
    deliveryMethod: asString(row.delivery_method) || undefined,
  })

  const from = Deno.env.get('RESEND_FROM')?.trim() || EMAIL_FROM_DEFAULT
  const resend = new Resend(apiKey)
  const sendResult = await resend.emails.send({
    from,
    to: EMAIL_SUPPORT,
    subject: built.subject,
    html: built.html,
    replyTo: EMAIL_SUPPORT,
  })

  if (sendResult.error) {
    console.error('[stripe-webhook] admin email Resend error:', sendResult.error)
    return { sent: false }
  }

  const notifiedAt = new Date().toISOString()
  const mark = await supabase
    .from('orders')
    .update({ admin_notified_at: notifiedAt })
    .eq('id', orderId)
  if (mark.error) {
    // Colonna assente: non bloccare.
    console.warn('[stripe-webhook] admin_notified_at update:', mark.error.message)
  }

  console.log('[stripe-webhook] admin new-order email sent', orderRef, sendResult.data?.id)
  return { sent: true, orderRef }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')?.trim()
  if (!stripeSecretKey) {
    return json({ error: 'STRIPE_SECRET_KEY missing' }, 500)
  }
  if (!webhookSecret) {
    return json({ error: 'STRIPE_WEBHOOK_SECRET missing' }, 500)
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return json({ error: 'Missing stripe-signature' }, 400)
  }

  const rawBody = await req.text()
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return json({ error: 'Invalid signature' }, 400)
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const result = await setCartSessionStatusByPaymentIntent(pi.id, 'completed')
        console.log('[stripe-webhook] payment_intent.succeeded', pi.id, result)
        // Fire-and-forget backup admin notification (non bloccare la risposta Stripe).
        void notifyAdminNewOrderFromPaymentIntent(pi.id).catch((err) =>
          console.error('[stripe-webhook] admin notify failed:', err),
        )
        break
      }
      case 'payment_intent.canceled': {
        const pi = event.data.object as Stripe.PaymentIntent
        const result = await setCartSessionStatusByPaymentIntent(pi.id, 'canceled')
        console.log('[stripe-webhook] payment_intent.canceled', pi.id, result)
        break
      }
      case 'payment_intent.payment_failed': {
        console.log(
          '[stripe-webhook] payment_intent.payment_failed',
          (event.data.object as Stripe.PaymentIntent).id,
        )
        break
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const piId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null
        const result = await setCartSessionStatusByCheckoutSession(
          session.id,
          'completed',
          piId,
        )
        console.log('[stripe-webhook] checkout.session.completed', session.id, result)
        if (piId) {
          void notifyAdminNewOrderFromPaymentIntent(piId).catch((err) =>
            console.error('[stripe-webhook] admin notify failed:', err),
          )
        }
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const piId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null
        const result = await setCartSessionStatusByCheckoutSession(
          session.id,
          'abandoned',
          piId,
        )
        console.log('[stripe-webhook] checkout.session.expired', session.id, result)
        break
      }
      default:
        console.log('[stripe-webhook] ignored event:', event.type)
    }

    return json({ received: true, type: event.type })
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err)
    return json({ error: err instanceof Error ? err.message : 'Webhook handler failed' }, 500)
  }
})
