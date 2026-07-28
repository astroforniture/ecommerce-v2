/**
 * Genera productsToUpdate per update-products.js dalla mappa immagini Modulistica.
 * Uso: node scripts/build-modulistica-image-products.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** SKU → path relativo pubblico (identificato dalla copertina stampata). */
export const MODULISTICA_IMAGE_BY_SKU = {
  'E 5220 G': '/images/5a2bd0c9-2438-4f03-8594-7dbc2d48802d.jpg',
  'E 5221 C': '/images/3ed3120b-c35b-4039-a941-b10b6dca6d1c.jpg',
  'E 5183': '/images/2cbbb207-0340-42bb-afd5-4217dd356ff0.jpg',
  'E 3399': '/images/0f73bb8f-8dbc-4b0a-bed3-69a6b148ad4f.jpg',
  'E 3369': '/images/67e70187-52d7-4788-bd05-54495c728c0c.jpg',
  'E 3259': '/images/80e3b5c6-de8e-4d92-bcb9-5dfe75970e79.jpg',
  'E 3406': '/images/9754b9bb-7d4e-4967-a8dd-a99dde182fe8.jpg',
  // Ricevute fiscali: mapping corretto dopo audit copertine (SKU stampato)
  'E 5340 C': '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg',
  'E 5348 C': '/images/ad8ad89c-fa28-4b8f-bee6-9be1d057cd55.jpg',
  'E 5342 C': '/images/dc4d3188-fbf5-4645-b85c-0ed980e37de4.jpg',
  'E 5349': '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg',
  'E 5356 A': '/images/92c5e4d1-0e14-4191-8a5d-6fad90ab6ad3.jpg',
  'E 5279 A': '/images/1ebf60d5-d1ba-419f-b002-50cb6aa27555.jpg',
  'E 2108': '/images/222fc477-e9ee-4642-9d17-8833d55d9f9d.jpg',
  'E 5219 CT': '/images/2534e81f-339e-4485-8400-f3367285121e.jpg',
  E4034: '/images/26586a3f-bcdc-47a9-8522-879efc5ee053.jpg',
  'E 5504 C': '/images/298dec2f-59c6-4cf3-b8a1-c27af2d613ab.jpg',
  E2649: '/images/481977de-4f37-43e5-94c5-8effefc09045.jpg',
  'E 5217 A': '/images/5138f9f1-8b53-44c2-88be-d9a573b8f19e.jpg',
  'E 5214 C': '/images/54ff20b5-7ee1-47b9-8072-0689994338d5.jpg',
  E2769: '/images/55037817-9ba0-4a46-ab8e-bd40cd82a800.jpg',
  E2172: '/images/5ba2c8ee-973b-4456-96b3-aac779f14a2c.jpg',
  E2103: '/images/5fb4c36a-99b6-415e-966e-86f40125e00d.jpg',
  'E 5215 CT': '/images/67916f2e-6c8e-4bd5-afa0-48539f0193c3.jpg',
  'E 5563 C': '/images/6a8681b7-1de7-41c7-8029-404fd446c481.jpg',
  E2656: '/images/6dd78a36-4f78-4b7f-874d-1b343db3ed31.jpg',
  E4033: '/images/718ff514-7368-4dc4-85c2-0055ca641fbf.jpg',
  'E 2104 A': '/images/792ed7ed-83b7-494d-bff4-16ac1c9d1d47.jpg',
  E2686: '/images/8016ed36-fec6-4814-9ee1-a52d9f4de98a.jpg',
  'E 5356': '/images/8ccdad5c-d9b7-4310-b271-c0044ef12a1c.jpg',
  'E 2102 A': '/images/8f0739b7-da7e-4e04-803a-4965a5e9162d.jpg',
  E2134: '/images/972d6ca2-7136-4917-91fb-facff83a4523.jpg',
  'E 5199 CT': '/images/a0d59abb-d8ad-4bb2-a129-418e1091f206.jpg',
  'E 5197 C': '/images/acd68330-ccd7-4966-a019-5e2850498133.jpg',
  E2133: '/images/b0292a0e-2440-4a32-a52a-6fcd32136524.jpg',
  'E 5209 C': '/images/b81e025a-a6f2-4666-8ecc-ec6d54009ef2.jpg',
  'E 5349 A': '/images/c2cfacd0-627a-4182-a211-497694042b2a.jpg',
  'E 2529': '/images/c3febc55-30f2-46b3-a8a9-832277f0f492.jpg',
  'E 5913': '/images/d06c153f-a63e-428c-ada0-6a10dfb17f4a.jpg',
  'E 5218 C': '/images/d24a0031-d576-4d01-85a7-5bfa004a03bf.jpg',
  'E 5275 CN': '/images/e67b1190-6a40-443a-b831-8a4fdcddcb62.jpg',
  E2117: '/images/ec49d2be-fc99-4a91-8e29-55278111be90.jpg',
  'E 5359 A': '/images/ee4bb8de-1d14-4b04-b9fd-ff408aed5277.jpg',
  'E 5350': '/images/f8291f0e-e4a5-43e8-964b-583c72260f0a.jpg',
}

