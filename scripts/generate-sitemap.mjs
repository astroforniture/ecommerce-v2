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

  const siteUrl = (process.env.VITE_SITE_URL || 'https://www.astroforniture.it').replace(/\/$/, '')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  const staticUrls = ['/', '/office-products', '/privacy-policy', '/cookie-policy', '/termini-condizioni-vendita']
  const urls = [...staticUrls]

  if (supabaseUrl && supabaseKey) {
    /** Allineato al catalogo shop: `public.products` (stessa tabella di `fetchOfficeProductByIdentifier`). */
    const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/products?select=id&order=id.asc`
    const res = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })
    if (res.ok) {
      const rows = await res.json()
      for (const row of rows) {
        if (row?.id) urls.push(`/product/${encodeURIComponent(String(row.id))}`)
      }
    }
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
}

generate().catch((err) => {
  console.error('[sitemap] generation failed:', err)
  process.exit(1)
})
