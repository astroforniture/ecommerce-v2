/**
 * Aggiorna catalogo Modulistica (locale + DB) con titoli/EAN/immagini.
 * Scrive su Postgres via DATABASE_URL (preferito) oppure SUPABASE_SERVICE_ROLE_KEY.
 * Uso: node update-products.js
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'node:url'
import { buildModulisticaImageProducts } from './scripts/build-modulistica-image-products.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname

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

/** Prodotti Modulistica con immagine mappata da public/images. */
const productsToUpdate = buildModulisticaImageProducts()

function assertImagesExist() {
  const missing = []
  for (const p of productsToUpdate) {
    const rel = p.image.replace(/^\//, '')
    const abs = path.join(root, 'public', rel.replace(/^images\//, 'images/'))
    // p.image is /images/xxx.jpg → public/images/xxx.jpg
    const filePath = path.join(root, 'public', ...p.image.split('/').filter(Boolean))
    if (!existsSync(filePath)) missing.push({ sku: p.sku, image: p.image, filePath })
    void abs
    void rel
  }
  if (missing.length) {
    console.error('Immagini mancanti su disco:')
    for (const m of missing) console.error(`  ${m.sku}: ${m.image}`)
    process.exit(1)
  }
  console.log(`OK: ${productsToUpdate.length} immagini trovate in public/`)
}

function updateLocalCatalogTs() {
  const catalogPath = path.join(root, 'src', 'data', 'modulisticaCatalog.ts')
  let src = readFileSync(catalogPath, 'utf8')
  let changed = 0

  for (const p of productsToUpdate) {
    const skuEsc = p.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const blockRe = new RegExp(
      `(sku:\\s*'${skuEsc}'[\\s\\S]*?)(\\n\\s*description:\\s*)`,
      'm',
    )
    if (!blockRe.test(src)) {
      console.warn(`  [catalog] SKU non trovato: ${p.sku}`)
      continue
    }
    src = src.replace(blockRe, (full, before, descKey) => {
      let next = before
      if (/imageUrl:\s*'[^']*'/.test(next)) {
        next = next.replace(/imageUrl:\s*'[^']*'/, `imageUrl: '${p.image}'`)
      } else {
        next = `${next}\n    imageUrl: '${p.image}',`
      }
      if (p.ean) {
        if (/ean:\s*'[^']*'/.test(next)) {
          next = next.replace(/ean:\s*'[^']*'/, `ean: '${p.ean}'`)
        }
      }
      return `${next}${descKey}`
    })
    changed += 1
  }

  writeFileSync(catalogPath, src, 'utf8')
  console.log(`OK: catalogo TS aggiornato (${changed}/${productsToUpdate.length} SKU)`)
}

function writeSqlMigration() {
  const out = path.join(root, 'supabase', 'migrations', '042_modulistica_product_images_full.sql')
  const lines = [
    '-- Modulistica: aggiorna image_url per tutti i prodotti mappati (generato da update-products.js)',
    '',
  ]
  for (const p of productsToUpdate) {
    const esc = (s) => String(s).replace(/'/g, "''")
    lines.push(
      `update public.products set ` +
        `name = '${esc(p.title)}', ` +
        `image_url = '${esc(p.image)}', ` +
        `brand = '${esc(p.brand)}', ` +
        `category = '${esc(p.category)}', ` +
        `subcategory = '${esc(p.subcategory)}', ` +
        `format = '${esc(p.format)}', ` +
        `ean = ${p.ean ? `'${esc(p.ean)}'` : 'null'}, ` +
        `description = '${esc(p.description)}' ` +
        `where sku = '${esc(p.sku)}';`,
    )
    lines.push(
      `insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock) ` +
        `select '${esc(p.sku)}', '${esc(p.title)}', 0, '${esc(p.image)}', '${esc(p.brand)}', '${esc(p.category)}', '${esc(p.subcategory)}', '${esc(p.format)}', ${p.ean ? `'${esc(p.ean)}'` : 'null'}, '${esc(p.description)}', 100 ` +
        `where not exists (select 1 from public.products where sku = '${esc(p.sku)}');`,
    )
    lines.push('')
  }
  lines.push(
    `select count(*)::int as modulistica_with_local_images from public.products where category = 'Modulistica' and image_url like '/images/%';`,
  )
  writeFileSync(out, lines.join('\n'), 'utf8')
  console.log(`OK: SQL scritto in ${path.relative(root, out)}`)
  return out
}

async function upsertViaDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL

  if (!databaseUrl) return { ok: false, reason: 'missing-database-url' }

  console.log('DB: connessione diretta via DATABASE_URL…')
  const postgres = (await import('postgres')).default
  const sql = postgres(databaseUrl, { max: 1, idle_timeout: 5, connect_timeout: 15 })

  try {
    let ok = 0
    for (const p of productsToUpdate) {
      const rows = await sql`
        insert into public.products (
          sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock
        ) values (
          ${p.sku}, ${p.title}, 0, ${p.image}, ${p.brand}, ${p.category},
          ${p.subcategory}, ${p.format}, ${p.ean}, ${p.description}, 100
        )
        on conflict (sku) do update set
          name = excluded.name,
          image_url = excluded.image_url,
          brand = excluded.brand,
          category = excluded.category,
          subcategory = excluded.subcategory,
          format = excluded.format,
          ean = excluded.ean,
          description = excluded.description,
          stock = excluded.stock
        returning sku
      `
      ok += 1
      console.log(`  [db] upsert OK ${rows[0]?.sku ?? p.sku}`)
    }
    console.log(`Database URL: ${ok}/${productsToUpdate.length} ok`)
    return { ok: true, okCount: ok, failCount: 0, via: 'database-url' }
  } finally {
    await sql.end({ timeout: 5 })
  }
}

async function upsertViaServiceRole() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return { ok: false, reason: 'missing-service-role' }

  console.log('DB: upsert via SUPABASE_SERVICE_ROLE_KEY (bypass RLS)…')
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let ok = 0
  let fail = 0
  for (const p of productsToUpdate) {
    const row = {
      sku: p.sku,
      name: p.title,
      price: 0,
      image_url: p.image,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      format: p.format,
      ean: p.ean,
      description: p.description,
      stock: 100,
    }
    const { error } = await supabase.from('products').upsert(row, { onConflict: 'sku' })
    if (error) {
      fail += 1
      console.error(`  [service-role] ${p.sku}: ${error.message}`)
    } else {
      ok += 1
      console.log(`  [service-role] upsert OK ${p.sku}`)
    }
  }
  console.log(`Service role: ${ok} ok, ${fail} errori`)
  return { ok: fail === 0, okCount: ok, failCount: fail, via: 'service-role' }
}

