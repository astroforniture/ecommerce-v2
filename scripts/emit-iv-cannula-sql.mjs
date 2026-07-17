/**
 * Genera scripts/seed-iv-cannula-gima.sql dal catalogo IV/cannule.
 * Esecuzione: node scripts/emit-iv-cannula-sql.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const category = 'Linea Specializzata Astro Medical'

const rows = [
  ['gima-23662', 'CATETERE IV INTROCAN SAFETY B-BRAUN 18G 45 mm — sterile — GIMA 23662', 193, '23662.jpg', 'B.Braun'],
  ['gima-23663', 'CATETERE IV INTROCAN SAFETY B-BRAUN 20G 32 mm — sterile — GIMA 23663', 193, '23663.jpg', 'B.Braun'],
  ['gima-23664', 'CATETERE IV INTROCAN SAFETY B-BRAUN 22G 25 mm — sterile — GIMA 23664', 193, '23664.jpg', 'B.Braun'],
  ['gima-23705', 'AGHI BD QUINCKE 18G — 1,2×90 mm — rosa — GIMA 23705', 39.9, '23705.jpg', 'BD'],
  ['gima-23707', 'AGHI BD QUINCKE 20G — 0,9×90 mm — giallo — GIMA 23707', 39.9, '23707.jpg', 'BD'],
  ['gima-23709', 'AGHI BD QUINCKE 22G — 0,7×90 mm — nero — GIMA 23709', 39.9, '23709.jpg', 'BD'],
  ['gima-23712', 'AGO CANNULA BD VENFLON PRO SAFETY 18G 32 mm — sterile — GIMA 23712', 66.5, '23712.jpg', 'BD'],
  ['gima-23713', 'AGO CANNULA BD VENFLON PRO SAFETY 20G 32 mm — sterile — GIMA 23713', 66.5, '23713.jpg', 'BD'],
  ['gima-23714', 'AGO CANNULA BD VENFLON PRO SAFETY 22G 25 mm — sterile — GIMA 23714', 66.5, '23714.jpg', 'BD'],
  ['gima-23716', 'AGO CANNULA BD VENFLON 20G 32 mm — sterile — GIMA 23716', 33.2, '23716.jpg', 'BD'],
  ['gima-23717', 'AGO CANNULA BD VENFLON 22G 25 mm — sterile — GIMA 23717', 33.2, '23717.jpg', 'BD'],
  ['gima-23733', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 18G 45 mm — sterile — GIMA 23733', 90, '23733.jpg', 'B.Braun'],
  ['gima-23734', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 20G 33 mm — sterile — GIMA 23734', 90, '23734.jpg', 'B.Braun'],
]

function sqlEscape(s) {
  return String(s).replace(/'/g, "''")
}

const gimaBase = 'https://www.gimaitaly.com/images/prodotti/medium/'

const valueRows = rows.map(([sku, name, price, img, brand]) => {
  const imageUrl = `${gimaBase}${img}`
  const desc = `${name}. Prezzo unitario imponibile IVA esclusa.`
  return `  ('${sqlEscape(sku)}', '${sqlEscape(name)}', ${price}, '${sqlEscape(imageUrl)}', '${sqlEscape(brand)}', '${sqlEscape(category)}', '${sqlEscape(desc)}')`
})

const sql = `-- Generato da: node scripts/emit-iv-cannula-sql.mjs
-- Aghi, cateteri IV e cannule — sku = id catalogo frontend (gima-*)

INSERT INTO public.products (sku, name, price, image_url, brand, category, description)
VALUES
${valueRows.join(',\n')}
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  description = EXCLUDED.description;
`

const outPath = join(__dirname, 'seed-iv-cannula-gima.sql')
writeFileSync(outPath, sql, 'utf8')
console.log('Scritto', outPath, `(${rows.length} articoli)`)
