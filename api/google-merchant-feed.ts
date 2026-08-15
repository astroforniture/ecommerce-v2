/**
 * Google Merchant Center — feed XML endpoint.
 *
 * Merchant Center scheduled fetch:
 *   https://www.asforniture.it/api/google-merchant-feed
 *   https://www.asforniture.it/feeds/google-merchant-feed.xml
 *
 * Il catalogo completo (DB + sintetici, prezzi IVA inclusa) è generato al build in
 * `public/feeds/google-merchant-feed.xml`. Questo handler lo espone con auth opzionale
 * e `?format=json` senza importare i moduli Vite da `src/` (incompatibili col bundler API).
 *
 * Env: MERCHANT_FEED_TOKEN (opzionale), VITE_SITE_URL (opzionale)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_ORIGIN = 'https://www.asforniture.it'

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
  return readBearer(req) === expected
}

async function loadFeedXml(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), 'public', 'feeds', 'google-merchant-feed.xml'),
    path.join(process.cwd(), 'feeds', 'google-merchant-feed.xml'),
    path.join(process.cwd(), 'dist', 'feeds', 'google-merchant-feed.xml'),
  ]
  for (const filePath of candidates) {
    try {
      return await readFile(filePath, 'utf8')
    } catch {
      // try next
    }
  }

  const origin = (process.env.VITE_SITE_URL || SITE_ORIGIN).replace(/\/$/, '')
  const res = await fetch(`${origin}/feeds/google-merchant-feed.xml`)
  if (!res.ok) {
    throw new Error(`Unable to load merchant feed XML (${res.status})`)
  }
  return await res.text()
}

function parseItemsFromXml(xml: string): Array<Record<string, string | string[]>> {
  const items: Array<Record<string, string | string[]>> = []
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []
  for (const block of itemBlocks) {
    const get = (tag: string): string => {
      const m = new RegExp(`<g:${tag}>([\\s\\S]*?)</g:${tag}>`).exec(block)
      if (!m) return ''
      return m[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
    }
    const additional: string[] = []
    const addRe = /<g:additional_image_link>([\s\S]*?)<\/g:additional_image_link>/g
    let am: RegExpExecArray | null
    while ((am = addRe.exec(block))) {
      additional.push(
        am[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'"),
      )
    }
    items.push({
      id: get('id'),
      title: get('title'),
      description: get('description'),
      link: get('link'),
      image_link: get('image_link'),
      price: get('price'),
      availability: get('availability'),
      brand: get('brand'),
      google_product_category: get('google_product_category'),
      product_type: get('product_type') || undefined!,
      gtin: get('gtin') || undefined!,
      mpn: get('mpn') || undefined!,
      condition: get('condition') || 'new',
      ...(additional.length ? { additional_image_link: additional } : {}),
    })
  }
  return items
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
    const xml = await loadFeedXml()
    const wantJson =
      typeof req.query.format === 'string' && req.query.format.toLowerCase() === 'json'

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    if (wantJson) {
      const items = parseItemsFromXml(xml)
      return res.status(200).json({ count: items.length, items })
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    if (req.method === 'HEAD') {
      return res.status(200).end()
    }
    return res.status(200).send(xml)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[google-merchant-feed]', message)
    return res.status(500).json({ error: 'Failed to serve merchant feed', detail: message })
  }
}
