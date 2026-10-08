/**
 * Genera feed Trovaprezzi (XML + CSV) in public/feeds/.
 * Prezzo = IVA inclusa; ShippingCost = regole carrello; EAN se presente.
 *
 *   npx tsx scripts/generate-trovaprezzi-feed.ts
 *   npm run generate:trovaprezzi-feed
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildGoogleMerchantFeedItems,
  resolveMerchantFeedEnv,
} from '../src/lib/googleMerchantCatalog'
import {
  mapMerchantItemToTrovaprezziOffer,
  renderTrovaprezziCsv,
  renderTrovaprezziXml,
  type TrovaprezziOffer,
} from '../src/lib/trovaprezziFeed'

async function readEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (k && !process.env[k]) process.env[k] = v
    }
  } catch {
    // missing env file is fine
  }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const env = resolveMerchantFeedEnv(process.env)
  const { items, dbCount, syntheticCount } = await buildGoogleMerchantFeedItems(env)

  const offers: TrovaprezziOffer[] = items
    .map((item) => mapMerchantItemToTrovaprezziOffer(item))
    .filter((o): o is TrovaprezziOffer => o != null)

  const withEan = offers.filter((o) => o.eanCode).length
  const freeShip = offers.filter((o) => o.shippingCost === 0).length

  const outDir = path.join(root, 'public', 'feeds')
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'trovaprezzi.xml'), renderTrovaprezziXml(offers), 'utf8')
  await writeFile(path.join(outDir, 'trovaprezzi.csv'), renderTrovaprezziCsv(offers), 'utf8')

  console.log(
    `[trovaprezzi-feed] written ${offers.length} offers (db=${dbCount}, synthetic=${syntheticCount}, ean=${withEan}, freeShip=${freeShip}) → public/feeds/trovaprezzi.xml|csv`,
  )
}

main().catch((err) => {
  console.error('[trovaprezzi-feed] generation failed:', err)
  process.exit(1)
})
