/**
 * Trovaprezzi product feed endpoint (handler serverless flat — path affidabile su Vercel).
 *
 * Path canonici (rewrite + alias):
 *   https://asforniture.it/api/feeds/trovaprezzi
 *   https://asforniture.it/api/feeds/trovaprezzi?format=csv
 *   https://asforniture.it/api/trovaprezzi-feed
 *   https://asforniture.it/feeds/trovaprezzi.xml
 *   https://asforniture.it/feeds/trovaprezzi.csv
 *
 * Il campo Price è sempre IVA inclusa. ShippingCost segue le regole carrello.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/** Preferisci apex: www risponde 308 Permanent Redirect. */
const SITE_ORIGIN = 'https://asforniture.it'

async function loadFeed(format: 'xml' | 'csv'): Promise<string> {
  const fileName = format === 'csv' ? 'trovaprezzi.csv' : 'trovaprezzi.xml'
  const candidates = [
    path.join(process.cwd(), 'public', 'feeds', fileName),
    path.join(process.cwd(), 'feeds', fileName),
    path.join(process.cwd(), 'dist', 'feeds', fileName),
    // Output Vite su Vercel a volte è sotto .vercel/output/static
    path.join(process.cwd(), '.vercel', 'output', 'static', 'feeds', fileName),
  ]
  for (const filePath of candidates) {
    try {
      return await readFile(filePath, 'utf8')
    } catch {
      // try next
    }
  }

  const origin = (process.env.VITE_SITE_URL || SITE_ORIGIN).replace(/\/$/, '')
  // Evita loop www↔apex: prova apex e www.
  const origins = Array.from(
    new Set([
      origin.replace('://www.', '://'),
      origin.includes('://www.') ? origin : origin.replace('://', '://www.'),
      SITE_ORIGIN,
    ]),
  )
  let lastStatus = 0
  for (const base of origins) {
    const res = await fetch(`${base}/feeds/${fileName}`, { redirect: 'follow' })
    if (res.ok) return await res.text()
    lastStatus = res.status
  }
  throw new Error(`Unable to load Trovaprezzi feed (${lastStatus || 'missing'})`)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const formatRaw =
    typeof req.query.format === 'string' ? req.query.format.toLowerCase() : 'xml'
  const format: 'xml' | 'csv' = formatRaw === 'csv' ? 'csv' : 'xml'

  try {
    const body = await loadFeed(format)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.setHeader(
      'Content-Type',
      format === 'csv'
        ? 'text/csv; charset=utf-8'
        : 'application/xml; charset=utf-8',
    )
    if (req.method === 'HEAD') return res.status(200).end()
    return res.status(200).send(body)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trovaprezzi-feed]', message)
    return res.status(500).json({ error: 'Failed to serve Trovaprezzi feed', detail: message })
  }
}
