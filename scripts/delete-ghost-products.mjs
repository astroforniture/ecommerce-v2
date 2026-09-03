/**
 * Elimina/nasconde prodotti fantasma Combi Screen / Urilyzer con immagini errate.
 *
 * Uso:
 *   node --env-file=.env --env-file=.env.local scripts/delete-ghost-products.mjs
 *
 * Preferisce `is_catalog_visible = false` se la colonna esiste; altrimenti DELETE.
 * Non tocca il prodotto reale GIMA 24050 (Urilyzer 500 PRO) se presente in DB.
 */
import { createClient } from '@supabase/supabase-js'

const GHOST_IDS = [
  'gima-32100',
  'gima-32200',
  'gima-32300',
  'gima-32410',
  'gima-32411',
  'gima-32412',
  'gima-32413',
  'gima-32414',
  'gima-32415',
  'AF-DIAG-analisi-urina-gima',
  'AF-DIAG-urilyzer-100',
  'AF-DIAG-urilyzer-500',
  'AF-DIAG-combi-screen-2p',
  'AF-DIAG-combi-screen-5p',
  'AF-DIAG-combi-screen-8p',
  'AF-DIAG-combi-screen-10p',
  'AF-DIAG-combi-screen-11p',
  'AF-DIAG-combi-screen-13p',
]

const GHOST_SKUS = [
  '32100',
  '32200',
  '32300',
  '32410',
  '32411',
  '32412',
  '32413',
  '32414',
  '32415',
  ...GHOST_IDS,
]

const GHOST_NAME_PATTERNS = [
  '%Strisce Combi Screen%',
  '%Combi Screen%',
  '%Urilyzer 100%',
  '%Urilyzer 500%',
  '%Analizzatore analisi urina Gima%',
]

function env(name) {
  return String(process.env[name] ?? '').trim()
}

function isMissingColumnError(error) {
  const msg = `${error?.message ?? ''}`.toLowerCase()
  return msg.includes('column') && (msg.includes('does not exist') || msg.includes('schema cache'))
}

async function main() {
  const url = env('VITE_SUPABASE_URL')
  const key = env('SUPABASE_SERVICE_ROLE_KEY') || env('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) {
    console.error('[ghost] Mancano VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_ANON_KEY.')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: byId, error: idErr } = await supabase
    .from('products')
    .select('id, sku, name, image_url, is_catalog_visible')
    .in('id', GHOST_IDS)

  if (idErr && !isMissingColumnError(idErr)) {
    console.warn('[ghost] select by id:', idErr.message)
  }

  const { data: bySku, error: skuErr } = await supabase
    .from('products')
    .select('id, sku, name, image_url')
    .in('sku', GHOST_SKUS)

  if (skuErr) console.warn('[ghost] select by sku:', skuErr.message)

  const byName = []
  for (const pattern of GHOST_NAME_PATTERNS) {
    const { data, error } = await supabase
      .from('products')
      .select('id, sku, name, image_url')
      .ilike('name', pattern)
    if (error) {
      console.warn('[ghost] select by name', pattern, error.message)
      continue
    }
    for (const row of data ?? []) {
      // Conserva Urilyzer 500 PRO reale (GIMA 24050).
      const name = String(row.name ?? '').toLowerCase()
      const sku = String(row.sku ?? '').toLowerCase()
      const id = String(row.id ?? '').toLowerCase()
      if (sku.includes('24050') || id.includes('24050') || name.includes('24050') || name.includes('pro con stampante')) {
        continue
      }
      byName.push(row)
    }
  }

  const map = new Map()
  for (const row of [...(byId ?? []), ...(bySku ?? []), ...byName]) {
    if (!row?.id) continue
    map.set(String(row.id), row)
  }
  const targets = [...map.values()]
  console.log('[ghost] match trovati:', targets.length)
  for (const row of targets) {
    console.log(`  - ${row.id} | ${row.sku ?? '-'} | ${row.name}`)
  }

  if (targets.length === 0) {
    console.log('[ghost] Nessun record Supabase da ripulire (probabilmente solo catalogo locale).')
    return
  }

  const ids = targets.map((r) => String(r.id))

  const hideRes = await supabase
    .from('products')
    .update({ is_catalog_visible: false })
    .in('id', ids)
    .select('id')

  if (!hideRes.error) {
    console.log('[ghost] nascosti (is_catalog_visible=false):', hideRes.data?.length ?? 0)
    return
  }

  if (!isMissingColumnError(hideRes.error)) {
    console.warn('[ghost] hide failed, provo DELETE:', hideRes.error.message)
  }

  const delRes = await supabase.from('products').delete().in('id', ids).select('id')
  if (delRes.error) {
    console.error('[ghost] DELETE fallita:', delRes.error.message)
    process.exit(1)
  }
  console.log('[ghost] eliminati:', delRes.data?.length ?? 0)
}

main().catch((err) => {
  console.error('[ghost] exception:', err)
  process.exit(1)
})
