import Stripe from 'stripe'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'apikey, x-client-info, content-type, authorization, accept, cache-control, pragma, expires, x-supabase-api-version, prefer, origin',
  'Access-Control-Max-Age': '86400',
}

function corsOk(): Response {
  return new Response('ok', { status: 200, headers: corsHeaders })
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function asOptionalString(value: unknown, maxLen = 500): string | undefined {
  if (value == null) return undefined
  const s = String(value).trim()
  if (!s) return undefined
  return s.length > maxLen ? s.slice(0, maxLen) : s
}

function buildStripeMetadata(
  billing: Record<string, unknown> | undefined,
  extra: Record<string, unknown> | undefined,
): Record<string, string> {
  const out: Record<string, string> = { source: 'astro-forniture-checkout' }

  const billingFields: Record<string, string | undefined> = {
    billing_name: asOptionalString(billing?.billingName, 200),
    billing_street: asOptionalString(billing?.addressStreet, 200),
    billing_city: asOptionalString(billing?.addressCity, 120),
    billing_zip: asOptionalString(billing?.addressZip, 20),
    billing_province: asOptionalString(billing?.addressProvince, 10),
    billing_phone: asOptionalString(billing?.billingPhone, 40),
    delivery_method: asOptionalString(billing?.deliveryMethod, 120),
    is_company: billing?.isCompany === true ? 'true' : undefined,
    vat_number: asOptionalString(billing?.vatNumber, 32),
    sdi_code: asOptionalString(billing?.sdiCode, 16),
    checkout_mode: asOptionalString(billing?.checkoutMode, 32) ?? 'guest',
  }

  for (const [key, value] of Object.entries(billingFields)) {
    if (value) out[key] = value
  }

  if (extra && typeof extra === 'object') {
    for (const [key, value] of Object.entries(extra)) {
      if (key === 'source') continue
      const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40)
      const safeVal = asOptionalString(value, 500)
      if (safeKey && safeVal) out[safeKey] = safeVal
    }
  }

  return out
}

function buildShipping(billing: Record<string, unknown> | undefined) {
  const line1 = asOptionalString(billing?.addressStreet, 200)
  if (!line1) return undefined

  const city = asOptionalString(billing?.addressCity, 120)
  const postal_code = asOptionalString(billing?.addressZip, 20)
  const state = asOptionalString(billing?.addressProvince, 10)

  return {
    name: asOptionalString(billing?.billingName, 200) ?? 'Cliente Astro Forniture',
    address: {
      line1,
      country: 'IT',
      ...(city ? { city } : {}),
      ...(postal_code ? { postal_code } : {}),
      ...(state ? { state } : {}),
    },
  }
}

function normalizeCartItems(raw: unknown): unknown[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const id = asOptionalString(o.id, 120)
      const name = asOptionalString(o.name, 300)
      if (!id || !name) return null
      const qty = Number(o.quantity)
      return {
        id,
        sku: asOptionalString(o.sku, 120) ?? id,
        name,
        ...(asOptionalString(o.variant, 120) ? { variant: asOptionalString(o.variant, 120) } : {}),
        quantity: Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1,
        unit_imponibile: Number(o.unit_imponibile ?? o.unitImponibile ?? 0) || 0,
        row_imponibile: Number(o.row_imponibile ?? o.rowImponibile ?? 0) || 0,
        ...(asOptionalString(o.imageUrl, 500) ? { imageUrl: asOptionalString(o.imageUrl, 500) } : {}),
      }
    })
    .filter(Boolean)
}

