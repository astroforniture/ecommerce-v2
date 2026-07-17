/**
 * Genera scripts/seed-professional-instrumentation-gima.sql dal catalogo TS.
 * Esecuzione: npm run emit-professional-instrumentation-sql
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildProfessionalInstrumentationAstroMedicalOfficeProducts } from '../src/data/professionalInstrumentationAstroMedicalProducts.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const category = 'Linea Specializzata Astro Medical'

function sqlEscape(s) {
  return String(s).replace(/'/g, "''")
}

const products = buildProfessionalInstrumentationAstroMedicalOfficeProducts()
const valueRows = products.map((p) => {
  const desc = sqlEscape(`${p.description ?? p.name}`)
  return `  ('${sqlEscape(p.id)}', '${sqlEscape(p.name)}', ${p.price}, '${sqlEscape(p.imageUrl)}', '${sqlEscape(p.brand)}', '${sqlEscape(category)}', '${desc}')`
})

const sql = `-- Generato da: npm run emit-professional-instrumentation-sql
-- Bilance professionali, antropometria, plicometri, aerosol — sku = id catalogo frontend (gima-*)

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

const outPath = join(__dirname, 'seed-professional-instrumentation-gima.sql')
writeFileSync(outPath, sql, 'utf8')
console.log('Scritto', outPath, `(${products.length} articoli)`)
