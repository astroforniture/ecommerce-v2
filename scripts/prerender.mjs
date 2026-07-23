/**
 * Prerender SEO: dopo `vite build`, avvia vite preview e salva HTML completo in dist/
 * per rotte servizi, categorie, macchine e schede prodotto.
 *
 * Uso: node scripts/prerender.mjs
 * Skip: PRERENDER=0 node scripts/prerender.mjs
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const PREVIEW_PORT = Number(process.env.PRERENDER_PORT || 4173)
const PREVIEW_ORIGIN = `http://127.0.0.1:${PREVIEW_PORT}`
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 2))
const NAV_TIMEOUT_MS = Number(process.env.PRERENDER_TIMEOUT_MS || 45000)

function shouldSkip() {
  const v = String(process.env.PRERENDER ?? '1').trim().toLowerCase()
  return v === '0' || v === 'false' || v === 'off' || v === 'no'
}

async function fileExists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function readEnvFile(filePath) {
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
    // ignore
  }
}

/** Mappa URL → percorso file sotto dist (senza query → path/index.html). */
function urlToDistFile(urlPathAndQuery) {
  const u = new URL(urlPathAndQuery, 'https://www.asforniture.it')
  let pathname = decodeURIComponent(u.pathname)
  if (!pathname.startsWith('/')) pathname = `/${pathname}`
  if (pathname === '/') return path.join(distDir, 'index.html')

  const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  // Query: salva sotto prerender/ con chiave stabile (servita via rewrite Vercel)
  if (u.search && u.search.length > 1) {
    const q = u.searchParams
    const parts = [`prerender`, ...segments]
    const cat = q.get('category')
    const view = q.get('cancelleriaView')
    const sub = q.get('subcategory')
    if (cat) parts.push(`category-${slugSafe(cat)}`)
    if (view) parts.push(`view-${slugSafe(view)}`)
    if (sub) parts.push(`sub-${slugSafe(sub)}`)
    return path.join(distDir, ...parts, 'index.html')
  }

  return path.join(distDir, ...segments, 'index.html')
}

function slugSafe(s) {
  return String(s)
    .trim()
    .replace(/[<>:"|?*\\/]+/g, '-')
    .replace(/\s+/g, '-')
}

async function parseSitemapRoutes() {
  const sitemapPath = path.join(root, 'public', 'sitemap.xml')
  const alt = path.join(distDir, 'sitemap.xml')
  const src = (await fileExists(sitemapPath)) ? sitemapPath : alt
  if (!(await fileExists(src))) {
    console.warn('[prerender] sitemap.xml non trovata, uso elenco minimo')
    return [
      '/',
      '/servizi/timbri-personalizzati',
      '/servizi/noleggio-stampanti',
      '/servizi/shopper-personalizzate',
      '/servizi/biglietti-da-visita',
      '/servizi/vetrofanie',
      '/servizi/rilegature',
      '/prodotti/macchine-per-ufficio',
    ]
  }
  const xml = await readFile(src, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  const routes = []
  const seen = new Set()
  for (const loc of locs) {
    try {
      const u = new URL(loc)
      const route = `${u.pathname}${u.search}`
      // Skip legal pages opzionali? Include tutte le path SEO dal sitemap.
      if (seen.has(route)) continue
      // Evita checkout/auth se finissero in sitemap
      if (
        route.startsWith('/cart') ||
        route.startsWith('/login') ||
        route.startsWith('/admin') ||
        route.startsWith('/account')
      ) {
        continue
      }
      seen.add(route)
      routes.push(route)
    } catch {
      // ignore bad loc
    }
  }
  return routes
}

function waitForPreviewReady(proc, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`vite preview non pronto entro ${timeoutMs}ms`))
    }, timeoutMs)

    const onData = (buf) => {
      const text = buf.toString()
      if (
        text.includes('Local:') ||
        text.includes(`http://localhost:${PREVIEW_PORT}`) ||
        text.includes(`http://127.0.0.1:${PREVIEW_PORT}`)
      ) {
        clearTimeout(timer)
        resolve()
      }
    }
    proc.stdout?.on('data', onData)
    proc.stderr?.on('data', onData)
    proc.on('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`vite preview uscito con codice ${code}`))
    })
  })
}