async function upsertPendingCartSession(input: {
  email: string
  items: unknown[]
  amountCents: number
  currency: string
  billing: Record<string, unknown> | undefined
  paymentIntentId: string
  userId?: string
}) {
  const supabase = getServiceSupabase()
  if (!supabase) return

  const payload = {
    email: input.email.toLowerCase(),
    items_json: input.items,
    amount_cents: Math.round(input.amountCents),
    currency: input.currency,
    billing_json: input.billing ?? null,
    stripe_payment_intent_id: input.paymentIntentId,
    status: 'pending',
    updated_at: new Date().toISOString(),
    ...(input.userId ? { user_id: input.userId } : {}),
  }

  const { error } = await supabase.from('cart_sessions').upsert(payload, {
    onConflict: 'stripe_payment_intent_id',
  })

  if (error) {
    // Unique index is partial; fallback insert if upsert unsupported on partial unique.
    console.warn('[create-payment-intent] cart_sessions upsert failed, trying insert:', error.message)
    const { error: insertError } = await supabase.from('cart_sessions').insert(payload)
    if (insertError) {
      console.error('[create-payment-intent] cart_sessions insert failed:', insertError.message)
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsOk()
  }

  if (req.method !== 'POST') {
    return json({ error: 'Metodo non consentito.' }, 405)
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
    if (!stripeSecretKey) {
      return json({ error: 'STRIPE_SECRET_KEY non configurata nei secrets Supabase.' }, 500)
    }

    if (!stripeSecretKey.startsWith('sk_')) {
      return json(
        {
          error:
            'STRIPE_SECRET_KEY non valida: usa sk_test_… o sk_live_… (non pk_…).',
        },
        500,
      )
    }

    const secretMode = stripeSecretKey.startsWith('sk_live_')
      ? 'live'
      : stripeSecretKey.startsWith('sk_test_')
        ? 'test'
        : 'unknown'

    const requireLive =
      (Deno.env.get('STRIPE_REQUIRE_LIVE') ?? '').trim().toLowerCase() === 'true' ||
      (Deno.env.get('STRIPE_MODE') ?? '').trim().toLowerCase() === 'live'
    if (requireLive && secretMode !== 'live') {
      return json(
        {
          error:
            'Stripe backend in modalita TEST (sk_test_). Imposta STRIPE_SECRET_KEY=sk_live_… per i pagamenti reali.',
          mode: secretMode,
        },
        500,
      )
    }

    const testModeFlag = (Deno.env.get('STRIPE_TEST_MODE') ?? '').trim().toLowerCase()
    if (testModeFlag === 'true' || testModeFlag === '1') {
      return json(
        {
          error:
            'STRIPE_TEST_MODE e attivo. Disattivalo nei secrets Supabase per usare i pagamenti LIVE.',
          mode: secretMode,
        },
        500,
      )
    }

    let body: Record<string, unknown> = {}
    try {
      const parsed = await req.json()
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>
      }
    } catch {
      return json({ error: 'Body JSON non valido.' }, 400)
    }

    const amountCents = Number(body.amount)
    if (!Number.isFinite(amountCents) || amountCents < 50) {
      return json({ error: 'Importo non valido (minimo 0,50 EUR).' }, 400)
    }

    const currency =
      typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : 'eur'

    const customerEmail = asOptionalString(body.customerEmail, 320)
    const billing =
      body.billing && typeof body.billing === 'object' && !Array.isArray(body.billing)
        ? (body.billing as Record<string, unknown>)
        : undefined

    const extraMetadata =
      body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : undefined

    const cartItems = normalizeCartItems(body.cartItems ?? body.items)
    const userId = asOptionalString(body.userId, 64)

    const stripe = new Stripe(stripeSecretKey)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountCents),
      currency,
      receipt_email: customerEmail?.includes('@') ? customerEmail : undefined,
      metadata: buildStripeMetadata(billing, {
        ...extraMetadata,
        ...(customerEmail ? { customer_email: customerEmail } : {}),
      }),
      shipping: buildShipping(billing),
      automatic_payment_methods: { enabled: true },
    })

    if (!paymentIntent.client_secret) {
      return json({ error: 'PaymentIntent senza client_secret.' }, 500)
    }

    // Bozza checkout: solo se email presente (utente loggato o email inserita).
    if (customerEmail?.includes('@') && cartItems.length > 0) {
      try {
        await upsertPendingCartSession({
          email: customerEmail,
          items: cartItems,
          amountCents,
          currency,
          billing,
          paymentIntentId: paymentIntent.id,
          userId,
        })
      } catch (sessionErr) {
        console.error('[create-payment-intent] cart_sessions exception:', sessionErr)
      }
    }

    return json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('create-payment-intent error:', err)
    const message = err instanceof Error ? err.message : 'Errore interno Stripe.'
    const stripeType =
      err && typeof err === 'object' && 'type' in err
        ? String((err as { type?: string }).type ?? '')
        : ''
    const stripeCode =
      err && typeof err === 'object' && 'code' in err
        ? String((err as { code?: string }).code ?? '')
        : ''
    const secret = Deno.env.get('STRIPE_SECRET_KEY')?.trim() ?? ''
    console.error('create-payment-intent stripe fields:', {
      message,
      type: stripeType,
      code: stripeCode,
      secretKeyMode: secret.startsWith('sk_test_')
        ? 'test'
        : secret.startsWith('sk_live_')
          ? 'live'
          : secret
            ? 'unknown'
            : 'missing',
    })
    return json(
      { error: message, type: stripeType || undefined, code: stripeCode || undefined },
      500,
    )
  }
})
