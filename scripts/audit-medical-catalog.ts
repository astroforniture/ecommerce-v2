/**
 * Audit read-only del catalogo sanitario / Astro Medical / GIMA.
 * Non modifica database ne file prodotto: scrive solo report.
 *
 * Uso:
 *   npx tsx scripts/audit-medical-catalog.ts
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { buildLineaAstroMedicalAllOfficeProducts } from '../src/data/lineaAstroMedicalCombined.ts'
import { gimaImageStemFromUrl } from '../src/lib/gimaImageStem.ts'
import type { OfficeProduct } from '../src/types/officeProduct.ts'

type AnomalyType =
  | 'Mismatch Immagine'
  | 'Senza Immagine'
  | 'Broken Link Immagine'
  | 'Prezzo Sospetto'
  | 'Titolo Generico/Incompleto'
  | 'SKU Mancante'
  | 'SKU Duplicato'
  | 'Nome Duplicato'
  | 'Immagine Condivisa Sospetta'

type Finding = {
  id: string
  sku: string
  title: string
  category: string
  brand: string
  subcategory: string
  price: number | null
  imageUrl: string
  imageStem: string | null
  source: 'local' | 'supabase'
  anomalies: AnomalyType[]
  notes: string[]
}

type AuditProduct = {
  id: string
  sku: string
  title: string
  category: string
  brand: string
  subcategory: string
  price: number | null
  imageUrl: string
  source: 'local' | 'supabase'
}

const GENERIC_TITLE_RE =
  /^(prodotto|articolo|test|strisce?|analizzatore|sistema|kit|dispositivo)(\s+\d+)?$/i

const STRIP_TEST_RE =
  /\b(strisce?|combi\s*screen|urilyzer|test\s+in\s+cassetta|multitest|analizzatore|screening|pt\/?inr|troponina|emoglobina|colesterolo|lattato|mission)\b/i

const DEVICE_MISMATCH_HINT_RE =
  /\b(fonendoscop|stetoscop|batterie?|varta|pile|penna|matita|carta\s+a4|shopper|toner)\b/i

function env(name: string): string {
  return String(process.env[name] ?? '').trim()
}

function extractGimaCodes(text: string): string[] {
  const out = new Set<string>()
  const lower = text.toLowerCase()
  for (const m of lower.matchAll(/\bgima[-\s]?(\d{4,6}(?:-\d{1,3})?)\b/g)) {
    if (m[1]) out.add(m[1])
  }
  for (const m of lower.matchAll(/\b(?:cod(?:ice)?\.?\s*)?(\d{5})(?:\b|[^\d])/g)) {
    if (m[1]) out.add(m[1])
  }
  for (const m of lower.matchAll(/\b(\d{5}-\d{1,3})\b/g)) {
    if (m[1]) out.add(m[1])
  }
  return [...out]
}

function normalizeSku(p: AuditProduct): string {
  return (p.sku || p.id || '').trim()
}

function tokenizeName(name: string): Set<string> {
  return new Set(
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 4),
  )
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter += 1
  return inter / (a.size + b.size - inter)
}

function toAuditProduct(p: OfficeProduct, source: 'local' | 'supabase'): AuditProduct {
  return {
    id: String(p.id ?? '').trim(),
    sku: String(p.producerCode ?? p.id ?? '').trim(),
    title: String(p.name ?? '').trim(),
    category: String(p.category ?? '').trim(),
    brand: String(p.brand ?? '').trim(),
    subcategory: String(p.subcategory ?? '').trim(),
    price: typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : null,
    imageUrl: String(p.imageUrl ?? '').trim(),
    source,
  }
}

async function fetchSupabaseMedical(): Promise<AuditProduct[]> {
  const url = env('VITE_SUPABASE_URL')
  const key = env('SUPABASE_SERVICE_ROLE_KEY') || env('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const patterns = [
    '%medical%',
    '%gima%',
    '%diagnost%',
    '%Astro Medical%',
    '%Linea Specializzata%',
  ]

  const byId = new Map<string, AuditProduct>()
  for (const pattern of patterns) {
    const { data, error } = await supabase
      .from('products')
      .select('id, sku, name, brand, category, subcategory, price, image_url')
      .or(
        `category.ilike.${pattern},brand.ilike.%gima%,name.ilike.%gima%,subcategory.ilike.${pattern}`,
      )
      .limit(2000)

    if (error) {
      console.warn('[audit] supabase query failed:', pattern, error.message)
      continue
    }
    for (const row of data ?? []) {
      const id = String(row.id ?? '').trim()
      if (!id || byId.has(id)) continue
      byId.set(id, {
        id,
        sku: String(row.sku ?? id).trim(),
        title: String(row.name ?? '').trim(),
        category: String(row.category ?? '').trim(),
        brand: String(row.brand ?? '').trim(),
        subcategory: String(row.subcategory ?? '').trim(),
        price:
          typeof row.price === 'number' && Number.isFinite(row.price) ? row.price : null,
        imageUrl: String(row.image_url ?? '').trim(),
        source: 'supabase',
      })
    }
  }
  return [...byId.values()]
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i
      i += 1
      results[idx] = await fn(items[idx]!)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()))
  return results
}

async function checkImageStatus(
  url: string,
): Promise<'ok' | 'broken' | 'skip'> {
  if (!url) return 'skip'
  // Path locali del sito (public/) — non verificabili via HTTP dallo script.
  if (url.startsWith('/') || url.startsWith('./')) return 'skip'
  if (!/^https?:\/\//i.test(url)) return 'broken'
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (res.ok) return 'ok'
    // alcuni CDN rifiutano HEAD
    if (res.status === 405 || res.status === 403) {
      const getRes = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      })
      return getRes.ok || getRes.status === 206 ? 'ok' : 'broken'
    }
    return 'broken'
  } catch {
    return 'broken'
  }
}

function detectLocalAnomalies(
  products: AuditProduct[],
): Map<string, { anomalies: AnomalyType[]; notes: string[] }> {
  const out = new Map<string, { anomalies: AnomalyType[]; notes: string[] }>()
  const ensure = (id: string) => {
    if (!out.has(id)) out.set(id, { anomalies: [], notes: [] })
    return out.get(id)!
  }
  const push = (id: string, type: AnomalyType, note: string) => {
    const row = ensure(id)
    if (!row.anomalies.includes(type)) row.anomalies.push(type)
    row.notes.push(note)
  }

  const bySku = new Map<string, AuditProduct[]>()
  const byName = new Map<string, AuditProduct[]>()
  const byImage = new Map<string, AuditProduct[]>()

  for (const p of products) {
    const skuKey = normalizeSku(p).toLowerCase()
    const nameKey = p.title.trim().toLowerCase()
    if (skuKey) {
      const list = bySku.get(skuKey) ?? []
      list.push(p)
      bySku.set(skuKey, list)
    }
    if (nameKey) {
      const list = byName.get(nameKey) ?? []
      list.push(p)
      byName.set(nameKey, list)
    }
    if (p.imageUrl) {
      const list = byImage.get(p.imageUrl) ?? []
      list.push(p)
      byImage.set(p.imageUrl, list)
    }
  }

  for (const [, group] of bySku) {
    if (group.length < 2) continue
    const sources = new Set(group.map((g) => g.source))
    // stesso SKU su local+supabase con stesso id non e duplicato vero
    const uniqueIds = new Set(group.map((g) => g.id))
    if (uniqueIds.size < 2 && sources.size <= 2) continue
    if (uniqueIds.size >= 2) {
      for (const p of group) {
        push(
          `${p.source}:${p.id}`,
          'SKU Duplicato',
          `SKU/id ripetuto su ${uniqueIds.size} record: ${[...uniqueIds].join(', ')}`,
        )
      }
    }
  }

  for (const [, group] of byName) {
    const uniqueIds = new Set(group.map((g) => g.id))
    if (uniqueIds.size < 2) continue
    for (const p of group) {
      push(
        `${p.source}:${p.id}`,
        'Nome Duplicato',
        `Stesso titolo su ID diversi: ${[...uniqueIds].slice(0, 8).join(', ')}`,
      )
    }
  }

  for (const [imageUrl, group] of byImage) {
    if (group.length < 2) continue
    const names = group.map((g) => tokenizeName(g.title))
    let suspicious = false
    for (let i = 0; i < names.length; i += 1) {
      for (let j = i + 1; j < names.length; j += 1) {
        if (jaccard(names[i]!, names[j]!) < 0.15) {
          suspicious = true
          break
        }
      }
      if (suspicious) break
    }
    if (!suspicious) continue
    for (const p of group) {
      push(
        `${p.source}:${p.id}`,
        'Immagine Condivisa Sospetta',
        `URL condiviso da ${group.length} titoli dissimili (es. ${group
          .map((g) => g.title)
          .slice(0, 3)
          .join(' | ')})`,
      )
    }
    void imageUrl
  }

  for (const p of products) {
    const key = `${p.source}:${p.id}`
    if (!p.imageUrl) {
      push(key, 'Senza Immagine', 'imageUrl vuoto')
    }

    if (!p.sku || p.sku === p.id && !/[0-9]{4,}/.test(p.sku)) {
      // soft: many local products use gima-id as sku - only flag if completely empty
    }
    if (!String(p.sku || '').trim()) {
      push(key, 'SKU Mancante', 'SKU/producerCode assente')
    }

    if (p.price == null) {
      push(key, 'Prezzo Sospetto', 'Prezzo assente')
    } else if (p.price <= 0) {
      push(key, 'Prezzo Sospetto', `Prezzo <= 0 (${p.price})`)
    } else if (p.price > 20000) {
      push(key, 'Prezzo Sospetto', `Prezzo molto alto (${p.price} EUR imponibile)`)
    } else if (p.price < 0.2) {
      push(key, 'Prezzo Sospetto', `Prezzo molto basso (${p.price} EUR imponibile)`)
    }

    const title = p.title.trim()
    if (!title || title.length < 8 || GENERIC_TITLE_RE.test(title)) {
      push(key, 'Titolo Generico/Incompleto', `Titolo corto o generico: "${title}"`)
    }

    const stem = gimaImageStemFromUrl(p.imageUrl)
    const codesFromText = extractGimaCodes(`${p.title} ${p.sku} ${p.id}`)
    if (stem && codesFromText.length > 0) {
      const stemBase = stem.split('-')[0] ?? stem
      const match = codesFromText.some((c) => {
        const base = c.split('-')[0] ?? c
        return c === stem || base === stemBase || stem.startsWith(base) || c.startsWith(stemBase)
      })
      if (!match) {
        push(
          key,
          'Mismatch Immagine',
          `Codice nel titolo/SKU (${codesFromText.join(', ')}) diverso dallo stem immagine (${stem})`,
        )
      }
    }

    // Heuristica: articoli "strisce/test/analizzatore" con hint testuali di oggetti non sanitari nel titolo
    // (raro) oppure stem immagine tipicamente usato da linee non diagnostiche quando il titolo e diagnostico.
    if (STRIP_TEST_RE.test(title) && DEVICE_MISMATCH_HINT_RE.test(title)) {
      push(
        key,
        'Mismatch Immagine',
        'Titolo mescola termini diagnostici con oggetti non pertinenti (fonendo/batterie/ecc.)',
      )
    }

    // Placeholder / range noti da anomalie passate (urine/combi fantasma 32xxx inventati)
    if (stem && /^(32100|32200|32300|3241[0-5])$/.test(stem)) {
      push(
        key,
        'Mismatch Immagine',
        `Stem immagine ${stem} nella lista storica asset fantasma (urine/Combi Screen)`,
      )
    }
  }

  return out
}

function renderMarkdown(
  findings: Finding[],
  totals: { scanned: number; local: number; supabase: number; withIssues: number },
): string {
  const byType = new Map<string, number>()
  for (const f of findings) {
    for (const a of f.anomalies) byType.set(a, (byType.get(a) ?? 0) + 1)
  }

  const lines: string[] = []
  lines.push('# Audit catalogo materiale sanitario / Astro Medical')
  lines.push('')
  lines.push(`Generato: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('> Report **read-only**: nessuna modifica a DB o file prodotto.')
  lines.push('')
  lines.push('## Riepilogo')
  lines.push('')
  lines.push(`- Prodotti scansionati: **${totals.scanned}** (locali: ${totals.local}, Supabase: ${totals.supabase})`)
  lines.push(`- Prodotti con almeno un'anomalia: **${totals.withIssues}**`)
  lines.push('')
  lines.push('### Conteggio per tipo')
  lines.push('')
  lines.push('| Tipo anomalia | Occorrenze |')
  lines.push('|---|---:|')
  for (const [type, n] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${type} | ${n} |`)
  }
  lines.push('')
  lines.push('## Dettaglio anomalie')
  lines.push('')
  lines.push('| ID / SKU | Titolo | Categoria / Brand | URL immagine | Anomalie | Note |')
  lines.push('|---|---|---|---|---|---|')

  for (const f of findings) {
    const idSku = `${f.id}${f.sku && f.sku !== f.id ? ` / ${f.sku}` : ''}`
    const catBrand = `${f.category || '-'}${f.subcategory ? ` > ${f.subcategory}` : ''} / ${f.brand || '-'}`
    const img = f.imageUrl ? f.imageUrl.replace(/\|/g, '%7C') : '(vuoto)'
    const anomalies = f.anomalies.join('; ')
    const notes = f.notes.join('  ').replace(/\|/g, '/')
    lines.push(
      `| \`${idSku}\` | ${f.title.replace(/\|/g, '/')} | ${catBrand.replace(/\|/g, '/')} | ${img} | ${anomalies} | ${notes} |`,
    )
  }

  lines.push('')
  lines.push('## Come usare questo report')
  lines.push('')
  lines.push('1. Filtra prima le righe **Mismatch Immagine** e **Immagine Condivisa Sospetta**.')
  lines.push('2. Verifica a occhio URL Gima vs titolo.')
  lines.push('3. Solo dopo decisione condivisa: correzione immagine / hide / delete.')
  lines.push('')
  return lines.join('\n')
}

async function main() {
  console.log('[audit] Carico catalogo locale Astro Medical...')
  const local = buildLineaAstroMedicalAllOfficeProducts().map((p) => toAuditProduct(p, 'local'))
  console.log(`[audit] Locali: ${local.length}`)

  console.log('[audit] Provo fetch Supabase (se credenziali presenti)...')
  const remote = await fetchSupabaseMedical()
  console.log(`[audit] Supabase: ${remote.length}`)

  const merged = new Map<string, AuditProduct>()
  for (const p of local) merged.set(`local:${p.id}`, p)
  for (const p of remote) merged.set(`supabase:${p.id}`, p)
  const products = [...merged.values()]

  const anomalyMap = detectLocalAnomalies(products)

  console.log('[audit] Verifica HTTP immagini (HEAD/GET) sui prodotti con URL...')
  const withImages = products.filter((p) => p.imageUrl)
  const statuses = await mapPool(withImages, 12, async (p) => ({
    key: `${p.source}:${p.id}`,
    status: await checkImageStatus(p.imageUrl),
  }))
  for (const s of statuses) {
    if (s.status !== 'broken') continue
    const row = anomalyMap.get(s.key) ?? { anomalies: [], notes: [] }
    if (!row.anomalies.includes('Broken Link Immagine')) {
      row.anomalies.push('Broken Link Immagine')
    }
    row.notes.push('URL immagine non raggiungibile (HEAD/GET fallito)')
    anomalyMap.set(s.key, row)
  }

  const findings: Finding[] = []
  for (const p of products) {
    const key = `${p.source}:${p.id}`
    const hit = anomalyMap.get(key)
    if (!hit || hit.anomalies.length === 0) continue
    findings.push({
      id: p.id,
      sku: p.sku,
      title: p.title,
      category: p.category,
      brand: p.brand,
      subcategory: p.subcategory,
      price: p.price,
      imageUrl: p.imageUrl,
      imageStem: gimaImageStemFromUrl(p.imageUrl),
      source: p.source,
      anomalies: hit.anomalies,
      notes: hit.notes,
    })
  }

  findings.sort((a, b) => {
    const rank = (f: Finding) =>
      (f.anomalies.includes('Mismatch Immagine') ? 0 : 10) +
      (f.anomalies.includes('Broken Link Immagine') ? 1 : 10) +
      (f.anomalies.includes('Immagine Condivisa Sospetta') ? 2 : 10)
    return rank(a) - rank(b) || a.title.localeCompare(b.title, 'it')
  })

  const totals = {
    scanned: products.length,
    local: local.length,
    supabase: remote.length,
    withIssues: findings.length,
  }

  const mdPath = resolve(process.cwd(), 'audit_materiale_sanitario.md')
  const jsonPath = resolve(process.cwd(), 'audit_prodotti.json')
  writeFileSync(mdPath, renderMarkdown(findings, totals), 'utf8')
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        readOnly: true,
        totals,
        findings,
      },
      null,
      2,
    ),
    'utf8',
  )

  console.log(`[audit] Report MD: ${mdPath}`)
  console.log(`[audit] Report JSON: ${jsonPath}`)
  console.log(`[audit] Anomalie: ${findings.length} / ${products.length}`)
  const byType = new Map<string, number>()
  for (const f of findings) {
    for (const a of f.anomalies) byType.set(a, (byType.get(a) ?? 0) + 1)
  }
  for (const [k, v] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${k}: ${v}`)
  }
}

main().catch((err) => {
  console.error('[audit] failed:', err)
  process.exit(1)
})