/** SKU catalogo senza foto unica in public/images (usano cover hub generica). */
export const MODULISTICA_SKUS_MISSING_UNIQUE_IMAGE = [
  'E 5916',
  'E 9117',
  'E 5351',
  'E 5567 C',
  'E2666',
  'E 5196 C',
]

const SUB_LABEL = {
  MODULISTICA_SUB_ALBERGHI: 'Alberghi e Ristoranti',
  MODULISTICA_SUB_CONDOMINIO: 'Condominio ed Edilizia',
  MODULISTICA_SUB_CONTABILITA: 'Contabilità IVA e Generale',
  MODULISTICA_SUB_MAGAZZINO: 'Magazzino e Trasporti',
  MODULISTICA_SUB_STAMPATI_FISCALI: 'Stampati Fiscali',
}

function unquote(s) {
  return String(s ?? '').replace(/\\'/g, "'")
}

export function buildModulisticaImageProducts() {
  const catalog = readFileSync(path.join(root, 'src/data/modulisticaCatalog.ts'), 'utf8')
  const blocks = catalog.split(/\{\s*\n\s*sku:/).slice(1)
  const products = []

  for (const b of blocks) {
    const sku = (b.match(/^\s*'([^']+)'/) || [])[1]
    if (!sku || !MODULISTICA_IMAGE_BY_SKU[sku]) continue
    const name = unquote((b.match(/name:\s*'((?:\\'|[^'])*)'/) || [])[1])
    const subConst = (b.match(/subcategory:\s*(MODULISTICA_SUB_[A-Z_]+)/) || [])[1]
    const ean = (b.match(/ean:\s*'([^']*)'/) || [])[1] || ''
    const brand = (b.match(/brand:\s*'([^']*)'/) || [])[1] || 'Edipro'
    const format = (b.match(/format:\s*'([^']*)'/) || [])[1] || ''
    const description = unquote((b.match(/description:\s*'((?:\\'|[^'])*)'/) || [])[1] || '')
    products.push({
      sku,
      title: name,
      category: 'Modulistica',
      subcategory: SUB_LABEL[subConst] || '',
      image: MODULISTICA_IMAGE_BY_SKU[sku],
      ean,
      format,
      brand,
      description,
    })
  }
  return products
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const products = buildModulisticaImageProducts()
  const outDir = path.join(root, 'scripts', '.generated')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(path.join(outDir, 'modulistica-image-products.json'), JSON.stringify(products, null, 2))
  console.log(`OK: ${products.length} prodotti con immagine`)
  const mapped = new Set(products.map((p) => p.sku))
  const missingMap = Object.keys(MODULISTICA_IMAGE_BY_SKU).filter((s) => !mapped.has(s))
  if (missingMap.length) console.warn('SKU in mappa non trovati in catalogo:', missingMap)
}
