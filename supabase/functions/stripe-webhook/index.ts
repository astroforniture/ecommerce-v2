import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'

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

  // Fallback: metadata may store cart_session_id in future Checkout Sessions.
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
        break
      }
      case 'payment_intent.canceled': {
        const pi = event.data.object as Stripe.PaymentIntent
        const result = await setCartSessionStatusByPaymentIntent(pi.id, 'canceled')
        console.log('[stripe-webhook] payment_intent.canceled', pi.id, result)
        break
      }
      case 'payment_intent.payment_failed': {
        // Keep pending so reminder logic can still recover the cart.
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
