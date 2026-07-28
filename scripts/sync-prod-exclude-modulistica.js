/**
 * Sync novità locali → DB produzione, ESCLUDENDO Modulistica.
 *
 * Default: DRY-RUN (solo preview, nessuna scrittura).
 *
 * Preview:
 *   node scripts/sync-prod-exclude-modulistica.js
 *
 * Apply (richiede conferma esplicita):
 *   node scripts/sync-prod-exclude-modulistica.js --apply --confirm-production
 *
 * Connessione (in ordine):
 *   1) DATABASE_URL / SUPABASE_DB_URL / DIRECT_URL / POSTGRES_URL
 *   2) SUPABASE_SERVICE_ROLE_KEY (+ VITE_SUPABASE_URL)  [non usa anon key]
 *   3) supabase db query --linked -f …
 *
 * Payload SQL: scripts/sync-prod-exclude-modulistica.sql
 *   - upsert Cancelleria → Buste + AF-SACBOLL-BLASETTI
 *   - NON tocca category Modulistica / slug modulistica*
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sqlRel = path.join('scripts', 'sync-prod-exclude-modulistica.sql')
const sqlPath = path.join(root, sqlRel)

const args = new Set(process.argv.slice(2))
const APPLY = args.has('--apply')
const CONFIRM = args.has('--confirm-production')

function readEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[k]) process.env[k] = v
    }
  } catch {
    // ignore
  }
}

readEnvFile(path.join(root, '.env'))
readEnvFile(path.join(root, '.env.local'))

function databaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL ||
    ''
  )
}

function serviceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    ''
  )
}

function supabaseUrl() {
  return process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
}

async function previewViaCli() {
  console.log('\n=== PREVIEW produzione (read-only, esclusa Modulistica dal sync) ===\n')
  const { writeFileSync, unlinkSync } = await import('node:fs')
  const previewRel = path.join('scripts', '.sync-prod-preview-tmp.sql')
  const previewPath = path.join(root, previewRel)
  const previewSql = `select 'INCLUDE category' as bucket, slug as key, name as detail
from public.office_catalog_categories
where slug in ('cancelleria','buste','shopper','shopper-carta','shopper-plastica')
union all
select 'EXCLUDE category', slug, name
from public.office_catalog_categories
where slug = 'modulistica' or slug like 'modulistica-%'
union all
select 'INCLUDE product', sku, coalesce(image_url,'')
from public.products
where sku = 'AF-SACBOLL-BLASETTI'
   or sku ilike 'AF-SHOPPER-%'
   or sku = 'AF-TIMBRO-AZIENDE'
union all
select 'EXCLUDE product count', 'Modulistica', count(*)::text
from public.products
where category = 'Modulistica'
order by 1, 2;
`
  writeFileSync(previewPath, previewSql, 'utf8')
  try {
    const cmd = `npx supabase db query --linked -f "${previewRel.replace(/\\/g, '/')}" -o table`
    const result = spawnSync(cmd, {
      cwd: root,
      encoding: 'utf8',
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 180_000,
    })
    const out = `${result.stdout || ''}${result.stderr || ''}`.trim()
    if (out) console.log(out)
    if (result.status !== 0) {
      throw new Error(`Preview CLI fallita (exit ${result.status})`)
    }
  } finally {
    try {
      unlinkSync(previewPath)
    } catch {
      // ignore
    }
  }
}

async function applyViaDatabaseUrl(sqlText) {
  const url = databaseUrl()
  if (!url) return { ok: false, reason: 'missing-database-url' }
  console.log('APPLY via DATABASE_URL…')
  const postgres = (await import('postgres')).default
  const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 20 })
  try {
    await sql.unsafe(sqlText)
    return { ok: true, via: 'database-url' }
  } finally {
    await sql.end({ timeout: 5 })
  }
}

async function applyViaServiceRole() {
  const url = supabaseUrl()
  const key = serviceRoleKey()
  if (!url || !key) return { ok: false, reason: 'missing-service-role' }

  console.log('APPLY via SUPABASE_SERVICE_ROLE_KEY (RPC upsert_cancelleria_buste_sacboll)…')
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // La service role può eseguire la funzione security definer dopo che il SQL
  // l'ha creata; se la funzione non esiste ancora, serve DATABASE_URL / CLI.
  const { data, error } = await supabase.rpc('upsert_cancelleria_buste_sacboll')
  if (error) {
    console.error(`RPC error: ${error.message}`)
    return { ok: false, reason: error.message, via: 'service-role' }
  }
  console.log('RPC result:', data)
  return { ok: true, via: 'service-role', data }
}

async function applyViaCli() {
  if (!existsSync(sqlPath)) throw new Error(`SQL mancante: ${sqlRel}`)
  console.log('APPLY via supabase db query --linked…')
  const cmd = `npx supabase db query --linked -f "${sqlRel.replace(/\\/g, '/')}" -o table`
  const result = spawnSync(cmd, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 180_000,
  })
  const out = `${result.stdout || ''}${result.stderr || ''}`.trim()
  if (out) console.log(out)
  if (result.status !== 0) {
    return { ok: false, reason: `cli-exit-${result.status}`, via: 'supabase-cli' }
  }
  return { ok: true, via: 'supabase-cli' }
}

async function apply() {
  const sqlText = readFileSync(sqlPath, 'utf8')

  try {
    const viaDb = await applyViaDatabaseUrl(sqlText)
    if (viaDb.ok) return viaDb
    if (viaDb.reason === 'missing-database-url') {
      console.warn('DATABASE_URL assente, provo SERVICE_ROLE…')
    }
  } catch (err) {
    console.error(`DATABASE_URL fallita: ${err?.message || err}`)
    console.warn('Provo SERVICE_ROLE…')
  }

  try {
    const viaRole = await applyViaServiceRole()
    if (viaRole.ok) return viaRole
    console.warn('SERVICE_ROLE non disponibile/riuscita, provo supabase CLI --linked…')
  } catch (err) {
    console.error(`SERVICE_ROLE fallita: ${err?.message || err}`)
  }

  return applyViaCli()
}

console.log('Sync produzione (esclusa Modulistica)')
console.log(`SQL payload: ${sqlRel}`)
console.log(
  `Credenziali: DATABASE_URL=${databaseUrl() ? 'set' : 'missing'}, SERVICE_ROLE=${serviceRoleKey() ? 'set' : 'missing'}, SUPABASE_URL=${supabaseUrl() ? 'set' : 'missing'}`,
)

if (!existsSync(sqlPath)) {
  console.error(`File SQL non trovato: ${sqlPath}`)
  process.exit(1)
}

await previewViaCli()

console.log('\n--- Piano di sync ---')
console.log('INCLUDE:')
console.log('  - office_catalog_categories: cancelleria (se assente), buste')
console.log('  - products: AF-SACBOLL-BLASETTI (+ 10 varianti JSONB, immagini /images/sacboll/*)')
console.log('  - cleanup legacy: AF-SACBOLL-AVANA*, AF-SACBOLL-BIANCO*')
console.log('EXCLUDE (nessuna scrittura):')
console.log("  - category = 'Modulistica'")
console.log("  - slug = 'modulistica' OR slug LIKE 'modulistica-%'")
console.log("  - SKU Edipro / migrations 036–041")

if (!APPLY) {
  console.log('\nDRY-RUN: nessuna scrittura eseguita.')
  console.log('Per applicare su produzione:')
  console.log('  node scripts/sync-prod-exclude-modulistica.js --apply --confirm-production')
  process.exit(0)
}

if (!CONFIRM) {
  console.error('\nRifiutato: --apply richiede anche --confirm-production')
  process.exit(1)
}

console.log('\n>>> CONFERMA RICEVUTA: applico sync su produzione…\n')
const result = await apply()
if (!result.ok) {
  console.error('Sync fallito:', result)
  process.exit(1)
}
console.log(`\nSync completato (via ${result.via}). Modulistica non è stata inclusa nel payload.`)