async function upsertViaSupabaseCliLinked() {
  const sqlRel = path.join('supabase', 'migrations', '042_modulistica_product_images_full.sql')
  const sqlPath = path.join(root, sqlRel)
  if (!existsSync(sqlPath)) return { ok: false, reason: 'missing-sql' }

  console.log('DB: applico SQL via `supabase db query --linked` (Management API)…')
  const { spawnSync } = await import('node:child_process')
  // Path con spazi (es. "Astro Forniture"): usare percorso relativo + shell command quotato.
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
    console.error(`supabase db query exit code ${result.status}`)
    return { ok: false, reason: 'supabase-cli-failed', via: 'supabase-cli' }
  }

  console.log(`Supabase CLI linked: SQL applicato (${productsToUpdate.length} SKU)`)
  return { ok: true, okCount: productsToUpdate.length, failCount: 0, via: 'supabase-cli' }
}

async function updateDatabase() {
  // 1) Preferenza: connessione Postgres diretta (bypass RLS)
  try {
    const viaDb = await upsertViaDatabaseUrl()
    if (viaDb.ok) return viaDb
    if (viaDb.reason === 'missing-database-url') {
      console.warn('DATABASE_URL non impostata, provo SUPABASE_SERVICE_ROLE_KEY…')
    }
  } catch (err) {
    console.error(`DATABASE_URL fallita: ${err?.message || err}`)
    console.warn('Provo SUPABASE_SERVICE_ROLE_KEY…')
  }

  // 2) Fallback: service role key (mai la anon key: è bloccata da RLS)
  try {
    const viaRole = await upsertViaServiceRole()
    if (viaRole.ok) return viaRole
    if (viaRole.reason === 'missing-service-role') {
      console.warn('SUPABASE_SERVICE_ROLE_KEY assente, provo supabase CLI --linked…')
    } else {
      console.warn('Service role non riuscita, provo supabase CLI --linked…')
    }
  } catch (err) {
    console.error(`SERVICE_ROLE fallita: ${err?.message || err}`)
    console.warn('Provo supabase CLI --linked…')
  }

  // 3) Fallback progetto linkato: esegue la migration senza anon key
  try {
    return await upsertViaSupabaseCliLinked()
  } catch (err) {
    console.error(`Supabase CLI fallita: ${err?.message || err}`)
    console.error(
      'Imposta DATABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env, oppure collega il progetto con `supabase link`.',
    )
    return { ok: false, reason: 'all-methods-failed' }
  }
}

console.log('Totale prodotti pronti per inserimento/aggiornamento:', productsToUpdate.length)
assertImagesExist()
updateLocalCatalogTs()
writeSqlMigration()
const dbResult = await updateDatabase()
if (!dbResult.ok) process.exitCode = 1
console.log(dbResult.ok ? `Fatto (via ${dbResult.via}).` : 'Fatto con errori DB.')
