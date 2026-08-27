/**
 * Disattiva visibilita dei 18 articoli cancelleria su public.products (produzione).
 * Uso: node --env-file=.env --env-file=.env.local scripts/hide-cancelleria-18.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SKUS = [
  'AF-LEBEZ-3039',
  'AF-LEBEZ-80328',
  'AF-CALC-SHAEL1901',
  'AF-CALC-LBZ-81913',
  'AF-CALC-LBZ-81914',
  'AF-CALC-81499',
  'AF-CALC-LBZ-81917',
  'AF-CALC-80344',
  'AF-CALC-CANMP1211LTSC',
  'AF-CALC-CANP1DTSC',
  'AF-CALC-CANAS8HB',
  'AF-TOMB-60484',
  'AF-TOMB-29072',
  'AF-LEBEZ-1303',
  'AF-LEBEZ-1303B',
  'AF-PENT-105426',
  'AF-PENT-105424',
  'AF-PENT-105425',
  '3039',
  '80328',
  '81913',
  '81914',
  '81499',
  '81917',
  '80344',
  'SHAEL1901',
  'EL1901',
  'CANAS8HB',
  'AS8HB',
  '2304C001',
  '105424',
  '105425',
  '105426',
  '60484',
  '29072',
  '1303',
  '1303B',
]

const NAME_PATTERNS = [
  '%Barattolo matita HB 100%',
  '%Barattolo matita HB Neon%',
  '%EL 1901%',
  '%EL1901%',
  '%FX CG50%',
  '%HR-8RCE%',
  '%MP-1211%',
  '%P1-DTSC%',
  '%AS8HB%',
  '%Mono Correction%',
  '%Floatune%',
  '%Matita HB 12 pz%Lebez%',
  '%Matita HB 4 pz%Lebez%',
  '%Calcolatrice scientifica%Lebez%',
  '%MAXI a 12 cifre%81913%',
  '%MAXI a 12 cifre%81914%',
  '%Correttore a nastro%Tombow%ricaricabile%',
]

function env(name) {
  return String(process.env[name] ?? '').trim()
}

async function main() {
  const url = env('VITE_SUPABASE_URL')
  const key = env('SUPABASE_SERVICE_ROLE_KEY') || env('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) {
    console.error('[hide-18] Mancano VITE_SUPABASE_URL e chiave service/anon.')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const seen = new Set()
  let updated = 0

  const { data: bySku, error: skuErr } = await supabase
    .from('products')
    .update({ is_catalog_visible: false })
    .in('sku', SKUS)
    .select('id,sku,name')

  if (skuErr) {
    console.error('[hide-18] update by sku:', skuErr.message)
  } else {
    for (const row of bySku ?? []) {
      const id = String(row.id)
      if (seen.has(id)) continue
      seen.add(id)
      updated += 1
      console.log('[hide-18] sku', row.sku, row.name)
    }
  }

  for (const pat of NAME_PATTERNS) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_catalog_visible: false })
      .ilike('name', pat)
      .select('id,sku,name')
    if (error) {
      console.error('[hide-18] update by name', pat, error.message)
      continue
    }
    for (const row of data ?? []) {
      const id = String(row.id)
      if (seen.has(id)) continue
      seen.add(id)
      updated += 1
      console.log('[hide-18] name', row.sku, row.name)
    }
  }

  console.log(`[hide-18] righe disattivate: ${updated}`)
}

main().catch((err) => {
  console.error('[hide-18] failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
