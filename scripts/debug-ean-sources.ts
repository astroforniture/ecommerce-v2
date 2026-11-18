import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildGoogleMerchantFeedItems,
  collectSyntheticOfficeProductsForMerchant,
  resolveMerchantFeedEnv,
} from '../src/lib/googleMerchantCatalog'
import { extractOfficeProductEan } from '../src/lib/productEan'

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
    // ok
  }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const synthetics = collectSyntheticOfficeProductsForMerchant()
  let synWithEan = 0
  const samples: Array<{ id: string; ean: string; via: string }> = []
  for (const p of synthetics) {
    const ean = extractOfficeProductEan(p)
    if (!ean) continue
    synWithEan += 1
    if (samples.length < 15) {
      samples.push({
        id: p.id,
        ean,
        via: p.ean ? 'ean' : p.mainFeatures?.EAN ? 'mainFeatures' : p.variants?.some((v) => v.ean) ? 'variants' : 'desc',
      })
    }
  }

  const env = resolveMerchantFeedEnv(process.env)
  const { items } = await buildGoogleMerchantFeedItems(env)
  const withGtin = items.filter((i) => i.gtin)
  console.log(
    JSON.stringify(
      {
        syntheticTotal: synthetics.length,
        syntheticWithEan: synWithEan,
        syntheticSamples: samples,
        merchantWithGtin: withGtin.length,
        merchantGtinSamples: withGtin.slice(0, 20).map((i) => ({ id: i.id, gtin: i.gtin })),
      },
      null,
      2,
    ),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
