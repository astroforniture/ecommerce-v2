import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

async function readEnvFile(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8')
    const lines = raw.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [k, ...rest] = trimmed.split('=')
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[k]) process.env[k] = v
    }
  } catch {
    // ignore missing env file
  }
}

function xmlEscape(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function generate() {
  const root = process.cwd()
  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  const siteUrl = (process.env.VITE_SITE_URL || 'https://www.asforniture.it').replace(/\/$/, '')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  const staticUrls = [
    '/',
    '/home',
    '/office-products',
    '/office-products?category=Cancelleria',
    '/office-products?category=Cancelleria&cancelleriaView=shopper',
    '/office-products?category=Cancelleria&cancelleriaView=shopper-carta',
    '/office-products?category=Cancelleria&cancelleriaView=shopper-plastica',
    '/office-products?category=Cancelleria&cancelleriaView=timbri',
    '/office-products?category=Carta',
    '/office-products?category=Archivio',
    '/prodotti/macchine-per-ufficio',
    '/prodotti/macchine-per-ufficio/casse-ditron',
    '/prodotti/macchine-per-ufficio/distruggi-documenti',
    '/prodotti/macchine-per-ufficio/etichettatrici',
    '/servizi/rilegature',
    '/servizi/timbri-personalizzati',
    '/servizi/noleggio-stampanti',
    '/servizi/shopper-personalizzate',
    '/servizi/biglietti-da-visita',
    '/servizi/vetrofanie',
    '/privacy-policy',
    '/cookie-policy',
    '/termini-condizioni-vendita',
  ]
  const urls = [...staticUrls]
  const seen = new Set(urls)

  if (supabaseUrl && supabaseKey) {
    /** Allineato al catalogo shop: URL canonici `/prodotti/:slug`. */
    const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/products?select=id,sku,name&order=id.asc`
    const res = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })
    if (res.ok) {
      const rows = await res.json()
      for (const row of rows) {
        const key = String(row?.sku ?? row?.id ?? '').trim()
        if (!key) continue
        const nameSlug = String(row?.name ?? '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 80)
        const segment = nameSlug ? `${nameSlug}--${key}` : key
        const u = `/prodotti/${encodeURIComponent(segment)}`
        if (seen.has(u)) continue
        seen.add(u)
        urls.push(u)
      }
    } else {
      console.warn('[sitemap] products fetch failed:', res.status, await res.text().catch(() => ''))
    }
  } else {
    console.warn('[sitemap] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY mancanti: solo URL statici')
  }

  const today = new Date().toISOString()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${u}`)}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  const outDir = path.join(root, 'public')
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'sitemap.xml'), xml, 'utf8')
  console.log(`[sitemap] written ${urls.length} URLs → public/sitemap.xml (${siteUrl})`)
}

generate().catch((err) => {
  console.error('[sitemap] generation failed:', err)
  process.exit(1)
})
