/**
 * Audit EAN/GTIN: colonna products.ean + ean nelle variants JSONB + feed generato.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import {
  buildGoogleMerchantFeedItems,
  resolveMerchantFeedEnv,
} from '../src/lib/googleMerchantCatalog'
import {
  extractOfficeProductEan,
  mapMerchantItemToTrovaprezziOffer,
  normalizeTrovaprezziEan,
} from '../src/lib/trovaprezziFeed'

async function readEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (k && !process.env[k]) process.env[k] = v
    }
  } catch {
    // ok
  }
}

function parseVariants(raw: unknown): Array<Record<string, unknown>> {
  let value = raw
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return []
    }
  }
  if (Array.isArray(value)) return value as Array<Record<string, unknown>>
  if (value && typeof value === 'object' && Array.isArray((value as { options?: unknown }).options)) {
    return (value as { options: Array<Record<string, unknown>> }).options
  }
  return []
}

function eanFromVariants(raw: unknown): string | undefined {
  for (const v of parseVariants(raw)) {
    const hit = normalizeTrovaprezziEan(
      String(v.ean ?? v.gtin ?? v.barcode ?? v.EAN ?? ''),
    )
    if (hit) return hit
  }
  return undefined
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const env = resolveMerchantFeedEnv(process.env)
  if (!env.supabaseUrl || !env.supabaseKey) {
    console.error('Missing Supabase env')
    process.exit(1)
  }

  const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const rows: Array<{
    id: string
    sku: string | null
    ean: string | null
    variants: unknown
  }> = []
  let from = 0
  const PAGE = 1000
  for (;;) {
    const { data, error } = await supabase
      .from('products')
      .select('id,sku,ean,variants')
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    const batch = data ?? []
    rows.push(...(batch as typeof rows))
    if (batch.length < PAGE) break
    from += PAGE
  }

  let colEan = 0
  let variantEanOnly = 0
  let either = 0
  for (const row of rows) {
    const fromCol = normalizeTrovaprezziEan(row.ean)
    const fromVar = eanFromVariants(row.variants)
    if (fromCol) colEan += 1
    if (!fromCol && fromVar) variantEanOnly += 1
    if (fromCol || fromVar) either += 1
  }

  const { items } = await buildGoogleMerchantFeedItems(env)
  const offers = items
    .map((i) => mapMerchantItemToTrovaprezziOffer(i))
    .filter((o): o is NonNullable<typeof o> => o != null)
  const feedWithEan = offers.filter((o) => o.eanCode).length
  const merchantWithGtin = items.filter((i) => i.gtin).length

  // Probe columns that might exist
  const probe = await supabase.from('products').select('*').limit(1).maybeSingle()
  const sampleKeys = probe.data ? Object.keys(probe.data).sort() : []
  const eanLikeCols = sampleKeys.filter((k) =>
    /ean|gtin|barcode|upc|isbn/i.test(k),
  )

  console.log(
    JSON.stringify(
      {
        dbTotalProducts: rows.length,
        dbColumnEanValid: colEan,
        dbVariantEanOnly: variantEanOnly,
        dbEitherEan: either,
        eanLikeColumnsOnProducts: eanLikeCols,
        merchantItems: items.length,
        merchantWithGtin,
        feedOffers: offers.length,
        feedWithEanCode: feedWithEan,
      },
      null,
      2,
    ),
  )

  void extractOfficeProductEan
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
