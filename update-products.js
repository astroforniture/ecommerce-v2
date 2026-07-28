/**
 * Aggiorna catalogo Modulistica (locale + DB) con titoli/EAN/immagini.
 * Scrive su Postgres via DATABASE_URL (preferito) oppure SUPABASE_SERVICE_ROLE_KEY.
 * Uso: node update-products.js
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'node:url'

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

/** Path immagini verificati su disco (corretti rispetto a typo comuni). */
const productsToUpdate = [
  {
    sku: 'E 5220 G',
    title:
      'Blocco documento di trasporto carico per tentata vendita 50×2 autoricalcante – Formato 29,7×22',
    category: 'Modulistica',
    subcategory: 'Documenti di Trasporto e Tentata Vendita',
    image: '/images/5a2bd0c9-2438-4f03-8594-7dbc2d48802d.jpg',
    ean: '8023328522018',
    format: '29,7 x 22 cm',
    brand: 'Edipro',
    description:
      'Blocco documento di trasporto carico per tentata vendita Edipro 50×2 autoricalcante, formato 29,7 × 22 cm.',
  },
  {
    sku: 'E 5221 C',
    title: 'Blocco D.D.T. fattura tentata vendita 50×2 autoricalcante – Formato 29,7×22',
    category: 'Modulistica',
    subcategory: 'Documenti di Trasporto e Tentata Vendita',
    image: '/images/3ed3120b-c35b-4039-a941-b10b6dca6d1c.jpg',
    ean: '8023328522117',
    format: '29,7 x 22 cm',
    brand: 'Edipro',
    description:
      'Blocco D.D.T. fattura tentata vendita Edipro 50×2 autoricalcante, formato 29,7 × 22 cm.',
  },
  {
    sku: 'E 5183',
    title: 'Blocco buono di consegna 100 fogli uso mano – Formato 9,9×17',
    category: 'Modulistica',
    subcategory: 'Buoni di Consegna e Ricevute',
    image: '/images/2cbbb207-0340-42bb-afd5-4217dd356ff0.jpg',
    ean: '8023328518301',
    format: '9,9 x 17 cm',
    brand: 'Edipro',
    description:
      'Blocco buono di consegna Edipro 100 fogli uso mano, formato 9,9 × 17 cm.',
  },
  {
    sku: 'E 3399',
    title: 'Schede - 2 colonne - 24 x 17 cm (verticale) - Edipro - conf. 100 pezzi',
    category: 'Modulistica',
    subcategory: 'Schede Contabili e Maste',
    image: '/images/0f73bb8f-8dbc-4b0a-bed3-69a6b148ad4f.jpg',
    ean: '8023328339906',
    format: '24 x 17 cm',
    brand: 'Edipro',
    description:
      'Schede contabili Edipro a 2 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3369',
    title: 'Schede - 3 colonne - 17 x 24 cm orizzontale - Edipro - conf. 100 pezzi',
    category: 'Modulistica',
    subcategory: 'Schede Contabili e Maste',
    image: '/images/67e70187-52d7-4788-bd05-54495c728c0c.jpg',
    ean: '8023328336905',
    format: '17 x 24 cm',
    brand: 'Edipro',
    description:
      'Schede contabili Edipro a 3 colonne, formato 17 × 24 cm orizzontale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3259',
    title: 'Schede - 3 colonne - 15 x 21 cm orizzontale - Edipro - conf. 100 pezzi',
    category: 'Modulistica',
    subcategory: 'Schede Contabili e Maste',
    image: '/images/80e3b5c6-de8e-4d92-bcb9-5dfe75970e79.jpg',
    ean: '8023328325909',
    format: '15 x 21 cm',
    brand: 'Edipro',
    description:
      'Schede contabili Edipro a 3 colonne, formato 15 × 21 cm orizzontale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3406',
    title: 'Schede - 3 colonne - 24 x 17 cm verticale - Edipro - conf. 100 pezzi',
    category: 'Modulistica',
    subcategory: 'Schede Contabili e Maste',
    image: '/images/9754b9bb-7d4e-4967-a8dd-a99dde182fe8.jpg',
    ean: '8023328340605',
    format: '24 x 17 cm',
    brand: 'Edipro',
    description:
      'Schede contabili Edipro a 3 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 5348 C',
    title: 'Blocco fattura/ricevuta fiscale barbiere 50×2 autoricalcante – Formato 22×9,9',
    category: 'Modulistica',
    subcategory: 'Ricevute Fiscali e Fatture',
    image: '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg',
    ean: '8023328534813',
    format: '22 x 9,9 cm',
    brand: 'Edipro',
    description:
      'Blocco fattura/ricevuta fiscale barbiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.',
  },
  {
    sku: 'E 5342 C',
    title: 'Blocco fattura/ricevuta fiscale parrucchiere 50×2 autoricalcante – Formato 22×9,9',
    category: 'Modulistica',
    subcategory: 'Ricevute Fiscali e Fatture',
    image: '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg',
    ean: '8023328534219',
    format: '22 x 9,9 cm',
    brand: 'Edipro',
    description:
      'Blocco fattura/ricevuta fiscale parrucchiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.',
  },
  {
    sku: 'E 5340 C',
    title: 'Blocco fattura/ricevuta fiscale generica 50×2 autoricalcante – Formato 22×14,8',
    category: 'Modulistica',
    subcategory: 'Ricevute Fiscali e Fatture',
    image: '/images/92c5e4d1-0e14-4191-8a5d-6fad90ab6ad3.jpg',
    ean: '8023328534011',
    format: '22 x 14,8 cm',
    brand: 'Edipro',
    description:
      'Blocco fattura/ricevuta fiscale generica Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.',
  },
]

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
    const skuRe = new RegExp(
      `(sku:\\s*'${p.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*\\n\\s*name:\\s*)'[^']*'`,
      'm',
    )
    if (!skuRe.test(src)) {
      console.warn(`  [catalog] SKU non trovato: ${p.sku}`)
      continue
    }
    src = src.replace(skuRe, `$1'${p.title.replace(/'/g, "\\'")}'`)

    // Ensure / replace imageUrl immediately after format (or before description)
    const blockRe = new RegExp(
      `(sku:\\s*'${p.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?)(description:\\s*)`,
      'm',
    )
    src = src.replace(blockRe, (full, before, descKey) => {
      let next = before
      if (/imageUrl:\s*'[^']*'/.test(before)) {
        next = before.replace(/imageUrl:\s*'[^']*'/, `imageUrl: '${p.image}'`)
      } else {
        next = before.replace(/\n(\s*)(description:)/, `\n$1imageUrl: '${p.image}',\n$1$2`)
        // if description already matched via descKey path:
        if (next === before) {
          return `${before}imageUrl: '${p.image}',\n    ${descKey}`
        }
      }
      if (/ean:\s*'[^']*'/.test(next)) {
        next = next.replace(/ean:\s*'[^']*'/, `ean: '${p.ean}'`)
      }
      return `${next}${descKey}`
    })
    changed += 1
  }

  writeFileSync(catalogPath, src, 'utf8')
  console.log(`OK: catalogo TS aggiornato (${changed}/${productsToUpdate.length} SKU)`)
}

function writeSqlMigration() {
  const out = path.join(root, 'supabase', 'migrations', '041_modulistica_product_images.sql')
  const lines = [
    '-- Modulistica: aggiorna immagini/metadati prodotti (generato da update-products.js)',
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
        `ean = '${esc(p.ean)}', ` +
        `description = '${esc(p.description)}' ` +
        `where sku = '${esc(p.sku)}';`,
    )
    lines.push(
      `insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock) ` +
        `select '${esc(p.sku)}', '${esc(p.title)}', 0, '${esc(p.image)}', '${esc(p.brand)}', '${esc(p.category)}', '${esc(p.subcategory)}', '${esc(p.format)}', '${esc(p.ean)}', '${esc(p.description)}', 100 ` +
        `where not exists (select 1 from public.products where sku = '${esc(p.sku)}');`,
    )
    lines.push('')
  }
  writeFileSync(out, lines.join('\n'), 'utf8')
  console.log(`OK: SQL scritto in ${path.relative(root, out)}`)
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
  const sqlRel = path.join('supabase', 'migrations', '041_modulistica_product_images.sql')
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
