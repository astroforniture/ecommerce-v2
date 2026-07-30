import { Resend } from 'npm:resend@4.1.2'
import {
  EMAIL_FROM_DEFAULT,
  EMAIL_SUPPORT,
  buildOrderConfirmationEmail,
  buildShippingEmail,
  buildWelcomeEmail,
  type OrderLine,
} from '../_shared/transactionalEmailTemplates.ts'

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

function asString(value: unknown, max = 500): string {
  if (value == null) return ''
  const s = String(value).trim()
  return s.length > max ? s.slice(0, max) : s
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number.parseFloat(value.replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function parseItems(raw: unknown): OrderLine[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const name = asString(o.name ?? o.product_name, 300)
      if (!name) return null
      return {
        name,
        quantity: Math.max(1, Math.floor(asNumber(o.quantity))),
        unitImponibile: asNumber(o.unitImponibile ?? o.unit_imponibile ?? o.price),
        variant: asString(o.variant, 120) || undefined,
      }
    })
    .filter((x): x is OrderLine => Boolean(x))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return corsOk()
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const apiKey = Deno.env.get('RESEND_API_KEY')?.trim()
  if (!apiKey) {
    return json(
      {
        error:
          'RESEND_API_KEY non configurata. Imposta il secret Supabase: supabase secrets set RESEND_API_KEY=re_...',
      },
      500,
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'JSON non valido' }, 400)
  }

  const type = asString(body.type, 64)
  const to = asString(body.to ?? body.email, 320)
  if (!to || !to.includes('@')) {
    return json({ error: 'Destinatario email mancante o non valido' }, 400)
  }

  let subject = ''
  let html = ''

  if (type === 'welcome') {
    const built = buildWelcomeEmail({ firstName: asString(body.firstName, 80) || undefined })
    subject = built.subject
    html = built.html
  } else if (type === 'order_confirmation') {
    const orderRef = asString(body.orderRef, 64)
    if (!orderRef) return json({ error: 'orderRef obbligatorio' }, 400)
    const built = buildOrderConfirmationEmail({
      customerName: asString(body.customerName, 160) || undefined,
      orderRef,
      items: parseItems(body.items),
      taxableTotal: asNumber(body.taxableTotal),
      vatAmount: asNumber(body.vatAmount),
      shippingFee: asNumber(body.shippingFee),
      totalWithVat: asNumber(body.totalWithVat),
      deliveryMethod: asString(body.deliveryMethod, 120) || undefined,
      shippingAddress: asString(body.shippingAddress, 400) || undefined,
    })
    subject = built.subject
    html = built.html
  } else if (type === 'shipping') {
    const orderRef = asString(body.orderRef, 64)
    if (!orderRef) return json({ error: 'orderRef obbligatorio' }, 400)
    const built = buildShippingEmail({
      customerName: asString(body.customerName, 160) || undefined,
      orderRef,
      trackingNumber: asString(body.trackingNumber, 120) || undefined,
      shippingAddress: asString(body.shippingAddress, 400) || undefined,
    })
    subject = built.subject
    html = built.html
  } else {
    return json(
      { error: 'type non supportato. Usa: welcome | order_confirmation | shipping' },
      400,
    )
  }

  const from = asString(Deno.env.get('RESEND_FROM'), 200) || EMAIL_FROM_DEFAULT
  const resend = new Resend(apiKey)

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: EMAIL_SUPPORT,
    })
    if (result.error) {
      console.error('[send-transactional-email] Resend error:', result.error)
      return json({ error: result.error.message }, 502)
    }
    return json({ ok: true, id: result.data?.id ?? null })
  } catch (err) {
    console.error('[send-transactional-email] exception:', err)
    return json(
      { error: err instanceof Error ? err.message : 'Invio email fallito' },
      502,
    )
  }
})
