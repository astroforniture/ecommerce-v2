/**
 * Google Merchant Center ù feed XML dinamico.
 *
 * Scheduled fetch in Merchant Center:
 *   https://www.asforniture.it/api/google-merchant-feed
 *
 * Env (Vercel / .env):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (o SUPABASE_SERVICE_ROLE_KEY)
 *   VITE_SITE_URL (opzionale, default https://www.asforniture.it)
 *   MERCHANT_FEED_TOKEN (opzionale: richiede ?token= o Bearer)
 *
 * Query: ?format=json per debug item list.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  buildGoogleMerchantFeedXml,
  resolveMerchantFeedEnv,
} from '../src/lib/googleMerchantCatalog'

function readBearer(req: VercelRequest): string {
  const h = req.headers.authorization ?? req.headers.Authorization
  const raw = Array.isArray(h) ? h[0] : h
  if (!raw) return ''
  const m = /^Bearer\s+(.+)$/i.exec(raw.trim())
  return m?.[1]?.trim() ?? ''
}

function isAuthorized(req: VercelRequest): boolean {
  const expected = (process.env.MERCHANT_FEED_TOKEN ?? '').trim()
  if (!expected) return true
  const q = typeof req.query.token === 'string' ? req.query.token.trim() : ''
  if (q && q === expected) return true
  const bearer = readBearer(req)
  return bearer === expected
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { xml, items, dbCount, syntheticCount } = await buildGoogleMerchantFeedXml(
      resolveMerchantFeedEnv(process.env),
    )
    const wantJson =
      typeof req.query.format === 'string' && req.query.format.toLowerCase() === 'json'

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    if (wantJson) {
      return res.status(200).json({
        count: items.length,
        dbCount,
        syntheticCount,
        items,
      })
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    if (req.method === 'HEAD') {
      return res.status(200).end()
    }
    return res.status(200).send(xml)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[google-merchant-feed]', message)
    return res.status(500).json({ error: 'Failed to build merchant feed', detail: message })
  }
}
