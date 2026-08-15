/**
 * Genera public/feeds/google-merchant-feed.xml al build/deploy.
 *
 * Uso:
 *   npx tsx scripts/generate-google-merchant-feed.ts
 *   npm run generate:merchant-feed
 *
 * Merchant Center scheduled fetch:
 *   https://www.asforniture.it/feeds/google-merchant-feed.xml
 *   https://www.asforniture.it/api/google-merchant-feed
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildGoogleMerchantFeedXml,
  resolveMerchantFeedEnv,
} from '../src/lib/googleMerchantCatalog'

async function readEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[k]) process.env[k] = v
    }
  } catch {
    // missing env file is fine
  }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const { xml, items, dbCount, syntheticCount } = await buildGoogleMerchantFeedXml(
    resolveMerchantFeedEnv(process.env),
  )
  const outDir = path.join(root, 'public', 'feeds')
  await mkdir(outDir, { recursive: true })
  const outFile = path.join(outDir, 'google-merchant-feed.xml')
  await writeFile(outFile, xml, 'utf8')

  console.log(
    `[merchant-feed] written ${items.length} items ? public/feeds/google-merchant-feed.xml (db=${dbCount}, synthetic=${syntheticCount})`,
  )
}

main().catch((err) => {
  console.error('[merchant-feed] generation failed:', err)
  process.exit(1)
})
