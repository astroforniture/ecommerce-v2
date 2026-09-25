/**
 * Genera feed Trovaprezzi (XML + CSV) in public/feeds/.
 * Prezzo = IVA inclusa.
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
    .map((item) => {
      const priceNum = Number.parseFloat(item.price.replace(/[^\d.]/g, ''))
      if (!Number.isFinite(priceNum) || priceNum <= 0) return null
      return {
        code: item.id,
        name: item.title,
        description: item.description,
        price: priceNum,
        priceFormatted: priceNum.toFixed(2).replace('.', ','),
        link: item.link,
        image: item.image_link,
        brand: item.brand,
        categories: item.product_type || 'Cancelleria',
        shippingCost: 0,
        availability: (item.availability === 'in_stock' ? '1' : '0') as '1' | '0',
        vatPercent: 22,
      }
    })
    .filter((o): o is TrovaprezziOffer => o != null)

  const outDir = path.join(root, 'public', 'feeds')
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'trovaprezzi.xml'), renderTrovaprezziXml(offers), 'utf8')
  await writeFile(path.join(outDir, 'trovaprezzi.csv'), renderTrovaprezziCsv(offers), 'utf8')

  console.log(
    `[trovaprezzi-feed] written ${offers.length} offers (db=${dbCount}, synthetic=${syntheticCount}) ? public/feeds/trovaprezzi.xml|csv`,
  )
}

main().catch((err) => {
  console.error('[trovaprezzi-feed] generation failed:', err)
  process.exit(1)
})
