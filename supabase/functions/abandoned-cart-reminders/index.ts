/**
 * Cron / manual job: marca cart_sessions pending > 2h come abandoned
 * e invia email di promemoria (Resend) con link al carrello.
 *
 * Auth: header Authorization Bearer <ABANDONED_CART_CRON_SECRET>
 *   oppure stesso valore in x-cron-secret.
 *
 * Scheduling (Supabase Dashboard > Edge Functions > Schedules, oppure pg_cron + net.http_post):
 *   ogni ora: POST /functions/v1/abandoned-cart-reminders
 */
import { Resend } from 'npm:resend@4.1.2'
import { getServiceSupabase } from '../_shared/supabaseAdmin.ts'
import {
  EMAIL_CART_URL,
  EMAIL_FROM_DEFAULT,
  EMAIL_SUPPORT,
  buildAbandonedCartEmail,
  type OrderLine,
} from '../_shared/transactionalEmailTemplates.ts'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'apikey, x-client-info, content-type, authorization, x-cron-secret, accept, cache-control, pragma, expires, x-supabase-api-version, prefer, origin',
  'Access-Control-Max-Age': '86400',
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function authorize(req: Request): boolean {
  const secret = Deno.env.get('ABANDONED_CART_CRON_SECRET')?.trim()
  if (!secret) {
    // Se non configurato, accetta solo chiamate con service role JWT (Supabase scheduler).
    const auth = req.headers.get('authorization') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? ''
    return Boolean(serviceKey && auth === `Bearer ${serviceKey}`)
  }
  const auth = req.headers.get('authorization') ?? ''
  const headerSecret = req.headers.get('x-cron-secret') ?? ''
  return auth === `Bearer ${secret}` || headerSecret === secret
}

function parseItemsJson(raw: unknown): OrderLine[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const name = String(o.name ?? '').trim()
      if (!name) return null
      const quantity = Number(o.quantity)
      return {
        name,
        quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1,
        unitImponibile: Number(o.unit_imponibile ?? o.unitImponibile ?? 0) || 0,
        variant: String(o.variant ?? '').trim() || undefined,
      }
    })
    .filter((x): x is OrderLine => Boolean(x))
}

type CartSessionRow = {
  id: string
  email: string
  items_json: unknown
  billing_json: unknown
  status: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }
  if (!authorize(req)) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const supabase = getServiceSupabase()
  if (!supabase) {
    return json({ error: 'Supabase admin client unavailable' }, 500)
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')?.trim()
  if (!apiKey) {
    return json({ error: 'RESEND_API_KEY missing' }, 500)
  }

  // 1) pending > 2 ore -> abandoned
  const { data: markedCount, error: markError } = await supabase.rpc(
    'mark_stale_cart_sessions_abandoned',
    { p_older_than: '2 hours' },
  )
  if (markError) {
    console.error('[abandoned-cart-reminders] mark stale failed:', markError.message)
    // Fallback SQL-like update se RPC non ancora migrata.
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const { error: updErr } = await supabase
      .from('cart_sessions')
      .update({ status: 'abandoned', updated_at: new Date().toISOString() })
      .eq('status', 'pending')
      .lt('updated_at', cutoff)
    if (updErr) {
      return json({ error: updErr.message }, 500)
    }
  }

  // 2) abandoned senza reminder
  const { data: rows, error: selectError } = await supabase
    .from('cart_sessions')
    .select('id, email, items_json, billing_json, status')
    .eq('status', 'abandoned')
    .is('reminder_sent_at', null)
    .order('updated_at', { ascending: true })
    .limit(40)

  if (selectError) {
    return json({ error: selectError.message }, 500)
  }

  const sessions = (rows ?? []) as CartSessionRow[]
  const resend = new Resend(apiKey)
  const from = Deno.env.get('RESEND_FROM')?.trim() || EMAIL_FROM_DEFAULT
  const cartUrl = Deno.env.get('PUBLIC_SITE_URL')?.trim()
    ? `${Deno.env.get('PUBLIC_SITE_URL')!.replace(/\/$/, '')}/cart`
    : EMAIL_CART_URL

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const session of sessions) {
    const email = String(session.email ?? '').trim()
    if (!email.includes('@')) {
      failed += 1
      continue
    }

    const billing =
      session.billing_json && typeof session.billing_json === 'object'
        ? (session.billing_json as Record<string, unknown>)
        : {}
    const customerName = String(billing.billingName ?? '').trim() || undefined
    const items = parseItemsJson(session.items_json)
    const built = buildAbandonedCartEmail({
      customerName,
      items,
      cartUrl,
    })

    try {
      const result = await resend.emails.send({
        from,
        to: email,
        subject: built.subject,
        html: built.html,
        replyTo: EMAIL_SUPPORT,
      })
      if (result.error) {
        failed += 1
        errors.push(`${session.id}: ${result.error.message}`)
        continue
      }

      const { error: updErr } = await supabase
        .from('cart_sessions')
        .update({
          reminder_sent_at: new Date().toISOString(),
          status: 'reminded',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id)

      if (updErr) {
        failed += 1
        errors.push(`${session.id}: mark reminded failed (${updErr.message})`)
        continue
      }
      sent += 1
    } catch (err) {
      failed += 1
      errors.push(`${session.id}: ${err instanceof Error ? err.message : 'send failed'}`)
    }
  }

  return json({
    ok: true,
    markedAbandoned: typeof markedCount === 'number' ? markedCount : null,
    candidates: sessions.length,
    sent,
    failed,
    errors: errors.slice(0, 10),
  })
})
