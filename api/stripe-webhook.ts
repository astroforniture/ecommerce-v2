/**
 * Proxy webhook Stripe ? Supabase Edge Function `stripe-webhook`.
 *
 * Endpoint pubblico (configurare in Stripe Dashboard):
 *   https://asforniture.it/api/stripe-webhook
 *
 * Motivo: evita URL Supabase tipografati / problemi DNS lato Stripe.
 * Inoltra body grezzo + header `stripe-signature` (necessari per verify).
 *
 * Project ref corretto: nkvwtnnavcgnxulniopd (NON nkwvtnnavcgnxulniopd).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Readable } from 'node:stream'

export const config = {
  api: {
    bodyParser: false,
  },
}

const DEFAULT_SUPABASE_URL = 'https://nkvwtnnavcgnxulniopd.supabase.co'

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const already = (req as VercelRequest & { rawBody?: Buffer | string }).rawBody
  if (typeof already === 'string') return Buffer.from(already)
  if (Buffer.isBuffer(already)) return already

  const chunks: Buffer[] = []
  const stream = req as unknown as Readable
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

function resolveSupabaseUrl(): string {
  const fromEnv = (
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  )
    .trim()
    .replace(/\/$/, '')
  // Blocca il typo frequente che Stripe ha usato (DNS NXDOMAIN).
  if (/nkwvtnnavcgnxulniopd/i.test(fromEnv)) {
    console.error('[api/stripe-webhook] typo project ref detected, forcing correct URL')
    return DEFAULT_SUPABASE_URL
  }
  return fromEnv || DEFAULT_SUPABASE_URL
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'content-type, stripe-signature, authorization, apikey',
    )
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const signatureHeader = req.headers['stripe-signature']
  const stripeSignature = Array.isArray(signatureHeader)
    ? signatureHeader[0]
    : signatureHeader

  if (!stripeSignature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  let rawBody: Buffer
  try {
    rawBody = await readRawBody(req)
  } catch (err) {
    console.error('[api/stripe-webhook] raw body read failed:', err)
    return res.status(400).json({ error: 'Unable to read request body' })
  }

  if (!rawBody.length) {
    return res.status(400).json({ error: 'Empty body' })
  }

  const supabaseUrl = resolveSupabaseUrl()
  const target = `${supabaseUrl}/functions/v1/stripe-webhook`
  const anonKey = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()

  const headers: Record<string, string> = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'stripe-signature': stripeSignature,
  }
  if (anonKey) {
    headers.Authorization = `Bearer ${anonKey}`
    headers.apikey = anonKey
  }

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers,
      body: rawBody,
    })

    const text = await upstream.text()
    const contentType = upstream.headers.get('content-type') || 'application/json'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(upstream.status).send(text)
  } catch (err) {
    console.error('[api/stripe-webhook] forward failed:', err)
    return res.status(502).json({
      error: 'Failed to forward webhook to Supabase',
      detail: err instanceof Error ? err.message : String(err),
      target,
    })
  }
}
