/**
 * Finalizza un ordine dopo redirect Stripe (Klarna / 3DS / async).
 * Verifica il PaymentIntent e crea/aggiorna orders + order_items via service role.
 */
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'
import {
  ensureOrderPaidFromPaymentIntent,
  paymentMethodLabelFromIntent,
} from '../_shared/ensureStripeOrder.ts'

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

    const paymentIntentId =
      typeof body.paymentIntentId === 'string' ? body.paymentIntentId.trim() : ''
    if (!paymentIntentId.startsWith('pi_')) {
      return json({ error: 'paymentIntentId non valido' }, 400)
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (pi.status !== 'succeeded' && pi.status !== 'processing') {
      return json(
        {
          error: `Pagamento non ancora completato (stato: ${pi.status}).`,
          status: pi.status,
        },
        409,
      )
    }

    // Solo con succeeded creiamo/marchiamo Pagato; processing lascia pending.
    if (pi.status === 'processing') {
      const { data: existing } = await supabase
        .from('orders')
        .select('id, status')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .maybeSingle()
      if (existing?.id) {
        return json({
          ok: true,
          pending: true,
          orderId: existing.id,
          orderRef: `AF-${new Date().getFullYear()}-${String(existing.id)
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(-6)
            .padStart(6, '0')}`,
          paymentMethod: paymentMethodLabelFromIntent(pi),
        })
      }
      return json({ ok: true, pending: true, status: pi.status })
    }

    const ensured = await ensureOrderPaidFromPaymentIntent(supabase, pi)
    if (!ensured) {
      return json(
        {
          error:
            'Pagamento ricevuto ma ordine non recuperabile. Contatta assistenza con il riferimento pagamento.',
          paymentIntentId,
        },
        502,
      )
    }

    await supabase
      .from('cart_sessions')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('stripe_payment_intent_id', paymentIntentId)
      .in('status', ['pending', 'abandoned', 'reminded'])

    return json({
      ok: true,
      orderId: ensured.orderId,
      orderRef: ensured.orderRef,
      created: ensured.created,
      updated: ensured.updated,
      paymentMethod: paymentMethodLabelFromIntent(pi),
    })
  } catch (err) {
    console.error('[finalize-stripe-order]', err)
    return json(
      { error: err instanceof Error ? err.message : 'Errore finalizzazione ordine' },
      500,
    )
  }
})
