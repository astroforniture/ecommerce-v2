/**
 * Genera scripts/seed-surgical-instruments-gima.sql dal catalogo TS.
 * Esecuzione: node scripts/emit-surgical-instruments-sql.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const category = 'Linea Specializzata Astro Medical'

const rows = [
  ['gima-26580', 'BACINELLA RENIFORME INOX 162x77x31 mm — GIMA 26580', 3.5, '26580.jpg', 'Gima'],
  ['gima-26581', 'BACINELLA RENIFORME INOX 207x98x39 mm — GIMA 26581', 6, '26581.jpg', 'Gima'],
  ['gima-26495-90x150', 'TELO CHIRURGICO 90×150 cm — GIMA 26495', 11, '26495-97.jpg', 'Gima'],
  ['gima-26496-150x150', 'TELO CHIRURGICO 150×150 cm — GIMA 26496', 12, '26495-97.jpg', 'Gima'],
  ['gima-26760', 'TROUSSE FERRI STANDARD — nylon 9 strumenti — GIMA 26760', 62, '26760.jpg', 'Gima'],
  ['gima-26761', 'TROUSSE FERRI CLASSICA — nylon 10 strumenti — GIMA 26761', 72, '26761.jpg', 'Gima'],
  ['gima-26762', 'TROUSSE FERRI SUPREMA — nylon 11 strumenti — GIMA 26762', 82, '26762.jpg', 'Gima'],
  ['gima-26768', 'TROUSSE FERRI SUPREMA — scatola alluminio 11 strumenti — GIMA 26768', 89, '26768.jpg', 'Gima'],
  ['gima-39101', 'FORBICI IRIS SOTTILI AESCULAP BC110R — 11 cm — GIMA 39101', 82, '39101.jpg', 'Aesculap'],
  ['gima-39102', 'FORBICI IRIDECTOMIA E LEGATURE AESCULAP BC111R — 11 cm — GIMA 39102', 82, '39102.jpg', 'Aesculap'],
  ['gima-39110', 'FORBICI CHIRURGICHE AESCULAP BC314R — smusse 14,5 cm — GIMA 39110', 71, '39110.jpg', 'Aesculap'],
  ['gima-39111', 'FORBICI CHIRURGICHE AESCULAP BC315R — smusse 15 cm — GIMA 39111', 72, '39111.jpg', 'Aesculap'],
  ['gima-39114', 'FORBICI CHIRURGICHE AESCULAP BC324R — alterne 14,5 cm — GIMA 39114', 74, '39114.jpg', 'Aesculap'],
  ['gima-39115', 'FORBICI CHIRURGICHE AESCULAP BC326R — alterne 16,5 cm — GIMA 39115', 79, '39115.jpg', 'Aesculap'],
  ['gima-39120', 'FORBICI MAYO AESCULAP BC545R — 15,5 cm — GIMA 39120', 74, '39120.jpg', 'Aesculap'],
  ['gima-39121', 'FORBICI MAYO AESCULAP BC555R — curve 15,5 cm — GIMA 39121', 75, '39121.jpg', 'Aesculap'],
  ['gima-39122', 'FORBICI MAYO AESCULAP BC584R — 16,5 cm — GIMA 39122', 77, '39122.jpg', 'Aesculap'],
  ['gima-39123', 'FORBICI MAYO DISSEZIONE AESCULAP BC587R — curve 16,5 cm — GIMA 39123', 78, '39123.jpg', 'Aesculap'],
  ['gima-39130', 'FORBICI METZENBAUM AESCULAP BC601R — 14,5 cm — GIMA 39130', 76, '39130.jpg', 'Aesculap'],
  ['gima-39131', 'FORBICI METZENBAUM AESCULAP BC602R — 18 cm — GIMA 39131', 81, '39131.jpg', 'Aesculap'],
  ['gima-39132', 'FORBICI METZENBAUM AESCULAP BC605R — curve 14,5 cm — GIMA 39132', 78, '39132.jpg', 'Aesculap'],
  ['gima-39133', 'FORBICI METZENBAUM AESCULAP BC606R — curve 18 cm — GIMA 39133', 83, '39133.jpg', 'Aesculap'],
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

const sql = `-- Generato da: node scripts/emit-surgical-instruments-sql.mjs
-- Strumentario chirurgico GIMA / Aesculap — sku = id catalogo frontend (gima-*)

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

const outPath = join(__dirname, 'seed-surgical-instruments-gima.sql')
writeFileSync(outPath, sql, 'utf8')
console.log('Scritto', outPath, `(${rows.length} articoli)`)
