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
    '/faq',
    '/contatti',
    '/office-products',
    '/office-products?category=Cancelleria',
    '/office-products?category=Cancelleria&cancelleriaView=shopper',
    '/office-products?category=Cancelleria&cancelleriaView=shopper-carta',
    '/office-products?category=Cancelleria&cancelleriaView=shopper-plastica',
    '/office-products?category=Cancelleria&cancelleriaView=timbri',
    '/office-products?category=Cancelleria&cancelleriaView=buste',
    '/office-products?category=Modulistica',
    '/office-products?category=Modulistica&subcategory=Alberghi%20e%20Ristoranti',
    '/office-products?category=Modulistica&subcategory=Condominio%20ed%20Edilizia',
    '/office-products?category=Modulistica&subcategory=Contabilit%C3%A0%20IVA%20e%20Generale',
    '/office-products?category=Modulistica&subcategory=Magazzino%20e%20Trasporti',
    '/office-products?category=Modulistica&subcategory=Stampati%20Fiscali',
    '/office-products?category=Carta',
    '/office-products?category=Carta&subcategory=Formato%20Carta%20A4',
    '/office-products?category=Carta&subcategory=Formato%20Carta%20A3',
    '/office-products?category=Carta&subcategory=Carta%20Termica',
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
    '/politica-resi',
  ]
  const urls = [...staticUrls]
  const seen = new Set(urls)
  const excludedSkus = new Set([
    'AF-CALC-OLIB4646',
    'AF-CALC-OLIB5896',
    'AF-LEBEZ-3039',
    'AF-LEBEZ-80328',
    'AF-CALC-SHAEL1901',
    'AF-CALC-LBZ-81913',
    'AF-CALC-LBZ-81914',
    'AF-CALC-81499',
    'AF-CALC-LBZ-81917',
    'AF-CALC-80344',
    'AF-CALC-CANMP1211LTSC',
    'AF-CALC-CANP1DTSC',
    'AF-CALC-CANAS8HB',
    'AF-TOMB-60484',
    'AF-TOMB-29072',
    'AF-LEBEZ-1303',
    'AF-LEBEZ-1303B',
    'AF-PENT-105426',
    'AF-PENT-105424',
    'AF-PENT-105425',
    '3039',
    '80328',
    '1303',
    '1303B',
    '81913',
    '81914',
    '81499',
    '81917',
    '80344',
    'SHAEL1901',
    'EL1901',
    'CANAS8HB',
    'AS8HB',
    '2304C001',
    '60484',
    '29072',
    '105424',
    '105425',
    '105426',
  ])

  function isHiddenCustomerProduct(sku, name) {
    const key = String(sku ?? '')
      .trim()
      .toUpperCase()
    if (key && excludedSkus.has(key)) return true
    const last = key.split('-').pop()
    if (last && excludedSkus.has(last)) return true
    const n = String(name ?? '').toLowerCase()
    if (n.includes('floatune')) return true
    if (n.includes('fx cg50') || n.includes('fx-cg50')) return true
    if (n.includes('el1901') || n.includes('el 1901')) return true
    if (n.includes('hr-8rce') || n.includes('hr 8rce')) return true
    if (n.includes('mp-1211') || n.includes('mp 1211')) return true
    if (n.includes('p1-dtsc') || n.includes('2304c001')) return true
    if (n.includes('as8hb')) return true
    if (n.includes('mono correction') && n.includes('tombow')) return true
    if (n.includes('correttore a nastro') && n.includes('tombow') && n.includes('ricaricabile')) {
      return true
    }
    if (n.includes('barattolo matita') && n.includes('lebez')) return true
    if (n.includes('matita hb') && n.includes('lebez') && !n.includes('barattolo')) return true
    if (n.includes('calcolatrice') && n.includes('maxi') && n.includes('lebez')) return true
    if (n.includes('calcolatrice scientifica') && n.includes('lebez')) return true
    return false
  }

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
        if (isHiddenCustomerProduct(key, row?.name)) continue
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