async function startPreview() {
  const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
  const proc = spawn(
    process.execPath,
    [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort'],
    {
      cwd: root,
      env: { ...process.env, FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    },
  )
  await waitForPreviewReady(proc)
  // breve buffer per binding completo
  await new Promise((r) => setTimeout(r, 800))
  return proc
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage()
  const url = `${PREVIEW_ORIGIN}${route}`
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS })
    await page.waitForSelector('html[data-seo-ready="true"]', { timeout: NAV_TIMEOUT_MS })
    // Assicura almeno un heading nel main (contenuto reale)
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector('main h1, main h2, [data-seo-page] h1')
        return Boolean(h1 && (h1.textContent || '').trim().length > 0)
      },
      { timeout: NAV_TIMEOUT_MS },
    )
    // Lascia completare layout/iframe lazy
    await new Promise((r) => setTimeout(r, 300))
    const html = await page.content()
    const outFile = urlToDistFile(route)
    await mkdir(path.dirname(outFile), { recursive: true })
    const doc = html.trimStart().toLowerCase().startsWith('<!doctype')
      ? html
      : `<!DOCTYPE html>\n${html}`
    await writeFile(outFile, doc, 'utf8')
    return { route, outFile, ok: true }
  } catch (err) {
    return { route, ok: false, error: err instanceof Error ? err.message : String(err) }
  } finally {
    await page.close().catch(() => {})
  }
}

async function runPool(browser, routes) {
  const results = []
  let i = 0
  async function worker() {
    while (i < routes.length) {
      const idx = i++
      const route = routes[idx]
      process.stdout.write(`[prerender] (${idx + 1}/${routes.length}) ${route}\n`)
      const res = await prerenderRoute(browser, route)
      results.push(res)
      if (!res.ok) {
        console.warn(`[prerender] FAIL ${route}: ${res.error}`)
      }
    }
  }
  const workers = Array.from({ length: Math.min(CONCURRENCY, routes.length) }, () => worker())
  await Promise.all(workers)
  return results
}

async function main() {
  if (shouldSkip()) {
    console.log('[prerender] saltato (PRERENDER=0)')
    return
  }

  await readEnvFile(path.join(root, '.env'))
  await readEnvFile(path.join(root, '.env.local'))

  if (!(await fileExists(path.join(distDir, 'index.html')))) {
    throw new Error('[prerender] dist/index.html assente: esegui prima vite build')
  }

  let playwright
  try {
    playwright = await import('playwright')
  } catch {
    throw new Error(
      '[prerender] playwright non installato. Esegui: npm i -D playwright && npx playwright install chromium',
    )
  }

  const routesAll = await parseSitemapRoutes()
  const only = (process.env.PRERENDER_ONLY || '').trim()
  const max = Number(process.env.PRERENDER_MAX || 0)
  let routes = only ? routesAll.filter((r) => r === '/' || r.includes(only)) : routesAll
  if (max > 0) routes = routes.slice(0, max)
  console.log(`[prerender] ${routes.length} rotte da generare (concurrency=${CONCURRENCY})`)

  const preview = await startPreview()
  let browser
  try {
    browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    })
    const results = await runPool(browser, routes)
    const ok = results.filter((r) => r.ok).length
    const fail = results.length - ok
    console.log(`[prerender] completato: ${ok} ok, ${fail} fail`)
    if (fail > 0 && process.env.PRERENDER_STRICT === '1') {
      process.exitCode = 1
    }
  } finally {
    if (browser) await browser.close().catch(() => {})
    preview.kill('SIGTERM')
    // Windows
    try {
      preview.kill()
    } catch {
      // ignore
    }
  }
}

main().catch((err) => {
  console.error('[prerender]', err)
  process.exit(1)
})
