/**
 * Legge scripts/legacy-office-catalog.seed.json e scrive scripts/seed-public-products.sql
 * Esecuzione: node scripts/emit-public-products-sql.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function sqlEscape(s) {
  return String(s).replace(/'/g, "''")
}

const raw = readFileSync(join(__dirname, 'legacy-office-catalog.seed.json'), 'utf8')
const seeds = JSON.parse(raw)

const header = `-- Generato da: node scripts/emit-public-products-sql.mjs
-- Fonte: scripts/legacy-office-catalog.seed.json
--
-- Prodotto "ufficiali" da migration: STL2005 (005), STL7413 (007).
-- Righe DEMO-*: esempi da catalogo di sviluppo (non c'era un array mock nel codice TS).
--
-- Opzionale — copia tutto ciò che hai ancora in office_products:
-- INSERT INTO public.products (id, sku, name, price, image_url)
-- SELECT
--   op.id::text,
--   COALESCE(NULLIF(trim(op.sku), ''), op.id::text),
--   op.name,
--   op.price,
--   NULLIF(trim(op.image_url), '')
-- FROM public.office_products op
-- ON CONFLICT (id) DO UPDATE SET
--   sku = EXCLUDED.sku,
--   name = EXCLUDED.name,
--   price = EXCLUDED.price,
--   image_url = EXCLUDED.image_url;
-- (Adatta i nomi colonna se il tuo schema usa producer_code al posto di sku, ecc.)

`

const valueRows = seeds.map((p) => {
  const priceSql =
    p.price === null || p.price === undefined || p.price === ''
      ? 'NULL'
      : Number(p.price)
  const img =
    p.image_url && String(p.image_url).trim() !== ''
      ? `'${sqlEscape(p.image_url)}'`
      : 'NULL'
  return `  ('${sqlEscape(p.id)}', '${sqlEscape(p.sku)}', '${sqlEscape(p.name)}', ${priceSql}, ${img})`
})

const sql =
  header +
  `INSERT INTO public.products (id, sku, name, price, image_url)
VALUES
${valueRows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;
`

const outPath = join(__dirname, 'seed-public-products.sql')
writeFileSync(outPath, sql, 'utf8')
console.log('Scritto', outPath)
